# Sandbox example app

## Preliminary steps

1. Browse to the RBS sandbox [https://developer.rbs.useinfinite.io/](https://developer.rbs.useinfinite.io/)
2. Register an account and verify email address to login
3. On the [dashboard](https://developer.rbs.useinfinite.io/dashboard), click on the pre-created demo app (`demo-app-...`)
4. Under APIs -> Version 3.1.0 of CMA9 Accounts API, click 'Request Access'...
5. Enable 'Allow <reduced> security' and 'Allow Tpp' to programmatically authorise User consents'

## Getting started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Edit `config.json` (see [Configuration](#configuration))
	1. Enter the Client ID and Client Secret from the Credentials section of your app's page ([dashboard](https://developer.rbs.useinfinite.io/dashboard) -> demo-app-... -> Credentials)
	2. Enter the Domain from the Team Information section of your team's page ([dashboard](https://developer.rbs.useinfinite.io/dashboard) -> demo-team-... -> Team Information)
	3. Enter the customerNumber '0123456789012'. (The preloaded data in the sandbox comes with a customer with this number).
4. Run `npm start` to authenticate and fetch user accounts (see [Running the app](#running-the-app))

## Running the app

The example app will create an account-access consent that needs to be authorised by the owner of the accounts, there are two ways to do this:

### 1. Automatic authorisation

Run `npm run start` to start.

This is the default option and requires the `allowProgrammaticAuthorisation` option to be turned on in the sandbox app settings.

The example app will go through the process of gaining account-access consent for all accounts of the configured user, and then get the list of accounts and print them to the console.

### 2. Manual authorisation

Run `npm run start:manual` to start.

This option requires you to open a browser and login as the account owner and authorise the consent in the same way that a real user would authorise consent.

1. The example app will create an account-access consent
2. A URL to the sandbox consent-capture page will be copied to the clipboard
3. Paste the URL into a browser and login as one of the users in the test data
	(for the preloaded data you can use the customerNumber '0123456789012' and password '1234567890')
4. Choose one or more accounts to give consent for the example app to access
5. Once complete the browser will redirect to a new URL which contains the authorisation code
6. Copy the new URL to the clipboard
7. The example app will continue and request account details for the selected accounts

## Configuration

The `config.json` file needs to contain some key information to allow the example app to communicate with the sandbox api:

* `clientId` & `clientSecret`: these keys need to match the app configuration. They are sent to the sandbox's API during the authentication process.
* `teamDomain`: this domain needs to match the domain specified in the team configuration. For a WebApp this should be the domain that the app is hosted on to allow redirection after manual authentication. For a CLI app it can just be a fake domain.
* `customerNumber`: this is the customer whose account information you wish to request. You can pick one from the test data you have uploaded to the sandbox under Dashboard -> team -> Test Data (this is only used for [automatic authentication](#1-automatic-authorisation)).
* `proxy`: optionally set a proxy for http requests to go through, or null for no proxy. 
