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
        $.get("/likepost/"+id,function(result,status){
            if(result) $(".likes-number").html(result)
            else location="/login"
        })
    })
})
new ClipboardJS(".click-div-share")