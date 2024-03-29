import _ from 'lodash';
import utils from "./utils";
const { isNumber, debug } = utils({from: "instrument"});
export const possibleTunings = ["E/A","D/G","C/F"];

function Instrument({
  tuningKeyIndex = 0,//the key of the tuning, EA, DG, 
  dronesSynth,//an instance of CreateSynth that plays the drone
  playableExtraNotes = {},//an object of playable notes because some instruments can play more notes,
  playableExtraNotesOptions = {},//an object of playable note descriptions
  dronesEnabled = [],//an array of notes for the drones enabled, uses ABC for pitches
  canPlayUnpluggedGroupsIndividually = false,//an advanced technique that we disable by default
  isFirstGroupPlugged = true,
  isSecondGroupPlugged = true,
  pitchToNoteName,//utility function to do what it says
}) {
  this.dronesSynth = dronesSynth;
  this.possibleTunings = possibleTunings;
  this.playableExtraNotes = playableExtraNotes[tuningKeyIndex];
  this.playableExtraNotesOptions = playableExtraNotesOptions[tuningKeyIndex];
  this.dronesEnabled = dronesEnabled;
  this.canPlayUnpluggedGroupsIndividually = canPlayUnpluggedGroupsIndividually;
  this.isFirstGroupPlugged = isFirstGroupPlugged;
  this.isSecondGroupPlugged = isSecondGroupPlugged;
  this.tuningKeyIndex = tuningKeyIndex;
  this.tuningKey = this.possibleTunings[tuningKeyIndex];
  this.pitchToNoteName = pitchToNoteName;
  this.setPitchRange();
}

export default Instrument;

Instrument.prototype.getTuningKeyAbbr = function getTuningKeyAbbr() {
  switch (this.tuningKey) {
    case "E/A": 
    case "D/G": 
    case "C/F":
      return _.replace(_.lowerCase(this.tuningKey)," ","");
    default:
      return "invalidTuningKey";
  }
}

Instrument.prototype.getLowestPlayablePitch = function() {
  const notes = this.getPlayableNotes({pitchesOnly: true});
  return _.min(notes);
}

Instrument.prototype.getHighestPlayablePitch = function() {
  const notes = this.getPlayableNotes({pitchesOnly: true});
  return _.max(notes);
}

Instrument.prototype.getPlayableNotes = function getPlayableNotes({tuningKey, notesOnly, pitchesOnly} = {}) {
  if (!tuningKey) tuningKey = this.tuningKey;
  let notes = {};
  let pitches = [];
  switch (tuningKey) {
    case "E/A": {
            // D    E    ^F    G    ^G    A    B    C'   ^C' 
            // D'   E'
      notes = {
        "D": [62,74],
        "E": [64,76],
        "Gb": 66,
        "G": 67, 
        "Ab": 68, 
        "A": 69,
        "B": 71,
        "C": 72,
        "Db": 73,
        //"D": 74,//Cannot have duplicate elements so we use the array above
        //"E": 76
      };
      //E/A Chromaticism reached with the addition of Eb (63), F (65), Bb(70), and Eb (76)
      //D, [Eb], E, [F], Gb, G, Ab, A, [Bb], B, C, Db, D, [Eb], E
      //62 63    64 65   66  67 68  69  70   71 72 73  74 75    76
      //notes = ["D", "E", "Gb", "G", "Ab", "A", "B", "C", "Db"];
      if (this.isFirstGroupPlugged) {
        notes = _.omit(notes, ["Db"]);
      }
      else if (!this.canPlayUnpluggedGroupsIndividually) {
        notes = _.omit(notes, ["C"]);
      }
      break;
    }
    case "D/G": {
      //      C      D   E    F    ^F    G    A    _B    =B 
      //      C' ^C' D'
      notes = {
        "C": [60, 72],
        "D": [62, 74],
        "E": 64,
        "F": 65,
        "Gb": 66,
        "G": 67,
        "A": 69,
        "Bb": 70,
        "B": 71,
        "Db": 73,
      };
      // D/G Chromaticism reached with the addition of Db (61), Eb (63), Ab (68)
      //C, [Db], D, [Eb], E, F, Gb, G, [Ab], A, Bb, B, C, Db, D
      //60 61    62 63    64 65 66  67 68    69 70  71 72 73  74
      //notes = ["C", "D", "E", "F", "Gb", "G", "A", "Bb", "B", "Db"];
      /*
      if (this.isFirstGroupPlugged) {
        notes = _.omit(notes, ["B"]);
      }
      else if (!this.isFirstGroupPlugged && !this.canPlayUnpluggedGroupsIndividually) {
        notes = _.omit(notes, ["Bb"]);
      }
      if (this.isSecondGroupPlugged) {
        notes = _.omit(notes, ["Db"]);
      }
      else if (!this.isSecondGroupPlugged && !this.canPlayUnpluggedGroupsIndividually) {
        notes["C"] = _.omit(notes["C"], [72]);
      }
      */
      break;
    }
    case "C/F": {
      notes = {
        "Bb": [58, 70],
        "C": [60, 72],
        "D": 62,
        "Eb": 63, 
        "E": 64,
        "F": 65,
        "G": 67,
        "Ab": 68,
        "A": 69,
        //"Bb": 70,
        "B": 71
        //C": 72
      };
      // C/F Chromaticism reached with the addition of B (59), Db (61), Gb (66)
      // Bb, [B], C, [Db], D, Eb, E, F, [Gb], G, Ab, A, Bb, B, C
      // 58  59   60 61    62 63  64 65 66    67 68  69 70  71 72
      //      _B    C    D    _E   =E    F    G    _A    =A 
      //      _B =B C'
      //        
      //notes = ["Bb", "C", "D", "Eb", "E", "F", "G", "Ab", "A", "B"];
      /*
      if (this.isFirstGroupPlugged) {
        notes = _.omit(notes, ["A"]);
      }
      else if (!this.isFirstGroupPlugged && !this.canPlayUnpluggedGroupsIndividually) {
        notes = _.omit(notes, ["Ab"]);
      }
      if (this.isSecondGroupPlugged) {
        notes = _.omit(notes, ["B"]);
      }
      else if (!this.isSecondGroupPlugged && !this.canPlayUnpluggedGroupsIndividually) {
        notes["Bb"] = _.omit(notes["Bb"], [70]);
      }
      */
      break;
    }
  }
  if (_.keys(this.playableExtraNotes)?.length > 0) {
    if (notesOnly) {
      notes = [
        ..._.keys(notes),
        ..._.keys(this.playableExtraNotes),
      ]
    }
    else if (pitchesOnly) {
      notes = _.uniq([
        ..._.flatten(_.values(notes)),
        ..._.flatten(_.values(this.playableExtraNotes))
      ]);
    }
  }
  else {
    if (notesOnly) {
      notes = _.keys(notes)
    }
    else if (pitchesOnly) {
      notes = _.uniq(_.flatten(_.values(notes)));
    }
  }
    
  return notes;
}


