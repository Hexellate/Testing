#!/bin/bash

# pull repo
# bump version in repo
# tag repo
# push repo

# TODO: cd to git working directory
cd $(System.DefaultWorkingDirectory)
mkdir project_repo
cd project_repo

git config --global user.email "$(git_project_email)"
git config --global user.name "$(git_project_author)"

git init
git remote add -f origin $(git_project_url)
git pull
git checkout $(branch)
echo git status
git status
echo increment patch ver
#node -e "require('./scripts/bumpver.js').default({'channel':'$(channel)','bump':'patch'})"
echo add package
git add "package.json"
#newver="$(node -p 'require("./scripts/getver.js").default()')"
echo commit to repo
git commit -m "[$(Build.DefinitionName)]Set ver to ${version} ***NO_CI***"
echo create tag "${tag}" on latest commit
git tag "${tag}"
echo git status
git status
echo git push
git push origin
git push --tags origin
echo git status
git status

# TODO: cd to regular working directory
