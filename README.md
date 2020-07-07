# MicroStrategy REST API [![npm version](https://img.shields.io/npm/v/microstrategy.svg)][1] [![npm size](https://img.shields.io/bundlephobia/min/microstrategy.svg)][1] [![npm downloads](https://img.shields.io/npm/dt/microstrategy.svg)][1]
![NPM Publish](https://github.com/tiagosiebler/microstrategy-api-node/workflows/Publish%20to%20NPM/badge.svg?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/tiagosiebler/microstrategy-api-node/badge)](https://www.codefactor.io/repository/github/tiagosiebler/microstrategy-api-node)

A light npm wrapper around some of the MicroStrategy REST API endpoints.

## Dependencies
HTTP requests are handled by [axios](https://www.npmjs.com/package/axios), the promise based HTTP client for the browser and node.js.

## Installation
### Node Environments
#### npm
```
npm i microstrategy --save
```

#### yarn
```
yarn add microstrategy
```

### HTML Pages
This module can be used on any HTML page using the bundled `dist/mstrapi.min.js` file. Simply include this script tag on any page:
```html
<script src="https://cdn.jsdelivr.net/gh/tiagosiebler/microstrategy-api-node/dist/mstrapi.min.js" crossorigin="anonymous"></script>
```

See [./webpack](./webpack) for documentation on the bundling process.

## MicroStrategy REST API
- Import the module and create a new instance of the REST client.
- Provide a URL to your MicroStrategy Library REST API via the baseUrl parameter.
- Login & Logout methods are exposed on the REST client. Other methods are grouped by topic.
- Every REST method returns a Promise, making this library [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ready.
- By default, your session state headers are stored and persisted by your client instance.

```javascript
const mstr = require('microstrategy');

(async () => {
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

### REST API Documentation
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

### More REST API Samples
Refer to the [samples](./samples/) folder for more samples tested in node.js. These can be directly executed using the node command:
```bash
node samples/getDossier.js
```

### Missing REST APIs
If you notice any missing endpoints, please contribute with a PR to enhance this module.

## MicroStrategy Task API
This module includes a minimal wrapper to execute tasks via the Task API.

- Import the module and create a new instance of the TaskAPI client.
- Provide a URL to your MicroStrategy Web taskProc via the taskProcUrl parameter.
- Build a request via the `executeTask()` method.


```javascript
const mstr = require('microstrategy');

(async () => {
  const taskApi = new mstr.TaskAPI({
    taskProcUrl: 'http://aps-tsiebler-vm:8080/2020u1/servlet/taskProc'
  });

  const taskId = 'login';

  // Collect these from the task builder page
  const taskParameters = {
    server: 'aps-tsiebler-vm',
    project: 'MicroStrategy Tutorial',
    userid: 'administrator',
    password: ''
  };

  // The response includes { body, headers, status, statusText }
  try {
    const res = await taskApi.executeTask(taskId, taskParameters);
    console.log('task response: ', res.body);
  } catch (e) {
    console.error(e);
  }
})();
```

[1]: https://www.npmjs.com/package/microstrategy
