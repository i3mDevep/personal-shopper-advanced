import type { AWS } from '@serverless/typescript'
import PersonalShopperTable from 'src/stack/resources/personal.table'
import MeetingTable from 'src/stack/resources/meeting.table'

import {
  adviserCreate,
  adviserForAccount,
  handlerGetAdviser,
  handlerUpdateAdviser,
} from './src/adviser/adapter/http'
import { searchAvailableEvent } from './src/adviser/adapter/event'
import {
  accountGet,
  accountUpdate,
  accountCreate,
} from './src/account/adapter/http'
import {
  clientCreate,
  clientGet,
  clientUpdate,
  clientGetForState,
} from './src/client/adapter/http'
import { handleClientCanceledEvent } from './src/client/adapter/event'
import { puto } from './src/test'

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
      {
        Effect: 'Allow',
        Action: [
          'chime:CreateMeeting',
          'chime:TagMeeting',
          'chime:TagResource',
          'chime:DeleteMeeting',
          'chime:GetMeeting',
          'chime:ListMeetings',
          'chime:BatchCreateAttendee',
          'chime:CreateAttendee',
          'chime:DeleteAttendee',
          'chime:GetAttendee',
          'chime:ListAttendees',
          'chime:StartMeetingTranscription',
          'chime:StopMeetingTranscription',
          'chime:CreateMediaCapturePipeline',
          'chime:DeleteMediaCapturePipeline',
        ],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: 'events:*',
        Resource: '*',
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
      MEETING_TABLE: '${self:custom.meetingTable}',
      BUS_PERSONAL_SHOPPER: '${self:custom.busPersonalShopper}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    accountGet,
    accountUpdate,
    accountCreate,
    adviserCreate,
    adviserForAccount,
    handlerGetAdviser,
    handlerUpdateAdviser,
    searchAvailableEvent,
    clientGet,
    clientGetForState,
    clientCreate,
    clientUpdate,
    handleClientCanceledEvent,
    puto,
  },
  resources: {
    Resources: {
      ...PersonalShopperTable,
      ...MeetingTable,
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
    meetingTable: 'MeetingDB--${opt:stage, self:provider.stage}',
    busPersonalShopper: 'PersonalShopperBUS--${opt:stage, self:provider.stage}',
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
