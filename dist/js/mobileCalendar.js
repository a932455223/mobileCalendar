(function(Calendar){
'use strict'
	var defaultConfig = {},
			divStyle = document.createElement('div').style,
			createFragment = document.createDocumentFragment,
			createElement = function(tag){
				return document.createElement(tag);
			},
			cssVendor = (function(){
				var prefixs = ['-webkit-','-moz-','-o-','-ms-'],
						prop;
				while(prop = prefixs.shift()){
					if(camelCase(prop+'transform') in divStyle){
						return prop;
					}
				}
				return '';
	})();


	function camelCase(str){
		return (str+'').replace('-ms-','ms-').replace(/-([a-z]|[0-9])/ig,function(match,letter){
			return letter.toUpperCase();
		})
	}


	function getStyle(elem,cssProp){
		var style = window.getComputedStyle && window.getComputedStyle(elem,null) || elem.currentStyle || elem.style;
		return style[cssProp];
	}


	function assign(){
		var args = arguments;
		var len = args.length;
		var rest = Array.isArray(args[0]) ? [] : {};

		for(var i=0;i<len;i++){
			for(var k in args[i]){
				if(args[i].hasOwnProperty(k)){
					rest[k] = args[i][k];
				}
			}
		}

		return rest;
	}

	Calendar.prototype = {
		init:function(config){
			var self = this;
			defaultConfig.currentDate = new Date();
			self.config = assign({},defaultConfig,config);
			self.width = (function(){
				var _w = self.container.offsetWidth;
				['borderLeftWidth','borderRightWidth','paddingLeft','paddingRight'].forEach(function(prop){
					_w -= (parseInt(getStyle(self.container,prop)) || 0);
				})

				return _w;
			})()

			self.render();
		},
		render:function(){

			// var docFrag = createFragment();
			// var ul = createElement('ul');
			// var li = createElement('li');
			var dates = [];
			var table = createElement('table');
			var currentDate = new Date(this.config.currentDate);

			var firstDayOfCurrentMonth = (function(){
				var d = new Date(this.config.currentDate);
				d.setDate(1);
				return d.getDay();
			}.bind(this))();

			var lastDateOfPreviousMonth = (function(){
				var d = new Date(this.config.currentDate);
				d.setDate(0)
				return d.getDate();
			}.bind(this))();
			

			var lastDateOfCurrentMonth = (function(){
				var d = new Date(this.config.currentDate);
				d.setDate(1);
				d.setMonth(d.getMonth()+1);
				d.setDate(0);
				return d.getDate();
			}.bind(this))();			


			for(var i = firstDayOfCurrentMonth - 2;i >= 0;i--){

				dates.push({
					date:lastDateOfPreviousMonth-i
				});
			}

			for(var i=1;i <= lastDateOfCurrentMonth;i++){
				dates.push({
					date:i
				});
			}

			var remainDays = 35 - dates.length;

			for(var i =1;i <= remainDays;i++){
				dates.push({
					date:i
				})
			}

			console.log(dates);
		}
	}

	window.Calendar = Calendar;

})(function(id,config){
	if(!(this instanceof arguments.callee)){
		throw SyntaxError('must invoke by new operator');
	}


	this.container = typeof id === 'string' ? document.getElementById(id) : id;
	this.init(config);
});