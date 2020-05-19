export const configMapping = {
  properties: {
    stenographer: {
      properties: {
        host: {
          type: 'keyword'
        },
        client_key: {
          type: 'keyword'
        },
        client_certificate: {
          type: 'keyword'
        },
        certificate_authority: {
          type: 'keyword'
        },
        pcap_path: {
          type: 'keyword'
        }
      }
    }
  }
}

export const queryMapping = {
      properties: {
        '\u0040timestamp': {
          type: 'date'
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
