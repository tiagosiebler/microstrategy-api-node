const EnumDSSCubeStates = Object.freeze({
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
});

module.exports = EnumDSSCubeStates;