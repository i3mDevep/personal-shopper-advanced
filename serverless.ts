import type { AWS } from '@serverless/typescript'
import PersonalShopperTable from 'src/aws/resources/personal.table'

import {
  adviserCreate,
  adviserForAccount,
  adviserForState,
  handlerGetAdviser,
  handlerUpdateAdviser,
} from './src/adviser/adapter/http'
import {
  accountGet,
  accountUpdate,
  accountCreate,
} from './src/account/adapter/http'

const serverlessConfiguration: AWS = {
  service: 'personal-shopper-advanced',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-offline',
    'serverless-offline-aws-eventbridge',
    'serverless-dynamodb-local',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [{ 'Fn::GetAtt': ['PersonalShopperTable', 'Arn'] }],
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      PERSONAL_SHOPPER_TABLE: '${self:custom.personalTable}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    accountGet,
    accountUpdate,
    accountCreate,
    adviserCreate,
    adviserForAccount,
    adviserForState,
    handlerGetAdviser,
    handlerUpdateAdviser,
  },
  resources: {
    Resources: {
      ...PersonalShopperTable,
    },
  },
  package: { individually: true },
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    'serverless-offline': {
      httpPort: 3000,
      babelOptions: {
        presets: ['env'],
      },
    },
    personalTable: 'PersonalShopperDB--${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['localhost'],
      start: {
        docker: true,
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        noStart: true,
      },
    },
  },
}

module.exports = serverlessConfiguration
