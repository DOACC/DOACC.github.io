(function(c) {
    var d = {},
        a = /^(([a-z][\-a-z0-9+\.]*):)?(\/\/([^\/?#]+))?([^?#]*)?(\?([^#]*))?(#(.*))?$/i,
        g, b = function(j) {
            var h = j.match(a);
            if (h === null) {
                throw "Malformed URI: " + j
            }
            return {
                scheme: h[1] ? h[2].toLowerCase() : undefined,
                authority: h[3] ? h[4] : undefined,
                path: h[5] || "",
                query: h[6] ? h[7] : undefined,
                fragment: h[8] ? h[9] : undefined
            }
        },
        f = function(j) {
            var k = "",
                h = [];
            if (/\./.test(j)) {
                while (j !== undefined && j !== "") {
                    if (j === "." || j === "..") {
                        j = ""
                    } else {
                        if (/^\.\.\//.test(j)) {
                            j = j.substring(3)
                        } else {
                            if (/^\.\//.test(j)) {
                                j = j.substring(2)
                            } else {
                                if (/^\/\.(\/|$)/.test(j)) {
                                    j = "/" + j.substring(3)
                                } else {
                                    if (/^\/\.\.(\/|$)/.test(j)) {
                                        j = "/" + j.substring(4);
                                        k = k.replace(/\/?[^\/]+$/, "")
                                    } else {
                                        h = j.match(/^(\/?[^\/]*)(\/.*)?$/);
                                        j = h[2];
                                        k = k + h[1]
                                    }
                                }
                            }
                        }
                    }
                }
                return k
            } else {
                return j
            }
        },
        e = function(h, j) {
            if (h.authority !== "" && (h.path === undefined || h.path === "")) {
                return "/" + j
            } else {
                return h.path.replace(/[^\/]+$/, "") + j
            }
        };
    c.uri = function(k, j) {
        var h;
        k = k || "";
        if (d[k]) {
            return d[k]
        }
        j = j || c.uri.base();
        if (typeof j === "string") {
            j = c.uri.absolute(j)
        }
        h = new c.uri.fn.init(k, j);
        if (d[h]) {
            return d[h]
        } else {
            d[h] = h;
            return h
        }
    };
    c.uri.fn = c.uri.prototype = {
        scheme: undefined,
        authority: undefined,
        path: undefined,
        query: undefined,
        fragment: undefined,
        init: function(k, j) {
            var h = {};
            j = j || {};
            c.extend(this, b(k));
            if (this.scheme === undefined) {
                this.scheme = j.scheme;
                if (this.authority !== undefined) {
                    this.path = f(this.path)
                } else {
                    this.authority = j.authority;
                    if (this.path === "") {
                        this.path = j.path;
                        if (this.query === undefined) {
                            this.query = j.query
                        }
                    } else {
                        if (!/^\//.test(this.path)) {
                            this.path = e(j, this.path)
                        }
                        this.path = f(this.path)
                    }
                }
            }
            if (this.scheme === undefined) {
                throw "Malformed URI: URI is not an absolute URI and no base supplied: " + k
            }
            return this
        },
        resolve: function(h) {
            return c.uri(h, this)
        },
        relative: function(p) {
            var n, o, m = 0,
                k, l = [],
                h = "";
            if (typeof p === "string") {
                p = c.uri(p, {})
            }
            if (p.scheme !== this.scheme || p.authority !== this.authority) {
                return p.toString()
            }
            if (p.path !== this.path) {
                n = p.path.split("/");
                o = this.path.split("/");
                if (n[1] !== o[1]) {
                    h = p.path
                } else {
                    while (n[m] === o[m]) {
                        m += 1
                    }
                    k = m;
                    for (; m < o.length - 1; m += 1) {
                        l.push("..")
                    }
                    for (; k < n.length; k += 1) {
                        l.push(n[k])
                    }
                    h = l.join("/")
                }
                h = p.query === undefined ? h : h + "?" + p.query;
                h = p.fragment === undefined ? h : h + "#" + p.fragment;
                return h
            }
            if (p.query !== undefined && p.query !== this.query) {
                return "?" + p.query + (p.fragment === undefined ? "" : "#" + p.fragment)
            }
            if (p.fragment !== undefined && p.fragment !== this.fragment) {
                return "#" + p.fragment
            }
            return ""
        },
        toString: function() {
            var h = "";
            if (this._string) {
                return this._string
            } else {
                h = this.scheme === undefined ? h : (h + this.scheme + ":");
                h = this.authority === undefined ? h : (h + "//" + this.authority);
                h = h + this.path;
                h = this.query === undefined ? h : (h + "?" + this.query);
                h = this.fragment === undefined ? h : (h + "#" + this.fragment);
                this._string = h;
                return h
            }
        }
    };
    c.uri.fn.init.prototype = c.uri.fn;
    c.uri.absolute = function(h) {
        return c.uri(h, {})
    };
    c.uri.resolve = function(j, h) {
        return c.uri(j, h)
    };
    c.uri.relative = function(j, h) {
        return c.uri(h, {}).relative(j)
    };
    c.uri.base = function() {
        return c(document).base()
    };
    c.fn.base = function() {
        var h = c(this).parents().andSelf().find("base").attr("href"),
            j = c(this)[0].ownerDocument || document,
            k = c.uri.absolute(j.location === null ? document.location.href : j.location.href);
        return h === undefined ? k : c.uri(h, k)
    }
})(jQuery);
(function(b) {
    var a = /\sxmlns(?::([^ =]+))?\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    b.fn.xmlns = function(h, d, j) {
        var f = this.eq(0),
            m = f.data("xmlns"),
            k = f[0],
            n, c, g, l = h ? "xmlns:" + h : "xmlns",
            o, r, q = false;
        if (d === undefined) {
            if (h === undefined) {
                if (m === undefined) {
                    m = {};
                    if (k.attributes && k.attributes.getNamedItemNS) {
                        for (g = 0; g < k.attributes.length; g += 1) {
                            n = k.attributes[g];
                            if (/^xmlns(:(.+))?$/.test(n.nodeName)) {
                                h = /^xmlns(:(.+))?$/.exec(n.nodeName)[2] || "";
                                o = n.nodeValue;
                                if (h === "" || o !== "") {
                                    m[h] = b.uri(n.nodeValue);
                                    q = true
                                }
                            }
                        }
                    } else {
                        r = /<[^>]+>/.exec(k.outerHTML);
                        n = a.exec(r);
                        while (n !== null) {
                            h = n[1] || "";
                            o = n[2] || n[3];
                            if (h === "" || o !== "") {
                                m[h] = b.uri(n[2] || n[3]);
                                q = true
                            }
                            n = a.exec(r)
                        }
                        a.lastIndex = 0
                    }
                    j = j || (k.parentNode.nodeType === 1 ? f.parent().xmlns() : {});
                    m = q ? b.extend({}, j, m) : j;
                    f.data("xmlns", m)
                }
                return m
            } else {
                if (typeof h === "object") {
                    for (c in h) {
                        if (typeof h[c] === "string") {
                            this.xmlns(c, h[c])
                        }
                    }
                    this.find("*").andSelf().removeData("xmlns");
                    return this
                } else {
                    if (m === undefined) {
                        m = f.xmlns()
                    }
                    return m[h]
                }
            }
        } else {
            this.find("*").andSelf().removeData("xmlns");
            return this.attr(l, d)
        }
    };
    b.fn.removeXmlns = function(e) {
        var c, f, d;
        if (typeof e === "object") {
            if (e.length === undefined) {
                for (f in e) {
                    if (typeof e[f] === "string") {
                        this.removeXmlns(f)
                    }
                }
            } else {
                for (d = 0; d < e.length; d += 1) {
                    this.removeXmlns(e[d])
                }
            }
        } else {
            c = e ? "xmlns:" + e : "xmlns";
            this.removeAttr(c)
        }
        this.find("*").andSelf().removeData("xmlns");
        return this
    };
    b.fn.qname = function(d) {
        var c, f, e;
        if (d === undefined) {
            if (this[0].outerHTML === undefined) {
                d = this[0].nodeName.toLowerCase()
            } else {
                d = /<([^ >]+)/.exec(this[0].outerHTML)[1].toLowerCase()
            }
        }
        if (d === "?xml:namespace") {
            throw "XMLinHTML: Unable to get the prefix to resolve the name of this element"
        }
        c = /^(([^:]+):)?([^:]+)$/.exec(d);
        f = c[2] || "";
        e = this.xmlns(f);
        if (e === undefined && f !== "") {
            throw "MalformedQName: The prefix " + f + " is not declared"
        }
        return {
            namespace: e,
            localPart: c[3],
            prefix: f,
            name: d
        }
    }
})(jQuery);
(function(b) {
    var a = function(c) {
        return c.replace(/[ \t\n\r]+/, " ").replace(/^ +/, "").replace(/ +$/, "")
    };
    b.typedValue = function(d, c) {
        return b.typedValue.fn.init(d, c)
    };
    b.typedValue.fn = b.typedValue.prototype = {
        representation: undefined,
        value: undefined,
        datatype: undefined,
        init: function(e, c) {
            var f;
            if (b.typedValue.valid(e, c)) {
                f = b.typedValue.types[c];
                this.representation = e;
                this.datatype = c;
                this.value = f.value(f.strip ? a(e) : e);
                return this
            } else {
                throw {
                    name: "InvalidValue",
                    message: e + " is not a valid " + c + " value"
                }
            }
        }
    };
    b.typedValue.fn.init.prototype = b.typedValue.fn;
    b.typedValue.types = {};
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#string"] = {
        regex: /^.*$/,
        strip: false,
        value: function(c) {
            return c
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#boolean"] = {
        regex: /^(?:true|false|1|0)$/,
        strip: true,
        value: function(c) {
            return c === "true" || c === "1"
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#decimal"] = {
        regex: /^[\-\+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)$/,
        strip: true,
        value: function(c) {
            return c
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#integer"] = {
        regex: /^[\-\+]?[0-9]+$/,
        strip: true,
        value: function(c) {
            return parseInt(c, 10)
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#int"] = {
        regex: /^[\-\+]?[0-9]+$/,
        strip: true,
        value: function(c) {
            return parseInt(c, 10)
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#float"] = {
        regex: /^(?:[\-\+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)(?:[eE][\-\+]?[0-9]+)?|[\-\+]?INF|NaN)$/,
        strip: true,
        value: function(c) {
            if (c === "-INF") {
                return -1 / 0
            } else {
                if (c === "INF" || c === "+INF") {
                    return 1 / 0
                } else {
                    return parseFloat(c)
                }
            }
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#double"] = {
        regex: b.typedValue.types["http://www.w3.org/2001/XMLSchema#float"].regex,
        strip: true,
        value: b.typedValue.types["http://www.w3.org/2001/XMLSchema#float"].value
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#duration"] = {
        regex: /^([\-\+])?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+))?S)?)$/,
        validate: function(d) {
            var c = this.regex.exec(d);
            return c[2] || c[3] || c[4] || c[5] || c[6] || c[7]
        },
        strip: true,
        value: function(c) {
            return c
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#dateTime"] = {
        regex: /^(-?[0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):(([0-9]{2})(\.([0-9]+))?)((?:[\-\+]([0-9]{2}):([0-9]{2}))|Z)?$/,
        validate: function(d) {
            var c = this.regex.exec(d),
                g = parseInt(c[1], 10),
                j = c[10] === undefined || c[10] === "Z" ? "+0000" : c[10].replace(/:/, ""),
                f;
            if (g === 0 || parseInt(j, 10) < -1400 || parseInt(j, 10) > 1400) {
                return false
            }
            try {
                g = g < 100 ? Math.abs(g) + 1000 : g;
                month = parseInt(c[2], 10);
                day = parseInt(c[3], 10);
                if (day > 31) {
                    return false
                } else {
                    if (day > 30 && !(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12)) {
                        return false
                    } else {
                        if (month === 2) {
                            if (day > 29) {
                                return false
                            } else {
                                if (day === 29 && (g % 4 !== 0 || (g % 100 === 0 && g % 400 !== 0))) {
                                    return false
                                }
                            }
                        }
                    }
                }
                f = "" + g + "/" + c[2] + "/" + c[3] + " " + c[4] + ":" + c[5] + ":" + c[7] + " " + j;
                f = new Date(f);
                return true
            } catch (h) {
                return false
            }
        },
        strip: true,
        value: function(c) {
            return c
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#date"] = {
        regex: /^(-?[0-9]{4,})-([0-9]{2})-([0-9]{2})((?:[\-\+]([0-9]{2}):([0-9]{2}))|Z)?$/,
        validate: function(e) {
            var c = this.regex.exec(e),
                f = parseInt(c[1], 10),
                g = parseInt(c[2], 10),
                d = parseInt(c[3], 10),
                h = c[10] === undefined || c[10] === "Z" ? "+0000" : c[10].replace(/:/, "");
            if (f === 0 || g > 12 || d > 31 || parseInt(h, 10) < -1400 || parseInt(h, 10) > 1400) {
                return false
            } else {
                return true
            }
        },
        strip: true,
        value: function(c) {
            return c
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#gMonthDay"] = {
        regex: /^--([0-9]{2})-([0-9]{2})((?:[\-\+]([0-9]{2}):([0-9]{2}))|Z)?$/,
        validate: function(e) {
            var c = this.regex.exec(e),
                f = parseInt(c[1], 10),
                d = parseInt(c[2], 10),
                g = c[3] === undefined || c[3] === "Z" ? "+0000" : c[3].replace(/:/, "");
            if (f > 12 || d > 31 || parseInt(g, 10) < -1400 || parseInt(g, 10) > 1400) {
                return false
            } else {
                if (f === 2 && d > 29) {
                    return false
                } else {
                    if ((f === 4 || f === 6 || f === 9 || f === 11) && d > 30) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        },
        strip: true,
        value: function(c) {
            return c
        }
    };
    b.typedValue.types["http://www.w3.org/2001/XMLSchema#anyURI"] = {
        regex: /^.*$/,
        strip: true,
        value: function(c, d) {
            var e = b.extend({}, b.typedValue.defaults, d);
            return b.uri.resolve(c, e.base)
        }
    };
    b.typedValue.defaults = {
        base: b.uri.base(),
        namespaces: {}
    };
    b.typedValue.valid = function(e, c) {
        var f = b.typedValue.types[c];
        if (f === undefined) {
            throw "InvalidDatatype: The datatype " + c + " can't be recognised"
        } else {
            e = f.strip ? a(e) : e;
            if (f.regex.test(e)) {
                return f.validate === undefined ? true : f.validate(e)
            } else {
                return false
            }
        }
    }
})(jQuery);
(function(a) {
    a.curie = function(f, c) {
        var g = a.extend({}, a.curie.defaults, c || {}),
            b = /^(([^:]*):)?(.+)$/.exec(f),
            h = b[2],
            d = b[3],
            e = g.namespaces[h];
        if (/^:.+/.test(f)) {
            if (g.reservedNamespace === undefined || g.reservedNamespace === null) {
                throw "Malformed CURIE: No prefix and no default namespace for unprefixed CURIE " + f
            } else {
                e = g.reservedNamespace
            }
        } else {
            if (h) {
                if (e === undefined) {
                    throw "Malformed CURIE: No namespace binding for " + h + " in CURIE " + f
                }
            } else {
                if (g.charcase === "lower") {
                    f = f.toLowerCase()
                } else {
                    if (g.charcase === "upper") {
                        f = f.toUpperCase()
                    }
                }
                if (g.reserved.length && a.inArray(f, g.reserved) >= 0) {
                    e = g.reservedNamespace;
                    d = f
                } else {
                    if (g.defaultNamespace === undefined || g.defaultNamespace === null) {
                        throw "Malformed CURIE: No prefix and no default namespace for unprefixed CURIE " + f
                    } else {
                        e = g.defaultNamespace
                    }
                }
            }
        }
        return a.uri(e + d)
    };
    a.curie.defaults = {
        namespaces: {},
        reserved: [],
        reservedNamespace: undefined,
        defaultNamespace: undefined,
        charcase: "preserve"
    };
    a.safeCurie = function(d, c) {
        var b = /^\[([^\]]+)\]$/.exec(d);
        return b ? a.curie(b[1], c) : a.uri(d)
    };
    a.createCurie = function(f, b) {
        var e = a.extend({}, a.curie.defaults, b || {}),
            d = e.namespaces,
            c;
        f = a.uri(f).toString();
        if (e.reservedNamespace !== undefined && f.substring(0, e.reservedNamespace.toString().length) === e.reservedNamespace.toString()) {
            c = f.substring(e.reservedNamespace.toString().length);
            if (a.inArray(c, e.reserved) === -1) {
                c = ":" + c
            }
        } else {
            a.each(d, function(h, g) {
                if (f.substring(0, g.toString().length) === g.toString()) {
                    c = h + ":" + f.substring(g.toString().length);
                    return null
                }
            })
        }
        if (c === undefined) {
            throw "No Namespace Binding: There's no appropriate namespace binding for generating a CURIE from " + f
        } else {
            return c
        }
    };
    a.fn.curie = function(c, b) {
        var d = a.extend({}, a.fn.curie.defaults, {
            namespaces: this.xmlns()
        }, b || {});
        return a.curie(c, d)
    };
    a.fn.safeCurie = function(d, b) {
        var c = a.extend({}, a.fn.curie.defaults, {
            namespaces: this.xmlns()
        }, b || {});
        return a.safeCurie(d, c)
    };
    a.fn.createCurie = function(d, b) {
        var c = a.extend({}, a.fn.curie.defaults, {
            namespaces: this.xmlns()
        }, b || {});
        return a.createCurie(d, c)
    };
    a.fn.curie.defaults = {
        reserved: ["alternate", "appendix", "bookmark", "cite", "chapter", "contents", "copyright", "first", "glossary", "help", "icon", "index", "last", "license", "meta", "next", "p3pv1", "prev", "role", "section", "stylesheet", "subsection", "start", "top", "up"],
        reservedNamespace: "http://www.w3.org/1999/xhtml/vocab#",
        defaultNamespace: undefined,
        charcase: "lower"
    }
})(jQuery);
(function(F) {
    var f = {},
        c = {},
        t = {},
        C = {},
        r = {},
        j = "http://www.w3.org/2001/XMLSchema#",
        w = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        v = "http://www.w3.org/2000/01/rdf-schema#",
        z = /^<(([^>]|\\>)*)>$/,
        T = /^("""((\\"|[^"])*)"""|"((\\"|[^"])*)")(@([a-z]+(-[a-z0-9]+)*)|\^\^(.+))?$/,
        g = /(("""((\\"|[^"])*)""")|("(\\"|[^"]|)*")|(<(\\>|[^>])*>)|\S)+/g,
        x = databankSeed = new Date().getTime() % 1000,
        k = function() {
            x += 1;
            return "b" + x.toString(16)
        },
        K = function() {
            databankSeed += 1;
            return "data" + databankSeed.toString(16)
        },
        l = function(X, Y) {
            if (typeof X === "string") {
                try {
                    return F.rdf.resource(X, Y)
                } catch (aa) {
                    try {
                        return F.rdf.blank(X, Y)
                    } catch (Z) {
                        throw "Bad Triple: Subject " + X + " is not a resource: " + Z
                    }
                }
            } else {
                return X
            }
        },
        R = function(Y, X) {
            if (Y === "a") {
                return F.rdf.type
            } else {
                if (typeof Y === "string") {
                    try {
                        return F.rdf.resource(Y, X)
                    } catch (Z) {
                        throw "Bad Triple: Property " + Y + " is not a resource: " + Z
                    }
                } else {
                    return Y
                }
            }
        },
        N = function(X, Z) {
            if (typeof X === "string") {
                try {
                    return F.rdf.resource(X, Z)
                } catch (ab) {
                    try {
                        return F.rdf.blank(X, Z)
                    } catch (aa) {
                        try {
                            return F.rdf.literal(X, Z)
                        } catch (Y) {
                            throw "Bad Triple: Object " + X + " is not a resource or a literal " + Y
                        }
                    }
                }
            } else {
                return X
            }
        },
        a = function(aa, Y, Z) {
            var X;
            if (typeof Y === "string") {
                X = Y.substring(1);
                if (Z[X] && Z[X] !== aa) {
                    return null
                } else {
                    Z[X] = aa;
                    return Z
                }
            } else {
                if (Y === aa) {
                    return Z
                } else {
                    return null
                }
            }
        },
        U = function(Y, X) {
            return F.map(Y, function(Z) {
                var aa = X.exec(Z);
                return aa === null ? null : {
                    bindings: aa,
                    triples: [Z]
                }
            })
        },
        q = function(X, Z, Y) {
            return F.map(X, function(ac, aa) {
                var ab = F.map(Z, function(ad) {
                    var ae = true;
                    F.each(ad.bindings, function(ag, af) {
                        if (!(ac.bindings[ag] === undefined || ac.bindings[ag] === af)) {
                            ae = false;
                            return false
                        }
                    });
                    return ae ? ad : null
                });
                if (ab.length > 0) {
                    return F.map(ab, function(ad) {
                        return {
                            bindings: F.extend({}, ac.bindings, ad.bindings),
                            triples: F.unique(ac.triples.concat(ad.triples))
                        }
                    })
                } else {
                    return Y ? ac : null
                }
            })
        },
        V = function(X, Z) {
            var Y, aa, ab;
            if (Z.filterExp !== undefined && !F.isFunction(Z.filterExp)) {
                if (X.union === undefined) {
                    Y = typeof Z.filterExp.subject === "string" ? "" : Z.filterExp.subject;
                    aa = typeof Z.filterExp.property === "string" ? "" : Z.filterExp.property;
                    ab = typeof Z.filterExp.object === "string" ? "" : Z.filterExp.object;
                    if (X.queries[Y] === undefined) {
                        X.queries[Y] = {}
                    }
                    if (X.queries[Y][aa] === undefined) {
                        X.queries[Y][aa] = {}
                    }
                    if (X.queries[Y][aa][ab] === undefined) {
                        X.queries[Y][aa][ab] = []
                    }
                    X.queries[Y][aa][ab].push(Z)
                } else {
                    F.each(X.union, function(ad, ac) {
                        V(ac, Z)
                    })
                }
            }
        },
        A = function(X) {
            X.length = 0;
            X.matches = [];
            F.each(X.children, function(Y, Z) {
                A(Z)
            });
            F.each(X.partOf, function(Y, Z) {
                A(Z)
            })
        },
        H = function(Y, X) {
            if (X.length > 0) {
                F.each(Y.children, function(Z, aa) {
                    J(aa, X)
                });
                F.each(Y.partOf, function(Z, aa) {
                    H(aa, X)
                });
                F.each(X, function(aa, Z) {
                    Y.matches.push(Z);
                    Array.prototype.push.call(Y, Z.bindings)
                })
            }
        },
        J = function(Z, Y) {
            var X;
            if (Z.union === undefined) {
                if (Z.top || Z.parent.top) {
                    X = Z.alphaMemory
                } else {
                    Y = Y || Z.parent.matches;
                    if (F.isFunction(Z.filterExp)) {
                        X = F.map(Y, function(aa, ab) {
                            return Z.filterExp.call(aa.bindings, ab, aa.bindings, aa.triples) ? aa : null
                        })
                    } else {
                        X = q(Y, Z.alphaMemory, Z.filterExp.optional)
                    }
                }
            } else {
                X = F.map(Z.union, function(aa) {
                    return aa.matches
                })
            }
            H(Z, X)
        },
        p = function(Z, Y) {
            var X;
            if (Z.filterExp.optional) {
                A(Z);
                J(Z)
            } else {
                if (Z.top || Z.parent.top) {
                    X = [Y]
                } else {
                    X = q(Z.parent.matches, [Y], false)
                }
                H(Z, X)
            }
        },
        P = function(Y, Z) {
            var X, aa = Y.filterExp.exec(Z);
            if (aa !== null) {
                X = {
                    triples: [Z],
                    bindings: aa
                };
                Y.alphaMemory.push(X);
                p(Y, X)
            }
        },
        d = function(X, Y) {
            X.alphaMemory.splice(F.inArray(Y, X.alphaMemory), 1);
            A(X);
            J(X)
        },
        B = function(X, Y) {
            F.each(X, function(Z, aa) {
                P(aa, Y)
            })
        },
        m = function(X, Y) {
            F.each(X, function(Z, aa) {
                d(aa, Y)
            })
        },
        e = function(X, ab) {
            var Y = ab.subject,
                Z = ab.property,
                aa = ab.object;
            if (X.union === undefined) {
                if (X.queries[Y] !== undefined) {
                    if (X.queries[Y][Z] !== undefined) {
                        if (X.queries[Y][Z][aa] !== undefined) {
                            B(X.queries[Y][Z][aa], ab)
                        }
                        if (X.queries[Y][Z][""] !== undefined) {
                            B(X.queries[Y][Z][""], ab)
                        }
                    }
                    if (X.queries[Y][""] !== undefined) {
                        if (X.queries[Y][""][aa] !== undefined) {
                            B(X.queries[Y][""][aa], ab)
                        }
                        if (X.queries[Y][""][""] !== undefined) {
                            B(X.queries[Y][""][""], ab)
                        }
                    }
                }
                if (X.queries[""] !== undefined) {
                    if (X.queries[""][Z] !== undefined) {
                        if (X.queries[""][Z][aa] !== undefined) {
                            B(X.queries[""][Z][aa], ab)
                        }
                        if (X.queries[""][Z][""] !== undefined) {
                            B(X.queries[""][Z][""], ab)
                        }
                    }
                    if (X.queries[""][""] !== undefined) {
                        if (X.queries[""][""][aa] !== undefined) {
                            B(X.queries[""][""][aa], ab)
                        }
                        if (X.queries[""][""][""] !== undefined) {
                            B(X.queries[""][""][""], ab)
                        }
                    }
                }
            } else {
                F.each(X.union, function(ad, ac) {
                    e(ac, ab)
                })
            }
        },
        s = function(X, ab) {
            var Y = ab.subject,
                Z = ab.property,
                aa = ab.object;
            if (X.union === undefined) {
                if (X.queries[Y] !== undefined) {
                    if (X.queries[Y][Z] !== undefined) {
                        if (X.queries[Y][Z][aa] !== undefined) {
                            m(X.queries[Y][Z][aa], ab)
                        }
                        if (X.queries[Y][Z][""] !== undefined) {
                            m(X.queries[Y][Z][""], ab)
                        }
                    }
                    if (X.queries[Y][""] !== undefined) {
                        if (X.queries[Y][""][aa] !== undefined) {
                            m(X.queries[Y][""][aa], ab)
                        }
                        if (X.queries[Y][""][""] !== undefined) {
                            m(X.queries[Y][""][""], ab)
                        }
                    }
                }
                if (X.queries[""] !== undefined) {
                    if (X.queries[""][Z] !== undefined) {
                        if (X.queries[""][Z][aa] !== undefined) {
                            m(X.queries[""][Z][aa], ab)
                        }
                        if (X.queries[""][Z][""] !== undefined) {
                            m(X.queries[""][Z][""], ab)
                        }
                    }
                    if (X.queries[""][""] !== undefined) {
                        if (X.queries[""][""][aa] !== undefined) {
                            m(X.queries[""][""][aa], ab)
                        }
                        if (X.queries[""][""][""] !== undefined) {
                            m(X.queries[""][""][""], ab)
                        }
                    }
                }
            } else {
                F.each(X.union, function(ad, ac) {
                    s(ac, ab)
                })
            }
        },
        n = function(ac) {
            var ab = {},
                Y, X, Z, aa;
            for (Y = 0; Y < ac.length; Y += 1) {
                X = ac[Y];
                Z = X.subject.value.toString();
                aa = X.property.value.toString();
                if (ab[Z] === undefined) {
                    ab[Z] = {}
                }
                if (ab[Z][aa] === undefined) {
                    ab[Z][aa] = []
                }
                ab[Z][aa].push(X.object.dump())
            }
            return ab
        },
        W = function(ab) {
            var ag, ad, Y, ae, Z, aa, ac, X, af = [];
            for (ag in ab) {
                ad = (ag.substring(0, 2) === "_:") ? F.rdf.blank(ag) : F.rdf.resource("<" + ag + ">");
                for (Y in ab[ag]) {
                    ae = F.rdf.resource("<" + Y + ">");
                    for (ac = 0; ac < ab[ag][Y].length; ac += 1) {
                        Z = ab[ag][Y][ac];
                        if (Z.type === "uri") {
                            aa = F.rdf.resource("<" + Z.value + ">")
                        } else {
                            if (Z.type === "bnode") {
                                aa = F.rdf.blank(Z.value)
                            } else {
                                if (Z.datatype !== undefined) {
                                    aa = F.rdf.literal(Z.value, {
                                        datatype: Z.datatype
                                    })
                                } else {
                                    X = {};
                                    if (Z.lang !== undefined) {
                                        X.lang = Z.lang
                                    }
                                    aa = F.rdf.literal('"' + Z.value + '"', X)
                                }
                            }
                        }
                        af.push(F.rdf.triple(ad, ae, aa))
                    }
                }
            }
            return af
        },
        E = function(aa, Z, Y, ab) {
            var ac = aa.ownerDocument,
                X;
            if (Z !== undefined && Z !== null) {
                if (ac.createAttributeNS) {
                    X = ac.createAttributeNS(Z, Y);
                    X.nodeValue = ab;
                    aa.attributes.setNamedItemNS(X)
                } else {
                    X = ac.createNode(2, Y, Z);
                    X.nodeValue = ab;
                    aa.attributes.setNamedItem(X)
                }
            } else {
                X = ac.createAttribute(Y);
                X.nodeValue = ab;
                aa.attributes.setNamedItem(X)
            }
            return aa
        },
        y = function(Y, X, Z) {
            if (Z) {
                E(Y, "http://www.w3.org/2000/xmlns/", "xmlns:" + Z, X)
            } else {
                E(Y, undefined, "xmlns", X)
            }
            return Y
        },
        D = function(Z, X) {
            var ab, ac = "",
                aa, Y = false;
            if (Z !== undefined && Z !== null) {
                if (/:/.test(X)) {
                    aa = /([^:]+):/.exec(X)[1]
                }
                Y = true
            }
            if (document.implementation && document.implementation.createDocument) {
                ab = document.implementation.createDocument(Z, X, null);
                if (Y) {
                    y(ab.documentElement, Z, aa)
                }
                return ab
            } else {
                ab = new ActiveXObject("Microsoft.XMLDOM");
                ab.async = "false";
                if (aa === undefined) {
                    ac = ' xmlns="' + Z + '"'
                } else {
                    ac = " xmlns:" + aa + '="' + Z + '"'
                }
                ab.loadXML("<" + X + ac + "/>");
                return ab
            }
        },
        h = function(Z, Y, X) {
            var ab = Z.ownerDocument,
                aa;
            if (Y !== undefined && Y !== null) {
                aa = ab.createElementNS ? ab.createElementNS(Y, X) : ab.createNode(1, X, Y)
            } else {
                aa = ab.createElement(X)
            }
            Z.appendChild(aa);
            return aa
        },
        M = function(Y, aa) {
            var Z = Y.ownerDocument,
                X;
            X = Z.createTextNode(aa);
            Y.appendChild(X);
            return Y
        },
        u = function(Z, X) {
            var ad, ab, Y, ac;
            try {
                ab = new ActiveXObject("Microsoft.XMLDOM");
                ab.async = "false";
                ab.loadXML("<temp>" + X + "</temp>")
            } catch (aa) {
                ad = new DOMParser();
                ab = ad.parseFromString("<temp>" + X + "</temp>", "text/xml")
            }
            for (Y = 0; Y < ab.documentElement.childNodes.length; Y += 1) {
                Z.appendChild(ab.documentElement.childNodes[Y].cloneNode(true))
            }
            return Z
        },
        L = function(ak, am) {
            var ai = D(w, "rdf:RDF"),
                ad = n(ak),
                Y = am.namespaces || {},
                Z, al, ae, X, af, ab, aj, aa, ah, ag, ac;
            for (Z in Y) {
                y(ai.documentElement, Y[Z], Z)
            }
            for (al in ad) {
                if (ad[al][F.rdf.type.value] !== undefined) {
                    aa = /(.+[#\/])([^#\/]+)/.exec(ad[al][F.rdf.type.value][0].value);
                    ag = aa[1];
                    ah = aa[2];
                    for (Z in Y) {
                        if (Y[Z] === ag) {
                            ac = Z;
                            break
                        }
                    }
                    ae = h(ai.documentElement, ag, ac + ":" + ah)
                } else {
                    ae = h(ai.documentElement, w, "rdf:Description")
                }
                if (/^_:/.test(al)) {
                    E(ae, w, "rdf:nodeID", al.substring(2))
                } else {
                    E(ae, w, "rdf:about", al)
                }
                for (X in ad[al]) {
                    if (X !== F.rdf.type.value.toString() || ad[al][X].length > 1) {
                        aa = /(.+[#\/])([^#\/]+)/.exec(X);
                        ag = aa[1];
                        ah = aa[2];
                        for (Z in Y) {
                            if (Y[Z] === ag) {
                                ac = Z;
                                break
                            }
                        }
                        for (ab = (X === F.rdf.type.value.toString() ? 1 : 0); ab < ad[al][X].length; ab += 1) {
                            aj = ad[al][X][ab];
                            af = h(ae, ag, ac + ":" + ah);
                            if (aj.type === "uri") {
                                E(af, w, "rdf:resource", aj.value)
                            } else {
                                if (aj.type === "literal") {
                                    if (aj.datatype !== undefined) {
                                        if (aj.datatype === "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral") {
                                            E(af, w, "rdf:parseType", "Literal");
                                            u(af, aj.value)
                                        } else {
                                            E(af, w, "rdf:datatype", aj.datatype);
                                            M(af, aj.value)
                                        }
                                    } else {
                                        if (aj.lang !== undefined) {
                                            E(af, "http://www.w3.org/XML/1998/namespace", "xml:lang", aj.lang);
                                            M(af, aj.value)
                                        } else {
                                            M(af, aj.value)
                                        }
                                    }
                                } else {
                                    E(af, w, "rdf:nodeID", aj.value.substring(2))
                                }
                            }
                        }
                    }
                }
            }
            return ai
        },
        S = function(X) {
            switch (X) {
                case "http://www.w3.org/1999/02/22-rdf-syntax-ns":
                    return "rdf";
                case "http://www.w3.org/XML/1998/namespace":
                    return "xml";
                case "http://www.w3.org/2000/xmlns/":
                    return "xmlns";
                default:
                    throw ("No default prefix mapped for namespace " + X)
            }
        },
        b = function(Z, Y, X) {
            var ab;
            if (Z.hasAttributeNS) {
                return Z.hasAttributeNS(Y, X)
            } else {
                try {
                    ab = /:/.test(X) ? /:(.+)$/.exec(X)[1] : X;
                    return Z.attributes.getQualifiedItem(ab, Y) !== null
                } catch (aa) {
                    return Z.getAttribute(S(Y) + ":" + X) !== null
                }
            }
        },
        G = function(Z, Y, X) {
            var ab;
            if (Z.getAttributeNS) {
                return Z.getAttributeNS(Y, X)
            } else {
                try {
                    ab = /:/.test(X) ? /:(.+)$/.exec(X)[1] : X;
                    return Z.attributes.getQualifiedItem(ab, Y).nodeValue
                } catch (aa) {
                    return Z.getAttribute(S(Y) + ":" + X)
                }
            }
        },
        I = function(X) {
            return X.localName || X.baseName
        },
        o = function(Z, aa) {
            var Y, X;
            if (b(Z, w, "about")) {
                Y = G(Z, w, "about");
                X = F.rdf.resource("<" + Y + ">", {
                    base: aa
                })
            } else {
                if (b(Z, w, "ID")) {
                    Y = G(Z, w, "ID");
                    X = F.rdf.resource("<#" + Y + ">", {
                        base: aa
                    })
                } else {
                    if (b(Z, w, "nodeID")) {
                        Y = G(Z, w, "nodeID");
                        X = F.rdf.blank("_:" + Y)
                    } else {
                        X = F.rdf.blank("[]")
                    }
                }
            }
            return X
        },
        O = function(ap, Z, aa, au) {
            var ac, af, ad, ag, aq, ak, au, aj, ai, ae = 1,
                at, ar, am, X = [],
                ab, ao, al = {},
                Y, ah = [];
            au = G(ap, "http://www.w3.org/XML/1998/namespace", "lang") || au;
            aa = G(ap, "http://www.w3.org/XML/1998/namespace", "base") || aa;
            if (au !== null && au !== undefined && au !== "") {
                al = {
                    lang: au
                }
            }
            ac = o(ap, aa);
            if (Z && (ap.namespaceURI !== w || I(ap) !== "Description")) {
                ad = F.rdf.type;
                aq = F.rdf.resource("<" + ap.namespaceURI + I(ap) + ">");
                ah.push(F.rdf.triple(ac, ad, aq))
            }
            for (aj = 0; aj < ap.attributes.length; aj += 1) {
                af = ap.attributes.item(aj);
                if (af.namespaceURI !== undefined && af.namespaceURI !== "http://www.w3.org/2000/xmlns/" && af.namespaceURI !== "http://www.w3.org/XML/1998/namespace" && af.prefix !== "xmlns" && af.prefix !== "xml") {
                    if (af.namespaceURI !== w) {
                        ad = F.rdf.resource("<" + af.namespaceURI + I(af) + ">");
                        aq = F.rdf.literal('"' + af.nodeValue + '"', al);
                        ah.push(F.rdf.triple(ac, ad, aq))
                    } else {
                        if (I(af) === "type") {
                            ad = F.rdf.type;
                            aq = F.rdf.resource("<" + af.nodeValue + ">", {
                                base: aa
                            });
                            ah.push(F.rdf.triple(ac, ad, aq))
                        }
                    }
                }
            }
            for (aj = 0; aj < ap.childNodes.length; aj += 1) {
                af = ap.childNodes[aj];
                if (af.nodeType === 1) {
                    if (af.namespaceURI === w && I(af) === "li") {
                        ad = F.rdf.resource("<" + w + "_" + ae + ">");
                        ae += 1
                    } else {
                        ad = F.rdf.resource("<" + af.namespaceURI + I(af) + ">")
                    }
                    au = G(af, "http://www.w3.org/XML/1998/namespace", "lang") || au;
                    if (au !== null && au !== undefined && au !== "") {
                        al = {
                            lang: au
                        }
                    }
                    if (b(af, w, "resource")) {
                        ag = G(af, w, "resource");
                        aq = F.rdf.resource("<" + ag + ">", {
                            base: aa
                        })
                    } else {
                        if (b(af, w, "nodeID")) {
                            ag = G(af, w, "nodeID");
                            aq = F.rdf.blank("_:" + ag)
                        } else {
                            if (b(af, w, "parseType")) {
                                ab = G(af, w, "parseType");
                                if (ab === "Literal") {
                                    try {
                                        ao = new XMLSerializer();
                                        ag = ao.serializeToString(af.getElementsByTagName("*")[0])
                                    } catch (an) {
                                        ag = "";
                                        for (ai = 0; ai < af.childNodes.length; ai += 1) {
                                            ag += af.childNodes[ai].xml
                                        }
                                    }
                                    aq = F.rdf.literal(ag, {
                                        datatype: w + "XMLLiteral"
                                    })
                                } else {
                                    if (ab === "Resource") {
                                        Y = O(af, false, aa, au);
                                        if (Y.length > 0) {
                                            aq = Y[Y.length - 1].subject;
                                            ah = ah.concat(Y)
                                        } else {
                                            aq = F.rdf.blank("[]")
                                        }
                                    } else {
                                        if (ab === "Collection") {
                                            if (af.getElementsByTagName("*").length > 0) {
                                                for (ai = 0; ai < af.childNodes.length; ai += 1) {
                                                    ag = af.childNodes[ai];
                                                    if (ag.nodeType === 1) {
                                                        X.push(ag)
                                                    }
                                                }
                                                at = F.rdf.blank("[]");
                                                aq = at;
                                                for (ai = 0; ai < X.length; ai += 1) {
                                                    ag = X[ai];
                                                    Y = O(ag, true, aa, au);
                                                    if (Y.length > 0) {
                                                        am = Y[Y.length - 1].subject;
                                                        ah = ah.concat(Y)
                                                    } else {
                                                        am = o(ag)
                                                    }
                                                    ah.push(F.rdf.triple(at, F.rdf.first, am));
                                                    if (ai === X.length - 1) {
                                                        ah.push(F.rdf.triple(at, F.rdf.rest, F.rdf.nil))
                                                    } else {
                                                        ar = F.rdf.blank("[]");
                                                        ah.push(F.rdf.triple(at, F.rdf.rest, ar));
                                                        at = ar
                                                    }
                                                }
                                            } else {
                                                aq = F.rdf.nil
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (b(af, w, "datatype")) {
                                    ag = af.childNodes[0].nodeValue;
                                    aq = F.rdf.literal(ag, {
                                        datatype: G(af, w, "datatype")
                                    })
                                } else {
                                    if (af.getElementsByTagName("*").length > 0) {
                                        for (ai = 0; ai < af.childNodes.length; ai += 1) {
                                            ag = af.childNodes[ai];
                                            if (ag.nodeType === 1) {
                                                Y = O(ag, true, aa, au);
                                                if (Y.length > 0) {
                                                    aq = Y[Y.length - 1].subject;
                                                    ah = ah.concat(Y)
                                                } else {
                                                    aq = o(ag)
                                                }
                                            }
                                        }
                                    } else {
                                        if (af.childNodes.length > 0) {
                                            ag = af.childNodes[0].nodeValue;
                                            aq = F.rdf.literal('"' + ag + '"', al)
                                        } else {
                                            Y = O(af, false, aa, au);
                                            if (Y.length > 0) {
                                                aq = Y[Y.length - 1].subject;
                                                ah = ah.concat(Y)
                                            } else {
                                                aq = F.rdf.blank("[]")
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ah.push(F.rdf.triple(ac, ad, aq));
                    if (b(af, w, "ID")) {
                        ak = F.rdf.resource("<#" + G(af, w, "ID") + ">", {
                            base: aa
                        });
                        ah.push(F.rdf.triple(ak, F.rdf.subject, ac));
                        ah.push(F.rdf.triple(ak, F.rdf.property, ad));
                        ah.push(F.rdf.triple(ak, F.rdf.object, aq))
                    }
                }
            }
            return ah
        },
        Q = function(Y) {
            var X, aa, Z, ab = [];
            if (Y.documentElement.namespaceURI === w && I(Y.documentElement) === "RDF") {
                aa = G(Y.documentElement, "http://www.w3.org/XML/1998/namespace", "lang");
                base = G(Y.documentElement, "http://www.w3.org/XML/1998/namespace", "base") || F.uri.base();
                for (X = 0; X < Y.documentElement.childNodes.length; X += 1) {
                    Z = Y.documentElement.childNodes[X];
                    if (Z.nodeType === 1) {
                        ab = ab.concat(O(Z, true, base, aa))
                    }
                }
            } else {
                ab = O(Y.documentElement, true)
            }
            return ab
        };
    F.typedValue.types["http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"] = {
        regex: /^.*$/m,
        strip: false,
        value: function(X) {
            return X
        }
    };
    F.rdf = function(X) {
        return new F.rdf.fn.init(X)
    };
    F.rdf.fn = F.rdf.prototype = {
        rdfquery: "0.9",
        init: function(X) {
            var Y;
            X = X || {};
            this.parent = X.parent;
            this.union = X.union;
            this.top = this.parent === undefined && this.union === undefined;
            if (this.union === undefined) {
                if (X.databank === undefined) {
                    this.databank = this.parent === undefined ? F.rdf.databank(X.triples, X) : this.parent.databank
                } else {
                    this.databank = X.databank
                }
            } else {
                Y = F.map(this.union, function(Z) {
                    return Z.databank
                });
                Y = F.unique(Y);
                if (Y[1] !== undefined) {
                    this.databank = F.rdf.databank(undefined, {
                        union: Y
                    })
                } else {
                    this.databank = Y[0]
                }
            }
            this.children = [];
            this.partOf = [];
            this.filterExp = X.filter;
            this.alphaMemory = [];
            this.matches = [];
            this.length = 0;
            if (this.filterExp !== undefined) {
                if (!F.isFunction(this.filterExp)) {
                    V(this.databank, this);
                    this.alphaMemory = U(this.databank.triples(), this.filterExp)
                }
            }
            J(this);
            return this
        },
        base: function(X) {
            if (X === undefined) {
                return this.databank.base()
            } else {
                this.databank.base(X);
                return this
            }
        },
        prefix: function(Y, X) {
            if (X === undefined) {
                return this.databank.prefix(Y)
            } else {
                this.databank.prefix(Y, X);
                return this
            }
        },
        add: function(aa, Y) {
            var Z, X;
            if (aa.rdfquery !== undefined) {
                if (aa.top) {
                    X = this.databank.add(aa.databank);
                    Z = F.rdf({
                        parent: this.parent,
                        databank: X
                    });
                    return Z
                } else {
                    if (this.top) {
                        X = aa.databank.add(this.databank);
                        Z = F.rdf({
                            parent: aa.parent,
                            databank: X
                        });
                        return Z
                    } else {
                        if (this.union === undefined) {
                            Z = F.rdf({
                                union: [this, aa]
                            });
                            this.partOf.push(Z);
                            aa.partOf.push(Z);
                            return Z
                        } else {
                            this.union.push(aa);
                            aa.partOf.push(this)
                        }
                    }
                }
            } else {
                if (typeof aa === "string") {
                    Y = F.extend({}, {
                        base: this.base(),
                        namespaces: this.prefix(),
                        source: aa
                    }, Y);
                    aa = F.rdf.pattern(aa, Y)
                }
                if (aa.isFixed()) {
                    this.databank.add(aa.triple(), Y)
                } else {
                    Z = this;
                    this.each(function(ac, ad) {
                        var ab = aa.triple(ad);
                        if (ab !== null) {
                            Z.databank.add(ab, Y)
                        }
                    })
                }
            }
            return this
        },
        remove: function(Y, X) {
            if (typeof Y === "string") {
                X = F.extend({}, {
                    base: this.base(),
                    namespaces: this.prefix()
                }, X);
                Y = F.rdf.pattern(Y, X)
            }
            if (Y.isFixed()) {
                this.databank.remove(Y.triple(), X)
            } else {
                query = this;
                this.each(function(aa, ab) {
                    var Z = Y.triple(ab);
                    if (Z !== null) {
                        query.databank.remove(Z, X)
                    }
                })
            }
            return this
        },
        load: function(Y, X) {
            this.databank.load(Y, X);
            return this
        },
        except: function(X) {
            return F.rdf({
                databank: this.databank.except(X.databank)
            })
        },
        where: function(Z, Y) {
            var ac, ab, aa, X;
            Y = Y || {};
            if (typeof Z === "string") {
                ab = Y.base || this.base();
                aa = F.extend({}, this.prefix(), Y.namespaces || {});
                X = Y.optional || false;
                Z = F.rdf.pattern(Z, {
                    namespaces: aa,
                    base: ab,
                    optional: X
                })
            }
            ac = F.rdf(F.extend({}, Y, {
                parent: this,
                filter: Z
            }));
            this.children.push(ac);
            return ac
        },
        optional: function(Y, X) {
            return this.where(Y, F.extend({}, X || {}, {
                optional: true
            }))
        },
        about: function(Y, X) {
            return this.where(Y + " ?property ?value", X)
        },
        filter: function(Z, aa) {
            var X, Y;
            if (typeof Z === "string") {
                if (aa.constructor === RegExp) {
                    X = function() {
                        return aa.test(this[Z].value)
                    }
                } else {
                    X = function() {
                        return this[Z].type === "literal" ? this[Z].value === aa : this[Z] === aa
                    }
                }
            } else {
                X = Z
            }
            Y = F.rdf({
                parent: this,
                filter: X
            });
            this.children.push(Y);
            return Y
        },
        select: function(aa) {
            var Z = [],
                Y, X;
            for (Y = 0; Y < this.length; Y += 1) {
                if (aa === undefined) {
                    Z[Y] = this[Y]
                } else {
                    Z[Y] = {};
                    for (X = 0; X < aa.length; X += 1) {
                        Z[Y][aa[X]] = this[Y][aa[X]]
                    }
                }
            }
            return Z
        },
        describe: function(ab) {
            var Y, X, aa, Z = [];
            for (Y = 0; Y < ab.length; Y += 1) {
                aa = ab[Y];
                if (aa.substring(0, 1) === "?") {
                    aa = aa.substring(1);
                    for (X = 0; X < this.length; X += 1) {
                        Z.push(this[X][aa])
                    }
                } else {
                    Z.push(aa)
                }
            }
            return this.databank.describe(Z)
        },
        eq: function(X) {
            return this.filter(function(Y) {
                return Y === X
            })
        },
        reset: function() {
            var X = this;
            while (X.parent !== undefined) {
                X = X.parent
            }
            return X
        },
        end: function() {
            return this.parent
        },
        size: function() {
            return this.length
        },
        sources: function() {
            return F(F.map(this.matches, function(X) {
                return [X.triples]
            }))
        },
        dump: function(X) {
            var Y = F.map(this.matches, function(Z) {
                return Z.triples
            });
            X = F.extend({
                namespaces: this.databank.namespaces,
                base: this.databank.base
            }, X || {});
            return F.rdf.dump(Y, X)
        },
        get: function(X) {
            return (X === undefined) ? F.makeArray(this) : this[X]
        },
        each: function(X) {
            F.each(this.matches, function(Z, Y) {
                X.call(Y.bindings, Z, Y.bindings, Y.triples)
            });
            return this
        },
        map: function(X) {
            return F(F.map(this.matches, function(Y, Z) {
                return X.call(Y.bindings, Z, Y.bindings, Y.triples)
            }))
        },
        jquery: function() {
            return F(this)
        }
    };
    F.rdf.fn.init.prototype = F.rdf.fn;
    F.rdf.gleaners = [];
    F.rdf.dump = function(ac, X) {
        var Z = F.extend({}, F.rdf.dump.defaults, X || {}),
            ab = Z.format,
            Y = Z.serialize,
            aa;
        if (ab === "application/json") {
            aa = n(ac, Z);
            return Y ? F.toJSON(aa) : aa
        } else {
            if (ab === "application/rdf+xml") {
                aa = L(ac, Z);
                if (Y) {
                    if (aa.xml) {
                        return aa.xml.replace(/\s+$/, "")
                    } else {
                        serializer = new XMLSerializer();
                        return serializer.serializeToString(aa)
                    }
                } else {
                    return aa
                }
            } else {
                throw "Unrecognised dump format: " + ab + ". Expected application/json or application/rdf+xml."
            }
        }
    };
    F.rdf.dump.defaults = {
        format: "application/json",
        serialize: false,
        namespaces: {}
    };
    F.fn.rdf = function() {
        var X = [];
        if (F(this)[0] && F(this)[0].nodeType === 9) {
            return F(this).children("*").rdf()
        } else {
            if (F(this).length > 0) {
                X = F(this).map(function(Y, Z) {
                    return F.map(F.rdf.gleaners, function(aa) {
                        return aa.call(F(Z))
                    })
                });
                return F.rdf({
                    triples: X,
                    namespaces: F(this).xmlns()
                })
            } else {
                return F.rdf()
            }
        }
    };
    F.extend(F.expr[":"], {
        about: function(Y, aa, X) {
            var Z = F(Y),
                ac = X[3] ? Z.safeCurie(X[3]) : null,
                ab = false;
            F.each(F.rdf.gleaners, function(ad, ae) {
                ab = ae.call(Z, {
                    about: ac
                });
                if (ab) {
                    return null
                }
            });
            return ab
        },
        type: function(Y, aa, X) {
            var Z = F(Y),
                ab = X[3] ? Z.curie(X[3]) : null,
                ac = false;
            F.each(F.rdf.gleaners, function(ad, ae) {
                if (ae.call(Z, {
                        type: ab
                    })) {
                    ac = true;
                    return null
                }
            });
            return ac
        }
    });
    F.rdf.databank = function(Y, X) {
        return new F.rdf.databank.fn.init(Y, X)
    };
    F.rdf.databank.fn = F.rdf.databank.prototype = {
        init: function(Z, X) {
            var Y;
            Z = Z || [];
            X = X || {};
            this.id = K();
            if (X.union === undefined) {
                this.queries = {};
                this.tripleStore = {};
                this.objectStore = {};
                this.baseURI = X.base || F.uri.base();
                this.namespaces = F.extend({}, X.namespaces || {});
                for (Y = 0; Y < Z.length; Y += 1) {
                    this.add(Z[Y])
                }
            } else {
                this.union = X.union
            }
            return this
        },
        base: function(X) {
            if (this.union === undefined) {
                if (X === undefined) {
                    return this.baseURI
                } else {
                    this.baseURI = X;
                    return this
                }
            } else {
                if (X === undefined) {
                    return this.union[0].base()
                } else {
                    F.each(this.union, function(Z, Y) {
                        Y.base(X)
                    });
                    return this
                }
            }
        },
        prefix: function(Z, X) {
            var Y = {};
            if (this.union === undefined) {
                if (Z === undefined) {
                    return this.namespaces
                } else {
                    if (X === undefined) {
                        return this.namespaces[Z]
                    } else {
                        this.namespaces[Z] = X;
                        return this
                    }
                }
            } else {
                if (X === undefined) {
                    F.each(this.union, function(ab, aa) {
                        F.extend(Y, aa.prefix())
                    });
                    if (Z === undefined) {
                        return Y
                    } else {
                        return Y[Z]
                    }
                } else {
                    F.each(this.union, function(ab, aa) {
                        aa.prefix(Z, X)
                    });
                    return this
                }
            }
        },
        add: function(ab, Y) {
            var aa = (Y && Y.base) || this.base(),
                Z = F.extend({}, this.prefix(), (Y && Y.namespaces) || {}),
                X;
            if (ab === this) {
                return this
            } else {
                if (ab.tripleStore !== undefined) {
                    if (this.union === undefined) {
                        X = F.rdf.databank(undefined, {
                            union: [this, ab]
                        });
                        return X
                    } else {
                        this.union.push(ab);
                        return this
                    }
                } else {
                    if (typeof ab === "string") {
                        ab = F.rdf.triple(ab, {
                            namespaces: Z,
                            base: aa,
                            source: ab
                        })
                    }
                    if (this.union === undefined) {
                        if (this.tripleStore[ab.subject] === undefined) {
                            this.tripleStore[ab.subject] = []
                        }
                        if (F.inArray(ab, this.tripleStore[ab.subject]) === -1) {
                            this.tripleStore[ab.subject].push(ab);
                            if (ab.object.type === "uri" || ab.object.type === "bnode") {
                                if (this.objectStore[ab.object] === undefined) {
                                    this.objectStore[ab.object] = []
                                }
                                this.objectStore[ab.object].push(ab)
                            }
                            e(this, ab)
                        }
                    } else {
                        F.each(this.union, function(ad, ac) {
                            ac.add(ab)
                        })
                    }
                    return this
                }
            }
        },
        remove: function(ac, Z) {
            var ab = (Z && Z.base) || this.base(),
                aa = F.extend({}, this.prefix(), (Z && Z.namespaces) || {}),
                ad, X, Y;
            if (typeof ac === "string") {
                ac = F.rdf.triple(ac, {
                    namespaces: aa,
                    base: ab,
                    source: ac
                })
            }
            ad = this.tripleStore[ac.subject];
            if (ad !== undefined) {
                ad.splice(F.inArray(ac, ad), 1)
            }
            if (ac.object.type === "uri" || ac.object.type === "bnode") {
                X = this.objectStore[ac.object];
                if (X !== undefined) {
                    X.splice(F.inArray(ac, X), 1)
                }
            }
            s(this, ac);
            return this
        },
        except: function(Y) {
            var X = Y.tripleStore,
                Z = [];
            F.each(this.tripleStore, function(ab, ac) {
                var aa = X[ab];
                if (aa === undefined) {
                    Z = Z.concat(ac)
                } else {
                    F.each(ac, function(ae, ad) {
                        if (F.inArray(ad, aa) === -1) {
                            Z.push(ad)
                        }
                    })
                }
            });
            return F.rdf.databank(Z)
        },
        triples: function() {
            var X = [];
            if (this.union === undefined) {
                F.each(this.tripleStore, function(Z, Y) {
                    X = X.concat(Y)
                })
            } else {
                F.each(this.union, function(Z, Y) {
                    X = X.concat(Y.triples().get())
                });
                X = F.unique(X)
            }
            return F(X)
        },
        size: function() {
            return this.triples().length
        },
        describe: function(aa) {
            var Y, Z, X, ac = {},
                ab = [];
            while (aa.length > 0) {
                Z = aa.pop();
                if (ac[Z] === undefined) {
                    if (Z.value === undefined) {
                        Z = F.rdf.resource(Z)
                    }
                    if (this.tripleStore[Z] !== undefined) {
                        for (Y = 0; Y < this.tripleStore[Z].length; Y += 1) {
                            X = this.tripleStore[Z][Y];
                            ab.push(X);
                            if (X.object.type === "bnode") {
                                aa.push(X.object)
                            }
                        }
                    }
                    if (this.objectStore[Z] !== undefined) {
                        for (Y = 0; Y < this.objectStore[Z].length; Y += 1) {
                            X = this.objectStore[Z][Y];
                            ab.push(X);
                            if (X.subject.type === "bnode") {
                                aa.push(X.subject)
                            }
                        }
                    }
                    ac[Z] = true
                }
            }
            return F.unique(ab)
        },
        dump: function(X) {
            X = F.extend({
                namespaces: this.namespaces,
                base: this.base
            }, X || {});
            return F.rdf.dump(this.triples(), X)
        },
        load: function(Y) {
            var X, Z;
            if (Y.ownerDocument !== undefined) {
                Z = Q(Y)
            } else {
                Z = W(Y)
            }
            for (X = 0; X < Z.length; X += 1) {
                this.add(Z[X])
            }
            return this
        },
        toString: function() {
            return "[Databank with " + this.size() + " triples]"
        }
    };
    F.rdf.databank.fn.init.prototype = F.rdf.databank.fn;
    F.rdf.pattern = function(ab, ad, aa, Z) {
        var ac, X, Y;
        if (aa === undefined) {
            Z = ad || {};
            X = F.trim(ab).match(g);
            if (X.length === 3 || (X.length === 4 && X[3] === ".")) {
                ab = X[0];
                ad = X[1];
                aa = X[2]
            } else {
                throw "Bad Pattern: Couldn't parse string " + ab
            }
            Y = (Z.optional === undefined) ? F.rdf.pattern.defaults.optional : Z.optional
        }
        if (r[ab] && r[ab][ad] && r[ab][ad][aa] && r[ab][ad][aa][Y]) {
            return r[ab][ad][aa][Y]
        }
        ac = new F.rdf.pattern.fn.init(ab, ad, aa, Z);
        if (r[ac.subject] && r[ac.subject][ac.property] && r[ac.subject][ac.property][ac.object] && r[ac.subject][ac.property][ac.object][ac.optional]) {
            return r[ac.subject][ac.property][ac.object][ac.optional]
        } else {
            if (r[ac.subject] === undefined) {
                r[ac.subject] = {}
            }
            if (r[ac.subject][ac.property] === undefined) {
                r[ac.subject][ac.property] = {}
            }
            if (r[ac.subject][ac.property][ac.object] === undefined) {
                r[ac.subject][ac.property][ac.object] = {}
            }
            r[ac.subject][ac.property][ac.object][ac.optional] = ac;
            return ac
        }
    };
    F.rdf.pattern.fn = F.rdf.pattern.prototype = {
        init: function(Y, aa, ab, X) {
            var Z = F.extend({}, F.rdf.pattern.defaults, X);
            this.subject = Y.toString().substring(0, 1) === "?" ? Y : l(Y, Z);
            this.property = aa.toString().substring(0, 1) === "?" ? aa : R(aa, Z);
            this.object = ab.toString().substring(0, 1) === "?" ? ab : N(ab, Z);
            this.optional = Z.optional;
            return this
        },
        fill: function(aa) {
            var X = this.subject,
                Y = this.property,
                Z = this.object;
            if (typeof X === "string" && aa[X.substring(1)]) {
                X = aa[X.substring(1)]
            }
            if (typeof Y === "string" && aa[Y.substring(1)]) {
                Y = aa[Y.substring(1)]
            }
            if (typeof Z === "string" && aa[Z.substring(1)]) {
                Z = aa[Z.substring(1)]
            }
            return F.rdf.pattern(X, Y, Z, {
                optional: this.optional
            })
        },
        exec: function(Y) {
            var X = {};
            X = a(Y.subject, this.subject, X);
            if (X === null) {
                return null
            }
            X = a(Y.property, this.property, X);
            if (X === null) {
                return null
            }
            X = a(Y.object, this.object, X);
            return X
        },
        isFixed: function() {
            return typeof this.subject !== "string" && typeof this.property !== "string" && typeof this.object !== "string"
        },
        triple: function(Y) {
            var X = this;
            if (!this.isFixed()) {
                X = this.fill(Y)
            }
            if (X.isFixed()) {
                return F.rdf.triple(X.subject, X.property, X.object, {
                    source: this.toString()
                })
            } else {
                return null
            }
        },
        toString: function() {
            return this.subject + " " + this.property + " " + this.object
        }
    };
    F.rdf.pattern.fn.init.prototype = F.rdf.pattern.fn;
    F.rdf.pattern.defaults = {
        base: F.uri.base(),
        namespaces: {},
        optional: false
    };
    F.rdf.triple = function(aa, ac, Z, Y) {
        var ad, ab, X;
        if (Z === undefined) {
            Y = ac;
            X = F.trim(aa).match(g);
            if (X.length === 3 || (X.length === 4 && X[3] === ".")) {
                aa = X[0];
                ac = X[1];
                Z = X[2]
            } else {
                throw "Bad Triple: Couldn't parse string " + aa
            }
        }
        ab = (Y && Y.graph) || "";
        if (C[ab] && C[ab][aa] && C[ab][aa][ac] && C[ab][aa][ac][Z]) {
            return C[ab][aa][ac][Z]
        }
        ad = new F.rdf.triple.fn.init(aa, ac, Z, Y);
        ab = ad.graph || "";
        if (C[ab] && C[ab][ad.subject] && C[ab][ad.subject][ad.property] && C[ab][ad.subject][ad.property][ad.object]) {
            return C[ab][ad.subject][ad.property][ad.object]
        } else {
            if (C[ab] === undefined) {
                C[ab] = {}
            }
            if (C[ab][ad.subject] === undefined) {
                C[ab][ad.subject] = {}
            }
            if (C[ab][ad.subject][ad.property] === undefined) {
                C[ab][ad.subject][ad.property] = {}
            }
            C[ab][ad.subject][ad.property][ad.object] = ad;
            return ad
        }
    };
    F.rdf.triple.fn = F.rdf.triple.prototype = {
        init: function(Y, aa, ab, X) {
            var Z;
            Z = F.extend({}, F.rdf.triple.defaults, X);
            this.subject = l(Y, Z);
            this.property = R(aa, Z);
            this.object = N(ab, Z);
            this.graph = Z.graph === undefined ? undefined : l(Z.graph, Z);
            this.source = Z.source;
            return this
        },
        isFixed: function() {
            return true
        },
        triple: function(X) {
            return this
        },
        dump: function() {
            var Z = {},
                X = this.subject.value.toString(),
                Y = this.property.value.toString();
            Z[X] = {};
            Z[X][Y] = this.object.dump();
            return Z
        },
        toString: function() {
            return this.subject + " " + this.property + " " + this.object + " ."
        }
    };
    F.rdf.triple.fn.init.prototype = F.rdf.triple.fn;
    F.rdf.triple.defaults = {
        base: F.uri.base(),
        source: [document],
        namespaces: {}
    };
    F.rdf.resource = function(Z, X) {
        var Y;
        if (f[Z]) {
            return f[Z]
        }
        Y = new F.rdf.resource.fn.init(Z, X);
        if (f[Y]) {
            return f[Y]
        } else {
            f[Y] = Y;
            return Y
        }
    };
    F.rdf.resource.fn = F.rdf.resource.prototype = {
        type: "uri",
        value: undefined,
        init: function(ac, Y) {
            var X, ab, aa, Z;
            if (typeof ac === "string") {
                X = z.exec(ac);
                Z = F.extend({}, F.rdf.resource.defaults, Y);
                if (X !== null) {
                    this.value = F.uri.resolve(X[1].replace(/\\>/g, ">"), Z.base)
                } else {
                    if (ac.substring(0, 1) === ":") {
                        aa = Z.namespaces[""];
                        if (aa === undefined) {
                            throw "Malformed Resource: No namespace binding for default namespace in " + ac
                        } else {
                            this.value = F.uri.resolve(aa + ac.substring(1))
                        }
                    } else {
                        if (ac.substring(ac.length - 1) === ":") {
                            ab = ac.substring(0, ac.length - 1);
                            aa = Z.namespaces[ab];
                            if (aa === undefined) {
                                throw "Malformed Resource: No namespace binding for prefix " + ab + " in " + ac
                            } else {
                                this.value = F.uri.resolve(aa)
                            }
                        } else {
                            try {
                                this.value = F.curie(ac, {
                                    namespaces: Z.namespaces
                                })
                            } catch (ad) {
                                throw "Malformed Resource: Bad format for resource " + ad
                            }
                        }
                    }
                }
            } else {
                this.value = ac
            }
            return this
        },
        dump: function() {
            return {
                type: "uri",
                value: this.value.toString()
            }
        },
        toString: function() {
            return "<" + this.value + ">"
        }
    };
    F.rdf.resource.fn.init.prototype = F.rdf.resource.fn;
    F.rdf.resource.defaults = {
        base: F.uri.base(),
        namespaces: {}
    };
    F.rdf.type = F.rdf.resource("<" + w + "type>");
    F.rdf.label = F.rdf.resource("<" + v + "label>");
    F.rdf.first = F.rdf.resource("<" + w + "first>");
    F.rdf.rest = F.rdf.resource("<" + w + "rest>");
    F.rdf.nil = F.rdf.resource("<" + w + "nil>");
    F.rdf.subject = F.rdf.resource("<" + w + "subject>");
    F.rdf.property = F.rdf.resource("<" + w + "property>");
    F.rdf.object = F.rdf.resource("<" + w + "object>");
    F.rdf.blank = function(X) {
        var Y;
        if (c[X]) {
            return c[X]
        }
        Y = new F.rdf.blank.fn.init(X);
        if (c[Y]) {
            return c[Y]
        } else {
            c[Y] = Y;
            return Y
        }
    };
    F.rdf.blank.fn = F.rdf.blank.prototype = {
        type: "bnode",
        value: undefined,
        id: undefined,
        init: function(X) {
            if (X === "[]") {
                this.id = k();
                this.value = "_:" + this.id
            } else {
                if (X.substring(0, 2) === "_:") {
                    this.id = X.substring(2);
                    this.value = X
                } else {
                    throw "Malformed Blank Node: " + X + " is not a legal format for a blank node"
                }
            }
            return this
        },
        dump: function() {
            return {
                type: "bnode",
                value: this.value
            }
        },
        toString: function() {
            return this.value
        }
    };
    F.rdf.blank.fn.init.prototype = F.rdf.blank.fn;
    F.rdf.literal = function(Z, X) {
        var Y;
        if (t[Z]) {
            return t[Z]
        }
        Y = new F.rdf.literal.fn.init(Z, X);
        if (t[Y]) {
            return t[Y]
        } else {
            t[Y] = Y;
            return Y
        }
    };
    F.rdf.literal.fn = F.rdf.literal.prototype = {
        type: "literal",
        value: undefined,
        lang: undefined,
        datatype: undefined,
        init: function(ab, Y) {
            var X, Z, aa = F.extend({}, F.rdf.literal.defaults, Y);
            if (aa.lang !== undefined && aa.datatype !== undefined) {
                throw "Malformed Literal: Cannot define both a language and a datatype for a literal (" + ab + ")"
            }
            if (aa.datatype !== undefined) {
                Z = F.safeCurie(aa.datatype, {
                    namespaces: aa.namespaces
                });
                F.extend(this, F.typedValue(ab.toString(), Z))
            } else {
                if (aa.lang !== undefined) {
                    this.value = ab.toString();
                    this.lang = aa.lang
                } else {
                    if (typeof ab === "boolean") {
                        F.extend(this, F.typedValue(ab.toString(), j + "boolean"))
                    } else {
                        if (typeof ab === "number") {
                            F.extend(this, F.typedValue(ab.toString(), j + "double"))
                        } else {
                            if (ab === "true" || ab === "false") {
                                F.extend(this, F.typedValue(ab, j + "boolean"))
                            } else {
                                if (F.typedValue.valid(ab, j + "integer")) {
                                    F.extend(this, F.typedValue(ab, j + "integer"))
                                } else {
                                    if (F.typedValue.valid(ab, j + "decimal")) {
                                        F.extend(this, F.typedValue(ab, j + "decimal"))
                                    } else {
                                        if (F.typedValue.valid(ab, j + "double") && !/^\s*([\-\+]?INF|NaN)\s*$/.test(ab)) {
                                            F.extend(this, F.typedValue(ab, j + "double"))
                                        } else {
                                            X = T.exec(ab);
                                            if (X !== null) {
                                                this.value = (X[2] || X[4]).replace(/\\"/g, '"');
                                                if (X[9]) {
                                                    Z = F.rdf.resource(X[9], aa);
                                                    F.extend(this, F.typedValue(this.value, Z.value))
                                                } else {
                                                    if (X[7]) {
                                                        this.lang = X[7]
                                                    }
                                                }
                                            } else {
                                                throw "Malformed Literal: Couldn't recognise the value " + ab
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return this
        },
        dump: function() {
            var X = {
                type: "literal",
                value: this.value.toString()
            };
            if (this.lang !== undefined) {
                X.lang = this.lang
            } else {
                if (this.datatype !== undefined) {
                    X.datatype = this.datatype.toString()
                }
            }
            return X
        },
        toString: function() {
            var X = '"' + this.value + '"';
            if (this.lang !== undefined) {
                X += "@" + this.lang
            } else {
                if (this.datatype !== undefined) {
                    X += "^^<" + this.datatype + ">"
                }
            }
            return X
        }
    };
    F.rdf.literal.fn.init.prototype = F.rdf.literal.fn;
    F.rdf.literal.defaults = {
        base: F.uri.base(),
        namespaces: {},
        datatype: undefined,
        lang: undefined
    }
})(jQuery);
(function(h) {
    var D = {
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            xsd: "http://www.w3.org/2001/XMLSchema#"
        },
        B = D.rdf + "XMLLiteral",
        k = h.fn.curie.defaults,
        v = /\s([^ =]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^ >]+))/g,
        n = h.rdf.resource("<>"),
        z = function(H) {
            var F = "",
                E, G;
            if (!/&/.test(H)) {
                return H
            }
            while (H.length > 0) {
                E = /([^&]*)(&([^;]+);)(.*)/g.exec(H);
                if (E === null) {
                    F += H;
                    break
                }
                F += E[1];
                G = E[3];
                H = E[4];
                if (G.charAt(0) === "#") {
                    if (G.charAt(1) === "x") {
                        F += String.fromCharCode(parseInt(G.substring(2), 16))
                    } else {
                        F += String.fromCharCode(parseInt(G.substring(1), 10))
                    }
                } else {
                    switch (G) {
                        case "amp":
                            F += "&";
                            break;
                        case "nbsp":
                            F += String.fromCharCode(160);
                            break;
                        case "quot":
                            F += '"';
                            break;
                        case "apos":
                            F += "'";
                            break;
                        default:
                            F += "&" + G + ";"
                    }
                }
            }
            return F
        },
        u = function(F) {
            var G, K, M, O, E, N, J, H, L = {},
                I = {};
            K = F[0];
            L[":length"] = 0;
            if (K.attributes && K.attributes.getNamedItemNS) {
                J = K.attributes;
                for (G = 0; G < J.length; G += 1) {
                    M = J[G];
                    if (/^xmlns(:(.+))?$/.test(M.nodeName) && M.nodeValue !== "") {
                        H = /^xmlns(:(.+))?$/.exec(M.nodeName)[2] || "";
                        L[H] = h.uri(M.nodeValue);
                        L[":length"] += 1
                    } else {
                        if (/rel|rev|lang|xml:lang/.test(M.nodeName)) {
                            I[M.nodeName] = M.nodeValue === "" ? undefined : M.nodeValue
                        } else {
                            if (/about|href|src|resource|property|typeof|content|datatype/.test(M.nodeName)) {
                                I[M.nodeName] = M.nodeValue === null ? undefined : M.nodeValue
                            }
                        }
                    }
                }
            } else {
                O = /<[^>]+>/.exec(K.outerHTML);
                M = v.exec(O);
                while (M !== null) {
                    E = M[1];
                    N = M[2] || M[3] || M[4];
                    if (/^xmlns/.test(E) && E !== "xmlns:" && N !== "") {
                        H = /^xmlns(:(.+))?$/.exec(E)[2] || "";
                        L[H] = h.uri(N);
                        L[":length"] += 1
                    } else {
                        if (/about|href|src|resource|property|typeof|content|datatype|rel|rev|lang|xml:lang/.test(E)) {
                            I[E] = z(N)
                        }
                    }
                    M = v.exec(O)
                }
                v.lastIndex = 0
            }
            return {
                atts: I,
                namespaces: L
            }
        },
        y = function(F, E) {
            var G = F[0].getAttribute(E);
            if (E === "rev" || E === "rel" || E === "lang" || E === "xml:lang") {
                G = G === "" ? undefined : G
            }
            return G === null ? undefined : G
        },
        e = function(E) {
            return h.rdf.resource(E)
        },
        d = function(F, G, E) {
            if (F.substring(0, 2) === "_:") {
                return h.rdf.blank(F)
            } else {
                try {
                    return e(h.curie(F, E))
                } catch (H) {
                    return undefined
                }
            }
        },
        g = function(I, G, F) {
            var E = /^\[([^\]]+)\]$/.exec(I),
                H = F.base || G.base();
            return E ? d(E[1], G, F) : e(h.uri(I, H))
        },
        o = function(H, G, E) {
            var F, I, J = [];
            H = H && H.split ? H.split(/[ \t\n\r\x0C]+/g) : [];
            for (F = 0; F < H.length; F += 1) {
                if (H[F] !== "") {
                    I = d(H[F], G, E);
                    if (I !== undefined) {
                        J.push(I)
                    }
                }
            }
            return J
        },
        f = function(H, J, E) {
            var F, G, I = [];
            J = J.type === "uri" ? J : h.rdf.resource(J, E);
            H = H && H.split ? H.split(/\s+/) : [];
            for (F = 0; F < H.length; F += 1) {
                if (H[F] !== "") {
                    G = d(H[F], null, E);
                    if (G !== J) {
                        I.push(H[F])
                    }
                }
            }
            return I.reverse().join(" ")
        },
        x = function(I, F, H) {
            var G, J, K, E;
            F = F || {};
            K = F.atts || u(I).atts;
            G = H === undefined ? K.rel !== undefined || K.rev !== undefined : H;
            J = K.resource;
            J = J === undefined ? K.href : J;
            if (J === undefined) {
                J = G ? h.rdf.blank("[]") : J
            } else {
                E = F.curieOptions || h.extend({}, k, {
                    namespaces: I.xmlns()
                });
                J = g(J, I, E)
            }
            return J
        },
        r = function(K, G, J) {
            var I, L, E, F, H = false;
            G = G || {};
            L = G.atts || u(K).atts;
            E = G.curieOptions || h.extend({}, k, {
                namespaces: K.xmlns(),
                base: K.base()
            });
            I = J === undefined ? L.rel !== undefined || L.rev !== undefined : J;
            if (L.about !== undefined) {
                F = g(L.about, K, E)
            }
            if (F === undefined && L.src !== undefined) {
                F = g(L.src, K, E)
            }
            if (!I && F === undefined && L.resource !== undefined) {
                F = g(L.resource, K, E)
            }
            if (!I && F === undefined && L.href !== undefined) {
                F = g(L.href, K, E)
            }
            if (F === undefined) {
                if (/head|body/i.test(K[0].nodeName)) {
                    F = n
                } else {
                    if (L["typeof"] !== undefined) {
                        F = h.rdf.blank("[]")
                    } else {
                        if (K[0].parentNode.nodeType === 1) {
                            F = G.object || x(K.parent()) || r(K.parent()).subject;
                            H = !I && L.property === undefined
                        } else {
                            F = n
                        }
                    }
                }
            }
            return {
                subject: F,
                skip: H
            }
        },
        s = function(F, E) {
            var G;
            E = E || {};
            if (E.atts) {
                G = E.atts.lang;
                G = G || E.atts["xml:lang"]
            } else {
                G = F[0].getAttribute("lang");
                G = (G === null || G === "") ? F[0].getAttribute("xml:lang") : G;
                G = (G === null || G === "") ? undefined : G
            }
            if (G === undefined) {
                if (E.lang) {
                    G = E.lang
                } else {
                    if (F[0].parentNode.nodeType === 1) {
                        G = s(F.parent())
                    }
                }
            }
            return G
        },
        p = function(E) {
            switch (E) {
                case "<":
                    return "&lt;";
                case '"':
                    return "&quot;";
                case "&":
                    return "&amp;"
            }
        },
        w = function(F, G) {
            var H, I = "",
                J, L, E, K, M;
            F.contents().each(function() {
                var N = h(this),
                    O = N[0];
                if (O.nodeType === 1) {
                    E = O.nodeName.toLowerCase();
                    I += "<" + E;
                    if (O.outerHTML) {
                        M = /<[^>]+>/.exec(O.outerHTML);
                        L = v.exec(M);
                        while (L !== null) {
                            if (!/^jQuery/.test(L[1])) {
                                I += " " + L[1] + "=";
                                I += L[2] ? L[3] : '"' + L[1] + '"'
                            }
                            L = v.exec(M)
                        }
                        v.lastIndex = 0
                    } else {
                        J = O.attributes;
                        for (H = 0; H < J.length; H += 1) {
                            L = J.item(H);
                            I += " " + L.nodeName + '="';
                            I += L.nodeValue.replace(/[<"&]/g, p);
                            I += '"'
                        }
                    }
                    if (!G) {
                        K = N.xmlns("");
                        if (K !== undefined && N.attr("xmlns") === undefined) {
                            I += ' xmlns="' + K + '"'
                        }
                    }
                    I += ">";
                    I += w(N, true);
                    I += "</" + E + ">"
                } else {
                    if (O.nodeType === 8) {
                        I += "<!--";
                        I += O.nodeValue;
                        I += "-->"
                    } else {
                        I += O.nodeValue
                    }
                }
            });
            return I
        },
        C = function(G) {
            var V, J, E, Z, Q, U, P, X, W, N, K, H, R, O, L, T = [],
                F, S, M, Y, I = this.children();
            G = G || {};
            O = G.forward || [];
            L = G.backward || [];
            F = u(this);
            S = F.atts;
            G.atts = S;
            M = G.namespaces || this.xmlns();
            if (F.namespaces[":length"] > 0) {
                M = h.extend({}, M);
                for (Y in F.namespaces) {
                    if (Y !== ":length") {
                        M[Y] = F.namespaces[Y]
                    }
                }
            }
            G.curieOptions = h.extend({}, k, {
                namespaces: M,
                base: this.base()
            });
            J = r(this, G);
            Z = s(this, G);
            if (J.skip) {
                H = G.forward;
                R = G.backward;
                J = G.subject;
                E = G.object
            } else {
                J = J.subject;
                if (O.length > 0 || L.length > 0) {
                    N = G.subject || r(this.parent()).subject;
                    for (V = 0; V < O.length; V += 1) {
                        W = h.rdf.triple(N, O[V], J, {
                            source: this[0]
                        });
                        T.push(W)
                    }
                    for (V = 0; V < L.length; V += 1) {
                        W = h.rdf.triple(J, L[V], N, {
                            source: this[0]
                        });
                        T.push(W)
                    }
                }
                E = x(this, G);
                P = o(S["typeof"], this, G.curieOptions);
                for (V = 0; V < P.length; V += 1) {
                    W = h.rdf.triple(J, h.rdf.type, P[V], {
                        source: this[0]
                    });
                    T.push(W)
                }
                K = o(S.property, this, G.curieOptions);
                if (K.length > 0) {
                    Q = S.datatype;
                    U = S.content;
                    if (Q !== undefined && Q !== "") {
                        Q = h.curie(Q, G.curieOptions);
                        if (Q === B) {
                            X = h.rdf.literal(w(this), {
                                datatype: B
                            })
                        } else {
                            if (U !== undefined) {
                                X = h.rdf.literal(U, {
                                    datatype: Q
                                })
                            } else {
                                X = h.rdf.literal(this.text(), {
                                    datatype: Q
                                })
                            }
                        }
                    } else {
                        if (U !== undefined) {
                            if (Z === undefined) {
                                X = h.rdf.literal('"' + U + '"')
                            } else {
                                X = h.rdf.literal(U, {
                                    lang: Z
                                })
                            }
                        } else {
                            if (I.length === 0 || Q === "") {
                                Z = s(this, G);
                                if (Z === undefined) {
                                    X = h.rdf.literal('"' + this.text() + '"')
                                } else {
                                    X = h.rdf.literal(this.text(), {
                                        lang: Z
                                    })
                                }
                            } else {
                                X = h.rdf.literal(w(this), {
                                    datatype: B
                                })
                            }
                        }
                    }
                    for (V = 0; V < K.length; V += 1) {
                        W = h.rdf.triple(J, K[V], X, {
                            source: this[0]
                        });
                        T.push(W)
                    }
                }
                H = o(S.rel, this, G.curieOptions);
                R = o(S.rev, this, G.curieOptions);
                if (S.resource !== undefined || S.href !== undefined) {
                    if (H !== undefined) {
                        for (V = 0; V < H.length; V += 1) {
                            W = h.rdf.triple(J, H[V], E, {
                                source: this[0]
                            });
                            T.push(W)
                        }
                    }
                    H = [];
                    if (R !== undefined) {
                        for (V = 0; V < R.length; V += 1) {
                            W = h.rdf.triple(E, R[V], J, {
                                source: this[0]
                            });
                            T.push(W)
                        }
                    }
                    R = []
                }
            }
            I.each(function() {
                T = T.concat(C.call(h(this), {
                    forward: H,
                    backward: R,
                    subject: J,
                    object: E || J,
                    lang: Z,
                    namespaces: M
                }))
            });
            return T
        },
        t = function(E) {
            var F, G;
            if (E && E.about !== undefined) {
                G = u(this).atts;
                if (E.about === null) {
                    return G.property !== undefined || G.rel !== undefined || G.rev !== undefined || G["typeof"] !== undefined
                } else {
                    return r(this, {
                        atts: G
                    }).subject.value === E.about
                }
            } else {
                if (E && E.type !== undefined) {
                    F = y(this, "typeof");
                    if (F !== undefined) {
                        return E.type === null ? true : this.curie(F) === E.type
                    }
                    return false
                } else {
                    return C.call(this)
                }
            }
        },
        A = 1,
        q = function(I, F, H) {
            var E, G, J;
            try {
                G = I.createCurie(H)
            } catch (K) {
                if (H.toString() === B) {
                    I.attr("xmlns:rdf", D.rdf);
                    G = "rdf:XMLLiteral"
                } else {
                    E = /^(.+[\/#])([^#]+)$/.exec(H);
                    I.attr("xmlns:ns" + A, E[1]);
                    G = "ns" + A + ":" + E[2];
                    A += 1
                }
            }
            J = y(I, F);
            if (J !== undefined) {
                if (h.inArray(G, J.split(/\s+/)) === -1) {
                    I.attr(F, J + " " + G)
                }
            } else {
                I.attr(F, G)
            }
        },
        m = function(G, E, H) {
            var F;
            if (H.type === "bnode") {
                F = "[_:" + H.id + "]"
            } else {
                F = h(G).base().relative(H.value)
            }
            G.attr(E, F)
        },
        b = function(G, E) {
            var F = r(G).subject;
            if (E !== F) {
                m(G, "about", E)
            }
            G.removeData("rdfa.subject")
        },
        c = function(F, E) {
            var G = x(F);
            if (E !== G) {
                m(F, "resource", E)
            }
            F.removeData("rdfa.objectResource")
        },
        a = function(E, F) {
            E.wrapInner("<span></span>").children("span").attr("lang", F);
            return E
        },
        j = function(P) {
            var J, M, F, I, S, Q, G, K, E, H, O, L, N, R = this.xmlns();
            S = this;
            N = u(this).atts;
            if (typeof P === "string") {
                P = h.rdf.triple(P, {
                    namespaces: R,
                    base: this.base()
                })
            } else {
                if (P.rdfquery) {
                    j.call(this, P.sources().get(0));
                    return this
                } else {
                    if (P.length) {
                        for (L = 0; L < P.length; L += 1) {
                            j.call(this, P[L])
                        }
                        return this
                    }
                }
            }
            M = N.rel !== undefined || N.rev !== undefined;
            F = M || N.property !== undefined || N["typeof"] !== undefined;
            if (P.object.type !== "literal") {
                Q = r(this, {
                    atts: N
                }, true).subject;
                K = x(this, {
                    atts: N
                }, true);
                I = !F && N.resource === undefined;
                G = Q === P.subject;
                E = K === P.object;
                if (P.property === h.rdf.type) {
                    if (G) {
                        q(this, "typeof", P.object.value)
                    } else {
                        if (F) {
                            S = this.wrapInner("<span />").children("span");
                            q(S, "typeof", P.object.value);
                            if (K !== P.subject) {
                                b(S, P.subject)
                            }
                        } else {
                            q(this, "typeof", P.object.value);
                            b(this, P.subject)
                        }
                    }
                } else {
                    if (G) {
                        if (E) {
                            q(this, "rel", P.property.value)
                        } else {
                            if (I || !F) {
                                q(this, "rel", P.property.value);
                                c(this, P.object)
                            } else {
                                S = this.wrap("<span />").parent();
                                q(S, "rev", P.property.value);
                                b(S, P.object)
                            }
                        }
                    } else {
                        if (Q === P.object) {
                            if (K === P.subject) {
                                q(this, "rev", P.property.value)
                            } else {
                                if (I || !F) {
                                    q(this, "rev", P.property.value);
                                    c(this, P.subject)
                                } else {
                                    S = this.wrap("<span />").parent();
                                    q(S, "rel", P.property.value);
                                    b(S, P.subject)
                                }
                            }
                        } else {
                            if (E) {
                                if (F) {
                                    S = this.wrapInner("<span />").children("span");
                                    q(S, "rev", P.property.value);
                                    c(S, P.subject);
                                    S = S.wrapInner("<span />").children("span");
                                    b(S, P.object);
                                    S = this
                                } else {
                                    b(this, P.subject);
                                    q(this, "rel", P.property.value)
                                }
                            } else {
                                if (K === P.subject) {
                                    if (F) {
                                        S = this.wrapInner("<span />").children("span");
                                        q(S, "rel", this.property.value);
                                        c(S, P.object);
                                        S = S.wrapInner("<span />").children("span");
                                        b(S, K);
                                        S = this
                                    } else {
                                        b(this, P.object);
                                        q(this, "rev", P.property.value)
                                    }
                                } else {
                                    if (F) {
                                        S = this.wrapInner("<span />").children("span");
                                        q(S, "rel", P.property.value);
                                        b(S, P.subject);
                                        c(S, P.object);
                                        if (S.children("*").length > 0) {
                                            S = this.wrapInner("<span />").children("span");
                                            b(S, Q)
                                        }
                                        S = this
                                    } else {
                                        q(S, "rel", P.property.value);
                                        b(this, P.subject);
                                        c(this, P.object);
                                        if (this.children("*").length > 0) {
                                            S = this.wrapInner("<span />").children("span");
                                            b(S, Q);
                                            S = this
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                Q = r(this, {
                    atts: N
                }).subject;
                K = x(this, {
                    atts: N
                });
                G = Q === P.subject;
                J = this.text() !== P.object.value;
                if (N.property !== undefined) {
                    O = N.content;
                    E = O !== undefined ? O === P.object.value : !J;
                    if (G && E) {
                        q(this, "property", P.property.value)
                    } else {
                        S = this.wrapInner("<span />").children("span");
                        return j.call(S, P)
                    }
                } else {
                    if (K === P.subject) {
                        S = this.wrapInner("<span />").children("span");
                        return j.call(S, P)
                    }
                    q(this, "property", P.property.value);
                    b(this, P.subject);
                    if (J) {
                        if (P.object.datatype && P.object.datatype.toString() === B) {
                            this.html(P.object.value)
                        } else {
                            this.attr("content", P.object.value)
                        }
                    }
                    H = s(this);
                    if (P.object.lang) {
                        if (H !== P.object.lang) {
                            this.attr("lang", P.object.lang);
                            if (J) {
                                a(this, H)
                            }
                        }
                    } else {
                        if (P.object.datatype) {
                            q(this, "datatype", P.object.datatype)
                        } else {
                            if (!J) {
                                this.attr("datatype", "")
                            }
                            if (H !== undefined) {
                                this.attr("lang", "");
                                if (J) {
                                    a(this, H)
                                }
                            }
                        }
                    }
                }
            }
            this.parents().andSelf().trigger("rdfChange");
            return S
        },
        l = function(K) {
            var I, L, J, E, F, H, G = this.xmlns();
            L = u(this).atts;
            if (K.length) {
                for (i = 0; i < K.length; i += 1) {
                    l.call(this, K[i])
                }
                return this
            }
            hasRelation = L.rel !== undefined || L.rev !== undefined;
            hasRDFa = hasRelation || L.property !== undefined || L["typeof"] !== undefined;
            if (hasRDFa) {
                if (K.property !== undefined) {
                    if (L.property !== undefined) {
                        J = f(L.property, K.property, {
                            namespaces: G
                        });
                        if (J === "") {
                            this.removeAttr("property")
                        } else {
                            this.attr("property", J)
                        }
                    }
                    if (L.rel !== undefined) {
                        E = f(L.rel, K.property, {
                            namespaces: G
                        });
                        if (E === "") {
                            this.removeAttr("rel")
                        } else {
                            this.attr("rel", E)
                        }
                    }
                    if (L.rev !== undefined) {
                        F = f(L.rev, K.property, {
                            namespaces: G
                        });
                        if (F === "") {
                            this.removeAttr("rev")
                        } else {
                            this.attr("rev", F)
                        }
                    }
                }
                if (K.type !== undefined) {
                    if (L["typeof"] !== undefined) {
                        H = f(L["typeof"], K.type, {
                            namespaces: G
                        });
                        if (H === "") {
                            this.removeAttr("typeof")
                        } else {
                            this.attr("typeof", H)
                        }
                    }
                }
                if (L.property === this.attr("property") && L.rel === this.attr("rel") && L.rev === this.attr("rev") && L["typeof"] === this.attr("typeof")) {
                    return l.call(this.parent(), K)
                }
            }
            this.parents().andSelf().trigger("rdfChange");
            return this
        };
    h.fn.rdfa = function(E) {
        if (E === undefined) {
            var F = h.map(h(this), function(G) {
                return C.call(h(G))
            });
            return h.rdf({
                triples: F
            })
        } else {
            h(this).each(function() {
                j.call(h(this), E)
            });
            return this
        }
    };
    h.fn.removeRdfa = function(E) {
        h(this).each(function() {
            l.call(h(this), E)
        });
        return this
    };
    h.rdf.gleaners.push(t)
})(jQuery);
(function(b) {
    var a = 1;
    b.rdf.ruleset = function(d, c) {
        return new b.rdf.ruleset.fn.init(d, c)
    };
    b.rdf.ruleset.fn = b.rdf.ruleset.prototype = {
        init: function(f, c) {
            var d, e = b.extend({}, b.rdf.ruleset.defaults, c);
            f = f || [];
            this.baseURI = e.base;
            this.namespaces = b.extend({}, e.namespaces);
            this.rules = [];
            for (d = 0; d < f.length; d += 1) {
                this.add.apply(this, f[d])
            }
            return this
        },
        base: function(c) {
            if (c === undefined) {
                return this.baseURI
            } else {
                this.baseURI = c;
                return this
            }
        },
        prefix: function(d, c) {
            if (d === undefined) {
                return this.namespaces
            } else {
                if (c === undefined) {
                    return this.namespaces[d]
                } else {
                    this.namespaces[d] = c;
                    return this
                }
            }
        },
        size: function() {
            return this.rules.length
        },
        add: function(c, e) {
            var d;
            if (e === undefined && c.rules) {
                this.rules = this.rules.concat(c.rules)
            } else {
                if (e === undefined && c.lhs) {
                    d = c
                } else {
                    d = b.rdf.rule(c, e, {
                        namespaces: this.prefix(),
                        base: this.base()
                    })
                }
                if (b.inArray(d, this.rules) === -1) {
                    this.rules.push(d)
                }
            }
            return this
        },
        run: function(j, e) {
            var f, h, d, g = b.extend({
                    limit: 50
                }, e),
                c = g.limit;
            do {
                d = j.size();
                for (f = 0; f < this.rules.length; f += 1) {
                    h = this.rules[f];
                    h.run(j)
                }
                c -= 1
            } while (j.size() > d && c > 0);
            return this
        }
    };
    b.rdf.ruleset.fn.init.prototype = b.rdf.ruleset.fn;
    b.rdf.ruleset.defaults = {
        base: b.uri.base(),
        namespaces: {}
    };
    b.rdf.rule = function(c, e, d) {
        return new b.rdf.rule.fn.init(c, e, d)
    };
    b.rdf.rule.fn = b.rdf.rule.prototype = {
        init: function(c, h, e) {
            var f = b.extend({}, b.rdf.rule.defaults, e),
                g = [],
                d = false;
            if (typeof c === "string") {
                c = [c]
            }
            if (typeof h === "string") {
                h = [h]
            }
            this.lhs = b.map(c, function(j) {
                if (b.isArray(j)) {
                    return [j]
                } else {
                    if (b.isFunction(j)) {
                        return j
                    } else {
                        j = b.rdf.pattern(j, f);
                        if (typeof j.subject === "string") {
                            g.push(j.subject)
                        }
                        if (typeof j.property === "string") {
                            g.push(j.property)
                        }
                        if (typeof j.object === "string") {
                            g.push(j.object)
                        }
                        return j
                    }
                }
            });
            g = b.unique(g);
            if (b.isFunction(h)) {
                this.rhs = h
            } else {
                this.rhs = b.map(h, function(j) {
                    j = b.rdf.pattern(j, f);
                    if ((typeof j.subject === "string" && b.inArray(j.subject, g) === -1) || (typeof j.property === "string" && b.inArray(j.property, g) === -1) || (typeof j.object === "string" && b.inArray(j.object, g) === -1)) {
                        throw "Bad Rule: Right-hand side of the rule contains a reference to an unbound wildcard"
                    } else {
                        if (j.subject.type === "bnode" || j.property.type === "bnode" || j.object.type === "bnode") {
                            d = true
                        }
                    }
                    return j
                })
            }
            this.rhsBlanks = d;
            this.cache = {};
            return this
        },
        run: function(A, e) {
            var f = b.rdf({
                    databank: A
                }),
                w, g = b.extend({
                    limit: 50
                }, e),
                y = g.limit,
                d, v, u, x, h, n, r, m, z = this.rhsBlanks,
                k, c, t, l;
            if (this.cache[A.id] === undefined) {
                this.cache[A.id] = {}
            }
            for (v = 0; v < this.lhs.length; v += 1) {
                w = this.lhs[v];
                if (b.isArray(w)) {
                    f = f.filter.apply(f, w)
                } else {
                    if (b.isFunction(w)) {
                        f = f.filter.call(f, w)
                    } else {
                        f = f.where(this.lhs[v])
                    }
                }
            }
            do {
                d = f.length;
                c = f.sources();
                for (v = 0; v < d; v += 1) {
                    t = c[v];
                    l = true;
                    k = this.cache[A.id];
                    for (u = 0; u < t.length; u += 1) {
                        if (k[t[u]] === undefined) {
                            k[t[u]] = {}
                        } else {
                            if (u === t.length - 1) {
                                l = false
                            }
                        }
                        k = k[t[u]]
                    }
                    if (l) {
                        m = f.eq(v);
                        if (z) {
                            for (u = 0; u < this.rhs.length; u += 1) {
                                x = this.rhs[u];
                                h = x.subject;
                                n = x.property;
                                r = x.object;
                                if (h.type === "bnode") {
                                    h = b.rdf.blank("" + h + a)
                                }
                                if (n.type === "bnode") {
                                    n = b.rdf.blank("" + n + a)
                                }
                                if (r.type === "bnode") {
                                    r = b.rdf.blank("" + r + a)
                                }
                                x = b.rdf.pattern(h, n, r);
                                m.add(x)
                            }
                            a += 1
                        } else {
                            if (b.isFunction(this.rhs)) {
                                m.map(this.rhs)
                            } else {
                                for (u = 0; u < this.rhs.length; u += 1) {
                                    m.add(this.rhs[u])
                                }
                            }
                        }
                    }
                }
                y -= 1
            } while (f.length > d && y > 0);
            return this
        }
    };
    b.rdf.rule.fn.init.prototype = b.rdf.rule.fn;
    b.rdf.rule.defaults = {
        base: b.uri.base(),
        namespaces: {}
    };
    b.extend(b.rdf.databank.fn, {
        reason: function(d, c) {
            d.run(this, c);
            return this
        }
    });
    b.extend(b.rdf.fn, {
        reason: function(d, c) {
            d.run(this.databank, c);
            return this
        }
    })
})(jQuery);
