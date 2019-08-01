import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda';
import * as AWS from 'aws-sdk';

// dev imported
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // query variable
  const tableName = process.env.TODOS_TABLE;
  const indexName = process.env.INDEX_NAME;
  const userId = getUserId(event);

  // get items from db
  const result = await dynamoDB.scan({
    TableName: tableName,
    IndexName: indexName,
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: result.Items
    })
  };
}
