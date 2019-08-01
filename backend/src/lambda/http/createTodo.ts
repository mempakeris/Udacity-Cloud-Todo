import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

// dev imported
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // create new fields
  const bucketName = process.env.S3_BUCKET;
  const tableName = process.env.TODOS_TABLE;
  const itemId = uuid.v4();
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // create new table content
  const date = new Date(Date.now()).toISOString();
  const user = getUserId(event);

  // ensure todoItem name is not empty
  if (!newTodo.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name is empty'
      })
    };
  }

  const todoItem = {
    userId: user,
    todoId: itemId,
    createdAt: date,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
    ...newTodo
  };

  // add table to dynamoDB
  await dynamoDB.put({
    TableName: tableName,
    Item: todoItem
  }).promise();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: todoItem
    })
  };
}
