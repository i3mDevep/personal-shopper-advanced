import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@shared/helper/middyfy.lambda'
import { AccountSerializer } from 'src/account/domain/account.serializer'
import { HttpResponse } from '@shared/http/http.response'

import { AccountModel } from '../../domain/account.model'
import { AccountInfrastructure } from '../../infrastructure/account.infrastructure'
import { AccountApplication } from '../../application/account.application'
import { createSchemaAccount, updateSchemaAccount } from './schemas'

const tableName = process.env.PERSONAL_SHOPPER_TABLE

class AccountHttpAdapter {
  constructor(private operation: AccountApplication) {}

  handlerGet: ValidatedEventAPIGatewayProxyEvent<typeof createSchemaAccount> =
    async (event) => {
      const { account } = event.pathParameters
      const accountModel = new AccountModel(account)
      const accontSerializer = new AccountSerializer(accountModel)

      const res = await this.operation.getItem({
        PK: accontSerializer.pk,
        SK: accontSerializer.sk,
      })

      return HttpResponse.response(res)
    }

  handlerCreateAccount: ValidatedEventAPIGatewayProxyEvent<
    typeof updateSchemaAccount
  > = async (event) => {
    const { account, storeName, urlCss, templateEmail, templateNotifyClient } =
      event.body

    const accountModel = new AccountModel(
      account,
      storeName,
      urlCss,
      true,
      templateEmail,
      templateNotifyClient
    )

    const accontSerializer = new AccountSerializer(accountModel)
    const res = await this.operation.create(accontSerializer.toItems())

    return HttpResponse.response(res)
  }

  handlerUpdateAccount: ValidatedEventAPIGatewayProxyEvent<
    typeof updateSchemaAccount
  > = async (event) => {
    const { account } = event.pathParameters
    const { storeName, urlCss, templateEmail, templateNotifyClient, active } =
      event.body

    const accountModel = new AccountModel(
      account,
      storeName,
      urlCss,
      active ?? true,
      templateEmail,
      templateNotifyClient
    )

    const accontSerializer = new AccountSerializer(accountModel)

    const res = await this.operation.updateItem(accontSerializer.keys(), {
      ...accontSerializer.toRemoveKey(),
    })

    return HttpResponse.response(res)
  }
}

const accountInfrastructure = new AccountInfrastructure(tableName)
const accountApplication = new AccountApplication(accountInfrastructure)
const accountAdapter = new AccountHttpAdapter(accountApplication)

export const handlerGetAccount = middyfy(accountAdapter.handlerGet)
export const handlerUpdateAccount = middyfy(
  accountAdapter.handlerUpdateAccount,
  updateSchemaAccount
)
export const handlerCreateAccount = middyfy(
  accountAdapter.handlerCreateAccount,
  createSchemaAccount
)
