import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // relevant query attributes
  const tableName = process.env.TODOS_TABLE;
  const todoId = event.pathParameters.todoId;

  // remove item from db
  await dynamoDB.delete({
    TableName: tableName,
    Key: {
      todoId
    }
  }).promise();

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true
    })
  };
}
