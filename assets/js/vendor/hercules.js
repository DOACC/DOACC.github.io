if (! Arielworks) var Arielworks = {};
if (! Arielworks.Util) Arielworks.Util = {};
if (! Arielworks.Parser) Arielworks.Parser = {};
if (! Arielworks.Parser.RecursiveDescentParser) Arielworks.Parser.RecursiveDescentParser = {};
if (! Arielworks.Hercules) Arielworks.Hercules = {};
if (! Arielworks.Hercules.Rdf) Arielworks.Hercules.Rdf = {};
if (! Arielworks.Hercules.Rdf.Datatype) Arielworks.Hercules.Rdf.Datatype = {};
if (! Arielworks.Hercules.Rdf.Datatype.Xsd) Arielworks.Hercules.Rdf.Datatype.Xsd = {};
if (! Arielworks.Hercules.Sparql) Arielworks.Hercules.Sparql = {};
if (! Arielworks.Hercules.Serialized) Arielworks.Hercules.Serialized = {};
if (! Arielworks.Hercules.Serialized.Turtle) Arielworks.Hercules.Serialized.Turtle = {};
Arielworks.Util.Class = {
  create: function(initializer) {
      var obj = function() {
          // call initializers and create the instance's extending stack 
          if (! this.___initialized) {
              this.___initialized = true;
              Arielworks.Util.Class.__callInitializers(this, this.constructor);
              this.___extendingStack = Array.apply(null, this.constructor.___extendingStack); // copy
          } else {
              // called recursively
              var now = this.___extendingStack.shift();
          }

          // call ___constructor
          if (this.___extendingStack[0].prototype.___constructor) {
              this.___extendingStack[0].prototype.___constructor.apply(this, arguments);
          }
          
          if (now) this.___extendingStack.unshift(now);
      };

      obj.___managed = true;
      obj.___initializer = initializer;
      obj.prototype.instanceOf = Arielworks.Util.Class.__instanceOfCall;
      obj.prototype.kindOf = Arielworks.Util.Class.__kindOfCall;
      obj.___extendingStack = [obj];
      obj.prototype.___mixin = Arielworks.Util.Class.__mixinCall;

      return obj;
  },

  extend: function(superClass, mixin1/*, mixin2, mixin3...*/, initializer) {
      var hasInitializer = arguments[arguments.length - 1].___managed != true;
      var subClass = Arielworks.Util.Class.create(hasInitializer ? arguments[arguments.length - 1] : undefined);
      // create a temporary object to prevent from calling the constructor of the super class.
      var dontCallConstructor = function() {};
      dontCallConstructor.prototype = superClass.prototype;
      subClass.prototype =  new dontCallConstructor();
      subClass.prototype.constructor = subClass;

      // super class
      subClass.prototype.___super = superClass;
      subClass.___super = superClass;
      subClass.___extendingStack = Array.apply(null, superClass.___extendingStack);
      subClass.___extendingStack.unshift(subClass);


      var drops = {};
      for (property in subClass) if (subClass.hasOwnProperty(property)) drops[property] = true;
      for (property in superClass) if (superClass.hasOwnProperty(property)) {
          if (drops[property] !== true) subClass[property] = superClass[property];
      }


      // mixin
      subClass.___mixin = [];
      for (var i = 1; i < arguments.length - (hasInitializer ? 1 : 0); i++) {
          var mixin = arguments[i];
          subClass.___mixin.push(mixin);
          // copy methods along its prototype chain.
          // check to drop Object-violated-methods
          for (property in mixin) if (drops[property] !== true && ! Object.prototype.hasOwnProperty(property)) {
              subClass[property] = mixin[property];
          }
      }
      return subClass;
  },
  
  __instanceOfCall: function(klass) {
      return this.constructor == klass;
  },
  
   __kindOfCall: function(klass) {
       Arielworks.Util.Class.__kindOfClassChain(this.constructor, klass);
  },
  
  __kindOfClassChain: function(about, to) {
      // itself
      if (about == to) return true;

      // mixin
      var mixin = about.___mixin;
      for (var i = 0; i < mixin.length; i++) {
          if (Arielworks.Util.Class.__kindOfCallMixin(mixin[i], to)) return true;
      }

      // super class
      if (about.__super) return Arielworks.Util.Class.__kindOfClassChain(about.__super, to);
      
      return false;
  },

  __callInitializers: function(object, klass) {
      // call initializers along the prototype chain from the top super class.
      // stack
      var chainStack = [];
      var currentClass = klass;
      while (currentClass) {
          chainStack.push(currentClass);
          currentClass = currentClass.___super;
      }
      // call the initializers
      while (currentClass = chainStack.pop()) {
          // mixin
          if (currentClass.___mixin) {
              for (var i = 0; i < currentClass.___mixin.length; i++) {
                  Arielworks.Util.Class.__callInitializers(object, currentClass.___mixin[i]);
              }
          }
          // itself
          if (currentClass.___initializer) {
              currentClass.___initializer.apply(object);
          }
      }
  },
  
  __mixinCall: function(num, arg) {
      var mixinClass = this.___extendingStack[0].___mixin[num]
      var ___constructor = mixinClass.prototype.___constructor;
      var tempExtendingStack = this.___extendingStack;
      this.___extendingStack = Array.apply(null, mixinClass.___extendingStack);
      Array.prototype.shift.apply(arguments)
      if (___constructor) ___constructor.apply(this, arguments);
      this.___extendingStack = tempExtendingStack;
  }
};


Arielworks.Util.argToArray = function(from) {
    var to = new Array(from.length)
    for(var i = 0; i < from.length; i ++) to[i] = from[i];
    return to;
};




// old
var Class = {
    create: function() {
        return function() {
            if (this.___constructor) {
                this.___constructor.apply(this, arguments);
            }
        }
    },

    extend: function(superClass) {
        var subClass = Class.create();
        var _constructor = subClass.prototype.constructor;
        subClass.prototype =  new superClass();
        subClass.prototype.constructor = _constructor;
        subClass.prototype.___constructor = undefined;
        subClass.prototype.___super = superClass;
        subClass.___super = superClass;
        var dropList = ["prototype", "___super", "___constructor"];
        for (property in subClass) {
            dropList.push(property);
        }
        for (property in superClass) {
            var drop = false;
            for (var i = 0; i < dropList.length; i++) {
                if (dropList[i] == property) {
                    drop = true;
                    break;
                }
            }
            if (! drop) {
                subClass[property] = superClass[property];
            }
        }
        return subClass;
    }
};


Arielworks.Hercules.Rdf.RDF_NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
Arielworks.Hercules.Rdf.RDF_COLLECTION_FIRST = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "first";
Arielworks.Hercules.Rdf.RDF_COLLECTION_REST = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "rest";
Arielworks.Hercules.Rdf.RDF_COLLECTION_NIL = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "nil";
Arielworks.Hercules.Rdf.RDF_TYPE = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "type";



/**
 * An abstract Class for RDF Resource.
 * @abstract
 */
Arielworks.Hercules.Rdf.Resource = Arielworks.Util.Class.create();

/**
 * Constructs an instance.
 * @param value The value which is hold by the instance
 */
Arielworks.Hercules.Rdf.Resource.prototype.___constructor = function(/*string*/ value) {
    this.value = value;
};

/**
 * Sets the value of the instance.
 * @param value The value of the instance.
 */
Arielworks.Hercules.Rdf.Resource.prototype.setValue = function(/*string*/ value) {
    this.value = value;
};

/**
 * Returns the value of the instance.
 * @return The value of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.Resource.prototype.getValue = function() {
    return this.value;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values, not by "==" operator.
 * This method will be overrided by child classes. e.g.) PlainLiteral checks their value of LanguageTag.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.Resource.prototype.equals = function(/*Arielworks.Hercules.Rdf.Resource*/ to) {
    return (to instanceof this.constructor && this.value == to.value);
};




/**
 * A Class for the IRI Reference Resource.
 */
Arielworks.Hercules.Rdf.RdfUriRef = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);


/**
 * Constructs an instance.
 * @param uriString The uri value of the instance without any delimiters. e.g.) http://www.arielworks.net/, not <http://www.arielworks.net/>
 */
Arielworks.Hercules.Rdf.RdfUriRef.prototype.___constructor = function(/*string*/ uriString) {
    this.___super(this.constructor.normalize(uriString));
};

// NOTE: This normalization method do only "URI" -> "RDF URI Reference" mapping.
// The Normalization processes below in RFC 3987 will not be performed.
// 5.3.2.  Syntax-Based Normalization
// 5.3.3.  Scheme-Based Normalization
// 5.3.4.  Protocol-Based Normalization
// Thise normalizetion process are not supported because "RDF CONCEPT" requires "character by character" comparison.
// c.f. http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Graph-URIref
//
// NOTE:  Strictly, this normalization process converts URI into "RDF URI Reference" not "IRI".
// "RDF URI Reference" reject only characters #x00 - #x1F, #x7F-#x9F .
// In other words, "RDF URI Reference" accept some characters which is not accepted in IRIS,
// for example "not allowed ASCII character in URL" (e.g. " "(#x20), "<"(#x3C)) and some forbidden Unicode characters.
// NOT ALLOWED ASCII: "<", ">", '"', space, "{", "}", "|", "\", "^", and "`"
// c.f. "7.1.  Legacy Extended IRI Syntax" in a draft of RFC 3987
// http://www.ietf.org/internet-drafts/draft-duerst-iri-bis-02.txt
Arielworks.Hercules.Rdf.RdfUriRef.normalize = function(uriString) {
    // c.f. "3.2.  Converting URIs to IRIs" in RFC 3987
    // c.f. "2.2.  Reserved Characters" in RFC RFC 3986
    //@TODO: check "strictry legal UTF-8", if convert into IRI
    //@TODO: check NOT ALLOWED ASCII, if convert into IRI
    // Current non-decodeing characters:
    // ":" / "/" / "?" / "#" / "[" / "]" / "@"
    // "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
    // "%"
    
    var percentRegex = /(%(?!3A|2F|3F|23|5B|5D|40|21|24|26|27|28|29|2A|2B|2C|3B|3D|25)[0-9A-F]{2})+/g;
    uriString = uriString.replace(percentRegex, function() {
        return decodeURIComponent(arguments[0]);
    });
    return uriString;
};

