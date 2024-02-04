import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

export default class Viewjobs extends Component {
    state = {
        title:this.props.title,
        recruiter:this.props.recruiter,
        applications:this.props.applications,
        positions:this.props.positions,
        deadline:this.props.deadline,
        posting:this.props.posting,
        skillset:this.props.skillset,
        salary:this.props.salary,
        type:this.props.type,
        duration:this.props.type,
        rating:this.props.rating,
        id:this.props.id,
    };
    onChangepositions = this.onChangepositions.bind(this);
    onChangeapplications = this.onChangeapplications.bind(this);
    onChangedeadline = this.onChangedeadline.bind(this);
    onUpdate = this.onUpdate.bind(this);
    onDelete = this.onDelete.bind(this);
    navigate= this.navigate.bind(this);
    onChangepositions(event) {
        this.setState({positions:event.target.value});
    }
    onChangeapplications(event){
        this.setState({applications:event.target.value});
    }
    onChangedeadline(event){
        this.setState({deadline:event.target.value});
    }
    navigate()
    {
      console.log(this.state);
      localStorage.setItem("job",this.state.id);
      console.log(localStorage.getItem("job"));
      this.props.history.push("/viewjobs");
    }
    onUpdate(e){ // update
        e.preventDefault();
        let date =new Date();
        date =date.getFullYear();
        if(this.state.applications<this.state.positions)
        {
            alert("applications should not be less than positions ");
            return;
        }
        if(this.state.deadline < date)
        {
            alert("deadline not valid");
            return;
        }
        const newjob = {
            positions:this.state.positions,
            applicantions:this.state.applications,
            deadline:this.state.deadline,
            email:localStorage.getItem("email"),
          };
          console.log("upd job",newjob);
          axios.post("http://localhost:4000/job/upd/"+this.state.id, newjob).then(res => {
          console.log("response upd job", res);
          if(res.status===200) alert("update successful");
        });
    }
    onDelete(e)
    {
        e.preventDefault();
        this.props.delete(this.state.id);
    }
    // onDelete(e){ //delete
    //     e.preventDefault();
    //     axios.post("http://localhost:4000/job/del/"+this.state.id)
    //     .then(res=>{
    //         console.log("response del edu", res);
    //         if(res.status===200) alert("delete successful");
    //     })
    //     .catch(function(error){
    //         console.log(error);
    //       })
    //       this.props.toparent(true);
    // }
    render() {
        return (
            <div onClick={this.navigate}>
                <form >
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                        <p>{this.state.title}</p>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Posting date</label>
                    <div className="col-sm-10">
                        <p>{this.state.posting}</p>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Applications</label>
                    <div className="col-sm-10">
                        <p>Application count</p>
                    </div>
                  </div>                  
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Deadline</label>
                    <div className="col-sm-10">
                        <p>{lol(this.state.deadline)}</p>
                      <input type="datetime-local" className="form-control" onChange={this.onChangedeadline}  placeholder="deadline for applications"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Max Applications</label>
                    <div className="col-sm-10">
                      <input type="number" className="form-control" min="1" onChange={this.onChangeapplications} value={this.state.applications} placeholder="Max number of Applications" required/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Max Positions</label>
                    <div className="col-sm-10">
                      <input type="number" className="form-control" min="1" onChange={this.onChangepositions} value={this.state.positions} placeholder="Max number of Positions" required/>
                    </div>
                  </div>
                  {/* <div className="form-group row">
                    <div className="col-sm-10">
                      <button type="submit" className="btn btn-primary">Update Job</button>
                    </div>
                  </div> */}
                </form>
                <div className="form-group row">
                    <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary" onClick={this.onUpdate}>Update Job</button>
                <button onClick={this.onDelete} style={{marginLeft:10}} className="btn text-right btn-dark ">Delete Job</button>
                    </div>
                  </div>
                <br/>
            </div>
        )
    }
}