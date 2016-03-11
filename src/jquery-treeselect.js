/*
 * jQuery Dynamic Tree Selection - Version 1.0.0
 *
 * Source: https://bitbucket.org/jessbach/jquery.tree.selection
 *
 * © 2016 by Elisa Baum <baum@imoveit.de>, Jan Essbach <essbach@imoveit.de>
 */
(function($, window, document, undefined){

    var pluginName = "treeSelect",
        defaults = {
            selectType          : 'select',
            inputType           : 'input',
            uploadType          : 'upload',
            labelClass          : 'label',
            inputClass          : 'input',
            selectClass         : 'webform__select',
            uploadClass         : 'upload',
            formElementClass    : 'formelement',
            data                : undefined
        };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new DynamicSelectTree(this, options));
            }
        });
    };

    function DynamicSelectTree(element, options) {
        var self = this;
        this.element = $(element);
        this.options = $.extend({}, defaults, options);

        this.options.data = this.options.data || this.element.data('src');
        if (this.options.data === undefined) {
            console.log('please provide a valid dataset for' + element + " needed by plugin" + pluginName);
            return this.element;
        }

        this.activeNodes = [];
        this.translations = this.options.data.translations || [];
        this.groupKey = this.options.data.groupKey || '';
        this.dependencyList = this.options.data.dependencyList || [];

        this.dependencyMap = [];
        this.dependencyList.forEach(function(node) { self.dependencyMap[node.key] = node; });
        this.init();
    }

    DynamicSelectTree.prototype.init = function() {
        var rootValues = this.byElementName(this.groupKey).map(function(node) { return node.values; }).flatten();
        return this.element.append(this.drawNode(this.options.selectType, this.groupKey, rootValues, true));
    };

    DynamicSelectTree.prototype.drawNode = function(type, elementName, values, required) {
        if (type === this.options.selectType) {
            return this.createSelect(elementName, values, required);
        } else if (type === this.options.inputType) {
            return this.createInput(elementName, required);
        } else if (type === this.options.uploadType) {
            return this.createUpload(elementName, required);
        }
    };

    DynamicSelectTree.prototype.drawDependentNodes = function(node) {
        var self = this;
        return this.groupedDependencyValues(node).map(function(gdv) {
            return self.drawNode(gdv.type, gdv.elementName, gdv.values, gdv.required);
        });
    };

    DynamicSelectTree.prototype.onChange = function(selectedValue, newNode, nodeToReplace) {
        if (!nodeToReplace || nodeToReplace !== newNode) {
            var self = this;
            if (nodeToReplace) {
                var oldNodeDependencies = this.traverse(nodeToReplace);
                this.activeNodes = this.activeNodes.filter(function(node) {
                    return oldNodeDependencies.map(function(node) { return node.key; }).indexOf(node.key) < 0;
                });
                oldNodeDependencies.forEach(function(node) {
                    if (node !== nodeToReplace) {
                        self.element.find('*[name=' + node.elementName +']').parent().remove();
                    }
                });
            }
            if (newNode) {
                this.activeNodes.push(newNode);
                self.element.find('*[name=' + newNode.elementName +']').parent().after(self.drawDependentNodes(newNode));
            }
        }
    };

    DynamicSelectTree.prototype.createSelect = function(elementName, values, required) {
        var self = this;
        var select = $('<select/>')
            .append($('<option value="-1" selected>' + (this.translations['select.default'] || '') + '</option>'))
            .append(this.createOptions(values))
            .addClass(this.options.selectClass)
            .attr('name', elementName)
            .change(function() {
                var selectedValue = $(this).val();
                self.onChange(
                    selectedValue,
                    self.byValue(selectedValue, elementName),
                    self.filterNodes(self.activeNodes, elementName)
                );
            });
        return $('<div/>').addClass(this.options.formElementClass).append(this.createLabel(elementName, required)).append(select);
    };

    DynamicSelectTree.prototype.createInput = function(elementName, required) {
        var input = $('<input/>').attr('name', elementName).addClass(this.options.inputClass);
        return $('<div/>').addClass(this.options.formElementClass).append(this.createLabel(elementName, required)).append(input);
    };

    DynamicSelectTree.prototype.createUpload = function(elementName, required) {
        var input = $('<input/>').attr('name', elementName).attr('type', 'file').addClass(this.options.uploadClass);
        return $('<div/>').addClass(this.options.formElementClass).append(this.createLabel(elementName, required)).append(input);
    };

    DynamicSelectTree.prototype.createLabel = function(elementName, required) {
        var text = this.translations[elementName];
        if (required) { text = text + ' *'; }
        return $('<label/>').addClass(this.options.labelClass).text(text);
    };

    DynamicSelectTree.prototype.createOptions = function(values) {
        return values.sort().map(function(value) { return $('<option/>').text(value).val(value); });
    };

    DynamicSelectTree.prototype.filterNodes = function(nodes, elementName) {
        return nodes.filter(function(node) { return node.elementName === elementName; })[0];
    };

    DynamicSelectTree.prototype.groupedDependencyValues = function(node) {
        var self = this;
        var nodeDependencies = node.dependencies.map(function(nodeKey) { return self.dependencyMap[nodeKey]; });
        var names = nodeDependencies.map(function(node) { return node.elementName; });
        return names.unique().map(function(elementName) {
            var nodes    = nodeDependencies.filter(function(node) { return node.elementName === elementName; });
            var values   = nodes.map(function(node) { return node.values; }).flatten();
            var type     = nodes.map(function(node) { return node.typ; });
            var required = nodes.map(function(node) { return node.required; }).reduce(function(a, b) { return a || b; });
            return {'elementName': elementName, 'values': values, 'type': type[0], 'required' : required};
        });
    };

    DynamicSelectTree.prototype.byElementName = function(elementName) {
        return this.dependencyList.filter(function(node) { return node.elementName === elementName; });
    };

    DynamicSelectTree.prototype.byValue = function(value, elementName) {
        return this.dependencyList.filter(function(node) {
            return node.elementName === elementName && $.inArray(value, node.values) > -1;
        })[0];
    };

    DynamicSelectTree.prototype.traverse = function(node) {
        var self = this;
        function traverseTree(queue, accumulator) {
            var notInAccumulator = function(key) { return accumulator.filter(function(node) { return node.key === key; }).length === 0; };
            var notInQueue = function(key) { return queue.indexOf(key) < 0; };
            if (queue.length > 0) {
                var currentKey = queue.shift();
                var currentNode = self.dependencyMap[currentKey];
                var newQueueItems = currentNode.dependencies.filter(function(key) { return notInAccumulator(key, accumulator) && notInQueue(key, queue); });
                return traverseTree(newQueueItems.concat(queue), accumulator.concat([currentNode]));
            } else {
                return accumulator;
            }
        }
        return traverseTree([node.key], []);
    };

    Array.prototype.flatten = function() {
        return [].concat.apply([], this);
    };

    Array.prototype.unique = function() {
        var a = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (a.indexOf(this[i]) === -1) {
                a.push(this[i]);
            }
        }
        return a;
    };

})(jQuery, window, document);