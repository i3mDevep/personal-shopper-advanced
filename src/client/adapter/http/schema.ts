export const createSchemaClient = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string' },
      },
      required: ['id', 'account', 'email', 'fullName'],
    },
  },
}

export const updateSchemaClient = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account: { type: 'string' },
        email: { type: 'string' },
        state: { type: 'string' },
        advisor: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string' },
      },
    },
  },
}
