import json
import boto3
import os
import uuid

from datetime import datetime

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])

bucket_name = os.environ["TICKETS_BUCKET"]


def lambda_handler(event, context):
    try:
        detail = event["detail"]

        ticket_id = "tkt_" + uuid.uuid4().hex[:8]

        registration_id = detail["registrationId"]
        event_id = detail["eventId"]
        attendee_id = detail["attendeeId"]

        ticket = {
            "ticketId": ticket_id,
            "registrationId": registration_id,
            "eventId": event_id,
            "attendeeId": attendee_id,
            "ticketStatus": "VALID",
            "issuedAt": datetime.utcnow().isoformat(),
        }

        # Create ticket artifact
        ticket_file = json.dumps(ticket, indent=2)

        object_key = f"tickets/{ticket_id}.json"

        s3.put_object(
            Bucket=bucket_name,
            Key=object_key,
            Body=ticket_file,
            ContentType="application/json",
        )

        ticket["ticketFileUrl"] = f"s3://{bucket_name}/{object_key}"

        tickets_table.put_item(Item=ticket)

        print(f"Ticket created and uploaded: {ticket_id}")

        return {"statusCode": 200, "body": json.dumps(ticket)}

    except Exception as e:
        print(str(e))

        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
