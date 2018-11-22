#!/bin/bash

printenv

echo "##vso[task.setvariable variable=tag]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${artifactp}/drop/pipe/tag)"
echo "##vso[task.setvariable variable=commit]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${artifactp}/drop/pipe/commit)"
echo "##vso[task.setvariable variable=version]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${artifactp}/drop/pipe/version)"
echo "##vso[task.setvariable variable=branch]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${artifactp}/drop/pipe/branch)"
echo "##vso[task.setvariable variable=channel]$(<${SYSTEM_DEFAULTWORKINGDIRECTORY}/${artifactp}/drop/pipe/channel)"
