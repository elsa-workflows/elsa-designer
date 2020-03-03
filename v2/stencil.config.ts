import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'elsa-workflows',
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@elsa-workflows/elsa-workflow-designer',
      proxiesFile: '../../elsa-designer-react/src/components.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  plugins:[sass(), nodePolyfills()],
  globalStyle: 'src/global/app.scss'
};
