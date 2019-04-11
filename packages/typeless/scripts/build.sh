mkdir -p dist
rm -rf ./dist/*
yarn run tsc --declaration true --declarationMap true --module esnext --outDir "./dist/es"
yarn run tsc --declaration true --declarationMap true --module commonjs --outDir "./dist"
