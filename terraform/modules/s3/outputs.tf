output "bucket_name" {
  value = aws_s3_bucket.tickets.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.tickets.arn
}