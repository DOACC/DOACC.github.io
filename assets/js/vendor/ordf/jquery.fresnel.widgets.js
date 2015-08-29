function __ui_icon(glyph) {
    var li = $("<li></li>")
        .addClass("ui-state-default")
        .addClass("ui-corner-all");
    $("<span></span>")
        .addClass("ui-icon")
        .addClass("ui-icon-" + glyph)
        .appendTo(li);
    return li;
}

jQuery.prototype.FresnelControls = function(options) {
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.FresnelControls: must pass a fresnel instance in options";
    var fresnel = options.fresnel;
    var controls = $("<div></div>")
        .addClass("ui-state-default")
//        .addClass("ui-corner-all")
        .addClass("fresnel_controls")
        .FresnelLensChooser({ fresnel: options.fresnel,
                              uri: options.fresnel.fresnel_data.baseURI.toString() })
        .FresnelLangChooser(options)
        .FresnelAddResource(options);

    $("<br />").appendTo(controls);
    var reason = $("<input />")
        .attr("type", "text")
        .attr("size", "40")
        .val("Log Message")
        .appendTo(controls);
    $("<input />")
        .attr("type", "submit")
        .val("Save to Store")
        .click(function (e) {
	    e.stopPropagation();
            fresnel.save(reason.val());
        })
        .appendTo(controls);
    $("<input />")
        .attr("type", "submit")
        .val("Flush Workspace")
        .click(function (e) {
            e.stopPropagation();
            fresnel.flushData();
            fresnel.trigger("addData");
        })
        .appendTo(controls);
    controls.prependTo(this);
    return this;
}

jQuery.prototype.FresnelLensChooser = function(options) {
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.LensChooser: must pass a fresnel instance in options";

    var chooser = $("<div></div>").addClass("fresnel_lens_chooser");
    $("<span></span>").html("Lens:").appendTo(chooser);
    var select = $("<select></select>").appendTo(chooser)
        .change(function(event) {
            var selected = $(this).children()[this.selectedIndex];
            var uri = selected.value;
            options.fresnel.addFresnel({ uri: uri, callback: options.callback });
        });
    var query =
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX fresnel: <http://www.w3.org/2004/09/fresnel#>\n" +
            "SELECT DISTINCT ?graph ?label WHERE {\n" +
            "    GRAPH ?graph {\n" +
            "        ?lens a fresnel:Lens\n" +
            "    } .\n" +
            "    ?graph rdfs:label ?label\n" +
            "} ORDER BY ?label";
    var store = new jQuery.ordf();
    store.sparql({ query: query, callback: function (result) {
        var bindings = result.results.bindings;
        for (var i=0; i<bindings.length; i++) {
            $("<option></option>")
                .html(bindings[i].label.value)
                .attr("value", bindings[i].graph.value)
                .appendTo(select);
        }
        var uri = options.fresnel.fresnel_data.baseURI.toString();
        select.val(uri);
    }});
    chooser.appendTo(this);
    options.fresnel.addListener(chooser);
    chooser.bind("addFresnel", function () { 
	select.val(options.fresnel.fresnel_data.baseURI.toString())
    });
    return this;
}

function _fresnel_lang_options(fresnel, select) {
    var keys = function (o) { var a = []; for (var k in o) a.push(k); return a; };
    var languages = keys(fresnel.languages);
    languages.sort();
    for (var i=0; i<languages.length; i++) {
        $("<option></option>")
            .text(languages[i])
            .attr("value", languages[i])
            .appendTo(select);
    }
}

jQuery.prototype.FresnelLangChooser = function(options) {
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.LensChooser: must pass a fresnel instance in options";
    var fresnel = options.fresnel;
    var chooser = $("<div></div>").addClass("fresnel_lang_chooser");
    $("<span></span>").html("Lang:").appendTo(chooser);
    var make_choices = function() {
        chooser.children("select").each(function () { $(this).remove(); });
        var select = $("<select></select>").appendTo(chooser)
            .change(function(event) {
                var selected = $(this).children()[this.selectedIndex];
                fresnel.lang = selected.value;
                fresnel.trigger("selectData");
            });
        $("<option></option>")
            .text("All")
            .appendTo(select);
        _fresnel_lang_options(fresnel, select);
        if (options.fresnel.lang)
            select.val(options.fresnel.lang);
    }
    chooser.appendTo(this);
    options.fresnel.addListener(chooser);
    chooser.bind("addData", make_choices);
    return this;
}

