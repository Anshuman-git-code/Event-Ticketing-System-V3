import json
import boto3
import os
import uuid

from datetime import datetime

dynamodb = boto3.resource("dynamodb")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])


def lambda_handler(event, context):
    try:
        detail = event["detail"]

        registration_id = detail["registrationId"]
        event_id = detail["eventId"]
        attendee_id = detail["attendeeId"]

        ticket_id = "tkt_" + uuid.uuid4().hex[:8]

        ticket = {
            "ticketId": ticket_id,
            "registrationId": registration_id,
            "eventId": event_id,
            "attendeeId": attendee_id,
            "ticketStatus": "VALID",
            "issuedAt": datetime.utcnow().isoformat(),
        }

        tickets_table.put_item(Item=ticket)

        print(f"Ticket created: {ticket_id}")

        return {"statusCode": 200, "body": json.dumps({"ticketId": ticket_id})}

    except Exception as e:
        print(str(e))

        raise e
