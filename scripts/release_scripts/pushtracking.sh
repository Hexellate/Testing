##!/bin/bash

# Set git used details
git config --global user.email "${git_tracking_email}"
git config --global user.name "${git_tracking_author}"

# Get repo
cd ${System.DefaultWorkingDirectory}
mkdir tracking_repo
cd tracking_repo
git init
git remote add -f origin ${git_tracking_url}
git checkout master

echo git status
git status

# Copy tracking files to repo
cd "${System.DefaultWorkingDirectory}/${artifactp}/drop/release/"
cp -- *.yml "${System.DefaultWorkingDirectory}/tracking_repo/${git_project_name}/updates/${channel}"
ls -l "${System.DefaultWorkingDirectory}/tracking_repo/${git_project_name}/updates/${channel}"

cd "${System.DefaultWorkingDirectory}/tracking_repo"

# Commit and push repo
echo commit to repo
git add "${System.DefaultWorkingDirectory}/tracking_repo/${git_project_name}/updates/${channel}"
git commit -m "[${Build.DefinitionName}]update tracking files for ${git_project_name} ${tag} ${channel}"

echo git status
git status

git push
echo git status
git status
