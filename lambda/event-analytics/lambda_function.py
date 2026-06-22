import json
import boto3

from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")

registrations_table = dynamodb.Table("event-ticketing-v3-registrations")
tickets_table = dynamodb.Table("event-ticketing-v3-tickets")


def lambda_handler(event, context):
    try:
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
