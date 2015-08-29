/**
 * Chartinator
 * Version: 0.3.2
 * URL: http://chartinator.com
 * Description: Chartinator transforms data contained in HTML tables, Google Sheets and js arrays into charts using Google Charts
 * Requires: jQuery, Google Charts
 * Author: jbowyers
 * Copyright: 2014-2015 jbowyers
 * License: This file is part of Chartinator.
 * Chartinator is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Chartinator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/
 *
 * ABOUT CHARTINATOR  ===========================================================================
 * Chartinator transforms data contained in HTML tables, Google Sheets and js arrays into charts using Google Charts.
 *
 * Apply the jQuery Chartinator plugin to the chart canvas(es)
 * or select the table(s) and Chartinator will insert a new chart canvas(es) after the table
 * or define the Google Sheet key id
 * or create js data arrays
 *
 * th elements in HTML table should have one of the following:
 * 'data-type' attributes: 'string' 'number' 'boolean' 'date' 'datetime' 'timeofday'
 * or 'data-role' attributes:  'tooltip','annotation'
 * The caption element's text is used as a title for the chart
 * See the readme file for more info
 */

; (function ($, window, document, Math, undefined) {

    "use strict";

    var chartinator = function (el, options) {
        
        //  The chartinator object
        var o = this;

        //  Define table and chart elements	
        var $tableS = $(el);
        var $chartS = $(el);

        //  Define fonts
        o.fontFamily = $('body').css('font-family').replace(/["']{1}/gi, "") || 'Arial, Helvetica, sans-serif';

        //  Initialize option defaults ------------------------------------------------------------
        o.optionsInit = {

            // The path to the Google AJAX API
            urlJSAPI: 'https://www.google.com/jsapi',

            // The Google Sheet key
            // The id code of the Google sheet taken from the public url of your Google Sheet
            // Default: false
            googleSheetKey: false,

            // The data columns js array
            // An array of object literals that define each column
            // Default: false
            columns: false,

            // Column indexes array - An array of column indexes defining where
            // the data will be inserted into any existing data extracted from an HTML table or Google Sheet
            // Default: false - js data array columns replace any existing columns
            // Note: when inserting more than one column be sure to increment index number
            // to account for previously inserted indexes
            colIndexes: false,

            // Rows - The rows data-array
            // If colIndexes array has values the row data will be inserted into the columns
            // defined in the colindexes array. Otherwise the row data will be appended
            // to any existing row data extracted from an HTML table or Google Sheet
            // Default: false
            rows: false,

            // The jQuery selector of the HTML table element to extract the data from.
            // Default: false - Checks if the element this plugin is applied to is an HTML table
            tableSel: false,

            // Ignore row indexes array - An array of row index numbers to ignore
            // Default: []
            // Note: Only works on data extracted from HTML tables or Google Sheets
            // The headings row is index 0
            ignoreRow: [],

            // Ignore column indexes array
            // An array of column indexes to ignore in the HTML table or Google Sheet
            // Default: []
            // Note: Only works on data extracted from HTML tables or Google Sheets
            ignoreCol: [],

            // Transpose data Boolean - swap columns and rows
            // Default: false
            // Note: Only works on data extracted from HTML tables or Google Sheets
            transpose: false,

            // The tooltip concatenation - Defines a string for concatenating a custom tooltip.
            // Keywords: 'domain', 'data', 'label' - these will be replaced with current values
            // 'domain': the primary axis value, 'data': the data value, 'label': the column title
            // Default: false - use Google Charts tooltip defaults
            // Note: Only works when extracting data from HTML tables or Google Sheets
            // Not supported on pie, calendar charts
            tooltipConcat: false,

            // The annotation concatenation - Defines a string for concatenating a custom annotation.
            // Keywords: 'domain', 'data', 'label' - these will be replaced with current values
            // 'domain': the primary axis value, 'data': the data value, 'label': the column title
            // Default: false - use Google Charts annotation defaults
            // Note: Only works when extracting data from HTML tables or Google Sheets.
            // Not supported on pie, geo, calendar charts
            annotationConcat: false,

            // The chart type - Options: BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table.
            // Default: 'BarChart'
            chartType: 'BarChart',

            // The class to apply to the dynamically created chart container element
            chartClass: 'chtr-chart',

            // The chart height aspect ratio custom option
            // Used to refactor the chart height relative to the width in responsive designs
            // this is overridden if the Google Charts height option has a value
            // Default: false - not used
            chartAspectRatio: false,

            // Google Bar Chart Options
            barChart: {

                // The font size in pixels - Number
                // Or use css selectors as keywords to assign font sizes from the page
                // For example: 'body'
                // Default: false - Use Google Charts defaults
                fontSize: false,

                chartArea: { left: "20%", top: 40, width: "75%", height: "85%" },
                fontName: o.fontFamily,
                legend: { position: 'bottom' }
            },

            // Google Pie Chart Options
            pieChart: {

                // The font size in pixels - Number
                // Or use css selectors as keywords to assign font sizes from the page
                // For example: 'body'
                // Default: false - Use Google Charts defaults
                fontSize: false,

                chartArea: { left: 0, top: 0, width: "100%", height: "100%" },
                fontName: o.fontFamily
            },

            // Google Column Chart Options
            columnChart: {

                // The font size in pixels - Number
                // Or use css selectors as keywords to assign font sizes from the page
                // For example: 'body'
                // Default: false - Use Google Charts defaults
                fontSize: false,

                fontName: o.fontFamily,
                legend: { position: 'bottom' }
            },

            // Google Geo Chart Options
            geoChart: {

            },

            // Google Calendar Chart Options
            calendarChart: {

                // The cell scaling factor custom option - Not a Google Chart option
                // Used to refactor the cell size in responsive designs
                // this is overridden if the calendar.cellSize option has a value
                cellScaleFactor: 0.017,

                calendar: {
                    monthLabel: {

                        // The font size in pixels - Number
                        // Or use css selectors as keywords to assign font sizes from the page
                        // For example: 'body'
                        // Default: false - Use Google Charts defaults
                        fontSize: false,

                        fontName: o.fontFamily
                    },
                    dayOfWeekLabel: {

                        // The font size in pixels - Number
                        // Or use css selectors as keywords to assign font sizes from the page
                        // For example: 'body'
                        // Default: false - Use Google Charts defaults
                        fontSize: false,

                        fontName: o.fontFamily
                    }
                }
            },

            // Google Table Chart Options
            tableChart: {

                // Format a data column in a Table Chart
                formatter: {

                    // Formatter type - Options: 'none', 'BarFormat'
                    type: 'none',

                    // The index number of the column to format. Options: 0, 1, 2, etc.
                    column: 1
                },

                // Allow HTML in cells. default: false
                allowHtml: true,

                cssClassNames: {
                    headerRow: 'headerRow',
                    tableRow: 'tableRow',
                    oddTableRow: 'oddTableRow',
                    selectedTableRow: 'selectedTableRow',
                    hoverTableRow: 'hoverTableRow',
                    headerCell: 'headerCell',
                    tableCell: 'tableCell',
                    rowNumberCell: 'rowNumberCell'
                }
            },

            // Show table along with chart. String, Options: 'show', 'hide', 'remove'
            showTable: 'hide',

            // The CSS to apply to show or hide the table and chart
            showTableCSS: { 'position': 'static', 'top': 0, 'width': '' },
            hideTableCSS: { 'position': 'absolute', 'top': '-9999px', 'width': $tableS.width() },
            showChartCSS: {  },
            hideChartCSS: { 'opacity': 0 }

        };  //  o.optionsInit close

        // Initiate Google Chart options object
        o.cOptions = {};

        // Window resize event timer function
        o.timer = false;

        // Initialize table clone
        o.tableClone = false;

        // The Google Sheet data object - Data returned
        o.googleSheetData = false;

        // Data array - the array of collected data to send to Google Charts
        o.dataArray = [];

        // Set chartPackage - Options: corechart, calendar, geochart, table - The Google Chart Package to load.
        o.chartPackage = 'corechart';

        // Init chart parent
        o.chartParent = false;

        // Init the window width
        o.windowWidth = false;

        // Init chart parent width
        o.chartParentWidth = false;

        //  Initiate Chart ======================================================================
        o.init = function (el, options) {

            var tableHasData = false;

            //  Merge options
            o.options = $.extend({}, o.optionsInit, options);

            // Define table and chart elements --------------------------------------------------

            // Set table element
            if (o.options.tableSel) {
                $tableS = ($(o.options.tableSel + ' td').length) ? $(o.options.tableSel) : $tableS;
            }

            // Check table for data
            tableHasData = $tableS.find('td').length;

            // Get table clone
            if (tableHasData) {

                o.tableClone = $tableS.clone();
            }

            if ($chartS[0] === $tableS[0]) { // table and chart are the same element
                if (tableHasData) {
                    // Insert a new chart element after the table
                    $chartS = $( '<div class="' + o.options.chartClass + '"></div>' ).insertAfter( $tableS );
                } else { // table does not exist
                    $tableS = false;
                }
            }

            // Add chart class
            $chartS.addClass(o.options.chartClass);

            // Get chart parent element
            o.chartParent = $chartS.parent();


            // Get data ----------------------------------------------------------

            if ( o.options.googleSheetKey ) {

                // Get Google Sheets data
                o.getGoogleSheet( o.options.googleSheetKey, o.setupChart );
            } else {
                o.setupChart();
            }

        };  // o.init close

        // Get Google Sheet data - CSV format
        o.getGoogleSheet = function ( key, callBack ) {

            $.ajax({
                type: 'GET',
                url: 'https://spreadsheets.google.com/spreadsheet/pub?key=' + key + '&output=csv',
                dataType: 'text'
            })
                .done(function (data) {
                    o.googleSheetData = data;
                    callBack();
                })
                .fail(function (e) {
                    o.googleSheetData = e;
                    callBack();
                    // Google Sheet failed
                    console.log('Google Sheet failed');
                })
            ;
        };

        // Set the chart - get Google Chart
        o.setupChart = function ( ) {

            // Get data
            o.dataArray = o.collectData();

            if ( !o.dataArray.length ) { // No data

                // Show table remove chart
                o.showTableChart('show', 'remove');
                console.log('No data found in data array');
                return;
            }

            // Construct Chart options -------------------------------------------

            // Clone Chart options so we don't overwrite original values
            o.oOptions = $.extend( true, {}, o.options );

            // Limit to Google Chart options and set calculated values
            if ( o.oOptions.chartType === 'BarChart' ) {
                o.oOptions = o.oOptions.barChart;
            } else if ( o.oOptions.chartType === 'ColumnChart' ) {
                o.oOptions = o.oOptions.columnChart;
            } else if ( o.oOptions.chartType === 'PieChart' ) {
                o.oOptions = o.oOptions.pieChart;
            } else if ( o.oOptions.chartType === 'GeoChart' ) {
                o.oOptions = o.oOptions.geoChart;
                o.chartPackage = 'geochart';
            } else if ( o.oOptions.chartType === 'Calendar' ) {
                o.oOptions = o.oOptions.calendarChart;
                o.chartPackage = 'calendar';
                o.oOptions.calendar.cellSize = o.oOptions.calendar.cellSize || $chartS.width() * o.oOptions.cellScaleFactor;
            } else if ( o.options.chartType === 'Table' ) {
                o.oOptions = o.oOptions.tableChart;
                o.chartPackage = 'table';
            } else { // Unrecognized chart type - Chart failed

                // Show HTML table and remove chart
                o.showTableChart( 'show', 'remove' );
                console.log( 'Unrecognized chart type' );
                return;
            }

            // Clone Google Chart options so we don't overwrite original values
            o.cOptions = $.extend( true, {}, o.oOptions );

            // Load Google Chart ----------------------------------------------------------

            // Hide chart and HTML table
            o.showTableChart('hide', 'hide');

            try {

                $.ajax({
                    url: o.options.urlJSAPI,
                    dataType: "script",
                    cache: true
                })
                    .done(function () {

                        // Create and draw Chart
                        google.load('visualization', '1', {
                            packages: [o.chartPackage],
                            callback: o.drawChart
                        });

                        // Add Window Resize event
                        o.addResize();
                    })
                    .fail(function () {

                        // Chart failed - Show HTML table and remove chart
                        o.showTableChart('show', 'remove');
                    })
                ;
            }
            catch (e) {

                // Chart failed - Show HTML table and remove chart
                o.showTableChart('show', 'remove');
                console.log(e);
            }

        };

        // Collect data - Assemble data from the HTML table, js array and Google Sheet
        o.collectData = function () {

            var dataArray = [];

            // Format Google Sheet data
            if ( o.googleSheetData && !o.googleSheetData.statusText ) {
                dataArray = o.formatSheet( o.googleSheetData );
            } else if ( o.googleSheetData ) {
                console.log(o.googleSheetData);
            }

            // Get HTML table data
            // Note: this overwrites any data extracted from A Google Sheet
            if ( o.tableClone && o.tableClone.find( 'td' ).length ) {
                dataArray = o.getTableData();

                // Set the chart title
                o.cOptions.title = o.cOptions.title || o.tableClone.find('caption').text() || '';
            }

            // Add/overwrite with js data-array columns
            if ( o.options.columns ) {
                if (dataArray[0] && dataArray[0][0] && dataArray[0][0].label) { // header data exists
                    if ( o.options.colIndexes ) { // insert columns
                        for (var i = 0; i < o.options.colIndexes.length; i++) {
                            dataArray[0].splice(o.options.colIndexes[i], 0, o.options.columns[i]);
                        }
                    } else {
                        // Overwrite columns array as first row
                        dataArray[0] = o.options.columns;
                    }
                } else { // header data does not exists
                    // Insert columns array as first row
                    dataArray.unshift(o.options.columns);
                }
            }

            // Add js data-array rows
            if (  o.options.rows && dataArray.length ) { // js data array exists
                if ( o.options.colIndexes ) { // colIndexes array exists
                    for (var i = 0; i < o.options.rows.length; i++) { // loop through each row in js data array
                        for (var j=0; j < o.options.colIndexes.length; j++) { // loop through colIndexes

                            // Insert new data into dataArray
                            dataArray[i+1].splice(o.options.colIndexes[j], 0, o.options.rows[i][j]);
                        }
                    }
                } else { // colIndexes array does not exist
                    // Add rows to end of dataArray
                    $.merge( dataArray, o.options.rows );
                }
            }

            return dataArray;

        };

        // Draw the chart
        o.drawChart = function ( ) {

            // Create dataTable -----------------------------------------------------------
            o.data = new google.visualization.arrayToDataTable(o.dataArray);

            if ( !o.data || !o.data.getNumberOfRows() ) { // No data

                // Show table remove chart
                o.showTableChart('show', 'remove');

                console.log('Google Charts data table failed');
                return;
            }

            // Format data ----------------------------------------------------------------
            if ( o.options.tableChart.formatter.type !== 'none' ) {
                var formatter = new google.visualization[o.options.tableChart.formatter.type](o.options.tableChart.formatter);
                formatter.format( o.data, o.options.tableChart.formatter.column); // Apply formatter to column
            }

            // Adjust options -------------------------------------------------------------

            // Set font sizes
            if (o.cOptions.fontSize && isNaN(parseInt(o.cOptions.fontSize, 10))) {
                o.cOptions.fontSize = o.getFontSize(o.cOptions.fontSize, 16);
            }
            if (o.cOptions.titleTextStyle && o.cOptions.titleTextStyle.fontSize && isNaN(parseInt(o.cOptions.titleTextStyle.fontSize, 10))) {
                o.cOptions.titleTextStyle.fontSize = o.getFontSize(o.cOptions.titleTextStyle.fontSize, 16);
            }
            if (o.cOptions.calendar) {
                if ( o.cOptions.calendar.monthLabel && o.cOptions.calendar.monthLabel.fontSize && isNaN( parseInt( o.cOptions.calendar.monthLabel.fontSize, 10 ) ) ) {
                    o.cOptions.calendar.monthLabel.fontSize = o.getFontSize( o.cOptions.calendar.monthLabel.fontSize, 16 );
                }
                if (o.cOptions.calendar.dayOfWeekLabel && o.cOptions.calendar.dayOfWeekLabel.fontSize && isNaN(parseInt(o.cOptions.calendar.dayOfWeekLabel.fontSize, 10))) {
                    o.cOptions.calendar.dayOfWeekLabel.fontSize = o.getFontSize(o.cOptions.calendar.dayOfWeekLabel.fontSize, 16);
                }
            }

            // Set Chart dimensions
            o.setDimensions();

            // Revise Chart Options -------------------------------------------------------------
            if ( o.options.chartType === 'BarChart' && !o.options.chartAspectRatio && !o.oOptions.height) { // Height not set

                var fontSize = o.cOptions.fontSize || o.getFontSize('body', 16);
                // Define height based on font size and number of rows
                o.cOptions.height = fontSize * 2 * o.data.getNumberOfRows();
            }

            // Draw chart ----------------------------------------------------------------------

            // Create and draw the visualization.
            o.chart = new google.visualization[o.options.chartType]($chartS.get(0));

            // Add ready and error event listeners
            google.visualization.events.addListener( o.chart, 'ready', function (e) {
                // Show chart
                o.showTableChart(o.options.showTable, 'show');

                // Store the window width
                o.windowWidth = $( window ).width();

                // Store the chart parent width
                o.chartParentWidth = o.chartParent.width();
            });
            google.visualization.events.addListener( o.chart, 'error', function (e) {
                // Show table remove chart
                o.showTableChart('show', 'remove');
            });

            // Draw chart
            o.chart.draw( o.data, o.cOptions );

        }; // o.drawChart close

        // Format Google Sheets csv data
        o.formatSheet = function( data ) {

            // The array of data to return
            var dataArray = [];

            // Format Google Sheet csv data
            if ( data && !data.statusText ) {

                try {

                    // The array of all rows
                    var rows = data.split(/\r\n|\n/);

                    // The Array of column headings
                    var columns = [];

                    // Create cells
                    for (var i=0; i<rows.length; i++) { // Each row
                        var row = rows[i].split(',');
                        rows[i] = row;
                    }

                    if ( o.options.transpose ) {
                        rows = o.transpose(rows);
                    }

                    columns = rows[0];

                    // Get and format columns
                    for ( var i=0; i<columns.length; i++ ) {

                        if ( columns[i].toUpperCase() === 'TOOLTIP' ) {
                            columns[i] = { type: 'string', role: 'tooltip' };
                        } else if ( columns[i].toUpperCase() === 'ANNOTATION' ){
                            columns[i] = { type: 'string', role: 'annotation' };
                        } else {
                            columns[i] = { label: columns[i] };
                        }
                    }

                    // Add data to dataArray
                    dataArray = rows;
                    dataArray[0] = columns;

                    // Format data
                    dataArray = o.formatData(dataArray);
                }
                catch (e) {

                    // Formatting of sheet data failed
                    console.log(e);
                }
            }

            return dataArray;
        };

        // Get data from an HTML table
        o.getTableData = function () {

            // The data table Array - The array of column and row data extracted from the HTML table
            var dataTable = [];

            try {

                // The rows - The collection of HTML table rows
                var $rows = o.tableClone.find( 'tr' );

                // The array of data collected from all rows
                var rowsArr = [];

                // Add cells as objects to rowsArr
                $rows.each(function (row) {

                    rowsArr.push([]);

                    $(this).find('td, th').each(function (col) {

                        var $cell = $( this );
                        var cellObj = {};

                        // Construct the cell object
                        if ( $cell.attr( 'data-type' ) ) {
                            cellObj.type = $cell.attr( 'data-type' );
                        }
                        if ( $cell.attr( 'data-role' ) ) {
                            cellObj.role = $cell.attr( 'data-role' );
                        }
                        cellObj.label = $cell.text();

                        // add cell object to rowsArr
                        rowsArr[row].push(cellObj);
                    });
                });

                // Transpose data
                if ( o.options.transpose ) {
                    rowsArr = o.transpose(rowsArr);
                }

                // Add columns to dataTable
                dataTable.push(rowsArr[0]);

                // Change cell data back to values - excluding headings
                for ( var i=1; i<rowsArr.length; i++ ) { // each row

                    // The Array of row data
                    var rowData = [];

                    for ( var j=0; j<rowsArr[i].length; j++ ) { // each cell

                        // Add cell to row
                        var cellData = rowsArr[i][j].label || '';
                        rowData.push( cellData );
                    }

                    // add row to dataTable
                    if (rowData.length > 0) {
                        dataTable.push(rowData);
                    }
                }

                // Format data
                dataTable = o.formatData(dataTable);
            }
            catch (e) { //  Could not extract data

                console.log(e);
                return [];
            }
            return dataTable;
        };

        // Format the data - infer data types and add and remove columns
        o.formatData = function( data ) {

            // The formatted data array - The array of reformatted data
            var formattedData = data;

            try {

                // Array of columns to remove
                var removeColArr = [];

                // Dynamic column types array - An array listing the active dynamic column types
                var dynColTypesArr = [];

                // The dynamic columns Array - An array of objects containing dynamic column metadata
                var dynColumns = [];

                // Remove ignore rows filter function
                var filterRows = function( n, i ) {
                    return (o.options.ignoreRow.indexOf(i) === -1);
                };

                // Remove ignore columns filter function
                var filterCols = function( n, i ) {
                    return (o.options.ignoreCol.indexOf(i) === -1);
                };

                // Remove dynamic columns filter function
                var filterDynamic = function( n, i ) {
                    return (removeColArr.indexOf(i) === -1);
                };

                // Get active dynamic column types
                if ( o.options.tooltipConcat ) {
                    dynColTypesArr.push('tooltip');
                }
                if ( o.options.annotationConcat ) {
                    dynColTypesArr.push('annotation');
                }

                // Remove ignored rows
                formattedData = $.grep(formattedData, filterRows);

                // Remove ignored columns
                for (var j=0; j<formattedData.length; j++) { // each row

                    // Remove columns
                    formattedData[j] = $.grep(formattedData[j], filterCols);
                }

                // If dynamic tooltip or annotation remove existing tooltip and annotation columns
                // and add dynamic columns
                if ( dynColTypesArr.length ) {

                    // The primary axis heading - used to construct dynamic tooltips and annotations
                    var domain = '';

                    // Get column indexes to remove
                    for ( var i = 0; i < formattedData[0].length; i++ ) { // each column heading

                        var role = formattedData[0][i].role || '';

                        // Add annotation and tooltip column indexes to remove to removeColArr
                        if ( role && dynColTypesArr.indexOf(role) !== -1 ) {
                            removeColArr.push(i);
                        }
                    }

                    // Remove selected annotation and tooltip columns
                    for (var j=0; j<formattedData.length; j++) { // each row

                        // Remove columns
                        formattedData[j] = $.grep(formattedData[j], filterDynamic);
                    }

                    // Add dynamic tooltip and annotation col headers
                    for (var i=0; i<formattedData[0].length; i++) { // each header col

                        var role = formattedData[ 0 ][ i ].role || '';
                        var label = formattedData[ 0 ][ i ].label || '';

                        // Get domain for use with tooltip and annotation
                        if ( role === 'domain' || i === 0 ) {
                            domain = formattedData[0][i];
                        }

                        if ( (!role || dynColTypesArr.indexOf(role) === -1) && i > 0 ) { // not a dynamic column

                            // Add dynamic column if needed
                            for (var j=0; j<dynColTypesArr.length; j++) { // each dynamic col type

                                i++;

                                // Insert the dynamic column
                                formattedData[ 0 ].splice( i, 0, { type: 'string', role: dynColTypesArr[j] });

                                // Add column metadata to dynColumns
                                dynColumns.push( { index: i, domain: domain, role: dynColTypesArr[j], label: label } );
                            }
                        }
                    }

                    // Add dynamic columns data
                    for (var i=1; i<formattedData.length; i++) { // each data row
                        for (var j=0; j<dynColumns.length; j++) { // each dynamic column

                            var dynData  = '';

                            // Get dynamic column type
                            if ( dynColumns[j].role === 'toolip' ) {
                                dynData = o.options.tooltipConcat;
                            } else if ( dynColumns[j].role === 'annotation' ) {
                                dynData = o.options.annotationConcat;
                            }

                            // Replace keywords
                            dynData = dynData.replace( new RegExp( 'domain', 'g' ), dynColumns[j].domain );
                            dynData = dynData.replace( new RegExp( 'label', 'g' ), dynColumns[j].label );
                            dynData = dynData.replace( new RegExp( 'data', 'g' ), formattedData[i][dynColumns[j].index] );

                            // Insert into formattedData
                            formattedData[ i ].splice( dynColumns[j].index, 0, dynData);

                        }
                    }
                }

                // Format row data according to data types
                for ( var i=1; i<formattedData.length; i++ ) { // each row

                    // The Array of row data
                    var rowData = [];

                    for ( var j = 0; j < formattedData[ i ].length; j++ ) { // each cell

                        // Initiate cell metadata
                        var colType = formattedData[ 0 ][ j ].type || '';
                        var colRole = formattedData[ 0 ][ j ].role || '';
                        var cellData = formattedData[ i ][ j ] || '';

                        // Format data and add to cellData array
                        if ( [ 'tooltip', 'annotation' ].indexOf( colRole ) === -1 ) { // Not a tooltip/annotation
                            if ( colType === 'date' || colType === 'datetime' ) {
                                cellData = new Date( cellData );
                            } else if ( colType === 'number' ) {
                                cellData = parseFloat( cellData );
                            } else if ( colType === 'boolean' ) {
                                var str = cellData.toLowerCase();
                                cellData = (str !== 'false' && str !== '0' && str !== 'no' && str !== '' );
                            } else if ( colType === 'timeofday' ) {
                                cellData = cellData.getTime();
                            } else if ( j !== 0 ) { // not the first column
                                if ( !isNaN( parseFloat( cellData ) ) ) {
                                    cellData = parseFloat( cellData );
                                } else if ( new Date( cellData ) !== "Invalid Date" && !isNaN( new Date( cellData ) ) ) {
                                    cellData = new Date( cellData );
                                }
                            }
                        }

                        // Add cell to row
                        rowData.push( cellData );
                    }

                    // Replace row with formatted data
                    if (rowData.length > 0) {
                        formattedData[i] = rowData;
                    }
                }
            }
            catch (e) { //  Could not extract data

                console.log(e);
                return [];
            }
            return formattedData;
        };

        // Add window resize event
        o.addResize = function () {
            // Window event handlers
            $( window ).on({

                // Reset on screen resize
                'resize': function() {

                    // Adjust layout
                    clearTimeout( o.timer );
                    o.timer = setTimeout( function() {

                        // Test if width has resized - as opposed to height
                        if ($( window ).width() !== o.windowWidth) {

                            // Save the chart style
                            var elStyle = $chartS.attr( 'style' );

                            // Remove js styles from chart
                            $chartS.removeAttr( 'style' );

                            // Test if chart parent has changed width
                            if ( o.chartParent.width() !== o.chartParentWidth ) {

                                // Recalculate calculated option values ---------------------

                                // Recalculate calendar cellSize
                                if ( o.cOptions.calendar && !o.options.calendarChart.calendar.cellSize ) {
                                    o.cOptions.calendar.cellSize = $chartS.width() * 0.017;
                                }

                                // Set Chart dimensions
                                o.setDimensions();

                                // Redraw chart ---------------------------------------------
                                o.chart.draw( o.data, o.cOptions );

                            } else { // parent has not changed width

                                // Re-apply the chart style
                                $chartS.attr( 'style', elStyle );
                            }
                        }
                    }, 500 );
                }
            });
        };

        // Show, hide or remove chart and table
        o.showTableChart = function (table, chart) {    //  Values: 'show', 'hide', or 'remove'

            var tableLen = $tableS ? $tableS.length : false;
            var chartLen = $chartS ? $chartS.length : false;

            // Table
            if (table === 'show' && tableLen) {
                $tableS.css('opacity', 0);
                $tableS.css(o.options.showTableCSS);
                $tableS.fadeTo(400, 1);
            } else if (table === 'hide' && tableLen) {
                $tableS.css(o.options.hideTableCSS);
            } else if (table === 'remove' && tableLen) {
                $tableS.css('display', 'none');
            }

            // Chart
            if (chart === 'show' && chartLen) {
                $chartS.css('opacity', 0);
                $chartS.css(o.options.showChartCSS);
                $chartS.fadeTo(400, 1);
            } else if (chart === 'hide' && chartLen) {
                $chartS.css(o.options.showChartCSS);
            } else if (chart === 'remove' && chartLen) {
                $chartS.css('display', 'none');
            }
        };

        //  Get font size function
        o.getFontSize = function (selector, dSize) {
            return parseInt($(selector).css('fontSize'), 10) || dSize;
        };

        // Transpose data array function
        o.transpose = function (arr) {

            var tArr = new Array(arr[0].length);
            for (var i = 0; i < arr[0].length; i++) {
                tArr[i] = new Array(arr.length);
                for (var j = 0; j < arr.length; j++) {
                    tArr[i][j] = arr[j][i];
                }
            }
            return tArr;
        };

        // Set chart width and height values
        o.setDimensions = function () {
            // Store the chart parent width
            o.chartParentWidth = o.chartParent.width();

            // Set chart width and height
            if ( o.options.chartAspectRatio ){
                if ( o.oOptions.width && !o.oOptions.height ){
                    o.cOptions.height = o.oOptions.width / o.options.chartAspectRatio;
                } else if ( !o.oOptions.width && o.oOptions.height ){
                    o.cOptions.width = o.oOptions.height * o.options.chartAspectRatio;
                } else if (!o.oOptions.width && !o.oOptions.height) {
                    o.cOptions.width = o.chartParentWidth;
                    o.cOptions.height = o.cOptions.width / o.options.chartAspectRatio;
                }
            } else if (!o.oOptions.width && !o.oOptions.height) {
                o.cOptions.width = o.chartParentWidth;
            }
        };

        // initialize --------------------------------------------------------------------------
        o.init(el, options);
        return this;

    };  //  chartinator close

    //  Create the plugin ======================================================================
    $.fn.chartinator = function (options) {
        //  Enable multi-element support
        return this.each(function () {
            var $el = $( this );
            if (!$el.data('chartinator')) {
                $( this ).data( 'chartinator', new chartinator( this, options ) );
            }
        }); 
    };
})(jQuery, window, document, Math);
