import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")

tickets_table = dynamodb.Table(os.environ["TICKETS_TABLE"])

bucket_name = os.environ["TICKETS_BUCKET"]


def lambda_handler(event, context):
    try:
        ticket_id = event["pathParameters"]["ticketId"]

        response = tickets_table.get_item(Key={"ticketId": ticket_id})

        ticket = response.get("Item")

        if not ticket:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Ticket not found"}),
            }

        object_key = ticket["ticketFileUrl"].replace(f"s3://{bucket_name}/", "")

        download_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": bucket_name,
                "Key": object_key,
            },
            ExpiresIn=3600,
        )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "ticketId": ticket_id,
                    "downloadUrl": download_url,
                }
            ),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
