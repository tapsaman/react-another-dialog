# react-another-dialog documentation
Build upon (https://github.com/yogaboll/react-npm-component-starter)

Modal dialog component aiming for API simplicity but still covering common more complex use cases.

+ **package name:** react-another-dialog
+ **main:** lib/AnotherDialog.js
+ **version:** 0.1.41
+ **date:** 2018/06/18 15:33:45
+ **license:** MIT
+ **author:** tapsaman

<br><br>
*** WORK IN PROGRESS ***
<br>undefined<br><br>
*************************
<br><br><br>*In file [AnotherDialog.jsx](src/lib/AnotherDialog.jsx)*

## class AnotherDialog

React-component for building your dialog element in.

### Properties

Name | Type | Default | Description
-----|------|---------|------------
title | string | n/a | Shown title (optional).
subtitle | string | n/a | Shown subtitle. Included HTML will be rendered (optional).
query | Array | n/a | Array of properties to render AnotherDialogInput-objects with OR ready-made input components (extending AnotherDialogInput)
verification | bool/string | false | If true, verificate response before _onSuccess_, after _onPostValidation_. Give a string to define the verification question (default: "Are you sure to proceed?").
animateIn | function | n/a | Function to animate in the dialog the way you wish.<br>Run as ```animateIn(formElement, maskElement)```
animateOut | function | n/a | Function to animate out the dialog the way you wish.<br>Run as ```animateOut(formElement, maskElement, after)```<br>**Note**: Run the 'after'-function when done!
onSuccess
onCancel
onFinish
onPostValidate | function | n/a | Run with parameters _dialogOutput_ and _afterPostValidate_ callback.<br>Response object: ```{ pass: _bool_, message: _string_ }```<br>Must either return the response object or run _afterPostValidate_ with it as the first parameter. 
options | array | [{ type:"submit", value:"OK" },<br>{ type:"cancel", value:"Cancel" }] | Customize the main buttons. Additionals can be included:<br>{type: "button", value: "Example", onClick: function() {...}}
closeOnMaskClick | bool | true | If true, cancel dialog on click outside the form (on _.a-dialog-mask_)
noMask | bool | false |
floating | bool | true | If true, float form in the screen center 

Given React-children are rendered after title, before subtitle and query.

## onPostValidate response properties

Common for inputs and form.
Name | Type | Default | Description
-----|------|---------|------------
message | string | - | Output as main message, 
pass | bool | -	| True if validation passes, false if fails. Undefined if no change (e.g. with a "Loading..." message).

Only for forms.
Name | Type | Default | Description
-----|------|---------|------------
verificate | bool | - | If true, verificate response with OK / Cancel (verification message is given as _message_).
afterVerificate | function | - | If defined, run after verification. Otherwise runs _onSuccess_.

undefined<br><br>
*************************
<br><br><br>*In file [AnotherDialogInput.jsx](src/lib/AnotherDialogInput.jsx)*

## class AnotherDialogInput

Base class for AnotherDialog-input React-components.

### Properties

Name | Type | Default | Description
-----|------|---------|------------
title | string | n/a | Question header (optional).
name | string | n/a | Name of output value
type | string | "hidden" | "text"/"password"/"check"/"number"/"radio"/"select"/"date"/"daterange"/"group"/"addable"/"hidden"
kind | string | "hidden" | alias of type
init | string/number | n/a | initial value or child amount for "addable"
max | number | n/a | max value for "num", length for "text"/"password" or child amount for "addable"
min | number | n/a | min value for "num", length for "text"/"password" or child amount for "addable"
minDiff | number | 0 | minimum start/end date difference for "daterange"
titles | array | ["Start date", "End date"] | titles of each date input for "daterange"
range | string	| n/a | range string, overrides min/max (e.g. "0-5")
test | function | n/a | test "text"/"password" value with
opt | array | n/a | option values for "radio"/"select" (use null for disabled options / option headers)
optTitles | array | n/a | option titles for "radio"/"select"
children | array | n/a | inputs for "addable"/"group"


