# Errors

The errors have been kept deliberately simple.  There are three error types
exposed.  All extend the main JavaScript Error object

## Exception

This is the main exception object.  Every other exception extends from this.
This is exposed so further errors, if required, can be extended from here.  It
cannot be instiated itself.

### Methods

As Error, plus:

**_construct** &lt;void&gt; ([_string_ message])

Constructor method.  Receives an optional string as the helper message

**getFileName** &lt;string&gt; ()

Returns the file name and path of the file that caused the error

**getLineNumber** &lt;string&gt; ()

Returns the line number of the file that caused the error

**getMessage** &lt;string&gt; ()

Returns the message set at instantiation

**getStack** &lt;string&gt; ()

Returns the stack trace

**getStackTrace** &lt;object[]&gt; ([_number_ int])

Returns array of stack trace objects or a specific array if param int is given

**getType** &lt;string&gt; ()

Returns the type.  This must be set by the developer when extending this object

## Fatal

This is an error that cannot be recovered from.  This is likely to be either
when a datastore cannot respond or similar.  Ultimately, this would return an
HTTP 503 error (or equivalent).

## Validation

This is an error that can be recovered from.  Normally, this would be invalid
input from the client or similar.  Ultimately, this would return something like
an HTTP 400 error.

This holds a series of individual errors - the thought being that this is most
likely to be on a model or similar.

### Methods

As Exception, plus:

**addError** &lt;void&gt; (_string_ key, _mixed_ value, _string_ message[, _mixed_ additional])

Add an error to the Exception

**getErrors** &lt;array&gt; ()

Returns all the errors as an array of object literals

**hasErrors** &lt;boolean&gt; ()

Returns if there are any errors set

## Development Errors

The system also throws errors (usually `TypeError` or `SyntaxError`) to tell the
developer that they have misconfigured something.  These should never be caught
and must be fixed by the developer.