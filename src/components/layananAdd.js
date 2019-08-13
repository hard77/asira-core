import React from 'react'
import Cookies from 'universal-cookie';
import './../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class LayananAdd extends React.Component{
    state={
        selectedFile:null,
        base64img:null
    
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
      
        var str=''
        var layanan =this.refs.namaLayanan.value
        var nilai =  document.querySelector('.messageCheckbox').checked;
        //nilai ? str+="Aktif" : str +="tidak aktif"
        
        var pic = this.state.selectedFile
  
        var reader = new FileReader();
        reader.readAsDataURL(pic);
        reader.onload = function () {
            alert(nilai)
            alert(reader.result.replace("data:image/jpeg;base64,",""))
            alert(layanan)
           
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
        
        
        
    }

   
     

    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                   <h2 className="mt-3">Layanan Tambah</h2>
                   <hr/>
                   <div className="form-group row">
                            <label className="col-sm-3">Nama Layanan Bank</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder="Masukan Nama Layanan" className="form-control" ref="namaLayanan"></input>                            
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
                            <label style={{position:"relative",left:"145px",paddingTop:"5px"}} >Aktif</label>           
                            </div>
                    </div>
                    <div className="form-group row">
                            <input type="button" className="btn btn-warning ml-3 mr-3" value="Simpan" onClick={this.btnSimpanLayanan}/>
                            <input type="button" className="btn btn-secondary" value="Back" onClick={this.btnCancel}/>

                    </div>
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

export default LayananAdd;