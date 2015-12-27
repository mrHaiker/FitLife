$(document).ready(function(){

    var authorization = true;   //Проверка авторизации
    var userName,
        userData = {},
        lastVisit,
        $userName;


    if(!localStorage.getItem('UserData')) {
        // Если не задано имя и нет никаких данных на локальной машине
        // необходимо спросить имя и создать первую запись
        getDataAndPastInHtml('whatName', 'body', setMarginForAuthorization);
    } else {
        loadPage();
        userName = JSON.parse(localStorage.getItem('UserData')).name;
        seyHello(userName);
    }


    // Authorization
    if(!authorization) {
        getDataAndPastInHtml('authorization', 'body', setMarginForAuthorization);
        getDataAndPastInHtml('login', '#contentAuthorization');
    }

    // Отслеживание изменения Hash
    window.addEventListener('hashchange', function () {
        setTimeout(function () {
            loadPage();
        },300);
    });

    //******************************** События ********************************//
    $(window).resize(function(){    // Применяет стиль при изминении высоты окна
        setMarginForAuthorization();
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

        localStorage.setItem('UserData', JSON.stringify(userData));
        userName = JSON.parse(localStorage.getItem('UserData')).name;

        getDataAndPastInHtml('listItems', '#view');
        $('#yourName').remove();    //удаляем окно с вопросом

        seyHello(userName);
    });


    // Выбор группы в главном меню
    $(document).on('click', '.main-group li img', function () {
        var $this = $(this);
        $('.main-group li').fadeOut(500);
        $('.spinner').addClass('visible');

        setTimeout(function () {
            location.hash = $this.attr('id');
            //$('#title').text($this.attr('alt'));
            setTitle($this.attr('alt'));    //Изменения заголовка страницы
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

        $(document).on('click', '#addExercise_input', function () {
            return clickOnPlus = false;
        });

        if (clickOnPlus) {
            $exerciseInp.toggleClass('open');
        }
        if($exerciseInp.val()) {
            var $li = $('<li>');
            $li.text($exerciseInp.val());
            $li.prependTo('#listExercise').addClass('animated fadeInDown');
        }
    });



        var menuObj = {
        chest: {
            globalId: 1000,
            exercise: [{
                name: 'Жим лежа',
                id: 10
            }]
        },
        arms: {
            globalId: 2000
        }
    };

    var menu = JSON.parse(localStorage.getItem('menu'));
    menu.legs = {
        globalId: 3000
    };

    localStorage.setItem('menu', JSON.stringify(menuObj));
    console.log(menu);

});