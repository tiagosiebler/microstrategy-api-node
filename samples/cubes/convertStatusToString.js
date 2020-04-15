module.exports = (status) => {
  const EnumDSSCubeStates = {
    DssCubeReserved : 0,
    DssCubeProcessing : 1,
    DssCubeActive : 2,
    DssCubePersisted : 4,
    DssCubeInfoDirty : 8,
    DssCubeDirty : 16,
    DssCubeLoaded : 32,
    DssCubeReady : 64,
    DssCubeLoadPending : 128,
    DssCubeUnloadPending : 256,
    DssCubePendingForEngine : 512,
    DssCubeImported : 1024,
    DssCubeForeign : 2048,
    DssCubeRemapDirty : 4096,
    DssCubeUpgrade : 8192,
    DssCubeEmma : 16384,
    DssCubeFromMSTRFile : 32768,
    DssCubeHidden : 65536
  }
  let results = {};
  if(status>=EnumDSSCubeStates.DssCubeHidden){
    results.hidden = true;
    status -= EnumDSSCubeStates.DssCubeHidden;
  }
  if(status>=EnumDSSCubeStates.DssCubeFromMSTRFile){
    results.fromMSTRFile = true;
    status -= EnumDSSCubeStates.DssCubeFromMSTRFile;
  } 
  if(status>=EnumDSSCubeStates.DssCubeEmma){
    results.emma = true;
    status -= EnumDSSCubeStates.DssCubeEmma;
  } 
  if(status>=EnumDSSCubeStates.DssCubeUpgrade){
    results.upgrade = true;
    status -= EnumDSSCubeStates.DssCubeUpgrade;
  } 
  if(status>=EnumDSSCubeStates.DssCubeRemapDirty){
    results.remapDirty = true;
    status -= EnumDSSCubeStates.DssCubeRemapDirty;
  } 
  if(status>=EnumDSSCubeStates.DssCubeForeign){
    results.foreign = true;
    status -= EnumDSSCubeStates.DssCubeForeign;
  } 
  if(status>=EnumDSSCubeStates.DssCubeImported){
    results.imported = true;
    status -= EnumDSSCubeStates.DssCubeImported;
  } 
  if(status>=EnumDSSCubeStates.DssCubePendingForEngine){
    results.pendingForEngine = true;
    status -= EnumDSSCubeStates.DssCubePendingForEngine;
  } 
  if(status>=EnumDSSCubeStates.DssCubeUnloadPending){
    results.unloadPending = true;
    status -= EnumDSSCubeStates.DssCubeUnloadPending;
  } 
  if(status>=EnumDSSCubeStates.DssCubeLoadPending){
    results.loadPending = true;
    status -= EnumDSSCubeStates.DssCubeLoadPending;
  } 
  if(status>=EnumDSSCubeStates.DssCubeReady){
    results.ready = true;
    status -= EnumDSSCubeStates.DssCubeReady;
  } 
  if(status>=EnumDSSCubeStates.DssCubeLoaded){
    results.loaded = true;
    status -= EnumDSSCubeStates.DssCubeLoaded;
  } 
  if(status>=EnumDSSCubeStates.DssCubeDirty){
    results.dirty = true;
    status -= EnumDSSCubeStates.DssCubeDirty;
  } 
  if(status>=EnumDSSCubeStates.DssCubeInfoDirty){
    results.infoDirty = true;
    status -= EnumDSSCubeStates.DssCubeInfoDirty;
  } 
  if(status>=EnumDSSCubeStates.DssCubePersisted){
    results.persisted = true;
    status -= EnumDSSCubeStates.DssCubePersisted;
  } 
  if(status>=EnumDSSCubeStates.DssCubeActive){
    results.active = true;
    status -= EnumDSSCubeStates.DssCubeActive;
  } 
  if(status>=EnumDSSCubeStates.DssCubeProcessing){
    results.processing = true;
    status -= EnumDSSCubeStates.DssCubeProcessing;
  } 
  if(status>=EnumDSSCubeStates.DssCubeReserved){
    results.reserved = true;
    status -= EnumDSSCubeStates.DssCubeReserved;
  }
  return results;
}