const clipboardy = require('clipboardy');
const config = require('./config.json');
const {waitForClipboardStartingWith} = require('./clipboard-utils');
const {
	retrieveAccessToken,
	createAccountAccessConsent,
	authoriseProgramatically,
	authoriseManually,
	getAccounts
} = require('./api');

authoriseAndGetAccounts(process.argv[2] === 'manual');

async function authoriseAndGetAccounts(manualAuthorisation = false) {
	console.log('Getting initial access token...');
	const accessToken = await retrieveAccessToken();

	console.log('Creating consent...');
	const consentId = await createAccountAccessConsent(accessToken);

	console.log(`Consent ID: ${consentId}. Authorising...`);
	const authorisationCode = manualAuthorisation
		? await startManualAuthorisation(consentId)
		: await authoriseProgramatically(consentId);

	console.log(`Authorisation code received: ${authorisationCode}. Retreiving authorised access token...`);
	const authorisedAccesToken = await retrieveAccessToken(authorisationCode);

	console.log('Retrieving users accounts...');
	const accounts = await getAccounts(authorisedAccesToken);

	console.log('Accounts:');
	console.log(JSON.stringify(accounts, null, 4));
}

async function startManualAuthorisation(consentId) {
	return await authoriseManually(consentId, async userAuthorisationUrl => {
		await clipboardy.write(userAuthorisationUrl);
		console.log('Url for manual authorisation copied to clipboard, launch in a browser to procced.' +
			'Once complete, copy the redirected URL to continue...');

		return await waitForClipboardStartingWith(`https://${config.teamDomain}/redirect`);
	});
}