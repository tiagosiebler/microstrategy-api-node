# MicroStrategy REST API [![npm version](https://img.shields.io/npm/v/microstrategy.svg)][1] [![npm size](https://img.shields.io/bundlephobia/min/microstrategy.svg)][1] [![npm downloads](https://img.shields.io/npm/dt/microstrategy.svg)][1]
![Publish to NPM](https://github.com/tiagosiebler/microstrategy-api-node/workflows/Publish%20to%20NPM/badge.svg?branch=master)

A light npm wrapper around some of the MicroStrategy REST API endpoints.

## Dependencies
HTTP requests are handled by [axios](https://www.npmjs.com/package/axios), the promise based HTTP client for the browser and node.js.

## Installation
### npm
```
npm i microstrategy --save
```

### yarn
```
yarn add microstrategy
```

## Getting Started
- Import the module and create a new instance of the REST client.
- Provide a URL to your MicroStrategy Library REST API via the baseUrl parameter.
- Login & Logout methods are exposed on the REST client. Other methods are grouped by topic.
- Every REST method returns a Promise, making this library [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ready.
- By default, your session state headers are stored and persisted by your client instance.

```javascript
const mstr = require('microstrategy');

(async ()=> {
  const baseUrl = 'http://aps-tsiebler-vm:8080/11.1GALibrary/api';
  const mstrClient = new mstr.REST({
    baseUrl: baseUrl
  });

  await mstrClient.login({
    username: 'Administrator',
    password: '',
    loginMode: 1
  });


  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrClient.setProjectId(projectId);

  const dossierId = 'C103CFA847057FC9FCF772ADF9092BD9';

  // APIs are grouped by topic
  const DossierAPI = mstrClient.dossiersAndDocuments;
  const dossierDefn = await DossierAPI.getDossierDefinition(dossierId);
})();
```

## REST API Documentation
These methods are simpler wrappers around the APIs exposed by the MicroStrategy Library REST API server. For full documentation, refer to your MicroStrategy Library's `api-docs` endpoint.

For example, if your MicroStrategy Library environment has the following URL:
```
http://example.com/MicroStrategyLibrary/
```

Your API documentation can be found here:
```
http://example.com/MicroStrategyLibrary/api-docs
```

For public REST API documentation from the MicroStrategy demo environment, refer to the following URL:
https://demo.microstrategy.com/MicroStrategyLibrary/api-docs

## More Samples
Refer to the [samples](./samples/) folder for more samples tested in node.js. These can be directly executed using the node command:
```bash
node samples/getDossier.js
```

## Missing APIs
If you notice any missing endpoints, please contribute with a PR to enhance this module.

[1]: https://www.npmjs.com/package/microstrategy
