const mstr = require("../../lib/mstr.js");

(async () => {
  const baseUrl =
    "http://sup-w-003364.labs.microstrategy.com:8080/MicroStrategyLibrary/api";
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
  const libraryResult = await libraryAPI.getLibrary(fields, "FILTER_TOC");
  console.log(JSON.stringify(libraryResult, null, 2));
})();
