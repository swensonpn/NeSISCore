nesis.mvc.gui.formAjax = function(e){
	var frag=e.target,forms=frag.querySelectorAll('form'),fLen=forms.length;
	for(; fLen>0; fLen--){
		forms[fLen-1].addEventListener('submit',function(e){
			//var controller = app.controller(this.action.split('#')[1]),arr=[],inputs;
			//var controller = app.controller(this.action.split('#')[1]),obj={},inputs;
			var obj={},inputs;
			
			e.preventDefault();			
			inputs = this.querySelectorAll('input,select,textarea');
			for(var iLen=inputs.length; iLen>0; iLen--){				
				var i=iLen-1,n=inputs[i].name;
				//if(n) arr.push(n + '=' + inputs[i].value);
				if(n) obj[n] = inputs[i].value;
			}
			
			inputs = document.querySelectorAll('body *[form="' + this.id + '"]');
			for(var iLen=inputs.length; iLen>0; iLen--){
				var i=iLen-1,n=inputs[i].name;
				//if(n) arr.push(n + '=' + inputs[i].value);
				if(n) obj[n] = inputs[i].value;
			}
			//controller.model().save(arr.join('&'));
			frag.parentNode.model().save(obj);
		},true);
	}
};
