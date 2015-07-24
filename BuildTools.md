# Introduction #

xmla4js uses a number of tools for building minified/compiled javascript and API documentation. These are listed here:


# Details #

## YUI Compressor ##
The YUI Compressor (see http://developer.yahoo.com/yui/compressor/, by YAHOO) is an open source (BSD licensed) java program that can be used to minify javascript and css resources. Minification strips out comments and whitespace, and, if possible, rewrites the resource in order to decrease its size. Small resource file save bandwidth, and allow more resource to be cached in the browser cache.

The YUI compressor is used by the minify.bat script in the build directory. The YUI compressor jar file is not included in Xmla4js, and must be downloaded from http://yuilibrary.com/downloads/#yuicompressor

## YUI Doc ##
YUI Doc is an open source python program that generates API documentation in html format from an annotated javascript source file (see: http://developer.yahoo.com/yui/yuidoc/). It is used by the build/api-docs.bat script to generate the xmla4js API documentation.

Python and YUI Doc are not included in xmla4js. You have to download YUI Doc from here:

http://yuilibrary.com/downloads/

## Google closure compiler ##
The Google closure compiler is also an open source (BSD licensed) java program that can be used to minify javascript (see http://code.google.com/closure/compiler/).

The Google closure compressor is used by the compile.bat script in the build directory. The jar file is not included in Xmla4js, and must be downloaded from http://closure-compiler.googlecode.com/files/compiler-latest.zip