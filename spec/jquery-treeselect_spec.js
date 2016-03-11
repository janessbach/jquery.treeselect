describe("jquery-treeselect", function () {

    var fixture, json;

    beforeEach(function () {
        loadFixtures('fixtures.html');
        fixture = $('#my-fixture');
        json = {
            "groupKey": "profession",
            "translations" : {
                "select.default" : "Bitte wählen",
                "profession" : "Beruf",
                "place" : "Ort",
                "salary" : "Gehalt",
                "company" : "Firma"
            },
            "dependencyList": [{
                "key": 1,
                "elementName": "profession",
                "values": ["Arzt"],
                "dependencies": [3],
                "required": true,
                "typ": "select"
            }, {
                "key": 2,
                "elementName": "profession",
                "values": ["Coder"],
                "dependencies": [5],
                "required": true,
                "typ": "select"
            }, {
                "key": 3,
                "elementName": "place",
                "values": ["Amsterdam", "Berlin"],
                "dependencies": [4],
                "required": true,
                "typ": "select"
            }, {
                "key": 4,
                "elementName": "salary",
                "values": ["1000", "2000"],
                "dependencies": [],
                "required": false,
                "typ": "select"
            }, {
                "key": 5,
                "elementName": "company",
                "values": ["Google", "Facebook"],
                "dependencies": [6],
                "required": true,
                "typ": "select"
            }, {
                "key": 6,
                "elementName": "company",
                "values": [],
                "dependencies": [],
                "required": false,
                "typ": "input"
            }]
        };

    });

    it("should be able to render a select tree (happy)", function () {

        fixture.treeSelect({"data" : json});

        var rootElement = fixture.find('*[name=profession]');
        expect(rootElement.length).toBe(1);

        rootElement.val('Arzt').trigger('change');

        var place = fixture.find('*[name=place]');
        expect(place.length).toBe(1);

        place.val('Berlin').trigger('change');

        var sallary = fixture.find('*[name=salary]');
        expect(sallary.length).toBe(1);

    });

    it("should reset all dependencies and remove their html elements if root is reset to default value", function () {

        fixture.treeSelect({"data" : json});

        var rootElement = fixture.find('*[name=profession]');
        rootElement.val('Arzt').trigger('change');

        var place = fixture.find('*[name=place]');
        place.val('Berlin').trigger('change');

        // reset root to default value
        rootElement.val('Bitte wählen').trigger('change');

        place = fixture.find('*[name=place]');
        expect(place.length).toBe(0);

        var sallary = fixture.find('*[name=salary]');
        expect(sallary.length).toBe(0);

    });



});
