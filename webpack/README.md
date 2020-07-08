# Webpack
This module bundler generates the min.js files found in the dist folder, allowing this module to be used in the browser.

## Usage
### Live development builds
`npm run webpack-watch`

### Build dev bundle
`npm run webpack-dev`

### Build prod bundle
`npm run webpack-prod`

### Build all bundles
`npm run build`

## Troubleshooting
### Large bundle sizes
One approach is using the webpack-bundle-analyzer to inspect larger npm dependencies: https://github.com/webpack-contrib/webpack-bundle-analyzer