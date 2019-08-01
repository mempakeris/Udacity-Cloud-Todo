import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

// dev imported
import { getUserId } from '../utils';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // relevant query attributes
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  if (!(await todoItemExists(todoId, userId))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }

  // remove item from db
  await dynamoDB.delete({
    TableName: tableName,
    Key: {
      todoId,
      userId
    }
  }).promise();

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}

async function todoItemExists(todoId: string, userId: string) {
  const result = await dynamoDB.get({
    TableName: tableName,
    Key: {
      todoId,
      userId
    }
  }).promise();

  return !!result.Item;
}
