# Introduction #
Pentaho offers an open source business intelligence server. The Pentaho BI server offers XML/A capabilities via a servlet on top of the built-in Mondrian ROLAP server. This page contains instructions on how to setup xmla4js for your Pentaho BI server.

## Running Xmla4js as a Pentaho BI Server plugin ##
Xml4js now sports a <a href='http://wiki.pentaho.com/display/ServerDoc2x/Developing+Plugins'>Pentaho BI Server plugin</a> (as of <a href='http://code.google.com/p/xmla4js/source/detail?r=102'><a href='https://code.google.com/p/xmla4js/source/detail?r=102'>revision 102</a></a>). The plugin creates a Xmla4js menu item in the tools menu of the Pentaho user console, which simply opens the Xmla4js index page inside the user console. This makes it very easy to try out the Xmla4js samples. Note that the plugin is intended primarily for developers: Xml4js proper has little to offer to end users.

If you want to work with the development version, simply checkout the xmla4js repository into the `system` solution in your pentaho-solutions folder (which is right beneath the home of the bi-server). The current download version is of [r130](https://code.google.com/p/xmla4js/source/detail?r=130) also includes the plugin. Simply download the all-in-one .zip file, and extract it into the pentaho-solutions/system folder of your Pentaho BI Server.

You will need to restart the Pentaho BI Server in order for the plugin to be loaded.
## Running Xmla4js as web application next to Pentaho BI Server ##
The steps described on this page assume you have downloaded and unpacked the Pentaho BI server on your local system. The remainder of this page will assume that the Pentaho BI Server is started and has a default configuration. You can check this by navigating to http://localhost:8080/ with your webbrowser. This should redirect you to http://localhost:8080/pentaho, and show you the welcome page with a login button.

First, you need to open a shell and change the current working directory to the tomcat/webapps directory located in the home directory of the Pentaho BI server. Suppose you unpacked the compressed archive of the Pentaho BI server to `/opt/pentaho`, then you should cd to `/opt/pentaho/biserver-ce/tomcat/webapps`.

Now, it's simply a matter of copying the Xmla4js home directory (and its contents) into the webapps directory
## Edit datasources.xml ##
When using this type of setup with the Pentaho BI Server, there is one more additional step to take. As per the XML/A spec, an initial request to discover XML/A datasources may return a URL which should be used for subsequent and more specific XML/A requests. In the case of Pentaho, the XML/A datasource is configured in `biserver-ce/pentaho-solutions/system/olap/datasources.xml`.

This is what datasources.xml typically looks like:
```
<?xml version="1.0" encoding="UTF-8"?>
<DataSources>
  <DataSource>
    <DataSourceName>Provider=Mondrian;DataSource=Pentaho</DataSourceName>
    <DataSourceDescription>Pentaho BI Platform Datasources</DataSourceDescription>
    <URL>http://localhost:8080/pentaho/Xmla?userid=joe&amp;password=password</URL>
    <DataSourceInfo>Provider=mondrian</DataSourceInfo>
    <ProviderName>PentahoXMLA</ProviderName>
    <ProviderType>MDP</ProviderType>
    <AuthenticationMode>Unauthenticated</AuthenticationMode>
    <Catalogs>
      <Catalog name="SteelWheels">
        <DataSourceInfo>Provider=mondrian;DataSource=SampleData</DataSourceInfo>
        <Definition>solution:steel-wheels/analysis/steelwheels.mondrian.xml</Definition>
      </Catalog>
      <Catalog name="SampleData">
        <DataSourceInfo>Provider=mondrian;DataSource=SampleData</DataSourceInfo>
        <Definition>solution:steel-wheels/analysis/SampleData.mondrian.xml</Definition>
      </Catalog>
    </Catalogs>
  </DataSource>
</DataSources>
```

As you can see, the `<URL>` element points to the wrong location. This can be easily fixed simply by removing the text between the `<URL>` tags, effectively replacing:
```
    <URL>http://localhost:8080/pentaho/Xmla?userid=joe&amp;password=password</URL>
```
with
```
    <URL></URL>
```