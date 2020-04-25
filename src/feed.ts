import { EventEmitter } from 'events';
import { Duplex } from 'stream';
import got from 'got';
import { TwitterRuleList } from './rules';

const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;

const bearerTokenURL = 'https://api.twitter.com/oauth2/token';
const streamURL = 'https://api.twitter.com/labs/1/tweets/stream/filter?format=compact';

interface TokenResponse {
	access_token: string;
	errors: any;
}

export default class TwitterFeed extends EventEmitter {
	public rules = new TwitterRuleList();
	private token = '';

	public constructor() {
		super();
	}

	public async init() {
		await this.authenticate();
		await this.rules.init(this.token);
	}

	public connect() {
		const stream: Duplex = got.stream(streamURL, {
			isStream: true,
			headers: {
				Authorization: `Bearer ${this.token}`
			},
			timeout: 20000
		});
		stream.on('data', data => {
			console.log(data);
		});
		stream.on('error', error => {
			/*if (error.code === 'ESOCKETTIMEDOUT') {
				
			}*/
		});
	}

	private async authenticate() {
		const response = await got<TokenResponse>(bearerTokenURL, {
			method: 'POST',
			username: consumer_key,
			password: consumer_secret,
			responseType: 'json',
			form: {
				grant_type: 'client_credentials',
			}
		});
	  
		if (response.statusCode !== 200) {
			const error = response.body.errors.pop();
			throw Error(`Error ${error?.code}: ${error?.message}`);
		}
	
		this.token = response.body.access_token;
	}
}
