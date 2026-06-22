import json
import boto3
import os
import uuid
import qrcode
import qrcode.image.svg

from datetime import datetime

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")
ses = boto3.client("ses")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])

bucket_name = os.environ["TICKETS_BUCKET"]
sender_email = os.environ["SENDER_EMAIL"]


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
                Body=f.read(),
                ContentType="image/svg+xml",
            )

        # Generate presigned URL valid for 7 days
        download_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": object_key},
            ExpiresIn=604800,
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

        ses.send_email(
            Source=sender_email,
            Destination={"ToAddresses": [sender_email]},
            Message={
                "Subject": {"Data": f"Your Event Ticket - {ticket_id}"},
                "Body": {
                    "Html": {
                        "Data": f"""
<h2>Your Ticket Is Ready!</h2>
<p><b>Ticket ID:</b> {ticket_id}</p>
<p><b>Event ID:</b> {event_id}</p>
<p><b>Registration ID:</b> {registration_id}</p>
<p>
  <a href="{download_url}" style="
    background-color:#007bff;
    color:white;
    padding:12px 24px;
    text-decoration:none;
    border-radius:6px;
    display:inline-block;
    margin-top:12px;
  ">
    Download Your QR Ticket
  </a>
</p>
<p style="color:#666;font-size:12px;">This link expires in 7 days.</p>
<p>Thank you for registering!</p>
"""
                    },
                    "Text": {
                        "Data": f"""Your ticket is ready!

Ticket ID: {ticket_id}
Event ID: {event_id}
Registration ID: {registration_id}

Download your QR ticket here:
{download_url}

This link expires in 7 days.
Thank you for registering!
"""
                    },
                },
            },
        )

        print(f"Email sent for ticket: {ticket_id}")
        print(f"SVG QR ticket generated: {ticket_id}")

        return {"statusCode": 200, "body": json.dumps(ticket)}

    except Exception as e:
        print(str(e))

        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
