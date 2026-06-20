import json
import boto3
import os

from decimal import Decimal

dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ["EVENTS_TABLE"]

table = dynamodb.Table(TABLE_NAME)


def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def lambda_handler(event, context):
    try:
        event_id = event["pathParameters"]["eventId"]

        response = table.get_item(Key={"eventId": event_id})

        item = response.get("Item")

        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Event not found"}),
            }

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(item, default=decimal_default),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
