import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { HttpResponse } from '@shared/http/http.response'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'
import { chime, ddb } from '@libs/aws'
import { PersistenceInfrastructure } from 'src/meeting/infrastructure/persistence.infrastructure'

import { AdviserSerializer } from '../../domain/adviser.serializer'
import { AdviserModel } from '../../domain/adviser.model'
import { AdviserInfrastructure } from '../../infrastructure/adviser.infrastructure'
import { AdviserApplication } from '../../application/adviser.application'
import type { getSchemaAdviser } from './schema'
import {
  updateSchemaAdviser,
  createSchemaAdviser,
  acceptedSchemaAdviser,
} from './schema'
import { AdviserEventInfrastructure } from '../../infrastructure/adviser.event.infrastructure'
import { MeetingApplication } from '../../../meeting/application/meeting.application'
import { ChimeInfrastructure } from '../../../meeting/infrastructure/chime.infrastructure'

const tableNamePersonalShopper = process.env.PERSONAL_SHOPPER_TABLE
const tableMeeting = process.env.MEETING_TABLE

class AdviserHttpAdapter {
  constructor(private operation: AdviserApplication) {}

  handlerGetAdviser: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
    event
  ) => {
    const { account, email } = event.pathParameters
    const accountModel = new AdviserModel(account, email)
    const accontSerializer = new AdviserSerializer(accountModel)

    const res = await this.operation.getItem({
      ...accontSerializer.keys(),
    })

    return HttpResponse.response(res)
  }

  handlerCreateAdviser: ValidatedEventAPIGatewayProxyEvent<
    typeof createSchemaAdviser
  > = async (event) => {
    const { account, email, fullName, phone, schedules, rules } = event.body

    const adviserModel = new AdviserModel(
      account,
      email,
      StatePersonalShopper.AVAILABLE,
      fullName,
      true,
      new Date().getTime(),
      undefined,
      phone,
      rules,
      schedules
    )

    const adviserSerializer = new AdviserSerializer(adviserModel)
    const res = await this.operation.create(adviserSerializer.toItems())

    return HttpResponse.response(res)
  }

  handlerAdviserForAccount: ValidatedEventAPIGatewayProxyEvent<
    typeof getSchemaAdviser
  > = async (event) => {
    const { account } = event.pathParameters
    const state = event.queryStringParameters?.state

    const res = await this.operation.getAdviserForAccount(account, state)

    return HttpResponse.response(res)
  }

  handlerAdviserAcceptedClient: ValidatedEventAPIGatewayProxyEvent<
    typeof acceptedSchemaAdviser
  > = async (event) => {
    const { account, adviser, client } = event.body

    const res = await this.operation.adviserAcceptedClient(
      account,
      adviser,
      client
    )

    return HttpResponse.response(res)
  }

  handlerUpdateAdviser: ValidatedEventAPIGatewayProxyEvent<
    typeof updateSchemaAdviser
  > = async (event) => {
    const { account, email } = event.pathParameters
    const { fullName, phone, schedules, rules, active, state } = event.body

    const adviserModel = new AdviserModel(
      account,
      email,
      state,
      fullName,
      active,
      undefined,
      new Date().getTime(),
      phone,
      rules,
      schedules
    )

    const adviserSerializer = new AdviserSerializer(adviserModel)

    const res = await this.operation.updateItem(adviserSerializer.keys(), {
      ...adviserSerializer.toRemoveKey(),
    })

    return HttpResponse.response(res)
  }
}

const adviserInfrastructure = new AdviserInfrastructure(
  tableNamePersonalShopper
)

const adviserEventInfrastructure = new AdviserEventInfrastructure()
const meetingInfrastructure = new ChimeInfrastructure(chime)
const persistenceMeetingInfrastructure = new PersistenceInfrastructure(
  ddb,
  tableMeeting
)

const meetingApplication = new MeetingApplication(
  meetingInfrastructure,
  persistenceMeetingInfrastructure
)

const adviserApplication = new AdviserApplication(
  adviserInfrastructure,
  adviserEventInfrastructure,
  meetingApplication
)

const adviserAdapter = new AdviserHttpAdapter(adviserApplication)

export const handlerGetAdviser = middyfy(adviserAdapter.handlerGetAdviser)

export const handlerCreateAdviser = middyfy(
  adviserAdapter.handlerCreateAdviser,
  createSchemaAdviser
)

export const handlerAdviserForAccount = middyfy(
  adviserAdapter.handlerAdviserForAccount
)

export const handlerUpdateAdviser = middyfy(
  adviserAdapter.handlerUpdateAdviser,
  updateSchemaAdviser
)

export const handlerAdviserAcceptedClient = middyfy(
  adviserAdapter.handlerAdviserAcceptedClient,
  acceptedSchemaAdviser
)
