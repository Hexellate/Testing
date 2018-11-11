# Git Model

This document will describe the model being used for creating and using branches this Git repo.

## Table Of Contents

- [Model Overview](model-overview)
- [Branches](branches)
  - [Master Branch](master-branch)
  - [Develop Branch](develop-branch)
  - [Feature Branch](feature-branch)
  - [Release Branch](release-branch)
  - [Hotfix Branch](hotfix-branch)
- [Release Process](release-process)

## Model Overview

The model being used is based off the [GitFlow model](https://nvie.com/posts/a-successful-git-branching-model/) by Vincent Driessen, with some changes.

At it's core, there are two main branches, the master branch and the develop branch, which have an indefinite lifetime. Additionally, there are also three types of support branches:

- Feature
- Release
- Hotfix

These support branches will have a limited lifetime, the length of which depends on the branch and will be described later. The model is nearly a waterflow based model, flowing from feature to develop to release and finally to master. The only reason it is not a waterflow model is due to changes in release branches being merged back into the develop branch, and likewise with hotfixes being merged into both master and develop/release.

## Branches

### Master Branch

The master branch will contain code in a _production-ready_ state. Any push to this branch that passes testing will automatically create a new version of the application on the **Stable** channel. This channel may NOT be changed or otherwise updated with direct commits, but may only be changed through pushes from release or hotfix branches.

### Develop Branch

The Develop branch will contain code reflecting an in development version of the next release, although new features are not to be added through direct commits. This branch will be used to build the nightly releases on the **Canary** channel. If a canary build fails to compile, then it will not be released.

### Feature Branches

|                           |                                                           |
| ------------------------- | --------------------------------------------------------- |
| May branch from:          | develop                                                   |
| Must merge into:          | develop                                                   |
| Branch naming convention: | anything except master, develop, release-\*, or hotfix-\* |

Feature branches are used to develop new features, or to improve existing features for an upcoming or distant release. When a feature starts being developed, it's target release may be unknown. Feature branches exist as long as the feature is in development, and get either merged back into develop (if the feature is complete, or at least ready for release), or discarded (If the feature is being scrapped). When a feature is targeted at a future release, and not the next release, it must wait until the next release is branched off before merging with the develop branch. It is permissible to create extra branches for a feature, however they must branch off the related feature and merge back into the same branch.

When merging a feature branch into develop, the `--no-ff` flag should always be used in order to retain information about the branch. Additionally, merges should **NOT** be squashed.

### Release Branches

|                           |                    |
| ------------------------- | ------------------ |
| May branch from:          | develop            |
| Must merge into:          | develop and master |
| Branch naming convention: | release-\*         |

Release branches represent a new version that is feature complete and ready for proper release. This branch may receive bugfix commits, however it is generally in a feature-freeze, meaning that no new features should be added. Minor features such as simple usability improvements may be an exception. Commits to this branch should be continuously merged back into the develop branch. This branch will be used to automatically build releases for the **Next** channel. When this branch is deemed to be stable, it will be pushed to the master branch to create a new release on the **Stable** channel. Once the branch has been merged into the master branch, it will be deleted.

### Hotfix Branches

|                           |                    |
| ------------------------- | ------------------ |
| May branch from:          | master             |
| Must merge into:          | develop and master |
| Branch naming convention: | hotfix-\*          |

Hotfix branches are used when there is a bug of some description in the master branch of the repo, and are used for fixing such bugs. A hotfix will increment the patch version of the software (i.e. 1.2.3 will become 1.2.4). Additionaly, a hotfix must also be merged into the develop or release branches in order to be included in future versions. If a release branch exists, then the hotfix will be merged into release rather than develop, as the release will then be merged back into develop. Hotfix channels are deleted after they are merged.

## Release process

1. Features are developed in feature branches
2. Feature branch is merged into develop branch
    - When a feature is both finished and targeted for the next release, it is merged into the develop branch.
    -  The develop branch will be released on the canary channel.
3. Release branch is created from develop branch
    - When all features for the next release have been merged into the develop branch, a new release branch is created from the develop branch.
    - It is at this time that a release gets its version number.
    - From this point on, the develop branch will represent the next release.
    - This release branch will be released on the beta channel.
4. Bugfixing on release branch
    - The release branch will now receive only bugfixes, all of which are continuously merged back into the develop branch.
5. Release merged into master branch
    - Once a release branch has been deemed stable, it will be merged with the master branch and tagged with the version number.
    - The master branch will be released on the stable channel.
6. Hotfixing stable channel bugs
    - If a bug is found in the stable channel, a hotfix branch will be created, where the bug will be fixed.
    - Once the bug is fixed, the branch will be merged with the master, develop and release branches.
