function getDataAndPastInHtml (name, where, callback){
    var link = 'links/'+name+'.html';
    var spinner = $('.spinner');

    spinner.addClass('visible');
    $.ajax({
        url: link,
        success: function(data){
            $(where).append(data);
            spinner.removeClass('visible');
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

function alert(text) {
    var $div = $('<div>');
    $div.addClass('alert');
    $div.text(text);
    setTimeout(function () {
        $div.appendTo('body').fadeIn(1000);
    },300);
    setTimeout(function () {
        $div.fadeOut(2000)
    },1800);
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
    var hash = location.hash.substr(1);
    var $body = $('body');

    if(Number(hash) != 0 && !isNaN(Number(hash))) {     // Если hash число =>
        getDataAndPastInHtml('exercise', '#view');
        $body.css('background', getColor());
    } else {
        $body.css('background', '#ECECEC');
        if (hash == '') {
            getDataAndPastInHtml('listItems', '#view');
        } else {
            getDataAndPastInHtml('listExercise', '#view', createListExercise);
        }
    }

    $('#view').empty();
    loadContent();
}

function loadContent (name) {
    var hash = location.hash;
    var $title = $('#title');
    if(!name) {
        switch (hash) {
            case '#chest':
                $title.text('Грудь');
                //createListExercise('chest');
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

function createListExercise () {
    var menu = JSON.parse(localStorage.getItem('menu'));
    var hash = location.hash.substr(1);
    var exArray = menu[hash].exercise;
    if (!exArray) return;
    for (var i = 0; i<exArray.length; i++) {
        var $li = $('<li>');
        $li.attr('id', exArray[i].id);
        $li.text(exArray[i].name);
        $li.appendTo('#listExercise');
    }

}

function getColor () {
    var colorArray = [
        '#FF033E',
        '#423189',
        '#ED760E',
        '#C41E3A',
        '#4169E1',
        '#76FF7A',
        '#E59E1F'
    ];
    var num = Math.floor(Math.random()*colorArray.length);
    return colorArray[num];
}

