# react-another-dialog documentation
Build upon (https://github.com/yogaboll/react-npm-component-starter)

Modal dialog component aiming for API simplicity but still covering common more complex use cases.

+ **npm name:** react-another-dialog
+ **version:** 0.1.26
+ **date:** 2018/02/27 14:37:37
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

| Name | Type | Default | Description
| -----|------|---------|------------
| title | string | n/a | Shown title (optional).
| subtitle | string | n/a | Shown subtitle. Included HTML will be rendered (optional).
| query | Array | n/a | Array of properties to render AnotherDialogInput-objects with OR ready-made input components (extending AnotherDialogInput)
| verification | bool/string | false | If true, verificate response before onSuccess. Give a string to define the verification question (default: "Are you sure to proceed?").
| animateIn | function | n/a | Function to animate in the dialog the way you wish.<br>Run as ```animateIn(formElement, maskElement)```
| animateOut | function | n/a | Function to animate out the dialog the way you wish.<br>Run as ```animateOut(formElement, maskElement, after)```<br>**Note**: Run the 'after'-function when done!
| onSuccess
| onCancel
| onFinish
| postValidate
| options | array | [{ type:"submit", value:"OK" },<br>{ type:"cancel", value:"Cancel" }] | Customize the main buttons. Additionals can be included:<br>{type: "button", value: "Example", onClick: function() {...}}

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
type | string | "hidden" | "text"/"password"/"check"/"number"/"radio"/"select"/"group"/"addable"/"hidden"
kind | string | "hidden" | alias of type
init | string/number | n/a | initial value or child amount for "addable"
max | number | n/a | max value for "num", length for "text"/"password" or child amount for "addable"
min | number | n/a | min value for "num", length for "text"/"password" or child amount for "addable"
range | string	| n/a | range string, overrides min/max (e.g. "0-5")
test | function | n/a | test "text"/"password" value with
opt | array | n/a | option values for "radio"/"select" (use null for disabled options / option headers)
optTitles | array | n/a | option titles for "radio"/"select"
children | array | n/a | inputs for "addable"/"group"


