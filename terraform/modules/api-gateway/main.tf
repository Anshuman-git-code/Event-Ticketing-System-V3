resource "aws_apigatewayv2_api" "this" {

  name = var.api_name

  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "create_event" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.create_event_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "list_events" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.list_events_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_event" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "POST /events"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.create_event.id}"
}

resource "aws_apigatewayv2_route" "list_events" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /events"

  target = "integrations/${aws_apigatewayv2_integration.list_events.id}"
}

resource "aws_apigatewayv2_stage" "prod" {

  api_id = aws_apigatewayv2_api.this.id

  name = "prod"

  auto_deploy = true
}

resource "aws_lambda_permission" "allow_api_gateway" {

  statement_id = "AllowExecutionFromAPIGateway"

  action = "lambda:InvokeFunction"

  function_name = var.create_event_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_lambda_permission" "allow_api_gateway_list_events" {

  statement_id = "AllowListEventsExecution"

  action = "lambda:InvokeFunction"

  function_name = var.list_events_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "get_event" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.get_event_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_event" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /events/{eventId}"

  target = "integrations/${aws_apigatewayv2_integration.get_event.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_event" {

  statement_id = "AllowGetEventExecution"

  action = "lambda:InvokeFunction"

  function_name = var.get_event_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "get_my_events" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.get_my_events_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_my_events" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /events/my"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.get_my_events.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_my_events" {

  statement_id = "AllowGetMyEventsExecution"

  action = "lambda:InvokeFunction"

  function_name = var.get_my_events_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "register_event" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.register_event_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "register_event" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "POST /events/{eventId}/register"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.register_event.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_register_event" {

  statement_id = "AllowRegisterEventExecution"

  action = "lambda:InvokeFunction"

  function_name = var.register_event_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "get_my_registrations" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.get_my_registrations_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_my_registrations" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /registrations/my"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.get_my_registrations.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_my_registrations" {

  statement_id = "AllowGetMyRegistrationsExecution"

  action = "lambda:InvokeFunction"

  function_name = var.get_my_registrations_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "get_my_tickets" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.get_my_tickets_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_my_tickets" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /tickets/my"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.get_my_tickets.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_my_tickets" {

  statement_id = "AllowGetMyTicketsExecution"

  action = "lambda:InvokeFunction"

  function_name = var.get_my_tickets_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "get_ticket" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.get_ticket_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_ticket" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /tickets/{ticketId}"

  target = "integrations/${aws_apigatewayv2_integration.get_ticket.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_ticket" {

  statement_id = "AllowGetTicketExecution"

  action = "lambda:InvokeFunction"

  function_name = var.get_ticket_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "validate_ticket" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.validate_ticket_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "validate_ticket" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "POST /tickets/{ticketId}/validate"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.validate_ticket.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_validate_ticket" {

  statement_id = "AllowValidateTicketExecution"

  action = "lambda:InvokeFunction"

  function_name = var.validate_ticket_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

resource "aws_apigatewayv2_authorizer" "cognito" {

  api_id = aws_apigatewayv2_api.this.id

  name = "cognito-authorizer"

  authorizer_type = "JWT"

  identity_sources = [
    "$request.header.Authorization"
  ]

  jwt_configuration {

    audience = [
      var.user_pool_client_id
    ]

    issuer = "https://cognito-idp.ap-south-1.amazonaws.com/${var.user_pool_id}"
  }
}

resource "aws_apigatewayv2_integration" "event_analytics" {

  api_id = aws_apigatewayv2_api.this.id

  integration_type = "AWS_PROXY"

  integration_uri = var.event_analytics_lambda_invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "event_analytics" {

  api_id = aws_apigatewayv2_api.this.id

  route_key = "GET /events/{eventId}/analytics"

  authorization_type = "JWT"

  authorizer_id = aws_apigatewayv2_authorizer.cognito.id

  target = "integrations/${aws_apigatewayv2_integration.event_analytics.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_event_analytics" {

  statement_id = "AllowEventAnalyticsExecution"

  action = "lambda:InvokeFunction"

  function_name = var.event_analytics_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}