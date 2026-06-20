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

  create_event_lambda_name = module.create_event_lambda.lambda_name

  list_events_lambda_invoke_arn = module.list_events_lambda.invoke_arn

  list_events_lambda_name = module.list_events_lambda.lambda_name

  get_event_lambda_invoke_arn = module.get_event_lambda.invoke_arn

  get_event_lambda_name = module.get_event_lambda.lambda_name

  get_my_events_lambda_invoke_arn = module.get_my_events_lambda.invoke_arn

  get_my_events_lambda_name = module.get_my_events_lambda.lambda_name

}

data "archive_file" "list_events_zip" {

  type = "zip"

  source_dir = "../../../lambda/list-events"

  output_path = "../../../build/list-events.zip"
}

module "list_events_lambda" {

  source = "../../modules/lambda"

  function_name = "list-events"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.list_events_zip.output_path

  source_code_hash = data.archive_file.list_events_zip.output_base64sha256

  environment_variables = {
    EVENTS_TABLE = module.dynamodb.events_table_name
  }
}

data "archive_file" "get_event_zip" {

  type = "zip"

  source_dir = "../../../lambda/get-event"

  output_path = "../../../build/get-event.zip"
}

module "get_event_lambda" {

  source = "../../modules/lambda"

  function_name = "get-event"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.get_event_zip.output_path

  source_code_hash = data.archive_file.get_event_zip.output_base64sha256

  environment_variables = {
    EVENTS_TABLE = module.dynamodb.events_table_name
  }
}

data "archive_file" "get_my_events_zip" {

  type = "zip"

  source_dir = "../../../lambda/get-my-events"

  output_path = "../../../build/get-my-events.zip"
}

module "get_my_events_lambda" {

  source = "../../modules/lambda"

  function_name = "get-my-events"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.get_my_events_zip.output_path

  source_code_hash = data.archive_file.get_my_events_zip.output_base64sha256

  environment_variables = {
    EVENTS_TABLE = module.dynamodb.events_table_name
  }
}