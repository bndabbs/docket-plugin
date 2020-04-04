export const mapping = {
      properties: {
        '\u0040timestamp': {
          type: 'date'
        },
        config: {
          properties: {
            chunk_size: {
              type: 'integer',
            },
            max_size: {
              type: 'integer',
            },
            steno_hosts: {
              type: 'nested',
            }
          }
        },
        stenographer: {
          properties: {
            host: {
              type: 'keyword'
            }
          }
        },
        request: {
          properties: {
            user: {
              type: 'text',
            },
            start: {
              type: 'keyword',
            },
            end: {
              type: 'keyword',
            },
            query: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
            tcpdump: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              }
            }
          }
        },
        response: {
          properties: {
            status: {
              properties: {
                code: {
                  type: 'byte'
                },
                details: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  }
                },
                metadata: {
                  properties: {
                    flags: {
                      type: 'byte'
                    }
                  }
                }
              }
            },
            bytes: {
              type: 'long',
            },
          }
        }
      }
}
