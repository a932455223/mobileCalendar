let defaultCofig = {

}

class Calendar{
	constructor(id,config){
		this.container = typeof id === 'string' ? document.getElementById(id):id;
		this.config = Object.assign({}, defaultCofig, config);
	}
}

