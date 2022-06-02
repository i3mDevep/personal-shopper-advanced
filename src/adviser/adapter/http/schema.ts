export const createSchemaAdviser = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        account: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string' },
        rules: {
          type: 'array',
        },
        schedules: {
          type: 'array',
        },
      },
      required: ['account', 'email', 'fullName', 'phone'],
    },
  },
}

export const updateSchemaAdviser = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        account: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string' },
        state: { type: 'string' },
        active: { type: 'boolean' },
        rules: {
          type: 'array',
        },
        schedules: {
          type: 'array',
        },
      },
    },
  },
}