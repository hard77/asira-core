import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { serverUrlBorrower } from './url';
import swal from 'sweetalert'

const cookie = new Cookies()

class RoleAdd extends React.Component{
    state = {
        diKlik:false,
        errorMessage:''
       };

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnSave=()=>{
        var name = this.refs.namaRole.value
        var system = this.refs.sistem.value
        var description = this.refs.deskripsi.value
        var status =  document.querySelector('.messageCheckbox').checked;
        // status ? status= "active": status= "inactive"

        if(name.trim()==="" || name ===""){
            this.setState({errorMessage:"Nama Role Kosong - Harap Cek Ulang"})
        }else if(system === "0" ){
            this.setState({errorMessage:"Sistem Role Kosong - Harap Cek Ulang"})            
        }else{
            var newData = {name,system,description,status}
            var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
            axios.post(serverUrlBorrower+'admin/internal_role',newData,config)
            .then((res)=>{
                swal("Success","Role berhasil di tambah","success")
                this.setState({diKlik:true})
            })
            .catch((err)=>{
                console.log(err.response)
            })
         
        }
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listrole'/>            
        }
        if(cookie.get('token')){
            return(
                <div className="container mt-4">
                 <h3>Role - Tambah</h3>
                 
                 <hr/>
                 <div className="form-group row">
                        <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                {this.state.errorMessage}
                        </div>
                            
                 </div>
                 <form>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Nama Role</label>
                            <div className="col-sm-10">
                                <input type="text" required className="form-control" ref="namaRole" placeholder="Input Role.." />
                            </div>
                            
                            </div>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Sistem</label>
                            <div className="col-sm-10">
                                <select ref="sistem" className="form-control">
                                <option value={0}>====== Pilih Sistem =====</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Core">Core</option>
                                <option value="Bank Dashboard">Bank Dashboard</option>
                            </select>
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Deskripsi</label>
                            <div className="col-sm-10">
                                <textarea  rows= {6} ref="deskripsi" className="form-control"  placeholder="Description.." required autoFocus/>
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-10">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox" /> 
                            <label style={{position:"relative",left:"140px",paddingTop:"3px"}} >Aktif</label>           
                            </div>

                            <div className="form-group row">
                            <div className="col-sm-12 ml-3 mt-3">
                                                <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave}/>
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

export default RoleAdd;