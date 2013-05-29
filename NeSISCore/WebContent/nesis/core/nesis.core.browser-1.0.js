/*
 * METHOD:nesis.core.browser
 * DESCRIPTION:Returns information about the current web browser
 * DEPENDANCY: None
 * @PARAM:Void
 * @RETURN:Void
 */
nesis.core.browser = function(){
	var N= navigator.appName, ua= navigator.userAgent, tem;
	var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
	return M;
};
	