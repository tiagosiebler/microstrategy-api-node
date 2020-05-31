const mstr = require("../../lib/mstr");

(async () => {
    const baseUrl = "http://10.23.1.124:8080/MicroStrategyLibrary/api";
    const mstrApi = new mstr.REST({
        baseUrl: baseUrl
    });

    await mstrApi.login({
        username: 'Administrator',
        password: '',
        loginMode: 1
    });

    //MicroStrategy Tutorial
    const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    mstrApi.setProjectId(projectId);
    
    //Document to publish
    const documentID = 'C866FC0B417F8BD4DBBC07BE57C83413';

    //User the document is published to
    //Administrator
    const recipientID = '54F3D26011D2896560009A8E67019608';

    //Prose.
    //const recipientID = 'E96A7AC111D4BBCE10004694316DE8A4';
    
    const libraryAPI = mstrApi.library;

    try{
        const body = {
            id: documentID,
            recipients: [
                {
                    id: recipientID
                }
            ],
            isInstance: false
        }

        console.log('Publishing to Library with body: ' , JSON.stringify(body, null, 2 ));
        const response = await libraryAPI.publishToLibrary(projectId, body);
    } catch (e){
        console.error(e);
    }

    await mstrApi.logout();
})();