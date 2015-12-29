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
    var hashArray = hash.split('/');
    $view.empty();

    console.log(hashArray);
    if (hashArray.length > 1) {
        console.log('больше 1');
        if(!isNaN(Number(hashArray[1]))) {     // Если hash число =>
            getDataAndPastInHtml('exerciseWrapper', '#view');
            getDataAndPastInHtml('exercise', '.swiper-wrapper', function (data) {
                for (var i = 2; i <= 10; i++) {
                    var obj = $(data);
                    var selector = '#' + i + ' .labelExercise';
                    var $swiper = $('.swiper-container');

                    obj.attr('id', i);
                    obj.css('background', getRandomColor());

                    $('.swiper-wrapper').append(obj);
                    //$view.append(obj);
                    $swiper.css('height', window.innerHeight - $swiper.offset().top);

                    $(selector).text(i);
                }
                var mySwiper = new Swiper('.swiper-container');
            });
        } else {
            getDataAndPastInHtml('listItems', '#view', function () {
                $('#title').text('Главная');
            });
        }
    } else if(hashArray.length == 1 && hashArray[0] != '') {    // если хэш только одно слово
        console.log('равно 1');
        getDataAndPastInHtml('listExercise', '#view', function () {
            var menu = JSON.parse(localStorage.getItem('menu'));
            var hash = hashArray[0];
            if (!menu[hash]){   // если в объекте нет упражнения указанного в hash => отправляем на главную
                $view.empty();
                getDataAndPastInHtml('listItems', '#view', function () {
                    $('#title').text('Главная');
                });
                location.hash = '';
                console.log('object is not find');
                return;
            }
            var exArray = menu[hash].exercise;

            for (var i = 0; i<exArray.length; i++) {
                var $li = $('<li>');
                $li.attr('id', exArray[i].id);
                $li.text(exArray[i].name);
                $li.appendTo('#listExercise');
            }
            $('#title').text(menu[hash].name);
        });
    } else {
        getDataAndPastInHtml('listItems', '#view', function () {
            $('#title').text('Главная');
        });
    }

    //if(Number(hash) != 0 && !isNaN(Number(hash))) {     // Если hash число =>
    //
    //
    //} else {
        //if (hash == '') {
        //    getDataAndPastInHtml('listExercise', '#view', createListExercise);
        //} else {
        //
        //}
    //}

    //loadContent();
}

//function loadContent (name) {
//    var hash = location.hash.substr(1);
//    var $title = $('#title');
//    if(!name) {
//        //if(hash.search('chest') == 0) $title.text('Грудь');
//        switch (hash) {
//            case 'chest' || 1:
//                $title.text('Грудь');
//                break;
//            case 'arms':
//                $title.text('Руки');
//                break;
//            case 'legs':
//                $title.text('Ноги');
//                break;
//            case 'shoulders':
//                $title.text('Плечи');
//                break;
//            case 'press':
//                $title.text('Пресс');
//                break;
//            default :
//                $title.text('Главная');
//        }
//    } else {
//        $title.text(name);
//    }
//}

// функция достает из локального хранилища данные о созданных упражнениях
function createListExercise (name) {
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


