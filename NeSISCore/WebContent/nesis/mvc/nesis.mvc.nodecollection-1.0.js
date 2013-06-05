nesis.mvc.NodeCollection = function(x){
	var ns=nesis.mvc,o=this,i=0,arr=[];
	
	x = (x instanceof Array)? x : [];
	
	for(i=0,l=x.length; i<l; i++){
		if(x[i] instanceof ns.Node) arr.push(x[i]);
	}

	
	o.append = function(node){ 
		if(node instanceof ns.Node){
			arr.push(node);
			o.length = arr.length;
			return true;
		}
		return false;
	};
	
	o.each = function(fn){
		if(!fn || typeof fn != 'function') return;
		for(i=0,l=arr.length; i<l; i++){
			fn.call(arr[i],i);
		}
	};
	
	o.find = function(k,v,deep){
		var rslt=[];
		for(var i=0,l=arr.length; i<l; i++){
			if(arr[i].attr([k]) == v){
				if(k == 'id') return arr[i];
				rslt.push(arr[i]);
			}
			if(deep && arr[i].children().length > 0){
				rslt.concat(arr[i].children().find(k,v,true));
			}
		}
		return rslt;
	};
	
	o.length = arr.length;
	
	o.remove = function(node){
		for(i=0,l=arr.length; i<l; i++){
			if(arr[i] == node){
				arr.splice(i,1);
				o.length = arr.length;
				return node;
			}
		}		
	};
	
	o.toString = function(t){
		var tab="",str="";
		for(; t>0; t--){tab += '\t';}
		str += tab + 'Collection(' + arr.length + '){\n';
		for(var i=0,l=arr.length; i<l; i++){
			str += tab + '\t' + (arr[i].attr('type')||'Node') + '(' + (arr[i].attr('id') || '') + ')\n';
		}
		return str + tab + '}\n';
	};
};