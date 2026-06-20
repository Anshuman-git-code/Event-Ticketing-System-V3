resource "aws_lambda_function" "this" {
  function_name = var.function_name
  role          = var.role_arn
  runtime       = var.runtime
  handler       = var.handler
  filename      = var.filename

  source_code_hash = var.source_code_hash

  timeout     = 10
  memory_size = 256

  environment {
    variables = var.environment_variables
  }
}
