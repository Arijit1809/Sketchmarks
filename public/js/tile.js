$(document).ready(()=>{
    $(".sub-btn").click(function(){
        let newComment=$(".comment-area").val()
        $(".comment-area").val("")
        let id=$(".tile-img").attr("id")
        if (newComment){
            $.post("/comment/"+id,{comment: newComment}, function(result,status){
                if(result){
                    commentString=""
                    result.forEach(comment => {
                        commentString+=`<div class="comment">
                        <a href="/profile/${comment.name}" class="commenter">${comment.name}</a> says <span>${comment.comment}</span>
                        </div>`
                    });
                    $(".img-comments").html(commentString)
                }
                else location="/login"
            })
        }
    })
})