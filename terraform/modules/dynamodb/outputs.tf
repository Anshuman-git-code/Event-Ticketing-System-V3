output "events_table_name" {
  value = aws_dynamodb_table.events.name
}

output "events_table_arn" {
  value = aws_dynamodb_table.events.arn
}

output "registrations_table_name" {
  value = aws_dynamodb_table.registrations.name
}

output "registrations_table_arn" {
  value = aws_dynamodb_table.registrations.arn
}

output "tickets_table_name" {
  value = aws_dynamodb_table.tickets.name
}

output "tickets_table_arn" {
  value = aws_dynamodb_table.tickets.arn
}