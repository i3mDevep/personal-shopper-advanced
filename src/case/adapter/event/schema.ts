export const ClientSchema = {
  PK: 'string',
  SK: 'string',
  id: 'string',
  required: ['PK', 'SK', 'id'],
}

export const ClientAcceptedSchema = {
  payload: {
    data: {
      PK: 'string',
      SK: 'string',
      account: 'string',
      fullName: 'string',
      client: 'string',
      email: 'string',
      JoinInfo: {
        Title: 'string',
        Meeting: 'object',
      },
    },
  },
}
