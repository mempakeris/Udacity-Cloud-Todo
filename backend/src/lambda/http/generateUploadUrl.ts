import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });

  // arguments to generate signed URL
  const bucket = process.env.S3_BUCKET;
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION
  const todoId = event.pathParameters.todoId

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: s3.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: todoId,
        Expires: urlExpiration
      })
    })
  };
}
