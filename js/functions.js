function getDataAndPastInHtml (name, where, callback){
    var link = 'links/'+name+'.html';
    var spinner = $('.spinner');

    spinner.addClass('visible');
    $.ajax({
        url: link,
        success: function(data){
            $(where).append(data);
            spinner.removeClass('visible');

            if(callback) callback(data);
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

// загружает сонтент в соответствии с hash
function loadPage () {
    var hash = location.hash.substr(1);
    var $view = $('#view');

    if(Number(hash) != 0 && !isNaN(Number(hash))) {     // Если hash число =>
        getDataAndPastInHtml('exerciseWrapper', '#view');
        getDataAndPastInHtml('exercise', '.swiper-wrapper', function (data) {
            for (var i = 2; i<=10; i++) {
                var obj = $(data);
                var selector = '#'+i+' .labelExercise';
                var $swiper = $('.swiper-container');

                obj.attr('id', i);
                obj.css('background', getRandomColor());

                $('.swiper-wrapper').append(obj);
                //$view.append(obj);
                $swiper.css('height', window.innerHeight-$swiper.offset().top);

                $(selector).text(i);
            }
            var mySwiper = new Swiper('.swiper-container');
        });

    } else {
        if (hash == '') {
            getDataAndPastInHtml('listItems', '#view');
        } else {
            getDataAndPastInHtml('listExercise', '#view', createListExercise);
        }
    }

    $view.empty();
    loadContent();
}

function loadContent (name) {
    var hash = location.hash.substr(1);
    console.log(hash.search('chest'));
    var $title = $('#title');
    if(!name) {
        //if(hash.search('chest') == 0) $title.text('Грудь');
        switch (hash) {
            case 'chest' || 1:
                $title.text('Грудь');
                break;
            case 'arms':
                $title.text('Руки');
                break;
            case 'legs':
                $title.text('Ноги');
                break;
            case 'shoulders':
                $title.text('Плечи');
                break;
            case 'press':
                $title.text('Пресс');
                break;
            default :
                $title.text('Главная');
        }
    } else {
        $title.text(name);
    }
}

// функция достает из локального хранилища данные о созданных упражнениях
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
        '#423189', //Глубокий фиолетовый
        '#ED760E', //Жёлто-оранжевый
        '#C41E3A', //Кардинал
        '#4169E1', //Королевский синий
        '#E59E1F',  //Насыщенный жёлтый
        'rgb(188,173,155)',  //true
        'rgb(57,14,83)',  //true
        'rgb(166,4,41)'  //true
    ];
    var num = Math.floor(Math.random()*colorArray.length);
    return colorArray[num];
}

function getRandomColor () {
    var num = 200;
    var r = Math.floor(Math.random()*num);
    var g = Math.floor(Math.random()*num);
    var b = Math.floor(Math.random()*num);
    return 'rgb('+r+','+g+','+b+')'
}


