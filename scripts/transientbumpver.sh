#!/bin/bash

# imports: channel, Build.BuildId, branch

# bump version on hotfix pr, hotfix commit, or merge to master from hotfix
# merge to master should update version and tag in release pipeline
# All releases should tag
printenv
echo Current version: $(node -p 'require("./scripts/getver.js").default("full")')
if [[ ("${CHANNEL}" == "stable") && ("${BUILD_SOURCEVERSIONMESSAGE}" =~ ^(Merge pull request \#[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch \'hotfix\/.*\')$) ]]
then
  node -e "require('./scripts/bumpver.js').default({'channel':'$(channel)','bump':'patch'})"

  #newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo Bump patch to: $(node -p 'require("./scripts/getver.js").default("full")')
fi

if [[ ("${CHANNEL}" == "next") || ("${CHANNEL}" == "canary") ]]
then
  node -e "require('./scripts/setver.js').default({'channel':$(channel),'comp':'pre', 'val':$(Build.BuildId)})"

  #newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo Set prerelease info: $(node -p 'require("./scripts/getver.js").default("full")')
fi

# tag="v$(newver)"
# version = "$(newver)"

# exports: tag, version
# write new version to pipe
