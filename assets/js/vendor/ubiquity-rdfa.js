// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity RDFa module adds RDFa parser support to the Ubiquity
// library.
//
// Copyright (C) 2008 Mark Birbeck
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// Mark Birbeck can be contacted at:
//
//  36 Tritton Road
//  London
//  SE21 8DE
//  United Kingdom
//
//  mark.birbeck@gmail.com
//
(
  function(){
    var loader = new YAHOO.util.YUILoader();

    loader.addModule({ name: "ubiquity-array",          type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/third-party/array.js" });

    loader.addModule({ name: "ubiquity-threads",        type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/third-party/threads.js" });

    loader.addModule({ name: "ubiquity-uri",            type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/third-party/uri.js" });

    loader.addModule({ name: "ubiquity-submissionjson", type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/third-party/submission/submission-json.js" });

    loader.addModule({ name: "ubiquity-rdfparser",      type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/RDFParser.js",
      requires: [ "ubiquity-uri", "ubiquity-array" ] });

    loader.addModule({ name: "ubiquity-rdfstore",       type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/RDFStore.js" });

    loader.addModule({ name: "ubiquity-rdfquery",       type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/RDFQuery.js",
      requires: [ "dom", "container", "ubiquity-rdfstore", "ubiquity-submissionjson" ] });

    loader.addModule({ name: "ubiquity-metascan",       type: "js",  fullpath: "https://ubiquity-rdfa.googlecode.com/svn/branches/0.7/metascan.js",
      requires: [ "ubiquity-rdfquery", "ubiquity-rdfstore", "ubiquity-rdfparser", "ubiquity-threads" ] });

    loader.require( "event", "ubiquity-metascan" );

    loader.onSuccess = function(o) {
      YAHOO.util.Event.onDOMReady(get_metadata);
    };
    
    loader.insert();
  }()
);