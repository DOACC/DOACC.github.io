/*
 * jQuery plugin for communicating with a web server supporting the
 * ordf API as implemented in http://bitbucket.org/ww/ordf/
 *
 * Copyright (c) 2010, Open Knowledge Foundation
 *
 */

/**
 * ORDF API Implementation. Optional parameters should be left to the defaults 
 * absent good reason
 * @constructor
 * @param options.graph_base
 * @param options.sparql_base
 * @param options.proxy_base
 */
jQuery.ordf = function (options) {
    this.settings = {
        graph_base: "/graph",
        proxy_base: "/proxy",
        search_base: "/search",
        sparql_base: "/sparql",
	uuidalloc_base: "/api/uuidalloc",
    };
    $.extend(this.settings, options);
}

/*
 * Callback method, internal, used on receipt of RDF
 * data, parses it and adds it into the provided 
 * databank
 */
function __ordf_recv_n3(data, bank, callback) {
    var triples = data.split(/\.\n/); // very naive
    for (var i=0; i<triples.length; i++) {
        var n3 = triples[i].replace(/^\s+|\s+$/g,""); // strip whitespace off ends
        if (n3) {
            var triple = $.rdf.triple(n3);
            // specially for dbpedia that sees to give escaped unicode
            if (jQuery.rdf.isLiteral(triple.object)) {
                var unicode = triple.object.value.toString().replace(
                    /\\u([0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f])/g, 
                    "%u$1"
                );
                triple.object.value = unescape(unicode);
            }
            bank.add(triples[i]);
        }
    }
    if (callback) { callback(bank); }
}

jQuery.ordf.prototype.recv = ordf_recv;
/**
 * Retrieves an RDF graph from the store
 *
 * @param options.uri - required, the uri to fetch
 * @param options.databank - optional databank to store the data
 * @param options.callback - optional callback once data has been stored, receives the databank
 * @returns existing jQuery.ordf object
 *
 */
function ordf_recv(options) {
    if (! options.uri )
        throw "$.ordf.recv: no uri to get";
    var self;
    var uri = jQuery.rdf.isUri(options.uri) ? options.uri.value : jQuery.uri(options.uri);
    var bank = options.databank || jQuery.rdf.databank([], { base: uri });
    var get_params = jQuery.param({
	    uri: uri.toString(),
	    format: "text/plain"
    });
    var settings = {
        url: (options.graph_base || this.settings.graph_base) + "?" + get_params,
        async: options.async == undefined ? true : options.async,
        success: function (data) { __ordf_recv_n3.call(self, data, bank, options.callback); }
    }
    jQuery.ajax(settings);
    return this;
}

jQuery.ordf.prototype.send = ordf_send;
/**
 * Post a graph to the store. This only supports a single graph due to back-end limitations.
 * @param options.databank - required. Data will be posted to options.databank.baseURI
 * @param options.callback - optional callback
 * @returns existing jQuery.ordf object
 */
function ordf_send(options) {
    if (options.databank == undefined)
        throw "jQuery.ordf.send: no databank to post";
    var bank = options.databank;
    var rdf = bank.dump({ format: "application/rdf+xml", serialize: true });
    var get_params = jQuery.param({
        uri: bank.baseURI.toString(),
        reason: options.reason || "Change via Web"
    });
    var settings = {
        url: this.settings.graph_base + "?" + get_params,
        type: "PUT",
        data: rdf,
        contentType: "application/rdf+xml",
        success: options.callback || function() {},
        async: options.async == undefined ? true : options.async,
        processData: false
    }
    jQuery.ajax(settings);
    return this;
}

jQuery.ordf.prototype.sparql = ordf_sparql;
/** 
 * Make a SPARQL query against the store, return the JSON encoded result (parsed)
 * @param options.query - the query to make
 * @param options.callback - callback to pass the result to
 * @returns existing jQuery.ordf object
 */
