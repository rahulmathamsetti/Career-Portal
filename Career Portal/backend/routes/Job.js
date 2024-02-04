var express = require("express");
var router = express.Router();

const Job = require("../models/Jobs");
const Application = require("../models/Applications");
//GET request

// list all jobs
router.get("/all", function(req, res) {
    const dt = new Date();
    Job.find({deadline:{$gt:dt}})
    .sort({date:-1})
    .then(job=>{res.status(200).json(job)})
    .catch(err=>console.log(err));
});

router.get("/:id", function(req, res) {
    const dt = new Date();
    // Job.findOne({deadline:{$gt:dt},_id:req.params.id})
    Job.findOne({_id:req.params.id})
    .then(job=>{console.log(job); res.status(200).json(job)})
    .catch(err=>console.log(err));
});

//get all jobs by a recruiter
router.post("/recruiter", function(req, res) {
    if(!req.body.email)
        res.status(400).json({"status":"no recruiter email"});
    else{
        var date = new Date();
        console.log(date);
        Job.find({ recruiter: req.body.email }, function(err, jobs) {
            if (err)
                console.log(err);
            else {
                // res.json(req.body)
                res.status(200).json(jobs);
            }
        });
    }
});

router.post("/add/",(req,res)=>{
   
    let newJob = new Job(req.body);
    newJob.save()
        .then(newJob=>{
            res.status(200).json(newJob);
        })
        .catch(err=>{
            console.log(err);
        });
});

router.post("/upd/:id",function(req, res) {
    const fields = {};
    if (req.body.applications) {
      fields.applications = req.body.applications;
    }
    if (req.body.positions) {
      fields.positions = req.body.positions;
    }
    if (req.body.deadline) {
      fields.deadline = req.body.deadline;
    }
    if (req.body.rating) {
        fields.rating = req.body.rating;
      }
    Job.findByIdAndUpdate(req.params.id,{$set:fields},function(err,jobs){
        if(err) console.log(err);
        else{
            res.json(jobs).status(200);
        }
    });
});

router.post("/del/:id",function(req, res) {
    Job.findByIdAndDelete(req.params.id,function(err,jobs){
        if(err) console.log(err);
        else{
            res.json(jobs).status(200);
        }
    });
});

module.exports = router;