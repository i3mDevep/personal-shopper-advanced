import type { EventBridgeHandler } from 'aws-lambda'
import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { HttpResponse as Response } from '@shared/http/http.response'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'

import { ClientSerializer } from '../../domain/client.serializer'
import { ClientModel } from '../../domain/client.model'
import { ClientInfrastructure } from '../../infrastructure/client.store.infrastructure'
import { ClientApplication } from '../../application/client.application'
import { ClientEventInfrastructure } from '../../infrastructure/client.event.infrastructure'
import type { ClientAcceptedSchema, ClientSchema } from './schema'

const tableName = process.env.PERSONAL_SHOPPER_TABLE

class ClientEventAdapter {
  constructor(private operation: ClientApplication) {}
  handleClientCanceled: EventBridgeHandler<
    string,
    typeof ClientSchema,
    unknown
  > = async (event) => {
    const { PK, SK } = event.detail

    await this.operation.updateItem(
      { PK, SK },
      { state: StatePersonalShopper.CANCELED_UNAVAILABLE_ADVISER }
    )

    return Response.response({
      message: 'Event Bridge Lambda OK ClientEventAdapter',
      input: event,
    })
  }

  handleClientAccepted: EventBridgeHandler<
    string,
    typeof ClientAcceptedSchema,
    unknown
  > = async (event) => {
    const {
      payload: {
        data: { account, client, email },
      },
    } = event.detail

    const clientModel = new ClientModel(
      client,
      account,
      StatePersonalShopper.ACCEPTED,
      email
    )

    const accontSerializer = new ClientSerializer(clientModel)

    const pk = `${ID.Client}#${client}`

    await this.operation.updateItem(
      { PK: pk, SK: pk },
      accontSerializer.toRemoveKey()
    )

    return Response.response({
      message: 'Event Bridge Lambda OK ClientAcceptedEventAdapter',
      input: event,
    })
  }
}

const clientInfrastructure = new ClientInfrastructure(tableName)
const clientEventInfrastructure = new ClientEventInfrastructure()
const clientApplication = new ClientApplication(
  clientInfrastructure,
  clientEventInfrastructure
)

const clientAdapter = new ClientEventAdapter(clientApplication)

export const handleClientCanceled = middyfy(clientAdapter.handleClientCanceled)
export const handleClientAccepted = middyfy(clientAdapter.handleClientAccepted)
