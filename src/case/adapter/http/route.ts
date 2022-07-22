import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { v4 as uuid } from 'uuid'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { ClientSerializer } from 'src/case/domain/case.serializer'
import { HttpResponse } from '@shared/http/http.response'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'
import { AdviserUnAssigned } from '@shared/helper/identity.database'
import { ChimeInfrastructure } from 'src/meeting/infrastructure/chime.infrastructure'
import { MeetingApplication } from 'src/meeting/application/meeting.application'
import { chime, ddb } from '@libs/aws'
import { PersistenceInfrastructure } from 'src/meeting/infrastructure/persistence.infrastructure'

import { CaseEventInfrastructure } from '../../infrastructure/case.event.infrastructure'
import { CaseModel } from '../../domain/case.model'
import { CaseInfrastructure } from '../../infrastructure/case.store.infrastructure'
import { CaseApplication } from '../../application/case.application'
import { createSchemaClient, updateSchemaClient } from './schema'

const tableName = process.env.PERSONAL_SHOPPER_TABLE
const tableMeeting = process.env.MEETING_TABLE

class ClientHttpAdapter {
  constructor(private operation: CaseApplication) {}

  handlerGetClientForState: ValidatedEventAPIGatewayProxyEvent<unknown> =
    async (event) => {
      const { account, adviser } = event.pathParameters
      const state = event.queryStringParameters?.state
      const res = await this.operation.getClienForState(account, adviser, state)

      return HttpResponse.response(res)
    }

  joinClient: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
    const { case: case_ } = event.pathParameters
    const res = await this.operation.joinClient(case_)

    return HttpResponse.response(res)
  }

  handlerGetClient: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
    event
  ) => {
    const { case: case_ } = event.pathParameters
    const clientModel = new CaseModel(case_)
    const accontSerializer = new ClientSerializer(clientModel)

    const res = await this.operation.getItem({ ...accontSerializer.keys() })

    return HttpResponse.response(res)
  }

  handlerCreateClient: ValidatedEventAPIGatewayProxyEvent<
    typeof createSchemaClient
  > = async (event) => {
    const { account, email, fullName, phone } = event.body

    const clientModel = new CaseModel(
      uuid(),
      account,
      StatePersonalShopper.REQUESTING,
      AdviserUnAssigned,
      fullName,
      email,
      phone,
      new Date().getTime()
    )

    const accontSerializer = new ClientSerializer(clientModel)

    const res = await this.operation.create(accontSerializer.toItems())

    return HttpResponse.response(res)
  }

  handlerUpdateClient: ValidatedEventAPIGatewayProxyEvent<
    typeof updateSchemaClient
  > = async (event) => {
    const { case: case_ } = event.pathParameters
    const { account, email, fullName, phone, advisor, state } = event.body

    const clientModel = new CaseModel(
      case_,
      account,
      state,
      advisor,
      fullName,
      email,
      phone
    )

    const accontSerializer = new ClientSerializer(clientModel)

    const res = await this.operation.updateItem(accontSerializer.keys(), {
      ...accontSerializer.toRemoveKey(),
    })

    return HttpResponse.response(res)
  }
}

const clientStoreInfrastructure = new CaseInfrastructure(tableName)
const clientEventInfrastructure = new CaseEventInfrastructure()
const meetingInfrastructure = new ChimeInfrastructure(chime)
const persistenceMeetingInfrastructure = new PersistenceInfrastructure(
  ddb,
  tableMeeting
)

const meetingApplication = new MeetingApplication(
  meetingInfrastructure,
  persistenceMeetingInfrastructure
)

const clientApplication = new CaseApplication(
  clientStoreInfrastructure,
  clientEventInfrastructure,
  meetingApplication
)

const clientAdapter = new ClientHttpAdapter(clientApplication)

export const handlerGetClient = middyfy(clientAdapter.handlerGetClient)
export const handlerGetClientForState = middyfy(
  clientAdapter.handlerGetClientForState
)

export const handlerUpdateClient = middyfy(
  clientAdapter.handlerUpdateClient,
  updateSchemaClient
)
export const handlerCreateClient = middyfy(
  clientAdapter.handlerCreateClient,
  createSchemaClient
)

export const handlerJoinClient = middyfy(clientAdapter.joinClient)
