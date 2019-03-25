const {
	retrieveAccessToken,
	createAccountAccessConsent,
	authoriseProgramatically,
	getAccounts
} = require('./api');

automaticAuthorisation();

async function automaticAuthorisation() {
	console.log('Getting initial access token...');
	const accessToken = await retrieveAccessToken();

	console.log('Creating consent...');
	const consentId = await createAccountAccessConsent(accessToken);

	console.log(`Consent ID: ${consentId}. Authorising automatically...`);
	const authorisationCode = await authoriseProgramatically(consentId, accessToken);

	console.log('Retreiving authorised access token...');
	const authorisedAccesToken = await retrieveAccessToken(authorisationCode);

	console.log('Retrieving users accounts...');
	const accounts = await getAccounts(authorisedAccesToken);

	console.log('Accounts:');
	console.log(JSON.stringify(accounts, null, 4));
}

// async function manualAuthorisation() {
// 	console.log('Getting initial access token...');
// 	const accessToken = await retrieveAccessToken();

// 	console.log('Creating consent...');
// 	const consentId = await createAccountAccessConsent(accessToken);

// 	console.log(`Consent ID: ${consentId}. Authorising automatically...`);
// 	const authorisationCode = await authoriseProgramatically(consentId, accessToken);

// 	console.log('Retreiving authorised access token...');
// 	const authorisedAccesToken = await retrieveAccessToken(authorisationCode);

// 	console.log('Retrieving users accounts...');
// 	const accounts = await getAccounts(authorisedAccesToken);

// 	console.log('Accounts:');
// 	console.log(JSON.stringify(accounts, null, 4));
// }