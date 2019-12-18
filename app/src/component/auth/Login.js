import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
            password: '',
        }
    }

    inputChange = (inputData) => {
        this.setState({password: inputData.target.value})
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
                        <h3 className="font-weight-bolder">Enter Your Password</h3>
                        <input type="password" class="form-control form-control-lg rounded-pill" placeholder="Enter Your Password" name="password" value={this.state.password} onChange={this.inputChange} required />
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg font-weight-bolder rounded-pill">LOGIN NOW</button>
                </form>
            </React.Fragment>
        )
    }
}

export default Login;