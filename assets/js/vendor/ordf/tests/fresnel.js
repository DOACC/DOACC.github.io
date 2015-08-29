module("fresnel");

var fresnel;

test("addFresnel", function () {
    expect(1);
    stop();

    fresnel = new $.rdf.fresnel();
    fresnel.addFresnel({
        uri: "http://bibliographica.org/lens/owl",
        callback: function(graph) {
            ok(graph.tripleStore, "lens");
            start();
        }
    });
});

test("addData", function () {
    expect(1);
    stop();

    var ordf = new $.ordf();
    ordf.recv({
        uri: "http://bibliographica.org/test",
        callback: function (graph) {
            fresnel.addData(graph);
            var count = 0;
            fresnel.data_rdf()
                .where("?a ?b ?c")
                .each(function () { count += 1; });
            ok(count, "data");
            start();
        }
    });
});

test("findLens", function () {
    expect(19);

    fresnel.data_rdf()
        .where("?s a <http://www.w3.org/2002/07/owl#Thing>")
        .each(function () {
            ok(fresnel.findLens(this.s), this.s.toString());
        });
});
