import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

// dev imported
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // create new fields
  const tableName = process.env.TODOS_TABLE;
  const itemId = uuid.v4();
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // create new table content
  const todoItem = {
    userId: 'TEST', // TODO: Change this to authed user
    todoId: itemId,
    createdAt: Date.now(),
    done: false,
    attachmentUrl: null,
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
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todoItem
    })
  };
}
