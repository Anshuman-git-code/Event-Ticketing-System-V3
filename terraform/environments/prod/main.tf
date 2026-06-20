module "cognito" {
  source = "../../modules/cognito"

  project_name = "event-ticketing-v3"
}

module "dynamodb" {
  source = "../../modules/dynamodb"

  project_name = "event-ticketing-v3"
}