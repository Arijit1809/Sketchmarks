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
        $(".secondary-img").attr("src",src)
        $("#click-div-user").html(`By <a href="/profile/${result.data.name}">${result.data.name}</a>`)
        $(".click-div-desc").html(result.data.desc)
        $(".click-div-share").attr("data-clipboard-text","/tile/"+id)
        $(".like-btn").attr("id",result.data._id)
        $(".likes-number").html(result.data.likes.likesNum)
        if (result.colour) $("#heart").css("color","red")
        else $("#heart").css("color","white")
        let commentsString=""
        result.data.comments.forEach(function(comment){
          commentsString+=`<div><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
        })
        $(".click-div-comments").html(commentsString)
      })
    }
  })

  $("#click-div-close").click(function(){
    $(".click-div").css("display","none")
    $(".click-div-desc").html("")
    $(".click-div-share").attr("data-clipboard-text","")
    $("#click-div-img").attr("src","")
    $("#click-div-user").html("")
    $("#heart").css("color","black")
    $(".like-btn").attr("id","")
    $(".likes-number").html("")
  })

  $(".like-btn").click(function(){
    $.get("/likepost/"+$(this).attr("id"),function(result,status){
        if(result){
            if(result.colour)
                $("#heart").css("color","red")
            else
                $("#heart").css("color","grey")
            $(".likes-number").html(result.likes)
        } 
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

new ClipboardJS(".click-div-share")