$(document).ready(()=>{
    $(window).scroll(() => {
        if (this.scrollY > 20)
            $(".navbar").addClass("sticky")
        else
            $(".navbar").removeClass("sticky")
    })

    $('.menu-toggler').click(function () {
        $(this).toggleClass("active");
        $(".navbar-menu").toggleClass("active");
    });
    let id=$(".tile-img").attr("id")
    $(".sub-btn").click(function(){
        let newComment=$(".comment-area").val()
        $(".comment-area").val("")
        if (newComment){
            $.post("/comment/"+id,{comment: newComment}, function(result,status){
                if(result){
                    let commentsString = ""
                    result.comments.forEach(function (comment) {
                        if (comment.name == result.viewer) {
                            commentsString += `<div class="comment"><a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>\n`
                        }
                        else {
                            commentsString += `<div class="comment"><a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says ${comment.comment}</div>\n`
                        }
                    })
                    $(".click-div-comments").html(commentsString)
                }
                else location="/login"
            })
        }
    })
    $(".like-btn").click(function(){
        $.get("/likepost/"+$(".tile-img").attr("id"),function(result,status){
            if(result){
                if(result.colour)
                    $("#heart").css("color","red").removeClass("far").addClass("fas").css("transition","0.3s ease-in-out")
                else
                    $("#heart").css("color","grey").removeClass("fas").addClass("far").css("transition","0.3s ease-in-out")
                $(".likes-number").html(result.likes)
            } 
            else location="/login"
        })
    })
    $("#click-div-delete").click(function(){
        let sure=confirm("Are you sure you want to delete this post?")
        if(sure){
            $.get("/deletepost/"+$(".tile-img").attr("id"),function(result,status){
                location="/profile/"+result
                console.log(done)
            })
        }
    })
    $(".click-div-comments").on("click",".delete-comment",function () {
        let sure = confirm("Are you sure you want to delete this comment?")
        if (sure) {
            let id = $(".tile-img").attr("id")
            $.post("/deletecomment/" + id, { comment: $(this).parent().children("span").html() }, function (result, status) {
                let commentsString = ""
                result.comments.forEach(function (comment) {
                    if (comment.name == result.viewer) {
                        commentsString += `<div class="comment"><a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>\n`
                    }
                    else {
                        commentsString += `<div class="comment"><a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says ${comment.comment}</div>\n`
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
})
new ClipboardJS(".click-div-share")