jQuery.prototype.FresnelResourceControls = function(options, fresnel, lens, subject) {
    var resource = this;
    var controls = $("<div />")
        .hide()
        .prependTo(this);
    $("<div />")
        .addClass("ui-state-default")
        .addClass("ui-corner-all")
        .css({
            float: "right",
            "padding-left": "5px",
            "padding-right": "5px"
        })
        .text(" + ")
        .click(function (e) {
            e.stopPropagation();
            var statement = jQuery.rdf.triple(
                subject.toString() +
                ' <http://www.w3.org/2000/01/rdf-schema#comment> "A comment about this resource"@en'
            );
            resource.FresnelValueEditor(options, fresnel, lens, statement);
        })
        .appendTo(controls);
    this.mouseover(function (e) { controls.show(); });
    this.mouseout(function (e) { controls.hide(); });
    return this;
}

jQuery.prototype.FresnelPropertyControls = function(options, fresnel, lens, subject, property) {
    return this;
}

jQuery.prototype.FresnelLabelControls = function(options, fresnel) {
    return this;
}

jQuery.prototype.FresnelValueControls = function(options, fresnel, lens, statement) {
    // this -> fresnel_value div
    var value = this;
    var fresnel = options.fresnel;
    this.one("dblclick", function (e) {
        e.stopPropagation();
        value.children().each(function () { $(this).hide(); });
        value.FresnelValueEditor(options, fresnel, lens, statement, value);
    });
    return this;
}

jQuery.prototype.FresnelValueEditor = function(options, fresnel, lens, statement, value) {
    var editor = $("<div></div>")
        .addClass("fresnel_value_editor");
    $("<div></div>")
        .text(statement.subject.toString())
        .appendTo(editor);
    var editor_form = $("<form />")
        .appendTo(editor);

    var property = $("<select />")
        .appendTo(editor_form);
    var properties = fresnel.lensProperties(statement.subject, lens);
    for (var i=0; i<properties.length; i++) {
        $("<option />")
            .val(properties[i].toString())
            .text(properties[i].toString())
            .appendTo(property);
    }
    property.val(statement.property.toString());

    var editor_context_controls = $("<div />")
        .addClass("fresnel_value_editor_context_controls")
        .appendTo(editor_form);
    var value_div = $("<div />")
        .addClass("fresnel_value_editor_value")
        .appendTo(editor_form);
    var editor_global_controls = $("<div />")
        .addClass("fresnel_value_editor_global_controls")
        .appendTo(editor_form);

    var object_editor = undefined;
    var object_uri = (!jQuery.rdf.isLiteral(statement.object)) ? statement.object.toString() : "<http://example.org/>";
    var literal_value = jQuery.rdf.isLiteral(statement.object) ? statement.object.value : '';
    var literal_lang = jQuery.rdf.isLiteral(statement.object) ? statement.object.lang : '';
    var literal_datatype = jQuery.rdf.isLiteral(statement.object) ? statement.object.datatype : '';
    var object_type = jQuery.rdf.isLiteral(statement.object) ? "literal" : "uri";

    var make_uri_editor = function() {
	object_type = "uri";
        value_div.children().each(function () { $(this).remove(); });
	$("<input />")
            .attr("type", "text")
            .attr("size", "60")
            .val(object_uri)
            .change(function () { object_uri = $(this).val(); })
            .appendTo(value_div);
    }

    var make_literal_editor = function() {
	object_type = "literal";
	value_div.children().each(function () { $(this).remove(); });
	var options_div = $("<div />")
            .addClass("fresnel_value_editor_options")
            .appendTo(value_div);
	var lang_label = $("<label>Language</label>")
            .appendTo(options_div);
	var lang_select = $("<select />")
            .change(function () {
                var selected = $(this).children()[this.selectedIndex];
                literal_lang = selected.value;
            });
	$("<option />")
            .text("Unspec")
            .attr("value", "")
            .appendTo(lang_select);
        _fresnel_lang_options(lang_select);
        if (literal_lang)
            lang_select.val(literal_lang);
        lang_select.appendTo(lang_label);

        $("<textarea />")
            .attr("cols", "60")
            .attr("rows", "10")
            .val(literal_value)
            .change(function () { literal_value = $(this).val(); })
            .appendTo(value_div);
    }

    var make_type_editor = function() {
	object_type = "uri";
	editor_context_controls.children().each(function () { $(this).remove(); });
	value_div.children().each(function () { $(this).remove(); });
	var type = $("<select />")
  	    .change(function () { object_uri = $(this).val(); })
	    .appendTo(value_div);
	var set_types = function(types) {
	    for (var i=0; i<types.length; i++) {
		$("<option />")
   		    .val(types[i].toString())
                    .text(types[i].toString())
    		    .appendTo(type);
	    }
	    if (object_uri) {
		type.val(object_uri.toString());
	    }
	}
	var ordf = new jQuery.ordf();
	ordf.supported_types({ callback: set_types });
    }

    var make_generic_editor = function() {
	editor_context_controls.children().each(function () { $(this).remove(); });
	var radio_uri = $("<input />")
            .attr("id", "radio_uri")
            .attr("type", "radio")
            .attr("name", "object_type")
            .click(make_uri_editor);
	var radio_lit = $("<input />")
            .attr("id", "radio_lit")
            .attr("type", "radio")
            .attr("name", "object_type")
            .click(make_literal_editor);
        if (jQuery.rdf.isLiteral(statement.object)) {
            radio_lit.attr("checked", "checked");
            radio_lit.trigger("click");
	} else {
	    radio_uri.attr("checked", "checked");
	    radio_uri.trigger("click");
	}
	var radio_uri_label = $("<label>URI</label>")
            .appendTo(editor_context_controls);
	radio_uri.appendTo(radio_uri_label);
	var radio_lit_label = $("<label>Literal</label>")
            .appendTo(editor_context_controls);
	radio_lit.appendTo(radio_lit_label);
    }

    var make_controls = function () {
	editor_global_controls.children().each(function () { $(this).remove(); });
	$("<input />")
            .attr("type", "submit")
            .val("Cancel")
            .appendTo(editor_global_controls)
            .click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                editor.remove();
                if (value) {
                    value.children().each(function () { $(this).show(); });
                    value.FresnelValueControls(options, fresnel, lens, statement);
                }
            });
        $("<input />")
            .attr("type", "submit")
            .val("Delete")
            .appendTo(editor_global_controls)
            .click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                fresnel.removeStatement(statement);
                var resource = value
                    .parent() // container
                    .parent() // property
                    .parent(); // resource
                var new_resource = fresnel.formatResource(options, lens, statement.subject);
                var parent = resource.parent();
                resource.remove();
                new_resource.appendTo(parent);
            });

        $("<input />")
            .attr("type", "submit")
            .val("Done")
            .appendTo(editor_global_controls)
            .click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                statement.property = jQuery.rdf.resource(property.val()); // need error handling
                if (object_type == "uri") {
                    // TODO: handle bnode
                    statement.object = jQuery.rdf.resource(object_uri);
                } else {
                    var args = {};
                    if (literal_lang)
                        args.lang = literal_lang;
                    if (literal_datatype)
                        args.datatype = literal_datatype;
                    if (!literal_lang && !literal_datatype) {
                        // silly, rdfquery's literal constructor expects encoded value...
                        literal_value = '"' + literal_value.replace(/\"/g, '\\"') + '"';
                    }
                    statement.object = jQuery.rdf.literal(literal_value, args);
                }
                if (!value) { // spaghetti, means this is an add operation
                    fresnel.addStatement(statement);
                    var resource = $(this).parent().parent().parent().parent();
                } else {
                    var resource = value
                        .parent() // container
                        .parent() // property
                        .parent(); // resource
                }
                var new_resource = fresnel.formatResource(options, lens, statement.subject);
                var parent = resource.parent();
                new_resource.insertAfter(resource);
                resource.remove();
            });
    }

    property.change(function (e) {
	var p = property.val();
	if (p == "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>") {
	    make_type_editor();
	} else {
	    make_generic_editor();
	}
    });
    property.trigger("change");

    make_controls();

    editor.prependTo(this);
}

