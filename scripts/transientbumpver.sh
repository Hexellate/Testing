#!/bin/bash

printenv
echo Current version: $(node -p 'require("./scripts/getver.js").default("full")')
if [[ ("${CHANNEL}" == "stable") && ("${BUILD_SOURCEVERSIONMESSAGE}" =~ ^(Merge pull request \#[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch \'hotfix\/.*\')$) ]]
then
  node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':'patch'})"

  #newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo Bump patch to: $(node -p 'require("./scripts/getver.js").default("full")')
fi

if [[ ("${CHANNEL}" == "next") || ("${CHANNEL}" == "canary") ]]
then
  node -e "require('./scripts/setver.js').default({'channel':'${CHANNEL}','comp':'pre', 'val':'${BUILD_BUILDID}'})"

  #newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo Set prerelease info: $(node -p 'require("./scripts/getver.js").default("full")')
fi
