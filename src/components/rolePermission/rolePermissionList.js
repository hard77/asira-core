import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { serverUrl } from '../url';
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
// import SubTable from './../subComponent/SubTable'
const cookie = new Cookies()

const config = {
    headers: {'Authorization': "Bearer " + cookie.get('token')}
};

// const columnDataRole = [
//     {
//         id: 'id',
//         numeric: 'true',
//         disablePadding: false,
//         label: 'Id Role Permission',
//     },
//     {
//         id: 'name',
//         numeric: 'false',
//         disablePadding: true,
//         label: 'Nama Role',
//     },
//     { id: 'status', numeric: 'false', disablePadding: true, label: 'Status' },
//     {
//         id: 'updated_time',
//         numeric: 'false',
//         disablePadding: false,
//         label: 'Update Date',
//         time: 'true',
//     },
// ]

class RolePermissionList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true, 
            listRole: [],
        }
    }
    componentDidMount(){
        this.getAllRole();
    }
    
    getAllRole = ()=>{
        axios.get(serverUrl+`admin/roles`,config).then((res)=>{
          const listRole = res.data && res.data.data
  
          this.setState({
            listRole,
          }, () => {
            this.getAllRolePermission()
          })
        }).catch((err)=>{
            console.log(err.toString())
            this.setState({
              errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
              loading: false,
              disabled: true,
            })
        })
    }
  
    getAllRolePermission = ()=>{
        axios.get(serverUrl+`admin/permission`,config)
        .then((res)=>{
            const listPermission = res.data && res.data.data ? res.data.data : res.data;
            const listRole = this.state.listRole;
            const newRole = [];

            for(const key in listRole) {
                const rolePerLine = listRole[key];
                rolePerLine.permission = []
                for(const keyPermission in listPermission) {
                    if(
                        rolePerLine.id.toString() === listPermission[keyPermission].role_id.toString() &&
                        listPermission[keyPermission].permissions.toString().trim().length !== 0
                    ) {
                        rolePerLine.permission.push(listPermission[keyPermission].permissions)
                    }
                }

                if(rolePerLine.permission.length !== 0) {
                    newRole.push(rolePerLine);
                }
            }

            this.setState({
                listRole: newRole,
                loading:false,
            })

        }).catch((err)=>{
            console.log(err.toString())
            this.setState({
              errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
              loading: false,
              disabled: true,
            })
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
        
        
        var jsx = this.state.listRole.map((val,index)=>{
            return(
                <tr key={index}>
                <td align="center">{this.state.page >1 ? index+1 + (this.state.dataPerhalaman*(this.state.page -1)) : index+1}</td>
                <td align="center">{val.id}</td>
                <td align="center">{val.name}</td>
                <td align="center">{val.system}</td>
                <td align="center">{val.status ? "Aktif" : "Tidak Aktif"}</td>
                <td align="center">
                    <Link to={`/editRolePermission/${val.id}`} className="mr-2">
                        <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                    </Link>
                    <Link to={`/detailRolePermission/${val.id}`} >
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
                             <h2 className="mt-3">Role Permission - List</h2>
                        </div>
                        <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                            {this.state.errorMessage}
                        </div>   
                    </div>
                   <hr/>

                   {/* <SubTable
                        // headerTitle={'List Application'}
                        // search={this.state.flagAdd ? searchBar : null}
                        columnData={columnDataRole}
                        data={this.state.listRole}
                        idKey={'id'}
                        // onAddFunction={
                        //     // this.state.flagAdd ? this.handleAddApplication : null
                        // }
                        // onRowClickedFunction={this.handleViewApplication}
                    /> */}
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

export default RolePermissionList;