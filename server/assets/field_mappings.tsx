export const configMapping = {
  properties: {
    stenographer: {
      properties: {
        host: {
          type: 'keyword',
        },
        port: {
          type: 'long',
        },
      },
    },
  },
};

export const queryMapping = {
  properties: {
    timestamp: {
      type: 'date',
    },
    request: {
      properties: {
        start: {
          type: 'keyword',
        },
        end: {
          type: 'keyword',
        },
        id: {
          type: 'keyword',
        },
        query: {
          type: 'keyword',
        },
      },
    },
    response: {
      properties: {
        status: {
          properties: {
            code: {
              type: 'byte',
            },
            details: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
            metadata: {
              properties: {
                flags: {
                  type: 'byte',
                },
              },
            },
          },
        },
        bytes: {
          type: 'long',
        },
      },
    },
  },
};
