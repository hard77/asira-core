import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { serverUrl } from './url';
import Axios from 'axios';
import swal from 'sweetalert'
const cookie = new Cookies()
var config = {
    headers: {'Authorization': "Bearer " + cookie.get('token')}
};
class RoleEdit extends React.Component{
    state = {
        diKlik:false,
        dataRole:'',
        check:true
    };
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this.getRoleById()
    }
    getRoleById = ()=>{
        var id = this.props.match.params.id
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
        };
        Axios.get(serverUrl+`admin/roles/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({dataRole:res.data,check:res.data.status})
        })
        .catch((err)=> console.log(err))

    }
    btnEdit = ()=>{
        var id = this.props.match.params.id
        var description = this.refs.deskripsi.value ?  this.refs.deskripsi.value :  this.refs.deskripsi.placeholder
        var status =  this.state.check
        //status ? status= "active": status= "inactive"
                var newData = {description,status}
                Axios.patch(serverUrl+`admin/roles/${id}`,newData,config)
                .then((res)=>{
                    swal("Success","Role berhasil di Edit","success")
                    this.setState({diKlik:true})
                })
                .catch((err)=>{console.log(err)})
      
    }
    handleChecked = () =>{
        this.setState({check:!this.state.check})
    }
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listrole'/>            
        }
        if(cookie.get('token')){
            return(
                <div className="container mt-4">
                 <h3>Role - Edit</h3>
                 <hr/>
                 <form>
                             <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Role Id</label>
                            <div className="col-sm-10">
                                <input disabled type="text" required className="form-control" ref="namaRole" placeholder={this.state.dataRole.id} />
                            </div>
                            
                            </div>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Nama Role</label>
                            <div className="col-sm-10">
                                <input disabled type="text" required className="form-control" ref="namaRole" placeholder={this.state.dataRole.name} />
                            </div>
                            
                            </div>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Sistem</label>
                            <div className="col-sm-10">
                            <input disabled type="text" required className="form-control" ref="namaRole" placeholder={this.state.dataRole.system} />
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Deskripsi</label>
                            <div className="col-sm-10">
                                <textarea  rows= {6} ref="deskripsi" className="form-control"  placeholder={this.state.dataRole.description} required autoFocus/>
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-10">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" type="checkbox" onChange={this.handleChecked} checked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>        
                            </div>

                            <div className="form-group row">
                            <div className="col-sm-12 ml-3 mt-3">
                                                <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnEdit}/>
                                                <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                             </div></div>
                    </div>
                 </form>
                
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