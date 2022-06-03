import * as AWS from 'aws-sdk'
import { ddb } from '@libs/aws'

import { ChimeInfrastructure } from '../meeting/infrastructure/chime.infrastructure'
import { PersistenceInfrastructure } from '../meeting/infrastructure/persistence.infrastructure'
import { MeetingApplication } from '../meeting/application/meeting.application'

const chime = new AWS.Chime({ region: 'us-east-1' })

chime.endpoint = new AWS.Endpoint(
  'https://service.chime.aws.amazon.com/console'
)
const operations = new MeetingApplication(
  new ChimeInfrastructure(chime),
  new PersistenceInfrastructure(ddb, process.env.MEETING_TABLE)
)

export const handler = async (event) => {
  // const res = await operations.joinMeeting(
  //   '6be0c2b8-9d64-42de-ade1-c52e41b99028',
  //   'test',
  //   'guest'
  // )

  console.log('entre a test')

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  }
}
