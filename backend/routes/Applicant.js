var express = require("express");
var router = express.Router();

const Applicant = require("../models/Applicants");

//GET request

//get all applicants
router.get("/all", function(req, res) {
    console.log(req.body);
    Applicant.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});

router.get("/:id",(req, res) => {
    Applicant.findOne({ id: req.params.id })
    .then(user => {
      if (!user) {
        res.status(200).json({status:"No applicant found"});
      }
      res.json(user);
    })
    .catch(err => res.status(400).json(err));
});

// POST request

router.post("/email",(req, res) => {
    Applicant.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(200).json({status:"No applicant found"});
      }
      res.json(user);
    })
    .catch(err => res.status(400).json(err));
});

router.post("/rating",(req, res) => {
    Applicant.updateOne({ email: req.body.email },{$set:{rating:req.body.rating}})
    .then(user => {
        res.json(user);
    })
    .catch(err => res.status(400).json(err));
});

// Add a user
router.post("/register", (req, res) => {
    if(!req.body.email)
        res.status(200).json({status:"noemail"});
    else{
        console.log("req",req.body);
        if(req.body.skills){
                // console.log(req.body.skills);
                // console.log(req.body.skills.split(','));
                // req.body.skills = req.body.skills.split(',');
                req.body.skills = [...new Set(req.body.skills.split(','))];
            }
            let newUser = new Applicant(req.body);
        Applicant.findOne({email:req.body.email}).then(user=>{
            if(!user){
                console.log("Add new Applicant");
                newUser.type="Applicant";
                newUser.save()
                .then(newUser=>{
                    res.status(200).json(newUser);
                })
                .catch(err=>{
                    res.status(400).json(err);
                });
            }
            else{
                console.log("Already registered");
                res.status(200).json({status:"Already registered",});
            }
        });
    }
});

// Login
router.post("/login", (req, res) => {
    const email=req.body.email;
    if(!req.body.email || !req.body.password){
        res.status(200).json({status:"empty"});
    }
    else{
    Applicant.findOne({email},function(err,user){
        if(err) res.json(err).status(400);
        else
        {
            if(user)
            {
                user.comparePassword(req.body.password,function(err,isMatch){
                    if(err) console.log(err);
                    console.log(req.body.password,isMatch," in applicant");
                    if(isMatch)
                    {
                        //current user applicant
                        res.status(200).json({status:"Applicant"});
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

// add education
router.post("/edu/add",(req,res)=>{
    if(!req.body.email || !req.body.institute || !req.body.start)
        res.status(200).json({status:"noemail"});
    else{
        Applicant.findOne({email:req.body.email})
        .then(user=>{
            if(req.body.end){
                const newedu={
                    "institute":req.body.institute,
                    "start":req.body.start,
                    "end":req.body.end
                };
                user.education.unshift(newedu);
                user.save().then(user => res.json(user));
            }
            else{
                const newedu={
                    "institute":req.body.institute,
                    "start":req.body.start,
                    "end":""
                };
                user.education.unshift(newedu);
              user.save().then(user => res.json(user).status(200));
            }
        });
    }
});

//update edu
router.post("/edu/upd/:id",(req,res)=>{
    if(!req.body.email || !req.body.institute || !req.body.start)
        res.status(200).json({status:"empty"});
    else{
        let edu={};
        edu.start=req.body.start;
        edu.institute=req.body.institute;
        if(req.body.end){
                edu.end=req.body.end;
        }
        else{
            edu.end="";
        }
		console.log(edu);
        // Applicant.find({email:req.body.email,"education._id":req.params.id})
        // .then(user=>{
            // user.education.findByIdAndUpdate(req.params.id,{$set:edu},function(err,edu){
            //                     if(err) console.log(err);
            //     else{
            //         res.json(edu).status(200);
            //     }
            // })
        //     console.log(user);
        //     res.json(user);
        // });
        Applicant.updateOne({email:req.body.email, "education._id":req.params.id},
			{
				$set:{
					"education.$.start":edu.start,
					"education.$.end":edu.end,
					"education.$.institute":edu.institute
				}
			},function(err,user){
            if(err) res.json(err);
            else{
				console.log(user);
                res.json(user);
            }
        });
    }
});


// delete education
router.post("/edu/del/:id",(req,res)=>{
    if(!req.body.email){
        res.status(200).json({status:"noemail"});
    }
    else{
        Applicant.findOne({email:req.body.email})
    .then(user => {
        const removeIndex = user.education
          .map(item => item.id)
          .indexOf(req.params.id);
        user.education.splice(removeIndex, 1);
        user.save().then(user => res.json(user));
      })
      .catch(err => res.status(400).json(err));
    }
});

// add skill
router.post("/skill/add/email", (req, res) => {

    // Applicant.findByIdAndUpdate(req.params.id,{$set:req.body},function(err,user){
    //     if(err) console.log(err);
    //     else{
    //         res.json(user);
    //     }
    // });
    Applicant.findOneAndUpdate({email:req.body.email},{$push:{skills:skill}},function(err,app){
        if(err) console.log(err);
        else{
            console.log(app);
            // createIndexes.status(200).json(app);
        }
    });
});


router.post("/skill/upd/email",(req,res)=>{
    // console.log(req.body);
        Applicant.findOneAndUpdate({email:req.body.email},
			{
				$set:{
					"skills":req.body.skills,
				}
			},function(err,s){
            if(err) res.json(err);
            else{
				// console.log("s",s);
                res.json(s);
            }
        });
});

router.post("/skill/del/:id", (req, res) => {
    Applicant.findOne({email:req.body.email})
    .then(user => {
        const removeIndex = user.skills
          .map(item => item.id)
          .indexOf(req.params.id);
        user.education.splice(removeIndex, 1);
        user.save().then(user => res.json(user));
      })
      .catch(err => res.status(400).json(err));
});

module.exports = router;
