resource "aws_cognito_user_pool" "this" {
  name = "${var.project_name}-user-pool"

  username_attributes = ["email"]

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${var.project_name}-client"
  user_pool_id = aws_cognito_user_pool.this.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  generate_secret = false
}

resource "aws_cognito_user_group" "organizers" {
  name         = "Organizers"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_user_group" "attendees" {
  name         = "Attendees"
  user_pool_id = aws_cognito_user_pool.this.id
}