const config = require('./config.json');
const requestBase = require('request-promise-native')

const request = requestBase.defaults({
	strictSSL: false,
	json: true,
	proxy: config.proxy
});

(async function() {
	const accessToken = await retrieveAccessToken();

	const consentId = await accountAccessConsent(accessToken);

	const authorisationCode = await authoriseProgramatically(consentId, accessToken);

	const authorisedAccesToken = await retreiveAuthorisedAccessToken(authorisationCode);

	await getAccounts(authorisedAccesToken);
})();

async function retrieveAccessToken() {
	const response = await request({
		uri: 'https://ob.rbs.useinfinite.io/token',
		method: 'POST',
		qs: {
			grant_type: 'client_credentials',
			client_id: config.clientId,
			client_secret: config.clientSecret,
			scope: 'accounts'
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
	});

	return response.access_token;
}

async function accountAccessConsent(accessToken, consentId = null) {
	const response = await request({
		uri: `https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/account-access-consents`,///{$consentId}`,
		method: consentId ? 'GET' : 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'x-fapi-financial-id': '0015800000jfwB4AAI'
		},
		body: !consentId && {
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

	return consentId
		? response
		: response.Data.ConsentId;
}

async function authoriseProgramatically(consentId) {
	const response = await request({
		uri: 'https://api.rbs.useinfinite.io/authorize',
		method: 'GET',
		qs: {
			client_id: config.clientId,
			response_type: 'code id_token',
			scope: 'openid accounts',
			redirect_uri: 'https://9051fb9d-1c3c-4c75-b036-dcbb662e3e7f.example.org/redirect',
			state: 'ABC',
			request: consentId,
			authorization_mode: 'AUTO_POSTMAN',
			authorization_result: 'APPROVED',
			authorization_username: '123456789012@9051fb9d-1c3c-4c75-b036-dcbb662e3e7f.example.org',
		}
	})

	const { redirectUri } = response
	const [ , fragment ] = redirectUri.split('#')
	const [ , authorizationCode ] = fragment
		.split('&')
		.map(parameter => parameter.split('='))
		.find(([key]) => key === 'code')

	return authorizationCode
}

// combine this with the one at the top, they're very similar
async function retreiveAuthorisedAccessToken(authorizationCode) {
	const response = await request({
		uri: 'https://ob.rbs.useinfinite.io/token',
		method: 'POST',
		qs: {
			grant_type: 'authorization_code',
			client_id: config.clientId,
			client_secret: config.clientSecret,
			code: authorizationCode
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	return response.access_token;
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

	console.log(response)
}