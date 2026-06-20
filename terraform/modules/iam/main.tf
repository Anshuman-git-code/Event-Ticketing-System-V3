resource "aws_iam_role" "event_lambda_role" {
  name = "${var.project_name}-event-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"


    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "lambda.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]


  })
}

resource "aws_iam_policy" "event_lambda_policy" {
  name = "${var.project_name}-event-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"


    Statement = [
      {
        Effect = "Allow"

        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]

        Resource = [
          var.events_table_arn,
          "${var.events_table_arn}/index/*"
        ]
      },

      {
        Effect = "Allow"

        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]

        Resource = "*"
      }
    ]


  })
}

resource "aws_iam_role_policy_attachment" "event_lambda_attachment" {
  role       = aws_iam_role.event_lambda_role.name
  policy_arn = aws_iam_policy.event_lambda_policy.arn
}
