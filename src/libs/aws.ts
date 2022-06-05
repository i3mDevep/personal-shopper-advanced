import * as AWS from 'aws-sdk'

const ddb = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
})

const chime = new AWS.Chime({ region: 'us-east-1' })

chime.endpoint = new AWS.Endpoint(
  'https://service.chime.aws.amazon.com/console'
)
// AWS.config.update({ region: 'eu-west-1' })

export { ddb, chime }
