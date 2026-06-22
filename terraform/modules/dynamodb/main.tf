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

resource "aws_dynamodb_table" "registrations" {

  name         = "${var.project_name}-registrations"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "registrationId"

  attribute {
    name = "registrationId"
    type = "S"
  }

  attribute {
    name = "eventId"
    type = "S"
  }

  attribute {
    name = "attendeeId"
    type = "S"
  }

  global_secondary_index {
    name            = "EventRegistrations"
    hash_key        = "eventId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "AttendeeRegistrations"
    hash_key        = "attendeeId"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "tickets" {

  name         = "${var.project_name}-tickets"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "ticketId"

  attribute {
    name = "ticketId"
    type = "S"
  }

  attribute {
    name = "registrationId"
    type = "S"
  }

  attribute {
    name = "attendeeId"
    type = "S"
  }

  attribute {
  name = "eventId"
  type = "S"
  }

  global_secondary_index {
    name            = "RegistrationTicket"
    hash_key        = "registrationId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "AttendeeTickets"
    hash_key        = "attendeeId"
    projection_type = "ALL"
  }

  global_secondary_index {
  name            = "EventTickets"
  hash_key        = "eventId"
  projection_type = "ALL"
  }
}

