function getDataWithHtml (name, where, callback){
    var link = 'links/'+name+'.html';
    $.ajax({
        url: link,
        success: function(data){
            $(where).append(data);
            if(callback) callback();
        }
    });
}

function clearElement(name) {
    $(name).empty();
}

function getJSFile (url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "script"
    });
}

function setMarginForAuthorization () {
    var WindowHeight = $(window).height();
    var containerParam = $('#windowLogin');
    if(WindowHeight > 400) {
        containerParam.addClass('more');
    } else {
        containerParam.removeClass('more');
    }
}