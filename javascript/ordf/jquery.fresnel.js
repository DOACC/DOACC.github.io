/*
 * jQuery / rdfquery Fresnel implementation.
 *
 * Copyright (c) 2010 Open Knowledge Foundation
 *  Loosely based on fresnel.js from the Openlink Ajax Toolkit
 *
 * Fresnel docs: 
 *          http://www.w3.org/2005/04/fresnel-info/manual/
 *
 * Usage:
 *          // 1. initialize the fresnel object
 *          fresnel = $.rdf.fresnel();
 *          // 2. load fresnel format instructions into fresnel.fresnel_data
 *          fresnel.addFresnel({ uri: foo, callback: bar })
 *          // 3. add some databank
 *          fresnel.addData(databank);
 *          // 4. format the data
 *          fresnel.format().appendTo("#content");
 *
 */
jQuery.rdf.fresnel = __fresnel = function(options) {
    this.options = options || {};
    this.listeners = [];
    // this.flushData();
    this.data = [];
    //this.flushFresnel();
    this.lenses = {};
    this.fresnel_data = $.rdf.databank([], {
        namespaces: {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "fresnel": "http://www.w3.org/2004/09/fresnel#"
        }
    });
}

__fresnel.prototype.flushFresnel = fresnel_flushFresnel;
function fresnel_flushFresnel() {
    this.lenses = {};
    this.fresnel_data = $.rdf.databank([], {
        namespaces: {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "fresnel": "http://www.w3.org/2004/09/fresnel#"
        }
    });
}
__fresnel.prototype.flushData = fresnel_flushData;
function fresnel_flushData() {
    this.data = [];
}

__fresnel.prototype.selectData = fresnel_selectData;
function fresnel_selectData(i, selected) {
    this.data[i].selected = selected;
    this.trigger("selectData");
}

__fresnel.prototype.addListener = fresnel_addListener;
function fresnel_addListener(l) {
    this.listeners.push(l);
}
__fresnel.prototype.removeListener = fresnel_removeListener;
function fresnel_removeListener(l) {
    var i = this.listeners.indexOf(l);
    if (i >= 0) {
        this.listeners = this.listeners.slice(0,i)
            .concat(this.listeners.slice(i+1, this.listeners.length));
    }
}
/**
 * needed because sometimes add/replace get race condition when
 * being called within event handler
 */
__fresnel.prototype.replaceListener = fresnel_replaceListener;
function fresnel_replaceListener(o, n) {
    var i = this.listeners.indexOf(o);
    if (i >= 0) {
        this.listeners[i] = n;
    } else {
        this.listeners.push(n);
    }
}

__fresnel.prototype.trigger = fresnel_trigger;
function fresnel_trigger(event_type) {
    for (var i=0; i<this.listeners.length; i++) {
        this.listeners[i].trigger(event_type, this);
    }
}

__fresnel.prototype.addFresnel = fresnel_addFresnel;
function fresnel_addFresnel(options) {
    if (options.uri == undefined)
        throw "addFresnel: requires uri in options";
    var self = this;
    var store = new jQuery.ordf();
    store.recv({
        uri: options.uri,
        callback: function (data) {
            self.lenses = {}; // invalidate cache
            self.fresnel_data = data;
            data.prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
            data.prefix("fresnel", "http://www.w3.org/2004/09/fresnel#");
            self.trigger("addFresnel");
            if (options.callback)
                options.callback(data);
        }
    });
}
__fresnel.prototype.cloneFresnel = fresnel_cloneFresnel;
function fresnel_cloneFresnel(other) {
    this.fresnel_data = other.fresnel_data;
}

__fresnel.prototype.addData = fresnel_addData;
function fresnel_addData(databank) {
    this.data.push(databank);
    // some inferencing rules
    jQuery.rdf.ruleset()
        .prefix("bibo", "http://purl.org/ontology/bibo/")
        .prefix("owl", "http://www.w3.org/2002/07/owl#")
        .add("?book bibo:authorList ?authors",
             "?book a bibo:Book")
//        .add("?subject ?predicate ?object",
//             "?subject a owl:Thing")
        .run(databank);
    this.trigger("addData");
}

