import {Config} from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  outputTargets: [{
    type: 'www',
    dir: 'dist/app',
    serviceWorker: null
  }, {
    type: 'dist',
    dir: 'dist/components'
  }],
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  namespace: 'elsa'
};
