import * as AWS from 'aws-sdk'

const ddb = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
})

// AWS.config.update({ region: 'eu-west-1' })

export { ddb }
