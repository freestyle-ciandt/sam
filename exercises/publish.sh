#!/bin/bash

sam validate && \
# Run npm installs / Move function to a specific aws folder
sam build --template template.yaml --build-dir .aws-sam/build && \
sam package --template-file .aws-sam/build/template.yaml --output-template-file .aws-sam/build/packaged-template.yaml --s3-bucket sam-ciandt-dojo --s3-prefix dupla-1 && \
sam deploy --template-file .aws-sam/build/packaged-template.yaml --stack-name sam-dojo-dupla-1 --no-fail-on-empty-changeset --s3-prefix dupla-1 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM