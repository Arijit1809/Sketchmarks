$(document).ready(()=>{
    let id=$(".tile-img").attr("id")
    $(".sub-btn").click(function(){
        let newComment=$(".comment-area").val()
        $(".comment-area").val("")
        if (newComment){
            $.post("/comment/"+id,{comment: newComment}, function(result,status){
                if(result){
                    let commentString=""
                    result.comments.forEach(comment=>{
                        if(result.viewer==comment.name){
                            commentString+=`<div class="comment">
                            <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>`
                        }
                        else{
                            commentString+=`<div class="comment">
                            <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;</div>`
                        }
                        $(".click-div-comments").html(commentString)
                        $(".delete-comment").click(function(){
                            let sure=confirm("Are you sure you want to delete this comment?")
                            if(sure){
                                $.post("/deletecomment/"+id,{comment: $(this).parent().children("span").html()},function(result,status){
                                    let commentString=""
                                    result.comments.forEach(comment=>{
                                        if(result.viewer==comment.name){
                                            commentString+=`<div class="comment">
                                            <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>`
                                        }
                                        else{
                                            commentString+=`<div class="comment">
                                            <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;</div>`
                                        }
                                    });
                                    $(".click-div-comments").html(commentString)
                                })
                            }
                        })
                    })
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
    $(".delete-comment").click(function(){
        let sure=confirm("Are you sure you want to delete this comment?")
        if(sure){
            $.post("/deletecomment/"+id,{comment: $(this).parent().children("span").html()},function(result,status){
                let commentString=""
                result.comments.forEach(comment=>{
                    if(result.viewer==comment.name){
                        commentString+=`<div class="comment">
                        <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;<i class="fas fa-trash delete-comment" title="Delete this comment"></i></div>`
                    }
                    else{
                        commentString+=`<div class="comment">
                        <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span> &nbsp;</div>`
                    }
                });
                $(".click-div-comments").html(commentString)
            })
        }
    })
})
new ClipboardJS(".click-div-share")