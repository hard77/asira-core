import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

const cookie = new Cookies()

class BankList extends React.Component{
    state={
        loading:true,rows:[{
            "id":1
        }]
    }

    renderJSX = () => {
        // if (this.state.loading){
        //     return  (
        //       <tr  key="zz">
        //         <td align="center" colSpan={6}>
        //               <Loader 
        //           type="Circles"
        //           color="#00BFFF"
        //           height="40"	
        //           width="40"
        //       />   
        //         </td>
        //       </tr>
        //     )
        // }else{
          
        // }
        var jsx = this.state.rows.map((val,index)=>{
            return(
                <tr key={index}>
                <td align="center">{val.id}</td>
                <td align="center">Bla bla bla</td>
                <td align="center">Bla bla bla</td>
                <td align="center">Bla bla bla</td>
                <td align="center">
                    <Link to={`/bankedit/${val.id}`} className="mr-2">
                         <i class="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                    <Link to={`/bankdetail/${val.id}`} >
                         <i class="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                </td>
        </tr>  
            )
                   
        })
                     
        return jsx;

    }

    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                   <h2 className="mt-3">List Bank</h2>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <td align="center">#</td>
                            <td align="center">Id Bank</td>
                            <td align="center">Nama Bank</td>
                            <td align="center">Tipe Bank</td>
                            <td align="center">Action</td>
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

export default BankList;