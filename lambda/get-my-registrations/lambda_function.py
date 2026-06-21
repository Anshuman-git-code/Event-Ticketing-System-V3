import json
import boto3
import os

from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")

registrations_table = dynamodb.Table(os.environ["REGISTRATIONS_TABLE"])


def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def lambda_handler(event, context):
    try:
        attendee_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        response = registrations_table.query(
            IndexName="AttendeeRegistrations",
            KeyConditionExpression=Key("attendeeId").eq(attendee_id),
        )

        registrations = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(registrations, default=decimal_default),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
