import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

// dev imported
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // relevant query attributes
  const tableName = process.env.TODOS_TABLE;
  const indexName = process.env.INDEX_NAME;
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  // updated item in table
  await dynamoDB.update({
    TableName: tableName,
    IndexName: indexName,
    Key: {
      todoId
    },
    UpdateExpression: 'set name = :n, dueDate = :due, done = :d',
    ExpressionAttributeValues: {
      ":n": updatedTodo.name,
      ":due": updatedTodo.dueDate,
      ":d": udpatedTodo.done
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true
    })
  }
}
