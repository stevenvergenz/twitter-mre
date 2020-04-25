import * as MRE from '@microsoft/mixed-reality-extension-sdk';

export default class App {
	constructor(public context: MRE.Context, public params: MRE.ParameterSet, public baseUrl: string) {
		this.context.onStarted(() => this.started());
	}

	private started() {
		
	}
}
