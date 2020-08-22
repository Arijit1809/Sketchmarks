const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const multer=require("multer")
const path=require("path")
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const fs=require("fs")
/************************* Package End ******************************/ 

const app=express()

/****************************App settings****************************/
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json())
app.use(express.static("public"))

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
/****************************App settings end****************************/


/****************************Mongo Server****************************/
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
/****************************Mongo Server end****************************/


/****************************User Schema****************************/
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  about:String,
  contact : String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
/****************************User Schema end****************************/


/****************************Post Schema*********************************/
const postSchema=new mongoose.Schema({
    name: String,
    desc: String,
    filename: String,
    img:{
        data: Buffer,
        contentType: String
    },
    likes: {
        likesNum: Number,
        likers: [String]
    },
    comments: [Object] 
})

const Post=new mongoose.model("Post",postSchema)
/****************************Post Schema end********************************/

/****************************Passport Settings****************************/
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/****************************Passport Settings end****************************/


/****************************Multer Settings****************************/
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },

    filename: (req, file, cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const imageFilter = (req, file, cb)=>{
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)){
        req.fileValidationError = 'Only image files are allowed.'
        return cb(new Error('Only image files are allowed.'), false)
    }
    cb(null, true)
}

const upload=multer({storage: storage,fileFilter: imageFilter})
/****************************Multer Settings end****************************/

/****************************Get requests****************************/
app.get("/",(req,res)=>{
    Post.find({}).sort({$natural: -1}).limit(12).exec((err,results)=>{
        if(err) console.log(err)
        else{
            if (req.user)
                res.render("index",{
                    loginDisplay: "none",
                    signupDisplay: "none",
                    logoutDisplay: "inline-block",
                    profileDisplay: "inline-block",
                    username: req.user.username,
                    recentPosts: results
                })
            else
                res.render("index",{
                    loginDisplay: "inline-block",
                    signupDisplay: "inline-block",
                    logoutDisplay: "none",
                    profileDisplay: "none",
                    username: "NA",
                    recentPosts: results
                })
        }
    })
})

app.get("/signup", (req, res)=>{
    res.render("signup")
})

app.get("/login",(req,res)=>{
    res.render("login", {errorVisi: "hidden"})
})

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/profile/:username_url", (req, res)=>{
    const username=req.params.username_url;
    User.findOne({username: username},(err,result)=>{
        if(err) console.log(err)
        else{
            if(result){
                const about=result.about
                const contact=result.contact
                
                Post.find({name: username}).sort({$natural: -1}).exec((err,results)=>{
                    if(err) console.log(err)
                    else {
                        if(req.isAuthenticated() && req.user.username==username)
                            res.render("profile",{
                                username: username,
                                about: about,
                                contact: contact,
                                works: results,
                                loginDisplay: "none",
                                signupDisplay: "none",
                                logoutDisplay: "inline-block",
                                profileDisplay: "none",
                                sameUser: true 
                            })
                        else
                            res.render("profile",{
                                username: username,
                                about: about,
                                contact: contact,
                                works: results,
                                loginDisplay: "inline-block",
                                signupDisplay: "inline-block",
                                logoutDisplay: "none",
                                profileDisplay: "none",
                                sameUser: false 
                            })
                    }
                })
            }
            else res.send("404: Username not found")
        }
    })

});

app.get("/posts",function(req,res){
    res.render("posts");
})

app.get("/likepost/:postId",(req,res)=>{
    if(req.isAuthenticated()){
        Post.findById(req.params.postId,(err,result)=>{
            if(err) console.log(err)
            else{
                let ind=result.likes.likers.indexOf(req.user.username)
                if(ind>-1){
                    result.likes.likesNum--
                    result.likes.likers.splice(ind,1)
                }
                else{
                    result.likes.likesNum++
                    result.likes.likers.push(req.user.username)
                }
                result.save()
                res.send(`${result.likes.likesNum}`)
            }
        })
    }
    else res.send(false)
})

app.get("/thread/:postId",(req,res)=>{
    Post.findById(req.params.postId,(err,result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.get("/deletepost/:postId",(req,res)=>{
    Post.findById(req.params.postId,(err,result)=>{
        if(err) console.log(err)
        else{
            if(req.isAuthenticated() && req.user.username==result.name){
                fs.unlink("uploads/"+result.filename,(err)=>{if(err)console.log(err)})
                Post.deleteOne({_id: req.params.postId},(err,result)=>{
                    if(err) console.log(err)
                    else res.send(true)
                })
            }
            else res.send("You are not authorised to perform this action.")
        }
    })


})

app.get("/tile",(req,res)=>{
    res.render("tile")
})

// app.get("/loginfail",(req,res)=>{
//     res.render("login", {errorVisi: "visible"})
// })
/****************************Get requests end****************************/

/****************************Post Requests****************************/
app.post("/signup", function (req, res) {
    username=req.body.username
    about=req.body.about
    contact=req.body.contact

    User.register({
        username: req.body.username,
        about : req.body.about,
        contact: req.body.contact
    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/signup");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect(`/profile/${username}`);
            });
        }
    });
});

app.post('/login',(req,res)=>{
    passport.authenticate('local', (err,user)=>{
        if(err) console.log(err)
        else if(!user) res.render("login", {errorVisi: "visible"})
        else{
            req.logIn(user,(err)=>{
                if(err) console.log(err)
                else res.redirect(`/profile/${user.username}`)
            })
        }
    })(req,res)
})

app.post("/submit",upload.single("work"),(req,res)=>{
    if(req.isAuthenticated()){
        let imgObj={
            name: req.user.username,
            desc: req.body.desc,
            filename: req.file.filename,
            img:{
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            likes:{
                likesNum: 0,
                likers: []
            },
            comments: []
        }
        Post.create(imgObj,(err,result)=>{
            if(err) console.log(err)
            else{ 
                result.save()
                res.redirect(`/profile/${req.user.username}`)
            }
        })
    }
    else res.redirect("/login") 
})

// app.post("/getpost",(req,res)=>{
//     Post.findById(req.body.id,(err,result)=>{
//         if(err) console.log(err)
//         else res.send(result)
//     })
// })


app.post("/checkusername",(req,res)=>{

    User.findOne({username: req.body.user},(err,result)=>{
        if(err) console.log(err)
        else{
            res.send(result!=null)
        }
    })
})

app.post("/comment/:postId",(req,res)=>{
    if(req.isAuthenticated()){
        Post.findByIdAndUpdate(req.params.postId,{$push:{"comments": {name: req.user.username, comment: req.body.comment}}},{new: true},(err,result)=>{
            res.send(result.comments)
        })
    }
    else res.send(false)
})
/****************************Post requests end****************************/

app.listen(3000,()=>{
    console.log("Server started on port 3000")
})
