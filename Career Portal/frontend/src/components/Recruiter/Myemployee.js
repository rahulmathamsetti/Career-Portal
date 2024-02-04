import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

const dl=(date)=>{
    var c= new Date(date);
    return c.toLocaleDateString();
}
const caltype=(dur)=>{
    if(dur===0) return "Full time";
    else if(dur===1) return "Half time";
    else if(dur===2) return "Work from home";
}

export default class Vemp extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        name:this.props.name,
        id:this.props.id,
        doj:this.props.doj,
        type:this.props.type,
        email:this.props.email,
        title:this.props.title,
        rating:this.props.rating, // applicant rating
        addrating:this.props.addrating, // add rating
    };
    onChangeaddrating=this.onChangeaddrating.bind(this);
    onupdate=this.onupdate.bind(this);
    onChangeaddrating(e){
        this.setState({addrating:e.target.value});
    }
    componentWillReceiveProps(nextprops) {
        this.setState({
            name:nextprops.name,
            id:nextprops.id,
            doj:nextprops.doj,
            type:nextprops.type,
            email:nextprops.email,
            title:nextprops.title,
            rating:nextprops.rating, // applicant rating
            addrating:nextprops.addrating, // add rating
        });  
      }
    onupdate(e)
    {
        let sum=0;
        e.preventDefault();
        console.log("addrating",this.state.addrating);
        axios.post('http://localhost:4000/application/update/'+this.state.id,{"rateapplicant":this.state.addrating})
        .then(res=>{
            // console.log("res",res.data);
            axios.post('http://localhost:4000/application/applicant/rating',{"email":this.state.email})
            .then(res2=>{
                // console.log("res2",res2.data);
                sum=res2.data.sum;
                sum/=res2.data.cnt;
                this.setState({rating:sum});
                // console.log("sum",sum);
                axios.post('http://localhost:4000/applicant/rating',{"email":this.state.email,"rating":sum})
                // .then(res=>console.log(res.data))
                .catch(err=>console.log(err));
                this.props.toparent(sum,this.state.addrating,this.state.id);
            })
            .catch(err2=>console.log(err2));
        })
        .catch(err=>console.log(err));
    }
    render() {
        // console.log("in emp",this.state);
        return (
                <tr>
                <th scope="col">{this.state.name}</th>
                <th scope="col">{dl(this.state.doj)}</th>
                <th scope="col">{this.state.title}</th>
                <th scope="col">{caltype(this.state.type)}</th>
                <th scope="col">{this.state.rating.toFixed(1)}</th>
                <th scope="col" >
                    <form onSubmit={this.onupdate}>
                    <input required type="Number" value={this.state.addrating} onChange={this.onChangeaddrating} min="1" max="5"  />
                    <button type="submit" disabled={Number(this.state.addrating) ===Number(this.props.addrating)} className="btn btn-success ">Update</button>
                    </form>
                </th>
            </tr>
        )
    }
}