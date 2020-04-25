import got from 'got';

const rulesURL = 'https://api.twitter.com/labs/1/tweets/stream/filter/rules';

interface RulesResponse {
	data: Array<Rule>;
	meta: { sent: string }
	errors: any;
}

export interface Rule {
	value: string;
	id?: string;
	tag?: string;
}

export class TwitterRuleList {
	private token: string;
	private _rules: Array<Rule> = [];
	public get rules() {
		return this._rules;
	}

	constructor() { }

	public init(token: string) {
		this.token = token;
		return this.getAllRules();
	}

	private async getAllRules() {
		const response = await got<RulesResponse>(rulesURL, {
			headers: {
				Authorization: `Bearer ${this.token}`
			},
			responseType: 'json'
		});
	
		if (response.statusCode !== 200) {
			throw new Error(response.body.errors);
		}
		console.log(response.body);
		this._rules = response.body.data;
	}

	public async deleteRules(rules: Array<Rule>) {
		const ids = rules.map(rule => rule.id);
		const response = await got<RulesResponse>(rulesURL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.token}`
			},
			json: { delete: { ids } },
			responseType: 'json'
		});
	
		if (response.statusCode !== 200) {
			throw new Error(response.body.errors);
		}
	}

	public async addRules(rules: Array<Rule>) {
		const response = await got<RulesResponse>(rulesURL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.token}`
			},
			json: { add: { rules } },
			responseType: 'json'
		});
	
		if (response.statusCode !== 201) {
			throw new Error(response.body.errors);
		}
	
		this._rules = [...this._rules, ...rules];
	}
}
