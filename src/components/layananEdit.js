import React from 'react'
import Cookies from 'universal-cookie';
import './../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import { serverUrl } from './url';
import swal from 'sweetalert'
import axios from 'axios'
const cookie = new Cookies()

class LayananEdit extends React.Component{
    state={
        selectedFile:null,
        base64img:null,
        errorMessage:'',
        diKlik:false,
        rows:[],imageVal:''
    
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this.getLayananEdit()
    }
    getLayananEdit = ()=>{
        var id = this.props.match.params.id
        var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
                
        axios.get(serverUrl+`admin/bank_services/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({rows:res.data})
            if(this.state.rows.image_id !== undefined || this.state.rows.image_id !== null){
                axios.get(serverUrl+`admin/image/${this.state.rows.image_id}`,config)
                .then((res)=>{
                    this.setState({imageVal:res.data.image_string})
                })
            }
        })
        .catch((err)=>{console.log(err)})
    }
    onChangeHandler = (event)=>{
        //untuk mendapatkan file image
        this.setState({selectedFile:event.target.files[0]})
    }
    valueHandler = ()=>{
        console.log(this.state.selectedFile)
        return  this.state.selectedFile ? this.state.selectedFile.name :"Browse Image"
        
    }
    getBase64(file,callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result.replace("data:image/jpeg;base64,",""))
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
        // return reader.result.replace("data:image/jpeg;base64,","");
     }

    btnEditLayanan = ()=>{
        var id = this.props.match.params.id
        var name = this.refs.namaLayanan.value ? this.refs.namaLayanan.value : this.refs.namaLayanan.placeholder
        var status =  document.querySelector('.messageCheckbox').checked;
        status ? status= "active": status= "inactive"
        
        if(name.trim()===""||name===""){
            this.setState({errorMessage:"Nama Layanan Kosong - Harap Cek Ulang"})
        }else{
            if (this.state.selectedFile){
                if (this.state.selectedFile.size >1000000){
                    this.setState({errorMessage:"Gambar tidak bole lebih dari 1 MB - Harap cek ulang"})
                }else{
                    var pic = this.state.selectedFile
                    var reader = new FileReader();
                    reader.readAsDataURL(pic);
                    reader.onload =  () => {           
                        var arr = reader.result.split(",")   
                        var image = arr[1].toString()
                        var newData = {name,status,image}
                        var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
                        axios.patch(serverUrl+`admin/bank_services/${id}`,newData,config)
                        .then((res)=>{
                            swal("Success","Layanan berhasil di Edit","success")
                            this.setState({errorMessage:null,diKlik:true})
                        })
                        .catch((err)=>{console.log(err)})
                    };
                    reader.onerror = function (error) {
                      console.log('Error: ', error);
                    };
                }
             
            }else{
                var newData = {name,status}
                var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
                axios.patch(serverUrl+`admin/bank_services/${id}`,newData,config)
                .then((res)=>{
                    swal("Success","Layanan berhasil di Edit","success")
                    this.setState({errorMessage:null,diKlik:true})
                })
                .catch((err)=>{console.log(err)})
            }
        }
        
            
        
        
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listlayanan'/>            

        }
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2 className="mt-3">Layanan - Ubah</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Layanan</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder={this.state.rows.name} style={{width:"50%",marginLeft:"100px",height:"35px",borderRadius:"3px"}} ref="namaLayanan"></input>                            
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Gambar</label>
                            <div className="col-sm-9">
                            <input className="AddStyleButton btn btn-primary" type="button" onClick={()=>this.refs.input.click()} value={this.valueHandler()}></input>
                            <input ref="input" style={{display:"none"}} type="file" accept="image/*" onChange={this.onChangeHandler}></input>
                            <img alt={this.state.rows.name} style={{marginLeft:"20px",width:"100px"}} src={`data:image/jpeg;png;base64,${this.state.imageVal}`}></img>
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            {this.state.rows.status ==="active"?<input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox" defaultChecked/>   :
                        <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox"/> 
                        }
                            
                            <label style={{position:"relative",left:"130px",paddingTop:"3px"}} >Aktif</label>           
                            </div>
                    </div>
                    <div className="form-group row">
                            <input type="button" className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnEditLayanan}/>
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

export default LayananEdit;