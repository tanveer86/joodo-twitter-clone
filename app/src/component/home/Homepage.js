import React from 'react';
import Axios from 'axios';
import Login from '../auth/Login';
import Register from '../auth/Register';


class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            member: null
        }
    }

    inputChange = (inputData) => {
        this.setState({ email: inputData.target.value })
    }

    inputSumit = (dataSubmit) => {
        dataSubmit.preventDefault();
        Axios.post("http://127.0.0.1:5000/usercheck", {
            email: this.state.email
        })
            .then(response => {
                // console.log(response.data.result)
                this.setState({ member: response.data.result })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {

        const showLogin = () => {
            if (this.state.member == null) {
                return (
                    <form className="pt-5" onSubmit={this.inputSumit}>
                        <div className="form-group">
                            <h3 className="font-weight-bolder">Enter Your Email address</h3>
                            <input type="email" className="form-control form-control-lg rounded-pill" placeholder="Enter Your Email Address" name="email" value={this.state.email} onChange={this.inputChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg font-weight-bolder rounded-pill">CONTINUE</button>
                    </form>
                )
            }else if(this.state.member == false){
                return <Register email={this.state.email} />
            }else if(this.state.member == true){
                return <Login email={this.state.email} />
            }
        }

        return (
            <React.Fragment>
                <div className="container-fuild">
                    <div className="row">
                        <div className="col-6">
                            <img src="https://i.ibb.co/mGqd7b3/connected-people.png" width="700" />
                        </div>
                        <div className="col-6 bg-danger pt-5 text-center text-white">
                            <div className="p-5">
                                <h1 className="font-weight-bolder">Welcome to Joodo!</h1>
                                {showLogin()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Homepage;