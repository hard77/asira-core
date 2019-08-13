import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class ProductList extends React.Component{
    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                    <h2>Product List</h2>
                </div>
            )
        }
        if(cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default ProductList;