nesis.mvc.gui.typeahead = function(e,options){
	if(!e.target instanceof View)return;
	
	var frag=e.target,placeholder=frag.querySelector('.mvc-typeahead'),fn,ds,handler,keys,
		sBox=document.createElement('input'),sBoxLen,
		rBox=document.createElement('ul'),
		dflt={
			datasource:undefined,
			results:true,
			searchOn:'id',
			resultValue:'id',
			resultLabel:'title',
			limit:5
		},popResults,preventDefault;
	
	options = options || {};
	for(var n in options){dflt[n] = options[n];}
	ds = dflt.datasource;
	preventDefault = (ds instanceof nesis.mvc.Model) ? false : true; 
	keys = dflt.searchOn.split(',');
	
	if(!ds || !placeholder){
		if(frag.attr('debug')){console.log('nesis.mvc.gui.typeahead(' + frag.attr('id') + '): Failed datasource or placeholer not found.');}
		return;
	}
		
//	if(ds instanceof nesis.mvc.Model){ 
	if(!preventDefault){ 
		if(dflt.results){
			ds.bind('aftersync',function(e){ 
				var r = e.arguments.data.data,
					path = ds.parent().attr('path');
				
				popResults(path,r);
			});
		}
		fn = function(e){ 
			var obj={limit:dflt.limit};
			for(var i=0,l=keys.length; i<l; i++){obj[keys[i]] = this.value;}
			ds.sync(obj,true);
		};
	}
	else if(ds instanceof Array){
		fn = function(e){
			var r=[],i=0,l=ds.length;
			for(; i<l; i++){ 
				for(var n in ds[i]){
					if(keys.indexOf(n)>-1){
						if(ds[i][n].search(new RegExp(this.value,'i')) > -1){
							var obj={};
							obj[dflt.resultValue] = ds[i][dflt.resultValue];
							obj[dflt.resultLabel] = ds[i][dflt.resultLabel];
							r.push(obj);
							break;
						}
					}
				}								
			}
			popResults(frag.parent().attr('path'),r);
		};
	}
	else{
		fn = function(e){
			var qStr = 'refresh=true&limit='+dflt.limit;
			for(var i=0,l=keys.length; i<l; i++){qStr+='&'+keys[i]+'='+this.value;}
			ds += (ds.indexOf('?') > 0) ? '&'+qStr : '?'+qStr;
			nesis.net.http.ajax(ds,{
				callback:function(res){
					var r = JSON.parse(res.responseText);
					popResults(frag.parent().attr('path'),r.data);
				}
			});
		};
	}
	
	handler=function(e){ 
		var l=this.value.length;			
		if(l > 2 || e.type != 'keyup'){
			rBox.style.display = 'block';
			sBoxLen = l;
			fn.call(this,e);
		}
		else rBox.style.display = 'none';
	};
	
	popResults = function(path,r){
		if(sBoxLen > 0 && r instanceof Array){
			var html = '',href,				
				l=(dflt.limit<r.length)? dflt.limit : r.length; 
					
			for(var i=0; i<l; i++){
				if(preventDefault)
					html += '<li><span data-value="' + r[i][dflt.resultValue] + '">' + r[i][dflt.resultLabel] + '</span></li>';
				else{
					href = '#'+ path + '/' + dflt.resultValue + ':' + r[i][dflt.resultValue] + '/refresh:true';
					html += '<li><a href="' + href + '">' + r[i][dflt.resultLabel] + '</a></li>';
				}
			}
			rBox.innerHTML = html;
		}
	};
	
	//setup searchbox
	sBox.value = e.arguments[0][sBox.name] || '';
	sBox.name= options.searchKey || 'search';
	sBox.type='text';
	sBox.setAttribute('placeholder','Search');
	sBox.title='Type to Search';
	sBoxLen=sBox.value.length;
	
	//Bind Events	
	sBox.addEventListener('keyup',handler,false);
	sBox.addEventListener('paste',function(e){
		setTimeout(function(){handler.call(sBox,e);});
	},false);
	sBox.addEventListener('cut',handler,false);
	rBox.addEventListener('click',function(e){
		sBox.value = e.target.innerHTML;
		this.style.display = 'none';
		if(preventDefault){
			var args={};
			args[dflt.resultValue] = e.target.getAttribute('data-value');
			args[dflt.resultLabel] = sBox.value;
			frag.trigger(new nesis.mvc.Event('change',{
				arguments:args
			}));
		}
	},false);
	
	//Insert into view
	placeholder.appendChild(sBox);
	placeholder.appendChild(rBox);
};
