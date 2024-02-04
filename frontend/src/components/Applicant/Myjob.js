import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

const dl=(date)=>{
    var c= new Date(date);
    return c.toLocaleString();
}

const caldur=(dur)=>{
    if(dur===0) return "indefinite";
    else if(dur===1) return "1 Month";
    else if(dur===2) return "2 Months";
    else if(dur===3) return "3 Months";
    else if(dur===4) return "4 Months";
    else if(dur===5) return "5 Months";
    else if(dur===6) return "6 Months";
}


export default class MyJob extends Component {

    constructor(props) {
      super(props);
    }
    state = {
        title:this.props.title,         // show    
        email:this.props.email, 
        recruiter:"",// show    
        status:this.props.status,                 // show in button
        rating:this.props.rating,       // show sort   
        salary:this.props.salary,       // show sort filter slider
        duration:this.props.type,       // show sort filter dropdown
        id:this.props.id,
        applications:this.props.applications,
        positions:this.props.positions,
        posting:this.props.posting,
        id:this.props.id,
        addrating:this.props.addrating, // add rating
        job:this.props.job
    };
    onChangerating=this.onChangerating.bind(this);
    onupdate=this.onupdate.bind(this);
    onChangerating(e){
        this.setState({addrating:e.target.value});
    }
    onupdate(e)
    {
        let sum=0;
        e.preventDefault();
        console.log("addrating",this.state.addrating);
        // axios.post('http://localhost:4000/application/update/'+this.state.id,{"rateapplicant":this.state.addrating})
        axios.post('http://localhost:4000/application/update/'+this.state.id,{"ratejob":this.state.addrating})
        .then(res=>{
            console.log("res",res.data);
            console.log("job",this.state.job);
            axios.get('http://localhost:4000/application/job/rating/'+this.state.job)
            .then(res2=>{
                console.log("res2",res2.data);
                sum=res2.data.sum;
                sum/=res2.data.cnt;
                this.setState({rating:sum});
                console.log("sum",sum);
                axios.post('http://localhost:4000/job/upd/'+this.state.job,{"rating":sum})
                .then(res=>console.log(res.data))
                .catch(err=>console.log(err));
            })
            .catch(err2=>console.log(err2));
        })
        .catch(err=>console.log(err));
    }
    componentDidMount()
    {
        axios.post('http://localhost:4000/recruiter/email',{"email":this.state.email})
        .then(res=>{
            // console.log("res",res);
            this.setState({"recruiter":res.data.name});
        })
        .catch(err=>console.log(err));
    }
    render() {
        return (
            <tr>
                <th scope="col">{this.state.title}</th>
                <th scope="col">{dl(this.state.posting)}</th>
                <th scope="col">{this.state.salary}</th>
                <th scope="col">{this.state.recruiter}</th>
                <th scope="col">{this.state.rating.toFixed(1)}</th>
                <th scope="col">{this.state.status}</th>
                <th scope="col">
                { this.state.status==="Accept" && <form onSubmit={this.onupdate}>
                    <input required type="Number" value={this.state.addrating} onChange={this.onChangerating} min="1" max="5"  />
                    <button type="submit" disabled={Number(this.state.addrating)===Number(this.props.addrating)} className="btn btn-success ">Update</button>
                    </form>
                }
                </th>
            </tr>
        )
    }
}