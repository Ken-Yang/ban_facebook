var d = document;

var selectFrom;
var selectTo;
var selectAfter;
var selectBefore;
var type;
var hour;
var count;
var LIMITATION = 'limitation_type';
var btnSave;
var btnConfirm;
var btnCancel;

var msgWarning;
var msgSuccess;
var msgError;

d.addEventListener('DOMContentLoaded', function () {
    // init 
    appendChild('from');
    appendChild('to');
    appendChild('after');
    appendChild('before');

    addEventListener('type_all');
    addEventListener('type_range');
    addEventListener('type_after');
    addEventListener('type_before');

    msgWarning = $('warning_confirm');
    msgSuccess = $('success_msg');
    msgError   = $('error_msg');

    selectFrom  = $('from');
    selectTo    = $('to');
    selectAfter = $('after');
    selectBefore= $('before');
    btnSave     = $('save');
    btnConfirm  = $('confirm');
    btnCancel   = $('cancel');

    var count = chrome.extension.getBackgroundPage().getAccessCount();
    $('access_count').innerHTML = count;

    btnSave.addEventListener('click', function(){confirm();},false);
    btnConfirm.addEventListener('click', function(){save();},false);
    btnCancel.addEventListener('click', function(){cancel();},false);
    selectFrom.addEventListener('change', function(){appendChild('to');},false);
    $('clear').addEventListener('click', function(){ localStorage.clear();chrome.storage.sync.clear();},false);

    chrome.storage.sync.get({
        limitation_type: 'type_all',
        limitation_date: 'null'
    }, function(item) {
        type = item.limitation_type;
        if ( new Date().getDate() == item.limitation_date) {
          msgError.style.display='block';
          $('content').style.display='none';
        }
    });
});

function addEventListener(id) {
    var obj = d.getElementById(id);
    obj.addEventListener('click', function(e){radioClicked(e);},false);
}


function $(id){
    return d.getElementById(id);
}

function confirm() {
    msgWarning.style.display='block';
    btnSave.style.display = 'none'; 
    btnConfirm.style.display = 'inline-block'; 
    btnCancel.style.display = 'inline-block'; 
}

function cancel() {
    msgWarning.style.display='none';
    btnSave.style.display = 'inline-block'; 
    btnConfirm.style.display = 'none'; 
    btnCancel.style.display = 'none'; 
}

function save() {
    if (type == 'type_range') {
    } else if (type == 'type_after') {
        hour = $('after').value;
    } else if (type == 'type_before') {
        hour = $('before').value;
    }

    chrome.storage.sync.set({
        limitation_type: type,
        limitation_date: new Date().getDate(),
        limitation_hour: hour
      }, function() {
          msgWarning.style.display='none';
          msgSuccess.style.display='block'
          $('content').style.display='none';;
          btnConfirm.style.display = 'none'; 
          btnCancel.style.display = 'none'; 
          btnSave.disabled = true;
          console.log('save success');  
    });

}

function radioClicked(e) {
    var id = e.target.id;
    type = id;
    if (id == 'type_all') {
       disableElement(selectFrom);
       disableElement(selectTo);
       disableElement(selectAfter);
       disableElement(selectBefore);
    } else if (id == 'type_range') {
       enableElement(selectFrom);
       enableElement(selectTo);
       disableElement(selectAfter);
       disableElement(selectBefore);
    } else if (id == 'type_after') {
       disableElement(selectFrom);
       disableElement(selectTo);
       enableElement(selectAfter);
       disableElement(selectBefore);
    } else if (id == 'type_before') {
       disableElement(selectFrom);
       disableElement(selectTo);
       disableElement(selectAfter);
       enableElement(selectBefore);
    }
}

function disableElement(e) { e.disabled = true; }
function enableElement(e) { e.disabled = false; }

function appendChild(id){
    var select = $(id);
    select.innerHTML='';
    var start = 0;
    if (id == 'to') {
      start  = parseInt($('from').value)+1;
    }
    for (var i=start; i<24; i++) {
      var option= d.createElement('option');
      option.setAttribute('value',i);
      option.innerHTML = i+':00';
      select.appendChild(option);
    }
}