__fresnel.prototype.findSubjects = fresnel_findSubjects;
function fresnel_findSubjects() {
    var subjects = {};
    for (var i=0; i<this.data.length; i++) {
        var store = this.data[i].tripleStore;
        for (var s in store) {
            var statement = store[s][0];
            subjects[statement.subject] = statement.subject;
        }
    }
    return subjects;
}

__fresnel.prototype.format = fresnel_format;
function fresnel_format(options) {
    this.load_css();
    var container = $("<div></div>").addClass("fresnel_container");
    var subjects = this.findSubjects();
    for (var i in subjects) {
        var lens = this.findLens(subjects[i]);
        if (lens) {
            this.formatResource(options, lens, subjects[i]).appendTo(container);
        }
    }
    container.bind("addData", function (e, f) {
        f.redraw();
    });
    container.bind("addFresnel", function (e, f) {
        f.redraw();
    });
    container.bind("selectData", function (e, f) {
        f.redraw();
    });
    container.options = options;
    this.replaceListener(this.container, container);
    this.container = container;
    return container;
}

__fresnel.prototype.redraw = fresnel_redraw;
function fresnel_redraw() {
    if (this.container == undefined)
        return;
    var old_container = this.container;
    var parent = old_container.parent();
    var new_container = this.format(old_container.options);
    old_container.remove();
    new_container.appendTo(parent);
}

__fresnel.prototype.save = fresnel_save;
function fresnel_save(reason) {
    var store = new jQuery.ordf();
    for (var i=0; i<fresnel.data.length; i++) {
        store.send({ databank: this.data[i], reason: reason.toString() });
    }
}
__fresnel.prototype.rdf = fresnel_rdf;
/*
 * utility function, returns the rdf contained in the formatting 
 * databank 
 */
function fresnel_rdf() {
    return jQuery.rdf( { databank: this.fresnel_data } );
}

__fresnel.prototype.data_rdf = fresnel_data_rdf;
/*
 * utility function, return the union of all databanks in this renderer
 */
function fresnel_data_rdf() {
    var rdf = $.rdf();
    for (var i=0; i<this.data.length; i++) {
        if (this.data[i].selected == false)
            continue;
        rdf = rdf.add($.rdf({ databank: this.data[i] }));
    }
    return rdf;
}

__fresnel.prototype.load_css = fresnel_load_css;
/*
 * Inform the browser of any stylesheets that we need to load
 */
function fresnel_load_css() {
    this.rdf()
        .where("?group a fresnel:Group")
        .where("?group fresnel:stylesheetLink ?ss")
        .each(function () {
            var ss = this.ss.value.toString();
            var found = false;
            for (var i=0; i<document.styleSheets.length; i++) {
                if (document.styleSheets[i].href == ss) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                $("<link></link>")
                    .attr("rel", "stylesheet")
                    .attr("type", "text/css")
                    .attr("href", ss)
                    .appendTo(document.head);
            }
        });
}

__fresnel.prototype.findLens = fresnel_findLens;
/* find appropriate lens for resource */
function fresnel_findLens(subject) {
    var lens = undefined;

    /* cache shortcut */
    lens = this.lenses[subject];
    if (lens != undefined)
        return lens;

    /* search for lens by instance first */
    this.rdf()
        .where("?lens a fresnel:Lens")
        .where("?lens fresnel:instanceLensDomain " + subject)
        .each(function () { lens = this.lens; });
    if (lens) {
        this.lenses[subject] = lens;
        return lens;
    }

    /* more expensive search */
    var types = this.findTypes(subject);
    /* cache shortcut */
    var undefined_type_found = false;
    for (var i=0; i<types.length; i++) {
        lens = this.lenses[types[i]];
        if (lens)
            return lens;
        if (lens == undefined)
            undefined_type_found = true;
    }
    /* this means all types were negatively cached */
    if (!undefined_type_found)
        return false;

    /* look for lenses for each type */
    for (var i=0; i<types.length; i++) {
        this.rdf()
            .where("?lens a fresnel:Lens")
            .where("?lens fresnel:classLensDomain " + types[i])
            .each(function () { lens = this.lens; });
        if (lens) {
            this.lenses[types[i]] = lens;
            return lens;
        } else {
            this.lenses[types[i]] = false; // negative caching
        }
    }

    /* at this point we know that we do not display the subject */
    this.lenses[subject] = false;
    return false;
}

