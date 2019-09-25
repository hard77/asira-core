import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class Report extends React.Component{
    render(){
        if(cookie.get('token')){
            return(
                <div className="container mt-2">
                    <h2>Report</h2>
                    <hr></hr>
    
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

export default Report;