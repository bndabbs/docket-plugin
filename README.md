# Docket

Docket is a web Frontend to Google Stenographer

![Docket Video](docket.gif)  

---

## Setup

The following is based on the assumption that you already have Stenographer installed with gRPC enabled.

This plugin has been built against the new [Kibana Platform](https://github.com/elastic/kibana/tree/master/src/core) and currently only works with source builds off of the Kibana master branch as a result.

Install the plugin:
```kibana-plugin install https://github.com/bndabbs/docket-plugin/releases/download/8.0.0-pre/docket-8.0.0-linux.zip```

The code block below lists the default configuration. You can change any of the defaults by adding the to your `kibana.yml` file. 
You will need to ensure that the user account running the Kibana binary has appropriate permissions to write to whatever paths are set for `certPath` and `pcapPath`.

```
docket:
  enabled: true
  certPath: '/etc/docket/certs'
  pcapPath: '/tmp/docket'
  elasticsearch:
    hosts:
      - 'http://localhost:9200'
    username:
    password:
```

Next you will need to generate certificates for Kibana and Stenographer to communicate securely. There are a variety of ways to go about this, but below is a working example using [certstrap](https://github.com/square/certstrap)

```bash
# Create the CA
certstrap init --common-name stenographer --key ca_key.pem

# Request a server cert for the Stenographer host and sign with the CA
certstrap --depot-path .  request-cert --common-name steno.dabbs.lan -ip 192.168.1.10,127.0.0.1 -domain steno.dabbs.lan,dabbs.lan
certstrap --depot-path . sign steno.dabbs.lan --CA stenographer

# Request a client cert for Kibana and sign with the CA
certstrap --depot-path .  request-cert --common-name kibana.dabbs.lan -ip 192.168.1.11,127.0.0.1 -domain kibana.dabbs.lan,dabbs.lan
certstrap --depot-path . sign kibana.dabbs.lan --CA stenographer

# Export the client cert to a PKCS12 bundle
openssl pkcs12 -export -out kibana.p12 -inkey kibana.dabbs.lan.key -in kibana.dabbs.lan.crt -certfile stenographer.crt
```