//@TODO this need  to use pitch comparison, note string comparison by note name
Instrument.prototype.getCompatibleNotes = function getCompatibleNotes({abcSong}) {
  const mapToNoteNames = (arr) => {
    return arr.map((a) => this.pitchToNoteName[a]);
  }
  /*
  const playableSong = abcSong.getDistinctNotes();
  const playableTuning = this.getPlayableNotes({"notesOnly": true});
  const compatible = _.intersection(playableSong, playableTuning);
  const _incompatible = _.xor(playableSong, playableTuning)
  return {
    compatible,//notes in the song playable on the chnater
    _incompatible,//notes only in the song OR the playlist
    incompatible: _.difference(playableSong, playableTuning),
    unplayable: _.difference(playableTuning, playableSong),//these are notes that exist in the tuning but not the song
  }
  */
  const {compatible, _incompatible, incompatible, unplayable} = this.getCompatiblePitches({abcSong});
  return {
    compatible: mapToNoteNames(compatible),//notes in the song playable on the chnater
    _incompatible: mapToNoteNames(_incompatible),//notes only in the song OR the playlist
    incompatible: mapToNoteNames(incompatible),
    unplayable: mapToNoteNames(unplayable)
  }
}


//@TODO this need  to use pitch comparison, note string comparison by note name
Instrument.prototype.getCompatiblePitches = function getCompatiblePitches({abcSong}) {
  const playableSong = abcSong.getDistinctPitches();
  const playableTuning = this.getPlayableNotes({"pitchesOnly": true});
  const compatible = _.intersection(playableSong, playableTuning);
  const _incompatible = _.xor(playableSong, playableTuning)
  return {
    compatible,//notes in the song playable on the chnater
    _incompatible,//notes only in the song OR the playlist
    incompatible: _.difference(playableSong, playableTuning),
    unplayable: _.difference(playableTuning, playableSong),//these are notes that exist in the tuning but not the song
  }
}


Instrument.prototype.setTuningKey = function setTuningKey(tuningKey = null) {
  if (!tuningKey) {
    this.tuningKey = this.possibleTunings[0];
  }
  if(this.possibleTunings.includes(tuningKey)) {
    this.tuningKey = tuningKey;
    this.tuningKeyIndex = _.indexOf(this.possibleTunings, tuningKey);
    this.setPitchRange();
  }
}

Instrument.prototype.getTuningKeyByIndex = function getTuningKeyByIndex(tuningKeyIndex) {
  if (!isNumber(tuningKeyIndex)) throw new Error(`${tuningKeyIndex} is not numeric`);
  tuningKeyIndex = tuningKeyIndex % this.possibleTunings.length;
  return this.possibleTunings[tuningKeyIndex];
}

Instrument.prototype.getTuningKeyIndex = function getTuningKeyIndex({tuning}) {
  return _.indexOf(this.possibleTunings, tuning);
}

Instrument.prototype.setPitchRange = function setPitchRange() {
  const playableNotes = this.getPlayableNotes({pitchesOnly: true});
  const minPlayableNote = _.min(playableNotes);
  const maxPlayableNote = _.max(playableNotes);
  this.pitchRange = {
    min: minPlayableNote,
    max: maxPlayableNote,
    total: maxPlayableNote - minPlayableNote
  }
}

Instrument.prototype.isPitchInRange = function isPitchInRange({pitchIndex}) {
  //debug("isPitchInRange", pitchIndex, this.pitchRange)
  return _.inRange(pitchIndex, this.pitchRange.min, this.pitchRange.max + 1);
}

Instrument.prototype.getPeno = function getPeno({pitchIndex}) {
  return this.playableExtraNotesOptions?.[pitchIndex];
}
