$(document).ready(function () {
    if (scrollY>20){
        $(".navbar").addClass("sticky")
        $(".nav-btm").css("bottom","0")
    }
    $(window).scroll(function () {
        if (this.scrollY > 10) {
            $(".navbar").addClass("sticky")
            $(".nav-btm").css("bottom", "0")
        }
        else {
            $(".navbar").removeClass("sticky")
            $(".nav-btm").css("bottom", "-70px")
        }
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
            $.get("/thread/"+id,function(result,status){
                $("#click-div-img").attr("src",src)
                $(".secondary-img").attr("src",src)
                $("#click-div-user").html(`By <a href="/profile/${result.data.name}">${result.data.name}</a>`)
                $(".click-div-desc").html(result.data.desc)
                $(".click-div-share").attr("data-clipboard-text","sketchtiles.com/tile/"+id)
                $(".like-btn").attr("id",result.data._id)
                $(".likes-number").html(result.data.likes.likesNum)
                if (result.colour) $(".heart").css("color","red")
                else $(".heart").css("color","white")
                let commentsString = ""
                result.data.comments.forEach(function (comment) {
                    if (comment.name == result.viewer) {
                        commentsString += `<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a>: <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>\n`
                    }
                    else {
                        commentsString += `<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a>: ${comment.comment}</div>\n`
                    }
                })
                $(".click-div-comments").html(commentsString)
                $(".click-div").css("display","flex")
            })
        }
    })
    
    $("#click-div-close").click(function(){
        $(".click-div").css("display","none")
        $(".click-div-desc").html("")
        $(".click-div-share").attr("data-clipboard-text","")
        $("#click-div-img").attr("src","")
        $(".secondary-img").attr("src","")
        $("#click-div-user").html("")
        $(".click-div-comments").html("")
        $(".heart").css("color","black")
        $(".like-btn").attr("id","")
        $(".likes-number").html("")
    })
    
    $(".like-btn").click(function(){
        $.get("/likepost/"+$(this).attr("id"),function(result,status){
            if(result){
                if(result.colour)
                    $(".heart").css("color","red")
                else
                    $(".heart").css("color","white")
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
                    let commentsString = ""
                    result.comments.forEach(function (comment) {
                        if (comment.name == result.viewer) {
                            commentsString += `<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a>: <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>\n`
                        }
                        else {
                            commentsString += `<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a>: ${comment.comment}</div>\n`
                        }
                    })
                    $(".click-div-comments").html(commentsString)
                }
                else location="/login"
            })
        }
    
    })

    $("#click-div-delete").click(function(){
        let sure=confirm("Are you sure you want to delete this post?")
        if(sure){
            $.get("/deletepost/"+$(".like-btn").attr("id"),function(result,status){
                location.reload(true)
                console.log(done)
            })
        }
    })
    $(".click-div-comments").on("click",".delete-comment",function () {
        let sure = confirm("Are you sure you want to delete this comment?")
        if (sure) {
            let id = $(".like-btn").attr("id")
            $.post("/deletecomment/" + id, { comment: $(this).parent().children("span").html() }, function (result, status) {
                let commentsString = ""
                result.comments.forEach(function (comment) {
                if (comment.name == result.viewer) {
                    commentsString += `<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a>: <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>\n`
                }
                else {
                    commentsString += `<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a>: ${comment.comment}</div>\n`
                }
                })
                $(".click-div-comments").html(commentsString)
            })
        }
    })
    $(".click-div-share").click(function(){
        $(".tooltip").fadeIn()
        setTimeout(()=>{
          $(".tooltip").fadeOut()
        }, 3000);
    })
    $(document).ajaxStart(function(){
        $(".spinner").fadeIn().css("display","flex")
    }).ajaxStop(function(){
        $(".spinner").fadeOut()
    })
    if(!media.matches){
        $(".pfp-container").mouseover(function(){
            $(".change-pfp").fadeIn(300).css("display","flex")
        })
    }
    else{
        $(".pfp-container").click(function(){
            $(".change-pfp").fadeIn(300).css("display","flex")
        })
    }
    $(".pfp-container").mouseleave(function(){
        $(".change-pfp").fadeOut(300)
    })
    $(".icono-plusCircle").click(function(){
        $(".add-post").fadeIn().css("display","flex")
    })
    $(".add-postbtm").click(function(){
        $(".add-post").fadeIn().css("display","flex")
    })
    $(".new-post-close").click(function(){
        $(".add-post").fadeOut()
    })
    $(".profile-share").click(function(){
        $(".prof-tooltip").fadeIn().css("display","block")
        setTimeout(function(){
            $(".prof-tooltip").fadeOut()
        }, 3000);
    })
})
new ClipboardJS(".click-div-share")
new ClipboardJS(".profile-share")