function ordf_sparql(options) {
    if (options.query == undefined)
        throw "jQuery.ordf.recv: no query to get";
    var get_params = jQuery.param({
        query: options.query,
        format: "application/sparql-results+json"
    });
    var settings = {
        url: this.settings.sparql_base + "?" + get_params,
        dataType: "json",
        success: options.callback || function() {},
        async: options.async == undefined ? true : options.async
    }
    jQuery.ajax(settings);
    return this;
}

jQuery.ordf.prototype.construct = ordf_construct;
/**
 * Make a SPARQL construct query. This requires a different implementation than
 * jQuery.ordf.sparql because it returns a graph. Behaviour is therefore more 
 * like jQuery.ordf.recv.
 * @param options.query - query to make, must be CONSTRUCT or DESCRIBE
 * @param options.databank - optional databank to place the results in
 * @param options.callback - optional callback to pass the graph to
 * @returns existing jQuery.ordf object
 */
function ordf_construct(options) {
    if (options.query == undefined)
        throw "jQuery.ordf.construct: no query to get";
    var self = this;
    var bank = options.databank || jQuery.rdf.databank([], { base: jQuery.uri(options.uri) });
    var get_params = jQuery.param({
        query: options.query,
        format: "text/plain",
    });
    var settings = {
        url: this.settings.sparql_base + "?" + get_params,
        async: options.async == undefined ? true : options.async,
        success: function (data) { __ordf_recv_n3.call(self, data, bank, options.callback); }
    }
    jQuery.ajax(settings);
    return this;
}

jQuery.ordf.prototype.proxy = ordf_proxy;
/**
 * Request a foreign resource through the back-end. Necessary because of limits on
 * network requests for javascript executing in a browser.
 * @param as with jQuery.ordf.recv
 * @returns existing jQuery.ordf object
 */
function ordf_proxy(options) {
    jQuery.extend(options, { graph_base: this.settings.proxy_base });
    return this.recv(options);
}

jQuery.ordf.prototype.search = ordf_search;
/**
 * Interface to the full-text search
 */
function ordf_search(options) {
    if (options.query == undefined)
        throw "jQuery.ordf.search: no query";
    var get_params = jQuery.param({
        q: options.query,
        format: "application/javascript",
        offset: options.offset || 0,
        limit: options.limit || 20,
    });
    var settings = {
        url: this.settings.search_base + "?" + get_params,
        async: options.async == undefined ? true : options.async,
        dataType: "json",
        success: function (data) {
            for (var i=0; i<data.length; i++) {
                var bank = jQuery.rdf.databank();
                __ordf_recv_n3(data[i].document, bank);
                data[i].document = undefined;
                data[i].databank = bank;
            }
            if (options.callback) {
                (options.callback)(data);
            }
        }
    }
    jQuery.ajax(settings);
    return this;
}

/* global cache of resource labels */
jQuery.ordf.labels = {};
jQuery.ordf.prototype.get_label = ordf_get_label;
function ordf_get_label(options) {
    if (!options.uri)
	throw "jQuery.ordf.get_label: missing URI option";
    /* check cache first */
    if (jQuery.ordf.labels[options.uri]) {
	if (options.callback) {
	    options.callback(jQuery.ordf.labels[options.uri]);
	}
	return this;
    }
    var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
	"SELECT DISTINCT ?label WHERE { " + 
	options.uri + " rdfs:label ?label }";
    var cache_label = function(sparql_results) {
	var labels = {};
	var bindings = sparql_results.results.bindings;
	for (var i=0; i<bindings.length; i++) {
	    var l = bindings[i].label;
	    var lang = "default";
	    if (l.lang)
		lang = l.lang;
	    if (labels[lang])
		labels[lang] += " " + l.value;
	    else
		labels[lang] = l.value;
	}
	jQuery.ordf.labels[options.uri] = labels;
	if (options.callback)
	    options.callback(labels);
    }
    this.sparql({ query: query, callback: cache_label });
    return this;
}

