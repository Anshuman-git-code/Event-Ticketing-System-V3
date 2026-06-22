import json
import os
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ["EVENTS_TABLE"]

table = dynamodb.Table(TABLE_NAME)


def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def lambda_handler(event, context):
    try:
        query_params = event.get("queryStringParameters") or {}

        category = query_params.get("category")
        status = query_params.get("status")

        # Filter by category
        if category:
            response = table.query(
                IndexName="CategoryIndex",
                KeyConditionExpression=Key("category").eq(category),
            )

        # Filter by status
        elif status:
            response = table.query(
                IndexName="UpcomingEvents",
                KeyConditionExpression=Key("status").eq(status),
            )

        # Default: all published events
        else:
            response = table.query(
                IndexName="UpcomingEvents",
                KeyConditionExpression=Key("status").eq("PUBLISHED"),
            )

        events = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(events, default=decimal_default),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)}),
        }
