import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class TypeBank extends React.Component{
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <p>Type Bank - Tambah</p>
    
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

export default TypeBank;