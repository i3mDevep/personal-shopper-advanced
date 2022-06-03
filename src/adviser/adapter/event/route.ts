import type { EventBridgeHandler } from 'aws-lambda'
import { HttpResponse as Response } from '@shared/http/http.response'
import { middyfy } from '@shared/helper/middyfy.lambda'

import { AdviserInfrastructure } from '../../infrastructure/adviser.infrastructure'
import { AdviserApplication } from '../../application/adviser.application'
import { AdviserEventInfrastructure } from '../../infrastructure/adviser.event.infrastructure'
import type { searchAvailableAdviserSchema } from './schema'

const tableName = process.env.PERSONAL_SHOPPER_TABLE

class AdviserEventAdapter {
  constructor(private operation: AdviserApplication) {}
  searchAdviserAvailable: EventBridgeHandler<
    string,
    typeof searchAvailableAdviserSchema,
    unknown
  > = async (event) => {
    await this.operation.advicerSearchAvailable(event.detail.payload.data)

    return Response.response({
      message: 'Event Bridge Lambda OK AdviserEventAdapter',
      input: event,
    })
  }
}

const adviserInfrastructure = new AdviserInfrastructure(tableName)
const adviserEventInfrastructure = new AdviserEventInfrastructure()
const adviserApplication = new AdviserApplication(
  adviserInfrastructure,
  adviserEventInfrastructure
)

const adviserAdapter = new AdviserEventAdapter(adviserApplication)

export const searchAdviserAvailable = middyfy(
  adviserAdapter.searchAdviserAvailable
)
