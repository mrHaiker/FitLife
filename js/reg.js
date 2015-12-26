$(document).on('click', '#registration', function () {
    if(!$(this).hasClass('active')){
        clearElement('#contentAuthorization');
        getDataAndPastInHtml('reg', '#contentAuthorization');
        $('#login').removeClass('active');
        $(this).addClass('active');
    }
});
$(document).on('click', '#login', function () {
    if(!$(this).hasClass('active')){
        clearElement('#contentAuthorization');
        getDataAndPastInHtml('login', '#contentAuthorization');
        $('#registration').removeClass('active');
        $(this).addClass('active');
    }
});


// Получение данных с поля Login
$(document).on('click', '#enterBtn', function () {
    var activePage = $('.btnGroup.active').attr('id');  // получаем id активной вкладки (login || reg)
    var str;
    if (activePage == 'login') {
        str = $('#loginForm').serialize();
        if (str.length > 0) {
            ajaxPost('php/createJSON.php', str);
        } else {
            alert('Вы ничего не ввели!');
        }
    } else if(activePage == 'registration') {
        str = $('#regForm').serialize();
        console.log(str);
        if (str.length > 0) {
            ajaxPost('php/createJSON.php', str);
        } else {
            alert('Вы ничего не ввели!');
        }
    }
});