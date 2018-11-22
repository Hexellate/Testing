#!/bin/bash

printenv

# Set git used details
git config --global user.email "${GIT_TRACKING_EMAIL}"
git config --global user.name "${GIT_TRACKING_AUTHOR}"

# Get repo
cd ${SYSTEM_DEFAULTWORKINGDIRECTORY}
mkdir tracking_repo
cd tracking_repo
git init
git remote add -f origin ${GIT_TRACKING_URL}
git checkout master

echo git status
git status

# Copy tracking files to repo
cd "${SYSTEM_DEFAULTWORKINGDIRECTORY}/${ARTIFACTP}/drop/release/"
cp -- *.yml "${SYSTEM_DEFAULTWORKINGDIRECTORY}/tracking_repo/${GIT_PROJECT_NAME}/updates/$(channel)"
ls -l "${SYSTEM_DEFAULTWORKINGDIRECTORY}/tracking_repo/${GIT_PROJECT_NAME}/updates/$(channel)"

cd "${SYSTEM_DEFAULTWORKINGDIRECTORY}/tracking_repo"

# Commit and push repo
echo commit to repo
git add "${SYSTEM_DEFAULTWORKINGDIRECTORY}/tracking_repo/${GIT_PROJECT_NAME}/updates/$(channel)"
git commit -m "[${BUILD_DEFINITIONNAME}]update tracking files for ${GIT_PROJECT_NAME} ${tag} $(channel)"

echo git status
git status

git push
echo git status
git status
