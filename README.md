jQuery TreeSelect Plugin
=========================

TreeSelect is a plugin for creating complex context sensitive forms, where the content in a child `Select-box` heavily depends on the selected option of the parent.

The plugin was designed with a select box as root element, and the child elements being any `type` of `select`, `input` or `upload`.

Checkout the [Demo](http://htmlpreview.github.io/?https://github.com/janessbach/jquery.treeselect/blob/master/docs/demo.html).

Example: Building forms
=========

Figure 1 as an example, has the option `Profession` selected, which acts as the root of the form tree. It includes two possible nodes (key: 1, key:2) that provide their own context for the following selections.

The nodes with the same `elementName` are grouped into one [select](http://www.w3schools.com/tags/tag_select.asp)-box.

<img src="https://raw.githubusercontent.com/janessbach/jquery.treeselect/master/docs/img/jQuery.treeselect.png" width="600">

**Figure 1:** Form example, with a `Parent` and two `child` nodes.

The corresponding data structure to this form looks as follows:

```
var json = {
    "groupKey": "profession",
    "translations" : {
        "select.default" : "Bitte wählen",
        "profession" : "Profession",
        "city" : "City",
        "company" : "Company",
   		"website": "Website",
   		"upload" : "Upload"
    },
    "dependencyList": [{
        "key": 1,
        "elementName": "profession",
        "values": ["Doctor"],
        "dependencies": [3],
        "required": true,
        "typ": "select"
    }, {
        "key": 2,
        "elementName": "profession",
        "values": ["Engineer", "Designer"],
        "dependencies": [4],
        "required": true,
        "typ": "select"
    }, {
        "key": 3,
        "elementName": "city",
        "values": ["Amsterdam", "Berlin"],
        "dependencies": [5],
        "required": true,
        "typ": "select"
    }, {
        "key": 4,
        "elementName": "company",
        "values": ["Google", "Facebook"],
        "dependencies": [5, 6],
        "required": true,
        "typ": "select"
    }, {
        "key": 5,
        "elementName": "upload",
        "values": [],
        "dependencies": [],
        "required": false,
        "typ": "upload"
    }, {
        "key": 6,
        "elementName": "website",
        "values": [],
        "dependencies": [],
        "required": true,
        "typ": "input"
    }]
};
```

As can be seen, the data structure consists of three main properties. The `groupKey`, which is used to group all available nodes that satisfy the condition `elementName === groupKey`. If you choose a value from this select, all dependencies will be traversed for the chosen node. The `translations`, which defines the label values for each `elementName` and the `dependencyList` that contains the form logic itself. 

The `dependencyList` list consists of `nodes`. Each node defines a unique `key` for this form. This key can be used by other elements to define dependencies. The `elementName` is the name of the created HTML element. The `typ` can be one of `select`, `input` or `upload`. It's clear that your root should only by of type `select`.

Links
=====

[Demo](http://htmlpreview.github.io/?https://github.com/janessbach/jquery.treeselect/blob/master/docs/demo.html)
