const { pantsu } = require('nyaapi');
const WebTorrent = require('webtorrent')
const argv = require('yargs')
	.usage('Usage: $0 --title [string] --episode [num]')
	.example('$0 -t Death Parade -e 1', 'Downloads the first episode of Death Parade, if it exists')
	.alias('t', 'title')
	.nargs('t', 1)
	.describe('t', 'The title of the anime youre looking for')
	.alias('e', 'episode')
	.nargs('e', 1)
	.describe('e', 'The episode of the anime youre looking for')
	.demandOption(['t', 'e'])
	.help('h')
	.alias('h', 'help')
	.argv;

const getEpisode = async fullTitle => {
	try {
		const searchResult = await pantsu.search(fullTitle, 1, { c: '3_5' });

		return searchResult[0];
	} catch (e) {
		console.log(e);
	}
};

const roundToTwoDigits = value => value.toFixed(2);

(async () => {
	const { title, episode } = argv;
	const searchName = `${title} ${episode}`;
	console.log(searchName);

	const foundEpisode = await getEpisode(searchName);

	if (foundEpisode) {
		const client = new WebTorrent();
		const magnetURI = foundEpisode.magnet;

		console.log(`Downloading ${foundEpisode.magnet}`);
		client.add(magnetURI, { path: '/Users/herbertvidela/Projects/Personal/cli-nyaa/' })
		const intervalId = setInterval(() => {
			const progress = roundToTwoDigits(client.progress * 100);
			const downloadSpeed = roundToTwoDigits(client.downloadSpeed/(1024*1024));

			console.log(progress, downloadSpeed);
			if (client.progress === 1) {
				clearInterval(intervalId);
			}
		}, 1000)
	}
})()
