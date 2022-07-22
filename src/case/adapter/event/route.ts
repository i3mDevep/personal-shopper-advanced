import type { EventBridgeHandler } from 'aws-lambda'
import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { HttpResponse as Response } from '@shared/http/http.response'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { StatePersonalShopper } from '@shared/helper/state.personal-shoper'

import { ClientSerializer } from '../../domain/case.serializer'
import { CaseModel } from '../../domain/case.model'
import { CaseInfrastructure } from '../../infrastructure/case.store.infrastructure'
import { CaseApplication } from '../../application/case.application'
import { CaseEventInfrastructure } from '../../infrastructure/case.event.infrastructure'
import type { ClientAcceptedSchema, ClientSchema } from './schema'

const tableName = process.env.PERSONAL_SHOPPER_TABLE

class ClientEventAdapter {
  constructor(private operation: CaseApplication) {}
  handleClientCanceled: EventBridgeHandler<
    string,
    typeof ClientSchema,
    unknown
  > = async (event) => {
    const { id, PK, SK } = event.detail
    const clientModel = new CaseModel(
      id,
      undefined,
      StatePersonalShopper.CANCELED_UNAVAILABLE_ADVISER
    )

    const accontSerializer = new ClientSerializer(clientModel)

    await this.operation.updateItem(
      { PK, SK },
      { ...accontSerializer.toRemoveKey() }
    )

    return Response.response({
      message: 'Event Bridge Lambda OK CaseEventAdapter',
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

    const clientModel = new CaseModel(
      client,
      account,
      StatePersonalShopper.ACCEPTED,
      email
    )

    const accontSerializer = new ClientSerializer(clientModel)

    const pk = `${ID.Case}#${client}`

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

const clientInfrastructure = new CaseInfrastructure(tableName)
const clientEventInfrastructure = new CaseEventInfrastructure()
const clientApplication = new CaseApplication(
  clientInfrastructure,
  clientEventInfrastructure
)

const clientAdapter = new ClientEventAdapter(clientApplication)

export const handleClientCanceled = middyfy(clientAdapter.handleClientCanceled)
export const handleClientAccepted = middyfy(clientAdapter.handleClientAccepted)
