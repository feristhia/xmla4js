# Introduction #

The xmla4js project is maintained using subversion. This document explains the contents of the svn trunk.


# Details #
The xmla4js trunk contains the following directories:
  * build
  * css
  * doc
  * js
  * samples
  * src

The directories and their contents are described below:

## build ##

Contains all build scripts. These are used to create YUI compressed / Google closure compiled versions of  Xmla.js. Also contains build script to build the API documentation as well as a yuidoc-template directory (slightly modified from the YUI Doc default template)

## doc ##

Contains all documention. The documentation is organized in subdirectories:
  * api - contains YUI Doc API reference documentation (in the html format). The documentation is created with the build/api-docs.bat script
  * logo - contains the xmla4js logo in various formats.
  * xmla1.1specification - contains the official xmla1.1 specification from http://www.xmlforanalysis.com/ as well as versions in open document (.odt) and portable reader (.pdf) format

## css ##

Contains generic css to format sample pages.

## js ##

The js directory contains minified javascript libraries of the Xmla.js library from the src directory. Currently we provide:
  * Xmla-min.js - a minified version of src/Xmla.js using the YUI compressor. This is created using the build/minify.bat script.
  * Xmla-compiled.js - a 'compiled' version of src/Xmla.js using the Google closure compiler. This is created using the build/compile.bat script.

## samples ##

The samples directory contains mainly HTML pages that illustrate the usage of the Xmla.js library. The samples double as aid for testing and debugging the Xmla.js library.

## src ##

The src directory contains javascript source files (including documentation and license)