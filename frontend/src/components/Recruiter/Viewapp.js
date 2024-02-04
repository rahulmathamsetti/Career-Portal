import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
const dl=(date)=>{
    var c= new Date(date);
    return c.toLocaleDateString();
}

export default class Vapp extends Component {
    constructor(props) {
      super(props);
    }
    state = {
        name:this.props.name,
        education:this.props.education,
        sop:this.props.sop,
        rating:this.props.rating,
        status:this.props.status,
        date:this.props.date,
        skills:this.props.skills,
        id:this.props.id,
        email:this.props.email
    };
    onChangestatus = this.onChangestatus.bind(this);
    ondelete = this.ondelete.bind(this);
    onChangestatus() {
        console.log("change");
        if(this.state.status==="Active"){
            this.setState({status:"Shortlist"});
            console.log("status",this.state.status);
        axios.post("http://localhost:4000/application/update/"+this.state.id,{
            "status":"Shortlist"
        })
        .then(res=>{
            console.log("response upd app", res);
        })
        .catch(function(error){
            console.log(error);
          });
        }
        else if(this.state.status==="Shortlist"){
            this.setState({status:"Accept"});
        //update in database
        console.log("status",this.state.status);
        axios.post("http://localhost:4000/application/update/"+this.state.id,{
            "status":"Accept"
        })
        .then(res=>{
            console.log("response upd app", res);
        })
        .catch(function(error){
            console.log(error);
          });
        axios.post("http://localhost:4000/application/reject",{"email":this.state.email})
          .catch(err=>console.log(err));
        }
    }
    ondelete(event){
        event.preventDefault();
        this.setState({status:"Reject"});
        this.props.delete(this.state.id);
    }
    render() {
        // console.log("lols",this.state);
        return (
                <tr>
                <th scope="col">{this.state.name}</th>
                <th scope="col">{dl(this.state.date)}</th>
                <th scope="col">
                {this.state.education.map(edu=>{
                  return <p>{edu.institute} : {edu.start}{" - "} {edu.end}</p>
                })}
                </th>
                <th scope="col">
                    {this.state.skills.map(skill=>{
                        return <p>{skill}</p>
                    })}
                    </th>
                <th scope="col">{this.state.sop}</th>
                <th scope="col">{this.state.rating.toFixed(1)}</th>
                { this.state.status==="Active" && <th scope="col" ><button onClick={this.onChangestatus} className="btn btn-primary ">Shortlist</button> </th>}
                { this.state.status==="Shortlist" && <th scope="col" ><button onClick={this.onChangestatus} className="btn btn-success ">Accept</button> </th>}
                { (this.state.status==="Active" || this.state.status==="Shortlist") && <th scope="col" ><button onClick={this.ondelete} className="btn btn-danger ">Reject</button> </th>}
                { (this.state.status==="Accept") && <th scope="col" ><button disabled className="btn btn-warning ">Accepted</button> </th>}
            </tr>
        )
    }
}