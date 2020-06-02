import { schema, TypeOf } from '@kbn/config-schema';

const hostURISchema = schema.uri({ scheme: ['http', 'https'] });

export type DocketConfigType = TypeOf<typeof config>;

export const config = schema.object({
  enabled: schema.boolean({ defaultValue: true }),
  elasticsearch: schema.object({
    hosts: schema.oneOf([hostURISchema, schema.arrayOf(hostURISchema, { minSize: 1 })], {
      defaultValue: ['http://localhost:9200'],
    }),
    username: schema.maybe(schema.string()),
    password: schema.maybe(schema.string()),
    ssl: schema.object({
      verificationMode: schema.oneOf(
        [schema.literal('none'), schema.literal('certificate'), schema.literal('full')],
        { defaultValue: 'full' }
      ),
      certificateAuthorities: schema.maybe(
        schema.oneOf([schema.string(), schema.arrayOf(schema.string(), { minSize: 1 })])
      ),
      certificate: schema.maybe(schema.string()),
      key: schema.maybe(schema.string()),
      keyPassphrase: schema.maybe(schema.string()),
      alwaysPresentCertificate: schema.boolean({ defaultValue: false }),
    }),
  }),
  pcapPath: schema.string({ defaultValue: '/tmp/docket' }),
  certPath: schema.string({ defaultValue: '/etc/docket/certs' }),
});
