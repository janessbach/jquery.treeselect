describe("jquery-treeselect", function () {

    var fixture, json;

    beforeEach(function () {
        loadFixtures('fixtures.html');
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

        company = fixture.find('select[name=dompany]');
        expect(company.length).toBe(0);

        upload = fixture.find('input[name=upload]');
        expect(upload.length).toBe(0);

        website = fixture.find('input[name=website]');
        expect(website.length).toBe(0);
    });

});
