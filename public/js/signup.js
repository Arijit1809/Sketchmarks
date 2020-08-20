$(document).ready(function(){
    $("#username").keyup(function(){
        let username=$(this).val()
        $(".user-error").css("visibility","visible")
        if(username.length>4){
            wait=true
            $.post("/checkusername",{user: $(this).val()},function(data,status){
                if(data)
                    $(".user-error").html(`<a style="color: red;">Username unavailable</a>`)
                else
                    $(".user-error").html(`<a style="color: rgb(0, 190, 0);">Username available</a>`)
            })            
        }
        else
            $(".user-error").html(`<a style="color: red;">Username should be 5 characters at least</a>`)
    })
})