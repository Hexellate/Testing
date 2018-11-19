#!/bin/bash
#pkgchannel="stable"
pkgchannel="dankmeme"
channel="stable"
branch="develop/test"
#branch="master"
#BUILD_REASON="PullRequest"
BUILD_REASON="CI"
# echo pkgchannel
# echo channel
# echo branch
# echo BUILD_REASON
if [[ ("${pkgchannel}" != "${channel}" && "${BUILD_REASON}" != "PullRequest") &&  !(${branch} =~ ^hotfix/.* || ${branch} =~ ^feature/.*)  ]]
  then
    echo yay
  else
    echo nay
fi