__fresnel.prototype.styleElement = fresnel_styleElement;
/* 
 * apply the style to the element. style may be either
 * fresnel:stylingInstructions or fresnel:styleClass
 */
function fresnel_styleElement(element, style) {
    var ns = this.fresnel_data.namespaces["fresnel"];
    if (style.datatype == ns + "stylingInstructions") {
        var styles = style.representation.split(";");
        var css = {}
        for (var i=0; i<styles.length; i++) {
            var j = styles[i].indexOf(":");
            if (j > 0) {
                css[styles[i].substr(0,j)] = styles[i].substr(j+1); 
            }
        }
        return element = element.css(css);
    } else {
        element = element.addClass(style.representation);
    }
    return element;
}

__fresnel.prototype.lensProperties = fresnel_lensProperties;
/*
 * Return the properties specified by the given lens.
 */
function fresnel_lensProperties(subject, lens) {
    /* cache since we will look this up often */
    if (lens.properties == undefined) {
        var properties = [];
        var q = this.rdf().where(lens + " fresnel:showProperties ?first");
        if (q.length > 0) 
            properties = jQuery.rdf.collection(this.rdf(), q[0].first);
        /* check for nested definitions of sublenses */
        for (var i=0; i<properties.length; i++) {
            if (jQuery.rdf.isBnode(properties[i])) { // bnode -> sublens
                q = this.rdf()
                    .where(properties[i] + " fresnel:property ?property")
                    .where(properties[i] + " fresnel:sublens ?sublens")
                    .each(function () {
                        properties[i] = this.property;
                        properties[i].sublens = this.sublens;
                    });
            }
        }
        if ( subject && (properties.length > 0) && 
             (properties[properties.length-1].toString() == 
                "<http://www.w3.org/2004/09/fresnel#allProperties>") ) {
            properties = properties.slice(0, properties.length-1);
	    var all_properties = [];
            this.data_rdf()
                .where(subject + " ?p ?o")
                .each(function () { 
		    if ((properties.indexOf(this.p) < 0) && (all_properties.indexOf(this.p) < 0))
                        all_properties.push(this.p);
                });
	    properties = properties.concat(all_properties.sort());
            var q = this.rdf().where(lens + " fresnel:hideProperties ?first");
            if (q.length > 0) {
                var hidden = jQuery.rdf.collection(this.rdf(), q[0].first);
                for (var i=0; i<hidden.length; i++) {
                    var hide = properties.indexOf(hidden[i]);
                    if (hide >= 0) {
                        properties =
                            properties.slice(0,hide).concat(
                                properties.slice(hide+1, properties.length));
                    }
                }
            }
            // do not cache since property list is dynamic
        } else {
            lens.properties = properties;
        }
    } else { // lens.properties is defined
        properties = lens.properties;
    }
    return properties;
}

__fresnel.prototype.propertyStyle = fresnel_propertyStyle;
/*
 * Return a Style attribute for the given format 
 * property, label, value
 */
function fresnel_propertyStyle(format) {
    if (format.propertyStyle == undefined) {
        format.propertyStyle = false;
        this.rdf()
            .where(format + " fresnel:propertyStyle ?style")
            .each(function () { format.propertyStyle = this.style; });
    }
    return format.propertyStyle;
}
__fresnel.prototype.labelStyle = fresnel_labelStyle;
function fresnel_labelStyle(format) {
    if (format.labelStyle == undefined) {
        format.labelStyle = false;
        this.rdf()
            .where(format + " fresnel:labelStyle ?style")
            .each(function () { format.labelStyle = this.style; });
    }
    return format.labelStyle;
}
__fresnel.prototype.valueStyle = fresnel_valueStyle;
function fresnel_valueStyle(format) {
    if (format.valueStyle == undefined) {
        format.valueStyle = false;
        this.rdf()
            .where(format + " fresnel:valueStyle ?style")
            .each(function () { format.valueStyle = this.style; });
    }
    return format.valueStyle;
}

