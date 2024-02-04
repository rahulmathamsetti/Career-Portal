var express = require("express");
var router = express.Router();

const Job = require("../models/Jobs");
const Application = require("../models/Applications");
const Applicant = require("../models/Applicants");
//GET request

router.get("/all", function(req, res) {
    Application.find().then(app=>res.json(app));
});


//get all applicant ids and status for recruiter
router.get("/job/:id", function(req, res) {
    Application.find({job:req.params.id,status:{$ne:"Reject"}},function(err,app){
        if(err) console.log(err);
        else{
            let response=[];
            app.forEach(e=>{
                console.log(e);
                response.push(e);
            });
            console.log(response);
            res.status(200).json(response);
        }
    });
});

router.post("/recruiter/", function(req, res) {
    Application.find({recruiter:req.body.recruiter,status:"Accept"},function(err,app){
        if(err) console.log(err);
        else{
            let response=[];
            app.forEach(e=>{
                console.log(e);
                response.push(e);
            });
            console.log(response);
            res.status(200).json(response);
        }
    });
});

//my jobs for applicant
router.post("/applicant/", function(req, res) {
    Application.find({applicant:req.body.email},function(err,app){
        if(err) console.log(err);
        else{
            let response=[];
            app.forEach(e=>{
                console.log(e);
                response.push(e);
            });
            res.status(200).json(response);
        }
    });
});

//get rating,count
router.post("/applicant/rating", function(req, res) {
    Application.find({applicant:req.body.email},function(err,app){
        if(err) console.log(err);
        else{
            let cnt=0,rating=0;
            app.forEach(e=>{
                if(e.rateapplicant!==0){
                    // console.log("E",e);
                    cnt+=1;
                    rating+=e.rateapplicant;
                }
                // console.log(e);
                // response.push(e);
            });
            res.status(200).json({"sum":rating,"cnt":cnt});
        }
    });
});

router.get("/job/rating/:id", function(req, res) {
    Application.find({job:req.params.id},function(err,app){
        if(err) console.log(err);
        else{
            let cnt=0,rating=0;
            app.forEach(e=>{
                if(e.ratejob!==0){
                    console.log("E",e);
                    cnt+=1;
                    rating+=e.ratejob;
                }
                // console.log(e);
                // response.push(e);
            });
            res.status(200).json({"sum":rating,"cnt":cnt});
        }
    });
});

// application count for a job
router.get("/job/cnt/:id", function(req, res) {
    let cnt=0;
    // console.log("lol job:)");
    Application.find({job:req.params.id,status:{$ne:"Reject"}},function(err,app){
        if(err) console.log(err);
        else{
            // let response=[];
            app.forEach(e=>{
                console.log(e);
                cnt++;
                // response.push(e);
            });
            res.status(200).json({"cnt":cnt});
        }
    });
});

//my jobs cnt for applicant
router.post("/applicant/cnt", function(req, res) {
    let cnt=0,acp=false;
    Application.find({applicant:req.body.applicant},function(err,app){
        if(err) console.log(err);
        else{
            app.forEach(e=>{
                // console.log("apple",e);
                if(e.status==="Active" || e.status==="Shortlist" ) cnt+=1;
                else if(e.status==="Accept" ) {
                    acp=true;
                }
            });
            res.status(200).json({"cnt":cnt,"acp":acp});
        }
    });
});

router.post("/status/:id", function(req, res) {
    Application.findOne({applicant:req.body.email,job:req.params.id})
    .then(app=>{
        res.status(200).json(app)
    })
    .catch(err=>console.log(err)); 
});

// update 
router.post("/update/:id", function(req, res) {
    console.log("UPDATE");
    const fields = {};
    if (req.body.status) {
      fields.status = req.body.status;
    }
    if(req.body.rateapplicant)
    {
        fields.rateapplicant= req.body.rateapplicant;
    }
    if(req.body.ratejob)
    {
        fields.ratejob= req.body.ratejob;
    }
    console.log("field",fields);
    Application.updateOne({"_id":req.params.id},{$set:fields})
    .then(job=>res.json(job).status(200))
    .catch(err=>console.log(err));
});


router.post("/reject/", function(req, res) {
    console.log("REJECT");
    Application.updateMany({$or:[{applicant:req.body.email,status:"Active"},{applicant:req.body.email,status:"Shortlist"}]},{$set:{status:"Reject"}})
    .then(lol=>console.log(lol))
    .catch(err=>console.log(err));
});

// add by applicant
router.post("/add/:id",(req,res)=>{
    if(!req.body.applicant || !req.body.sop)
    {
        res.status(400).json({status:"no applicant email or sop"});
    }
    else{
        Job.findOne({"_id":req.params.id},function(err,job){
            if(err) console.log("ERR",err);
            else{
                console.log(job);
                if(!job)
                {
                    res.status(400).json(response);
                }
                else{
                    let app = new Application({
                        job:req.params.id,
                        applicant:req.body.applicant,
                        recruiter:req.body.recruiter,
                        sop:req.body.sop,
                        status:"Active",
                    });
                    app.save()
                    .then(application=>{
                        console.log("new app",application);
                        res.status(200).json(app);
                    })
                    .catch(err=>console.log(err));
                    // job.save()
                    // .then(job=>console.log("JOB then",job))
                }
            }
        });
    }

});

// delete by applicant
router.post("/delete/:id",function(req, res) {
    Application.findById(req.params.id,function(err,application){
        if(err) console.log(err);
        else{
            if(application){
            application.remove()
            .then(app=>res.json(app).status(200))
            .catch(err=>console.log(err));
            }
            else{
                res.json({status:"no application found"}).status(400);
            }
        }
    });
});

module.exports = router;