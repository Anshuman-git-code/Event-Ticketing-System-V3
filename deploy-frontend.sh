#!/bin/bash
set -e

FRONTEND_DIR="$(dirname "$0")/frontend"
TERRAFORM_DIR="$(dirname "$0")/terraform/environments/prod"

echo "==> Getting Terraform outputs..."
BUCKET=$(cd "$TERRAFORM_DIR" && terraform output -raw frontend_bucket_name)
DISTRIBUTION_ID=$(cd "$TERRAFORM_DIR" && terraform output -raw cloudfront_distribution_id)
CLOUDFRONT_URL=$(cd "$TERRAFORM_DIR" && terraform output -raw cloudfront_url)

echo "==> Building React app..."
cd "$FRONTEND_DIR"
npm run build

echo "==> Uploading to S3: s3://$BUCKET"
aws s3 sync dist/ "s3://$BUCKET" --delete --region ap-south-1

echo "==> Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --region us-east-1
######
echo ""
echo "✅ Deployment complete!"
echo "   Frontend URL: $CLOUDFRONT_URL"