__fresnel.prototype.propertyLabel = fresnel_propertyLabel;
/*
 * Return an appropriate label (DOM Element or false) for the
 * given propety. Can return false if the label is the special
 * value fesnel:none
 */
function fresnel_propertyLabel(options, format, property) {
    /* could probably benefit from caching */
    var label = true;
    if (format)
        this.rdf()
            .where(format + " fresnel:label ?label")
            .each(function () { label = this.label; });
    if (label == "<http://www.w3.org/2004/09/fresnel#none>")
        label = false;
    if (label == true) {
        /* naively infer the label from the property URI */
        var sp = property.value.toString().split("/");
        sp = sp[sp.length-1].split("#");
        label = { value: sp[sp.length-1] };
    }
    if (label) {
        var span = $("<span></span>").addClass("fresnel_label");
        span.text(label.value);
        label = span;
        if (format) {
            var style = this.labelStyle(format);
            if (style) label = this.styleElement(label, style);
        }
        if (options.controls)
            label.FresnelLabelControls(options, this);
    }
    return label;
}

function urlshorten(text) {
    if (text.length > 60) {
        return text.substr(0, 28) + "..." + text.substr(text.length-29, 29);
    }
    return text;
}

__fresnel.prototype.value = fresnel_value;
function fresnel_value(options, lens, format, object) {
    var value = undefined;
    // filter on language. a bit spaghetti
    if (object.lang) {
        if (!this.languages)
            this.languages = {};
        this.languages[object.lang] = true;
    }
    if ((object.lang && this.lang) && (this.lang != object.lang)) {
        return undefined;
    }

    if (jQuery.rdf.isBnode(object)) {
        var new_lens = this.findLens(object);
        if (new_lens)
            value = this.formatResource(options, new_lens, object);
//        else
            // Probably not correct. This is here so we can support
            // such nonsense as 
            //      <foo> dc:subject [ rdfs:label "blah blah" ]
            // found e.g. in
            // http://purl.org/NET/book/isbn/9780061474095#book
            // Fresnel spec may not handle this case of how to display
            // a bnode with no type. Alternatively we might be better
            // adding an inferencing rule to assert rdfs:Resource as a
            // type in the absence of one explicitly stated. That may
            // be better than using whatever the current lens is.
            // But that inferencing rule is expensive (excessively
            // productive). Hmm.
 //           value = this.formatResource(options, lens, object);
    } else if (format) {
        if (format.formatValue == undefined) {
            format.formatValue = false;
            this.rdf()
                .where(format + " fresnel:value ?value")
                .each(function () { format.formatValue = this.value });
        }
        if (format.formatValue == "<http://www.w3.org/2004/09/fresnel#externalLink>") {
            value = $("<a></a>")
                .attr("href", object.value.toString())
                .text(urlshorten(object.value.toString()));
	    var label_link = function(labels) {
		if (this.lang && labels[this.lang]) {
		    value.text(labels[this.lang]);
		} else if (labels["default"]) {
		    value.text(labels["default"]);
		}
	    }
	    var ordf = new jQuery.ordf();
	    ordf.get_label({ uri: object, callback: label_link });
        } else if (format.formatValue == "<http://www.w3.org/2004/09/fresnel#image>") {
            value = $("<img />")
                .attr("src", object.value.toString());
        }
    }
    if (value == undefined) {
        if (jQuery.rdf.isUri(object)) {
            value = $("<a></a>")
                .attr("href", object.value.toString())
                .text(urlshorten(object.value.toString()));
	    var label_link = function(labels) {
		if (this.lang && labels[this.lang]) {
		    value.text(labels[this.lang]);
		} else if (labels["default"]) {
		    value.text(labels["default"]);
		}
	    }
	    var ordf = new jQuery.ordf();
	    ordf.get_label({ uri: object, callback: label_link });
        } else if (jQuery.rdf.isLiteral) {
            value = $("<p></p>").text(object.value.toString());
        } else {
            value = $("<span></span>").text(object.value.toString());
        }
    }
    return value;
}

