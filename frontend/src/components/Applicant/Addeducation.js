import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

export default class AddEducation extends Component {

    state = {
        institute:"",
        start:"",
        end:"",
        addentry: false,
    };
    onChangeInstitute = this.onChangeInstitute.bind(this);
    onChangeStart = this.onChangeStart.bind(this);
    onChangeEnd = this.onChangeEnd.bind(this);
    onSubmit = this.onSubmit.bind(this);
    showAddentry = this.showAddentry.bind(this);
    onChangeInstitute(event) {
        this.setState({institute:event.target.value});
    }
    onChangeStart(event){
        this.setState({start:event.target.value});
    }
    onChangeEnd(event){
        this.setState({end:event.target.value});
    }
    showAddentry(event) {
        if(this.state.addentry)
        this.setState({addentry: false})
        else
        this.setState({addentry: true})
    }
    onSubmit(e){ // update
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
              axios.post("http://localhost:4000/applicant/edu/add/", newedu).then(res => {
              console.log("response add edu", res);
            //   if(res.status===200) alert("successfully added education entry");
              this.props.onAdd(res.data.education[0]);
            });
        this.setState({
            institute: "",
            start:"",
            end:"",
            addentry:false,
        });
    }
    // onSuccess(){
    //     var newedu = {
    //         institute:this.state.institute,
    //         start:this.state.start,
    //         end:this.state.end,
    //       };
    //     this.props.onAdd(newedu);
    //     this.setState({
    //         institute: "",
    //         start:"",
    //         end:"",
    //         addentry:false,
    //       });
    // }
    render() {
        return (
            <div>
                <br/><br/>
                {/* <p style={{fontSize:20}}>Add another Education entry:</p> */}
                {this.state.addentry && <form  onSubmit={this.onSubmit} >
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
                    min="1900" max="2099" step="1" 
                        className="form-control" 
                        placeholder="YYYY" 
                        id="datepicker"
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
                <button type="submit"  className="btn btn-dark btn-lg ">Add </button>
                </form>
            }
            <br/>
            <br/>
            <button className="btn btn-dark btn-lg " onClick={this.showAddentry} > Add entry</button>
            </div>
        )
    }
}