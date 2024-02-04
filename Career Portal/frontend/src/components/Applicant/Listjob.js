import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

const dl=(date)=>{
    var c= new Date(date);
    return c.toLocaleString();
}

const caldur=(dur)=>{
    if(dur===0) return "Indefinite";
    else if(dur===1) return "1 Month";
    else if(dur===2) return "2 Months";
    else if(dur===3) return "3 Months";
    else if(dur===4) return "4 Months";
    else if(dur===5) return "5 Months";
    else if(dur===6) return "6 Months";
}


export default class Job extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
            recruiter:this.props.recruiter,
            deadline:this.props.deadline,
            status:"Apply",
            rating:this.props.rating,    // show sort   
            salary:this.props.salary,       // filter slider
            duration:this.props.duration,       // filter dropdown
            type:this.props.type,           // fiter dropdown
            id:this.props.id,
            applications:this.props.applications,
            positions:this.props.positions,
            id:this.props.id,
            sop:0,
            Sop:"",
            count:0,
            jobcnt:0,
            acnt:0,
          }
          this.onApply = this.onApply.bind(this);
          this.onSop = this.onSop.bind(this);
          this.onsop = this.onsop.bind(this);
    }
    onApply(e) {
        e.preventDefault();
        axios.post('http://localhost:4000/application/applicant/cnt',{"applicant":localStorage.getItem("email")})
        .then(res=>{
            console.log(res.data,"data");
            this.setState({acnt:res.data.cnt});
            if(res.data.cnt>=10 || res.data.acp)
            {
                if(res.data.acp) alert("You have an accepted application. So, you cannot apply for this job");
                else alert("You cannot have more than 10 active applications");
                this.setState({Sop:"",sop:0});
            }
            else{
                axios.get('http://localhost:4000/application/job/cnt/'+this.state.id)
                .then(res2=>{
                    if(res2.data.cnt>=this.state.applications)
                    {
                        alert("Applications are full for the job");
                        this.setState({Sop:"",sop:0});
                        return;
                    }
                    else{
                        let s = this.state.Sop;
                            s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
                            s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
                            s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
                            if(s){
                                axios.post('http://localhost:4000/application/add/'+this.state.id,{"applicant":localStorage.getItem("email"),"recruiter":this.state.recruiter,"sop":s})
                                .then(res=>{
                                    if(res.data.status==="Active") this.setState({status:"Active",sop:0});
                                });
                                this.setState({jobcnt:(this.state.jobcnt+1)});
                            }
                            else{
                                alert("SOP is empty");
                            }
                        }
                })
                .catch(err=>console.log(err));
            }
        })
        .catch(err=>console.log(err));        
    }
    onsop()
    {
        if(this.state.sop)
            this.setState({sop:0});
        else
            this.setState({sop:1});
    }
    onSop(e)
    {
        let s = e.target.value;
        s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
        s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
        s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
        let c = s.split(' ').filter(function(str){return str!="";}).length;
        //return s.split(' ').filter(String).length; - this can also be used
        if(c>250) alert("Limit 250 words");
        else this.setState({Sop:e.target.value,count:c});
    }
    componentDidMount()
    {
        // get status from application
        axios.post('http://localhost:4000/application/status/'+this.state.id,{"email":localStorage.getItem("email")})
        .then(res=>{
            console.log("res",res);
            if(res.data!==null){
                this.setState({status:res.data.status});
            }
            axios.get('http://localhost:4000/application/job/cnt/'+this.state.id)
            .then(res2=>{
                console.log("res2",res2.data);
                this.setState({jobcnt:res2.data.cnt});
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
    }
    render() {
        return (
            <tr>
                <th scope="col">{this.state.title}</th>
                <th scope="col">{this.state.recruiter}</th>
                <th scope="col">{this.state.salary}</th>
                <th scope="col">{caldur(this.state.duration)}</th>
                <th scope="col">{dl(this.state.deadline)}</th>
                <th scope="col">{this.state.applications - this.state.jobcnt}</th>
                <th scope="col">{this.state.rating.toFixed(1)}</th>
                { this.state.status==="Apply" && (this.state.applications!==this.state.jobcnt) && <th scope="col" ><button onClick={this.onsop} className="btn btn-primary ">Apply</button> </th>}
                { this.state.sop===1 &&  <th scope="col" >
                 <textarea cols={40} value={this.state.Sop} onChange={this.onSop} placeholder="Statement of Purpose"/>
                 <p>{this.state.count}/250</p>
                 <div style={{paddingTop:10}}>
                     <button onClick={this.onApply} className="btn btn-success ">Submit</button>
                </div>
                      </th>}
                { this.state.status==="Active" && <th scope="col" ><button disabled className="btn btn-success ">Applied</button> </th>}
                { this.state.status==="Accept" && <th scope="col" ><button disabled className="btn btn-warning ">Accepted</button> </th>}
                { this.state.status==="Shortlist" && <th scope="col" ><button disabled className="btn btn-secondary ">Shortlisted</button> </th>}
                { this.state.status==="Reject" && <th scope="col" ><button disabled className="btn btn-danger ">Rejected</button> </th>}
                { (this.state.applications<=this.state.jobcnt) && <th scope="col" ><button disabled className="btn btn-info ">Full</button> </th>}
            </tr>
        )
    }
}