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
});