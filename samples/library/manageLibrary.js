const mstr = require("../../lib/mstr.js");

(async () => {
  const baseUrl = "http://localhost:8080/112Library/api";
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl,
  });

  await mstrApi.login({
    username: "Administrator",
    password: "",
    loginMode: 1,
  });

  // MicroStrategy Tutorial
  const projectId = "B19DEDCC11D4E0EFC000EB9495D0F44F";
  mstrApi.setProjectId(projectId);
  const fields = "name,id";
  //const outputFlag = "DEFAULT";
  const libraryAPI = mstrApi.library;
  const libraryResult = await libraryAPI.getLibrary(fields);
  console.log(JSON.stringify(libraryResult, null, 2));
})();
