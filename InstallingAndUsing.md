# Introduction #

Xmla.js is simply a javascript library. All it takes to start using it, is to create a web page, and use a 

&lt;script&gt;

 tag to include the Xmla.js library.

Currently, this page provides tips to start using Xmla4js with the Open Source <a href='http://sourceforge.net/projects/pentaho/files/Business%20Intelligence%20Server/'>Pentaho BI Server</a>. For other XML/A providers, the steps to get started with xmla4js are almost certainly similar, although details such as specific paths and urls are likely to differ. You are encouraged to contribute feedback and information on how to set up Xmla4js on other XML/A servers.

# Setting up Xmla4js #
There are several options to set up Xmla4js. You can either use a stable version, or a development version. You can install Xmla4js on the same server as where your XML/A server resides, or you can install it on some webserver that you configure as a proxy for one or more remote XML/A servers.
## Xmla4.js distributions: .zip or subversion checkout ##
To work with Xmla4js, you can either:<ul>
<li>Download a .zip archive from the <a href='http://code.google.com/p/xmla4js/downloads/list'>downloads section</a>. Unzipping the archive yields the Xmla4js home directory. Use this option if you want to use a stable version of Xmla4js.</li>
<li>Checkout the subversion repository from the google code project page according to the <a href='http://code.google.com/p/xmla4js/source/checkout'>instructions</a> of the source section of the project. In this case the checked out directory is the Xmla4js home directory. Use this option to get and stay up to date with the latest (development) version of Xmla4js.</li>
</ul>
## Next steps ##
After placing xmla4js on your system,you should be able to navigate your browser to the local Xmla4js homepage. If you set Xmla4js up inside your pentaho BI server (see [xmla4jsForPentaho](xmla4jsForPentaho.md)), you should be able to find it here:

> http://localhost:8080/xmla4js-read-only/index.html (if you used a subversion checkout)
> http://localhost:8080/xmla4js/index.html (if you downloaded the zip and unpacked to xmla4js)

If you set up Xmla4js inside your regular HTTP server via a proxy (see [SettingUpAnApacheProxy](SettingUpAnApacheProxy.md)), you should be able to find it here:

> http://localhost/xmla4js-read-only/index.html (if you used a subversion checkout)
> http://localhost/xmla4js/index.html (if you downloaded the zip and unpacked to xmla4js)


From there, you can follow the links to the API documentation and various sample pages.