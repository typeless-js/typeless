mkdir -p dist
rm -rf ./dist/*
yarn run tsc --declaration true --module esnext --outDir "./dist/es"
yarn run tsc --declaration true --module commonjs --outDir "./dist"
cp package.json ./dist/package.json
cp README.md ./dist/README.md
rm -rf ./dist/__tests__
