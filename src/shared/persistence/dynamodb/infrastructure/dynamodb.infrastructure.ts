import { ddb } from '@libs/aws'
import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'
import type Result from '@shared/persistence/dynamodb/application/result.interface'

export default class DynamoDBService<T> {
  constructor(public readonly tableName: string, protected db = ddb) {}

  create = async (data: T): Promise<Result<T>> => {
    await this.db
      .put({
        TableName: this.tableName,
        Item: {
          ...data,
        },
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      })
      .promise()

    return ResponseDto('123', data)
  }

  updateItem = async (
    key: Record<string, string>,
    data: T
  ): Promise<Result<T>> => {
    Object.keys(data).forEach((key_) => {
      if (data[key_] === undefined) {
        delete data[key_]
      }
    })
    const updateFormat = Object.entries(data).reduce(
      (acc, [key_, value]) => ({
        UpdateExpression: `${acc.UpdateExpression} #${key_} = :${key_},`,
        ExpressionAttributeValues: {
          ...acc.ExpressionAttributeValues,
          [`:${key_}`]: value,
        },
        ExpressionAttributeNames: {
          ...acc.ExpressionAttributeNames,
          [`#${key_}`]: key_,
        },
      }),
      {
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        UpdateExpression: 'SET',
      }
    )

    await this.db
      .update({
        TableName: this.tableName,
        Key: key,
        ...updateFormat,
        UpdateExpression: `${updateFormat.UpdateExpression}`.slice(0, -1),
        ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
      })
      .promise()

    return ResponseDto('123', { ...key, ...data } as T)
  }

  getItem = async (key: Record<string, string>): Promise<Result<T>> => {
    const response = await this.db
      .get({
        TableName: this.tableName,
        Key: {
          ...key,
        },
      })
      .promise()

    return ResponseDto('123', response.Item)
  }
}
