#!/bin/bash

printenv

echo Current version: $(node -p 'require("./scripts/getver.js").default("full")')
# Need to add something to force patch increment even if not merge from hotfix
# (maybe a queue time variable for manual builds?)
if [[ ("${CHANNEL}" == "stable") && ("${BUILD_SOURCEVERSIONMESSAGE}" =~ ^(Merge pull request \#[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch \'hotfix\/.*\')$) ]]
then
  prevtag=$(git describe --tags --abbrev=0)
  echo ${prevtag}
  patchver=$(npx semver -i patch "${prevtag}")
  echo ${patchver}
  # node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':'patch'})"
  node -e "require('./scripts/setver.js').default({'channel':'${CHANNEL}','comp':'full','val':'${patchver}'})"

  echo Bump patch to: $(node -p 'require("./scripts/getver.js").default("full")')
fi

if [[ ("${CHANNEL}" == "next") || ("${CHANNEL}" == "canary") ]]
then
  node -e "require('./scripts/setver.js').default({'channel':'${CHANNEL}','comp':'pre', 'val':'${BUILD_BUILDID}'})"

  echo Set prerelease info: $(node -p 'require("./scripts/getver.js").default("full")')
fi
