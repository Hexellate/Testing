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

The model being used is based off the [GitFlow model](https://nvie.com/posts/a-successful-git-branching-model/) by Vincent Driessen, with some minor changes.

At it's core, there are two main branches, the master branch and the develop branch, which have an indefinite lifetime. Additionally, there are also three types of support (transient) branches:

- feature
- release
- hotfix

These support branches will have a limited lifetime, the length of which depends on the branch and will be described later. The model is nearly a waterflow based model, flowing from feature to develop to release and finally to master. The only reason it is not a waterflow model is due to changes in release branches being merged back into the develop branch, and likewise with hotfixes being merged into both master and develop/release.

## Branches

### **Master Branch**

The master branch will contain code in a _production-ready_ state. If a successful build from this branch is approved for distribution, then it will be distributed on the **Stable** channel. This channel may NOT be changed or otherwise updated with direct commits, but may only be changed through pushes from release or hotfix branches.

### **Develop Branch**

The Develop branch will contain code reflecting an in development version of the next release, although new features are not to be added through direct commits. This branch will be used to build the nightly releases on the **Canary** channel. The build that is released will be the most recent successful build from the canary channel, assuming that any changes have occurred.

### **Feature Branches**

|                           |            |
| ------------------------- | ---------- |
| May branch from:          | develop    |
| Must merge into:          | develop    |
| Branch naming convention: | feature/\* |

Feature branches are used to develop new features, or to improve existing features for an upcoming or distant release. When a feature starts being developed, it's target release may be unknown. Feature branches exist as long as the feature is in development, and get either merged back into develop (if the feature is complete, or at least ready for release), or discarded (if the feature is being scrapped). When a feature is targeted at a future release, and not the next release, it must wait until the next release is branched off before merging with the develop branch.

#### Having a feature branch merged:

To have a feature branch merged into develop, firstly ensure that your branch is up to date with develop. If it is not, then merge the most recent build from develop into the feature branch. Once up to date, create a pull request into develop. At this point, if all tests pass and there are no merge conflicts, an admin may merge your change at their discretion. (Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for additional info.)

### **Release Branches**

|                           |                    |
| ------------------------- | ------------------ |
| May branch from:          | develop            |
| Must merge into:          | develop and master |
| Branch naming convention: | release/\*         |

Release branches represent a new version that is feature complete and ready for proper release. This branch may receive bugfix commits, however it is generally in a feature-freeze, meaning that no new features should be added. Minor features such as simple usability improvements may be an exception. Commits to this branch should be continuously merged back into the develop branch. This branch will be used to automatically build releases for the **Next** channel. When this branch is deemed to be stable, it will be pushed to the master branch to create a new release on the **Stable** channel. Once the branch has been merged into the master branch, it will be deleted. Additionally, there may only be one release branch at a time (i.e. before creating a new release branch, the current one must be merged into master).

To create a release branch, locally branch off the latest commit on develop and create a commit that updates the version to the correct semver version. (If the prerelease tag is not changed, it will be automatically changed by the CI server.). Push this branch to origin, triggering a build by the CI server. If the build passes, then the branch must be immediately merged back into develop, otherwise the build must be made to pass and then merged to develop. Release branches should only be created by an administrator.

To update a release branch, push commits to the branch in accordance with the guidelines of release branches outlined above. If a release version is approved by an admin for distribution, the changes must then be merged into develop where applicable (i.e. if a feature has been rewritten in develop, then it shouldn't be merged). Merges back into develop must be done with a pull request. Approval of a build will create a new commit with an updated prerelease component, which will also be tagged with the version of the build. This commit should be included in the aforementioned merge.

To finalize a release branch, merge all remaining changes into develop where applicable, followed by a pull request into master. If the pull request passes all tests, has no merge conflicts and is approved by the reviewer(s), then the branch may be merged at an administrator's discretion. Following this, the CI server will strip the prerelease component from the version, and will produce a build for the stable channel. This build may then be approved for distribution by an admin of the CI server, at which point the latest commit will be tagged, and the build will be distributed.

### **Hotfix Branches**

|                           |                               |
| ------------------------- | ----------------------------- |
| May branch from:          | master                        |
| Must merge into:          | master and develop or release |
| Branch naming convention: | hotfix/\*                     |

Hotfix branches are used when there is a bug of some description in the master branch of the repo, and are used for fixing such bugs. A hotfix will increment the patch version of the software (i.e. 1.2.3 will become 1.2.4). Additionaly, a hotfix must also be merged into the develop or release branches in order to be included in future versions. If a release branch exists, then the hotfix will be merged into release rather than develop, as the release will then be merged back into develop. Hotfix channels are deleted after they are merged.

To create a hotfix, branch off the latest commit on master, and commit the associated fixes to the branch.

**Do not increment the patch yourself, this will be done automatically.** If a hotfix has incremented the patch, then it WILL be rejected.

To have a hotfix merged, create a pull request for master, and another for develop, or instead for release if one exists. For each pull request, if it passes all tests, and is deemed an appropriate fix by a reviewer, then it may be merged at an admin's discretion.  It is possible that a PR to develop/release may be denied while a PR to master is still accepted, which may happen if the code in question has been rewritten or removed, thereby making the fix inapplicable.

## Release process

1. Features are developed in feature branches
2. Feature branch is merged into develop branch
    - When a feature is both finished and targeted for the next release, it is merged into the develop branch.
    - The develop branch will be released on the canary channel.
3. Release branch is created from develop branch
    - When all features for the next release have been merged into the develop branch, a new release branch is created from the develop branch.
    - It is at this time that a release gets its version number.
    - From this point on, the develop branch will represent the next release.
    - This release branch will be released on the next channel.
4. Bugfixing on release branch
    - The release branch will now receive only bugfixes, all of which are continuously merged back into the develop branch.
5. Release merged into master branch
    - Once a release branch has been deemed stable, it will be merged with the master branch and tagged with the version number.
    - The master branch will be released on the stable channel.
6. Hotfixing stable channel bugs
    - If a bug is found in the stable channel, a hotfix branch will be created, where the bug will be fixed.
    - Once the bug is fixed, the branch will be merged with the master, develop and release branches.
