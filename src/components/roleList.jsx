import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Axios from 'axios';
import { serverUrlBorrower } from './url';
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
const cookie = new Cookies()

class RoleList extends React.Component{
    state={
        loading:true, rows:[],
    }
    componentDidMount(){
        this.getAllRole()
    }
    getAllRole = ()=>{
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        Axios.get(serverUrlBorrower+`admin/internal_role`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({
                rows:res.data.data,
                loading:false
            })

        })
        .catch((err)=>{
            console.log(err.response)
        })
    }
    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={6}>
                      <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
              />   
                </td>
              </tr>
            )
        }
        var jsx = this.state.rows.map((val,index)=>{
            return(
                <tr key={index}>
                <td align="center">{this.state.page >1 ? index+1 + (this.state.dataPerhalaman*(this.state.page -1)) : index+1}</td>
                <td align="center">{val.id}</td>
                <td align="center">{val.name}</td>
                <td align="center">{val.system}</td>
                <td align="center">{val.status ? "Active" : "Inactive"}</td>
                <td align="center">
                    <Link to={`/editrole/${val.id}`} className="mr-2">
                         <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                    <Link to={`/detailrole/${val.id}`} >
                         <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                </td>
        </tr>  
            )
                   
        })
                     
        return jsx;

    }
    render(){
        
        if(cookie.get('token')){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Role - List</h2>
                        </div>
                    </div>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">ID Role</th>
                            <th className="text-center" scope="col">Nama Role</th>
                            <th className="text-center" scope="col">Sistem</th>
                            <th className="text-center" scope="col">Status</th>
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
        if(!cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default RoleList;