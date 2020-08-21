$(document).ready(()=>{
  $(window).scroll(()=>{
    if(this.scrollY>20)
    $(".navbar").addClass("change")
    else
    $(".navbar").removeClass("change")
  })
