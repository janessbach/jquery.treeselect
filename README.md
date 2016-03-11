jQuery TreeSelect Plugin - v1.0.0 
=========================

This jquery plugin helps you to easily create complex interactive forms based on a dependency graph.

Example: Building forms
=========

As seen in the figure 1 the `Profession` select builds up the root of the form tree. It includes two nodes (key: 1, key:2) that have their own dependencies.

The nodes with the same `elementName` are grouped into one `select` for the view.

<img src="https://raw.githubusercontent.com/janessbach/jquery.treeselect/master/docs/img/jQuery.treeselect.png" width="600">

**Figure 1:** Form example, with Profession consisting of two nodes


In this example we are designing the data structure for the form above. 

Let me first show you the whole form and the corresponding json:

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

As seen in the json, it consists of three objects. The `groupKey` is used to group all available nodes that satisfy the condition `elementName === groupKey`. If you choose a value from this select, all dependencies will be traversed for the chosen node.

The `translations` are used to define the label values for the `elementNames`. The form logic itself is designed in `dependencyList`. This list consists of data structure `node`.

Each node defines a unique `key` for this form. This key can be used by other elements to define dependencies. The `elementName` is the name of the created HTML element.

The `typ` can be one of `select`, `input` or `upload`. Its clear that your root should only by of type `select`.

Links
=====

[Demo](http://htmlpreview.github.io/?https://github.com/janessbach/jquery.treeselect/blob/master/docs/demo.html)
