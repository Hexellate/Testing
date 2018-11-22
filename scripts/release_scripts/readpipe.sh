#!/bin/bash

echo "##vso[task.setvariable variable=tag]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${ARTIFACTP}/drop/pipe/tag)"
echo "##vso[task.setvariable variable=commit]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${ARTIFACTP}/drop/pipe/commit)"
echo "##vso[task.setvariable variable=version]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${ARTIFACTP}/drop/pipe/version)"
echo "##vso[task.setvariable variable=branch]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${ARTIFACTP}/drop/pipe/branch)"
echo "##vso[task.setvariable variable=channel]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${ARTIFACTP}/drop/pipe/channel)"
