export default {
  PersonalShopperTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.PERSONAL_SHOPPER_TABLE}',
      KeySchema: [
        {
          AttributeName: 'PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'SK',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'SK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI1PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI1SK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'stateClient',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI1',
          KeySchema: [
            {
              AttributeName: 'GSI1PK',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'GSI1SK',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'stateClientIndex',
          KeySchema: [
            {
              AttributeName: 'GSI1PK',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'stateClient',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
}
