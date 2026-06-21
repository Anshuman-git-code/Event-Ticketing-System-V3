import json
import boto3
import os

from decimal import Decimal

dynamodb = boto3.resource("dynamodb")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])


def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)

    raise TypeError


def lambda_handler(event, context):
    try:
        ticket_id = event["pathParameters"]["ticketId"]

        response = tickets_table.get_item(Key={"ticketId": ticket_id})

        ticket = response.get("Item")

        if not ticket:
            return {
                "statusCode": 404,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Ticket not found"}),
            }

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(ticket, default=decimal_to_float),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)}),
        }
