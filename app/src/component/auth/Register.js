import React from 'react';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
            name: '',
            password: '',
        }
    }

    inputChange = (inputData) => {
        this.setState({[inputData.target.name]: inputData.target.value})
    }

    inputSubmit = (dataSubmit) => {
        dataSubmit.preventDefault();
        console.log(this.state)
    }

    render() {
        return (
            <React.Fragment>
                <form className="pt-5" onSubmit={this.inputSubmit}>
                    <div class="form-group">
                        <h3 className="font-weight-bolder">Enter Your Email Address</h3>
                        <input type="email" class="form-control form-control-lg rounded-pill" placeholder="Enter Your Email Address" name="email" value={this.state.email} onChange={this.inputChange} disabled required />
                    </div>
                    <div class="form-group">
                        <h3 className="font-weight-bolder">Enter Your Name</h3>
                        <input type="text" class="form-control form-control-lg rounded-pill" placeholder="Enter Your Name" name="name" value={this.state.name} onChange={this.inputChange} required />
                    </div>
                    <div class="form-group">
                        <h3 className="font-weight-bolder">Enter Your Password</h3>
                        <input type="password" class="form-control form-control-lg rounded-pill" placeholder="Enter Your Password" name="password" value={this.state.password} onChange={this.inputChange} required />
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg font-weight-bolder rounded-pill">REGISTER NOW</button>
                </form>
            </React.Fragment>
        )
    }
}

export default Register;