#!/bin/bash

# Channel info is now transiently set in each build, regardless of what's currently in the repo (Should reduce merge conflicts)
# shopt -s extglob
# branch=${BUILD_SOURCEBRANCH}
# branch=${branch/refs\/?(heads|pull)\//}
# branch=${branch/+([0-9])\//}
# shopt -u extglob
# echo ${branch}
echo ${CHANNEL}
# git config --global user.email "${GIT_PROJECT_EMAIL}"
# git config --global user.name "${GIT_PROJECT_AUTHOR}"

# git checkout ${branch}
# echo git status
# git status
pkgchannel="$(node -p 'require("./scripts/getver.js").default("channel")')"

if [[ "${pkgchannel}" != "${CHANNEL}" ]]
then
  echo switch channel to ${CHANNEL}
  node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':''})"

  # echo add package
  # git add "package.json"
  # git diff --cached "package.json"

  # echo commit
  # git commit -m "[${BUILD_DEFINITIONNAME}]Switch channel info to ${CHANNEL} ***NO_CI***"

  # echo git status
  # git status
  # echo git push
  # git push origin
else
  echo Already on ${CHANNEL} channel
fi
