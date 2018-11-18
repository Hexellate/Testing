# Build process: # TODO: branch
#
# Predefined vars: git_email, git_author, git_project
#
# start setup job >> channel
# For release, automatically merge into develop?
## git_email, git_author, channel >> Correct channel info in branch >> branch
# channel >> start build job
## Run prebuild process
## channel >> Fail on channel mismatch
## channel, branch >> Bump transient version >> tag, version
  # If hotfix in master, bump patch
  # if release in release or develop, update prever to build number
## Build application
## Run tests
## Copy binaries to release staging
## Delete unpacked files from release staging
## git_author >> git_project >> Organise binaries in release staging and correct mappings (tag name should already be defined by this point, but may only be pushed in release)
## version, branch, tag >>Set pipe files
## Copy release scripts to pipe staging
## Publish artifacts from staging

  # Pipe variables:
  # Version, for creating release details
  # Branch, for updating version in correct branch
  # Tag, for creating tag
  # Commit?
  # channel, for updating tracking on correct channel

# release process:
# process pipe files to variables
# pull repo to folder
# bump version in repo
  # If hotfix in master, bump patch
  # if release in release or develop, update prever to build number
# Tag repo
# push to repo
# create release in repo
# push tracking files to correct destination

# TODO: Use correct working directory

git config --global user.email "$(git_email)"
git config --global user.name "$(git_author)"
echo commit is merge from hotfix
git checkout master # TODO: Check out correct branch
echo git status
git status

# If patch on master, bump patch, else set prever
if [[ [[$(branch) == "master"]] && [[$(patch) == "true"]] ]] # TODO: correct conditions, existing variables
then
  echo increment patch ver
  node -e "require('./scripts/bumpver.js').default({'channel':'$(channel)','bump':'patch'})"
else
  echo increment patch ver
  node -e "require('./scripts/setver.js').default({'channel':$(channel),'comp':'pre', 'val':$(Build.BuildId)})" # TODO: get build ID (probably from pipe)
fi

# Add package to commit
echo add package
git add "package.json"
newver="$(node -p 'require("./scripts/getver.js").default()')"

# Create commit
echo commit to repo
git commit -m "[$(Build.DefinitionName)]Bump patch ver to ${newver} ***NO_CI***"

# Create tag
echo create tag "v${newver}" on latest commit
git tag "v${newver}"

# Push commit and tags
echo git status
git status
echo git push
git push origin
git push --tags origin
echo git status
git status

# Create release
