import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { ClientSerializer } from 'src/client/domain/client.serializer'
import { HttpResponse } from '@shared/http/http.response'

import { ClientEventInfrastructure } from '../../infrastructure/client.event.infrastructure'
import { ClientModel } from '../../domain/client.model'
import { ClientInfrastructure } from '../../infrastructure/client.store.infrastructure'
import { ClientApplication } from '../../application/client.application'
import { createSchemaClient, updateSchemaClient } from './schema'

const tableName = process.env.PERSONAL_SHOPPER_TABLE

class ClientHttpAdapter {
  constructor(private operation: ClientApplication) {}

  handlerGetClient = async (event) => {
    const { client } = event.pathParameters
    const clientModel = new ClientModel(client)
    const accontSerializer = new ClientSerializer(clientModel)

    const res = await this.operation.getItem({ ...accontSerializer.keys() })

    return HttpResponse.response(res)
  }

  handlerGetClientForState = async (event) => {
    const { account, state } = event.pathParameters

    const res = await this.operation.getClientForState(account, state)

    return HttpResponse.response(res)
  }

  handlerCreateClient: ValidatedEventAPIGatewayProxyEvent<
    typeof createSchemaClient
  > = async (event) => {
    const { id, account, email, fullName, phone } = event.body

    const clientModel = new ClientModel(
      id,
      account,
      'REQUESTING',
      undefined,
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
    const { client } = event.pathParameters
    const { account, email, fullName, phone, advisor, state } = event.body

    const clientModel = new ClientModel(
      client,
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

const clientStoreInfrastructure = new ClientInfrastructure(tableName)
const clientEventInfrastructure = new ClientEventInfrastructure()

const clientApplication = new ClientApplication(
  clientStoreInfrastructure,
  clientEventInfrastructure
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
