export const createSchemaAccount = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        account: { type: 'string' },
        storeName: { type: 'string' },
        urlCss: { type: 'string' },
        templateEmail: { type: 'string' },
        templateNotifyClient: { type: 'string' },
      },
      required: [
        'account',
        'storeName',
        'templateEmail',
        'templateNotifyClient',
      ],
    },
  },
}

export const updateSchemaAccount = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        account: { type: 'string' },
        storeName: { type: 'string' },
        urlCss: { type: 'string' },
        templateEmail: { type: 'string' },
        templateNotifyClient: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['account'],
    },
  },
}
