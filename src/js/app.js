import "../scss/app.scss";
import abcjs from "./abcjs";
import "./abcjs/abcjs-audio.css";
import "../scss/audio.css";
import ABCSong from "./song";
import songs from "./songs";
import ABCPlayer from "./player";
import Sackpipa from "./sackpipa";
import utils from "./utils";
import HPS from "./hps";
import Tooltip from "./tooltip";
const abcPlayer = new ABCPlayer({abcjs, songs, ABCSong, Sackpipa, HPS, utils, options: {
  currentInstrumentIndex: 109
}});
abcPlayer.load();
const tooltip = new Tooltip();
