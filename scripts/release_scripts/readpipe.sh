#!/bin/bash

echo "##vso[task.setvariable variable=tag]$(<$(System.DefaultWorkingDirectory)/$(artifactp)/drop/pipe/tag)"
echo "##vso[task.setvariable variable=commit]$(<$(System.DefaultWorkingDirectory)/$(artifactp)/drop/pipe/commit)"
echo "##vso[task.setvariable variable=version]$(<$(System.DefaultWorkingDirectory)/$(artifactp)/drop/pipe/version)"
echo "##vso[task.setvariable variable=branch]$(<$(System.DefaultWorkingDirectory)/$(artifactp)/drop/pipe/branch)"
echo "##vso[task.setvariable variable=channel]$(<$(System.DefaultWorkingDirectory)/$(artifactp)/drop/pipe/channel)"
