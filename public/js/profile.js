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
    
    $(".gal-img").click(function(){
        $(".click-div").css("display","flex")
        let src=$(this).attr("src")
        let id=$(this).attr("id")
        $.get("/thread/"+id,function(result,status){
            $("#click-div-img").attr("src",src)
            $("#click-div-user").html("By "+ result.name)
            $(".like-btn").attr("id",result._id)
            $(".likes-number").html(result.likes.likesNum)
            let commentsString=""
            result.comments.forEach(function(comment){
                commentsString+=`<div><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
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
        $.get("/likepost/"+$(this).attr("id"),function(result,status){
            if(result) $(".likes-number").html(result)
            else alert("Log In to continue")
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
                    commentsString+=`<div><a href="/profile/${comment.name}">${comment.name}</a> says ${comment.comment}</div>\n`
                })
                $(".click-div-comments").html(commentsString)
            }
            else{
                $(".post-comment").val("You must be logged in to continue")
            }
        })
    
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