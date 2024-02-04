const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types

// Create Schema
const ApplicationSchema = new Schema({
    date:{
		type: Date,
		default: Date.now
    },
    applicant:{
        type:String
    },
    job:{
      type:String
    },
    status:{
        type:String
    },
    recruiter:{
      type:String
    },
    sop:{
      type:String
    },
    ratejob:{
      type:Number,
      default: 0,
    },
    rateapplicant:{
      type:Number,
      default: 0
    }
});

module.exports = Application = mongoose.model("Application", ApplicationSchema);
