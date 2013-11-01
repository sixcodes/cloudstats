#!/usr/bin/env bash
PROJECT_DIR=$(dirname $0)
npm install
bower install

pushd $PROJECT_DIR/app/bower_components/bootstrap-ui/ > /dev/null

npm install
grunt build

popd > /dev/null

pushd $PROJECT_DIR/public > /dev/null
ln -sf ../app/* .
ln -s images img
ln -s ../app/bower_components/bootstrap-ui/template .

popd > /dev/null