jQuery.ordf.types = undefined;
jQuery.ordf.prototype.supported_types = ordf_supported_types;
function ordf_supported_types(options) {
    if (!options)
	options = {};
    if (jQuery.ordf.types) {
	if (options.callback) {
	    options.callback(jQuery.ordf.types);
	}
	return this;
    }
    // perhaps we should really look at loaded ontologies?
    // e.g. ?type a owl:Class or something
    var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
	"SELECT DISTINCT ?type, ?label WHERE { " +
	"?thing a ?type . " +
	"OPTIONAL { ?type rdfs:label ?label } " +
	"} " +
	"ORDER BY ?type";
    var cache_types = function(sparql_results) {
	jQuery.ordf.types = [];
	var bindings = sparql_results.results.bindings;
	for (var i=0; i<bindings.length; i++) {
	    var type = "<" + bindings[i].type.value + ">";
	    var label = bindings[i].label;
	    jQuery.ordf.types.push(jQuery.rdf.resource(type));
	    var label_dict = {};
	    if (label.type == "literal") {
		var lang = "default";
		if (label.lang)
		    lang = label.lang;
		label_dict = { lang: label.value };
	    }
	    
	    if (!jQuery.ordf.labels[type]) {
		jQuery.ordf.labels[type] = label_dict;
	    } else {
		jQuery.extend(jQuery.ordf.labels[type], label_dict);
	    }
	}
	if (options.callback) {
	    options.callback(jQuery.ordf.types);
	}
    }
    this.sparql({ query: query, callback: cache_types });
    return this;
}

jQuery.ordf.prototype.uuid_alloc = ordf_uuid_alloc;
function ordf_uuid_alloc(options) {
    var settings = {
        url: this.settings.uuidalloc_base,
        dataType: "json",
        success: options.callback || function() {},
        async: options.async == undefined ? true : options.async
    }
    jQuery.ajax(settings);
    return this;
}

jQuery.ordf.prototype.new_resource = ordf_new_resource;
function ordf_new_resource(options) {
    var add_resource = function(uuid) {
	var base_uri = options.base_uri ? options.base_uri : "urn:uuid:";
	var uri = jQuery.uri(base_uri + uuid);
	var bank = jQuery.rdf.databank([], {
		"base": uri,
		"namespaces": {
		    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		    "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
		}
	    }
	);
	bank.add("<" + uri.toString() + "> rdf:type rdfs:Resource");
	bank.add("<" + uri.toString() + '> rdfs:label "New Unlabelled Resource"');
	bank.add("<" + uri.toString() + '> rdfs:comment "A short description of this resource"');
	if (options.callback)
	    options.callback(bank);
    }
    this.uuid_alloc({ callback: add_resource });
    return this;
}

/*
 * rdfquery's parser is rather strict, requiring any datatypes to be
 * known by jQuery.typedValue
 */
jQuery.typedValue.types["http://www.w3.org/2001/XMLSchema#year"] = {
    strip: true,
    regex: /^[-]?[0-9]+/,
    value: function(c) { return parseInt(c, 10); }
};
jQuery.typedValue.types["http://www.w3.org/2001/XMLSchema#gYear"] = {
    strip: true,
    regex: /^[-]?[0-9]+.*/,
    value: function(c) { return parseInt(c.substr(0,5), 10); }
};
jQuery.typedValue.types["http://purl.org/dc/terms/IMT"] = {
    strip: true,
    regex: /^.*/,
    value: function(c) { return c; }
};
jQuery.typedValue.types["http://purl.org/dc/terms/RFC4646"] = {
    strip: true,
    regex: /^.*/,
    value: function(c) { return c; }
};
jQuery.typedValue.types["http://purl.org/dc/terms/ISO639-2"] = {
    strip: true,
    regex: /^.*/,
    value: function(c) { return c; }
};
jQuery.typedValue.types["http://purl.org/dc/terms/LCSH"] = {
    strip: true,
    regex: /^.*/,
    value: function(c) { return c; }
};
jQuery.typedValue.types["http://purl.org/dc/terms/LCC"] = {
    strip: true,
    regex: /^.*/,
    value: function(c) { return c; }
};
jQuery.typedValue.types["http://purl.org/dc/terms/W3CDTF"] = {
    strip: true,
    regex: /^.*/,
    value: function(c) { return c; }
};
