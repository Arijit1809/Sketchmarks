$(document).ready(function () {
    $(window).scroll(function () {
        if (this.scrollY > 20) {
            $(".navbar").addClass("sticky");
            
        }
        else {
            $(".navbar").removeClass("sticky");
            
        }
    });


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
                    commentsString+=`<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
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
        $(".secondary-img").attr("src","")
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
                        commentsString+=`<div class="comment-div"><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
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
});
new ClipboardJS(".click-div-share")