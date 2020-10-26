# Example Warehouse Management API

This project is fully run on AWS services
Serverless Backend with Typescript, NodeJs and with Express.js route to route the REST API.
Project build using [AWS Serverless Application Model (AWS SAM)](https://github.com/aws/serverless-application-model)

AWS cloud services;
 - Cognito
 - DynamoDB
 - Lambda
 - ApiGateway
 - CloudFormation

### Project Model
Managing product inventory requires adding products to a product catalog and adding warehouses to store the products.

### API Document 
To test API online [POSTMAN Online Documentation](https://documenter.getpostman.com/view/1319596/TVYGaxEH)
 
### To build, package and deploy this project follow this steps
1. Install pakages

```
yarn install
```
2. Build project

```
yarn build
```
3. Build SAM project

```
sam build --region <your region>
```

Example
```
sam build --region ap-southeast-1
```

4. Create a S3 bucket. Only to do the first time you package this project
```
aws s3 mb s3://<name of bucket> --region <your region>
```

Example:
```
aws s3 mb s3://shukri-werehouse-api-serverless  --region ap-southeast-1
```

5. Package project

```
sam package --template-file <name of the template> --s3-bucket <name of the bucket you just created> --output-template-file <name of the output template file>
```

Example:
```
sam package --template-file template.yaml --s3-bucket shukri-werehouse-api-serverless --output-template-file packaged.yaml
```

6. Deploy project to cloudformation

Run this if there is no nested applications

```
sam deploy --region <your region> --template-file  <name of the output template file> --stack-name <name of your stack> --capabilities CAPABILITY_IAM
````

Example:
```
sam deploy --region ap-southeast-1 --template-file packaged.yaml --stack-name shukri-werehouse-api-serverless --capabilities CAPABILITY_IAM
`````

## To clean up the application from your account

````
aws cloudformation delete-stack <name of your stack> --region <your region>
aws s3 rb s3://<name of the bucket you just created> --region <your region>
````


