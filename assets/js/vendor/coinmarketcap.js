$(document).ready(function() {
    $('#currencies').dataTable({
        "bFilter": false,
        "bInfo" : false,
        "bLengthChange " : false,
        "bPaginate": false,
        "bStateSave": false,
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] },
            { "sType": "string", "aTargets": [ 1 ] },
            { "sType": "currency", "aTargets": [ 2 ] },
            { "sType": "price", "aTargets": [ 3 ] },
            { "sType": "totalsupply", "aTargets": [ 4 ] },
            { "sType": "volume", "aTargets": [ 5 ] },
            { "sType": "percent", "aTargets": [ 6] },
            { "bSortable": false, "aTargets": [ 7 ] },
            { "asSorting": [ "desc", "asc" ], "aTargets": [ 2,3,4,5,6 ] },
        ]        
    });

    $('#currencies-all, #assets-all').dataTable({
        "bFilter": false,
        "bInfo" : false,
        "bLengthChange " : false,
        "bPaginate": false,
        "bStateSave": false,
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] },
            { "sType": "string", "aTargets": [ 1 ] },
            { "sType": "string", "aTargets": [ 2 ] },
            { "sType": "currency", "aTargets": [ 3 ] },
            { "sType": "price", "aTargets": [ 4 ] },
            { "sType": "totalsupply", "aTargets": [ 5 ] },
            { "sType": "volume", "aTargets": [ 6 ] },
            { "sType": "percent", "aTargets": [ 7] },
            { "sType": "percent", "aTargets": [ 8] },
            { "sType": "percent", "aTargets": [ 9] },
            { "asSorting": [ "desc", "asc" ], "aTargets": [ 3,4,5,6,7,8,9 ] },
        ]        
    });  

    $('#assets').dataTable({
        "bFilter": false,
        "bInfo" : false,
        "bLengthChange " : false,
        "bPaginate": false,
        "bStateSave": false,
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] },
            { "sType": "string", "aTargets": [ 1 ] },
            { "sType": "string", "aTargets": [ 2 ] },
            { "sType": "currency", "aTargets": [ 3 ] },
            { "sType": "price", "aTargets": [ 4 ] },
            { "sType": "totalsupply", "aTargets": [ 5 ] },
            { "sType": "volume", "aTargets": [ 6 ] },
            { "sType": "percent", "aTargets": [ 7] },
            { "bSortable": false, "aTargets": [ 8 ] },
            { "asSorting": [ "desc", "asc" ], "aTargets": [ 3,4,5,6,7 ] },
        ]        
    });


    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "totalsupply-pre": function ( a ) {
            if (a[0] == '<') {a = $(a).text()}
            a = parseFloat(a.substring(0, a.length-4).split(",").join(""));
            if (!a) {a = 0;}
            return a;
        },
        "totalsupply-asc": function ( a, b ) {
            return a - b;
        },
        "totalsupply-desc": function ( a, b ) {
            return b - a;
        }
    } );

    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "currency-pre": function ( a ) {
            a = parseFloat((a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" ));
            if (!a) {a = 0;}
            return a;
        },
        "currency-asc": function ( a, b ) {
            return a - b;
        },
        "currency-desc": function ( a, b ) {
            return b - a;
        }
    } );  

    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "price-pre": function ( a ) {
            if (a == "?") {return 0;}
            a = $(a).text().replace( /[^\d\-\.]/g, "" );
            s = a.indexOf('-')
            if (s > 0) {
                e = parseInt(a.substring(s+1))
                a = parseFloat(a) * 1/Math.pow(10,e)
            } else {
                a = parseFloat(a)
            }
            if (!a) {a = 0;}       
            return a;
        },
        "price-asc": function ( a, b ) {
            return a - b;
        },
        "price-desc": function ( a, b ) {
            return b - a;
        }
    } );

    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "volume-pre": function ( a ) {
            if (a == "?") {return 0;}
            a = $(a).text().replace( /[^\d\-\.]/g, "" );
            a = parseFloat(a)
            if (!a) {a = 0;}       
            return a;
        },
        "volume-asc": function ( a, b ) {
            return a - b;
        },
        "volume-desc": function ( a, b ) {
            return b - a;
        }
    } );

    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "percent-pre": function ( a ) {
            a = parseFloat(a.replace( /[^\d\-\.]/g, "" ));
            if (!a) {a = -99999;}        
            return a;
        },
        "percent-asc": function ( a, b ) {
            return a - b;
        },
        "percent-desc": function ( a, b ) {
            return b - a;
        }
    } );

    $('#tooltip-low-volume').tooltip();
} );

