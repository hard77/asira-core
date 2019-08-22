import React from 'react'
import Cookies from 'universal-cookie';
import './../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import { serverUrl } from './url';
import swal from 'sweetalert'
import axios from 'axios'
const cookie = new Cookies()

class LayananAdd extends React.Component{
    state={
        selectedFile:null,
        base64img:null,
        errorMessage:'',
        diKlik:false
    
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
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

    btnSimpanLayanan = ()=>{
        var name =this.refs.namaLayanan.value

        if(name==="" || this.state.selectedFile===null){
            this.setState({errorMessage:"Nama Layanan atau Gambar kosong"})
        }else{
            var pic = this.state.selectedFile
            var reader = new FileReader();
            reader.readAsDataURL(pic);
            reader.onload =  () => {                
                var image = reader.result.replace("data:image/jpeg;base64,","")
                var status =  document.querySelector('.messageCheckbox').checked;

                status ? status= 1: status= 0

                var newData = {name,status,image}
                var config = {headers: {'Authorization': "Bearer " + cookie.get('token')}};
                axios.post(serverUrl+'admin/bank_services',newData,config)
                .then((res)=>{
                    swal("Success","Layanan berhasil di tambah","success")
                    this.setState({errorMessage:null,diKlik:true})
                })
                .catch((err)=>{console.log(err)})
                //masukin axios di sini buat add layanan.. jangan lupa


            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
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
                   <h2 className="mt-3">Layanan Tambah</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Layanan</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder="Masukan Nama Layanan" style={{width:"50%",marginLeft:"100px",height:"35px",borderRadius:"3px"}} ref="namaLayanan"></input>                            
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Gambar</label>
                            <div className="col-sm-9">
                            <input className="AddStyleButton btn btn-primary" type="button" onClick={()=>this.refs.input.click()} value={this.valueHandler()}></input>
                            <input ref="input" style={{display:"none"}} type="file" accept="image/*" onChange={this.onChangeHandler}></input>             
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox" /> 
                            <label style={{position:"relative",left:"130px",paddingTop:"3px"}} >Aktif</label>           
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

export default LayananAdd;