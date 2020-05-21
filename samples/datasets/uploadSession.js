const mstr = require('../../lib/mstr.js');

// Simple util function that resolves a promise after a timeout in MS;
const promiseSleep = timeoutMS => {
  return new Promise(resolve => setTimeout(resolve, timeoutMS));
}

/*
  Upload Session Sample - Multi-Table Dataset

  This demonstration:
  - creates a mulit-table dataset (cube) and saves it in the "Shared Reports" folder.
  - prepares an upload session for this dataset
  - adds some data to this dataset in 2 chunks
  - publishes the cube
*/
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
  mstrApi.setProjectId('B19DEDCC11D4E0EFC000EB9495D0F44F');

  const DatasetsAPI = mstrApi.datasets;

  try {
    // shared reports folder
    const targetFolderId = 'D3C7D461F69C4610AA6BAA5EF51F4125';

    // prepare tables for our new dataset
    const table1 = {
      name: 'EXAMPLE_TABLE_1',
      columnHeaders: [
        {
          name: 'PRODUCT_ID',
          dataType: 'STRING'
        },
        {
          name: 'SALES',
          dataType: 'DOUBLE'
        }
      ]
    };
    const table2 = {
      name: 'EXAMPLE_TABLE_2',
      columnHeaders: [
        {
          name: 'PRODUCT_ID',
          dataType: 'STRING'
        },
        {
          name: 'DOWNLOADS',
          dataType: 'DOUBLE'
        }
      ]
    };

    // metric definitions
    const metric1 = {
      name: 'Sales',
      expressions: [
        {
          tableName: 'EXAMPLE_TABLE_1',
          columnName: 'SALES',
        }
      ]
    };
    const metric2 = {
      name: 'Downloads',
      expressions: [
        {
          tableName: 'EXAMPLE_TABLE_2',
          columnName: 'DOWNLOADS',
        }
      ]
    };

    // attribute definitions
    const attribute1 = {
      name: "Product ID",
      attributeForms: [
        {
          category: 'ID',
          expressions: [
            { tableName: 'EXAMPLE_TABLE_1', columnName: 'PRODUCT_ID' },
            { tableName: 'EXAMPLE_TABLE_2', columnName: 'PRODUCT_ID' },
          ]
        }
      ]
    };

    const tables = [table1, table2];
    const metrics = [metric1, metric2];
    const attributes = [attribute1];

    // Schema of new dataset
    const newMultiTableDataset = {
      name: 'Cube created via node.js upload session',
      description: 'Example from node module',
      folderId: targetFolderId,
      tables: tables,
      metrics: metrics,
      attributes: attributes
    };
    console.log(`Creating cube with definition: `, JSON.stringify(newMultiTableDataset, null, 2));

    // Trigger API to create dataset
    const datasetCreationResult = await DatasetsAPI.createMultiTableDataset(newMultiTableDataset);
    console.log(`Multi-table dataset created with result: `, datasetCreationResult);

    const datasetId = datasetCreationResult.id;
    const datasetName = datasetCreationResult.name;

    // Prepare upload session to add data to our new dataset:
    const targetTableName = 'EXAMPLE_TABLE_2';
    const tablesFormatting = {
      tables: [
        {
          name: targetTableName,
          updatePolicy: 'ADD',//[ ADD, UPDATE, UPSERT, REPLACE ]
          orientation: 'ROW',// or column
          columnHeaders: ['PRODUCT_ID','DOWNLOADS']
        }
      ]
    };
    const uploadSessionId = await DatasetsAPI.createUploadSession(datasetId, tablesFormatting);
    console.log(`Multi-table upload session ready with uploadSessionId: ${uploadSessionId}`);

    // Cube created, upload session ready, add some data in chunks, starting with first chunk
    let uploadChunkIndex = 1;

    // Upload first slice of data
    const rows = [];
    rows.push(['1', 55]);
    rows.push(['2', 3]);
    rows.push(['3', 92]);
    rows.push(['4', 123]);
    const uploadResponse1 = await DatasetsAPI.uploadDataToUploadSession(datasetId, uploadSessionId, targetTableName, uploadChunkIndex, rows);
    console.log('uploadResponse1: ', uploadResponse1);

    // Upload more data
    uploadChunkIndex++;
    const moreRows = [];
    moreRows.push(['5', 15]);
    moreRows.push(['6', 1]);
    moreRows.push(['7', 12]);
    moreRows.push(['8', 113]);
    const uploadResponse2 = await DatasetsAPI.uploadDataToUploadSession(datasetId, uploadSessionId, targetTableName, uploadChunkIndex, moreRows);
    console.log('uploadResponse2: ', uploadResponse2);

    // Finished uploading data, publish cube to prepare for use:
    const publishResult = await DatasetsAPI.publishUploadSessionDataset(datasetId, uploadSessionId);
    console.log('Publishing updated cube: ', publishResult);

    // Publishing can take some time - this simple loop blocks the thread to check every second (up to 30 retries) if the cube is published (status == 1)
    let publishSuccess = false;
    for (let publishPollAttempts = 0;publishPollAttempts < 30;publishPollAttempts++) {
      const uploadStatusResponse = await DatasetsAPI.getUploadSessionStatus(datasetId, uploadSessionId);
      console.log(`Publish status check attempt ${publishPollAttempts + 1}: `, uploadStatusResponse);

      if (uploadStatusResponse.status == 1) {
        console.log(`-> Cube ready for use: `, uploadStatusResponse);
        publishSuccess = true;
        break;
      }

      if (uploadStatusResponse.status != 1) {
        console.log(`-> Cube not ready yet: `, uploadStatusResponse);
        // sleep one second before checking again
        await promiseSleep(1 * 1000);
      }
    }

    console.log('End of upload session workflow - success state: ' + publishSuccess);

  } catch (e) {
    console.error('upload workflow error: ', e && e.stack || e);
  }

  await mstrApi.logout();
})();