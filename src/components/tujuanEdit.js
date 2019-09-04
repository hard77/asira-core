import React from 'react'
import Cookies from 'universal-cookie';
import './../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import { serverUrlBorrower } from './url';
import swal from 'sweetalert'
import axios from 'axios'
const cookie = new Cookies()

class TujuanEdit extends React.Component{
    state={
        errorMessage:'',
        diKlik:false,
        rows:[]
    }

    componentDidMount(){
        this.getTujuanDetailByID()
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    getTujuanDetailByID = ()=>{
        var id = this.props.match.params.id
        var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
        axios.get(serverUrlBorrower+`admin/loan_purposese/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({rows:res.data})
        })
        .catch((err)=>{console.log(err)})
    }
    btnUpdateLayanan = ()=>{
        var name =this.refs.tujuan.value ? this.refs.tujuan.value : this.refs.tujuan.placeholder
        var status =  document.querySelector('.messageCheckbox').checked;
        var id = this.props.match.params.id
      
        status ? status= "active": status= "inactive"
      
        if(name==="" || name.trim()===""){
            this.setState({errorMessage:"Tujuan field Kosong -  Harap cek ulang"})
        }else{
                var newData={name,status}
                var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
                axios.patch(serverUrlBorrower+`admin/loan_purposese/${id}`,newData,config)
                .then((res)=>{
                    swal("Success","Tujuan berhasil di tambah","success")
                    this.setState({errorMessage:null,diKlik:true})
                })
                .catch((err)=>{console.log(err)})
            }
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
                   <h2 className="mt-3">Tujuan Pembiayaan - Edit</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Tujuan Pembiayaan</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder={this.state.rows.name} style={{width:"50%",marginLeft:"100px",height:"35px",borderRadius:"3px"}} ref="tujuan"></input>                            
                            </div>
                    </div>
                  
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox" /> 
                            {this.state.rows.status ==="active"?<input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox" defaultChecked/>   :
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox"/> 
                            }    
                            </div>
                    </div>
                    <div className="form-group row">
                            <input type="button" className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnUpdateLayanan}/>
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

export default TujuanEdit;