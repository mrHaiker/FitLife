$(document).ready(function(){

    var authorization = true;   //Проверка авторизации
    var userData = {}, $userName, interval;
    var menu = JSON.parse(localStorage.getItem('menu'));
    var date = new Date();
    var toDay = date.getFullYear()+'/'+date.getMonth()+1+'/'+date.getDate();

    if(!localStorage.getItem('userData')) {
        // Если не задано имя и нет никаких данных на локальной машине
        // необходимо спросить имя и создать первую запись
        getDataAndPastInHtml('whatName', 'body', setMarginForAuthorization);
    } else {
        loadPage();
        $userName = JSON.parse(localStorage.getItem('userData')).name;
        alert('Приветсвую Вас, '+$userName+'!');
    }


    // Authorization
    if(!authorization) {
        getDataAndPastInHtml('authorization', 'body', setMarginForAuthorization);
        getDataAndPastInHtml('login', '#contentAuthorization');
    }



    //******************************** События ********************************//
    $(window).resize(function(){    // Применяет стиль при изминении высоты окна
        setMarginForAuthorization();
    });

    // Отслеживание изменения Hash
    window.addEventListener('hashchange', function () {
        setTimeout(function () {
            loadPage();
        },300);
    });

    // Проверка имени из поля ввода
    $(document).on('keyup', '#UserName', function () {
        var checking;
        var $btn = $('#setName');
        $userName = $('#UserName');
        $userName.removeClass('valid');
        $userName.removeClass('invalid');

        if($userName.val().length <=15 && $userName.val().length > 3) {
            if(valid($userName.val(), 'name')) {
                checking = true;
            }
        }
        if (checking == true) {
            $userName.addClass('valid');
            $btn.removeAttr('disabled');
            $btn.removeClass('disabled');
        } else {
            $userName.addClass('invalid');
            $btn.attr('disabled');
            $btn.addClass('disabled');
        }
        if ($userName.val() == 0) {
            $userName.removeClass('valid');
            $userName.removeClass('invalid');
        }
    });


    // Запись имени в локальное хранилище
    $(document).on('click', '#setName', function () {
        $userName = $('#UserName');
        userData.name = $userName.val();
        menu = {
           chest: {
               globalId: 100,
               name: 'Грудь',
               exercise: []
           },
           arms: {
               globalId: 200,
               name: 'Руки',
               exercise: []
           },
           legs: {
               globalId: 300,
               name: 'Ноги',
               exercise: []
           },
           back: {
               globalId: 400,
               name: 'Спина',
               exercise: []
           },
           shoulders: {
               globalId: 500,
               name: 'Плечи',
               exercise: []
           },
           press: {
               globalId: 600,
               name: 'Пресс',
               exercise: []
           }
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('menu', JSON.stringify(menu));
        $userName = JSON.parse(localStorage.getItem('userData')).name;

        //getDataAndPastInHtml('listItems', '#view');
        $('#yourName').remove();    //удаляем окно с вопросом
        location.hash = '';

        alert('Приветсвую Вас, '+$userName+'!');
    });


    // Выбор группы в главном меню
    $(document).on('click', '.main-group li img', function () {
        var $this = $(this);
        $('.main-group li').fadeOut(500);
        $('.spinner').addClass('visible');

        setTimeout(function () {
            location.hash = $this.attr('id');
        },500);

        $('body, html').animate({scrollTop: 0}, 400);
    });

    //Пустой клик
    $(document).click(function () {
        var $exerciseInp = $('#addExercise_input');
        if ($exerciseInp.width() > 50) {
            $exerciseInp.val('');
            $exerciseInp.removeClass('open');
        }
    });

    // Добавление нового названия упражнения
    $(document).on('click', '#AddExercise', function () {
        var $exerciseInp =  $('#addExercise_input');
        var clickOnPlus = true;
        var hash = location.hash.substr(1);
        var exercise = menu[hash].exercise;

        $(document).on('click', '#addExercise_input', function () {
            return clickOnPlus = false;
        });

        if (clickOnPlus) {
            $exerciseInp.toggleClass('open');
        }
        if($exerciseInp.val()) {
            var $li = $('<li>');
            var length = exercise.length;
            var idEx = length == 0 ? menu[hash].globalId : exercise[length-1].id;

            exercise.push({
                id: idEx+1,
                name: $exerciseInp.val()
            });

            localStorage.setItem('menu', JSON.stringify(menu));

            $li.text($exerciseInp.val());
            $li.attr('id', idEx+1);
            $li.appendTo('#listExercise').addClass('animated fadeInUp');

            alert('Добавлен новый элемент');
        }
    });

    // Переход к упражнению
    $(document).on('click', '#listExercise li', function () {
        location.hash += '/'+$(this).attr('id');
    });


    // счетчик для упражнений
    $(document).on('click', '.btnExs', function () {
        var $contentBtn = $(this).text();
        var $window = $('.swiper-slide-active .window');
        var $parentId = $('.swiper-slide-active').attr('id');
        var windowNum = Number($window.text());
        var hashArray = location.hash.substr(1).split('/');
        var history = JSON.parse(localStorage.getItem(hashArray[1]));
        var lastItem = history[history.length-1];
        var exercise = lastItem.exercise;

        windowNum += Number($contentBtn);


        exercise['exs'+$parentId] = {
            lot: windowNum
        };
        console.log(exercise);

        $window.text(windowNum);
    });

    // отслеживание изменения input[type=range]
    $(document).on('change', 'input[type=range]', function (e) {
        var $times = $('.swiper-slide-active #times');
        $times.text($(this).val());
        console.log($(this).val());
        e.preventDefault();
    });

    var nOob = [
        {
            date: '2015/12/29',
            exs1 : {
                lot: 50,
                times: 6
            }
        },

        {
            date: '2015/12/28',
            exercise : [
                {
                    num: 2,
                    lot: 33,
                    times:6
                }
            ]
        },
        {
            date: '2015/12/27'

        }
    ];
    //console.log(nOob[0]);
    if (nOob[0].date == toDay) {
        var exercise = nOob[0].exercise;
        //console.log(exercise[0].lot);
    }

});