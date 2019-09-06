import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class TypeBankList extends React.Component{
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <p>Type Bank - List</p>
    
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

export default TypeBankList;