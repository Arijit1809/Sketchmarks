$(document).ready(()=>{
  $(window).scroll(()=>{
    if(this.scrollY>20)
    $(".navbar").addClass("sticky")
    else
    $(".navbar").removeClass("sticky")
  })

  $('.menu-toggler').click(function () {
    $(this).toggleClass("active");
    $(".navbar-menu").toggleClass("active");
  });


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

  let media=matchMedia("(max-width: 768px)")

  $(".click-img").click(function(){
    let src=$(this).attr("src")
    let id=$(this).attr("id")
    if(media.matches){
      location="/tile/"+id
    }
    else{
      $(".click-div").css("display","flex")
      $.get("/thread/"+id,function(result,status){
        $("#click-div-img").attr("src",src)
        $("#click-div-user").html(`By <a href="/profile/${result.name}">${result.name}</a>`)
        $(".click-div-desc").html(result.desc)
        $(".like-btn").attr("id",result._id)
        $(".likes-number").html(result.likes.likesNum)
        let commentsString=""
        result.comments.forEach(function(comment){
          commentsString+=`<div><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
        })
        $(".click-div-comments").html(commentsString)
      })
    }
  })

  $("#click-div-close").click(function(){
    $(".click-div").css("display","none")
    $(".click-div-desc").html("")
    $("#click-div-img").attr("src","")
    $("#click-div-user").html("")
    $(".like-btn").attr("id","")
    $(".likes-number").html("")
  })

  $(".like-btn").click(function(){
    $.get("/likepost/"+$(this).attr("id"),function(result,status){
      if(result) $(".likes-number").html(result)
      else location="/login"
    })
  })

  $(".post-submit").click(function(){
    let id=$(".like-btn").attr("id")
    let newComment=$(".post-comment").val()
    $(".post-comment").val("")
    if(newComment){
      $.post("/comment/"+id,{comment: newComment},function(result,status){
        if(result){
          let commentsString=""
          result.forEach(function(comment){
            commentsString+=`<div><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
          })
          $(".click-div-comments").html(commentsString)
        }
        else location="/login"
      })
    }
  })
})

// Get the elements with class="column"
// let elements = document.getElementsByClassName("column");

// Declare a loop variable
// let i;

// // Full-width images
// function one() {
//     for (i = 0; i < elements.length; i++) {
//     elements[i].style.msFlex = "100%";  // IE10
//     elements[i].style.flex = "100%";
//   }
// }
// // Two images side by side
// function two() {
//   for (i = 0; i < elements.length; i++) {
//     elements[i].style.msFlex = "50%";  // IE10
//     elements[i].style.flex = "50%";
//   }
// }
// // Four images side by side
// function four() {
//   for (i = 0; i < elements.length; i++) {
//     elements[i].style.msFlex = "25%";  // IE10
//     elements[i].style.flex = "25%";
//   }
// }

// Add active class to the current button (highlight it)
// let header = document.getElementById("myHeader");
// let btns = header.getElementsByClassName("btn");
// for (let i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function() {
//     var current = document.getElementsByClassName("active");
//     current[0].className = current[0].className.replace(" active", "");
//     this.className += " active";
//   });
// }

//swiper
let swiper = new Swiper('.swiper-container', {
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
