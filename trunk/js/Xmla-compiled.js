(function(){var x="http://schemas.xmlsoap.org/soap/",q=x+"envelope/",y='xmlns:SOAP-ENV="'+q+'"',r='SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"',s="urn:schemas-microsoft-com:",t=s+"xml-analysis",z='xmlns="'+t+'"',A=s+"xml-sql",u="http://www.w3.org/2001/XMLSchema",v=t+":rowset",n=document.getElementsByTagNameNS,B=window.ActiveXObject?true:false;function C(a){var b;b=B?new ActiveXObject("MSXML2.XMLHTTP.3.0"):new XMLHttpRequest;b.open("POST",a.url,a.async);var d=false;function c(){d=
true;switch(b.readyState){case 0:a.aborted(b);break;case 4:b.status==200?a.complete(b,"success"):a.error(b,b.status,null);break}}b.onreadystatechange=c;b.setRequestHeader("Content-Type","text/xml");b.send(a.data);!a.async&&!d&&c.call(b);return b}function o(a,b){return typeof a==b}function j(a){return o(a,"undefined")}function D(a){return o(a,"function")}function E(a){return o(a,"string")}function F(a){return o(a,"number")}function G(a){return o(a,"object")}function w(a){return a.replace(/\&/g,"&amp;").replace(/</g,
"&lt;").replace(/>/g,"&gt;")}function p(a,b,d){var c="<"+a+">";if(d){var e;c+="<"+b+">";for(var g in d){e=d[g];c+="<"+g+">";switch(typeof e){case "array":for(var i,h=0,H=e.length;h<H;h++){i=e[h];c+="<Value>"+w(i)+"</Value>"}break;default:c+=w(e)}c+="</"+g+">"}c+="</"+b+">"}c+="</"+a+">";return c}function I(a){var b="",d=a.method;b+="<SOAP-ENV:Envelope "+y+" "+r+"><SOAP-ENV:Body><"+d+" "+z+" "+r+">";var c=null;switch(d){case Xmla.METHOD_DISCOVER:if(j(a.requestType))c={name:"Missing request type",description:'Requests of the "Discover" method must specify a requestType.'};
else b+="<"+Xmla.REQUESTTYPE+">"+a.requestType+"</"+Xmla.REQUESTTYPE+">"+p("Restrictions","RestrictionList",a.restrictions)+p("Properties","PropertyList",a.properties);break;case Xmla.METHOD_EXECUTE:if(j(a.statement))c={name:"Missing statement",description:'Requests of the "Execute" method must specify an MDX statement.'};else b+="<Command><Statement>"+a.statement+"</Statement></Command>"+p("Properties","PropertyList",a.properties);break;default:c={name:"Invalid XMLA method",description:'The method must be either "Discover" or "Execute".'}}if(c!=
null)throw c;b+="   </"+d+"></SOAP-ENV:Body></SOAP-ENV:Envelope>";return b}function f(a,b,d){if(b&&!a)a={};for(var c in b)if(d||j(a[c]))a[c]=b[c];return a}Xmla=function(a){this.listeners={};this.listeners[Xmla.EVENT_REQUEST]=[];this.listeners[Xmla.EVENT_SUCCESS]=[];this.listeners[Xmla.EVENT_ERROR]=[];this.listeners[Xmla.EVENT_DISCOVER]=[];this.listeners[Xmla.EVENT_DISCOVER_SUCCESS]=[];this.listeners[Xmla.EVENT_DISCOVER_ERROR]=[];this.listeners[Xmla.EVENT_EXECUTE]=[];this.listeners[Xmla.EVENT_EXECUTE_SUCCESS]=
[];this.listeners[Xmla.EVENT_EXECUTE_ERROR]=[];this.options=f(f({},Xmla.defaultOptions,true),a,true)};Xmla.defaultOptions={requestTimeout:30000,async:false};Xmla.METHOD_DISCOVER="Discover";Xmla.METHOD_EXECUTE="Execute";Xmla.REQUESTTYPE="RequestType";var l="DISCOVER_",k="MDSCHEMA_",m="DBSCHEMA_";Xmla.DISCOVER_DATASOURCES=l+"DATASOURCES";Xmla.DISCOVER_PROPERTIES=l+"PROPERTIES";Xmla.DISCOVER_SCHEMA_ROWSETS=l+"SCHEMA_ROWSETS";Xmla.DISCOVER_ENUMERATORS=l+"ENUMERATORS";Xmla.DISCOVER_KEYWORDS=l+"KEYWORDS";
Xmla.DISCOVER_LITERALS=l+"LITERALS";Xmla.DBSCHEMA_CATALOGS=m+"CATALOGS";Xmla.DBSCHEMA_COLUMNS=m+"COLUMNS";Xmla.DBSCHEMA_PROVIDER_TYPES=m+"PROVIDER_TYPES";Xmla.DBSCHEMA_SCHEMATA=m+"SCHEMATA";Xmla.DBSCHEMA_TABLES=m+"TABLES";Xmla.DBSCHEMA_TABLES_INFO=m+"TABLES_INFO";Xmla.MDSCHEMA_ACTIONS=k+"ACTIONS";Xmla.MDSCHEMA_CUBES=k+"CUBES";Xmla.MDSCHEMA_DIMENSIONS=k+"DIMENSIONS";Xmla.MDSCHEMA_FUNCTIONS=k+"FUNCTIONS";Xmla.MDSCHEMA_HIERARCHIES=k+"HIERARCHIES";Xmla.MDSCHEMA_LEVELS=k+"LEVELS";Xmla.MDSCHEMA_MEASURES=
k+"MEASURES";Xmla.MDSCHEMA_MEMBERS=k+"MEMBERS";Xmla.MDSCHEMA_PROPERTIES=k+"PROPERTIES";Xmla.MDSCHEMA_SETS=k+"SETS";Xmla.EVENT_REQUEST="request";Xmla.EVENT_SUCCESS="success";Xmla.EVENT_ERROR="error";Xmla.EVENT_EXECUTE="execute";Xmla.EVENT_EXECUTE_SUCCESS="executesuccess";Xmla.EVENT_EXECUTE_ERROR="executeerror";Xmla.EVENT_DISCOVER="discover";Xmla.EVENT_DISCOVER_SUCCESS="discoversuccess";Xmla.EVENT_DISCOVER_ERROR="discovererror";Xmla.EVENT_GENERAL=[Xmla.EVENT_REQUEST,Xmla.EVENT_SUCCESS,Xmla.EVENT_ERROR];
Xmla.EVENT_DISCOVER_ALL=[Xmla.EVENT_DISCOVER,Xmla.EVENT_DISCOVER_SUCCESS,Xmla.EVENT_DISCOVER_ERROR];Xmla.EVENT_EXECUTE_ALL=[Xmla.EVENT_EXECUTE,Xmla.EVENT_EXECUTE_SUCCESS,Xmla.EVENT_EXECUTE_ERROR];Xmla.EVENT_ALL=[].concat(Xmla.EVENT_GENERAL,Xmla.EVENT_DISCOVER_ALL,Xmla.EVENT_EXECUTE_ALL);Xmla.PROP_DATASOURCEINFO="DataSourceInfo";Xmla.PROP_CATALOG="Catalog";Xmla.PROP_CUBE="Cube";Xmla.PROP_CONTENT="Content";Xmla.PROP_CONTENT_SCHEMA="Schema";Xmla.PROP_CONTENT_DATA="Data";Xmla.PROP_CONTENT_SCHEMADATA=
"SchemaData";Xmla.PROP_FORMAT="Format";Xmla.PROP_FORMAT_TABULAR="Tabular";Xmla.PROP_FORMAT_MULTIDIMENSIONAL="Multidimensional";Xmla.PROP_AXISFORMAT="AxisFormat";Xmla.PROP_AXISFORMAT_TUPLE="TupleFormat";Xmla.PROP_AXISFORMAT_CLUSTER="ClusterFormat";Xmla.PROP_AXISFORMAT_CUSTOM="CustomFormat";Xmla.prototype={listeners:null,setOptions:function(a){f(this.options,a,true)},addListener:function(a){var b=a.events;if(j(b))throw"No events specified";if(E(b))b=b=="all"?Xmla.EVENT_ALL:b.split(",");if(!(b instanceof
Array))throw'Property "events" must be comma separated list string or array.';for(var d=b.length,c,e,g=0;g<d;g++){c=b[g].replace(/\s+/g,"");e=this.listeners[c];if(!e)throw'Event "'+c+'" is not defined.';if(D(a.handler)){if(!G(a.scope))a.scope=window;e.push(a)}else throw"Invalid listener: handler is not a function";}},_fireEvent:function(a,b,d){var c=this.listeners[a];if(!c)throw'Event "'+a+'" is not defined.';var e=c.length,g=true;if(e)for(var i,h=0;h<e;h++){i=c[h];i=i.handler.call(i.scope,a,b,this);
if(d&&i===false){g=false;break}}else if(a=="error")throw b;return g},request:function(a){var b=this,d=I(a);a.soapMessage=d;d={async:j(a.async)?this.options.async:a.async,timeout:this.options.requestTimeout,contentType:"text/xml",data:d,dataType:"xml",error:function(c,e,g){b._requestError({xmla:b,request:a,xhr:c,error:{errorCategory:"xhrError",errorString:e,errorObject:g}})},complete:function(c,e){e=="success"&&b._requestSuccess({xmla:b,request:a,xhr:c,status:status})},url:j(a.url)?this.options.url:
a.url,type:"POST"};if(a.username)d.username=a.username;if(a.password)d.password=a.password;this.response=null;if(this._fireEvent(Xmla.EVENT_REQUEST,a,true)&&(a.method==Xmla.METHOD_DISCOVER&&this._fireEvent(Xmla.EVENT_DISCOVER,a)||a.method==Xmla.METHOD_EXECUTE&&this._fireEvent(Xmla.EVENT_EXECUTE,a)))d=C(d);return this.response},_requestError:function(a){a.xmla=this;this._fireEvent("error",a)},_requestSuccess:function(a){var b=a.xhr;this.responseXML=b.responseXML;this.responseText=b.responseText;var d=
a.request;b=d.method;var c;c=n?this.responseXML.getElementsByTagNameNS(q,"Fault"):this.responseXML.getElementsByTagName("Fault");if(c.length){c=c.item(0);var e=c.getElementsByTagName("faultcode").item(0).childNodes.item(0).data;c=c.getElementsByTagName("faultstring").item(0).childNodes.item(0).data;e={errorCategory:"soapFault",faultCode:e,faultString:c};a.error=e;switch(b){case Xmla.METHOD_DISCOVER:this._fireEvent(Xmla.EVENT_DISCOVER_ERROR,a);break;case Xmla.METHOD_EXECUTE:this._fireEvent(Xmla.EVENT_EXECUTE_ERROR,
a);break}this._fireEvent(Xmla.EVENT_ERROR,a)}else{switch(b){case Xmla.METHOD_DISCOVER:b=new Xmla.Rowset(this.responseXML);this.response=a.rowset=b;this._fireEvent(Xmla.EVENT_DISCOVER_SUCCESS,a);break;case Xmla.METHOD_EXECUTE:b=d.properties[Xmla.PROP_FORMAT];switch(b){case Xmla.PROP_FORMAT_TABULAR:break;case Xmla.PROP_FORMAT_MULTIDIMENSIONAL:break}this.response=a.resultset=e;this._fireEvent(Xmla.EVENT_EXECUTE_SUCCESS,a);break}this._fireEvent(Xmla.EVENT_SUCCESS,a)}},execute:function(a){var b=a.properties;
if(j(b)){b={};a.properties=b}if(j(a.properties[Xmla.PROP_FORMAT]))a.properties[Xmla.PROP_FORMAT]=Xmla.PROP_FORMAT_MULTIDIMENSIONAL;a=f(a,{method:Xmla.METHOD_EXECUTE},true);return this.request(a)},discover:function(a){a=f(a,{method:Xmla.METHOD_DISCOVER},true);return this.request(a)},discoverDataSources:function(a){a=f(a,{requestType:Xmla.DISCOVER_DATASOURCES},true);return this.discover(a)},discoverProperties:function(a){a=f(a,{requestType:Xmla.DISCOVER_PROPERTIES},true);return this.discover(a)},discoverSchemaRowsets:function(a){a=
f(a,{requestType:Xmla.DISCOVER_SCHEMA_ROWSETS},true);return this.discover(a)},discoverEnumerators:function(a){a=f(a,{requestType:Xmla.DISCOVER_ENUMERATORS},true);return this.discover(a)},discoverKeywords:function(a){a=f(a,{requestType:Xmla.DISCOVER_KEYWORDS},true);return this.discover(a)},discoverLiterals:function(a){a=f(a,{requestType:Xmla.DISCOVER_LITERALS},true);return this.discover(a)},discoverDBCatalogs:function(a){a=f(a,{requestType:Xmla.DBSCHEMA_CATALOGS},true);return this.discover(a)},discoverDBColumns:function(a){a=
f(a,{requestType:Xmla.DBSCHEMA_COLUMNS},true);return this.discover(a)},discoverDBProviderTypes:function(a){a=f(a,{requestType:Xmla.DBSCHEMA_PROVIDER_TYPES},true);return this.discover(a)},discoverDBSchemata:function(a){a=f(a,{requestType:Xmla.DBSCHEMA_SCHEMATA},true);return this.discover(a)},discoverDBTables:function(a){a=f(a,{requestType:Xmla.DBSCHEMA_TABLES},true);return this.discover(a)},discoverDBTablesInfo:function(a){a=f(a,{requestType:Xmla.DBSCHEMA_TABLES_INFO},true);return this.discover(a)},
discoverMDActions:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_ACTIONS},true);return this.discover(a)},discoverMDCubes:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_CUBES},true);return this.discover(a)},discoverMDDimensions:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_DIMENSIONS},true);return this.discover(a)},discoverMDFunctions:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_FUNCTIONS},true);return this.discover(a)},discoverMDHierarchies:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_HIERARCHIES},true);
return this.discover(a)},discoverMDLevels:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_LEVELS},true);return this.discover(a)},discoverMDMeasures:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_MEASURES},true);return this.discover(a)},discoverMDMembers:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_MEMBERS},true);return this.discover(a)},discoverMDProperties:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_PROPERTIES},true);return this.discover(a)},discoverMDSets:function(a){a=f(a,{requestType:Xmla.MDSCHEMA_SETS},
true);return this.discover(a)}};function J(a){return n?a.getElementsByTagNameNS(v,"row"):a.getElementsByTagName("row")}function K(a){a=n?a.getElementsByTagNameNS(u,"complexType"):a.getElementsByTagName("xsd:complexType");for(var b=a.length,d,c=0;c<b;c++){d=a.item(c);if(d.getAttribute("name")=="row")return d}return null}Xmla.Rowset=function(a){this.numRows=(this.rows=J(a))?this.rows.length:0;this.rowIndex=0;this.row=this.hasMoreRows()?this.rows.item(this.rowIndex):null;this.fieldOrder=[];this.fields=
{};this._fieldCount=0;var b=K(a);if(b){b=n?b.getElementsByTagNameNS(u,"sequence").item(0):b.getElementsByTagName("xsd:sequence").item(0);b=b.childNodes;for(var d=b.length,c,e,g,i,h=0;h<d;h++){a=b.item(h);if(a.nodeType==1){c=a.getAttributeNS?a.getAttributeNS(A,"field"):a.getAttribute("sql:field");e=a.getAttribute("name");i=a.getAttribute("type");g=a.getAttribute("minOccurs");a=a.getAttribute("maxOccurs");this.fields[c]={name:e,label:c,index:this._fieldCount++,type:i,minOccurs:j(g)?1:g,maxOccurs:j(a)?
1:a=="unbounded"?Infinity:a,getter:this._createFieldGetter(e,i,g,a)};this.fieldOrder.push(c)}}}else throw"Couldn't parse XML schema while constructing resultset";};Xmla.Rowset.FETCH_ARRAY=1;Xmla.Rowset.FETCH_OBJECT=2;Xmla.Rowset.prototype={node:null,_getElementsByTagNameFromRow:n?function(a){return this.row.getElementsByTagNameNS(v,a)}:function(a){return this.row.getElementsByTagName(a)},_boolConverter:function(a){return a=="true"?true:false},_intConverter:function(a){return parseInt(a,10)},_floatConverter:function(a){return parseFloat(a,
10)},_textConverter:function(a){return a},_arrayConverter:function(a){debugger;for(var b=[],d=a.length,c,e=0;e<d;e++){c=a.item(e);b.push(c.tagName)}return b},_elementText:function(a){var b="";a=a.childNodes;for(var d=a.length,c=0;c<d;c++)b+=a.item(c).data;return b},_createFieldGetter:function(a,b,d,c){if(d==null)d="1";if(c==null)c="1";var e=this,g=null;switch(b){case "xsd:boolean":g=e._boolConverter;break;case "xsd:decimal":case "xsd:double":case "xsd:float":g=e._floatConverter;break;case "xsd:int":case "xsd:integer":case "xsd:nonPositiveInteger":case "xsd:negativeInteger":case "xsd:nonNegativeInteger":case "xsd:positiveInteger":case "xsd:short":case "xsd:byte":case "xsd:long":case "xsd:unsignedLong":case "xsd:unsignedInt":case "xsd:unsignedShort":case "xsd:unsignedByte":g=
e._intConverter;break;case "xsd:string":default:g=e._textConverter;break}var i;if(d=="1"&&c=="1")i=function(){var h=e._getElementsByTagNameFromRow(a);return g(e._elementText(h.item(0)))};else if(d=="0"&&c=="1")i=function(){var h=e._getElementsByTagNameFromRow(a);if(!h.length)return null;return g(e._elementText(h.item(0)))};else if(d=="1"&&(c=="unbounded"||parseInt(c,10)>1))i=function(){var h=e._getElementsByTagNameFromRow(a);return e._arrayConverter(h,g)};else if(d=="0"&&(c=="unbounded"||parseInt(c,
10)>1))i=function(){var h=e._getElementsByTagNameFromRow(a);if(!h.length)return null;return e._arrayConverter(h,g)};return i},getFields:function(){for(var a=[],b=this._fieldCount,d=this.fieldOrder,c=0;c<b;c++)a[c]=this.fieldDef(d[c]);return a},hasMoreRows:function(){return this.numRows>this.rowIndex},next:function(){this.row=this.rows.item(++this.rowIndex)},fieldDef:function(a){var b=this.fields[a];if(j(b))throw'No such field: "'+a+'"';return b},fieldIndex:function(a){a=this.fieldDef(a);return a.index},
fieldName:function(a){return this.fieldOrder[a]},fieldVal:function(a){if(F(a))a=this.fieldName(a);a=this.fieldDef(a);return a.getter.call(this)},fieldCount:function(){return this._fieldCount},close:function(){this.row=null},fetchAsArray:function(){var a;if(this.hasMoreRows()){var b=this.fields;a=[];var d,c;for(d in b){c=b[d];a[c.index]=c.getter.call(this)}this.next()}else a=false;return a},fetchAsObject:function(){var a;if(this.hasMoreRows()){var b=this.fields,d,c;a={};for(d in b){c=b[d];a[d]=c.getter.call(this)}this.next()}else a=
false;return a},fetchAllAsArray:function(){for(var a=[],b;b=this.fetchAsArray();)a.push(b);return a},fetchAllAsObject:function(){for(var a=[],b;b=this.fetchAsObject();)a.push(b);return a}}})();
