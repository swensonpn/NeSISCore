nesis.mvc.gui.textEditableAjax = function(e){ 
	var frag=e.target,i=0,el=frag.querySelectorAll('*[contenteditable="true"]'),l=el.length;
	for(; i<l; i++){
		el[i].addEventListener('focus',function(e){
			var orig = this.innerHTML,
				blurHandler = function(e){
					this.removeEventListener('blur',blurHandler);
					if(orig != this.innerHTML){
						var obj = {};
						obj[this.id] = this.innerHTML.replace(/(<([^>]+)>)/ig,"");
						frag.parent().model().save(obj);
					}
				};
			
			this.addEventListener('blur',blurHandler,true);
		},true);
	}
};