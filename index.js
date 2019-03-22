const request = require('request-promise-native');

const clientId = 'WiTzRAOC8uqzfApEBb_nhGqUXuYwsPHz6tY4SeNMMME=';
const clientSecret = 'QQBXZkBL36WaCwlM0_PhzRk6ZHxvUxafCXd5MjrmtPg=';

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
			client_id: clientId,
			client_secret: clientSecret,
			scope: 'accounts'
		},
		proxy: 'http://localhost:8888',
		strictSSL: false,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		json: true
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
		proxy: 'http://localhost:8888',
		strictSSL: false,
		json: true,
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

async function authoriseProgramatically(consentId, accessToken) {
	const response = await request({
		uri: 'https://api.rbs.useinfinite.io/authorize',
		method: 'GET',
		qs: {
			client_id: clientId,
			response_type: 'code id_token',
			scope: 'openid accounts',
			redirect_uri: 'https://9051fb9d-1c3c-4c75-b036-dcbb662e3e7f.example.org/redirect',
			state: 'ABC',
			request: consentId,
			authorization_mode: 'AUTO_POSTMAN',
			authorization_result: 'APPROVED',
			authorization_username: '123456789012@9051fb9d-1c3c-4c75-b036-dcbb662e3e7f.example.org',
		},
		json: true,
		proxy: 'http://localhost:8888',
		strictSSL: false
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
			client_id: clientId,
			client_secret: clientSecret,
			code: authorizationCode
		},
		proxy: 'http://localhost:8888',
		strictSSL: false,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		json: true
	});

	return response.access_token;
}

async function getAccounts(accessToken) {
	const response = await request({
		uri: 'https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/accounts',
		method: 'GET',
		proxy: 'http://localhost:8888',
		strictSSL: false,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'x-fapi-financial-id': '0015800000jfwB4AAI'
		},
		json: true
	});

	console.log(response)

	// return response.access_token;
}

// todo:
// 	move clientId, secret, proxy to config
//	extract common parameters from request e.g. json, strictSSL, etc