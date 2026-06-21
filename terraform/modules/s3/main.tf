resource "aws_s3_bucket" "tickets" {

  bucket = "${var.project_name}-tickets-storage"
}