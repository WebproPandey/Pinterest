var express = require('express');
var router = express.Router();
const userModale =  require("./users")
const PostModale =  require("./post")
const passport = require("passport")
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModale.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/feed', function(req, res, next) {
  res.render('feed' );
});
router.get('/profile', isLoggedIn, function(req, res, next) {

  res.render("profile")
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
  failureRedirect: "/login"
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
