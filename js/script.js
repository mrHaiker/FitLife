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
        getDataAndPastInHtml('listItems', '#view');
        userName = JSON.parse(localStorage.getItem('UserData')).name;
        seyHello(userName);
    }


    // Authorization
    if(!authorization) {
        getDataAndPastInHtml('authorization', 'body', setMarginForAuthorization);
        getDataAndPastInHtml('login', '#contentAuthorization');
    }

    //$(document).click(function () {
    //    var hash = location.hash;
    //    if (hash == '') {
    //        getDataAndPastInHtml('listItems', '#view');
    //    }
    //});
    //******************************** События ********************************//
    $(window).resize(function(){    // Применяет стиль при изминении высоты окна
        setMarginForAuthorization();
    });

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
            $('#title').text($this.attr('alt')); //Изменения заголовка страницы
            $('.main-group').remove();
        },500);

        $('body, html').animate({scrollTop: 0}, 400);
    });


    var menuObj = {
        chest: {
            globalId: 10,
            exercise: [{
                name: 'Chest0',
                id: 10
            }]
        }
    };

    menuObj.chest.exercise.push({
        name: 'Chest',
        id: menuObj.chest.exercise.length+menuObj.chest.globalId
    });
    console.log(menuObj);


});