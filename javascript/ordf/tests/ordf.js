module("ordf");

function keys(d) {
    var keys = [];
    for (var k in d)
        keys.push(k);
    return keys;
}

var graph = undefined;

// test fetch a graph
test("recv", function() {
    expect(1);
    stop();

    var test_triples = function(g) {
        graph = g;
        ok(keys(graph.tripleStore).length > 0, "triples");
        start();
    }

    var ordf = new $.ordf();
    ordf.recv({
        uri: "http://bibliographica.org/test",
        callback: test_triples
    });
});

// PUT the graph back
test("send", function() {
    expect(1);
    stop();

    graph.add('<http://bibliographica.org/test> rdfs:label "Test Graph"',
	      { namespaces: { rdfs : "http://www.w3.org/2000/01/rdf-schema#" } });
    var test_put = function(response) {
        ok(/urn:uuid:.*/.test(response), "changeset");
        start();
    }

    var ordf = new $.ordf();
    ordf.send({ databank: graph, callback: test_put });

}); 

// test fetch a remote graph
test("proxy", function() {
    expect(1);
    stop();

    var test_triples = function(g) {
        ok(keys(g.tripleStore).length > 0, "triples");
        start();
    }

    var ordf = new $.ordf();
    ordf.proxy({
        uri: "http://www.w3.org/People/EM/contact#me",
        callback: test_triples
    });
});

// test a sparql query
test("sparql", function() {
    expect(5);
    stop();

    var test_sparql = function(result) {
        ok(result.head, "head");
        ok(result.head.vars[0] == "s", "vars");
        ok(result.results.bindings, "bindings");
        ok(result.results.bindings.length == 10, "results");
        ok(result.results.bindings[0].s, "row");
        start();
    }

    var ordf = new $.ordf();
    ordf.sparql({
        query: "SELECT DISTINCT ?s WHERE { ?s ?p ?o } LIMIT 10",
        callback: test_sparql
    });
});

// test a sparql construct query
test("construct", function() {
    expect(2);
    stop();

    var test_construct = function(result) {
        ok(result.tripleStore, "databank");
        ok(keys(result.tripleStore), "triples");
        start();
    }

    var ordf = new $.ordf();
    ordf.construct({
        query: "CONSTRUCT { ?s a ?o } WHERE { ?s a ?o } LIMIT 5",
        callback: test_construct
    });
});

// test search
test("search", function() {
    expect(6);
    stop();

    var test_search = function(result) {
        ok(result.length > 1, "results");
        ok(result[1].uri, "uri");
        ok(result[1].metadata, "metadata");
        ok(result[1].metadata.rank, "rank");
        ok(result[1].metadata.percent, "percent");
        ok(result[1].databank.tripleStore, "triples");
        start();
    }

    var ordf = new $.ordf();
    ordf.search({ query: "a", callback: test_search });
});

/*
test("gutenberg", function() {
    expect(1);
    stop();
    var ordf = new $.ordf();
    ordf.recv({
        uri: "http://www.gutenberg.org/ebooks/11.rdf",
        callback: function (graph) {
            ok(graph, "graph");
            start();
        }
    });
});
*/

test("labels", function() {
    expect(1);
    stop();
    var ordf = new $.ordf();
    ordf.get_label({
	uri: "<http://bibliographica.org/test>",
	callback: function (labels) {
	    ok(labels["default"] == "Test Graph");
	    start();
	}
    });
});