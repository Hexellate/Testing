#!/bin/bash

# TODO: Hotfix channel should not have ANY auto version changes
# Feature should not be autoversioned
# Release should pull version from branch name on creation (if possible, otherwise manual)
# master should autoversion for hotfixes, else it inherits it's versioning from the next release
# Develop should inherit version from release, prerelease version assigned on build
#

# for builds that are not pull-requests, corrects any invalid channel info
git config --global user.email "$(git_email)"
git config --global user.name "$(git_author)"
# echo commit is merge from release

branch=$(Build.SourceBranchName)

git checkout $(branch)
echo git status
git status
pkgchannel="$(node -p 'require("./scripts/getver.js").default("channel")')"

if [[ [["$(pkgchannel)" != "$(channel)"]] && [["$(Build.Reason)" != "PullRequest"]] && ! [[ [["$(branch)" =~ ^hotfix/.*$]] || [["$(branch)" =~ ^feature/.*$]] ]] ]]
# If channel is different, not pull request and not hotfix or feature TODO: double check that this will evaluate correctly
then
  echo switch version tag to $(branch)
  node -e "require('./scripts/bumpver.js').default({'channel':'$(channel)','bump':''})"

  echo add package
  git add "package.json"

  newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo commit
  git commit -m "[$(Build.DefinitionName)]Switch channel info to $(channel) ***NO_CI***"

  # echo create tag "v${newver}" on latest commit
  # git tag "v${newver}"

  echo git status
  git status
  echo git push
  git push origin
  git push --tags origin

  echo git status
  git status
else
  echo Already on $(channel) channel
fi
