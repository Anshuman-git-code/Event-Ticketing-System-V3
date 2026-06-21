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

  target = "integrations/${aws_apigatewayv2_integration.get_my_registrations.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_my_registrations" {

  statement_id = "AllowGetMyRegistrationsExecution"

  action = "lambda:InvokeFunction"

  function_name = var.get_my_registrations_lambda_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*"
}

