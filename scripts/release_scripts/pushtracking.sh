#!/bin/bash

# pull repo
# bump version in repo
# tag repo
# push repo

# TODO: cd to git working directory
cd $(System.DefaultWorkingDirectory)
mkdir tracking_repo
cd tracking_repo

git config --global user.email "$(git_tracking_email)"
git config --global user.name "$(git_tracking_author)"

git init
git remote add -f origin $(git_tracking_url)
git pull
git checkout master
echo git status
git status

# add all tracking files to correct place in repo
cp -p $(System.DefaultWorkingDirectory)/_Build-stable/drop/release/*.yml $(System.DefaultWorkingDirectory)/tracking_repo/$(project)/$(channel)

#echo increment patch ver
#node -e "require('./scripts/bumpver.js').default({'channel':'$(channel)','bump':'patch'})"
#echo add package
#git add "package.json"
#newver="$(node -p 'require("./scripts/getver.js").default()')"
echo commit to repo
git commit -a -m "[$(Release.DefinitionName)]Auto-deploy build $(Release.Artifacts._Build-stable.BuildNumber) for $(System.TeamProject)"
# echo create tag "${tag}" on latest commit
# git tag "${tag}"
echo git status
git status
echo git push
git push origin
# git push --tags origin
echo git status
git status

# TODO: cd to regular working directory
