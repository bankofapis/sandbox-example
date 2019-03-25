const config = require('./config.json');
const request = require('request-promise-native').defaults({
	strictSSL: false,
	json: true,
	proxy: config.proxy
});

async function retrieveAccessToken(authorisationCode = null) {
	const response = await request({
		uri: 'https://ob.rbs.useinfinite.io/token',
		method: 'POST',
		qs: {
			grant_type: authorisationCode
				? 'authorization_code'
				: 'client_credentials',
			client_id: config.clientId,
			client_secret: config.clientSecret,
			code: authorisationCode,
			scope: 'accounts'
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
	});

	return response.access_token;
}

async function createAccountAccessConsent(accessToken) {
	const response = await request({
		uri: 'https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/account-access-consents',
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'x-fapi-financial-id': '0015800000jfwB4AAI'
		},
		body: {
			Data: {
				Permissions: [
					'ReadAccountsDetail',
					'ReadBalances',
					'ReadTransactionsCredits',
					'ReadTransactionsDebits',
					'ReadTransactionsDetail'
				]
			},
			Risk: {}
		}
	});

	return response.Data.ConsentId;
}

async function authoriseProgramatically(consentId) {
	const response = await request({
		uri: 'https://api.rbs.useinfinite.io/authorize',
		method: 'GET',
		qs: {
			client_id: config.clientId,
			response_type: 'code id_token',
			scope: 'openid accounts',
			redirect_uri: config.redirectUri,
			state: 'ABC',
			request: consentId,
			authorization_mode: 'AUTO_POSTMAN',
			authorization_result: 'APPROVED',
			authorization_username: '123456789012@9051fb9d-1c3c-4c75-b036-dcbb662e3e7f.example.org',
		}
	});

	return getAuthorisationCode(response.redirectUri);
}

async function authoriseManually(consentId, initiateUserAuthorisation) {
	const uri = 'https://api.rbs.useinfinite.io/authorize' +
		`?client_id=${config.clientId}` +
		'&response_type=code id_token' +
		'&scope=openid accounts' +
		`&redirect_uri=${config.redirectUri}` +
		`&request=${consentId}`;

	const redirectUri = await initiateUserAuthorisation(uri);

	return getAuthorisationCode(redirectUri);
}

function getAuthorisationCode(redirectUri) {
	// get AUTH_CODE from something like: https://domain/path#p1=v1&code=AUTH_CODE&p3=v3
	const [ , fragmentIdentifier ] = redirectUri.split('#');
	const [ , authorizationCode ] = fragmentIdentifier
		.split('&')
		.map(parameter => parameter.split('='))
		.find(([key]) => key === 'code');

	return authorizationCode;
}

async function getAccounts(accessToken) {
	const response = await request({
		uri: 'https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/accounts',
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'x-fapi-financial-id': '0015800000jfwB4AAI'
		}
	});

	return response.Data.Account;
}

module.exports = {
	retrieveAccessToken,
	createAccountAccessConsent,
	authoriseProgramatically,
	authoriseManually,
	getAccounts
};