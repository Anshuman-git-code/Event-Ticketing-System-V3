import json
import boto3
import os
import uuid

from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")

events_table = dynamodb.Table(os.environ["EVENTS_TABLE"])

registrations_table = dynamodb.Table(
    os.environ["REGISTRATIONS_TABLE"]
)


def lambda_handler(event, context):
    try:

        event_id = event["pathParameters"]["eventId"]

        attendee_id = "demo-attendee"

        # Check if event exists
        event_response = events_table.get_item(
            Key={
                "eventId": event_id
            }
        )

        event_item = event_response.get("Item")

        if not event_item:
            return {
                "statusCode": 404,
                "body": json.dumps({
                    "message": "Event not found"
                }),
            }

        # Check for duplicate registration
        existing_registrations = registrations_table.query(
            IndexName="AttendeeRegistrations",
            KeyConditionExpression=Key("attendeeId").eq(attendee_id)
        )

        for registration in existing_registrations.get("Items", []):

            if registration["eventId"] == event_id:

                return {
                    "statusCode": 409,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": json.dumps({
                        "message": "Already registered"
                    }),
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

        registrations_table.put_item(
            Item=registration
        )

        return {
            "statusCode": 201,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "registrationId": registration_id,
                "status": "REGISTERED"
            }),
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": str(e)
            }),
        }