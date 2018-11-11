# Contributing to project

This document will outline the guidelines for contributing to this project, including styleguides for Git commits, docs, JavaScript, and also bug reports and pull requests. If you see something that should be changed in this document, feel free to make a pull request.

#### Table Of Contents
[Code of conduct](#code-of-conduct)

[Contribution Guides](#contribution-guides)
* [Bug Reports](#bug-reports)
* [Suggesting Enhancements](#suggesting-enhancements)
* [Pull Requests](#pull-requests)

[Styleguides](#styleguides)

* [Git Commit Messages](git-commit-messages)
* [JavaScript](javascript)
* [Documentation](documentation)

[Additional Notes](#additional-notes)

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contribution Guides

### Bug Reports

Bug tracking for this project is done via GitHub issues. If you encounter a bug, create an issue on the repository and provide the following information:

* Explain the problem:
    * **Use a clear and descriptive title**
    * **Describe how to reproduce the problem** in as much detail as possible.
    * **Explain what you expected to happen instead and why**
    * **Include screenshots** if they assist in describing the problem or how to reproduce it.
    * **If it's a crash report** then include the actual crash report.
    * **If you don't know why the problem occurred** then describe what you were doing before the crash.
* Provide more details of the problem:
    * **Has this problem occurred before** or has it always been a problem.
    * **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
* Include details about environment:
    * **App version and channel**
    * **Name and version of operating system**

### Suggesting Enhancements

#### Before Submitting an Enhancement Suggestion

* Make sure the feature or enhancement doesns't already exist in the application
* Check if someone else has already submitted a suggestion

#### Submitting an Enhancement Suggestion

* **Use a clear and descriptive title** for the issue to identify the suggestion
* **Include a clear description of the suggestion**
* **Describe the current behavior** and **explain which behavior you expect to see instead**
* **Explain the benefits of your suggestion**

### Pull Requests

The process described here has several goals:

* Maintain Project quality
* Maintain the Git branching model
* Fix problems that are important to users

Please follow these steps to have your contribution considered by the maintainers:

1. Use an appropriate branch for your change (i.e. a feature branch for new features, improvements, fixing bugs only in develop branch etc... or a hotfix branch for bugfixes in the current release)
2. Follow the branching model used by this repo described in [GIT_MODEL.md](GIT_MODEL.md)
3. Follow all instructions in the pull request template
4. Follow the styleguides

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use present tense
* **Prefix commit with type of change** being made (i.e. `fix: fix some problem`)
* **Separate commits into their constituent parts** (i.e. do not include a fix and a feat type in the same commit)
* **Do not include debug statements** (i.e. printing debug output to console)

Common change Prefixes

* `fix` : Something has been fixed
* `feat` : Added a feature or improved something
* `sec` : Security improvements
* `style` : Changes to code formatting
* `mem` : Fixing memory leaks
* `refactor` : Any sort of code refactoring
* `docs` : Updated docs, commenting etc
* `build` : Changes related to project compile and build process
* `ci` : Continuous Integration related changes
* `perf` : Improvements to performance
* `deps` : Changes to dependencies
* `test` : When adding or changing tests
* `dev` : Changes to the dev environment

### JavaScript

This project is based off [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), although some modifications have been made. These modifications can be found in `.eslintrc.js`

The ESLint config in repository is already configured to use this styleguide. Anything marked as an error MUST be changed to conform, while anything marked as a warning should also be changed, but there may be circumstances in which the warning can be ignored.

**Note**: As ESLint contains lots of options, there may be some which are configured incorrectly. If you come across a particular rule which you think is configured wrong, feel free to contact me.

#### Other JS guidelines not covered by ESLint:

* **Use ES6 features wherever possible**, such as destructuring, template strings, block scoping and arrow functions.
* **Always use `const` for variables**, unless you expect it to change, in which case `let` should be used. Under no circumstances should `var` be used.
* **Do not use function prototypes as classes**, instead use an actual class
* **Use promises instead of callbacks** for asynchronous requests
* **Classes should use uppercase** for the first letter (i.e. `ClassName`, not `className`)
* **Use unix style line endings** (i.e. cr or \n, instead of cr lf or \r\n)

### Documentation

* Use [Markdown](https://daringfireball.net/projects/markdown/)

## Additional Notes

### Channels

There will be three release channels:

- stable
- next
- canary

The "stable" channel will be for releases that are considered to be ready for use by the general public.

The "next" channel is for upcoming releases that are feature-complete, however may not have been properly tested. This channel will generally receive updates faster than the stable channel, however it will be more likely to contain bugs.

The "canary" channel is for nightly releases of the latest features that have been added. With this channel, features are received the fastest, however there will have been very little testing if any, meaning that this is the least stable channel. This channel is considered to be bleeding-edge, and as everything is subject to change, including API features, it should not be used by regular users.

### Version Numbers

Versions are in accordance with the [semver scheme](https://semver.org/) and will be identified by a number triple (i.e. 1.2.3), with an additional label and build number for pre-release channels (i.e. 1.2.3-canary.56).

The first number is the major version number and will be incremented on major changes, as well as when any API changes occur that are not backwards compatible.

The second number is the minor version number and will be incremented on smaller, more general updates such as those that only add several features, or are more focused on bugfixes than adding new features. Minor versions may add API features, but will not render any existing API features incompatible.

The third number is the patch or hotfix version, and will only ever be used for bugfix updates (i.e. updates that only fix bugs). This number will only be incremented on hotfixes for the stable channel, as canary and beta will use the additional build number.

The label denotes the channel that the version is on, and is only used for pre-release channels (canary and next). The build number appended to the label denotes the build version, which will be incremented either nightly for canary, or for a new pre-release (next) version of a major or minor release.

### Issue and Pull Request Labels

This section lists the labels used to help us track and manage issues and pull requests.

#### Types of Issues and Issue States

| Label name         | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `enhancement`      | Feature Requests                                                                                            |
| `bug`              | Confirmed bugs or reports that are very likely to be bugs                                                   |
| `question`         | Questions more than bug reports or feature requests                                                         |
| `feedback`         | General feedback more than bug reports or feature requests                                                  |
| `help-wanted`      | Help from the community would be appreciated in solving these issues                                        |
| `more-info-needed` | More information needs to be collected about these problems or feature requests (e.g. steps to reproduce)   |
| `blocked`          | Issues blocked on other issues                                                                              |
| `duplicate`        | Issues which are duplicates of other issues                                                                 |
| `invalid`          | Issues which aren't valid (e.g. user errors)                                                                |
| `wontfix`          | These issues will not be fixed for now, either because they're working as intended or for some other reason |
| `wrong-repo`       | Issue reported on the wrong repository                                                                      |

#### Topic Categories

| Label name      | Description                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `windows`       | Related to Windows                                                                                        |
| `linux`         | Related to Linux                                                                                          |
| `mac`           | Related to macOS                                                                                          |
| `documentation` | Related to any type of documentation                                                                      |
| `performance`   | Related to performance                                                                                    |
| `security`      | Related to security                                                                                       |
| `ui`            | Related to visual design                                                                                  |
| `crash`         | Related to application crashes                                                                            |
| `network`       | Related to network problems                                                                               |
| `git`           | Related to Git functionality (e.g. problems with gitignore files or with showing the correct file status) |

#### Pull Request Labels

| Label name         | Description                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `work-in-progress` | Pull requests which are still being worked on                                            |
| `needs-review`     | Pull requests which need code review, and approval from maintainers or project core team |
| `under-review`     | Pull requests being reviewed by maintainers or project core team                         |
| `requires-changes` | Pull requests which need to be updated based on review comments and then reviewed again  |
| `needs-testing`    | Pull requests which need manual testing                                                  |

This document was partially based on the contribution guidelines of [Atom](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) and [Electron](https://github.com/electron/electron/blob/master/CONTRIBUTING.md), with modifications.
