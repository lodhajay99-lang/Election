#!/bin/bash

# Bharat Votes — Google Cloud Setup Script
# This script helps configure the necessary GCP services for the project.

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

echo "🚀 Setting up Bharat Votes on Project: $PROJECT_ID"

# 1. Enable Required APIs
echo "📡 Enabling Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    logging.googleapis.com \
    clouderrorreporting.googleapis.com \
    generativelanguage.googleapis.com

# 2. Create Artifact Registry for Docker images
echo "📦 Creating Artifact Registry..."
gcloud artifacts repositories create bharat-votes-repo \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Bharat Votes"

# 3. Setup Cloud Logging & Error Reporting
echo "📝 Initializing Cloud Logging & Error Reporting..."
# No specific command needed to 'create' logging, but we can verify permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$(gcloud projects describe $PROJECT_ID --format='get(projectNumber)')-compute@developer.gserviceaccount.com" \
    --role="roles/logging.logWriter"

# 4. Setup Google Cloud Storage for static assets
echo "🗄️ Creating Cloud Storage Bucket for assets..."
gsutil mb -l $REGION gs://$PROJECT_ID-assets
gsutil iam ch allUsers:objectViewer gs://$PROJECT_ID-assets

echo "✅ Setup Complete! You can now run 'npm run deploy' to push to Cloud Run."
