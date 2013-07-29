nesis.mvc.datasource.ajax = function(obj){
	if(navigator.onLine)
		nesis.net.http.ajax(obj.url,obj);				
	else{//Untested
		var now = new Date(),reqId='onconnect'+o.attr('id')+now.getTime(),
		cb=function(){
			if(navigator.onLine)
				nesis.net.http.ajax(o.attr('remoteURL'),ajaxOpts);						
			else
				setTimeout(cb,this.mvc.ajaxReqCacheDelay);
		};
		ns[reqId] = setTimeout(cb,this.mvc.ajaxReqCacheDelay);
	}	
	return obj;
};