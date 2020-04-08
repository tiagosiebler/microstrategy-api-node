const mstr = require('../../lib/mstr.js');

(async ()=> {
  const baseUrl = 'http://aps-tsiebler-vm:8080/2020u1Library/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl
  });

  await mstrApi.login({
    username: 'Administrator',
    password: '',
    loginMode: 1
  });

  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  const DatasetsAPI = mstrApi.datasets;

  try {
    // cube that was created via the REST API
    const targetDatasetId = '260319644637B3DAE447948C61FA7045';
    const targetTableId = 'EAE644D41713043D2791440866372812';

    const replacementData = [
      {
        "ID": "Example3",
        "SALES": 412312.222
      },
      {
        "ID": "Example4",
        "SALES": 32321.123
      }
    ];

    const rawDataString = JSON.stringify(replacementData);
    const rawDataBase64 = Buffer.from(rawDataString).toString('base64');

    const datasetBody = {
      name: 'EXAMPLE_TABLE_1',
      columnHeaders: [
        {
          name: 'ID',
          dataType: 'STRING'
        },
        {
          name: 'SALES',
          dataType: 'DOUBLE'
        }
      ],
      data: rawDataBase64
    }

    console.log('Replacing dataset with body: ', JSON.stringify(datasetBody, null, 2));

    const cubeDefinition = await DatasetsAPI.updateDataset(targetDatasetId, targetTableId, datasetBody, 'Replace');
    console.log('success: ', JSON.stringify(cubeDefinition, null, 2));

  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();