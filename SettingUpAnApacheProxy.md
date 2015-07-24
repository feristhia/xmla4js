#How to configure apache httpd server to act as a proxy for an XML/A server.

# Introduction #
Xmla.js uses the XMLHttpRequest object to post SOAP requests and receive SOAP responses to a XML/A webservice. The XMLHttpRequest it is bound to the [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy). This means you can't use Xmla.js to do cross-domain requests.

Effectively this means that webpages that want to use Xmla.js must reside on the same web server as where the XML/A webservice lives. Alternatively, the server where Xmla.js resides can define a proxy to one or more XML/A servers so that it appears as if they are hosted by the same server.

This page contains instructions for setting up a proxy on the popular Apache http server.

# Setting Xmla4js in Apache http server to connect to a remote XML/A server #
It's possible to work around the ame origin policy and use Xmla4js to access remote XML/A servers. In this case, Xmla4js will be served from a regular HTTP server like Apache, but send SOAP requests to an external XML/A server.

In order to make this kind of setup work, the regular HTTP server (the one where Xmla4js is deployed) has to act as a proxy for the remote XML/A server. That's because the XMLHttpRequest object used by Xmla4js is restricted from doing cross-domain requests. This is not a property of Xmla4js but a general security measure (see also http://developer.yahoo.com/javascript/howto-proxy.html).

## Setting up a regular HTTP proxy ##
It's most straightforward to set up a regular HTTP proxy. This simply passes http requests to apache on to the XML/A server.

In order to use this kind of setup, you'll need to install the proxy and proxy\_http modules. On ubuntu, you can get them with:

```
$ sudo a2enmod proxy
$ sudo a2enmod proxy_http
```

Here's a sample configuration file for Apache httpd:
```
#
# make D:\Projects\xmla4js accessible from the webhost as http://webhost/xmla4js
#
Alias /xmla4js     "D:\Projects\xmla4js"

#
# cofigure access to the resources in the xmla4js home directory
#
<Directory "D:\Projects\xmla4js">
  Options All
  AllowOverride All
  Order allow,deny
  Allow from all
</Directory>

ProxyRequests Off

#
# set up access to the Palo XML/A server
#
<Location /palo>
  ProxyPass http://localhost:4242/xmla/
  ProxyPassReverse http://localhost:4242/xmla/
  SetEnv proxy-chain-auth
</Location>

#
# set up access to the Pentaho XML/A server
#
<Proxy /pentaho>
  Order deny,allow
  Allow from all
  ProxyPass http://localhost:8080/pentaho
  ProxyPassReverse http://localhost:8080/pentaho
  SetEnv proxy-chain-auth
</Proxy>
```

## Setting up a AJP proxy to Tomcat ##
While the regular HTTP proxy works just fine, there is a better option if you're XML/A server is running on Apache tomcat. Apache tomcat supperts the AJP protocol. This is a binary protocol which is more efficient than plain HTTP.

(Tomcat is used by default server by the Pentaho BI Server, and it's also a common server to use for running Mondrian standalone.)

To use AJP, you'll need to install the AJP proxy module:
```
$ sudo a2enmod proxy
$ sudo a2enmod proxy_ajp
```

To setup the ajp proxy, refer to this example configuration:
```
    ProxyPass /pentaho ajp://localhost:8009/pentaho
    ProxyPassReverse /pentaho ajp://localhost:8009/pentaho
```