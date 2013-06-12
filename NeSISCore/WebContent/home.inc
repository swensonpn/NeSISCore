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
				<li>
					<a href="#templates">Templates</a>
				</li>
				<li>
					<a href="#controls">GUI Controls</a>
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
					It's construction is based on the model, view, controller (MVC) pattern.  
					The goal is to provide a highly modular design that can be customized on a per campus basis, but still share a common code base. 
					Advanced features of popular libraries such as jQuery have been purposely left out so that developers can bring in the tools that work best for them without framework dependancies.
				</p>
			</section>
			<section id="application">
				<div class="page-header">
					<h1>2. Application</h1>					
				</div>
				<p class="lead">
					The application is a special controller which handles routes.  				
				</p>
				<p>
					Only one instance should be created, and saved in a variable called 'app'.
					For information on options for creating an application see the section on controllers.
				</p>
				<h3>Constructor</h3>
				<pre>
nesis.mvc.Application({
	//accepts all options of Controller
});
				</pre>
				<h3>Private Attributes</h3>
				<pre>
//Same as Controller
				</pre>
				<h3>Public Methods</h3>
				<pre>
//Same as Controller
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
	description(optional string)
	id(system string) - defined by parameter one in constructor
	label(optional string)
	oncreate(optional function) - fires at end of object constructor
	onchange(optional function) - fires when attribute changs of child added/removed
	onbeforeexecute(optional function) - fires at beginning of execute method
	onafterexecute(optional function) - fires at the end of execute method
	parent(system Controller) - parent of this controller
	path(system string) - path to this controller object
	type(system string) - always 'Controller'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	append(node instance) - Add valid Model,View, or SubController
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	children([string key,mixed value]) - get a child node or array of nodes.
	controller(string id[,object options) - get or create a sub controller
	execute(object arguments) - execute a mvc process
	find([string key, string value]) - like children but gets all matching nodes below current
	model([object options]) - get or create a model for this controller
	parent() - get the node's parent node
	remove(node instance) - remove a node and it's children from the tree
	toString() - convert to string value
	trigger(string/object event) - fire a specified event for this object
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
	domId:(string id) - this, url, or data required, get model data from the DOM 
	contentType:(string) - optional default is 'text/html'
	expires:(string) - optional when cache is no longer valid
	lastModified(string) - optional when data source last changed
	persist:(boolean) - opional true retains model between sessions
	data:(string) - this domId, or url required, local data
	url:(string) - this, domId, or data required, data source location
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
	domId(optional string) - get model data directly from the DOM
	contentType(optional string) - data source content type
	expires(optional Date) - when model cache is no longer valid
	lastModified(optional Date) - data source last changed
	persist(optional boolean) - false caches for session true caches indefinately
	data(optional mixed) - syncronous data source
	url(optional string) - asyncronous data source
	id(system string) - parent controller id plus 'Model'
	oncreate(optional function) - fires at end of object constructor
	onchange(optional function) - fires when attribute changs of child added/removed
	onbeforesync(optional function) - fires at beginning of sync method
	onbeforesave(optional function) - fires at beginning of save method
	onaftersync(optional function) - fires at end of sync method
	onaftersave(optional function) - fires at end of save method
	parent(system Controller) - parent of this object
	type(system string) - always 'Model'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	parent() - get the node's parent node
	save(object postData) - posts information to the server
	sync(object arguments) - gets information from the server
	toString() - convert to string value
	trigger(string/object event) - fire a specified event for this object
	unbind(string type,function handler) - remove an event listener	
				</pre>
			</section>
			<section id="views">
				<div class="page-header">
					<h1>5. Views</h1>
				</div>
				<p class="lead">
					Responsible for building and displaying html structures to the the user.
				</p>
				<p>
					Use the beforerender and afterrender events to apply gui controls.
					The recommended practice would be to call framework and custom controls in the beforerender event and library controls in the render event.
					Using these events for branding should help avoid unwanted timing issues. 
				</p>
				<h3>Constructor</h3>
				<pre>
parent.view({
	oncreate:(function) - optional event handler
	onchange:(function) - optional event handler 
	onbeforerender:(function) - optional event handler 	
	onafterrender:(function) - optional event handler
	templates:(object) - optional Template node objects needed for JSON ans XSL
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
	parent(system Controller) - parent of this object
	type(system string) - always 'View'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	append(node instance) - Add valid Template
	attr(string key[,mixed value]) - get or set object attributes
	bind(string type,function handler) - add an event listener
	children([string key,mixed value]) - get a child node or array of nodes.
	getElementById(string id) - allows direct DOM access from the view object
	getElementsByTagName(string tagname) - allows direct DOM access from the view object
	parent() - get the node's parent node
	querySelector(string cssSelector) - allows direct DOM access from the view object
	querySelectorAll(string cssSelector) - allows direct DOM access from the view object
	remove(node instance) - remove a node and it's children from the tree
	render(object arguments) - updates the visible page
	template(string key[, node instance) - sets or gets a child template node
	toString() - convert to string value
	trigger(string/object event) - fire a specified event for this object
	unbind(string type,function handler) - remove an event listener		
				</pre>
			</section>
			<section id="templates">
				<div class="page-header">
					<h1>6. Templates</h1>
				</div>
				<p class="lead">
					Reusable objects for converting XSL/JSON data into HTML structures.  
					Only valid as children of Views, and at least one required for JSON and XML data.
				</p>
				<h3>Constructor</h3>
				<pre>
parent.template({
	domId:(string id) - this, url, or data required, get template from a script tag in the DOM 
	templateType:(string) - required javascript or xsl
	expires:(string) - optional when cache is no longer valid
	lastModified(string) - optional when data source last changed
	persist:(boolean) - opional true retains template until modified preferred.
	data:(string) - this domId, or url required, local data
	url:(string) - this, domId, or data required, data source location
	custom:(mixed) - optionally other name value pairs can be passed in for later use.
			These are stored as private attributes, and cannot override 
			system attributes.  Access with the obj.attr() method
});
				</pre>
				<h3>Private Attributes</h3>
				<pre>
	datasource(system function) - standardizes the interface to nesis.core.cache
	domId(optional string) - get model data directly from the DOM
	templateType(required string) - data source content type
	expires(optional Date) - when model cache is no longer valid
	lastModified(optional Date) - data source last changed
	persist(optional boolean) - default is true
	data(optional mixed) - syncronous data source
	url(optional string) - asyncronous data source
	id(system string) - parent controller id plus 'Model'
	parent(system View) - parent of this object
	type(system string) - always 'Template'
				</pre>
				<h3>Public Methods</h3>
				<pre>
	attr(string key[,mixed value]) - get or set object attributes
	parent() - get the node's parent node
	toString() - convert to string value
	transform(json/xml data) - Apply the template to the supplied data.
				</pre>
			</section>
			<section id="controls">
				<div class="page-header">
					<h1>7. GUI Controls</h1>
				</div>
				<p class="lead">
					Pre-built user interface controls that are stored as simple modules for easy addition to the application.
				</p>
				<h3>Functions</h3>
				<pre>
	nesis.mvc.gui.accordianStatic(event e) - give html an accordian style user control
	nesis.mvc.gui.formAjax(event e) - make html forms asyncronous
	nesis.mvc.gui.lightbox(event e) - large modal window suitable for iframes
	nesis.mvc.gui.tabsAjax(event e) - convert child controllers to a tab structure
	nesis.mvc.gui.tabsStatic(event e) - give html a tab style user control
	nesis.mvc.gui.textEditableAjax(event e) - make html editable and submittable to the server
				</pre>
				<h3>Plugin Objects</h3>
				<pre>
				
				</pre>
			</section>
		</div>
	</div>
</div>