const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();

global.document = dom.window.document;
global.window = dom.window;

var $ = require("jquery");
global.jQuery = global.$ = $;

require("jasmine-jquery");
require("../src/jquery-treeselect");

describe("jquery-treeselect", function () {

    var fixture, json;

    beforeEach(function () {
        setFixtures('<div id="my-fixture"></div>');
        fixture = $('#my-fixture');
        json = {
            "groupKey": "profession",
            "translations" : {
                "select.default" : "Please select",
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

    });

    it("should be able to render a select tree (happy)", function () {

        fixture.treeSelect({"data" : json});

        var rootElement = fixture.find('*[name=profession]');
        expect(rootElement.length).toBe(1);

        rootElement.val('Doctor').trigger('change');

        var city = fixture.find('*[name=city]');
        expect(city.length).toBe(1);

        city.val('Berlin').trigger('change');

        var upload = fixture.find('*[name=upload]');
        expect(upload.length).toBe(1);

    });

    it("should reset all dependencies and remove their html elements if root is reset to default value", function () {

        fixture.treeSelect({"data" : json});

        var rootElement = fixture.find('select[name=profession]');
        expect(rootElement.length).toBe(1);

        rootElement.val('Engineer').trigger('change');

        var company = fixture.find('select[name=company]');
        expect(company.length).toBe(1);

        company.val('Google').trigger('change');

        var upload = fixture.find('input[name=upload]');
        expect(upload.length).toBe(1);

        var website = fixture.find('input[name=website]');
        expect(website.length).toBe(1);

        // reset root to default value
        rootElement.val('Please select').trigger('change');

        company = fixture.find('select[name=company]');
        expect(company.length).toBe(0);

        upload = fixture.find('input[name=upload]');
        expect(upload.length).toBe(0);

        website = fixture.find('input[name=website]');
        expect(website.length).toBe(0);
    });

    it("should also be able to use element names with `.` in their name.", function() {

        json = {
            "groupKey": "group.profession",
            "translations" : {
                "select.default" : "Please select",
                "group.profession" : "Profession",
                "group.city" : "City"
            },
            "dependencyList": [{
                "key": 1,
                "elementName": "group.profession",
                "values": ["Doctor"],
                "dependencies": [2],
                "required": true,
                "typ": "select"
            }, {
                "key": 2,
                "elementName": "group.city",
                "values": ["Amsterdam", "Berlin"],
                "dependencies": [5],
                "required": true,
                "typ": "select"
            }]
        };

        fixture.treeSelect({"data" : json});

        var rootElement = fixture.find('select[name=\'group.profession\']');
        expect(rootElement.length).toBe(1);

        rootElement.val('Doctor').trigger('change');

        var groupCity = fixture.find('select[name=\'group.city\']');
        expect(groupCity.length).toBe(1);

    });

    it("should also be able to determine the correct node by value if not distinct.", function() {

        json = {
            "groupKey": "group.profession",
            "translations" : {
                "select.default" : "Please select",
                "group.profession" : "Profession",
                "group.city" : "City"
            },
            "dependencyList": [{
                "key": 1,
                "elementName": "group.profession",
                "values": ["Doctor"],
                "dependencies": [3],
                "required": true,
                "typ": "select"
            }, {
                "key": 2,
                "elementName": "group.profession",
                "values": ["Engineer"],
                "dependencies": [4],
                "required": true,
                "typ": "select"
            }, {
                "key": 3,
                "elementName": "group.city",
                "values": ["Amsterdam", "Berlin"],
                "dependencies": [],
                "required": true,
                "typ": "select"
            }, {
                "key": 4,
                "elementName": "group.city",
                "values": ["Amsterdam", "Berlin"],
                "dependencies": [5],
                "required": true,
                "typ": "select"
            }, {
                "key": 5,
                "elementName": "group.mobile",
                "values": ["Apple", "Samsung"],
                "dependencies": [],
                "required": true,
                "typ": "select"
            }]
        };

        fixture.treeSelect({"data" : json});

        var rootElement = fixture.find('select[name=\'group.profession\']');
        expect(rootElement.length).toBe(1);

        rootElement.val('Engineer').trigger('change');

        var groupCity = fixture.find('select[name=\'group.city\']');
        expect(groupCity.length).toBe(1);

        groupCity.val('Berlin').trigger('change');

        var groupMobile = fixture.find('select[name=\'group.mobile\']');
        expect(groupMobile.length).toBe(1);

    });

    it("should be able to render the select values with given comparator", function () {

        var reverseCompare = function stringComparison(a, b) { return (a === b) ? 0 : (a < b) ? 1 : -1; };

        fixture.treeSelect({"data" : json, "comparator" : reverseCompare });

        var rootElement = fixture.find('*[name=profession]');
        expect(rootElement.length).toBe(1);

        expect(rootElement.find('option').length).toBe(4);

        expect($(rootElement.find('option')[1]).val()).toBe("Engineer");
        expect($(rootElement.find('option')[2]).val()).toBe("Doctor");
        expect($(rootElement.find('option')[3]).val()).toBe("Designer");
    });

});
