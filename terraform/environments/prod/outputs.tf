output "api_endpoint" {
  value = module.api_gateway.api_endpoint
}

output "cloudfront_url" {
  value       = module.cloudfront.cloudfront_url
  description = "Public CloudFront URL for the frontend"
}

output "frontend_bucket_name" {
  value       = module.cloudfront.frontend_bucket_name
  description = "S3 bucket to upload the React build to"
}

output "cloudfront_distribution_id" {
  value       = module.cloudfront.distribution_id
  description = "Use this to invalidate CloudFront cache after deployments"
}
