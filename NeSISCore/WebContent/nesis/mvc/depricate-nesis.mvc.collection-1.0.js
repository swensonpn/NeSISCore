/* 
 * Object Collection
 * 	Description: Wrapper object for JavaScript literal object.  
 * 	Namespace: nesis.mvc.Collection
 * 	Dependencies: none
 * 	@PARAM: Optional Object initial collection 1 to n levels
 * 	@RETURN: Object Collection
 */
nesis.mvc.Collection = function(x){
	var o=this,c={},
		popCollection = function(obj){
			var i;
			for(i in obj){	
				o.length++;
			}
			return c;
		};
	
	/* 
	 * Function each - iterates over collection applying a supplied callback function to each item
	 * 	@PARAM: Required Function callback
	 * 	@RETURN: Object Collection
	 */
	o.each = function(cb){
		if(cb && typeof cb == 'function'){
			var i=0;
			for(var k in c){
				//cb(i);
				cb.call(c[k]);
				i++;
			};
		}
		return o;
	};
	
	/* 
	 * Function find - search entire collection for a given key
	 * 	@PARAM: Required String key
	 *  @RETURN: Item at key location or undefined
	 */
	o.find = function(k){
		
	};
	
	/*
	 * Function get - get an item from the first level collection
	 * 	@PARAM: Required String key
	 *  @RETURN: Item at key location or undefined
	 */
	o.get = function(k){		
		return c[k];
	};
	
	/* 
	 * Integer length - number of items in the first level collection
	 */
	o.length = 0;
	
	/*
	 * Function set - add or edit an item in the first level collection
	 * 	@PARAM: Required String key
	 *  @PARAM: Required Any value
	 *  @RETURN: value stored at location key
	 */
	o.set = function(k,v){			
		if(k && typeof k == 'string'){
			if(v === null && delete c[k]) o.length--;
			else{
				if(!c[k]) o.length++;
				c[k] = v;
			}
		}
		return c[k];
	};
	
	/*
	 * Function toString - string representation of the collection object
	 * 	@PARAM: Optional Integer numTabs - how many tabs stops to aid in nesting
	 *  @RETURN: String
	 */
	o.toString = function(numTabs){
		var i=numTabs||0,str='Collection(' + o.length + '){\n',tabs='\t';
		for(; i>0; i--){tabs += '\t';}
		for(n in c){
			str += tabs + n + ': ';
			if(c[n] && typeof c[n] == 'object') str += '[object Object]\n';
			else str += c[n] + '\n';
		}
		return str + tabs.substr(1) + '}\n';
	};
	
	(function(x){ 													
		if(x && typeof x == 'object' ) popCollection(x);
	})(x);
};