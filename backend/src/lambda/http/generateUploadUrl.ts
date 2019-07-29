import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const s3 = AWS.S3();

  // arguments to generate signed URL
  const bucket = process.env.S3_BUCKET;
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION
  const todoId = event.pathParameters.todoId


  return s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: todoId,
    Expires: urlExpiration
  });
}
