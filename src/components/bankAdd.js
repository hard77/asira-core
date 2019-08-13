import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect , Link } from 'react-router-dom'
import Select from 'react-select';
import {serverUrl} from './url'
import axios from 'axios'
import swal from 'sweetalert'

const cookie = new Cookies()

const options = [
    { value: 'chocolate', label: 'Chocolate'},
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'grey',
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: "50%",float:"left", marginLeft:"112px",
      border:"0.5px solid #CED4DA", borderRadius:"2px"
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

  

class Main extends React.Component{
      state = {
       jenisProduct:null, jenisLayanan: null, 
       errorMessage: null, diKlik:false,
       typeBank:[]
      };

      componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
       }

       handleChangejenisLayanan = (jenisLayanan) => {
        this.setState({ jenisLayanan });
        console.log(`Jenis selected:`, jenisLayanan);
      };

      handleChangejenisProduct = (jenisProduct) => {
        this.setState({ jenisProduct });
        console.log(`Product selected:`, jenisProduct);
      };

      componentDidMount(){
          this.getBankType()
      }
      getBankType = () => {
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
          };
        axios.get(serverUrl+'admin/bank_types',config)
        .then((res)=>{
            console.log(res.data)
            this.setState({typeBank:res.data.data})
        })
        .catch((err)=> console.log(err))
      }

      renderTypeBankJsx = ()=>{
          var jsx = this.state.typeBank.map((val,index)=>{
              return(
                <option key={index} value={val.name}>{val.name}</option>
              )
          })
          return jsx
      }

    btnSaveBank =()=>{
        var services =[]
        var products =[]
        var name = this.refs.namaBank.value
        var type = this.refs.tipeBank.value
        var address = this.refs.alamat.value
        var province =  this.refs.provinsi.value
        var city = this.refs.kota.value
        var pic_name = this.refs.pic_name.value
        var phone = this.refs.telp.value
        
        //service dan product
       

        if(this.state.jenisLayanan===null || this.state.jenisProduct===null || 
        this.refs.namaBank.value === "" || this.refs.tipeBank.value ==="0" || 
        this.refs.alamat.value ==="" || this.refs.provinsi.value==="0" || 
        this.refs.kota.value==="0" || this.refs.pic_name.value ==="" || this.refs.telp.value===""){
            this.setState({errorMessage:"Data masih ada yang kosong"})
        }else{
            
            
                for (var i=0; i<this.state.jenisLayanan.length;i++){
                    services.push (this.state.jenisLayanan[i].value)
                }
                for ( i=0; i<this.state.jenisProduct.length;i++){
                    products.push (this.state.jenisProduct[i].value)
                }
                var newData = {
                    name,type,address,province,city,pic_name,phone,services,products
                }
                var config = {
                    headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
                };
                axios.post(serverUrl+'admin/banks',newData,config)
                .then((res)=>{
                    console.log(res.data)
                    swal("Berhasil","Bank berhasil bertambah","success")
                    this.setState({errorMessage:null,diKlik:true})
                })
                .catch((err)=>console.log(err))
        }


    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listbank'/>            

        }
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container mt-2">
                     <h3>Bank - Tambah</h3>
                 
                     <hr/>
                     <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                                
                     </div>
                    <form>
                        <div className="form-group row">
                            
                        <label className="col-sm-2 col-form-label">Nama Bank</label>
                        <div className="col-sm-10">
                            <input type="text" required className="form-control" ref="namaBank" placeholder="Input Nama Bank.." />
                        </div>
                        </div>
                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tipe Bank</label>
                        <div className="col-sm-10" >
                            <select ref="tipeBank" className="form-control">
                                <option value={0}>====== Pilih Tipe Bank =====</option>
                               {this.renderTypeBankJsx()}
                            </select>
                        </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Alamat Bank</label>
                            <div className="col-sm-10">
                            <textarea rows="5" ref="alamat" className="form-control"  placeholder="Description" required autoFocus/>
                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Provinsi</label>
                            <div className="col-sm-10">
                            <select ref="provinsi" className="form-control">
                                <option value={0}>===== Pilih Provinsi =====</option>
                                <option value={1}>One</option>
                                <option value={2}>Two</option>
                                <option value={3}>Three</option>
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Kota</label>
                            <div className="col-sm-10">
                            <select ref="kota" className="form-control">
                                <option value={0}>===== Pilih Kota =====</option>
                                <option value={1}>One</option>
                                <option value={2}>Two</option>
                                <option value={3}>Three</option>
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Layanan</label>
                           
                            <div className="col-sm-10" >
                            <Select
                                value={this.state.jenisLayanan}
                                onChange={this.handleChangejenisLayanan}
                                isMulti={true}
                                options={options}
                                styles={customStyles}
                                placeholder="Jenis Layanan"
                                
                            />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Produk</label>
                            <div className="col-sm-10">
                                <div>
                                <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChangejenisProduct}
                                isMulti={true}
                                options={options}
                                styles={customStyles}
                                placeholder="Jenis Produk"
                            />

                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama PIC</label>
                            <div className="col-sm-10">
                            <input type="text" className="form-control" ref="pic_name" placeholder="Input Nama PIC.." />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                            <input type="number" className="form-control" ref="telp" placeholder="Nomor telp" />                                                        
                            </div>
                        </div>
                            <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnSaveBank}/>
                            <Link to='/listbank'>
                            <input type="button" className="btn btn-secondary ml-2" value="Batal"/>
                            </Link>  
                    </form>
                    
                   
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

export default Main;