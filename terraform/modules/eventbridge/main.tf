resource "aws_cloudwatch_event_rule" "registration_created" {

  name = "registration-created"

  event_pattern = jsonencode({
    source = [
      "event-ticketing.registration"
    ]

    detail-type = [
      "RegistrationCreated"
    ]
  })
}

resource "aws_cloudwatch_event_target" "generate_ticket" {

  rule = aws_cloudwatch_event_rule.registration_created.name

  arn = var.generate_ticket_lambda_arn
}

resource "aws_lambda_permission" "allow_eventbridge" {

  statement_id = "AllowExecutionFromEventBridge"

  action = "lambda:InvokeFunction"

  function_name = var.generate_ticket_lambda_name

  principal = "events.amazonaws.com"

  source_arn = aws_cloudwatch_event_rule.registration_created.arn
}