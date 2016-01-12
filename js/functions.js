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

function getJSFile (url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "script"
    });
}

function setMarginForAuthorization () {
    var $windowHeight = $(window).height();
    var $containerParam = $('#windowLogin');

    $windowHeight > 400 ? $containerParam.addClass('more') : $containerParam.removeClass('more');
}

function setHeightForListItems() {
    var $windowWidth = $(window).width();
    var $li = $('.main-group li');

    $li.css('height', $windowWidth*0.32);
}

function alert(text) {
    if ($(window).width() < 992) {
        var $div = $('<div>');
        $div.addClass('alert hidden-md hidden-lg');
        $div.text(text);
        setTimeout(function () {
            $div.appendTo('body').fadeIn(1000);
        },300);
        setTimeout(function () {
            $div.fadeOut(2000)
        },1800);
        setTimeout(function () {
            $div.remove();
        }, 3800)
    }
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

    if (hashArray.length > 1) {
        if (!isNaN(Number(hashArray[1]))) {     // Если hash 2 уровня число =>
            getDataAndPastInHtml('exerciseWrapper', '#view', function () {
                // Запрос шаблона приложения и обработка данных с бд
                getDataAndPastInHtml('exercise', '.swiper-wrapper', function (data) {
                    var history = JSON.parse(localStorage.getItem(hashArray[1]));
                    var date = new Date();
                    var toDay = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
                    if (!history) {     // если объекта еще не существует (первая инициализация) => создаем новый объект
                        var nOb = [
                            {
                                date: '2010/01/01'  // для корректной работы конструктора упражнений
                            },
                            {
                                date: toDay
                            }
                        ];
                        localStorage.setItem(hashArray[1], JSON.stringify(nOb));
                        history = JSON.parse(localStorage.getItem(hashArray[1]));
                    }
                    if (history[history.length-1].date != toDay) {  // если сегодняшнего объекта нет => создаем его
                        history.push({
                            date: toDay
                        });
                        localStorage.setItem(hashArray[1], JSON.stringify(history));
                    }

                    // редактирование шаблона упражнения вставляя информацию с бд
                    fillingExercisePage(history, data);

                    var mySwiper = new Swiper('.swiper-container'); // инициализируем плагин swiper
                });
            });
        } else {    // если hash 2 уровня не число отправляем на главную
            getDataAndPastInHtml('listItems', '#view', function () {
                $('#title').text('Главная');
                setHeightForListItems();
            });
        }
    } else if (hashArray.length == 1 && hashArray[0] != '' && hashArray[0] != 'newUser') {    // если hash 1 уровня только одно слово
        getDataAndPastInHtml('listExercise', '#view', function () {
            //достает из локального хранилища данные о созданных упражнениях
            var menu = JSON.parse(localStorage.getItem('menu'));
            var hash = hashArray[0];
            if (!menu[hash]) {   // если в объекте нет упражнения указанного в hash => отправляем на главную
                $view.empty();
                getDataAndPastInHtml('listItems', '#view', function () {
                    $('#title').text('Главная');
                    setHeightForListItems();
                });
                location.hash = '';
            } else {
                var exArray = menu[hash].exercise;

                for (var i = 0; i < exArray.length; i++) {
                    var $li = $('<li>');
                    $li.attr('id', exArray[i].id);
                    $li.text(exArray[i].name);
                    $li.appendTo('#listExercise');
                }
                $('#title').text(menu[hash].name);
            }
        });
    } else {    // если слова в hash 1 уровня нет в бд => на главную страницу
        if (hashArray[0] == 'newUser') {
            getDataAndPastInHtml('whatName', 'body', setMarginForAuthorization);
        } else {
            getDataAndPastInHtml('listItems', '#view', function () {
                $('#title').text('Главная');
                setHeightForListItems();
            });
        }
    }
}

