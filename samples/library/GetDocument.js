const mstr = require("../../lib/mstr");

(async() => {
    const baseUrl = "http://10.23.1.124:8080/MicroStrategyLibrary/api";
    const mstrApi = new mstr.REST({
        baseUrl: baseUrl
    });

    await mstrApi.login({
        username: 'Administrator',
        password: '',
        loginMode: 1
    });

    // MicroStrategy Tutorial
    const projectId = "B19DEDCC11D4E0EFC000EB9495D0F44F";
    mstrApi.setProjectId(projectId);

    //Document id:
    const documentId =  'C866FC0B417F8BD4DBBC07BE57C83413';

    //Fields to retrieve
    //const fields = 'id,elements';
    const fields = null;
    const libraryAPI = mstrApi.library;

    try{
        const documentResult = await libraryAPI.getDocument(projectId, documentId, fields);
    console.log(JSON.stringify(documentResult, null, 2));
    console.log("Finished getting document");
    } catch (e){
        console.error(e);
    }
    
await mstrApi.logout();



})();

