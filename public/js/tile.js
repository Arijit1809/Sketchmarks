$(document).ready(()=>{
    let id=$(".tile-img").attr("id")
    $(".sub-btn").click(function(){
        let newComment=$(".comment-area").val()
        $(".comment-area").val("")
        if (newComment){
            $.post("/comment/"+id,{comment: newComment}, function(result,status){
                if(result){
                    let commentString=""
                    result.forEach(comment => {
                        commentString+=`<div class="comment">
                        <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span>
                        </div>`
                    });
                    $(".click-div-comments").html(commentString)
                }
                else location="/login"
            })
        }
    })
    $(".like-btn").click(function(){
        $.get("/likepost/"+$(".tile-img").attr("id"),function(result,status){
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
    $("#click-div-delete").click(function(){
        let sure=confirm("Are you sure you want to delete this post?")
        if(sure){
            $.get("/deletepost/"+$(".tile-img").attr("id"),function(result,status){
                location="/profile/"+result
                console.log(done)
            })
        }
    })
})
new ClipboardJS(".click-div-share")