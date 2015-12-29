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

    if (hashArray.length > 1) {
        if (!isNaN(Number(hashArray[1]))) {     // Если hash 2 уровня число =>
            getDataAndPastInHtml('exerciseWrapper', '#view', function () {
                // Запрос шаблона приложения и обработка данных с бд
                getDataAndPastInHtml('exercise', '.swiper-wrapper', function (data) {
                    var $swiper = $('.swiper-container');
                    var history = JSON.parse(localStorage.getItem(hashArray[1]));
                    var date = new Date();
                    var toDay = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
                    var toDayArray, lastDayArray;
                    if (!history) {     // если объекта еще не существует (первая инициализация) => создаем новый объект
                        console.info('I create new object');
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

                    toDayArray = history[history.length-1];
                    lastDayArray = history[history.length-2];

                    console.info(toDayArray);
                    console.info(lastDayArray);


                    console.log(getAvarageResult(history, 'exs1'));

                    // редактирование шаблона упражнения вставляя информацию с бд
                    var lot = typeof toDayArray.exs1 != "undefined" ? toDayArray.exs1.lot : typeof lastDayArray.exs1 != "undefined" ? lastDayArray.exs1.lot : 0;
                    var times = typeof toDayArray.exs1 != "undefined" ? toDayArray.exs1.times : typeof lastDayArray.exs1 != "undefined" ? lastDayArray.exs1.times : 0;
                    $('#1 .window').text(lot);
                    $('#1 .times').text(times);
                    $('#1 .inpRange').attr('value', times);
                    $('#1 .average p:first').text(getAvarageResult(history, 'exs1'));

                    // цикл выстраивает n кол-во шаблонов упражнения и добавляет данные с бд
                    for (var i = 2; i <= 10; i++) {
                        var obj = $(data);
                        var f_lot = typeof toDayArray['exs'+i] != "undefined" ? toDayArray['exs'+i].lot : typeof lastDayArray['exs'+i] != "undefined" ? lastDayArray['exs'+i].lot : 0;
                        var f_times = typeof toDayArray['exs'+i] != "undefined" ? toDayArray['exs'+i].times : typeof lastDayArray['exs'+i] != "undefined" ? lastDayArray['exs'+i].times : 0;

                        obj.attr('id', i);

                        obj.css('background', getRandomColor());
                        $('.swiper-wrapper').append(obj);

                        $swiper.css('height', window.innerHeight - $swiper.offset().top);
                        $('#' + i + ' .labelExercise').text(i);
                        $('#' + i + ' .window').text(f_lot);
                        $('#' + i + ' .times').text(f_times);
                        $('#' + i + ' .inpRange').attr('value', f_times);
                        $('#' + i + ' .average p:first').text(getAvarageResult(history, 'exs'+i));

                    }
                    var mySwiper = new Swiper('.swiper-container');
                });
            });
        } else {    // если hash 2 уровня не число отправляем на главную
            getDataAndPastInHtml('listItems', '#view', function () {
                $('#title').text('Главная');
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
            });
        }
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

function getAvarageResult (obj, exs) {
    var lot = [];
    var sum = 0;
    for (var i = 0; i < obj.length; i++) {
        var value = obj[i];
        var result = typeof value[exs] != "undefined" ? value[exs].lot : 0;
        lot.push(result);
        if (lot[i] == 0) {
            lot.splice(i,1)
        }
    }
    for (var j = 0; j<lot.length; j++) {
        sum += lot[j];
    }

    return (sum/lot.length).toFixed(1);
}

