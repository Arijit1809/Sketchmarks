$(document).ready(function(){
    if (scrollY>20){
        $(".navbar").addClass("sticky")
        $(".nav-btm").css("bottom","0")
    }
    $(window).scroll(function(){
        if (this.scrollY > 20){
          $(".navbar").addClass("sticky")
          $(".nav-btm").css("bottom","0")
        }
        else{
          $(".navbar").removeClass("sticky")
          $(".nav-btm").css("bottom","-70px")
        }
    })
    $('.menu-toggler').click(function () {
        $(this).toggleClass("active");
        $(".navbar-menu").toggleClass("active");
    });
    $(".pic").mouseover(function(){
        $(this).children(".iconbar").fadeIn().css("display","flex")
    }).mouseleave(function(){
        $(this).children(".iconbar").fadeOut()
    })

})