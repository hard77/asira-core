import React from 'react'
import Logo from './../support/img/logo.jpeg'
import './../support/css/login.css'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import swal from 'sweetalert'
import {Redirect} from 'react-router-dom'
import {serverUrl} from './url'
import kokie from 'universal-cookie'
import {keepLogin} from './../1.actions'
import {connect} from 'react-redux'



const kukie = new kokie()

 
class Login extends React.Component{
    state={token:"",authData:[],loading:false,tokenClient:'' , isLogin : false}
  
    //LOGIN BUTTON
    btnLogin = ()=>{
        this.setState({loading:true})
     
        var username=this.refs.username.value
        var password=this.refs.password.value
       
        if (username==="" || password===""){
            swal("Error","Username and Password Empty","error")
            this.setState({loading:false})

        }else{
            var url =serverUrl+"clientauth"
            axios.get(url ,{
                auth : {
                    // username : 'gradios',
                    // password : 'ultimus'
                    username : `${username}`,
                    password : `${password}`
                }
            })
                .then((res)=>{
                    var date = new Date();
                    date.setTime(date.getTime() + (res.data.expires*1000));
                    kukie.set('token',res.data.token,{expires: date})
                    this.setState({loading : false,isLogin:true})
                   
                })
                .catch((err)=>{
                  this.setState({loading : false})
                  swal("Warning","Username atau Password tidak benar","info")
                }
                   
                )
        }
      
    } 

    renderBtnOrLoading =()=>{
        if (this.state.loading){
            return  <Loader 
            type="Circles"
            color="#00BFFF"
            height="30"	
            width="30"
         />   
        }
        else{
            return(
                <input type="button" className="loginBtn" onClick={this.btnLogin} style={{marginTop:"20px"}}  value="Sign in"/> 
            )
        }
    }

    render(){
        if(this.state.isLogin){
            return(
                <Redirect to='/' />
            )
        }
        // alert('masuk')
       

            return (
                <div className="App loginContainer mr-3">
                    <div className="row">
                        <div className="col-6 col-md-6 mt-3">
                           <h2>Core</h2> 
                        </div>
                        <div className="col-6 col-md-6 mt-3">
                            <img src={Logo} alt="logo" width="60%"></img>
                        </div>
                    </div>
    
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <hr/>
                            <h3>Sign In</h3>
                            <input type="text" placeholder="Username" ref="username" className="form-control"/>
                            <input type="password" placeholder="Password" ref="password" className="form-control"/>
                            {this.renderBtnOrLoading()}
                            <p style={{marginTop:"20px"}}>Forgot your password?</p>
                       
                        </div>
                    </div>
                </div>
            )

        }
      
       
    
}

export default connect(null,{keepLogin}) (Login);
