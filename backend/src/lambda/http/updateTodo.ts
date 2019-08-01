import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

// dev imported
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { getUserId } from '../utils';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // relevant query attributes
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  if (!(await todoItemExists(todoId, userId))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }

  // updated item in table
  await dynamoDB.update({
    TableName: tableName,
    Key: {
      todoId,
      userId
    },
    UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
    ExpressionAttributeValues: {
      ':n': updatedTodo.name,
      ':due': updatedTodo.dueDate,
      ':d': updatedTodo.done
    },
    ExpressionAttributeNames: {
      '#name': 'name',
      '#dueDate': 'dueDate',
      '#done': 'done'
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
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