// Функция наполняет шаблон с упражнениеями (data) данными с истории (history)
function fillingExercisePage(history, data) {
    var styleForFirst = '';
    var $swiper = $('.swiper-container');
    var toDayArray = history[history.length-1];
    var lastDayArray = history[history.length-2];
    var lot = typeof toDayArray.exs1 != "undefined" ? toDayArray.exs1.lot : typeof lastDayArray.exs1 != "undefined" ? lastDayArray.exs1.lot : 0;
    var times = typeof toDayArray.exs1 != "undefined" ? toDayArray.exs1.times : typeof lastDayArray.exs1 != "undefined" ? lastDayArray.exs1.times : 0;

    // изменение высоты слайдера для того что бы он не был меньшим чем высота экрана
    var freeWindHeight = window.innerHeight - $swiper.offset().top;
    if ($swiper.height() < freeWindHeight) $swiper.css('height', freeWindHeight);

    if (typeof toDayArray.exs1 != "undefined") styleForFirst = 'changed';

    $('#1 .window').text(lot).addClass(styleForFirst);
    $('#1 .times').text(times).addClass(styleForFirst);
    $('#1 .wrapper-exs .range-wrapper').append(createNewInputRange(times));
    $('#1 .average p:first').text(getAverageResult(history, 'exs1'));
    $('#1 .left-ellipsis').css('display', 'none');

    createChart(1, history);

    // цикл выстраивает n кол-во шаблонов упражнения и добавляет данные с бд
    for (var i = 2; i <= 10; i++) {
        var obj = $(data);
        var styleAllItems = '';
        var f_lot = typeof toDayArray['exs'+i] != "undefined" ? toDayArray['exs'+i].lot : typeof lastDayArray['exs'+i] != "undefined" ? lastDayArray['exs'+i].lot : 0;
        var f_times = typeof toDayArray['exs'+i] != "undefined" ? toDayArray['exs'+i].times : typeof lastDayArray['exs'+i] != "undefined" ? lastDayArray['exs'+i].times : 0;
        if (typeof toDayArray['exs'+i] != "undefined") styleAllItems = 'changed';

        obj.attr('id', i);

        obj.css('background', getRandomColor());
        $('.swiper-wrapper').append(obj);

        $('#' + i + ' .labelExercise').text(i);
        $('#' + i + ' .window').text(f_lot).addClass(styleAllItems);
        $('#' + i + ' .times').text(f_times).addClass(styleAllItems);
        $('#' + i + ' .wrapper-exs .range-wrapper').append(createNewInputRange(f_times));
        $('#' + i + ' .average p:first').text(getAverageResult(history, 'exs'+i));
        if (i == 10) $('#' + i + ' .right-ellipsis').css('display', 'none');
        createChart(i, history);
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
        'rgb(166,4,41)',  //true
        'rgb(27,192,184)',
        'rgb(181,137,102)',
        'rgb(110,17,99)',
        'rgb(109,184,122)',
        'rgb(5,81,199)',
        'rgb(53,122,14)',
        'rgb(113,90,162)',
        'rgb(148,7,19)',
        'rgb(17,71,126)',
        'rgb(39,26,106)',
        'rgb(26,17,41)',
        'rgb(199,65,73)',
        'rgb(144,0,59)',
        'rgb(44,34,33)'
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

function getAverageResult (obj, exs) {  //history || exs1
    var lot = [];
    var sum = 0;
    for (var i = 0; i < obj.length; i++) {
        var value = obj[i];
        var result = typeof value[exs] != "undefined" ? value[exs].lot : 0;
        if (result) lot.push(result);
    }
    for (var j = 0; j<lot.length; j++) {
        sum += lot[j];
    }

    if(lot.length) sum = (sum/lot.length).toFixed(1);
    return sum;
}

function createNewInputRange (val) {
    var $inp = $('<input>');
    $inp.attr({
        type: 'range',
        min: 0,
        max: 20,
        value: val,
        step: 1
    });
    return $inp;
}

function createChart(exs, obj) {
    var exercise = 'exs'+exs;
    var maxNum = 0;
    var chartArray = [];
    var $way = $('#' + exs + ' #chart');
    var $heightChart = $('#chart').height();
    for (var i = 0; i<obj.length; i++) {
        var value = obj[i];
        if( typeof value[exercise] != 'undefined') {
            var temp = (value[exercise].lot * value[exercise].times) / 10;
            if (temp > maxNum) maxNum = temp;
            if (temp) chartArray.push(temp);
        }
    }
    for (var j = 0; j < chartArray.length; j++) {
        var $div = $('<div>');
        var height = (chartArray[j]/maxNum)*$heightChart-20;
        $way.append($div);
        $div.animate({
            'height': height
        }, 1000)
    }
}

function checkWidthScreen() {
    var $windowWidth = $(window).width();
    var $message = $('.large-screen');
    if($windowWidth >= 992) {
        if (!$message.hasClass('large-screen')) {
            $message = $('<div>').addClass('large-screen hidden-xs hidden-sm')
                .append($('<p>').text('Данное приложение расчитано для мобильных устройств, а это сообщенеи появилось так как ширина вашего разширения больше допустимого!'))
                .append($('<p>').text('Что можно сделать?'))
                    .append($('<ul>')
                        .append($('<li>').text('Прежде всего можно зайти с мобильного телефона на этот сайт;'))
                        .append($('<li>').text('Можно выставить Ваш браузер в режиме окна, и уменьшить его ширину;')));

            $('body').append($message);
        }
    } else {
        $message.remove();
    }
}