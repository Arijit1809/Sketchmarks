let regex= /^[a-z0-9]+$/i
$(document).ready(function(){
    $("#username").keyup(function(){
        let username=$(this).val()
        $(".user-error").css("visibility","visible")
        if(username.length>4){
            $.post("/checkusername",{user: $(this).val()},function(data,status){
                if(data){
                    $(".user-error").html(`<a style="color: red;">Username unavailable</a>`)
                    $("#sub-btn").attr("type","button")
                }
                else if(!username.match(regex)){
                    $(".user-error").html(`<a style="color: red;">Username can only have letters and numbers</a>`)
                    $("#sub-btn").attr("type","button")
                }
                else{
                    $(".user-error").html(`<a style="color: rgb(0, 190, 0);">Username available</a>`)
                    $("#sub-btn").attr("type","submit")
                }
            })            
        }
        else{
            $(".user-error").html(`<a style="color: red;">Username should be 5 characters at least</a>`)
            $("#sub-btn").attr("type","button")
        }
    })
})