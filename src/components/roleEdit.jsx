import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class RoleEdit extends React.Component{
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <p>Edit ROLE</p>
    
                </div>
            )
        }
        if(!cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default RoleEdit;