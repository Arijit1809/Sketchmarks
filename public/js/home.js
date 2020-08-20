$(document).ready(()=>{
  $(window).scroll(()=>{
    if(this.scrollY>20)
    $(".navbar").addClass("change")
    else
    $(".navbar").removeClass("change")
  })

  function readURL(input){
    if (input.files && input.files[0]){
      let reader = new FileReader()

      reader.onload=(e)=>{
        $('#preview').attr('src', e.target.result)
      }

      reader.readAsDataURL(input.files[0])
    }
  }

  $("#post-img").change(function(){
    readURL(this)
  })

  $(".click-img").click(function(){
    $(".click-div").css("display","flex")
    let src=$(this).attr("src")
    let id=$(this).attr("id")
    $.get("/thread/"+id,function(result,status){
      $("#click-div-img").attr("src",src)
      $("#click-div-user").html("By "+ result.name)
      $(".like-btn").attr("id",result._id)
      $(".likes-number").html(result.likes)
      let commentsString=""
      result.comments.forEach(function(comment){
        commentsString+=`<div>${comment.name} says ${comment.comment}</div>\n`
      })
      $(".click-div-comments").html(commentsString)
    })
  })

  $("#click-div-close").click(function(){
    $(".click-div").css("display","none")
    $("#click-div-img").attr("src","")
    $("#click-div-user").html("")
    $(".like-btn").attr("id","")
    $(".likes-number").html("")
  })

  $(".like-btn").click(function(){
    $.post("/likepost",{id: $(this).attr("id")},function(result,status){
      $(".likes-number").html(result)
    })
  })

  $(".post-submit").click(function(){
    let id=$(".like-btn").attr("id")
    let newComment=$(".post-comment").val()
    $(".post-comment").val("")
    $.post("/comment/"+id,{comment: newComment},function(result,status){
      if(result){
        let commentsString=""
        result.forEach(function(comment){
          commentsString+=`<div>${comment.name} says ${comment.comment}</div>\n`
        })
        $(".click-div-comments").html(commentsString)
      }
      else{
        $(".post-comment").val("You must be logged in to continue")
      }
    })

  })
})

// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i;

// Full-width images
function one() {
    for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "100%";  // IE10
    elements[i].style.flex = "100%";
  }
}
// Two images side by side
function two() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "50%";  // IE10
    elements[i].style.flex = "50%";
  }
}
// Four images side by side
function four() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "25%";  // IE10
    elements[i].style.flex = "25%";
  }
}

// Add active class to the current button (highlight it)
var header = document.getElementById("myHeader");
var btns = header.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

//swiper
var swiper = new Swiper('.swiper-container', {
     effect: 'coverflow',
     grabCursor: true,
     centeredSlides: true,
     slidesPerView: 'auto',
     coverflowEffect: {
       rotate: 50,
       stretch: 0,
       depth: 100,
       modifier: 1,
       slideShadows: true,
     },
     pagination: {
       el: '.swiper-pagination',
     },
   });
