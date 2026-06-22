import json
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource("dynamodb")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])


def lambda_handler(event, context):
    try:
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]

        groups = claims.get("cognito:groups", "")

        if "Organizers" not in groups:
            return {
                "statusCode": 403,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "Only organizers can validate tickets"}),
            }

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

        validated_at = datetime.utcnow().isoformat()

        tickets_table.update_item(
            Key={"ticketId": ticket_id},
            UpdateExpression="SET ticketStatus = :status, validatedAt = :validatedAt",
            ExpressionAttributeValues={
                ":status": "USED",
                ":validatedAt": validated_at,
            },
        )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "ticketId": ticket_id,
                    "status": "USED",
                    "validatedAt": validated_at,
                    "message": "Ticket validated successfully",
                }
            ),
        }

    except Exception as e:
        print(str(e))

        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)}),
        }
