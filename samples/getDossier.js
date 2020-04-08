const mstr = require('../lib/mstr.js');

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

  const DossierAPI = mstrApi.dossiersAndDocuments;

  try {
    const dossierId = 'C103CFA847057FC9FCF772ADF9092BD9';
    const dossierDefn = await DossierAPI.getDossierDefinition(dossierId);

    const dossierInstanceState = await DossierAPI.createDossierInstance(dossierId);
    const dossierInstanceId = dossierInstanceState.mid;

    console.log(`\tDossier instance ID: ${dossierInstanceId}`);
    for (const chapter of dossierDefn.chapters) {
      console.log(`\t\tChapter: ${chapter.name}`);

      const chapterKey = chapter.key;
      for (const page of chapter.pages) {
        for (const visualization of page.visualizations) {
          const visualizationKey = visualization.key;

          const params = {
            dossierId: dossierId,
            instanceId: dossierInstanceId,
            chapterKey: chapterKey,
            visualizationKey: visualizationKey
          }

          const visResult = await DossierAPI.getDossierVisualization(params);
          console.log('visResult: ', JSON.stringify(visResult, null, 2));
        }
      }
    }

    console.log('EOF');
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();