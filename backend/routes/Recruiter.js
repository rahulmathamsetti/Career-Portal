var express = require("express");
var router = express.Router();

const Recruiter = require("../models/Recruiters");

//GET request

//get all recruiters
router.get("/all", function(req, res) {
    Recruiter.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});

router.get("/:id",(req, res) => {
    Recruiter.findOne({ id: req.params.id })
    .then(user => {
      if (!user) {
        res.status(404).json({status:"No recruiter found"});
      }
      res.json(user);
    })
    .catch(err => res.status(400).json(err));
});

// POST request 

router.post("/email",(req, res) => {
    Recruiter.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(200).json({status:"No recruiter found"});
      }
      res.json(user);
    })
    .catch(err => res.status(400).json(err));
});

// Add user
router.post("/register", (req, res) => {
    if(!req.body.email)
        res.status(200).json({status:"noemail"});
    else{
    let newUser = new Recruiter(req.body);
    Recruiter.findOne({email: req.body.email}).then(user=>{
        if(!user){
            console.log("Add new Recruiter");
            newUser.type="Recruiter";
            newUser.save()
            .then(newUser=>{
                res.status(200).json(newUser);
            })
            .catch(err=>{
                res.status(400).send(err);
            });
        }
        else{
            console.log("Already registered");
            res.status(200).json({status:"Already registered"});
        }
    });
}
});

// Login
router.post("/login", (req, res) => {
    const email=req.body.email;
    if(!email || !req.body.password ){
        res.status(200).json({status:"empty"});
    }
    else{
    Recruiter.findOne({email},function(err,user){
        if(err) console.log(err);
        else{
            if(user)
            {
                user.comparePassword(req.body.password,function(err,isMatch){
                    if(err) console.log(err);
                    console.log(req.body.password,isMatch," in recruiter");
                    if(isMatch)
                    {
                        //current user recruiter
                        res.status(200).json({status:"Recruiter"});
                    }
                    else{
                        res.status(200).json({status:"Incorrect"});
                    }
                });
            }
            else{
                res.status(200).json({status:"Register"});
            }
        }
    });
}
});


router.post("/update", (req, res) => {
    if(!req.body.email)
    res.status(200).json({status:"empty"});
    else{
        Recruiter.findOneAndUpdate({email:req.body.email},{$set:req.body})
        .then(user=>res.status(200).json(user))
        .catch(err=>console.log(err));
    }
});


module.exports = router;