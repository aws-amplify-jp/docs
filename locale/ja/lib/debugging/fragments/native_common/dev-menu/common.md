When running a **debug** build of your app, you can access information, view logs, and file GitHub issues for Amplify directly from your application through the developer menu. By filing GitHub issues through the developer menu, critical information about the issue (device and environment information) is automatically added to the issue description, allowing Amplify team members to better assist you in resolving the issue.

<docs-filter platform="ios">

![Amplify iOS Developer Menu](~/images/debugging/iosDevMenu.png)

</docs-filter>

<docs-filter platform="android">

![Amplify Android Developer Menu](~/images/debugging/androidDevMenu.png)

</docs-filter>

<amplify-callout warning>

The developer menu is disabled in **production** app builds.

</amplify-callout>

## Setup

<inline-fragment platform="ios" src="~/lib/debugging/fragments/ios/dev-menu/setup.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/debugging/fragments/android/dev-menu/setup.md"></inline-fragment>

## Access and Usage

<inline-fragment platform="ios" src="~/lib/debugging/fragments/ios/dev-menu/usage.md"></inline-fragment> <inline-fragment platform="android" src="~/lib/debugging/fragments/android/dev-menu/usage.md"></inline-fragment>

The developer menu contains the following:

* **Environment Information** - View versions of Amplify plugins used in your app and developer environment information.
* **Device Information** - View information about the device you are using to run your application.
* **Logs** - View and search the logs generated by Amplify loggers.
* **File a GitHub Issue** - After providing a description of your issue, an issue report is generated. The issue report contains your issue description, environment information, and device information. Within the developer menu, you can copy this issue report or directly file an issue on GitHub. The issue body will be pre-populated with the aforementioned information. When using the developer menu to file a GitHub issue, you will have an opportunity to review the issue information before filing the issue.