__fresnel.prototype.formatValue = fresnel_formatValue;
/*
 * Render and return a formatted object part of a triple. This can
 * recurse through sublenses. It also sneakily stuffs a copy of the
 * original statement into the DOM Element with a "statement" attribute
 * to facilitate inline editing.
 */
function fresnel_formatValue(options, lens, format, subject, property, object) {
    var div = $("<div></div>").addClass("fresnel_value");
    if (format) {
        var style = this.valueStyle(format);
        if (style) div = this.styleElement(div, style);
    }

    if (property.sublens) {
        this.formatResource(options, property.sublens, object).appendTo(div);
    } else {
        var value = this.value(options, lens, format, object);
        if (value) {
            if (!this.lang && object.lang) {
                    $("<span></span>")
                        .addClass("fresnel_object_language")
                        .text("(" + object.lang + ")")
                        .prependTo(value);
            }
            value.appendTo(div);
        }
    }

    // stuff the statement in the DOM for future use
    div[0].statement = this.findStatement(subject, property, object);
    if (options.controls)
        $(div).FresnelValueControls(options, this, lens, div[0].statement);
    return div;
}

__fresnel.prototype.formatProperty = fresnel_formatProperty;
/*
 * Format labels on a given property, and then chain down to the
 * value/objects
 */
function fresnel_formatProperty(options, lens, subject, property) {
    var div = $("<div></div>").addClass("fresnel_property");
    var format = false;
    this.rdf()
        .where(lens + " fresnel:group ?group")
        .where("?format fresnel:group ?group")
        .where("?format fresnel:propertyFormatDomain " + property)
        .each(function () { format = this.format; });
    if (format) {
        var style = this.propertyStyle(format);
        if (style) div = this.styleElement(div, style);
    }
    var label = this.propertyLabel(options, format, property);
    if (label) label.appendTo(div);
    var container = $("<div></div>").addClass("fresnel_container");
    var self = this;
    this.data_rdf()
        .where(subject + " " + property + " ?value")
        .each(function () {
            self.formatValue(options, lens, format, subject, property, this.value)
                .appendTo(container);
        })
    container.appendTo(div);
    if (container.children().length == 0)
        div = false;
    else if (options.controls)
        div.FresnelPropertyControls(options, this, lens, format, subject, property);
    return div;
}

__fresnel.prototype.findTypes = fresnel_findTypes;
function fresnel_findTypes(subject) {
    if (subject.types == undefined) {
        var types = [];
        this.data_rdf()
            .where(subject + " a ?type")
            .each(function () { types.push(this.type); });
        subject.types = types;
    }
    return subject.types;
}

__fresnel.prototype.findFormats = fresnel_findFormats;
function fresnel_findFormats(lens) {
    if (lens.formats == undefined) {
        var formats = [];
        this.rdf()
            .where(lens + " fresnel:group ?group")
            .where("?format fresnel:group ?group")
            .each(function () { formats.push(this.format); });
        lens.formats = formats;
    }
    return lens.formats;
}

__fresnel.prototype.formatResource = fresnel_formatResource;
/*
 * Format a resource using the specified lens. This can also be called
 * for sublenses.
 */
