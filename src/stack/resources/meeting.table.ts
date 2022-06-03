export default {
  MeetingTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.MEETING_TABLE}',
      KeySchema: [
        {
          AttributeName: 'Title',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'Title',
          AttributeType: 'S',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
}
