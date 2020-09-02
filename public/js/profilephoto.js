$(document).ready(()=>{
    if (scrollY>20){
        $(".navbar").addClass("sticky")
        $(".nav-btm").css("bottom","0")
    }
    $(window).scroll(()=>{
        if (this.scrollY>10){
            $(".navbar").addClass("sticky")
            $(".nav-btm").css("bottom","0")
        }
        else{
            $(".navbar").removeClass("sticky")
            $(".nav-btm").css("bottom","-70px")
        }
    })
    function readURL(input){
        if (input.files && input.files[0]){
            let reader=new FileReader()
            reader.onload=(e)=>{
                $('#preview').attr('src', e.target.result)
            }
            reader.readAsDataURL(input.files[0])
        }
    }
    $("#pfp").change(function(){
        readURL(this)
    })
})