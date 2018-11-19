#!/bin/bash
#pkgchannel="stable"
# pkgchannel="dankmeme"
# channel="stable"
# branch="develop/test"
# #branch="master"
# #BUILD_REASON="PullRequest"
# BUILD_REASON="CI"
# # echo pkgchannel
# # echo channel
# # echo branch
# # echo BUILD_REASON
# if [[ ("${pkgchannel}" != "${channel}" && "${BUILD_REASON}" != "PullRequest") &&  !(${branch} =~ ^hotfix/.* || ${branch} =~ ^feature/.*)  ]]
#   then
#     echo yay
#   else
#     echo nay
# fi

# AGENT_OS="Windows_NT"

# if [[ "${AGENT_OS}" == "Darwin" ]]
#   then
#     OS="mac"
#   elif [[ "${AGENT_OS}" == "Windows_NT" ]]
#   then
#     OS="win"
#   elif [[ "${AGENT_OS}" == "Linux" ]]
#   then
#     OS="lin"
# fi
# echo $(OS)
# echo ${OS}

BUILD_ARTIFACTSTAGINGDIRECTORY="d:\a\1\a"
echo ${BUILD_ARTIFACTSTAGINGDIRECTORY//\\//}