jQuery.prototype.SearchResults = function(options) {
    if ( (options.fresnel == undefined) || (options.data == undefined) )
        throw "jQuery.prototype.SearchResults: require fresnel and data options";
    var result_list = $("<ul />")
        .addClass("search_result_list");
    for (var i=0; i<options.data.length; i++) {
        var data = options.data[i];
        var fresnel = new $.rdf.fresnel();
        fresnel.cloneFresnel(options.fresnel);
        fresnel.addData(data.databank);
        var row = $("<li />")
            .appendTo(result_list);
        var result = $("<div />")
            .addClass("search_result")
            .appendTo(row);
        $("<div />")
            .addClass("search_result_rank")
            .text(data.metadata.rank.toString())
            .appendTo(result);
        $("<div />")
            .addClass("search_result_relevance")
            .text(data.metadata.percent.toString() + "%")
            .appendTo(result);
        var link = $("<a />")
            .text(data.uri)
            .appendTo(result);
        if (options.callback)
            link.one("click", options.callback, data);
        var fresnel_opts = {
            fresnel: fresnel,
            controls: false,
            resource_header: false
        };
        result.Fresnel(fresnel_opts);
    }
    result_list.appendTo(this);
}

jQuery.prototype.FresnelAddResource = function(options) {
    $("<input />")
        .attr("type", "submit")
        .attr("class", "fresnel_control_add_resource")
        .val("Add Resource")
        .appendTo(this)
        .click(function () {
	    var ordf = new jQuery.ordf();
	    ordf.new_resource({ callback: function (bank) { options.fresnel.addData(bank) } });
	});
    return this;
}