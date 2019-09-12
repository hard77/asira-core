import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class RoleList extends React.Component{
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <p>LIST ROLE</p>
    
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

export default RoleList;