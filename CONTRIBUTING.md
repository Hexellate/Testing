# Contributing to project

This document will outline the guidelines for contributing to this project, including styleguides for Git commits; docs; specs; JavaScript, and also bug reports and pull requests. If you see something that should be changed in this document, feel free to make a pull request.

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

[Additional Nodes](#additional-notes)

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
    * **Can you reliably reporoduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
* Include details about environment:
    * **App version**
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
* Fix problems that are important to users

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in the template
2. Follow the styleguides

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use present tense
* **Prefix commit with type of change** being made (i.e. `fix: fix some problem`)
* **Separate commits into their constituent parts**
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

This project is using the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

The ESLint config in repository is already configured to use this styleguide
If you use Prettier to format your code, that should already be configured as well

### Documentation

* Use [Markdown](https://daringfireball.net/projects/markdown/)

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels used to help us track and manage issues and pull requests.

#### Types of Issues and Issue States

| Label name | Description |
| --- | --- |
| `enhancement` | Feature Requests |
| `bug` | Confirmed bugs or reports that are very likely to be bugs |
| `question` | Questions more than bug reports or feature requests |
| `feedback` | General feedback more than bug reports or feature requests |
| `help-wanted` | Help from the community would be appreciated in solving these issues |
| `more-info-needed` | More information needs to be collected about these problems or feature requests (e.g. steps to reproduce) |
| `blocked` | Issues blocked on other issues |
| `duplicate` | Issues which are duplicates of other issues |
| `invalid` | Issues which aren't valid (e.g. user errors) |
| `wontfix` | These issues will not be fixed for now, either because they're working as intended or for some other reason |
| `wrong-repo` | Issue reported on the wrong repository |

#### Topic Categories

| Label name | Description |
| --- | --- |
| `windows` | Related to Windows |
| `linux` | Related to Linux |
| `mac` | Related to macOS |
| `documentation` | Related to any type of documentation |
| `performance` | Related to performance |
| `security` | Related to security |
| `ui` | Related to visual design |
| `crash` | Related to application crashes |
| `network` | Related to network problems |
| `git` | Related to Git functionality (e.g. problems with gitignore files or with showing the correct file status) |

#### Pull Request Labels

| Label name | Description |
| --- | --- |
| `work-in-progress` | Pull requests which are still being worked on |
| `needs-review` | Pull requests which need code review, and approval from maintainers or project core team |
| `under-review` | Pull requests being reviewed by maintainers or project core team |
| `requires-changes` | Pull requests which need to be updated based on review comments and then reviewed again |
| `needs-testing` | Pull requests which need manual testing |

This document was partially based on the contribution guidelines of [Atom](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) and [Electron](https://github.com/electron/electron/blob/master/CONTRIBUTING.md)
