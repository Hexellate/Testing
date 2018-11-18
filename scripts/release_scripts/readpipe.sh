#!/bin/bash

version=$(<$(System.DefaultWorkingDirectory)/_Build-stable/drop/pipe/version)
branch=$(<$(System.DefaultWorkingDirectory)/_Build-stable/drop/pipe/branch)
tag=$(<$(System.DefaultWorkingDirectory)/_Build-stable/drop/pipe/tag)
channel=$(<$(System.DefaultWorkingDirectory)/_Build-stable/drop/pipe/channel)
