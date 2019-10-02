import React from 'react'
import Cookies from 'universal-cookie';
import './../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import { serverUrlBorrower } from './url';
import swal from 'sweetalert'
import axios from 'axios'
const cookie = new Cookies()

class TujuanAdd extends React.Component{
    state={
        errorMessage:'',
        diKlik:false,check:false
    }

    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    
    btnSimpanLayanan = ()=>{
        var name =this.refs.tujuan.value
        var status =  this.state.check?"active":"inactive"

        if(name==="" || name.trim()===""){
            this.setState({errorMessage:"Tujuan field Kosong -  Harap cek ulang"})
        }else{
                var newData={name,status}
                var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
                axios.post(serverUrlBorrower+'admin/loan_purposes',newData,config)
                .then((res)=>{
                    swal("Success","Tujuan berhasil di tambah","success")
                    this.setState({errorMessage:null,diKlik:true})
                })
                .catch((err)=>{console.log(err)})
        }
    }
        
    
    handleChecked=(e)=>{
        this.setState({check:!this.state.check})
    }
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listtujuan'/>            

        }
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2 className="mt-3">Tujuan Pembiayaan - Tambah</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Tujuan Pembiayaan</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder="Masukan Nama Layanan" style={{width:"50%",marginLeft:"100px",height:"35px",borderRadius:"3px"}} ref="tujuan"></input>                            
                            </div>
                    </div>
                  
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" type="checkbox" onChange={this.handleChecked} defaultChecked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Non-Aktif'}</label>        
                            </div>
                    </div>
                    <div className="form-group row">
                            <input type="button" className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSimpanLayanan}/>
                            <input type="button" className="btn btn-warning" value="Batal" onClick={this.btnCancel}/>

                    </div>
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

export default TujuanAdd;