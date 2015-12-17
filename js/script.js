$(document).ready(function(){

    var authorization = false;
    var registrationBtn = $('#registration');
    var loginBtn = $('#login');

    // Authorization
    if(!authorization) {
        getDataWithHtml('authorization', 'body', setMarginForAuthorization);
        getDataWithHtml('login', '#contentAuthorization');
    }

    //******************************** События ********************************//
    $(window).resize(function(){    // Применяет стиль при изминении высоты окна
        setMarginForAuthorization();
    });

    $(document).on('click', '#registration', function () {
        if(!$(this).hasClass('active')){
            clearElement('#contentAuthorization');
            getDataWithHtml('reg', '#contentAuthorization');
            $('#login').removeClass('active');
            $(this).addClass('active');
        }
    });
    $(document).on('click', '#login', function () {
        console.log($(this));
        if(!$(this).hasClass('active')){
            clearElement('#contentAuthorization');
            getDataWithHtml('login', '#contentAuthorization');
            $('#registration').removeClass('active');
            $(this).addClass('active');
        }
    });

});