nesis.net.http = {
	ajax:function(url,options){
		var defaults = {
				callback:function(){},
				defer:false
			},		
			ajaxObj,
			xmlHttp = function(url,opts){//same domain request object
				var reqObj;
				
				this.send = function(){
					var method = (opts.post) ? "post" : "get",
						params = "";
					
					if(opts.post){
						for(name in opts.post){
							params += name + "=" + opts.post[name] + "&";
						}
					}
					
					reqObj.onreadystatechange = function(){
						if(reqObj.readyState == 4 && (reqObj.status == 200 || reqObj.status == 304)){	
							opts.callback(reqObj);
						}
					};

					reqObj.open(method, url, true);
					reqObj.setRequestHeader("X-Requested-With","XMLHttpRequest");//no support in PS
					if(opts.post) reqObj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					reqObj.send(params);
				};
				
				if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
					reqObj=new XMLHttpRequest();
				}
				else{// code for IE6, IE5
					try{
						reqObj=new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(e){};
				}
				if(!reqObj) throw Error("nesis.net.http.ajax.xmlHttp: Failed to initialize request object");
				
				reqObj.onerror = function(e){
					var msg = (reqObj.status == 0 || reqObj.status == null)? 'Security Violation cross-domain':reqObj.statusText;
					console.log("nesis.net.http.ajax.xmlHttp.onerror: Status=" + reqObj.status + " ReadyState=" + reqObj.readyState + " " + msg);
				};			
			},
			jsonp = function(url,opts){//cross domain request object
				var callId = (new Date().getTime()),
					doGet = function(url,callId){
				
						var div = document.createElement('div'),
							script = document.createElement('script');				
	
						document.body.appendChild(div);
	
						script.type = "text/javascript";
						script.src = url;
						
						div.id = "jsonpDiv" + callId;						
						div.appendChild(script);					
					},
					doPost = function(url,callId,post){
				
						var div = document.createElement('div'), 
							html = '<iframe name="ifr' + callId + '"></iframe>';
			 
						html += '<form target="ifr' + callId + '" method="POST" action="' + url + '" id="frm' + callId + '">';
						
						for(var name in post){
							html += '<input name="' + name + '" value="' + post[name] + '"/>';
						}
						html += '</form>';

						div.id = "jsonpDiv" + callId;
						div.style.display = "none";
						div.innerHTML = html;
						document.body.appendChild(div);
							
						nesis.net.http["timeout" + callId] = setTimeout('console.log("timeout");',4000);
						document.getElementById("frm" + callId).submit();
						
					};
				
				url += (url.search(/\?/) > -1)? "&" : "?";
				url += "async=true&jsoncallback=call" + callId;
				
				if(opts.post){ 			
					nesis.net.http["call"+callId] = function(rObj){
						try{
							opts.callback(rObj);
							var tOutName = rObj.callBackName.replace(/call/,"timeout");
							clearTimeout(nesis.net.http[tOutName]);
							document.body.removeChild(document.getElementById(rObj.callBackName.replace(/call/,"jsonpDiv")));
						}catch(e){
							Error("JSONP POST ERROR: " + e.message);
						}
					};
					this.send = function(){
						doPost(url, callId,opts.post);
					};					
				}
				else{					
					nesis.jsonp["call"+callId] = function(rObj){
						try{
							opts.callback(rObj);						
							document.body.removeChild(document.getElementById(rObj.callBackName.replace(/call/,"jsonpDiv")));
						}catch(e){
							Error("JSONP GET ERROR: " + e.message);
						}
					};
					this.send = function(){
						doGet(url,callId);
					};			
				}
								
			};
			
		this.send = function(cb){
			defaults.callback = cb || defaults.callback;
			ajaxObj.send();
		};
		
		
		//overide defaults
		if(Object.prototype.toString.call( options ) === "[object Object]"){
			for(var name in options){
				defaults[name] = options[name];
			}
		}
		else{
			throw Error("nesis.net.http: param options must be type Object");
		}
		
		//fix url fragments
		if(url.indexOf('http') != 0) url = location.protocol + '//' + location.host + '/' + url;
		
		//create universal object		
		ajaxObj = (url.search(window.location.host) != -1)? new xmlHttp(url, defaults) : new jsonp(url,defaults);

			
		//if not deffered call requet.
		if(!defaults.defer) this.send();
		
		
	},
	pjax:function(url,options){
		//extends ajax with history
	},
	reload:function(){},
	redirect:function(){}
};