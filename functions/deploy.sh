#!/bin/bash
set -e

PROJECT="search-ahmed"
REGION="us-central1"

echo "Deploying Gen 2 Cloud Functions..."

# Deploy setAdminClaim
echo "Deploying setAdminClaim..."
gcloud functions deploy setAdminClaim \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=setAdminClaim \
  --trigger-http \
  --project=$PROJECT \
  --max-instances=10 \
  --timeout=60s \
  --memory=256MB 2>&1

# Deploy updateUserPermissions
echo "Deploying updateUserPermissions..."
gcloud functions deploy updateUserPermissions \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=updateUserPermissions \
  --trigger-http \
  --project=$PROJECT \
  --max-instances=10 \
  --timeout=60s \
  --memory=256MB 2>&1

# Deploy getUserPermissions
echo "Deploying getUserPermissions..."
gcloud functions deploy getUserPermissions \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=getUserPermissions \
  --trigger-http \
  --project=$PROJECT \
  --max-instances=10 \
  --timeout=60s \
  --memory=256MB 2>&1

# Deploy initializeUser
echo "Deploying initializeUser..."
gcloud functions deploy initializeUser \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=initializeUser \
  --trigger-http \
  --project=$PROJECT \
  --max-instances=10 \
  --timeout=60s \
  --memory=256MB 2>&1

echo "All functions deployed successfully!"
