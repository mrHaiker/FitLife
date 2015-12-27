function getDataAndPastInHtml (name, where, callback){
    var link = 'links/'+name+'.html';
    var spinner = $('.spinner');

    spinner.addClass('visible');
    $.ajax({
        url: link,
        success: function(data){
            $(where).append(data);
            if(callback) callback();
            spinner.removeClass('visible');
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

function ajaxPost(link, str, callback){
    $.ajax({
        url: link,
        type: 'POST',
        data: str,
        success: function (data) {
            console.log(data);
        }
    })
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

function seyHello(name) {
    var $div = $('<div>');
    $div.addClass('helloWindow');
    $div.text('Приветсвую Вас, '+name+'!');
    setTimeout(function () {
        $div.appendTo('body').fadeIn(1000);
    },1500);
    setTimeout(function () {
        $div.fadeOut(2000)
    },3000);
}

function valid(param, type) {
    var regex = ['"', '№', '*', '+', '#', '@', '!', '$', '%', '^', '&', '*', '(', ')', '_', '=', '/', '[', ']', '|', ',', '.'];
    if (type == 'name') {
        regex.push(1,2,3,4,5,6,7,8,9,0);
    }
    for (var i = 0; i < regex.length; i++) {
        for (var j = 0; j<param.length; j++) {
            if (param.charAt(j) == regex[i]) {
                return false;
            }
        }
    }
    return true;
}

function loadPage () {
    var hash = location.hash;

    $('#view').empty();
    if (hash == '') {
        getDataAndPastInHtml('listItems', '#view');
    } else {
        getDataAndPastInHtml('listExercise', '#view');
        loadContent();
    }
    setTitle();

}

function loadContent() {
    var hash = location.hash;
}

function setTitle (name) {
    var hash = location.hash;
    var $title = $('#title');
    if(!name) {
        switch (hash) {
            case '#chest':
                $title.text('Грудь');
                break;
            case '#arms':
                $title.text('Руки');
                break;
            case '#legs':
                $title.text('Ноги');
                break;
            case '#shoulders':
                $title.text('Плечи');
                break;
            case '#press':
                $title.text('Пресс');
                break;
            default :
                $title.text('Главная');
        }
    } else {
        $title.text(name);
    }
}