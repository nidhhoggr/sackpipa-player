export const _base = {
  soundFontDir: "midi-js-soundfonts/FluidR3_GM/",
  errorReloadLimit: 5,
  errorReloadResetDuration: 20000,//in milliseconds
  shouldDebug: true,
  debugDisabledModules: [],//"state"],//disable debugging in these modules,
  mobileMaxWidth: 555//width exceeding beyond are not considered mobile
}

export const player = {
  currentInstrumentIndex: 109,
  refreshWhenPossible: false,
  getSoundFontUrl: (config) =>  window.location.hostname.includes(config.prodDomain) ? `https://${config.prodDomain}/${config.soundFontDir}` : `http://localhost:3000/${config.soundFontDir}`,
  keyCodes: {
    prev: 118,
    next: 120,
    play: 119,
    esc: 27,
    refresh: 116,
    fullscreen: 70,
  },
  showPlayableNoteNamesInScroller: true,
  showSheetMusic: true,
  showNoteDiagram: true,
  stateAssessmentLoopInterval: 5000,//how often to check the state,
  stateAssessmentInactivityTimeout: 60000 * 60,
  tempoLimits: {
    min: 20,
    max: 180,
  },
  transpositionLimits: {
    min: -12,
    max: 12
  },
  visualOptions: {
    displayWarp: false,
    displayLoop: false,
    displayRestart: false,
    displayPlay: false,
    displayProgress: false
  },
  abcOptions: {
    bagpipes: true,
    add_classes: true,
    responsive: "resize",
  },
  abcSongEditorDefaultText: `%%abc-charset utf-8
X: Reference Number
T: Title
S: Subtitle
R: Rhythm
Z: Transcriber
M:3/4
L:1/8
Q: "BPM=100"
K:Am fgp=1 transpose=0 tuning=0
| A, D ^D E F ^F G ^G A ^A B C' ^C' D' ^D' E' |`
};

export const instrument = {
  tuningKey: "E/A",
  dronesEnabled: ["E4","A3"],
  isFirstGroupPlugged: true,//on all chnaters the high d note on the E/A tuning
  isSecondGroupPlugged: false,//only on D/G and C/F tunings
  dronesSynth: null,//should be an instance of the instrumentDroneSynth above,
  playableExtraNotes: {
    0: {//for the E/A tuning
      "Db": [63, 75],
      "F": 65,
      "Bb": [70]
    },
  }
}

export const hps = {
  ease: 0.025,
  sectionWidth: 58,
  sectionOffset: 0,
  wrapperName: ".scrollingNotesWrapper"
}
