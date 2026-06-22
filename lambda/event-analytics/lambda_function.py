import json
import os
import boto3

from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")

registrations_table = dynamodb.Table(os.environ["REGISTRATIONS_TABLE"])
tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])


def lambda_handler(event, context):
    try:
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        groups = claims.get("cognito:groups", "")
        if "Organizers" not in groups:
            return {
                "statusCode": 403,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Only organizers can view analytics"}),
            }

        event_id = event["pathParameters"]["eventId"]

        registrations = registrations_table.query(
            IndexName="EventRegistrations",
            KeyConditionExpression=Key("eventId").eq(event_id),
        )["Items"]

        tickets = tickets_table.query(
            IndexName="EventTickets",
            KeyConditionExpression=Key("eventId").eq(event_id),
        )["Items"]

        tickets_used = len([t for t in tickets if t.get("ticketStatus") == "USED"])

        attendance_rate = 0
        if len(tickets) > 0:
            attendance_rate = round((tickets_used / len(tickets)) * 100, 2)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "eventId": event_id,
                    "registrations": len(registrations),
                    "ticketsIssued": len(tickets),
                    "ticketsUsed": tickets_used,
                    "attendanceRate": attendance_rate,
                }
            ),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
