import { resolve } from 'path';
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
import TwitterFeed from './feed';

/*process.on('uncaughtException', e => MRE.log.error('app', e.toString()));
process.on('unhandledRejection', e => MRE.log.error('app', e));
process.on('SIGTERM', () => {
	process.exit(0);
});*/

/*const server = new MRE.WebHost({
	baseDir: resolve(__dirname, '..', 'public')
});

server.adapter.onConnection((context, params) => new App(context, params, server.baseUrl));

export default server;*/

const feed = new TwitterFeed();
feed.init().then(() => {
	if (feed.rules.rules.every(r => r.value !== '#CongressPassUBI')) {
		feed.rules.addRules([{ value: '#CongressPassUBI' }]);
	}

	feed.connect();
})
.catch(e => console.log(e));
