nesis.mvc.Controller = function(k,v){
	var ns=nesis.mvc,o=this,a={},x=[];
	
	o.controller = function(k,v){ 
		var c = o.children('id',k);
		if(!v)
			return (c instanceof Controller) ? c : null;
		v.parent = o;
		c = new ns.Controller(k,v);
		o.append(c);
		return c;	
	};
	
	o.execute = function(args){
		args = args || {};
		var m = o.model(),rslt; 
		o.trigger(new ns.Event('beforeexecute',{arguments:args}));
		if(ns.debugTiming) console.log('execute: ' + o.attr('id'));
		if(m instanceof ns.Model){rslt = m.sync(args);}
		o.trigger(new ns.Event('afterexecute',{arguments:args}));
		//if need to use rslt to stop flow put in some kind of bubble event				
		o.children().each(function(){
			if(this instanceof ns.Controller && this.attr('defaultNode'))
				this.execute(args);
		});		
	};
	
	o.model = function(v){
		var m = (o.children) ? o.children('id',k+'Model') : undefined;
		if(!v) return m;
		
		if(typeof v == 'object'){
			var n,attr={};
			for(n in v){
				attr[n] = v[n];
			}
			attr.id = k+'Model';	
			attr.parent = o;
			v = new ns.Model(attr);
			if(o.remove){
				if(m) o.remove(m);
				o.append(v);
			}
			return v;
		}
	};
	
	o.view = function(v){
		var vw = (o.children) ? o.children('id',k+'View') : undefined;
		if(!v) return vw;
		
		if(typeof v == 'object'){
			var n,attr={},chldrn;
			for(n in v){
				(n == 'templates')? chldrn=v[n] :  attr[n] = v[n];
			}
			attr.id = k+'View';	
			attr.parent = o;
			v = new ns.View(attr,chldrn);
			if(o.remove){
				if(m) o.remove(m);
				o.append(v);
			}
			return v;
		}
	};
	
	//Start Constructor
	a.id = k;
	a.type = 'Controller';
	a.path = k;
	
	if(v.parent){ 
		a.path = v.parent.attr('path').split('.');
		if(a.path.length == 3) a.path.splice(1,1);
		a.path.push(k);
		a.path = a.path.join('.');
	}
	
	v.model = v.model || {};
	v.view = v.view || {};
	
	for(var n in v){
		if('modelviewsubcontrollers'.search(n) > -1)
			x.push({type:n,data:v[n]});
		else
			a[n] = v[n];	
	}
	
	ns.Node.call(o,a,[]);
	
	for(var i=0,l=x.length; i<l; i++){
		switch(x[i].type){
		case 'model':
			o.append(o.model(x[i].data));
			break;
		case 'view':
			o.append(o.view(x[i].data));
			break;
		case 'subcontrollers': 
			for(var n in x[i].data)o.append(o.controller(n,x[i].data[n]));
		};
	}
};
//Setup inheritance 
nesis.mvc.Controller.prototype = Object.create(nesis.mvc.Node.prototype);
nesis.mvc.Controller.constructor = nesis.mvc.Controller;
