#!/bin/sh

sam build --region us-east-1 --template template.yaml --build-dir .aws-sam/build &&\ 
sam package --region us-east-1 --template-file .aws-sam/build/template.yaml --output-template-file .aws-sam/build/packaged-template.yaml --s3-bucket sam-ciandt-dojo --s3-prefix dma &&\
sam deploy --region us-east-1 --template-file .aws-sam/build/packaged-template.yaml --stack-name sam-dojo-dma --no-fail-on-empty-changeset --s3-prefix dma --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM &&\