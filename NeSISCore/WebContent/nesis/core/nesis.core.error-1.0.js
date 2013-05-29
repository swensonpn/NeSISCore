/*
 * OBJECT:nesis.core.error
 * DESCRIPTION:Handles error logging
 * DEPENDANCY: nesis.net,
 * 			   nesis.core.store
 */
nesis.core.error = {
	key:"nesisCoreError",//Local Storage location
	logLevel:0,//0=production,1=testing,2=dev
	maxLogSize:20,//Max number of errors in the log
	remoteUrl:"",
	_init:function(options){
		for(i in options){this[i] = options[i];} 
		if(!nesis.debugOn)//This suppresses uncaught errors.  In debugging uncaught errors should be allowed to break the application
			window.onerror = function(msg,url,line){
				if(msg && url && line)
					nesis.core.error.log({name:'Error',message:msg,fileName:url,lineNumber:line});
				return true;
			};
	},
	handle:function(e){ 
		var msg = Date() + '\n\t' + e.name + ': ' + e.message;
		if (e.stack) { //Firefox & Chrome provide file and lines
		  var lines = e.stack.split('\n');
	      for (var i=0, len=lines.length; i<len; i++) { 
	        if (lines[i].match(/http[.]*/i)) {	
	          msg += '\n\tLocation: ' + lines[i].substr(lines[i].indexOf('http')) + '\n';
	        }
	      }
		}
		this.log(msg);
	},
	log:function(msg){
		var db = nesis.core.store,
			key = nesis.core.error.key,//'nesisCoreError',
			errors = [];
		
		if(this.logLevel < 2){
			if(db.supported){//store locally
				var	savedErr = db.get(key); 					
				errors = (savedErr)? savedErr : errors;					
				errors.push(msg); 
				while(errors.length > this.maxLogSize){errors.shift();}
				db.set(key,errors,true);
			}
			else
				errors.push(msg);
		}
		if(this.logLevel == 1)this.submit(errors.join('\n'));//send immediately
		else if(this.logLevel == 2)console.log('%c'+msg,'color:FireBrick;');
	},
	submit:function(msg){
	    var clearLog = function(){
	    	nesis.core.store.clear(nesis.core.error.key); 	    	
	    };
	    
		if(!this.remoteUrl)console.log('Remote URL not set');
		else{
			try{
				nesis.net.http.ajax(this.remoteUrl,{post:{"errorList":msg},callback:clearLog});
			}
			catch(e){
				console.log("nesis.core.error.sumbit: Error sending log\n\t" + e.message);
			}
		}
	}
};

