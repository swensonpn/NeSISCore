nesis.core.cache = function(options){
	var ns=nesis.core,o=this,lookup={},l1=[],
		l2,l3,
		dflts={
			l1Max:50,
			l1Exp:30000,
			clearInt:5000
		},
		createIndex=function(){
			lookup={};
			for(var i=0,l=l1.length; i<l; i++){lookup[l1[i].key] = l1[i];}
		};
	
	o.clear = function(){
		l1=[];
		l2={};
		l3={};
	};
	
	o.get = function(key,obj,refresh){
		if(refresh){return o.set(key,obj);}
		else{
			//if(l1[key])return l1[key];
			if(lookup[key]) return lookup[key];
			if(l2[key])return JSON.parse(l2[key]);
			if(l3[key]){
				var tmp = JSON.parse(l3[key]),t= new Date();
				if((obj.lastModified && tmp.stamp>obj.lastModified)||(obj.expires && tmp.stamp < obj.expires))
					return o.set(key,obj);
				return tmp;
			}
			return o.set(key,obj);
		}
	};
	
	o.set = function(key,obj){
		obj.key = key;
		obj.stamp = new Date();
		if(obj.datasource) obj = obj.datasource(obj);
		if(lookup[key]) l1[lookup[key]] = obj;
		else
			lookup[key] = l1[l1.length] = obj;
		
		//l1[key] = obj;
		(obj.persist) ? l3[key] = JSON.stringify(obj) : l2[key] = JSON.stringify(obj);		
		return obj;
	};
	
	o.toString = function(){
		var str = 'Cache:l1[\n',n;
		for(var i=0,l=l1.length; i<l; i++){
			str += '\t{\n';
			for(n in l1[i]){
				str += '\t\t' + n + ': ' + l1[i][n] + '\n';
			}
			str += '\t}\n';
		}
		str += ']\nCache:l2{\n';
		for(n in l2){
			str += '\t' + n + ': ' + l2[n] + '\n';			
		}
		str += '}\nCache:l3{\n'
		for(n in l3){
			str += '\t' + n + ': ' + l3[n] + '\n';
		}
		return str + '}';
	};

	for(var n in options){dflts[n]=options[n];}
	l2=sessionStorage || {};
	l3=localStorage || {};
	
	setInterval(function(){
		var t = new Date(new Date().getTime()-dflts.l1exp);
		l1.sort(function(a,b){return b.stamp-a.stamp;});
		//while(l1.length > dflts.l1Max){l1.pop();}
		while(l1.length > 0){l1.pop();}
		createIndex();
		if(typeof(Storage) == 'undefined'){
			l2={}; l3={};
		};
	},dflts.clearInt);
};

/* 
Thoughts.
var cache = l1 a memory cache (needs some limitations)
sessionStorage = l2 

save - persistent localstorage
dom - <script>
remote - ajax

obj = {
	persist=true/false
	lastModified=date
	expires=date
	url=remoteURL for ajax
	id=domId
	data=data
	callback=function
}
*/