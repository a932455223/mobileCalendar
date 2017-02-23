(function(Calendar){
'use strict'

	var defaultConfig = {
		transition:'fade', //slide
		i18n:{
			'en':{
				days:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
			},
			'zh':{
				days:['一','二','三','四','五','六','日'],
				months:['一','二','三','四','五','六','七','八','九','十','十一','十二']
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
	})(),
	toString = Object.prototype.toString;


	function getType(param){
		return toString.call(param).slice(8,-1);
	}

	function camelCase(str){
		return (str+'').replace('-ms-','ms-').replace(/-([a-z]|[0-9])/ig,function(match,letter){
			return letter.toUpperCase();
		})
	}


	function getStyle(elem,cssProp){
		var style = window.getComputedStyle && window.getComputedStyle(elem,null) || elem.currentStyle || elem.style;
		return style[cssProp];
	}

	function setStyle(elem, cssProp, cssValue) {
	    if (arguments.length === 2 && typeof arguments[1] === 'object') {
	        var styleObj = arguments[1];
	        for (var k in styleObj) {
	            setStyle(elem, k, styleObj[k]);
	        }
	    } else if (arguments.length === 3) {
	    	var p = testStyle(cssProp);
	    	elem.style[p] = cssValue;
	    }
	}



	function testStyle(cssProp){
		var prop = camelCase(cssProp);
		if(prop in divStyle){
			return prop;
		}
		prop =  camelCase(cssVendor + cssProp);
		if(prop in divStyle){
			return prop;
		}

		return false;
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

	function getDates(date,specialsDays){
		var dates = [];
			var currentDate = new Date(date);
			var temp;
			var remainDays;
			var firstDateOfCurrentMonth = (function(){
				var d = new Date(date);
				d.setDate(1);
				return d;
			}.bind(this))();

			var firstDayOfCurrentMonth = firstDateOfCurrentMonth.getDay();

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

			var yearOfPreviousMonth = lastDateOfPreviousMonth.getFullYear();
			var previousMonth = lastDateOfPreviousMonth.getMonth()+1;
			var dateOfPreviousMonth = lastDateOfPreviousMonth.getDate();

			var checkDate = false;

			if(specialsDays[yearOfPreviousMonth] && specialsDays[yearOfPreviousMonth][previousMonth]){
				checkDate = true;
			}

			for(var i = firstDayOfCurrentMonth - 2;i >= 0;i--){
				var _cdate = dateOfPreviousMonth - i;
				var _obj = {
					year:yearOfPreviousMonth,
					month:previousMonth-1,
					date:_cdate
				};

				if(checkDate && specialsDays[yearOfPreviousMonth][previousMonth][_cdate] && specialsDays[yearOfPreviousMonth][previousMonth][_cdate].className.length > 0 ){
					_obj.className = specialsDays[yearOfPreviousMonth][previousMonth][_cdate].className.join(' ');
				}

				dates.push(_obj);
			}
			var yearOfCurrentMonth = lastDateOfCurrentMonth.getFullYear();
			var currentMonth = lastDateOfCurrentMonth.getMonth()+1;

			temp = lastDateOfCurrentMonth.getDate();
			checkDate = false;
			
			if(specialsDays[yearOfCurrentMonth] && specialsDays[yearOfCurrentMonth][currentMonth]){
				checkDate = true;
			}

			for(var i=1;i <= temp;i++){
				 _obj = {
					year:yearOfCurrentMonth,
					month:currentMonth-1,
					date:i
				}

				if(checkDate && specialsDays[yearOfCurrentMonth][currentMonth][i] && specialsDays[yearOfCurrentMonth][currentMonth][i].className.length > 0){
					_obj.className = specialsDays[yearOfCurrentMonth][currentMonth][i].className.join(' ');
				}

				dates.push(_obj);
			}

			remainDays = 35 - dates.length;
			temp = new Date(date);
			temp.setDate(1);
			temp.setMonth(temp.getMonth()+1);
			var yearOfNextMonth = temp.getFullYear();
			var monthOfNextMonth = temp.getMonth()+1;
			checkDate = false;
			if(specialsDays[yearOfNextMonth] && specialsDays[yearOfNextMonth][monthOfNextMonth]){
				checkDate = true;
			}

			for(var i =1;i <= remainDays;i++){
				  _obj = {
					year:yearOfNextMonth,
					month:monthOfNextMonth-1,
					date:i
				};

				if(checkDate && specialsDays[yearOfNextMonth][monthOfNextMonth][i] && specialsDays[yearOfNextMonth][monthOfNextMonth][i].className.length > 0){
					_obj.className = specialsDays[yearOfNextMonth][monthOfNextMonth][i].className.join(' ');
				}

				dates.push(_obj);
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
			if(obj.className){
				td.className = obj.className;
			}
			td.appendChild(date);
			tr.appendChild(td);
			if((index+1) % 7 === 0){
				table.appendChild(tr);
				tr = createElement('tr');
			}
		})

		table.classList.add('cal-tb');
		return table;
	}


	function getSpecailDates(specials){
		var dates;
		var spec = {};
		var reg = /(\d{4})(-||\/)(\d{1,2})\2(\d{1,2})/;

		function parseDate(date){
			var rest = reg.exec(date);
					var year = parseInt(rest[1]).toString();
					var month = parseInt(rest[3]).toString();
					var date = parseInt(rest[4]).toString();
					if(Object.keys(spec).indexOf(year) === -1){
						spec[year] = {};
						spec[year][month] = {};
						spec[year][month][date] = {
							className:[]
						}
					}else{
						if(Object.keys(spec[year]).indexOf(month) === -1){
							spec[year][month] = {};
							spec[year][month][date] = {
								className:[]
							}
						}else {

							if(!spec[year][month][date]){
								spec[year][month][date] = {
									className:[]
								}
							}
						}

					}

					spec[year][month][date].className.push(k);
		}

		for(var k in specials){
			dates = specials[k].dates;

			if(getType(dates) === 'Array'){

				dates.forEach(function(date){
					parseDate(date);
				});

			}else{
				parseDate(dates);
			}
		}

		return spec;
	}

	Calendar.prototype = {
		init:function(config){
			var self = this;
			defaultConfig.currentDate = new Date();
			self.config = assign({},defaultConfig,config);
			self.currentMonth = new Date(self.config.currentDate);
			self.currentMonth.setDate(1);
			self.width = (function(){
				var _w = self.container.offsetWidth;
				['borderLeftWidth','borderRightWidth','paddingLeft','paddingRight'].forEach(function(prop){
					_w -= (parseInt(getStyle(self.container,prop)) || 0);
				})

				return _w;
			})()


			self.specialDays = getSpecailDates(self.config.specialDays);

			self.render();
			//绑定事件
			document.querySelector('.cal-pre').addEventListener('click',function(){
				self.currentMonth.setMonth(self.currentMonth.getMonth() - 1);
				self.update();
			})

			document.querySelector('.cal-next').addEventListener('click',function(){
				self.currentMonth.setMonth(self.currentMonth.getMonth() + 1);
				self.update();
			});

			document.querySelector('.cal-tb').addEventListener('click',function(evt){

				evt.target.className.split(' ').forEach(function(cls){

					if(self.config.specialDays[cls] && typeof self.config.specialDays[cls].handler === 'function'){//触发事件
							self.config.specialDays[cls].handler.call(evt.target,evt);
					}
				})

			});

		},
		render:function(){
			var docFrag = document.createDocumentFragment();
			var calBody = createElement('div');
			var ul = createElement('ul');
			var li = createElement('li');
			calBody.classList.add('cal-body');
			calBody.style.width = this.width + 'px';
			calBody.style.height = this.width * 0.8 + 'px';
			li.style.width = this.width + 'px';

			var calHeader = createElement('div');
			calHeader.classList.add('cal-header');
			calHeader.innerHTML = '<a class="cal-pre"> < </a><span class="cal-month">'+(this.config.i18n[this.config.language].months[this.currentMonth.getMonth()])+'</span><a class="cal-next">></a>';
			var dates = getDates(this.currentMonth,this.specialDays);
			var table = getTable(dates,this.config.i18n[this.config.language].days);
			console.log(this.config);
			if(this.config.transition === 'fade'){
				li.appendChild(table);
				ul.appendChild(li);
				ul.classList.add('cal-list');
				ul.classList.add('cal-clear');
				calBody.appendChild(ul);
				docFrag.appendChild(calHeader);
				docFrag.appendChild(calBody);
				this.container.appendChild(docFrag);
				this.currentTable = table;
				this.currentLi = li;
				this.header = calHeader;
			}
		},
		update:function(){
			this.currentLi.classList.add('fadeIn');
			var dates = getDates(this.currentMonth,this.specialDays);
			var table = getTable(dates,this.config.i18n[this.config.language].days);
			this.currentTable.remove();
			table.classList.add('fadeIn');
			this.currentLi.append(table);
			this.currentTable = table;
			this.header.querySelector('.cal-month').innerHTML = (this.config.i18n[this.config.language].months[this.currentMonth.getMonth()]);
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