//@TODO: make restricter?
// from "Appendix B.  Parsing a URI Reference with a Regular Expression" in RFC 3986
Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX = componentsRegExp = /^([^:\/?#]+:)?(\/\/[^\/?#]*)?([^?#]*)(\?[^#]*)?(#.*)?$/;
Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef = function(baseUri, uriRef) {
    // c.f. "5.2.2.  Transform References" in RFC 3986
    var bComp = baseUri.match(Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
    bComp.shift();
    var rComp = uriRef.match(Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
    rComp.shift();

    if (rComp[0]) {
        bComp.splice(0, 5, rComp[0], rComp[1], Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
    } else {
        if (! bComp || ! bComp[1]) throw "Given Base URI is not a valid Absolute URI." //@TODO
        if(rComp[1]) {
            bComp.splice(1, 4, rComp[1], Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
        } else if (rComp[2] == "") {
            if (rComp[3]) {
                bComp.splice(3, 2, rComp[3], rComp[4]);
            } else {
                bComp.splice(4, 1, rComp[4]);
            }
        } else if (rComp[2][0] == "/") {
            bComp.splice(2, 3, Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
        } else {
            bComp.splice(2, 3, Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(Arielworks.Hercules.Rdf.RdfUriRef.__merge(bComp[2], rComp[2])), rComp[3], rComp[4]);
        }
    }
    
    return bComp.join("");
};

Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments = function(path) {
    var segments = path.split("/");
    var resultStack = [];
    for (var i = 0; i < segments.length; i++) {
        if (i == 0) {
            if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
            else resultStack.push(segments[i]);
        } else if (i == segments.length - 1) {
            if (segments[i] == "..") {
                var top = resultStack.pop();
                if (top === "") resultStack.push(top);
            }
            
            if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
            else resultStack.push(segments[i]);
        } else {
            if (segments[i] == "." || segments[i] == "") continue;
            else if (segments[i] == "..") {
                var top = resultStack.pop();
                if (top === "") resultStack.push(top);
            }
            else resultStack.push(segments[i]);
        }
    }
    return resultStack.join("/");
};

Arielworks.Hercules.Rdf.RdfUriRef.__merge = function(base, relative) {
    base = base.substring(0, base.lastIndexOf("/"));
    return base + "/" + relative;
};


/**
 * An abstract class for the RDF literal.
 * @abstract
 */
Arielworks.Hercules.Rdf.Literal = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);





/**
 * A class for the Plain Literal.
 * The Plain Literal is the Literal without datatypes and has optionally language tags.
 */
Arielworks.Hercules.Rdf.PlainLiteral = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Literal);

/**
 * Constructs an instance
 * @param value The value of the instance.
 * @param languageTag The optional language tag for the instance. e.g.) en-US
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.___constructor = function(/*string*/ value, /*string*/ languageTag) {
    this.languageTag = languageTag;
    this.___super(value);
};

/**
 * Sets the language tag of the instnace.
 * @param language The language tag to set. e.g.) en-US
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.setLanguageTag = function(languageTag) {
    this.languageTag = languageTag;
};

/**
 * Returns the language tag of the instance.
 * @return The language tag of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.getLanguageTag = function () {
    return this.languageTag;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values and language tags, not by "==" operator.
 * Note: One of pair of literals has the language tag and the other doesn't have, the method will reuturn "false"
 * e.g.) "Hercules"@en-US is NOT equal to "Hercules"
 * see also: http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Literal-Equality
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.equals = function(to) {
    return (to instanceof this.constructor && this.value == to.value && this.languageTag == to.languageTag);
};





/**
 * A class for the Typed Literal.
 * The Typed Literal is the Literal with datatypes like xsd:integer.
 */
Arielworks.Hercules.Rdf.TypedLiteral = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Literal);

/**
 * Constructs an instance.
 * @param value the value of the instance.
 * @datatypeIri The absolute IRI of the datatype of the instance.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.___constructor = function(value, datatypeIri) {
    this.datatypeIri = datatypeIri;
    this.___super(value)
};

/**
 * Sets the datatype of the instnace.
 * @param datatypeIri The datatype iri to set.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.setDataTypeIri = function(datatypeIri) {
    this.datatypeIri = datatypeIri;
};

/**
 * Returns the datatype IRI of the instance.
 * @return The dattype IRI of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.getDataTypeIri = function () {
    return this.datatypeIri;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values and language tags, not by "==" operator.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.equals = function(to) {
    return (to instanceof this.constructor && this.value == to.value && this.datatypeIri == to.datatypeIri);
};





/**
 * A Class for the Blank Node.
 */
Arielworks.Hercules.Rdf.BlankNode = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);

/**
 * Constructs an instance.
 * @param id The id of the blank node instance to identifer.
 */
Arielworks.Hercules.Rdf.BlankNode.prototype.___constructor = function(/*string*/ id) {
    this.___super(id);
};






/**
 * A class for the Triple.
 */
Arielworks.Hercules.Rdf.Triple = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);

/**
 * Constructs an instance.
 * @param subject The subject of the triple
 * @param predicate The predicate of the triple
 * @param object The object of the triple
 */
Arielworks.Hercules.Rdf.Triple.prototype.___constructor = function(/*Arielworks.Hercules.Rdf.Resource*/ subject, /*Arielworks.Hercules.Rdf.Resource*/ predicate, /*Arielworks.Hercules.Rdf.Resource*/ object) {
    /*
    // reject illigal resources
    if (subject instanceof Arielworks.Hercules.Rdf.Literal) throw ""; //TODO
    if (! (predicate instanceof Arielworks.Hercules.Rdf.RdfUriRef)) throw ""; //TODO
    */

    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    
    this.___super();
};

/**
 * Sets the subject of the instance.
 * @param subject An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setSubject = function(/*Arielworks.Hercules.Rdf.Resource*/ subject) {
     this.subject = subject;
};

/**
 * Sets the predicate of the instance.
 * @param predicate An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setPredicate = function(/*Arielworks.Hercules.Rdf.Resource*/ predicate) {
    this.predicate = predicate;
};

/**
 * Sets the object of the instance.
 * @param object An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setObject = function(/*Arielworks.Hercules.Rdf.Resource*/ object) {
    this.object = object;
};

/**
 * Returns the subject of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The subject of the instance.
 */
Arielworks.Hercules.Rdf.Triple.prototype.getSubject = function() {
    return this.subject;
};

/**
 * Returns the predicate of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The predicate of the instance.
 */

Arielworks.Hercules.Rdf.Triple.prototype.getPredicate = function() {
    return this.predicate;
};

/**
 * Returns the object of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The object of the instance.
 */

Arielworks.Hercules.Rdf.Triple.prototype.getObject = function() {
    return this.object;
};

/**
 * Returns whether the given object is equals to the instance.
 * Triples are considered as same when subject, predicate and object of the triples are equal.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.Triple.prototype.equals = function(to) {
    return (to instanceof this.constructor) && this.subject.equals(to.subject) && this.predicate.equals(to.predicate) && this.object.equals(to.object);
}









Arielworks.Hercules.Rdf.Graph = Arielworks.Util.Class.create();

Arielworks.Hercules.Rdf.Graph.prototype.___constructor = function() {
    this.tripleList = [];
    this.triples = {};
    this.resourceCount = 0;
    this.blankNodeCount = 0;
    this.blankNodes = {};
    this.rdfUriRdfs = {};
    this.plainLiterals = {};
    this.typedLiterals = {};
};


Arielworks.Hercules.Rdf.Graph.prototype.addTriple = function(subject, predicate, object) {
    // reject resources in the other graph
    if (subject.graph != this) throw ""; //TODO
    if (predicate.graph != this) throw ""; //TODO
    if (object.graph != this) throw ""; //TODO

    var sId = subject.resourceId;
    var pId = predicate.resourceId;
    var oId = object.resourceId;
    if (! this.triples[sId]) this.triples[sId] = {};
    if (! this.triples[sId][pId]) this.triples[sId][pId] = {};
    if (! this.triples[sId][pId][oId]) this.triples[sId][pId][oId] = 0;
    if (++this.triples[sId][pId][oId] == 1) {
        this.tripleList.push(new Arielworks.Hercules.Rdf.Triple(subject, predicate, object));
    }

    return this;
};

Arielworks.Hercules.Rdf.Graph.prototype.getRdfUriRef = function(/*string*/ uri) {
    var normalized = Arielworks.Hercules.Rdf.RdfUriRefInGraph.normalize(uri);
    if (! this.rdfUriRdfs[normalized]) this.rdfUriRdfs[normalized] = new Arielworks.Hercules.Rdf.RdfUriRefInGraph(this, this.resourceCount++, uri);
    return this.rdfUriRdfs[normalized];
};

