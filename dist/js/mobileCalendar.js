(function(Calendar){
'use strict'

	var defaultConfig = {
		transition:'fade', //slide
		i18n:{
			'en':{
				days:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			'zh':{
				days:['一','二','三','四','五','六','日']
			}
		},
		language:'en'
	},
			divStyle = document.createElement('div').style,
			createElement = function(tag){
				return document.createElement(tag);
			},
			createTextNode = function(text){
				return document.createTextNode(text);
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

	function getDates(date){
		var dates = [];
			var currentDate = new Date(date);
			var temp;
			var remainDays;
			var firstDayOfCurrentMonth = (function(){
				var d = new Date(date);
				d.setDate(1);
				return d.getDay();
			}.bind(this))();

			var lastDateOfPreviousMonth = (function(){
				var d = new Date(date);
				d.setDate(0)
				return d;
			}.bind(this))();
			

			var lastDateOfCurrentMonth = (function(){
				var d = new Date(date);
				d.setDate(1);
				d.setMonth(d.getMonth()+1);
				d.setDate(0);
				return d;
			}.bind(this))();			


			for(var i = firstDayOfCurrentMonth - 2;i >= 0;i--){
				dates.push({
					year:lastDateOfPreviousMonth.getFullYear(),
					month:lastDateOfPreviousMonth.getMonth(),
					date:lastDateOfPreviousMonth.getDate() - i
				});
			}

			temp = lastDateOfCurrentMonth.getDate();
			for(var i=1;i <= temp;i++){
				dates.push({
					year:lastDateOfCurrentMonth.getFullYear(),
					month:lastDateOfCurrentMonth.getMonth(),
					date:i
				});
			}

			remainDays = 35 - dates.length;
			temp = new Date(date);
			temp.setDate(1);
			temp.setMonth(temp.getMonth()+1);

			for(var i =1;i <= remainDays;i++){
				dates.push({
					year:temp.getFullYear(),
					month:temp.getMonth(),
					date:i
				})
			}

			return dates;
	}

	function getTable(dates,tbHead){
		var table = createElement('table');
		var tr = createElement('tr');
		tbHead.forEach(function(val,index){
			var td = createElement('td');
			var text = createTextNode(val);
			td.appendChild(text);
			tr.appendChild(td);
		});
		table.appendChild(tr);
		tr = createElement('tr');

		dates.forEach(function(obj,index){
			var td = createElement('td');
			var date = createTextNode(obj.date);
			td.appendChild(date);
			tr.appendChild(td);
			if((index+1) % 7 === 0){
				table.appendChild(tr);
				tr = createElement('tr');
			}
		})

		return table;
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

			var docFrag = document.createDocumentFragment();
			// var ul = createElement('ul');
			// var li = createElement('li');
			var calHeader = createElement('div');
			calHeader.classList.add('cal-header');
			calHeader.innerHTML = '<a class="cal-pre"> < </a><span class="cal-month">9月</span><a class="cal-next">></a>';

			var dates = getDates(this.config.currentDate);
			var table = getTable(dates,this.config.i18n[this.config.language].days);

			table.classList.add('cal-tb');

			docFrag.appendChild(calHeader);
			docFrag.appendChild(table);
			this.container.appendChild(docFrag);

			if(this.config.transition === 'fade'){
				
			}
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