#!/bin/bash

# imports: channel, Build.BuildId, branch

# bump version on hotfix pr, hotfix commit, or merge to master from hotfix
# merge to master should update version and tag in release pipeline
# All releases should tag

if [[ [["$(channel)" == "stable"]] && ! [[ "$(branch)" == "master" && ! [["Buildmessage" =~ "^(Merge pull request #\d{1,4} from .*\/hotfix\/.*)|(Merge branch 'hotfix\/.*')$"]] ]] # TODO: If building in main, then it must be a pull or merge from hotfix
then
  node -e "require('./scripts/bumpver.js').default({'channel':'$(channel)','bump':'patch'})"

  newver="$(node -p 'require("./scripts/getver.js").default("full")')"
fi

if [[ "$(channel)" == "next" ]] || [[ "$(channel)" == "canary" ]]
then
  node -e "require('./scripts/setver.js').default({'channel':$(channel),'comp':'pre', 'val':$(Build.BuildId)})"

  newver="$(node -p 'require("./scripts/getver.js").default("full")')"
fi

tag="v$(newver)"
version = "$(newver)"

# exports: tag, version
# write new version to pipe
