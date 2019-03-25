const clipboardy = require('clipboardy');

function waitForClipboardStartingWith(matchingText) {
	return new Promise(resolve => {
		setTimeout(async function handler() {
			const clipboardContents = await clipboardy.read();

			if (clipboardContents.startsWith(matchingText))
				resolve(clipboardContents);
			else
				setTimeout(handler, 1000);

		}, 1000);
	});
}

module.exports = {
	waitForClipboardStartingWith
};