var express = require('express');
var router = express.Router();
const userModale =  require("./users")
const PostModale =  require("./post")
const passport = require("passport")
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModale.authenticate()))
const upload =  require("./multer")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login' ,{error: req.flash('error')});
});
router.get('/feed', function(req, res, next) {
  res.render('feed' );
});
router.get('/create', function(req, res, next) {
  res.render('create');
});
router.post('/upload', isLoggedIn,  upload.single("file")  , async function(req, res, next) {
 if(!req.file){
  return res.status(402).send("No file were uploaded")
 }
 const user =  await  userModale.findOne({
  username: req.session.passport.user
 })
let postdata = await  PostModale.create({
  Image:req.file.filename,
  postText:req.body.filecaption,
  user:user._id,
 })
 user.posts.push(postdata._id)
 await user.save()
 res.redirect("/profile")
});
router.get('/profile', isLoggedIn, async function(req, res, next) {
  let user  =  await userModale.findOne({
      username:req.session.passport.user,
  }).populate("posts")
  res.render("profile",{user})
});
router.post("/register" ,(req,res) =>
{
  let {username,fullname, email,  } = req.body
  let userData =  new  userModale({ username, fullname, email })
   
  userModale.register(userData , req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res , function() 
    {
      res.redirect("/profile")
    })
  })

})
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}))
router.get("/logout" ,function(req,res)
{
  req.logout(function(err)
  {
    if(err) {return next (err);}
    res.redirect("/")
  })
})
 function isLoggedIn (req,res ,next){
  if(req.isAuthenticated())
  {
    return next()
  }
  res.redirect("/login")
 }





module.exports = router;
