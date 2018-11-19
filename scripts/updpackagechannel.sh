#!/bin/bash

# TODO: Hotfix channel should not have ANY auto version changes
# Feature should not be autoversioned
# Release should pull version from branch name on creation (if possible, otherwise manual)
# master should autoversion for hotfixes, else it inherits it's versioning from the next release
# Develop should inherit version from release, prerelease version assigned on build
#

# for builds that are not pull-requests, corrects any invalid channel info
branch=${BUILD_SOURCEBRANCHNAME}
echo "${CHANNEL}"
git config --global user.email "${GIT_PROJECT_EMAIL}"
git config --global user.name "${GIT_PROJECT_AUTHOR}"
# echo commit is merge from release

git checkout ${branch}
echo git status
git status
pkgchannel="$(node -p 'require("./scripts/getver.js").default("channel")')"
echo "${pkgchannel}"
isfeatorfix=[[ "${branch}" =~ ^hotfix/.*$ || "${branch}" =~ ^feature/.*$ ]]
if [[ [["${pkgchannel}" != "${CHANNEL}"]] && [["${BUILD_REASON}" != "PullRequest"]] && ! ${isfeatorfix} ]]
# If channel is different, not pull request and not hotfix or feature TODO: double check that this will evaluate correctly
then
  echo switch version tag to ${branch}
  node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':''})"

  echo add package
  git add "package.json"
  git diff --cached "package.json"

  newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo commit
  git commit -m "[${BUILD_DEFINITIONNAME}]Switch channel info to ${CHANNEL} ***NO_CI***"

  # echo create tag "v${newver}" on latest commit
  # git tag "v${newver}"

  echo git status
  git status
  echo git push
  git push origin
  #git push --tags origin

  echo git status
  git status
else
  echo Already on ${CHANNEL} channel
fi
