import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

export default class Education extends Component {

    state = {
        id:this.props.id,
        institute:this.props.institute,
        start:this.props.start,
        end:this.props.end,
    };
    onChangeInstitute = this.onChangeInstitute.bind(this);
    onChangeStart = this.onChangeStart.bind(this);
    onChangeEnd = this.onChangeEnd.bind(this);
    onUpdate = this.onUpdate.bind(this);
    onDelete = this.onDelete.bind(this);

    onChangeInstitute(event) {
        this.setState({institute:event.target.value});
    }
    onChangeStart(event){
        this.setState({start:event.target.value});
    }
    onChangeEnd(event){
        this.setState({end:event.target.value});
    }

    onUpdate(e){ // update
        e.preventDefault();
        let date =new Date();
        date =date.getFullYear();
        if(this.state.start > date)
        {
            alert("start year not valid");
            return;
        }
        if(this.state.end!=="")
        {
            if(this.state.end<this.state.start){
                alert("end year is not valid");
                return;
            }
        }
        const newedu = {
            institute:this.state.institute,
            start:this.state.start,
            end:this.state.end,
            email:localStorage.getItem("email"),
          };
          axios.post("http://localhost:4000/applicant/edu/upd/"+this.state.id, newedu).then(res => {
          console.log("response add edu", res);
          if(res.status===200) alert("update successful");
        });
    }

    onDelete(e){ //delete
        e.preventDefault();
        // const id = this.state.id;
        this.props.delete(this.state.id);
        // axios.post("http://localhost:4000/applicant/edu/del/"+this.state.id,{email:localStorage.getItem("email")})
        // .then(res=>{
        //     console.log("response del edu", res);
        // })
        // .catch(function(error){
        //     console.log(error);
        //   })
        //   console.log("id",id);
        //   this.props.onSuccess(true);
    }
    render() {
        return (
            <div className >
                <form  onSubmit={this.onUpdate} >
                {/* <h3>Log in</h3> */}
                <div className="form-group"  >
                    <label>Institute</label>
                    <input 
                        type="string"
                        className="form-control" 
                        placeholder={this.state.institute} 
                        value={this.state.institute}
                        onChange={this.onChangeInstitute}
                        required 
                        />
                </div>

                <div className="form-group">
                    <label>Start</label>
                    <input type="number"
                        className="form-control" 
                        placeholder="YYYY"
                        value={this.state.start} 
                        onChange={this.onChangeStart}
                        required
                        />
                </div>
                <div className="form-group">
                    <label>End</label>
                    <input type="number"
                        min="1900" max="2099" step="1" 
                        className="form-control" 
                        placeholder="YYYY"
                        value={this.state.end} 
                        onChange={this.onChangeEnd}
                        />
                        </div>
                <button type="submit" className="btn btn-dark btn-lg">Update</button>
                    <button onClick={this.onDelete} style={{marginLeft:10}} className="btn text-right btn-dark btn-lg">Delete</button>
                </form>
                <br/>
            </div>
        )
    }
}