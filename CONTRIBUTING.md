# Orion Design Tokens Contributing Guide Lines

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Feature Requests

Feature requests stem from a business need. Also be sure to find out whether your idea fits with the scope and aims of the project of if this serves to address a personal/local scenario. It is up to you to make a strong case to convince the project's managers of the merits of this feature. Please provide as much detail and context as possible.

## Reporting Bugs

A bug is defined by: "A demonstrable problem that is caused by a file in the repository." Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. Use the search option under Boards > Work Items — check if the issue has already been reported
1. Check if the issue has been fixed — try to reproduce it using the latest master or development branch in the repository
1. Isolate the problem — ideally create a reduced test case and a live example

A good bug report shouldn't leave others needing to chase you up for more information. Please try to be as detailed as possible in your report. What is your environment? What steps will reproduce the issue? What browser(s) and OS experience the problem? What would you expect to be the outcome? All these details will help people to fix any potential bugs.

Poor bug reports will be reassigned back to the creator for revision prior to any additional investigation.

## Submitting pull requests

All new work that is to be considered for merging with the `MASTER` branch must start from a new feature branch of work. This feature branch should be in response to either a bug or a new business requirement.

#### Feature branch naming

The name of the feature branch should be descriptive as to the nature of the work and please include any references to the story or bug work item ID.

#### Git commit messages

Once you have completed your feature update, please commit all changes to the branch. All commit messages should use an **imperative mood**.

Imperative mood simply means _“spoken or written as if giving a command or instruction”_. A few examples are:

* Clean your room
* Close the door
* Take out the trash

A properly formed Git commit subject line should always be able to complete the following sentence:

_"If applied, this commit will [your subject line here]."_

For example:

* If applied, this commit will `refactor component X for accessibility`
* If applied, this commit will `add feature Y to component X`

#### Push branch and submit pull request

One you have committed new work to your feature branch, be sure to push your updates to the Azure repository. Depending on your IDE or CLI configuration this may be a manual or automatic step.

To submit a new pull request, please go to [https://itsals.visualstudio.com/](https://itsals.visualstudio.com/) to find your project. Within the project navigate to **REPOS > BRANCHES**. Hover over your branch and you should see `New pull request` appear to the right. Click on `New pull request`.

On the pull request page, the new pull request should be `[your-new-branch] into [master]`

Please be sure to follow the **Pull Request template** that appears on the comment window.

You must select up to two reviews from your team to validate that the update is correct, solves the problem presented by the story and meets all the requirements for a new merge.

Finally, click the `Create` button.

## Accepting and merging a pull request

Once a pull request has been created, the assigned reviewers should have received notifications. Each reviewer is expected to view the pull request and review all the data per this request.

A reviewer has the option to leave comments, ask questions and reject the pull request.

Once two reviewers have approved the work, the pull request can then be completed.
