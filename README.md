# Docket

Docket is a web Frontend to Google Stenographer

![Docket Video](docket.gif)  

---

## Setup

The following is based on the assumption that you already have Stenographer installed with gRPC enabled.

Testing has only been done against the master branch of Kibana. See [this article](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md#setting-up-your-development-environment) for instructions on creating a Kibana development environment.

1. Download this repo to `kibana/plugins/docket`

2. Create `/etc/docket/config.yaml` with the following contents, substituting your own information:

```
esClientConf: {
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'changeme',
  }
}
stenoKey: '/etc/stenographer/certs/docket_client.key'
stenoCert: '/etc/stenographer/certs/docket_client.crt'
stenoCaCert: '/etc/stenographer/certs/stenographer.crt'
stenoHost: 'ip.or.host.name:5000'
pcapPath: '/tmp/docket'
```

The Elasticsearch user should have rights to create an index named `.docket`
