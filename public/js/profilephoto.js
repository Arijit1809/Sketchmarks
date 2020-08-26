$(document).ready(function(){
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