module "cognito" {
  source = "../../modules/cognito"

  project_name = "event-ticketing-v3"
}

module "dynamodb" {
  source = "../../modules/dynamodb"

  project_name = "event-ticketing-v3"
}

module "iam" {
  source = "../../modules/iam"

  project_name     = "event-ticketing-v3"
  events_table_arn = module.dynamodb.events_table_arn
}

data "archive_file" "create_event_zip" {

  type = "zip"

  source_dir = "../../../lambda/create-event"

  output_path = "../../../build/create-event.zip"
}

module "create_event_lambda" {

  source = "../../modules/lambda"

  function_name = "create-event"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.create_event_zip.output_path

  source_code_hash = data.archive_file.create_event_zip.output_base64sha256

  environment_variables = {
    EVENTS_TABLE = module.dynamodb.events_table_name
  }
}

module "api_gateway" {
  source = "../../modules/api-gateway"

  api_name = "event-ticketing-v3-api"

  create_event_lambda_invoke_arn = module.create_event_lambda.invoke_arn
  create_event_lambda_name       = module.create_event_lambda.lambda_name
}
