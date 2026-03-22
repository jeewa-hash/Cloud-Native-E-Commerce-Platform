#!/bin/bash

# DeliveryManagementService Deployment Script
# This script builds and deploys the DeliveryManagementService to AWS ECS

set -e

# Configuration
AWS_REGION="eu-north-1"
ECR_REPOSITORY="delivery-service"
ECS_SERVICE="delivery-service"
ECS_CLUSTER="chaveenn"
CONTAINER_NAME="delivery-service"

echo "🚀 Starting DeliveryManagementService deployment..."

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "📦 Building Docker image..."
cd DeliveryManagementService
docker build -t ${ECR_REPOSITORY}:latest .

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo "📤 Tagging and pushing image..."
docker tag ${ECR_REPOSITORY}:latest ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest

echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster ${ECS_CLUSTER} \
  --service ${ECS_SERVICE} \
  --force-new-deployment \
  --region ${AWS_REGION}

echo "⏳ Waiting for service to stabilize..."
aws ecs wait services-stable \
  --cluster ${ECS_CLUSTER} \
  --services ${ECS_SERVICE} \
  --region ${AWS_REGION}

echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: Check ECS console for public IP or load balancer"

# Check service status
aws ecs describe-services \
  --cluster ${ECS_CLUSTER} \
  --services ${ECS_SERVICE} \
  --query 'services[0].{status:status,runningCount:runningCount,desiredCount:desiredCount}' \
  --region ${AWS_REGION}