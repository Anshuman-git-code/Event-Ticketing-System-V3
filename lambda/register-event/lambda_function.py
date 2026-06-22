import json
import boto3
import os
import uuid

from datetime import datetime
from boto3.dynamodb.conditions import Key

events_client = boto3.client("events")

dynamodb = boto3.resource("dynamodb")

events_table = dynamodb.Table(os.environ["EVENTS_TABLE"])

registrations_table = dynamodb.Table(os.environ["REGISTRATIONS_TABLE"])


def lambda_handler(event, context):
    try:
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        groups = claims.get("cognito:groups", "")
        if "Attendees" not in groups:
            return {
                "statusCode": 403,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Only attendees can register for events"}),
            }

        event_id = event["pathParameters"]["eventId"]

        attendee_id = claims["sub"]

        # Verify event exists
        event_response = events_table.get_item(Key={"eventId": event_id})

        event_item = event_response.get("Item")

        if not event_item:
            return {
                "statusCode": 404,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Event not found"}),
            }

        # Prevent duplicate registration
        existing_registrations = registrations_table.query(
            IndexName="AttendeeRegistrations",
            KeyConditionExpression=Key("attendeeId").eq(attendee_id),
        )

        for registration in existing_registrations.get("Items", []):
            if registration["eventId"] == event_id:
                return {
                    "statusCode": 409,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"message": "Already registered"}),
                }

        # Create registration
        registration_id = "reg_" + uuid.uuid4().hex[:8]

        registration = {
            "registrationId": registration_id,
            "eventId": event_id,
            "attendeeId": attendee_id,
            "status": "REGISTERED",
            "registeredAt": datetime.utcnow().isoformat(),
        }

        registrations_table.put_item(Item=registration)

        # Publish EventBridge event
        event_response = events_client.put_events(
            Entries=[
                {
                    "Source": "event-ticketing.registration",
                    "DetailType": "RegistrationCreated",
                    "Detail": json.dumps(
                        {
                            "registrationId": registration_id,
                            "eventId": event_id,
                            "attendeeId": attendee_id,
                            "registeredAt": registration["registeredAt"],
                        }
                    ),
                }
            ]
        )

        if event_response["FailedEntryCount"] > 0:
            raise Exception("Failed to publish RegistrationCreated event")

        return {
            "statusCode": 201,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {"registrationId": registration_id, "status": "REGISTERED"}
            ),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)}),
        }
