/* Demo application for Addressbook 
 */
// Some From http://brondsema.net/blog/index.php/2006/11/25/javascript_rdfparser_from_tabulator


// For quick access to those namespaces:
var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/")
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#")
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#")
var DC = $rdf.Namespace("http://purl.org/dc/elements/1.1/")
var RSS = $rdf.Namespace("http://purl.org/rss/1.0/")
var XSD = $rdf.Namespace("http://www.w3.org/TR/2004/REC-xmlschema-2-20041028/#dt-")
var SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#")
var DOACC = $rdf.Namespace("http://purl.org/net/bel-epa/doacc#")
// var CCY = $rdf.Namespace("http://www.w3.org/2000/10/swap/pim/contact#")

var card = function(coin) {
    var snip = '<div></div>'
    
    // if (!image) image = kb.any(who, FOAF('depiction'));
    // if (image) {
    //     snip += '<img src="' + image.uri +'" align="right" height="100"/>';
    // }
    var nam = g.any(coin, SKOS('prefLabel'));
    /*
    if (!nam) {
        nam = "???";
    }
    snip += "<h3>" + nam + "</h3>";

    sym = g.any(coin, DOACC('symbol'));
    if (sym) {
        snip += "<p>" + sym + "</p>";
    }
    */
    cv = coin.value
    coinid = cv.slice(cv.indexOf('#') + 1, cv.length)
    var rels = g.each(coin, null, null);
    var n = rels.length - 1;
    /*
    snip += "<p>"+n+" relations</p>";
    snip += "<p>";
    snip += "<ul>";
    for (i=1; i<n; i++) {
        rel = allmine[i];
        obj = g.any(coin, rel)
        if (rel.value.indexOf('#') > 0) {
            snip += "<li>" + rel.value.slice(rel.value.indexOf('#') + 1, rel.value.length) + " : " + obj.value + "</li>";
        } else {
            snip += "<li>" + rel.value.slice(rel.value.lastIndexOf('/') + 1, rel.value.length) + " : " + obj.value + "</li>";
        }
    }
    */
    var graph = new Springy.Graph();
    // graph.addNodes('Dennis', 'Michael')
    // graph.addEdges(
    //     ['Dennis', 'Michael', {color: '#00A0B0', label: 'Foo bar'}],
    // );
    nodes = [coinid];
    edges = []
    typerel = rels[0];
    for (i=1; i<n; i++) {
        rel = rels[i];
        v = rel.value;
        if (!v.endsWith('#coin') && !v.endsWith('#release') && !v.endsWith('#repository')) {
            obj = g.any(coin, rel);
            if (v.endsWith('#protocol') || v.endsWith('#protection-scheme') || v.endsWith('#distribution-scheme')) {
                gval = g.any(obj, SKOS('prefLabel')).value;
                nodes.push(gval);
            } else {
                gval = obj.value;
                if (gval.indexOf('#') > 0) { 
                    gval = gval.slice(gval.indexOf('#') + 1, gval.length)
                }
                nodes.push(gval);
            }
            if (v.indexOf('#') > 0) {
                grel = v.slice(rel.value.indexOf('#') + 1, v.length);
            } else {
                grel = v.slice(v.lastIndexOf('/') + 1, v.length);
            }
            newedge = [coinid, gval, {color: '#00A0B0', label: grel}];
            edges.push(newedge);
        }
    }
    graph.loadJSON({"nodes": nodes, "edges": edges});
    $('#springydemo').springy({graph: graph});

    $("#results").append(snip)
};

// TestStore implementation from dig.csail.mit.edu/2005/ajar/ajaw/test/rdf/rdfparser.test.html
// RDFIndexedFormula from dig.csail.mit.edu/2005/ajar/ajaw/rdf/identity.js
//  (extends RDFFormula from dig.csail.mit.edu/2005/ajar/ajaw/rdf/term.js which has no indexing and smushing)
// for the real implementation used by Tabulator which uses indexing and smushing

// var kb = new TestStore()

var g = $rdf.graph();
var coin = $rdf.sym('http://purl.org/net/bel-epa/doacc#Dd5bd8eaf-b432-440b-9502-3707aa57ff93');
var docURI = "http://ashpool.bel-epa.com/cryptocurrency.n3";
var fetch = $rdf.fetcher(g);
fetch.nowOrWhenFetched(docURI,undefined,function(ok, body, xhr){ // @@ check ok
    card(coin)
});

// document.write("<p><small>"+uri+ " Size: "+kb.statements.length+"</small></p>")

/*
var symbol = kb.each(coin, DOACC('symbol'));
var i, n = friends.length, friend;
document.write("<p>"+n+" acquaintainces</p>")
for (i=0; i<n; i++) {
    friend = friends[i];
    furi = friend.uri
    if (furi && (furi.indexOf('#') >= 0)) {
//	document.write('<small>Loading:  '+furi+'</small>') 
        furi = furi.slice(0, furi.indexOf('#'))
        kb.load(furi)
    }

    sa = kb.any(friend, RDFS('seeAlso'))
    if (sa) {
//	document.write('<small>See also: '+sa.uri+'</small>') 
        kb.load(sa.uri)
    }

    card(friend)
} 
*/

/*
var snip = '<div>';
snip += '<h2>WHO: ' + uri + '</h2>';

// var symbol = kb.any(who, DOACC('symbol'));
// if (!image) image = kb.any(who, FOAF('depiction'));
// if (image) {
//     snip += '<img src="' + image.uri +'" align="right" height="100"/>';
// }
var nam = g.any(uri, SKOS('prefLabel'));
if (!nam) {
    nam = "???";
}
snip += "<h3>" + nam + "</h3>";

sym = g.any(uri, DOACC('symbol'));
if (sym) {
    snip += "<p>" + sym + "</p>";
}

snip += '<p><pre>' + g.serialize('text/turtle') + '</pre></p>';
snip += "</div>";
$("#results").append(snip);
*/