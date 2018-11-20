#!/bin/bash

# Imports: channel. build_sourcebranchname, git_project_email, git_project_author, build_definitionname

# for builds that are not pull-requests, corrects any invalid channel info
shopt -s extglob
branch=${BUILD_SOURCEBRANCH}
branch=${branch/refs\/?(heads|pull)\//}
branch=${branch/+([0-9])\//}
shopt -u extglob
echo ${branch}
echo ${CHANNEL}
git config --global user.email "${GIT_PROJECT_EMAIL}"
git config --global user.name "${GIT_PROJECT_AUTHOR}"

git checkout ${branch}
echo git status
git status
pkgchannel="$(node -p 'require("./scripts/getver.js").default("channel")')"

if [[ ("${pkgchannel}" != "${CHANNEL}" && "${BUILD_REASON}" != "PullRequest") &&  !(${branch} =~ ^hotfix/.* || ${branch} =~ ^feature/.*)  ]]
then
  echo switch version tag to ${branch}
  node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':''})"

  echo add package
  git add "package.json"
  git diff --cached "package.json"

  # newver="$(node -p 'require("./scripts/getver.js").default("full")')"
  echo commit
  git commit -m "[${BUILD_DEFINITIONNAME}]Switch channel info to ${CHANNEL} ***NO_CI***"

  echo git status
  git status
  echo git push
  git push origin
else
  echo Already on ${CHANNEL} channel
fi
