import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'

const cookie = new Cookies()

class LayananList extends React.Component{
    state={
        loading:true
    }
    componentDidMount (){
        
    }

    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={5}>
                      <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
              />   
                </td>
              </tr>
            )
        }else{

            
        }
            
            
         
        
    }
    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                   <h2 className="mt-3">Layanan List</h2>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Id Layanan</th>
                            <th className="text-center" scope="col">Nama Layanan</th>
                            <th className="text-center" scope="col">Status Layanan</th>
                            <th className="text-center" scope="col">Action</th>  
                        </tr>     
                    </thead>
                       <tbody>
                          {this.renderJSX()}

                       </tbody>
                   </table>
    
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

export default LayananList;