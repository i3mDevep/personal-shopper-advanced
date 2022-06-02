import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { HttpResponse } from '@shared/http/http.response'

import { AdviserSerializer } from '../../domain/adviser.serializer'
import { AdviserModel } from '../../domain/adviser.model'
import { AdviserInfrastructure } from '../../infrastructure/adviser.infrastructure'
import { AdviserApplication } from '../../application/adviser.application'
import { updateSchemaAdviser, createSchemaAdviser } from './schema'

const tableName = process.env.PERSONAL_SHOPPER_TABLE

class AdviserHttpAdapter {
  constructor(private operation: AdviserApplication) {}

  handlerGetAdviser = async (event) => {
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
      'AVAILABLE',
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

  handlerAdviserForAccount = async (event) => {
    const { account } = event.pathParameters

    const res = await this.operation.getAdviserForAccount(account)

    return HttpResponse.response(res)
  }

  handlerAdviserForState = async (event) => {
    const { state, account } = event.pathParameters

    const res = await this.operation.getAdviserForState(account, state)

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

const adviserInfrastructure = new AdviserInfrastructure(tableName)
const adviserApplication = new AdviserApplication(adviserInfrastructure)
const adviserAdapter = new AdviserHttpAdapter(adviserApplication)

export const handlerGetAdviser = middyfy(adviserAdapter.handlerGetAdviser)

export const handlerCreateAdviser = middyfy(
  adviserAdapter.handlerCreateAdviser,
  createSchemaAdviser
)

export const handlerAdviserForAccount = middyfy(
  adviserAdapter.handlerAdviserForAccount
)

export const handlerAdviserForState = middyfy(
  adviserAdapter.handlerAdviserForState
)

export const handlerUpdateAdviser = middyfy(
  adviserAdapter.handlerUpdateAdviser,
  updateSchemaAdviser
)