function fresnel_formatResource(options, lens, subject) {
    var resource = $("<div></div>").addClass("fresnel_resource");
    var format = false;
    var self = this;
    resource[0].fresnel = this;
    resource[0].subject = subject;
    resource[0].lens = lens;

    if (options.resource_header && jQuery.rdf.isUri(subject))
        $("<div></div>")
            .addClass("fresnel_resource_uri")
            .text("Resource: " + subject.toString())
            .appendTo(resource);
    // find formats to use, try instance first
    var formats = this.findFormats(lens);
    for (var i=0; i<formats.length; i++) {
        var q = this.rdf()
            .where(formats[i] + " fresnel:instanceFormatDomain " + subject);
        if (q.length > 0) {
            format = formats[i];
            break;
        }
    }
    // not found, try class
    if (!format) {
        var types = this.findTypes(subject);
        for (var i=0; i<types.length; i++) {
            for (var j=0; j<formats.length; j++) {
                var q = this.rdf()
                    .where(formats[j] + " fresnel:classFormatDomain " + types[i]);
                if (q.length > 0) {
                    format = formats[j];
                    break;
                }
            }
            if (format)
                break;
        }
    }

    // if we have found a format apply its resource styles (and the group's)
    if (format) {
        this.rdf()
            .where(format + " fresnel:resourceStyle ?style")
                .each(function () { resource = self.styleElement(resource, this.style) })
            .end()
            .where(format + " fresnel:group ?group")
            .where("?group fresnel:resourceStyle ?style")
                .each(function () { resource = self.styleElement(resource, this.style) })
            .end();
    }
   
    var properties = self.lensProperties(subject, lens);
    for (var i=0; i<properties.length; i++) {
        var element = self.formatProperty(options, lens, subject, properties[i]);
        if (element) {
            element.appendTo(resource);
        }
    }

    if (options.controls)
        resource.FresnelResourceControls(options, this, lens, subject);
    return resource;
}

__fresnel.prototype.findStatement = fresnel_findStatement;
function fresnel_findStatement(subject, property, object) {
    // a way to make this more efficient?
    for (var i=0; i<this.data.length; i++) {
        var statements = this.data[i].tripleStore[subject];
        if (statements == undefined)
            continue;
        for (var j=0; j<statements.length; j++) {
            if ( (statements[j].property.value == property.value) &&
                 (statements[j].object.value == object.value) ) {
                return statements[j];
            }
        }
    }
}
__fresnel.prototype.removeStatement = fresnel_removeStatement;
function fresnel_removeStatement(statement) {
    for (var i=0; i<this.data.length; i++) {
        this.data[i].remove(statement);
    }
}
__fresnel.prototype.addStatement = fresnel_addStatement;
function fresnel_addStatement(statement) {
    // kludgy find the first graph with the subject
    // and add to that graph
    for (var i=0; i<this.data.length; i++) {
        var rdf = jQuery.rdf({ databank: this.data[i] });
        if (rdf.where(statement.subject + " ?p ?o").length > 0) {
            rdf.add(statement);
            return;
        }
    }
    // failing that, just add to the first graph
    jQuery.rdf({ databank: self.data[0] }).add(statement);
}

/* Widgets */
jQuery.prototype.Fresnel = function(options) {
    var defaults = {
        editable: false,
        controls: true,
        resource_header: true
    }
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.Fresnel: must pass a fresnel instance in options";
    var container = options.fresnel.format($.extend(defaults, options));
    container.appendTo(this);
    return this;
}


jQuery.prototype.GraphChooser = function(options) {
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.GraphChooser: require fresnel to be in options";

    var chooser = $("<div></div>").addClass("fresnel_graph_chooser");
    $("<h3>Resource Selector</h3>").appendTo(chooser);
    var make_choices = function() {
        chooser.children("div").each(function () { $(this).remove(); });
        for (var i=0; i<options.fresnel.data.length; i++) {
            var graphdiv = $("<div></div>")
                .appendTo(chooser);
            var select_idx = i;
            $("<input></input>")
                .attr("type", "checkbox")
                .attr("checked", (options.fresnel.data[i].selected == true) ? "true" : "false")
                .click(function (e) {
                    options.fresnel.selectData(select_idx, (this.value == "on" ? true : false));
                })
                .appendTo(graphdiv);
            $("<span></span>")
                .text("" + options.fresnel.data[i].baseURI)
                .appendTo(graphdiv);
        }
    }
    make_choices(); // initialise with whatever is in the fresnel now
    chooser.appendTo(this);
    fresnel.addListener(chooser);
    chooser.bind("addData", make_choices);
    return this;
}

