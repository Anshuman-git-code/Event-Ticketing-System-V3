import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])


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

        if ticket["ticketStatus"] == "USED":
            return {
                "statusCode": 409,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Ticket already used"}),
            }

        tickets_table.update_item(
            Key={"ticketId": ticket_id},
            UpdateExpression="SET ticketStatus = :status",
            ExpressionAttributeValues={":status": "USED"},
        )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "ticketId": ticket_id,
                    "status": "USED",
                    "message": "Ticket validated successfully",
                }
            ),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)}),
        }
