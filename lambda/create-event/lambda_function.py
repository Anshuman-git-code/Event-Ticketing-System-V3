from datetime import datetime
import json
import os
import uuid

import boto3

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = os.environ["EVENTS_TABLE"]
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        required_fields = [
            "title",
            "description",
            "category",
            "location",
            "eventDate",
            "capacity",
            "ticketPrice",
        ]

        for field in required_fields:
            if field not in body:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": f"{field} is required"}),
                }

        event_id = f"evt_{uuid.uuid4().hex[:8]}"

        item = {
            "eventId": event_id,
            "organizerId": event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"],
            "title": body["title"],
            "description": body["description"],
            "category": body["category"],
            "location": body["location"],
            "eventDate": body["eventDate"],
            "capacity": body["capacity"],
            "ticketPrice": body["ticketPrice"],
            "status": "PUBLISHED",
            "createdAt": datetime.utcnow().isoformat(),
        }

        table.put_item(Item=item)

        return {
            "statusCode": 201,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {"eventId": event_id, "message": "Event created successfully"}
            ),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
