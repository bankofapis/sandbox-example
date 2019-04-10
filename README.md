# Sandbox example app

## Prerequisites

1. A sandbox account
2. Access to 'Version 3.1.0 of CMA9 Accounts' under Dashboard -> app -> APIs (with `allowReducedSecurity` and `allowProgrammaticAuthorisation` turned on)
3. Test data uploaded to the sandbox team under Dashboard -> team -> Test Data

## Getting started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up keys and settings in `config.json` (see [Configuring](#configuring))
4. Run `node index.js` to authenticate and fetch user accounts (see [Running the app](#running-the-app))

## Configuring

The `config.json` file needs to contain some key information to allow the example app to communicate with the sandbox api:

* `clientId` & `clientSecret`: these can be found on the sandbox site under Dashboard -> app -> Credentials
* `teamDomain`: this can be found on the sandbox site under Dashboard -> team -> Team Information
* `customerNumber`: this is the customer whose account information you wish to request. You can pick one from the test data you have uploaded to the sandbox under Dashboard -> team -> Test Data (this is only used for [automatic authentication](#1-automatic-authorisation)).
* `proxy`: optionally set a proxy for http requests to go through, or null for no proxy. 

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
4. Choose one or more accounts to give consent for the example app to access
5. Once complete the browser will redirect to a new URL which contains the authorisation code
6. Copy the new URL to the clipboard
7. The example app will continue and request account details for the selected accounts