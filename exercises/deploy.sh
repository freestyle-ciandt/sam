#!/bin/bash
sam build --template template.yaml --build-dir .aws-sam/build &&\
sam package --template-file .aws-sam/build/template.yaml --output-template-file .aws-sam/build/packaged-template.yaml --s3-bucket sam-ciandt-dojo --s3-prefix dupla-3 &&\
sam deploy --template-file .aws-sam/build/packaged-template.yaml --stack-name sam-dojo-dupla-3 --no-fail-on-empty-changeset --s3-prefix dupla-3 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM