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

  project_name = "event-ticketing-v3"

  events_table_arn        = module.dynamodb.events_table_arn
  registrations_table_arn = module.dynamodb.registrations_table_arn
  tickets_table_arn       = module.dynamodb.tickets_table_arn

  tickets_bucket_arn = module.s3.bucket_arn
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

  register_event_lambda_invoke_arn = module.register_event_lambda.invoke_arn

  register_event_lambda_name = module.register_event_lambda.lambda_name

  get_my_registrations_lambda_invoke_arn = module.get_my_registrations_lambda.invoke_arn

  get_my_registrations_lambda_name = module.get_my_registrations_lambda.lambda_name

  get_my_tickets_lambda_invoke_arn = module.get_my_tickets_lambda.invoke_arn

  get_my_tickets_lambda_name = module.get_my_tickets_lambda.lambda_name

  get_ticket_lambda_invoke_arn = module.get_ticket_lambda.invoke_arn

  get_ticket_lambda_name = module.get_ticket_lambda.lambda_name

  validate_ticket_lambda_invoke_arn = module.validate_ticket_lambda.invoke_arn

  validate_ticket_lambda_name = module.validate_ticket_lambda.lambda_name

  user_pool_id = module.cognito.user_pool_id

  user_pool_client_id = module.cognito.user_pool_client_id

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

data "archive_file" "register_event_zip" {

  type = "zip"

  source_dir = "../../../lambda/register-event"

  output_path = "../../../build/register-event.zip"
}

module "register_event_lambda" {

  source = "../../modules/lambda"

  function_name = "register-event"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.register_event_zip.output_path

  source_code_hash = data.archive_file.register_event_zip.output_base64sha256

  environment_variables = {

    EVENTS_TABLE = module.dynamodb.events_table_name

    REGISTRATIONS_TABLE = module.dynamodb.registrations_table_name
  }
}

data "archive_file" "get_my_registrations_zip" {

  type = "zip"

  source_dir = "../../../lambda/get-my-registrations"

  output_path = "../../../build/get-my-registrations.zip"
}

module "get_my_registrations_lambda" {

  source = "../../modules/lambda"

  function_name = "get-my-registrations"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.get_my_registrations_zip.output_path

  source_code_hash = data.archive_file.get_my_registrations_zip.output_base64sha256

  environment_variables = {

    REGISTRATIONS_TABLE = module.dynamodb.registrations_table_name
  }
}

data "archive_file" "generate_ticket_zip" {

  type = "zip"

  source_dir = "../../../build/generate-ticket-package"

  output_path = "../../../build/generate-ticket.zip"
}

module "generate_ticket_lambda" {

  source = "../../modules/lambda"

  function_name = "generate-ticket"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.generate_ticket_zip.output_path

  source_code_hash = data.archive_file.generate_ticket_zip.output_base64sha256

  environment_variables = {
    TICKETS_TABLE  = module.dynamodb.tickets_table_name
    TICKETS_BUCKET = module.s3.bucket_name
  }
}

module "eventbridge" {

  source = "../../modules/eventbridge"

  generate_ticket_lambda_arn = module.generate_ticket_lambda.lambda_arn

  generate_ticket_lambda_name = module.generate_ticket_lambda.lambda_name
}

data "archive_file" "get_my_tickets_zip" {

  type = "zip"

  source_dir = "../../../lambda/get-my-tickets"

  output_path = "../../../build/get-my-tickets.zip"
}

module "get_my_tickets_lambda" {

  source = "../../modules/lambda"

  function_name = "get-my-tickets"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.get_my_tickets_zip.output_path

  source_code_hash = data.archive_file.get_my_tickets_zip.output_base64sha256

  environment_variables = {
    TICKETS_TABLE = module.dynamodb.tickets_table_name
  }
}

data "archive_file" "get_ticket_zip" {

  type = "zip"

  source_dir = "../../../lambda/get-ticket"

  output_path = "../../../build/get-ticket.zip"
}

module "get_ticket_lambda" {

  source = "../../modules/lambda"

  function_name = "get-ticket"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.get_ticket_zip.output_path

  source_code_hash = data.archive_file.get_ticket_zip.output_base64sha256

  environment_variables = {
    TICKETS_TABLE = module.dynamodb.tickets_table_name
  }
}

data "archive_file" "validate_ticket_zip" {

  type = "zip"

  source_dir = "../../../lambda/validate-ticket"

  output_path = "../../../build/validate-ticket.zip"
}

module "validate_ticket_lambda" {

  source = "../../modules/lambda"

  function_name = "validate-ticket"

  runtime = "python3.12"

  handler = "lambda_function.lambda_handler"

  role_arn = module.iam.event_lambda_role_arn

  filename = data.archive_file.validate_ticket_zip.output_path

  source_code_hash = data.archive_file.validate_ticket_zip.output_base64sha256

  environment_variables = {
    TICKETS_TABLE = module.dynamodb.tickets_table_name
  }
}

module "s3" {

  source = "../../modules/s3"

  project_name = "event-ticketing-v3"
}