import { player, instrument, hps, _base} from './base';

const config = {
  ..._base,
  shouldDebug: true,
  debugDisabledModules: ["state"],
  prodDomain: "sackpipa.folktabs.com",
  isMobileBuild: false,
  errorReloadDisabled: false,
  environment: "dev",
}

export default {
  ...config,
  player,
  instrument,
  hps,
};
