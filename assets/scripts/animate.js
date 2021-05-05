$(document).ready(function () {

    $('.menuBurger').click(function () {

        $(this).toggleClass("active");
        $('#Menu').toggleClass("active");
        $('#blur').toggleClass("display");

        if( $('.menuBurger').hasClass( "position-absolute") ){
            $('.menuBurger').toggleClass("position-absolute");
        }else{
            setTimeout(function() {
                $('.menuBurger').toggleClass("position-absolute");
            }, 300);
        }

    });
});