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
    // shared reports folder
    const targetFolderId = 'D3C7D461F69C4610AA6BAA5EF51F4125';

    const rawStartingData = [
      {
        'ID': 'Example1',
        'SALES': 12345.222
      },
      {
        'ID': 'Example2',
        'SALES': 51231.123
      }
    ];

    const rawDataString = JSON.stringify(rawStartingData);
    const rawDataBase64 = Buffer.from(rawDataString).toString('base64');

    const newTables = [
      {
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
    ];

    const newAttributes = [
      {
        name: 'ID',
        attributeForms: [
          {
            category: 'ID',
            expressions: [
              { formula: 'EXAMPLE_TABLE_1.ID' }
            ]
          }
        ]
      }
    ];
    const newMetrics = [
      {
        name: 'Sales',
        expressions: [
          { formula: 'EXAMPLE_TABLE_1.SALES' }
        ]
      }
    ];

    const newDatasetBody = {
      name: 'EXAMPLE_NODE_DATASET',
      tables: newTables,
      attributes: newAttributes,
      metrics: newMetrics,
      folderId: targetFolderId
    };

    console.log('Creating new dataset with body: ', JSON.stringify(newDatasetBody, null, 2));

    const cubeDefinition = await DatasetsAPI.createDataset(newDatasetBody);
    console.log('success: ', JSON.stringify(cubeDefinition, null, 2));

  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();