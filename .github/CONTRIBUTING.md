# Auro Design System Contributing Guidelines

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved. Also be sure to review the [Issues, pull requests and labels](https://auro.alaskaair.com/contributing/issues-prs-labels) process document.

If you are an Alaska Airlines Employee, Contractor, or Vendor, please see our [Innersourcing Flow Guide on Sharepoint](https://alaskaair.sharepoint.com/sites/ECOMt/Guilds/auro-users-and-contributors).

## Feature Requests

Feature requests stem from a business need. It is important to understand whether your idea fits within the scope and aims of this project or if this serves to address a personal/local scenario. It is up to you to make a strong case about the merits of this feature. Please provide as much detail and context as possible.

## Submitting issues

A bug is defined by: _"A demonstrable problem that is caused by a file in the repository."_ Good bug reports are extremely helpful - thank you!

To submit an issue, please go to [Auro's project status board](https://auro.alaskaair.com/component-status) and click on the ISSUES link to the left of the associated project you wish to submit an issue for, or click on the GITHUB ISSUES icon at the top of every element's page in the Auro doc site.

Guidelines for bug reports:

1. BEFORE submitting an issue, make sure that you are **using the latest version** of the component you are working with and/or see if you can reproduce the error in the Auro doc site.
1. Check if the issue has already been reported. Go to any Auro repo's issue page and use Github's search features to see if a similar issue has been submitted.
1. Check if the issue has been fixed — try to reproduce it using the latest main or feature branch in the repository
1. Isolate the problem — ideally create a reduced test case and a live example

Please allow up to 48 hours to receive a response from the Auro team post issue submission.

A good bug report shouldn't leave others needing to follow up for more information. Please try to be as detailed as possible in your report. What is your environment? What steps will reproduce the issue? What browser(s) and OS experience the problem? What would you expect to be the outcome? All these details will help people to fix any potential bugs.

Poor bug reports will be closed as the team is unable to reproduce the issue.

PLEASE be responsive to questions asked via the issue's comments. All attempts to communicate to the author of the issue will be made. If the author is unresponsive, the issue will be labeled as `abandoned` and will be closed upon next review.

Please remember, submitting an issue is not a work request. The issue itself is a report of the situation, not a solutions statement.

Please **DO NOT** start any work on a potential pull request until you have consulted with a member of the Auro team per your issue. This brief consultation, facilitated via the issue and its related comments, will help ensure the success of your pull request submission.

## Submitting pull requests

No one other than repository maintainers and trusted committers have `write` access to any repository. For others a pull request must originate from a [forked repo](https://auro.alaskaair.com/contributing/upstream) in your own Github account. If you are interested in `write` access to Auro, please submit a request to the team's leadership.

All new work that is to be considered for merging with the `main` branch must start from a new feature branch of work. This feature branch should be in response to either a [reported bug](https://auro.alaskaair.com/bugs) or a [requested features](https://auro.alaskaair.com/help-wanted).

Unsolicited pull requests **will take longer** to respond to. We ask for your patience. To help expedite any pull request, we ask that you **submit an issue first**. This will help the team understand the problem you are trying to solve before submitting the solution.

To assist with the pull request review, it is also recommended that you **DO NOT** do any work until you have consulted with maintainer related to the Auro project. This process will be facilitated via the issue and its related comments. Once an issue is submitted, please allow up to 48 hours to receive a response from the Auro team post issue submission.

### Feature branch naming

The name of the feature branch should be descriptive as to the nature of the work, reference the author, and please include any references to the story or bug work item ID. For example, if John Doe created a branch for issue #80 about cleaning up the npm API.

```shell
jdoe/cleanUpNpmApi/#80
```

## DO NOT git pull on a feature branch

We ask that we keep our repo's history linear. This helps maintain a easy to understand version history and is crucial to our semantic versioning strategy. If you find yourself unable to push to the remote, please **DO NOT** use the `$ git pull` command. If this is discovered during a review, **the pull request will be rejected**. Please see the following instructions on rebasing below.

### Rebase on main

To maintain repository history health, it is best practice to [rebase branches off of an updated main versus merging down](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).

If you have push access to the repo

```
$ git checkout main
$ git pull
$ git checkout [feature branch]
$ git rebase main
$ git push origin [feature branch] --force
```

If you are working off a forked branch, please see [Maintaining your fork's upstream relationship](https://auro.alaskaair.com/contributing/upstream) to sync your main branch and then follow the outlined steps.

## Conventional Commits

This project utilizes [Conventional Commits](https://www.conventionalcommits.org/) to auto-generate release versions, based on the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

**NOTE:** Before working in your project, be sure to run `$ npm i` to ensure that all packages are installed.

#### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```html
<type>(<scope>): <subject>  <!-- header -->
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Any line of the commit message cannot be longer 100 characters!** This allows the message to be easier to read on GitHub as well as in various git tools. The **header** MUST use an **imperative mood**. The **body**, freeform text is allowed. Please see the **Git commit messages** section below. 

The header is mandatory and the scope of the header is optional. Please see this [example commit](https://github.com/AlaskaAirlines/WC-Generator/commit/8e24c16461ca71349c8986da2a2f33b88426e015) from the WC-Generator repo.

Submitting pull requests that do not conform to the Conventional Commits standard, the team will assume that development dependencies were not installed and no tests were validated prior to submission. **This may result in immediate disqualification of the pull request**.

#### Prefixes

**All commit messages** must be prefixed with a specific type so that the semver release configuration can analyze the commit and apply the correct version release. Please see the following types with their respective meanings.

#### MAJOR

For a **MAJOR** release, you **MUST** follow this template. The use `BREAKING CHANGE:` in conjunction with any other commit type is required in order to push a major release.

A `BREAKING CHANGE` body message can be appended to any prefix that is descriptive of the change. 

```
refactor(pencil): remove graphiteWidth option #80

BREAKING CHANGE: The graphiteWidth option has been removed.
The default graphite width of 10mm is always used for performance reasons.
```

#### MINOR

Using the `feat` prefix will result in a `0.1.0` SemVer release update.

```
feat(pencil): add 'graphiteWidth' option #80
```

#### PATCH

Using the `fix` or `perf` prefix will result in a `0.0.1` SemVer release update.

```
fix(pencil): stop graphite breaking when too much pressure applied #80
```

#### Other commit types

| type | description |
|---|---|
| build | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) |
| ci | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| docs | Documentation only changes |
| feat | A new feature (this correlates with `MINOR` in semantic versioning) |
| fix | A bug fix (this correlates with `PATCH` in semantic versioning) |
| perf | A code change that improves performance (this correlates with `PATCH` in semantic versioning) |
| BREAKING CHANGE | A code change that is not backwards compatible (correlating with `MAJOR` in semantic versioning) |
| refactor | A code change that neither fixes a bug nor adds a feature |
| style | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| test | Adding missing tests or correcting existing tests  |

It is considered best practice to group multiple commits into a release. For a versioned update, be sure that your series of commits include either `feat`, `fix` or `perf`. For a `MAJOR` release, any commit can be accompanied by a `BREAKING CHANGE` comment as illustrated above.

## Git commit messages

Once you have completed your feature update, please commit all changes to the branch. All commit messages should use an **imperative mood**.

Imperative mood simply means _“spoken or written as if giving a command or instruction”_. A few examples are:

* Clean your room
* Close the door
* Take out the trash

A properly formed Git commit subject line should always be able to complete the following sentence:

_"If applied, this commit will (your subject line here)."_

For example:

* If applied, this commit will `refactor component X for accessibility`
* If applied, this commit will `add feature Y to component X`

Example messages when using Conventional Commits:

```
$ build(postCss): update the build step to include postCSS #67

$ docs(install): address typo in install instructions #14

$ perf(api): restructure API to comply with new feature spec #12

$ feat(data api): add ability to consume large data as an array versus string #71

$ fix(color api): address color output issue #105
```

Please add all details to the commit description in the body of the commit message. There is no character limit and no need to be imperative. Listing out the files that were changed in the commit is always helpful. Consider the following example.

```
docs(issues): update issue templates and settings yml #337

This issue updates the bug report template to clarify
some of the content when the form is completed.

Changes to be committed:
modified: .github/ISSUE_TEMPLATE/settings.yml
newfile: .github/ISSUE_TEMPLATE/bug_report.yml
newfile: .github/ISSUE_TEMPLATE/feature_request.yml
newfile: .github/ISSUE_TEMPLATE/general-support.yml
deleted: .github/ISSUE_TEMPLATE/bug_report.md
deleted: .github/ISSUE_TEMPLATE/feature_request.md
```

## Pull request service level agreement

Once a pull request has been created, the assigned reviewer will receive a notification.

Pull request response time depends on the scope of the pull request.

* If the work is solicited and there is an issue assigned to the work, the author of the pull request should expect to receive feedback within 24 hours.
* If the work is unsolicited, and/or is a new feature or refactor of a current feature, the author may expect to wait up to 72 hours for feedback as this will take additional resources to understand the scope of the update.

The reviewer has the option to leave comments, ask questions and reject the pull request if warranted.

Once a reviewer has approved the work, the pull request can then be merged into the main branch.
