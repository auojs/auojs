#!/usr/bin/env sh

set -e

cd packages/docs

npm run docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:auojs/auojs.git master:gh-pages

cd -