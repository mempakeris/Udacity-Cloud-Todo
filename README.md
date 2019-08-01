# Serverless TODO

This is the fourth project of Udacity's new Cloud Developer nanodegree. The purpose of this application was to demonstrate some of the basic skills we learned through our course. There was a lot of material covered: From the Serverless framework to AWS Lambda functions to AWS API Gateway to S3 to DynamoDB and more. The premise of the application is simple: A user is able to login and maintain their information with the help of the Auth0 API and a custom authorizer lambda function. Once they have access to the application, they are able to create a new todo (createTodo lambda function), update whether it is done or not (updateTodo lambda function), delete the todo (deleteTodo lambda function), view all of their todos (getTodos lambda function), or upload an image to the AWS S3 bucket (getUploadURL lambda function). The app is not the most complex or the prettiest, but it is a good demonstration of the material we learned.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

## Other Information

Due to the cost of running AWS-based resources, this instance will probably be down and unavailable to use, but the code is available to view here.
