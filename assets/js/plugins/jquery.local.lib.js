var options = { 
    target:        '#twform',
    beforeSubmit:  showRequest,
    success:       showResponse,
    complete:      reportComplete
  };  
var panelid = false;
var section = '';
var sec = 'scr';
var selected = 0;

function showRequest(formData, jqForm, options) { 
    return true; 
} 
 
function showResponse(responseText, statusText)  { 
    jQuery.flash.success("L'annotazione di base di dati è stata aggiornata");
} 

function showError(r, s)  { 
    // alert("Msg: "+r.responseText);
    $('body').data('test', {errfree: false});
    otext = '';
    msgs = {};
    foo = r.responseText.split('<br />');
    for (i = 0;i < foo.length;i++) {
        data = $.trim(foo[i]).split(' ');
        if (data[0] == '<!--') {
            el = data[2];
            text = $.trim(foo[i]).split('>')[2].split('<')[0];
            $('#'+el+'_leg').css({"color":"red"});
            if (msgs[text] == undefined) {
                msgs[text] = text;
            }
        } else {
            msgs[data] = data;
        }
    }
    for (i in msgs) {
        otext += (i + ', ');
    }
    jQuery.flash.failure(otext);
} 

function reportComplete(request, settings) {
    alert("reportComplete triggered");
    if (sec == 'scr') {
        setup_edit_calendar(sec, 'expires');
    }
};

function swaptab(id, name, sec, url) {
    section = sec;
    selected = $('#'+sec+' > ul').tabs('length');
    $('#'+sec+' > ul').tabs("add", '/'+url+'/pubblica/'+id, name, selected);
    $('#'+sec+' > ul').tabs('select', selected);
    //bind the form and provide a callback function
    $('#'+sec+'_editform').submit(function() {
        //submit the form via ajax
        //reinitialize the calendardatepicker after each reload
        $(this).ajaxSubmit({
            beforeSubmit: showRequest,
            success: showResponse,
            complete: reportComplete
            });
     //don't actually submit the form normally
     return false;
    });
    return false;
}

function get_selected() {
    return selected;
}

function setup_edit_calendar(sec,field) {
    Calendar.setup({'ifFormat': '%d-%m-%Y', 
                    'button': $('#' + sec + '_editform_' + field + '_trigger')[0], 
                    'showsTime': false, 
                    'inputField': $('#' + sec + '_editform_' + field)[0]});
    return true;
}

function update_tab(sec) {
    $('#'+sec+'_editform').ajaxSubmit({ target: '#twform', success: showResponse, error: showError, async: false  });
    return false;
}

function complete_tab(sec) {
    $('#'+sec+'_editform').ajaxSubmit({ target: '#twform', success: showResponse, error: showError, async: false });
    selected = 0;
    sel = $('#'+sec+' > ul').tabs().data('selected.tabs');
    $('#'+sec+' > ul').tabs('remove', sel);
    $('#'+sec+' > ul').tabs('select', selected);
    return false;
}

function save_tab(sec) {
    $('body').data('test', {errfree: true});
    $('.twleg').css({"color": "rgb(45, 59, 126)"});
    $('#'+sec+'_newform').ajaxSubmit({ target: '#twform', success: showResponse, error: showError, async: false });
    errfree = $('body').data('test').errfree;
    if (errfree == true) {
        selected = 0;
        $('#'+sec+' > ul').tabs('select', selected);
        $('#'+sec+'_newform').clearForm();
        $('#'+sec+'_newform').resetForm();
        window.location.reload();
        return true;
    } else {
        // $('#'+sec+'_newform').resetForm();
        // $('#'+sec+'_newform').clearForm();
        $('body').data('errfree', true);
        return false;
    }
}

function reset_form(sec) {
    $('.twleg').css({"color":"rgb(45, 59, 126)"})
    $('#'+sec+'_newform').resetForm();
    return false;
}

function close_tab(sec) {
    tmpsel = selected;
    $('#'+sec+' > ul').tabs('select', 0);
    if (sec == 'scr') {
        alert("Lo scritto pubblica completato, rinviando all'indice.");
    }
    $('#'+sec+' > ul').tabs('remove', tmpsel);
    return false;
}

function confirm_delete(text) {
    var yesp = confirm("Siete sure che volete cancellare '"+text+"'?");
    if (yesp) {
        return true;
    } else {
        return false;
    }
}
