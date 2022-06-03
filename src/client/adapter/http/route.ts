import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { ClientSerializer } from 'src/client/domain/client.serializer'
import { HttpResponse } from '@shared/http/http.response'

import { ClientModel } from '../../domain/client.model'
import { ClientInfrastructure } from '../../infrastructure/client.infrastructure'
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

const clientInfrastructure = new ClientInfrastructure(tableName)
const clientApplication = new ClientApplication(clientInfrastructure)
const clientAdapter = new ClientHttpAdapter(clientApplication)

export const handlerGetClient = middyfy(clientAdapter.handlerGetClient)
export const handlerUpdateClient = middyfy(
  clientAdapter.handlerUpdateClient,
  updateSchemaClient
)
export const handlerCreateClient = middyfy(
  clientAdapter.handlerCreateClient,
  createSchemaClient
)
