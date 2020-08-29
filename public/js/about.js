$(document).ready(function(){
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
    $(".pic").mouseover(function(){
        $(this).children(".iconbar").fadeIn().css("display","flex")
    }).mouseleave(function(){
        $(this).children(".iconbar").fadeOut()
    })

})