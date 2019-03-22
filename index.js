const request = require('request-promise-native');

const clientId = 'WiTzRAOC8uqzfApEBb_nhGqUXuYwsPHz6tY4SeNMMME=';
const clientSecret = 'QQBXZkBL36WaCwlM0_PhzRk6ZHxvUxafCXd5MjrmtPg=';

(async function() {
	const accessToken = await retrieveAccessToken();

	await accountAccessConsent(accessToken);
})();

// const urls = {
// 	token: 'https://ob.rbs.useinfinite.io/token',
// 	consents: 'https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/account-access-consents',
// 	authorize: 'https://api.rbs.useinfinite.io/authorize'
// }

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
		json: true,
		body: consentId && {
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

	console.log(response);
}

// todo:
// 	move clientId, secret, proxy to config
//	extract common parameters from request e.g. json, strictSSL, etc