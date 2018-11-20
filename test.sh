#!/bin/bash
CHANNEL="stable"
BUILD_SOURCEVERSIONMESSAGE="Merge branch 'hotfix/teststuffs' into develop"
# BUILD_SOURCEVERSIONMESSAGE="Merge branch 'hotfix/teststuffs'"
# BUILD_SOURCEVERSIONMESSAGE="[Build stable]Bump patch ver to 0.2.3 ***NO_CI***"
# BUILD_SOURCEVERSIONMESSAGE="Merge pull request #14 from Hexellate/hotfix/fixhotfix"
if [[ ("${CHANNEL}" == "stable") && ("${BUILD_SOURCEVERSIONMESSAGE}" =~ ^(Merge pull request \#[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch \'hotfix\/.*\')$) ]]
then
echo yay
else
echo nay
fi
