const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types

// Create Schema
const JobsSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    recruiter:{
        type:String,
        required: true
    },
    applications: {
        type:Number,
        required: true
    },
    positions: {
        type:Number,
        required: true
    },
    date:{
		type: Date,
		default: Date.now
    },
    deadline:{
		type: Date,
		required: true
    },
    posting:{
        type:Date,
        required:true
    },
    skillset:{
        type: [String],
        required: true,
    },
    salary:{
        type:Number,
        required:true
    },
    type:{
        type:Number,
        default:0
        // full 1, half 2, wfh 3
    },
    duration:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        default:0,
    },
});

module.exports = Job = mongoose.model("Job", JobsSchema);
