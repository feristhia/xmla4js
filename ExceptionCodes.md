# Error and Warning codes #

The ```
Xmla.Exception``` instances thrown by the xmla4js classes can have the error codes and messages listed below. The entries listed here als serve as anchors for the url specified by the ```
helpfile``` property of the ```
Xmla.Exception``` instance. This allows applications to dynamically refer to this page in case a specific error occurs.

# Details #

##### -1 Missing Request Type #####
The XML/A Discover request is malformed because it does not specify a RequestType.
##### -2 Missing Statement #####
The XML/A Execute request is malformed because it does not specify a Statement.
##### -3 Missing URL #####
The XML/A request is malformed because it does not specify a URL
##### -4 No Events Specified #####
Registering a listener failed because no listener was specified
##### -5 Wrong Events Format #####
Registering a listener failed because the listener events was not specified in the expected format
##### -6 Unknown Event #####
Registering a listener failed because an unknown event was specified.
##### -7 Invalid Events Handler #####
Registering a listener failed because no handler was specified, or the specified handler is not a function.
##### -8 Error Parsing Response #####
A response was received from the server, but xmla4js could not parse it.
##### -9 Invalid Field #####
A particular field was requested from a Xmla.Rowset, but the field does not exist.
##### -10 HTTP Error #####
Exception code indicating a general XMLHttpRequest error.