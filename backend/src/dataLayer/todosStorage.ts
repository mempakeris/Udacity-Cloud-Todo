import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'
import * as AWS from 'aws-sdk'

export default class TodosStorage {
    constructor(
        private readonly todosStorage = process.env.S3_BUCKET,
        private readonly s3 = new AWS.S3({ signatureVersion: 'v4'})
    ) {}

    getBucketName(): String {
        return this.todosStorage;
    }

    getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
        return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
    }
}
