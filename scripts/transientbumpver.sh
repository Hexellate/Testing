#!/bin/bash

printenv
echo Current version: $(node -p 'require("./scripts/getver.js").default("full")')

if [[ ("${CHANNEL}" == "stable") && ( ("${BUILD_SOURCEVERSIONMESSAGE}" =~ ^(Merge pull request \#[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch \'hotfix\/.*\')$) || (${BUILD_REASON} == "Manual" && ${FORCEPATCH} == "true" ) ) ]]
then
  prevtag=$(git describe --tags --abbrev=0)
  # echo ${prevtag}
  # patchver=$(npx semver -i patch "${prevtag}")
  # echo ${patchver}

  # node -e "require('./scripts/setver.js').default({'channel':'${CHANNEL}','comp':'full','val':'${patchver}'})"
  node -e "require('./scripts/setver.js').default({'channel':'${CHANNEL}','comp':'full','val':'${prevtag}','coerce':'true'})"
  node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':'patch'})"

  echo Bump patch to: $(node -p 'require("./scripts/getver.js").default("full")')
fi

if [[ ("${CHANNEL}" == "next") || ("${CHANNEL}" == "canary") ]]
then
  node -e "require('./scripts/setver.js').default({'channel':'${CHANNEL}','comp':'pre', 'val':'${BUILD_BUILDID}'})"

  echo Set prerelease info: $(node -p 'require("./scripts/getver.js").default("full")')
fi
