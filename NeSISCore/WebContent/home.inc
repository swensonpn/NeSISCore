<div class="container">
	<div class="row">
		<div class="span3 bs-docs-sidebar">
			<ul class="nav nav-list bs-docs-sidenav affix-top">
				<li>
					<a href="#overview">Overview</a>
				</li>
				<li>
					<a href="#application">Application</a>
				</li>
				<li>
					<a href="#controllers">Controllers</a>
				</li>
				<li>
					<a href="#models">Models</a>
				</li>
				<li>
					<a href="#views">Views</a>
				</li>
			</ul>
		</div>
		<div class="span9">
			<section id="overview">
				<div class="page-header">
					<h1>1. Overview</h1>					
				</div>
				<p class="lead">
					
				</p>
				<p>
					It's construction is based on the model, view, controller (MVC) pattern.  The goal  
				</p>
			</section>
			<section id="application">
				<div class="page-header">
					<h1>2. Application</h1>					
				</div>
				<p class="lead">
					The application is a special controller which handles routes.
					Only one instance should be created, and saved in a variable called 'app'.
				</p>
				<h3>Constructor</h3>
				<pre>
nesis.mvc.Application({
	label:(string) - optional value used for display to end users
	description:(string) -  optional value used for display to end users
	model:(object) - model constructor object see Models
	view:(object) - view constructor object see Views
	oncreate:(function) - optional event handler
	onchange:(function) - optional event handler 
	onbeforeexecute:(function) - optional event handler 
	onafterexecute:(function) - optional event handler
	custom:(mixed) - optionally other name value pairs can be passed in for later use.
			These are stored as private attributes, and cannot override 
			system attributes.  Access with the obj.attr() method
});
				</pre>
				<h3>Private Attributes</h3>
				<pre>
	childNodes(system Collection) - Model, View, SubControllers
	description(optional string)
	id(system string) - always 'Application'
	label(optional string)
	oncreate(optional function) - fires at end of object constructor
	onchange(optional function) - fires when attribute changs of child added/removed
	onbeforeexecute(optional function) - fires at beginning of execute method
	onafterexecute(optional function) - fires at the end of execute method
	parentNode(system null) - always null
	path(system string) - path to this controller object
	type(system string) - always 'Application'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	controller(string id[,object options) - get or create a sub controller
	execute(object arguments) - execute a mvc process
	model([object options]) - get or create a model for this controller
	router([string route[,object controller]]) - get or set a new route
	toString() - convert to string value
	unbind(string type,function handler) - remove an event listener
	view([object options]) - get or create a view for this controller		
				</pre>
			</section>
			<section id="controllers">
				<div class="page-header">
					<h1>3. Controllers</h1>
				</div>
				<p class="lead">
					Responsible for controlling the flow of the application. 
					Controllers are arranged in a tree structure.  
					They have one parent, zero or more subcontrollers, one model, and one view
				</p>
				<h3>Constructor</h3>
				<pre>
parent.controller('id',{
	label:(string) - optional value used for display to end users
	description:(string) -  optional value used for display to end users
	model:(object) - model constructor object see Models
	view:(object) - view constructor object see Views
	oncreate:(function) - optional event handler
	onchange:(function) - optional event handler 
	onbeforeexecute:(function) - optional event handler 
	onafterexecute:(function) - optional event handler
	custom:(mixed) - optionally other name value pairs can be passed in for later use.
			These are stored as private attributes, and cannot override 
			system attributes.  Access with the obj.attr() method
});
				</pre>
				<h3>Private Attributes</h3>
				<pre>
	childNodes(system Collection) - Model, View, SubControllers
	description(optional string)
	id(system string) - defined by parameter one in constructor
	label(optional string)
	oncreate(optional function) - fires at end of object constructor
	onchange(optional function) - fires when attribute changs of child added/removed
	onbeforeexecute(optional function) - fires at beginning of execute method
	onafterexecute(optional function) - fires at the end of execute method
	parentNode(system Controller) - parent of this controller
	path(system string) - path to this controller object
	type(system string) - always 'Controller'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	controller(string id[,object options) - get or create a sub controller
	execute(object arguments) - execute a mvc process
	model([object options]) - get or create a model for this controller
	toString() - convert to string value
	unbind(string type,function handler) - remove an event listener
	view([object options]) - get or create a view for this controller		
				</pre>
			</section>
			<section id="models">
				<div class="page-header">
					<h1>4. Models</h1>
				</div>
				<p class="lead">
					Responsible for interaction with the server and local storage.  
					Can handle HTML,JSON,and XML data.
				</p>
				<h3>Constructor</h3>
				<pre>
parent.model({
	contentType:(string) - optional default is 'text/html'
	expires:(string) - optional when cache is no longer valid
	lastModified(string) - optional when data source last changed
	data:(string) - this or remoteUrl required, local data
	remoteUrl:(string) - this or data required, data source location
	oncreate:(function) - optional event handler
	onchange:(function) - optional event handler 
	onbeforesync:(function) - optional event handler 
	onbeforesave:(function) - optional event handler 
	onaftersync:(function) - optional event handler
	onaftersave:(function) - optional event handler
	custom:(mixed) - optionally other name value pairs can be passed in for later use.
			These are stored as private attributes, and cannot override 
			system attributes.  Access with the obj.attr() method
});
				</pre>
				<h3>Private Attributes</h3>
				<pre>
	contentType(optional string) - data source content type
	expires(optional Date) - when model cache is no longer valid
	lastModified(optional Date) - data source last changed
	data(optional* mixed) - syncronous data source
	remoteUrl(optiona* string) - asyncronous data source
	id(system string) - parent controller id plus 'Model'
	oncreate(optional function) - fires at end of object constructor
	onchange(optional function) - fires when attribute changs of child added/removed
	onbeforesync(optional function) - fires at beginning of sync method
	onbeforesave(optional function) - fires at beginning of save method
	onaftersync(optional function) - fires at end of sync method
	onaftersave(optional function) - fires at end of save method
	parentNode(system Controller) - parent of this object
	type(system string) - always 'Model'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	save(object postData) - posts information to the server
	sync(object arguments) - gets information from the server
	unbind(string type,function handler) - remove an event listener
	toString() - convert to string value		
				</pre>
			</section>
			<section id="views">
				<div class="page-header">
					<h1>5. Views</h1>
				</div>
				<p class="lead">
					Responsible for building and displaying html structures to the the user.
				</p>
				<h3>Constructor</h3>
				<pre>
parent.view({
	oncreate:(function) - optional event handler
	onchange:(function) - optional event handler 
	onbeforerender:(function) - optional event handler 	
	onafterrender:(function) - optional event handler
	template:(string) - optional XSL or HTML template
	custom:(mixed) - optionally other name value pairs can be passed in for later use.
			These are stored as private attributes, and cannot override 
			system attributes.  Access with the obj.attr() method
});
				</pre>
				<h3>Private Attributes</h3>
				<pre>
	id(system string) - parent controller id plus 'Model'
	oncreate(optional function) - fires at end of object constructor
	onchange(optional function) - fires when attribute changs of child added/removed
	onbeforerender(optional function) - fires before screen redraw
	onafterrender(optional function) - fires at after screen redraw
	parentNode(system Controller) - parent of this object
	type(system string) - always 'View'
	template(optional mixed) - used to transform JSON and XML data to HTML
				</pre>
				<h3>Public Methods</h3>
				<pre>
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	render(object arguments) - updates the visible page
	unbind(string type,function handler) - remove an event listener
	toString() - convert to string value		
				</pre>
			</section>
		</div>
	</div>
</div>