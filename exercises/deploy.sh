sam build --template template.yaml --build-dir .aws-sam/build &&\
sam package --template-file .aws-sam/build/template.yaml --output-template-file .aws-sam/build/packaged-template.yaml &&\
sam deploy --stack-name mando-agatha-ex5