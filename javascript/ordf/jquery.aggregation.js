jQuery.obp = function(options) {
    if (options == undefined)
	options = {};
    this.fresnel = options.fresnel || new jQuery.rdf.fresnel();
    this.ordf = options.ordf || new jQuery.ordf();
    this.lens = undefined;
    this.graphs = {};
    this.settings = {
	lens: options.lens
    };
}

jQuery.obp.prototype.rdf = obp_rdf;
function obp_rdf(bank) {
    return jQuery.rdf({ databank: bank })
	.prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
	.prefix("ordf", "http://purl.org/NET/ordf/")
	.prefix("ore", "http://www.openarchives.org/ore/terms/");
}

jQuery.obp.prototype.graph = obp_graph;
function obp_graph(bank) {
    var graph = "<" + bank.baseURI.toString() + ">";
    return jQuery.rdf.resource(graph);
}

jQuery.obp.prototype.isAggregate = obp_isAggregate;
function obp_isAggregate(bank) {
    var graph = this.graph(bank);
    var is_aggregate = false;

    this.rdf(bank)
	.where(graph + " rdf:type ore:Aggregation")
	.each(function () { is_aggregate = true; });

    return is_aggregate;
}

jQuery.obp.prototype.aggregates = obp_aggregates;
function obp_aggregates(bank) {
    var graph = this.graph(bank);
    var aggregates = [];
    if (graph.length == 2)
	return [];
    this.rdf(bank)
	.where(graph + " rdf:type ore:Aggregation")
	.where(graph + " ore:aggregates ?resource")
	.each(function () { aggregates.push(this.resource); });
    return aggregates;
}

jQuery.obp.prototype.defaultLens = obp_defaultLens;
function obp_defaultLens(bank) {
    var graph = this.graph(bank);
    var lens = undefined;
    this.rdf(bank)
	.where(graph + " rdf:type ore:Aggregation")
	.where(graph + " ordf:lens ?lens")
	.each(function () { lens = this.lens; });
    return lens;
}

jQuery.obp.prototype.loadAggregate = obp_loadAggregate;
function obp_loadAggregate(bank) {
    var self = this;
    if (!this.isAggregate(bank)) {
	this.fresnel.addData(bank);
    } else {
	if (!this.lens) {
	    this.lens = this.defaultLens(bank);
	}
	var aggregates = this.aggregates(bank);
	for (var i=0; i<aggregates.length; i++) {
	    var uri = aggregates[i];
	    this.graphs[uri] = false;
	    this.ordf.recv({ 
		    uri: uri,
		    callback: function(bank) { self.addData(bank); }
		});
	}
    }
    this.finish();
}

jQuery.obp.prototype.addData = obp_addData;
function obp_addData(bank) {
    var uri = this.graph(bank);
    this.graphs[uri] = bank;
    this.loadAggregate(bank);
}

jQuery.obp.prototype.finish = obp_finish;

function obp_finish() {
    /* check if we have loaded all the data we are going to */
    var done = true;
    for (var g in this.graphs)
	if (this.graphs[g] == false)
	    done = false;
    if (done) {
	if (this.lens)
	    this.fresnel.addFresnel({ uri: this.lens });
	else if (this.settings.lens)
	    this.fresnel.addFresnel({ uri: this.settings.lens });
    }
}
