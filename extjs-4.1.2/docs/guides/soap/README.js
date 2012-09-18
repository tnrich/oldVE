Ext.data.JsonP.soap({"guide":"<h1>Using SOAP Services in Ext JS</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/soap-section-1'>Configuring a Store to load its records from a SOAP service</a></li>\n<li><a href='#!/guide/soap-section-2'>Loading records into the store</a></li>\n<li><a href='#!/guide/soap-section-3'>Cusomizing the SOAP envelope and body</a></li>\n<li><a href='#!/guide/soap-section-4'>Create, update, and destroy actions</a></li>\n</ol>\n</div>\n\n<hr />\n\n<p>SOAP (Simple Object Access Protocol) is a Web Services standard built on HTTP and XML.\nThe SOAP <a href=\"#!/api/Ext.data.soap.Proxy\" rel=\"Ext.data.soap.Proxy\" class=\"docClass\">Proxy</a> and <a href=\"#!/api/Ext.data.soap.Reader\" rel=\"Ext.data.soap.Reader\" class=\"docClass\">Ext.data.soap.Reader</a> provide a\nconvenient way to create a SOAP request, and load the SOAP response into a\n<a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Ext.data.Store</a>. This guide will show you how to use the SOAP Proxy and Reader to\nload data from and save data to a fictional SOAP service that provides information about\nblenders. This guide assumes a basic knowledge of the Ext JS Data Package.\nIf you are not yet familiar with the fundamentals of the Data Package please refer to the\n<a href=\"#/guide/data\">Data Guide</a>.</p>\n\n<h2 id='soap-section-1'>Configuring a Store to load its records from a SOAP service</h2>\n\n<p>For starters, let's take a look at the simplest configuration required to get a\n<a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> up and running with SOAP data.  First create a\n<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a>.</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('Blender', {\n    extend: '<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a>',\n    fields: [\n        { name: 'id', type: 'int' },\n        { name: 'name', type: 'string' },\n        { name: 'price', type: 'float' }\n    ]\n});\n</code></pre>\n\n<p>Next create the store, proxy and reader.</p>\n\n<pre><code>var store = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Ext.data.Store</a>', {\n    model: 'Blender',\n    proxy: {\n        type: 'soap',\n        url: 'BlenderService/',\n        api: {\n            create: 'CreateBlender',\n            read: 'GetBlenders',\n            update: 'UpdateBlender',\n            destroy: 'DeleteBlender'\n        },\n        soapAction: {\n            create: 'http://example.com/BlenderService/CreateBlender',\n            read: 'http://example.com/BlenderService/GetBlenders',\n            update: 'http://example.com/BlenderService/UpdateBlender',\n            destroy: 'http://example.com/BlenderService/DeleteBlender'\n        },\n        operationParam: 'operation',\n        targetNamespace: 'http://example.com/',\n        reader: {\n            type: 'soap',\n            record: 'm|Blender',\n            namespace: 'm'\n        }\n    }\n});\n</code></pre>\n\n<p>Let's go over the configuration options we just specified.  We created a Store that\nwill contain \"Blender\" model instances.  We configured the Store with a SOAP proxy.\nLets review the proxy's options in a bit more detail:</p>\n\n<ul>\n<li><a href=\"#!/api/Ext.data.soap.Proxy-cfg-url\" rel=\"Ext.data.soap.Proxy-cfg-url\" class=\"docClass\">url</a> - The proxy will use this as the endpoint url for the\nSOAP service for all 4 CRUD (create, read, update, and destroy) actions.  Due to browsers'\n<a href=\"http://en.wikipedia.org/wiki/Same_origin_policy\">same-origin policy</a> this url must be on\nthe same domain, protocol, and port as your Ext JS application. If you need to communicate\nwith a remote SOAP service, you will have to create a server-side proxy on your server that\nfetches and returns the SOAP response from the remote server.</li>\n<li><a href=\"#!/api/Ext.data.soap.Proxy-cfg-api\" rel=\"Ext.data.soap.Proxy-cfg-api\" class=\"docClass\">api</a> - In a regular <a href=\"#!/api/Ext.data.proxy.Ajax\" rel=\"Ext.data.proxy.Ajax\" class=\"docClass\">Ajax Proxy</a>\nthe api configuration property specifies separate urls for each CRUD action. In a SOAP Proxy,\nhowever, the api property is used to configure a SOAP Operation for each CRUD action.  Note:\nyou only need to specify an operation for each action that will actually be used in your\napplication.  For example, if this proxy is only intended to load data and not to write data,\nyou only need to configure the 'read' action.</li>\n<li><a href=\"#!/api/Ext.data.soap.Proxy-cfg-soapAction\" rel=\"Ext.data.soap.Proxy-cfg-soapAction\" class=\"docClass\">soapAction</a> - The SOAP specification requires that\nevery SOAP request contain a SOAPAction HTTP request header. The soapAction config specifies\nthe SOAPAction header that will be sent with each CRUD action.  A soapAction must be\nspecified for each SOAP operation that was configured using the api config.</li>\n<li><a href=\"#!/api/Ext.data.soap.Proxy-cfg-operationParam\" rel=\"Ext.data.soap.Proxy-cfg-operationParam\" class=\"docClass\">operationParam</a> - the name of the url parameter\nthat contains the operation name.  For example, an operationParam of 'operation' would result\nin a read request url that looks something like this:\nhttp://example.com/BlenderService/?operation=GetBlenders</li>\n<li><a href=\"#!/api/Ext.data.soap.Proxy-cfg-targetNamespace\" rel=\"Ext.data.soap.Proxy-cfg-targetNamespace\" class=\"docClass\">targetNamespace</a> - the target namespace of the\nSOAP service.  This is needed to construct the SOAP envelope.</li>\n<li><a href=\"#!/api/Ext.data.soap.Proxy-cfg-reader\" rel=\"Ext.data.soap.Proxy-cfg-reader\" class=\"docClass\">reader</a> - The SOAP <a href=\"#!/api/Ext.data.soap.Reader\" rel=\"Ext.data.soap.Reader\" class=\"docClass\">Reader</a>\nis responsible for extracting the records from the SOAP response and parsing them into\n<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a> instances. The reader's <a href=\"#!/api/Ext.data.soap.Reader-cfg-record\" rel=\"Ext.data.soap.Reader-cfg-record\" class=\"docClass\">record</a>\nproperty is the tagName or the <a href=\"#!/api/Ext.dom.Query\" rel=\"Ext.dom.Query\" class=\"docClass\">DomQuery</a> selector for the repeated XML\nelement that contains the records in the SOAP response.  The reader's\n<a href=\"#!/api/Ext.data.soap.Reader-cfg-namespace\" rel=\"Ext.data.soap.Reader-cfg-namespace\" class=\"docClass\">namespace</a> property is the XML namepsace prefix for\nthe elements containing the record's field data.</li>\n</ul>\n\n\n<h2 id='soap-section-2'>Loading records into the store</h2>\n\n<p>Now that we have everything configured, loading data into the store is as easy as calling\nthe store's load method.  Behind the scenes this will create a SOAP request to the operation\nspecified by the <code>read</code> property in the proxy's api configuration property, which is\n\"GetBlenders\" in our example.  Let's assume that the GetBlenders SOAP operation requires\na \"brand\" parameter.  We can pass the parameter directly to the store's load method, or\nif the parameter value is the same for every request we could configure it directly on the\nproxy using the <a href=\"#!/api/Ext.data.soap.Proxy-cfg-extraParams\" rel=\"Ext.data.soap.Proxy-cfg-extraParams\" class=\"docClass\">extraParams</a> config.  For this example\nlet's just pass it to the store's load method:</p>\n\n<pre><code>store.load({\n    params: {\n        brand: 'Blendtec'\n    }\n});\n</code></pre>\n\n<p>The above call should trigger a post to http://example.com/BlenderService/?operation=GetBlenders.\nAssume that the response to the above request looks like this:</p>\n\n<pre><code>&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;\n&lt;soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"&gt;\n    &lt;soap:Body&gt;\n        &lt;m:GetBlendersResponse xmlns:m=\"http://example.com/\"&gt;\n            &lt;m:Blender&gt;\n                &lt;m:id&gt;1&lt;/m:id&gt;\n                &lt;m:name&gt;Total Blender Classic WildSide&lt;/m:name&gt;\n                &lt;m:price&gt;454.95&lt;/m:price&gt;\n            &lt;/m:Blender&gt;\n            &lt;m:Blender&gt;\n                &lt;m:id&gt;2&lt;/m:id&gt;\n                &lt;m:name&gt;The Kitchen Mill&lt;/m:name&gt;\n                &lt;m:price&gt;179.95&lt;/m:price&gt;\n            &lt;/m:Blender&gt;\n        &lt;/m:GetBlendersResponse&gt;\n    &lt;/soap:Body&gt;\n&lt;/soap:Envelope&gt;\n</code></pre>\n\n<p>Let's pass a callback function to the load call so we can see what the store's records\nlook like after it is loaded:</p>\n\n<pre><code>store.load({\n    params: {\n        brand: 'Blendtec'\n    },\n    callback: function() {\n        console.log(store.getCount()); // 2 records were loaded.\n        console.log(store.getAt(0).get('name')); // get the name field of the first record.\n    }\n});\n</code></pre>\n\n<h2 id='soap-section-3'>Cusomizing the SOAP envelope and body</h2>\n\n<p>Now, using the developer tools in your browser of choice, examine the outgoing XHR requests.\nYou should see a HTTP POST to: http://example.com/BlenderService/?operation=GetBlenders.\nNow examine the post body of this request.  You should see a SOAP envelope that looks\nsomething like this (formatted for readability):</p>\n\n<pre><code>&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?&gt;\n&lt;soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"&gt;\n    &lt;soap:Body&gt;\n        &lt;GetBlenders xmlns=\"http://example.com/\"&gt;\n            &lt;brand&gt;Blendtec&lt;/brand&gt;\n        &lt;/GetBlenders&gt;\n    &lt;/soap:Body&gt;\n&lt;/soap:Envelope&gt;\n</code></pre>\n\n<p>This SOAP envelope was constructed using the <a href=\"#!/api/Ext.data.soap.Proxy-cfg-envelopeTpl\" rel=\"Ext.data.soap.Proxy-cfg-envelopeTpl\" class=\"docClass\">envelopeTpl</a>\ntemplate and the SOAP body was constructed using the <a href=\"#!/api/Ext.data.soap.Proxy-cfg-readBodyTpl\" rel=\"Ext.data.soap.Proxy-cfg-readBodyTpl\" class=\"docClass\">readBodyTpl</a> template.  You may need to modify the body template if the SOAP service\nrequires a different format. You won't typically need to modify the envelope template, but\nit is cusomizable as well.  These configurable templates can each be either an <a href=\"#!/api/Ext.XTemplate\" rel=\"Ext.XTemplate\" class=\"docClass\">XTemplate</a> instance or an array of strings to form an XTemplate. The following illustrates\nusing custom templates to change the \"soap\" envelope namespace prefix to \"s\":</p>\n\n<pre><code>proxy: {\n    ...\n    envelopeTpl: [\n        '&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?&gt;',\n        '&lt;s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\"&gt;',\n            '{[values.bodyTpl.apply(values)]}',\n        '&lt;/s:Envelope&gt;'\n    ],\n    readBodyTpl: [\n        '&lt;s:Body&gt;',\n            '&lt;{operation} xmlns=\"{targetNamespace}\"&gt;',\n                '&lt;tpl foreach=\"params\"&gt;',\n                    '&lt;{$}&gt;{.}&lt;/{$}&gt;',\n                '&lt;/tpl&gt;',\n            '&lt;/{operation}&gt;',\n        '&lt;/s:Body&gt;'\n    ]\n}\n</code></pre>\n\n<p>Call store.load() again and you should see the post body being generated from the new\ntemplates:</p>\n\n<pre><code>&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?&gt;\n&lt;s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\"&gt;\n    &lt;s:Body&gt;\n        &lt;GetBlenders xmlns=\"http://example.com/\"&gt;\n            &lt;brand&gt;Blendtec&lt;/brand&gt;\n        &lt;/GetBlenders&gt;\n    &lt;/s:Body&gt;\n&lt;/s:Envelope&gt;\n</code></pre>\n\n<h2 id='soap-section-4'>Create, update, and destroy actions</h2>\n\n<p>Create, update, and destroy requests work almost the same as read requests with the exception\nof how the SOAP body is constructed.  The simple difference is this - read requests\nconstruct the SOAP body using a set of paramters, while create, update, and destroy requests\nconstruct the SOAP body using a set of records.  By default the templates used to create\nthe SOAP body for create, update, and destroy requests are all the same:</p>\n\n<pre><code>[\n    '&lt;soap:Body&gt;',\n        '&lt;{operation} xmlns=\"{targetNamespace}\"&gt;',\n            '&lt;tpl for=\"records\"&gt;',\n                '{% var recordName=values.modelName.split(\".\").pop(); %}',\n                '&lt;{[recordName]}&gt;',\n                    '&lt;tpl for=\"fields\"&gt;',\n                        '&lt;{name}&gt;{[parent.get(values.name)]}&lt;/{name}&gt;',\n                    '&lt;/tpl&gt;',\n                '&lt;/{[recordName]}&gt;',\n            '&lt;/tpl&gt;',\n        '&lt;/{operation}&gt;',\n    '&lt;/soap:Body&gt;'\n]\n</code></pre>\n\n<p>These templates can be customized using the <a href=\"#!/api/Ext.data.soap.Proxy-cfg-createBodyTpl\" rel=\"Ext.data.soap.Proxy-cfg-createBodyTpl\" class=\"docClass\">createBodyTpl</a>, <a href=\"#!/api/Ext.data.soap.Proxy-cfg-updateBodyTpl\" rel=\"Ext.data.soap.Proxy-cfg-updateBodyTpl\" class=\"docClass\">updateBodyTpl</a>, and\n<a href=\"#!/api/Ext.data.soap.Proxy-cfg-destroyBodyTpl\" rel=\"Ext.data.soap.Proxy-cfg-destroyBodyTpl\" class=\"docClass\">destroyBodyTpl</a> configuration options as described\nin the above section on customizing the SOAP envelope and body, or the\n<a href=\"#!/api/Ext.data.soap.Proxy-cfg-writeBodyTpl\" rel=\"Ext.data.soap.Proxy-cfg-writeBodyTpl\" class=\"docClass\">writeBodyTpl</a> configuration option can be used\nto apply the same template to all three actions.</p>\n\n<p>To issue a create request first we have to create a new record:</p>\n\n<pre><code>var blender = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('Blender', {\n    name: 'WildSide Jar',\n    price: 99\n});\n</code></pre>\n\n<p>Then add the record to the store and call its sync method:</p>\n\n<pre><code>store.add(blender);\nstore.sync();\n</code></pre>\n\n<p>This will result in an HTTP POST being issued to the endpoint url with the create operation\nparameter: http://example.com/BlenderService/?operation=CreateBlender\nIf you examine the post body of this request you will see that the newly created record has\nbeen encoded into the SOAP body:</p>\n\n<pre><code>&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?&gt;\n&lt;soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"&gt;\n    &lt;soap:Body&gt;\n        &lt;CreateBlender xmlns=\"http://example.com/\"&gt;\n            &lt;Blender&gt;\n                &lt;id&gt;0&lt;/id&gt;\n                &lt;name&gt;WildSide Jar&lt;/name&gt;\n                &lt;price&gt;99&lt;/price&gt;\n            &lt;/Blender&gt;\n        &lt;/CreateBlender&gt;\n    &lt;/soap:Body&gt;\n&lt;/soap:Envelope&gt;\n</code></pre>\n\n<p>The response to a create request should include the record as created by the server, so\nthat the record's id can be updated on the client side. For example:</p>\n\n<pre><code>&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;\n&lt;soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"&gt;\n    &lt;soap:Body&gt;\n        &lt;m:GetBlendersResponse xmlns:m=\"http://example.com/\"&gt;\n            &lt;m:Blender&gt;\n                &lt;m:id&gt;3&lt;/m:id&gt;\n                &lt;m:name&gt;WildSide Jar&lt;/m:name&gt;\n                &lt;m:price&gt;99&lt;/m:price&gt;\n            &lt;/m:Blender&gt;\n        &lt;/m:GetBlendersResponse&gt;\n    &lt;/soap:Body&gt;\n&lt;/soap:Envelope&gt;\n</code></pre>\n\n<p>We can verify that the record has the correct id by checking its id property after the\nstore has been successfully synchronized:</p>\n\n<pre><code>store.sync({\n    success: function() {\n        console.log(blender.getId()); // 3\n    }\n});\n</code></pre>\n\n<p>To update a record just modify one of it's fields, and then synchronize the store:</p>\n\n<pre><code>store.getAt(0).set('price', 200);\nstore.sync();\n</code></pre>\n\n<p>To destroy a record, remove it from the store and then synchronize:</p>\n\n<pre><code>store.removeAt(1);\nstore.sync();\n</code></pre>\n\n<p>Just like create actions, if the server response to an update or destroy action includes\nthe record(s) the client side record will be updated with the data in the response.</p>\n\n<p>And that's all you need to know to get up and running with SOAP and Ext JS.  For more\ndetails please refer to the API docs for the SOAP <a href=\"#!/api/Ext.data.soap.Proxy\" rel=\"Ext.data.soap.Proxy\" class=\"docClass\">Proxy</a> and\n<a href=\"#!/api/Ext.data.soap.Reader\" rel=\"Ext.data.soap.Reader\" class=\"docClass\">Reader</a>.</p>\n","title":"Using SOAP Services in Ext JS"});