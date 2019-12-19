import React from 'react';
import Homepage from './home/Homepage';
import {Link, BrowserRouter, Route} from 'react-router-dom';
import OverView from './user/layout/OverView';

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            token: localStorage.getItem("token")
        }
    }

    render(){
        return(
            <BrowserRouter>
                {
                    this.state.token ?
                        <Route path="/" exact component={OverView} />
                    :
                        <Route path="/" exact component={Homepage} />
                }
            </BrowserRouter>
        )
    }
}

export default App;