Arielworks.Hercules.Rdf.Graph.prototype.getPlainLiteral = function(/*string*/ value, languageTag) {
    if (! this.plainLiterals[value]) this.plainLiterals[value] = {};
    if (! this.plainLiterals[value][languageTag]) this.plainLiterals[value][languageTag] = new Arielworks.Hercules.Rdf.PlainLiteralInGraph(this, this.resourceCount++, value, languageTag);    
    return this.plainLiterals[value][languageTag];
};

Arielworks.Hercules.Rdf.Graph.prototype.getTypedLiteral = function(/*string*/ value, datatypeIri) {
    if (! this.typedLiterals[value]) this.typedLiterals[value] = {};
    if (! this.typedLiterals[value][datatypeIri]) this.typedLiterals[value][datatypeIri] = new Arielworks.Hercules.Rdf.TypedLiteralInGraph(this, this.resourceCount++, value, datatypeIri);    
    return this.typedLiterals[value][datatypeIri];
};

Arielworks.Hercules.Rdf.Graph.prototype.getBlankNode = function(/*string*/ id) {
    if (! id) {
        return new  Arielworks.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
    } else {
        if (! this.blankNodes[id]) this.blankNodes[id] = new Arielworks.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
        return this.blankNodes[id];
    }
};

Arielworks.Hercules.Rdf.Graph.prototype.clearBlankNodeId = function() {
    this.blankNodes = {};
    return this;
};



/**

 */

Arielworks.Hercules.Rdf.ResourceInGraph = Arielworks.Util.Class.create(function() {
    this.graph;
    this.resourceId;
});

Arielworks.Hercules.Rdf.ResourceInGraph.prototype.___constructor = function(graph, resourceId) {
    this.graph = graph;
    this.resourceId = resourceId;
};

 
Arielworks.Hercules.Rdf.ResourceInSubject = Arielworks.Util.Class.create(function() {
});

Arielworks.Hercules.Rdf.ResourceInSubject.prototype.addProperty = function(predicate, object) {
    this.graph.addTriple(this, predicate, object);
    return this;
};

Arielworks.Hercules.Rdf.ResourceInObject = Arielworks.Util.Class.create(function() {
});

Arielworks.Hercules.Rdf.ResourceInObject.prototype.addReverseProperty = function(predicate, subject) {
    this.graph.addTriple(subject, predicate, this);
    return this;
};




Arielworks.Hercules.Rdf.RdfUriRefInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.RdfUriRef, Arielworks.Hercules.Rdf.ResourceInGraph, Arielworks.Hercules.Rdf.ResourceInObject);

Arielworks.Hercules.Rdf.RdfUriRefInGraph.prototype.___constructor = function(graph, resourceId, uriString) {
    this.___super(uriString);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.PlainLiteralInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.PlainLiteral, Arielworks.Hercules.Rdf.ResourceInGraph);

Arielworks.Hercules.Rdf.PlainLiteralInGraph.prototype.___constructor = function(graph, resourceId, /*string*/ value, /*string*/ languageTag) {
    this.___super(value, languageTag);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.TypedLiteralInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.TypedLiteral, Arielworks.Hercules.Rdf.ResourceInGraph);

Arielworks.Hercules.Rdf.TypedLiteralInGraph.prototype.___constructor = function(graph, resourceId, /*string*/ value, /*string*/ datatypeIri) {
    this.___super(value, datatypeIri);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.BlankNodeInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.BlankNode, Arielworks.Hercules.Rdf.ResourceInGraph, Arielworks.Hercules.Rdf.ResourceInObject);