jQuery.prototype.GraphSaver = function(options) {
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.GraphSaver: require fresnel to be in options";
    var saver = $("<li></li>").addClass("fresnel_saver");
    $("<span></span>")
        .text("Log Message: ")
        .appendTo(saver);
    var reason = $("<input />")
        .attr("type", "text")
        .attr("size", "30")
        .appendTo(saver);
    $("<input />")
        .attr("type", "submit")
        .attr("value", "Save")
        .click(function () {
            options.fresnel.save(reason.val());
        })
        .appendTo(saver);
    saver.appendTo(this);
    return this;
}

jQuery.prototype.HistoryViewer = function(options) {
    if (options.fresnel == undefined)
        throw "jQuery.fresnel.GraphChooser: require fresnel to be in options";
    var viewer = $("<div></div>").addClass("fresnel_history_viewer");
    var show_history = function() {
        var query =
            "PREFIX cs: <http://purl.org/vocab/changeset/schema#>\n" +
            "PREFIX gr: <http://bibliographica.org/schema/graph#>\n" +
            "SELECT DISTINCT ?date ?name ?reason\n" +
            "WHERE {\n"
            "?cs a cs:ChangeSet .\n"
        for (var i=0; i<options.fresnel.data.length; i++) {
            var graph = options.fresnel.data[i].baseURI;
            query += "{ ?cs cs:addition [ gr:graph <" + graph + "> ] } UNION\n" +
                     "{ ?cs cs:removal [ gr:graph <" + graph + "> ] } .\n";
        }
        query += "?cs cs:changeReason ?reason .\n" + 
                 "?cs cs:createdDate ?date .\n" + 
                 "?cs cs:creatorName ?name\n" +
                 "} ORDER BY DESC(?date) LIMIT 10";
        var store = new jQuery.ordf();
        store.sparql({ query: query, callback: function(data) {
            viewer.children(".fresnel_short_history")
                .each(function () { $(this).remove(); });
            var history = $("<div></div>")
                .addClass("fresnel_short_history")
                .appendTo(viewer);
            var bindings = data.results.bindings;
            for (var i=0; i<bindings.length; i++) {
                var row = $("<div></div>")
                    .css({ width: "100%", "border-top": "1px dotted black" })
                    .appendTo(history);
                $("<span></span>")
                    .text(bindings[i].name.value)
                    .appendTo(row);
                $("<span></span>")
                    .css({ float: "right" })
                    .text(
                        bindings[i].date.value.substr(0, 10) + " " +
                        bindings[i].date.value.substr(11, 5)
                    )
                    .appendTo(row);
                $("<p></p>")
                    .text(bindings[i].reason.value)
                    .appendTo(row);
            }
        }});
    }
    $("<input />")
        .attr("type", "submit")
        .attr("value", "history")
        .click(show_history)
        .appendTo(viewer);
    viewer.appendTo(this);
    return this;
}

jQuery.typedValue.types["http://www.w3.org/2004/09/fresnel#styleClass"] = {
    strip: true,
    regex: /^.*$/,
    value: function(c) { return c; }
};
jQuery.typedValue.types["http://www.w3.org/2004/09/fresnel#stylingInstructions"] = {
    strip: false,
    regex: /^.*$/,
    value: function(c) { return c; }
};

/*
 * This function walks an rdf Collection and returns a list
 */
jQuery.rdf.collection = function(rdf, first) {
    var l = [];
    var rest=first;
    for (var i=0; rest != "<http://www.w3.org/1999/02/22-rdf-syntax-ns#nil>"; i++) {
        var q = rdf
            .reset()
            .where(rest + " rdf:first ?value")
            .where(rest + " rdf:rest ?rest");
        if (q.length == 0)
            break;
        l[i] = q[0].value;
        rest = q[0].rest;
    }
    return l;
}

jQuery.rdf.isLiteral = function(o) {
    if (jQuery.rdf.isBnode(o) || jQuery.rdf.isUri(o))
        return false;
    return true;
}

jQuery.rdf.isBnode = function(o) {
    if (o.id != undefined)
        return true;
    return false;
}

jQuery.rdf.isUri = function(o) {
    if (typeof o.value == "object")
        return true;
    return false;
}
