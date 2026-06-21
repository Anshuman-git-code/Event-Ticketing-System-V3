import json
import boto3
import os
import uuid
import qrcode
import qrcode.image.svg

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

        qr_payload = {
            "ticketId": ticket_id,
            "registrationId": registration_id,
            "eventId": event_id,
            "attendeeId": attendee_id,
        }

        factory = qrcode.image.svg.SvgImage

        img = qrcode.make(json.dumps(qr_payload), image_factory=factory)

        file_path = f"/tmp/{ticket_id}.svg"

        with open(file_path, "wb") as f:
            img.save(f)

        object_key = f"tickets/{ticket_id}.svg"

        with open(file_path, "rb") as f:
            s3.put_object(
                Bucket=bucket_name,
                Key=object_key,
                Body=f,
                ContentType="image/svg+xml",
            )

        ticket = {
            "ticketId": ticket_id,
            "registrationId": registration_id,
            "eventId": event_id,
            "attendeeId": attendee_id,
            "ticketStatus": "VALID",
            "issuedAt": datetime.utcnow().isoformat(),
            "ticketFileUrl": f"s3://{bucket_name}/{object_key}",
        }

        tickets_table.put_item(Item=ticket)

        print(f"SVG QR ticket generated: {ticket_id}")

        return {"statusCode": 200, "body": json.dumps(ticket)}

    except Exception as e:
        print(str(e))

        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