Arielworks.Hercules.Rdf.BlankNodeInGraph.prototype.___constructor = function(graph, resourceId, id) {
    this.___super(id);
    this.___mixin(0, graph, resourceId);
};
Arielworks.Parser.RecursiveDescentParser.Parser = Class.create();

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.___constructor = function() {
    this.ruleSet;
    this.isCompiled = false;
    this.compiledRules;
    this.whiteSpaceRule = /\s*/m;

    this.initializeRuleSet();
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.addRule = function(name, expression) {
    this.ruleSet[name] = expression;
    this.isCompiled = false;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.initializeRuleSet = function() {
    this.ruleSet = {};
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.setRuleSet = function(ruleSet) {
    this.ruleSet = ruleSet;
    this.isCompiled = false;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.setWhiteSpaceRule = function(regExp) {
    this.whiteSpaceRule = regExp;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.getWhiteSpaceRule = function() {
    return this.whiteSpaceRule;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.parse = function(input, startRule, actions) {
    if (! this.isCompiled) {
        this.compileRuleSet();
    }
    var context = new Arielworks.Parser.RecursiveDescentParser.Context(this, input, actions);
    context.__skipWhiteSpace();
//    try {
        var r = this.compiledRules[startRule].descend(context);
//    } catch (e) {
        //TODO
//        console.log("SYNTAX ERROR:" + context.stack[context.stack.length - 1].name + "\n^" + context.input.substring(context.position));
//    }
    if (context.hasRemaing()) {
        throw startRule;
    }
    

    return r;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.compileRuleSet = function() {
    this.compiledRules = {};
    // craate instances onece to be reffered
    for (var name in this.ruleSet) {
        var syntax = this.__resolveSugar(this.ruleSet[name]);
        if (typeof(syntax) == "string") {
            this.compiledRules[name] = new Arielworks.Parser.RecursiveDescentParser.SequentialExpression();
            this.ruleSet[name] = [syntax];
        } else if (syntax instanceof Object) {
            this.compiledRules[name] = this.__createExpressionInstance(syntax);
        } else {
            throw "SyntaxError"
        }
        this.compiledRules[name].setName(name);
        this.compiledRules[name].setCallee(name);
    }

    for (var name in this.ruleSet) {
        this.__compileSyntax(this.ruleSet[name], this.compiledRules[name]);
    }
    
    this.isCompiled = true;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__compileSyntax = function(syntax, exp) {
    syntax = this.__resolveSugar(syntax);
    if (typeof(syntax) == "string") {
        return this.compiledRules[syntax];
    }

    if (! exp) {
        exp = this.__createExpressionInstance(syntax);
    }
    
    var element;
    if (syntax["Sequential"]) {
        element = new Array();
        for (var i = 0; i < syntax["Sequential"].length; i++) element.push(this.__compileSyntax(syntax["Sequential"][i]));
    } else if (syntax["Or"]) {
        element = new Array();
        for (var i = 0; i < syntax["Or"].length; i++) element.push(this.__compileSyntax(syntax["Or"][i]));
    }
    else if (syntax["OneOrNothing"]) element = this.__compileSyntax(syntax["OneOrNothing"]);
    else if (syntax["ZeroOrMore"]) element = this.__compileSyntax(syntax["ZeroOrMore"]);
    else if (syntax["OneOrMore"]) element = this.__compileSyntax(syntax["OneOrMore"]);
    else if (syntax["TerminalString"]) element = syntax["TerminalString"];
    else if (syntax["TerminalRegExp"]) element = syntax["TerminalRegExp"];
    else throw "SyntaxError";

    
    exp.setElement(element);

    if (syntax["callee"]) exp.setCallee(syntax["callee"]);

    return exp;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__createExpressionInstance = function(syntax) {
    if (syntax["Sequential"]) return new Arielworks.Parser.RecursiveDescentParser.SequentialExpression();
    else if (syntax["Or"]) return new Arielworks.Parser.RecursiveDescentParser.OrExpression();
    else if (syntax["TerminalString"]) return new Arielworks.Parser.RecursiveDescentParser.TerminalString();
    else if (syntax["TerminalRegExp"]) return new Arielworks.Parser.RecursiveDescentParser.TerminalRegExp();
    else if (syntax["OneOrNothing"]) return new Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression();
    else if (syntax["ZeroOrMore"]) return new Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression();
    else if (syntax["OneOrMore"]) return new Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression();
    else throw "SyntaxError";
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__resolveSugar = function (syntax) {
    if (syntax instanceof Array) {
        return {Sequential: syntax};
    } else if (syntax instanceof RegExp) {
        return Arielworks.Parser.RecursiveDescentParser.Parser.$re(syntax);
    } else {
        return syntax;
    }
};


Arielworks.Parser.RecursiveDescentParser.Parser.seq = function() {
    return {Sequential: Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.or = function() {
    return {Or: Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.$ = function() {
    return {TerminalString: arguments[0]}
};

Arielworks.Parser.RecursiveDescentParser.Parser.$re = function() {
    return {TerminalRegExp: arguments[0]}
};

Arielworks.Parser.RecursiveDescentParser.Parser.n = function() {
    return {OneOrNothing: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.z = function() {
    return {ZeroOrMore: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.o = function() {
    return {OneOrMore: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};



Arielworks.Parser.RecursiveDescentParser.Context = Class.create();

Arielworks.Parser.RecursiveDescentParser.Context.prototype.___constructor = function(parser, input, actions) {
    this.parser = parser;
    this.actions = actions;
    this.input = input;
    this.stack = [];
    this.position = 0;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.__skipWhiteSpace = function() {
    var s = this.input.substring(this.position).match(this.parser.getWhiteSpaceRule());
    if (s) this.position += s[0].length;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.matchHead = function(str) {
    return this.input.substring(this.position, this.position + str.length) == str ? str : false;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.matchRegExp = function(regExp) {
    var r = this.input.substring(this.position).match(regExp);
    if (r) {
        return r;
    } else {
        return false;
    }
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.proceed = function(length) {
    var r = this.input.substring(this.position, this.position + length);
    this.position += length;
    this.__skipWhiteSpace();
    return r;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.hasRemaing = function() {
    return this.input.length < this.position;
}



Arielworks.Parser.RecursiveDescentParser.Expression = Class.create();

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.___constructor = function(element, name, callee) {
    this.setElement(element);
    this.setCallee(callee || name);
    this.setName(name);
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setElement = function(element) {
    this.element = element;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setCallee = function(callee) {
    this.callee = callee;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setName = function(name) {
    this.name = name;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.descend = function(context) {
    if (this.name) context.stack.push(this);

    var preR;
    if (context.actions["_" + this.callee]) var preR = (context.actions["_" + this.callee])(context);

    if (context.actions[this.callee]) {
        var r = (context.actions[this.callee])(this.__doDescend(context), context, preR);
    } else {
        var r = this.__doDescend(context);
    }
    if (this.name) context.stack.pop(this);

    return r;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.lookahead = function(context) {
    var x = this.__doLookahead(context);

    return x;
};




Arielworks.Parser.RecursiveDescentParser.SequentialExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.SequentialExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.__doDescend = function(context) {
    var r = new Array(this.element.length);
    for (var i = 0; i < this.element.length; i++) {
        r[i] = this.element[i].descend(context);
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.__doLookahead = function(context) {
    return this.element[0].lookahead(context);
};




Arielworks.Parser.RecursiveDescentParser.OrExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OrExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.__doDescend = function(context) {
    var r = new Array(this.element.length);
    var found = false;
    for (var i = 0; i < this.element.length; i++) {
        if (this.element[i].lookahead(context)) {
            r[i] = this.element[i].descend(context);
            found = true;
            break;
        }
    }
   
    if (found) {
        return r;
    } else {
        throw "Or";
    }
};

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.__doLookahead = function(context) {
    for (var i = 0; i < this.element.length; i++) {
        if (this.element[i].lookahead(context)) {
            return true;
        }
    }
    return false;
};




Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.__doDescend = function(context) {
    var r;
    if (this.element.lookahead(context)) {
        r = this.element.descend(context);
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.__doLookahead = function(context) {
    return true;
};




Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.__doDescend = function(context) {
    var r = [];
    while (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.__doLookahead = function(context) {
    return true;
};




Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.__doDescend = function(context) {
    var r = [];
    // One
    if (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    } else {
        throw "OneOrMore";
    }
    
    // More
    while (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.__doLookahead = function(context) {
    return this.element.lookahead(context);
};




Arielworks.Parser.RecursiveDescentParser.TerminalString = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.TerminalString.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.__doDescend = function(context) {
    var m;
    if (m = context.matchHead(this.element)) {
        r = context.proceed(m.length);
        return r;
    } else {
        throw "TerminalString";
    }
};

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.__doLookahead = function(context) {
    return context.matchHead(this.element);
};




Arielworks.Parser.RecursiveDescentParser.TerminalRegExp = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.__doDescend = function(context) {
    var m;
    if (m = context.matchRegExp(this.element)) {
        context.proceed(m[0].length);
        return m;
    } else {
        throw "TerminalRegExp";
    }
};

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.__doLookahead = function(context) {
    return context.matchRegExp(this.element);
};

Arielworks.Hercules.Serialized.Turtle.Parser = Class.create();
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE = "http://www.w3.org/2001/XMLSchema#";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_INTEGER = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "integer";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DECIMAL = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "decimal";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DOUBLE = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "double";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_BOOLEAN = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "boolean";
/*
Arielworks.Hercules.Serialized.Turtle.serialize = function(graph) {
    for (var i = 0; i < graph.tripleList.length; i++) {
        var currentTriple = graph.tripleList[i]
        
    }
}

Arielworks.Hercules.Serialized.Turtle.serializeTerm = function(term) {
    if (term instanceof Arielworks.Hercules.Rdf.RdfUriRef) {
        return "<" + term.value.replace(">", "\\>") + ">";
    } else if (term instanceof Arielworks.Hercules.Rdf.PlainLiteral) {
        return term.value + (term.languageTag ? ""term.languageTag : "");
    } else if (term instanceof Arielworks.Hercules.Rdf.TypedLiteral) {
        return term.value + (term.languageTag ? term.languageTag : "");
    }
}
*/with(Arielworks.Parser.RecursiveDescentParser.Parser) {
    Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE = /^(?:[\u0020\u0009\u000D\u000A]*|#.*?$)*/m;
    Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE = "turtleDoc";
    Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET = {
        "turtleDoc" : z("statement"),
        "statement" : [or("directive", "triples"), $('.')],
        "directive" : or("prefixID", "base"),
        "prefixID" : [$('@prefix'), n("PREFIX_NAME"), $(':'), "URI_REF"],
        "base" : [$('@base'), "URI_REF"],
        "triples" : ["subject", "predicateObjectList"],
        "predicateObjectList" : ["verb", "objectList", z($(';'), "verb", "objectList"), n($(';'))],
        "objectList" : ["object", z($(','), "object")],
        "verb" : or("predicate", $('a')),
        "subject" : or("resource", "blank"),
        "predicate" : "resource",
        "object" : or("resource", "blank", "literal"),
        "literal" : or(["quotedString", n(or("LANGUAGE_TAG", [$('^^'), "resource"]))], "DOUBLE", "DECIMAL", "INTEGER", "bool"),
        "INTEGER" : /^[-+]?[0-9]+/,
        "DOUBLE" : /^[-+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)[eE][-+]?[0-9]+/,
        "DECIMAL" : /^[-+]?(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "EXPONENT" : /^[eE][-+]?[0-9]+/,
        "bool" : or($('true'), $('false')),
        "blank" : or("NODE_ID", [$('['), or($(']'), ["predicateObjectList", $(']')])], "collection"),
        "itemList" : o("object"),
        "collection" : [$('('), n("itemList"), $(')')],
        "ws" : /^[\u0009\u000A\u000D\u0020]/,
        "resource" : or("URI_REF", "QNAME"),
        "NODE_ID" : /^_:([A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)/,
        "QNAME" : /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)?:([A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)?/,
        "URI_REF" : /^<((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)*)>/,
        "LANGUAGE_TAG" : /^@([a-z]+(?:-[a-z0-9])*)/,
        "NAME_START_CHAR" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        "NAME_CHAR" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]/,
        "NAME" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*/,
        "PREFIX_NAME" : /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*/,
        "RELATIVE_URI" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)*/,
        "quotedString" : or("LONG_STRING", "STRING"),
        "STRING" : /^"((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u0021\u0023-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\")*)"/,
        "LONG_STRING" : /^"""((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF\u0009\u000A\u000D]|\\t|\\n|\\r|\\")*)"""/,
        "CHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF])/,
        "ECHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF]|\\t|\\n|\\r)/,
        "HEX" : /^[\u0030-\u0039\u0041-\u0046]/,
        "UCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)/,
        "SCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u0021\u0023-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\")/,
        "LCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF\t\n\r\u0009\u000A\u000D]|\\")/
    };
}
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0 = Class.create();

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.ECHARACTER_ESCAPE_REGX = /\\([\\tnruU])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g;
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.UCHARACTER_ESCAPE_REGX = /\\([\\tnruU>])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.SCHARACTER_ESCAPE_REGX = /\\([\\tnruU"])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g //"comment to fix color hilighting of the editor

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.___constructor = function(baseUri) {
    this.graph = new Arielworks.Hercules.Rdf.Graph();
    this.nameSpace = {};
    this.defaultNameSpace = "";
    this.baseUri = Arielworks.Hercules.Rdf.RdfUriRef.normalize(baseUri);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__registerNameSpace = function(prefix, uri) {
    if (!prefix || prefix == "") {
        this.defaultNameSpace = uri;
    } else {
        this.nameSpace[prefix] = uri;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__resolvePrefiexName = function(prefix, local) {
    if (!prefix || prefix == "") {
        return this.defaultNameSpace + local;
    } else {
        return this.nameSpace[prefix] + local;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__resolveRelativeIri = function(uri) {
    return Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef(this.baseUri, uri);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__unescapeEcharacterCallback  = function(whole, e, hexs) {
    switch (e) {
      case "u" :
        return String.fromCharCode(parseInt(hexs, 16));
      case "U" :
        return String.fromCharCode(parseInt(hexs, 16));
      case "t" :
        return String.fromCharCode(0x0009);
      case "n" :
        return String.fromCharCode(0x000A);
      case "r" :
        return String.fromCharCode(0x000D);
      case "\"" :
        return String.fromCharCode(0x0022);
      case ">" :
        return String.fromCharCode(0x003E);
      case "\\" :
        return String.fromCharCode(0x005E);
      }
};

// 4
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.prefixID = function(r) {
    this.__registerNameSpace(r[1], r[3]);
};

// 5
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.base = function(r) {
    this.baseUri = r[1];
};

// 6
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.triples = function(r) {
    for (var i = 0; i < r[1].length; i += 2) {
        for (var j = 0; j < r[1][i + 1].length; j++) {
            this.graph.addTriple(r[0], r[1][i], r[1][i + 1][j]);
        }
    }
};

// 7 returns array like [prefidacte, [object, object, ...], predicate, [object, ...], ...]
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.predicateObjectList = function(r) {
    var o = [r[0], r[1]];
    for (var i = 0; i < r[2].length; i++) {
        o.push(r[2][i][1]);
        o.push(r[2][i][2]);
    }
    return o;
};

// 8 returns array of object resource
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.objectList = function(r) {
    var o = [r[0]];
    for (var i = 0; i < r[1].length; i++) {
        o.push(r[1][i][1]);
    }
    return o;
};

// 9 
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.verb = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_TYPE);
};

// 11 retuns Arielworks.Hercules.Rdf.Resource
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.subject = function(r) {
    if(r[0]) return r[0]
    else if (r[1]) return r[1];
};

// 12 returns Arielworks.Hercules.Rdf.Resource
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.predicate = function(r) {
    return r[0];
};

// 13 returns Arielworks.Hercules.Rdf.Resource
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.object = function(r) {
    if(r[0]) return r[0];
    else if (r[1]) return r[1];
    else if (r[2]) return r[2];
};

// 14 returns Arielworks.Hercules.Rdf.Literal
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.literal = function(r) {
    if (r[0]) {
        if (r[0][1]) {
            if(r[0][1][0]) {
                var o = this.graph.getPlainLiteral(r[0][0], r[0][1][0]);
            } else if (r[0][1][1]) {
                var o = this.graph.getTypedLiteral(r[0][0], r[0][1][1][1].getValue());
            }
        } else {
            var o = this.graph.getPlainLiteral(r[0][0]);
        }
    } else if (r[1]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DOUBLE);
    } else if (r[2]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DECIMAL);
    } else if (r[3]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_INTEGER);
    } else if (r[4]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_BOOLEAN);
    }
    return o;
};

// 16 returns string value
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.INTEGER = function(r) {
    return r[0];
};

// 17 returns string value
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.DOUBLE = function(r) {
    return r[0];
};

// 18 returns string value
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.DECIMAL = function(r) {
    return r[0];
};

// 20 returns string value
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.bool = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

// 21
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.blank = function(r) {
    if (r[0]) {
        return this.graph.getBlankNode(r[0]);
    } else if (r[1]) {
        if (r[1][1][0]) {
            return this.graph.getBlankNode();
        } else if (r[1][1][1]) {
            var o = this.graph.getBlankNode();
            for (var i = 0; i < r[1][1][1][0].length; i += 2) {
                for (var j = 0; j < r[1][1][1][0][i + 1].length; j++) {
                    this.graph.addTriple(o, r[1][1][1][0][i], r[1][1][1][0][i + 1][j]);
                }
            }
            return o;
        }
    } else if (r[2]) {
        var o = this.graph.getBlankNode();
        var subject = o;
        for (var i = 0; i < r[2].length; i++) {
            this.graph.addTriple(subject, this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_FIRST), r[2][i]);
            if (i < (r[2].length - 1)) {
                var object = this.graph.getBlankNode();
            } else {
                var object = this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_NIL);
            }
            this.graph.addTriple(subject, this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_REST), object);
            subject = object;
        }
        return o;
    }
};

// 22
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.itemList = function(r) {
    return r;
};

// 23 returns array , [object, object, ...]
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.collection = function(r) {
    if (r[1]) {
        return r[1];
    } else {
        return [];
    }
};

// 25 return Arielworks.Hercules.Rdf.IrI;
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.resource = function(r) {
    if (r[0]) {
        return this.graph.getRdfUriRef(this.__resolveRelativeIri(r[0]));
    } else if(r[1]) {
        return this.graph.getRdfUriRef(this.__resolvePrefiexName(r[1]["prefix"], r[1]["local"]));
    }
}


// 26 returns string name of blank node
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.NODE_ID = function(r) {
    return r[1];
};

// 27 returns hash {prefix, local}
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.QNAME = function(r) {
    return {"prefix" : r[1], "local" : r[2]};
};

// 28 returns string like "http://www.example.com/"
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.URI_REF = function(r) {
    return r[1].replace(this.constructor.UCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};

// 29 returns string language tag
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.LANGUAGE_TAG = function(r) {
    return r[1];
};

// 33 returns string prefix name
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.PREFIX_NAME = function(r) {
    return r[0];
};

// 35 returns string
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.quotedString = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

// 36 retuns string, the content of the "string"
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.STRING = function(r) {
    return r[1].replace(this.constructor.SCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};

// 37 retuns string, the content of the "string" listeral
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.LONG_STRING = function(r) {
    return r[1].replace(this.constructor.SCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};
Arielworks.Hercules.Sparql.ResultSet = Class.create();

Arielworks.Hercules.Sparql.ResultSet.prototype.___constructor = function(variableList) {
    this.variableList = variableList || [];
    this.length = 0;
};

/**
 * Returns an array of the variable names in the result set.
 * @return Array<string>
 */
Arielworks.Hercules.Sparql.ResultSet.prototype.getVariableList = function() {
    return this.variableList;
};

Arielworks.Hercules.Sparql.ResultSet.prototype.push = function(result) {
    this[this.length++] = result;
};



Arielworks.Hercules.Sparql.Variable = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);
Arielworks.Hercules.Sparql.Variable.prototype.___constructor =  function(/*string*/ value) {
    this.___super(value);
};

Arielworks.Hercules.Sparql.Variable.prototype.toTableName = function() {
    return this.value;
};

Arielworks.Hercules.Sparql.BlankNode = Arielworks.Util.Class.extend(Arielworks.Hercules.Sparql.Variable);
Arielworks.Hercules.Sparql.BlankNode.prototype.___constructor =  function(/*string*/ value) {
    this.___super(value);
};

Arielworks.Hercules.Sparql.BlankNode.prototype.toTableName = function() {
    return "[" + this.value + "]";
};

Arielworks.Hercules.Sparql.VariableBindingTable = Class.create();

/**
 * TODO: Temporary class
 */
Arielworks.Hercules.Sparql.VariableBindingTable.prototype.___constructor = function(cloneOriginal) {
    this.table = {};
    
    // clone
    // TODO : delete loop
    if (cloneOriginal) for (var name in cloneOriginal.table) if (cloneOriginal.table.hasOwnProperty(name)) {
        this.table[name] = cloneOriginal.table[name];
    }
};

Arielworks.Hercules.Sparql.VariableBindingTable.prototype.bindAndClone = function(variables) {
    var cloned = new Arielworks.Hercules.Sparql.VariableBindingTable(this);
    for (var i = 0; i < variables.length; i += 2) {
        var key = variables[i].toTableName();
        var value = variables[i + 1];
        if (cloned.table[key] && ! cloned.table[key].equals(value)) {
            return false;
        } else {
            cloned.table[key] = value;
        }
    }
    return cloned;
};



Arielworks.Hercules.Sparql.MatchingResult = Class.create();

Arielworks.Hercules.Sparql.MatchingResult.prototype.___constructor = function(pattern) {
    this.pattern = pattern;
};


Arielworks.Hercules.Sparql.TripleMatchingResult = Class.extend(Arielworks.Hercules.Sparql.MatchingResult);

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.TripleMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
    this.isSubjectVariable = this.pattern.subject instanceof Arielworks.Hercules.Sparql.Variable;
    this.isPredicateVariable = this.pattern.predicate instanceof Arielworks.Hercules.Sparql.Variable;
    this.isObjectVariable = this.pattern.object instanceof Arielworks.Hercules.Sparql.Variable;
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.add = function(triple) {
    this.resultList.push(triple);
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.bindVariableRecursive = function(matchingResultListStack, depth, position, currentVariableTable, resultVariableTableList) {
    // This method may be called many times.
    // Be careful its peformance.
    var pattern = this.pattern;
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var nextMatchingResult = matchingResultListStack[depth][position + 1];
    var isSubjectVariable = this.isSubjectVariable;
    var isPredicateVariable = this.isPredicateVariable;
    var isObjectVariable = this.isObjectVariable;

    for (var i = 0; i <resultListLength; i++) {
        var currentResult = resultList[i]
        var variabiles = [];

        if (isSubjectVariable) {
            variabiles.push(pattern.subject);
            variabiles.push(currentResult.subject);
        }
        if (isPredicateVariable) {
            variabiles.push(pattern.predicate);
            variabiles.push(currentResult.predicate);
        }
        if (isObjectVariable) {
            variabiles.push(pattern.object);
            variabiles.push(currentResult.object);
        }

        var newTable  = currentVariableTable.bindAndClone(variabiles);
        if (newTable != false) {
            if (nextMatchingResult) {
                nextMatchingResult.bindVariableRecursive(matchingResultList, position + 1, newTable, resultVariableTableList);
            } else {
                resultListener.report(newTable);
            }
        }
    }
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var pattern = this.pattern;
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var isSubjectVariable = this.isSubjectVariable;
    var isPredicateVariable = this.isPredicateVariable;
    var isObjectVariable = this.isObjectVariable;

    var currentVariableTableListLength = currentVariableTableList.length;
    var resultVariableTableList = [];

    for (var i = 0; i <resultListLength; i++) {
        // This loop may be called many times.
        // Be careful its peformance.
        var currentResult = resultList[i];
        var variabiles = [];

        if (isSubjectVariable) {
            variabiles.push(pattern.subject);
            variabiles.push(currentResult.subject);
        }
        if (isPredicateVariable) {
            variabiles.push(pattern.predicate);
            variabiles.push(currentResult.predicate);
        }
        if (isObjectVariable) {
            variabiles.push(pattern.object);
            variabiles.push(currentResult.object);
        }

        for (var j = 0; j < currentVariableTableListLength; j++) {
            var newTable = currentVariableTableList[j].bindAndClone(variabiles);
            if (newTable != false) resultVariableTableList.push(newTable);
        }
    }

    return resultVariableTableList;
};


Arielworks.Hercules.Sparql.GraphMatchingResult = Class.extend(Arielworks.Hercules.Sparql.MatchingResult);

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.GraphMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.add = function(matchingResult) {
    this.resultList.push(matchingResult);
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.bindVariableRecursive = function(matchingResultList, position, currentVariableTable, resultListener) {
    // This method may be called many times.
    // Be careful its peformance.
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var clonedTable = new Arielworks.Hercules.Sparql.VariableBindingTable(currentVariableTable);
    this.resultList[0].bindVariableRecursive(this.resultList, position, clonedTable, this);
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    for (var i = 0; i< resultListLength; i++) {
        currentVariableTableList = resultList[i].bindVariableAllOpations(currentVariableTableList);
    }
    return currentVariableTableList;
};


Arielworks.Hercules.Sparql.UnionMatchingResult = Class.extend(Arielworks.Hercules.Sparql.MatchingResult);
Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.GraphMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
};

Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.add = function(matchingResult) {
    this.resultList.push(matchingResult);
};

Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    
    var currentVariableTableListLength = currentVariableTableList.length
    var resultVariableTableList = [];
    for (var i = 0; i < resultListLength; i++) {
        resultVariableTableList = resultVariableTableList.concat(resultList[i].bindVariableAllOpations(currentVariableTableList));
    }
    return resultVariableTableList;
};





Arielworks.Hercules.Sparql.Pattern = Class.create();
Arielworks.Hercules.Sparql.Pattern.prototype.___constructor = function() {
};

Arielworks.Hercules.Sparql.TriplePattern = Class.extend(Arielworks.Hercules.Sparql.Pattern);
Arielworks.Hercules.Sparql.TriplePattern.prototype.___constructor = function(subject, predicate, object) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.variableCount = 0;

    if (this.subject instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
    if (this.predicate instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
    if (this.object instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
};

Arielworks.Hercules.Sparql.TriplePattern.prototype.match = function(targetGraph) {
    var result = new Arielworks.Hercules.Sparql.TripleMatchingResult(this);

    // When targetGraph is big, the code in the following loop will called so many times.
    // Be careful its paformance.
    var targetGraphLength = targetGraph.length;
    var subject = this.subject;
    var predicate = this.predicate;
    var object = this.object;
    var isNotSubjectVariable = ! (subject instanceof Arielworks.Hercules.Sparql.Variable);
    var isNotPredicateVariable = ! (predicate instanceof Arielworks.Hercules.Sparql.Variable);
    var isNotObjectVariable = ! (object instanceof Arielworks.Hercules.Sparql.Variable);
    for (var i = 0;  i < targetGraphLength; i++) {
        // do not split to a function, for parformance
        var targetTriple = targetGraph[i];
        if (isNotSubjectVariable && ! subject.equals(targetTriple.subject)) continue;
        if (isNotPredicateVariable && ! predicate.equals(targetTriple.predicate)) continue;
        if (isNotObjectVariable && ! object.equals(targetTriple.object)) continue;
        result.add(targetTriple);
    }

    return result;
};



Arielworks.Hercules.Sparql.GraphPattern = Class.extend(Arielworks.Hercules.Sparql.Pattern);

Arielworks.Hercules.Sparql.GraphPattern.prototype.___constructor = function() {
    this.patternList = [];
};

Arielworks.Hercules.Sparql.GraphPattern.prototype.addPattern = function(/*Arielworks.Hercules.Sparql.Pattern*/ pattern) {
    this.patternList.push(pattern);
};

Arielworks.Hercules.Sparql.GraphPattern.prototype.match = function(targetGraph) {
    var matchingResult = new Arielworks.Hercules.Sparql.GraphMatchingResult(this);
    for (var i = 0; i < this.patternList.length; i++) {
        matchingResult.add(this.patternList[i].match(targetGraph));
    }
    return matchingResult;
};


Arielworks.Hercules.Sparql.UnionPattern = Class.extend(Arielworks.Hercules.Sparql.Pattern);
Arielworks.Hercules.Sparql.UnionPattern.prototype.___constructor = function() {
    this.patternList = [];
};

Arielworks.Hercules.Sparql.UnionPattern.prototype.addPattern = function(/*Arielworks.Hercules.Sparql.GraphPattern*/ pattern) {
    this.patternList.push(pattern);
};

Arielworks.Hercules.Sparql.UnionPattern.prototype.match = function(targetGraph) {
    var matchingResult = new Arielworks.Hercules.Sparql.UnionMatchingResult(this);
    for (var i = 0; i < this.patternList.length; i++) {
        matchingResult.add(this.patternList[i].match(targetGraph));
    }
    return matchingResult;
};



Arielworks.Hercules.Sparql.Engine = Class.create();

Arielworks.Hercules.Sparql.Engine.prototype.___constructor = function(graph) {
    this.graph = graph;
    this.parser;
};

Arielworks.Hercules.Sparql.Engine.prototype.prepare = function(queryString) {
    if (! this.parser) {
        this.parser = new Arielworks.Parser.RecursiveDescentParser.Parser();
        this.parser.setRuleSet(Arielworks.Hercules.Sparql.Engine.RULE_SET);
        this.parser.setWhiteSpaceRule(Arielworks.Hercules.Sparql.Engine.WHITE_SPACE_RULE);
        this.parser.compileRuleSet();
    };

    var action = new Arielworks.Hercules.Sparql.SparqlAction_1_0(this);
    var query = this.parser.parse(queryString, Arielworks.Hercules.Sparql.Engine.START_RULE, action);
    return query;
};

Arielworks.Hercules.Sparql.Engine.prototype.getTriplePattern = function(subject, predicate, object) {
    // TODO cacheing
    return new Arielworks.Hercules.Sparql.TriplePattern(subject, predicate, object);
};


Arielworks.Hercules.Sparql.Query = Class.create();

Arielworks.Hercules.Sparql.Query.prototype.___constructor = function(engine) {
    this.engine = engine;
    this.namespaceList = {};
};



Arielworks.Hercules.Sparql.Query.prototype.getTriplePattern = function(subject, predicate, object) {
    return this.engine.getTriplePattern(subject, predicate, object);
};

Arielworks.Hercules.Sparql.Query.prototype.getRdfUriRef = function(/*string*/ uri) {
    return new Arielworks.Hercules.Rdf.RdfUriRef(uri);
};

Arielworks.Hercules.Sparql.Query.prototype.getPlainLiteral = function(/*string*/ value, languageTag) {
    return new Arielworks.Hercules.Rdf.PlainLiteral(value, languageTag);
};

Arielworks.Hercules.Sparql.Query.prototype.getTypedLiteral = function(/*string*/ value, datatypeIri) {
    return new Arielworks.Hercules.Rdf.TypedLiteral(value, datatypeIri);
};

Arielworks.Hercules.Sparql.Query.prototype.getBlankNode = function(/*string*/ id) {
    return new Arielworks.Hercules.Sparql.BlankNode(id);
};

Arielworks.Hercules.Sparql.Query.prototype.getVariable = function(name) {
    if (! this.variableHash[name]) {
        this.variableHash[name] = new Arielworks.Hercules.Sparql.Variable(name);
        this.variableList.push(name);
    }
    return this.variableHash[name];
};



Arielworks.Hercules.Sparql.SelectQuery = Class.extend(Arielworks.Hercules.Sparql.Query);

Arielworks.Hercules.Sparql.SelectQuery.prototype.___constructor = function() {
    Arielworks.Hercules.Sparql.SparqlQuery.___super.prototype.___constructor.apply(this, arguments);
    this.duplicateSolution = "DEFAULT";
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.___constructor = function() {
    Arielworks.Hercules.Sparql.SelectQuery.___super.prototype.___constructor.apply(this, arguments);
    // for holding Arielworks.Hercules.Sparql.Variable instance
    this.variableHash = {};
    // for holding only variable name, to itterate
    this.variableList = [];
    this.isAllVariableSelected = false;
    this.resultVariableList = [];
    this.rootPattern;
};


Arielworks.Hercules.Sparql.SelectQuery.prototype.registerResultVariable = function(variableName) {
    this.resultVariableList.push(variableName);
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setIsAllVariableSelected = function(isAllVariableSelected) {
    this.isAllVariableSelected = isAllVariableSelected;
}

Arielworks.Hercules.Sparql.SelectQuery.prototype.addTriplePattern = function(pattern) {
    this.rootPattern.addTriplePattern(pattern);
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setDuplicateSolution = function(name) {
    this.duplicateSolution = name;
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setRootPattern = function(pattern) {
    this.rootPattern = pattern;
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.execute = function() {


    // matching once
    var matchingResult = this.rootPattern.match(this.engine.graph);

    
/*
    // sort for optimizetion
    matchingResultList.sort(function(a, b) {
        if (a.resultList.getLength() > b.resultList.getLength()) {
            return true;
        } else if (a.resultList.getLength() == b.resultList.getLength()) {
            if (a instanceof Arielworks.Hercules.Sparql.Variable) return true;
            else if (b instanceof Arielworks.Hercules.Sparql.Variable) return false;
            else if (a.pattern.variableCount > b.pattern.variableCount) return true;
        } else {
            return false;
        }
    });
*/
    // create ResultSet
    var variableBindingTableList = matchingResult.bindVariableAllOpations([new Arielworks.Hercules.Sparql.VariableBindingTable()]);

    var variableBindingTableListLength = variableBindingTableList.length;
    var resultVariableList = this.isAllVariableSelected ? this.variableList : this.resultVariableList;
    var resultVariableListLength = resultVariableList.length;
    var resultSet = new Arielworks.Hercules.Sparql.ResultSet(resultVariableList);
    for (var i = 0; i < variableBindingTableListLength; i++) {
        var result = {};
        var currentVariableBindingTable = variableBindingTableList[i].table;
        for (var j = 0; j < resultVariableListLength; j++) {
            result[resultVariableList[j]] = currentVariableBindingTable[resultVariableList[j]];
        }
        resultSet.push(result);
    }



    return resultSet;
};
with(Arielworks.Parser.RecursiveDescentParser.Parser) {
    Arielworks.Hercules.Sparql.Engine.WHITE_SPACE_RULE = /^([\u0020\u0009\u000D\u000A]*|#.*?$)*/m;
    Arielworks.Hercules.Sparql.Engine.START_RULE = "Query";
    Arielworks.Hercules.Sparql.Engine.RULE_SET = {
        "Query": ["Prologue", or("SelectQuery", "ConstructQuery", "DescribeQuery", "AskQuery")],
        "Prologue": [n("BaseDecl"), z("PrefixDecl")],
        "BaseDecl": [$('BASE'), "IRI_REF"],
        "PrefixDecl": [$('PREFIX'), "PNAME_NS", "IRI_REF"],
        "SelectQuery": [$('SELECT'), n(or($('DISTINCT'), $('REDUCED'))), or(o("Var"), $('*')), z("DatasetClause"), "WhereClause", "SolutionModifier"],
        "ConstructQuery": [$('CONSTRUCT'), "ConstructTemplate", z("DatasetClause"), "WhereClause", "SolutionModifier"],
        "DescribeQuery": [$('DESCRIBE'), or(o("VarOrIRIref"), $('*')), z("DatasetClause"), n("WhereClause"), "SolutionModifier"],
        "AskQuery": [$('ASK'), z("DatasetClause"), "WhereClause"],
        "DatasetClause": [$('FROM'), or("DefaultGraphClause", "NamedGraphClause")],
        "DefaultGraphClause": "SourceSelector",
        "NamedGraphClause": [$('NAMED'), "SourceSelector"],
        "SourceSelector": "IRIref",
        "WhereClause": [n($('WHERE')), "GroupGraphPattern"],
        "SolutionModifier": [n("OrderClause"), n("LimitOffsetClauses")],
        "LimitOffsetClauses": or(["LimitClause", n("OffsetClause")],["OffsetClause", n("LimitClause")]),
        "OrderClause": [$('ORDER'), $('BY'), o("OrderCondition")],
        "OrderCondition": or([or($('ASC'), $('DESC')), "BrackettedExpression"], or("Constraint", "Var")),
        "LimitClause": [$('LIMIT'), "INTEGER"],
        "OffsetClause": [$('OFFSET'), "INTEGER"],
        "GroupGraphPattern": [$('{'), n("TriplesBlock"), z(or( "GraphPatternNotTriples", "Filter"), n($('.')), n("TriplesBlock")), $('}')],
        "TriplesBlock": ["TriplesSameSubject", n($('.'), n("TriplesBlock"))],
        "GraphPatternNotTriples": or("OptionalGraphPattern", "GroupOrUnionGraphPattern", "GraphGraphPattern"),
        "OptionalGraphPattern": [$('OPTIONAL'), "GroupGraphPattern"],
        "GraphGraphPattern": [$('GRAPH'), "VarOrIRIref", "GroupGraphPattern"],
        "GroupOrUnionGraphPattern": ["GroupGraphPattern", z($('UNION'), "GroupGraphPattern")],
        "Filter": [$('FILTER'), "Constraint"],
        "Constraint": or("BrackettedExpression", "BuiltInCall", "FunctionCall"),
        "FunctionCall": ["IRIref", "ArgList"],
        "ArgList": or("NIL", [$('('), "Expression", z($(','), "Expression"), $(')')]),
        "ConstructTemplate": [$('{'), n("ConstructTriples"), $('}')],
        "ConstructTriples": ["TriplesSameSubject", n($('.'), n("ConstructTriples"))],
        "TriplesSameSubject": or(["VarOrTerm", "PropertyListNotEmpty"],["TriplesNode", "PropertyList"]),
        "PropertyListNotEmpty": ["Verb", "ObjectList", z($(';'), n("Verb", "ObjectList"))],
        "PropertyList": n("PropertyListNotEmpty"),
        "ObjectList": ["Object", z($(','), "Object")],
        "Object": "GraphNode",
        "Verb": or("VarOrIRIref", $('a')),
        "TriplesNode": or("Collection", "BlankNodePropertyList"),
        "BlankNodePropertyList": [$('['), "PropertyListNotEmpty", $(']')],
        "Collection": [$('('), o("GraphNode"), $(')')],
        "GraphNode": or("VarOrTerm", "TriplesNode"),
        "VarOrTerm": or("Var", "GraphTerm"),
        "VarOrIRIref": or("Var", "IRIref"),
        "Var": or("VAR1", "VAR2"),
        "GraphTerm": or("IRIref", "RDFLiteral", "NumericLiteral", "BooleanLiteral", "BlankNode", "NIL"),
        "Expression": "ConditionalOrExpression",
        "ConditionalOrExpression": ["ConditionalAndExpression", z($('||'), "ConditionalAndExpression")],
        "ConditionalAndExpression": ["ValueLogical", z($('&&'), "ValueLogical" )],
        "ValueLogical": "RelationalExpression",
        "RelationalExpression": ["NumericExpression", n(or([$('='), "NumericExpression"], [$('!='), "NumericExpression"], [$('<'), "NumericExpression"], [$('>'), "NumericExpression"], [$('<='), "NumericExpression"], [$('>='), "NumericExpression" ]))],
        "NumericExpression": "AdditiveExpression",
        "AdditiveExpression": ["MultiplicativeExpression", z(or([$('+'), "MultiplicativeExpression"], [$('-'), "MultiplicativeExpression"], "NumericLiteralPositive", "NumericLiteralNegative"))],
        "MultiplicativeExpression": ["UnaryExpression", z(or([$('*'), "UnaryExpression"], [$('/'), "UnaryExpression"]))],
        "UnaryExpression": or([$('!'), "PrimaryExpression"], [$('+'), "PrimaryExpression"], [$('-'), "PrimaryExpression"], "PrimaryExpression"),
        "PrimaryExpression": or("BrackettedExpression", "BuiltInCall", "IRIrefOrFunction", "RDFLiteral", "NumericLiteral", "BooleanLiteral", "Var"),
        "BrackettedExpression": [$('('), "Expression", $(')')],
        "BuiltInCall": or([$('STR'), $('('), "Expression", $(')')], [$('LANG'), $('('), "Expression", $(')')], [$('LANGMATCHES'), $('('), "Expression", $(','), "Expression", $(')')], [$('DATATYPE'), $('('), "Expression", $(')')], [$('BOUND'), $('('), "Var", $(')')], [$('sameTerm'), $('('), "Expression", $(','), "Expression", $(')')], [$('isIRI'), $('('), "Expression", $(')')], [$('isURI'), $('('), "Expression", $(')')], [$('isBLANK'), $('('), "Expression", $(')')], [$('isLITERAL'), $('('), "Expression", $(')')], "RegexExpression"),
        "RegexExpression": [$('REGEX'), $('('), "Expression", $(','), "Expression", n($(','), "Expression"), $(')')],
        "IRIrefOrFunction": ["IRIref", n("ArgList")],
        "RDFLiteral": ["String", n(or("LANGTAG", [$('^^'), "IRIref"]))],
        "NumericLiteral": or("NumericLiteralUnsigned", "NumericLiteralPositive", "NumericLiteralNegative"),
        "NumericLiteralUnsigned": or("DOUBLE", "DECIMAL", "INTEGER"),
        "NumericLiteralPositive": or("DOUBLE_POSITIVE", "DECIMAL_POSITIVE", "INTEGER_POSITIVE"),
        "NumericLiteralNegative": or("DOUBLE_NEGATIVE", "DECIMAL_NEGATIVE", "INTEGER_NEGATIVE"),
        "BooleanLiteral": or($('true'), $('false')),
        "String": or("STRING_LITERAL_LONG1", "STRING_LITERAL_LONG2", "STRING_LITERAL1", "STRING_LITERAL2"),
        "IRIref": or("IRI_REF", "PrefixedName"),
        "PrefixedName": or("PNAME_LN", "PNAME_NS"),
        "BlankNode": or("BLANK_NODE_LABEL", "ANON"),
        "IRI_REF": /^<((?:[^<>"{}|^`\\\u0000-\u0020-])*)>/,
        "PNAME_NS": /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)?:/,
        "PNAME_LN": /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)/,
        "BLANK_NODE_LABEL": /^_:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)/,
        "VAR1": /^\?([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*)/,
        "VAR2": /^\$([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*)/,
        "LANGTAG": /^@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*)/,
        "INTEGER": /^[0-9]+/,
        "DECIMAL": /^(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE": /^(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "INTEGER_POSITIVE": /^\+(?:[0-9]+)/,
        "DECIMAL_POSITIVE": /^\+(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE_POSITIVE":  /^\+(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "INTEGER_NEGATIVE": /^-[0-9]+/,
        "DECIMAL_NEGATIVE": /^-(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE_NEGATIVE": /^-(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "EXPONENT": /^[eE][+-]?[0-9]+/,
        "STRING_LITERAL1": /^'((?:[^\u0027\u005C\u000A\u000D]|\\[tbnrf\\"'])*)'/,
        "STRING_LITERAL2": /^"((?:[^\u0022\u005C\u000A\u000D]|\\[tbnrf\\"'])*)"/,
        "STRING_LITERAL_LONG1": /^'''((?:(?:'|'')?(?:[^'\\]|\\[tbnrf\\"']))*)'''/,
        "STRING_LITERAL_LONG2": /^"""((?:(?:"|"")?(?:[^"\\]|\\[tbnrf\\"']))*)"""/,
        "ECHAR":  /^\\[tbnrf\\"']/,
        "NIL": /^\([\u0020\u0009\u000D\u000A]*\)/,
        "WS": /^[\u0020\u0009\u000D\u000A]/,
        "ANON": /^\[[\u0020\u0009\u000D\u000A]*\]/,
        "PN_CHARS_BASE": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        "PN_CHARS_U": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_]/,
        "VARNAME": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*/,
        "PN_CHARS": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040=]/,
        "PN_PREFIX": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?/,
        "PN_LOCAL": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?/
    };
}
Arielworks.Hercules.Sparql.SparqlAction_1_0 = Class.create();

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.___constructor = function(engine) {
    this.engine = engine;
    this.query;
    this.graphStack = [];
    this.namespaceList = {};
    this.baseIri;
    this.blankNodes = {};
    this.blankNodeCount = 0;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__registerNamespace = function(prefix, uri) {
    this.namespaceList[prefix] = uri;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__resolvePrefiexName = function(prefix, local) {
    if (! this.namespaceList[prefix]) throw "Prefix " + prefix + " is not decreared.";
    return this.namespaceList[prefix] + local;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__setBaseIri = function(uri) {
    this.baseIri = uri;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__resolveIriRef = function(iri) {
    return Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef(this.baseIri, iri);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__getBlankNode = function(name) {
    if (! name || name == "") return this.query.getBlankNode(this.blankNodeCount++);
    if (! this.blankNodes[name]) this.blankNodes[name] = this.query.getBlankNode(this.blankNodeCount++);
    return this.blankNodes[name];
};

// 1 returns Arielworks.Hercules.Sparql.Query; pass through
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Query = function(r) {
    for (var i = 0; i < r[1].length; i++) if (r[1][i]) return r[1][i];
}

// 3
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BaseDecl = function(r) {
    this.__setBaseIri(r[1][1]);
};

// 4
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PrefixDecl = function(r) {
    this.__registerNamespace(r[1][1], r[2][1]);
};

// 5 returns Arielworks.Hercules.Sparql.Query
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype._SelectQuery = function(r) {
    this.query = new Arielworks.Hercules.Sparql.SelectQuery(this.engine);
};
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.SelectQuery = function(r) {
    if (r[1]) {
        if (r[1][0]) this.query.setDuplicateSolution(r[1][0]);
        else if (r[1][1]) this.query.setDuplicateSolution(r[1][1]);
    }
    if (r[2][1]) {
        this.query.setIsAllVariableSelected(true);
    } else {
        for (var i = 0; i < r[2][0].length; i++) {
            this.query.registerResultVariable(r[2][0][i]);
        }
    }
    
    if (r[3]) {
        // not supported; exception will be thrown
    }
    
    this.query.setRootPattern(r[4]);
    
    return this.query;
};

// 9
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.DatasetClause = function(r) {
    throw "Dataset is NOT supported.";
};

// 13: returns Arielworks.Hercules.Sparql.GraphPattern(); pass through
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.WhereClause = function (r) {
    return r[1];
};

// 20: returns Arielworks.Hercules.Sparql.GraphPattern(); containing Arielworks.Hercules.Sparql.TriplePattern
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype._GroupGraphPattern = function(r) {
    this.graphStack.unshift(new Arielworks.Hercules.Sparql.GraphPattern());
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GroupGraphPattern = function(r) {
    var o = this.graphStack[0];
    if (r[1]) {
        for (var i = 0; i < r[1].length; i++) o.addPattern(r[1][i]);
    }

    for (var i = 0; i < r[2].length; i++) {
        if (r[2][i][0][0]) {
            o.addPattern(r[2][i][0][0]);
        } else if (r[2][i][0][1]) {
            throw "NOT IMPLEMENTED YET"; //TODO
        }
        if (r[2][i][2]) {
            for (var j = 0; j < r[2][i][2].length; j++) o.addPattern(r[2][i][2][j]);
        }
    }
    this.graphStack.shift();
    return o;
};

// 21: returns array of Arielworks.Hercules.Sparql.TriplePattern; flatten
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesBlock = function(r) {
    // extract recursion
    var o = [];
    for (var i = 0; i < r[0].length; i++) o.push(r[0][i]);
    if (r[1] && r[1][1]) {
        for (var i = 0; i < r[1][1].length; i++) o.push(r[1][1][i]);
    }
    return o; 
};

// 22: returns Arielworks.Hercules.Sparql.GraphPattern or Arielworks.Hercules.Sparql.UnionPattern; pass through
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphPatternNotTriples = function(r) {
    if (r[0]) {
        // TODO
    } else if (r[1]) {
        return r[1];
    } else if (r[2]) {
        throw "GRAPH pattern is not supported";
    }

};

// 25: returns Arielworks.Hercules.Sparql.GraphPattern or Arielworks.Hercules.Sparql.UnionPattern
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GroupOrUnionGraphPattern = function(r) {

    var patternList = [r[0]];
    for (var i = 0; i < r[1].length; i++) patternList.push(r[1][i][1]);

    if (patternList.length > 1) {
        var union = new Arielworks.Hercules.Sparql.UnionPattern();
        for (var i = 0; i < patternList.length; i++) {
            union.addPattern(patternList[i]);
        }
        return union;
    } else {
        return patternList[0];
    }
};

// 32: returns array of Arielworks.Hercules.Sparql.TriplePatten
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesSameSubject = function(r) {
    if (r[0]) {
        var o = [];
        for (var i = 0; i < r[0][1].length; i++) {
            for (var j = 0; j < r[0][1][i][1].length; j++) {
                o.push(this.query.getTriplePattern(r[0][0], r[0][1][i][0], r[0][1][i][1][j]));
            }
        }
        return o;
    } else if (r[1]) {
        var o  = [];
        for (var i = 0; i < r[1][1].length; i++) {
            for (var j = 0; j < r[1][1][i][1].length; j++) {
                o.push(this.query.getTriplePattern(r[1][0], r[1][1][i][0], r[1][1][i][1][j]));
            }
        }
        return o;
    }
};

// 33: returns [[predicate, [object, ...]], ...] ; type is Arielworks.Hercules.Sparql.Resource
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PropertyListNotEmpty = function(r) {
    var o = [];
    o.push([r[0], r[1]]);
    for (var i = 0; i < r[2].length; i++) {
        if(r[2][i][1]) o.push([r[2][i][1][0], r[2][i][1][1]]);
    }
    return o;
};

// 34
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PropertyList = function(r) {
    return r;
};

// 35: returns [Arielworks.Hercules.Sparql.Resource, ...]
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.ObjectList = function(r) {
    var o = [];
    o.push(r[0]);
    for (var i = 0; i <r[1].length; i++) o.push(r[1][i][1]);
    return o;
};


// 36: return Arielworks.Hercules.Sparql.Resource
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Object = function(r) {
    // extract single element sequential
    return r[0];
}


// 38 returns Arielworks.Hercules.Rdf.Resource
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesNode = function(r) {
    if (r[0]) {
        //TODO
    } else if (r[1]) {
        var o = this.__getBlankNode();
        for (var i = 0; i < r[1].length; i++) {
            for(var j = 0; j < r[1][i][1].length; j++) {
                this.graphStack[0].addPattern(this.query.getTriplePattern(o, r[1][i][0], r[1][i][1][j]));
            }
        }
        return o;
    };
};

// 39 return 33
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BlankNodePropertyList = function(r) {
    return r[1];
};

// 41: returns Arielworks.Hercules.Sparql.Resource
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphNode = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

// 42 return Arielworks.Hercules.Rdf.Resource
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.VarOrTerm = function(r) {
    if (r[0]) return this.query.getVariable(r[0]);
    else if (r[1]) return r[1];

};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.VarOrIRIref = function(r) {
    if (r[0]) return this.query.getVariable(r[0]);
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Var = function(r) {
    // extract name
    return r[0] ? r[0][1] : r[1][1];
};




Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Verb = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return this.query.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_TYPE);
};

// 45 return Arielworks.Hercules.Rdf.Resource
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphTerm = function(r) {
    for (var i = 0; i < r.length; i++) if (r[i]) return r[i];
};

// 60
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.RDFLiteral = function(r) {
    if (r[1]) {
        if (r[1][0]) return this.query.getPlainLiteral(r[0], r[1][0]);
        else if (r[1][1]) return Arielworks.Hercules.Rdf.TypedLiteral(r[0], r[1][1][1].getValue());
    } else {
        return this.query.getPlainLiteral(r[0]);
    }
};

// 66
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.String = function(r) {
    for (var i = 0; i < r.length; i++) if (r[i]) return r[i][1];
};

// 67
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.IRIref = function(r) {
    if (r[0]) {
        return this.query.getRdfUriRef(r[0][1]);
    } else {
        if (r[1][0]) {
            return this.query.getRdfUriRef(this.__resolvePrefiexName(r[1][0][1], r[1][0][2]));
        } else if (r[1][1]) {
            return this.query.getRdfUriRef(this.__resolvePrefiexName(r[1][1][1], ""));
        } else {
            //@ASSERT
        }
    }
};


// 69 return _EN_.BlankNode
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BlankNode = function(r) {
    if (r[0]) {
        return this.__getBlankNode(r[0][1]);
    } else if (r[1]) {
        return this.__getBlankNode();
    }
};


// 76 return string
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.LANGTAG = function(r) {
    return r[1];
};
