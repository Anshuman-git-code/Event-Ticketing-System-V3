resource "aws_dynamodb_table" "events" {

  name         = "${var.project_name}-events"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "eventId"

  attribute {
    name = "eventId"
    type = "S"
  }

  attribute {
    name = "organizerId"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "eventDate"
    type = "S"
  }

  global_secondary_index {
    name            = "OrganizerEvents"
    hash_key        = "organizerId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "CategoryIndex"
    hash_key        = "category"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "UpcomingEvents"
    hash_key        = "status"
    range_key       = "eventDate"
    projection_type = "ALL"
  }
}