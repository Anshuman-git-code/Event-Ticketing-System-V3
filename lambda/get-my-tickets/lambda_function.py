import json
import boto3
import os

from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])


def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)

    raise TypeError


def lambda_handler(event, context):
    try:
        attendee_id = "demo-attendee"

        response = tickets_table.query(
            IndexName="AttendeeTickets",
            KeyConditionExpression=Key("attendeeId").eq(attendee_id),
        )

        tickets = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(tickets, default=decimal_to_float),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)}),
        }
