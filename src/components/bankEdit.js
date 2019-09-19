import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import {serverUrl,serverUrlGeo} from './url'
import axios from 'axios'
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const cookie = new Cookies()
var config = {
    headers: {'Authorization': "Bearer " + cookie.get('token')}
  };
  var configGeo = {
    headers: {'Authorization': "Bearer " + cookie.get('tokenGeo')}
  };

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' },
//   ];
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

class BankEdit extends React.Component{
    state = {
        jenisProduct:null, jenisLayanan: null, productID:[],serviceID:[],
        errorMessage: null, diKlik:false,
        typeBank:[],bankService:[],bankProduct:[],
        provinsi:[],kabupaten:[],idProvinsi:null,dataBank:[],phone:'',provinsiEdit:null,namaTipeBank:'',adminFeeRadioValue:'',convinienceFeeRadioValue:''
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
        this.getBankService()
        this.getBankProduct()
        this.getAllProvinsi()
        this.getBankDataById()
    }
    getBankDataById = ()=>{
        var id = this.props.match.params.id
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
       // axios.get(serverUrl+'admin/banks/[bank_id]',config)
        axios.get(serverUrl+`admin/banks/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({dataBank:res.data,productID:res.data.products,serviceID:res.data.services})
           if (this.state.dataBank){
             this.getTypeBank()
           }
        })
        .catch((err)=> console.log(err))

    }
    // getAllProvinsi = () =>{
    //   axios.get("https://cors-anywhere.herokuapp.com/http://dev.farizdotid.com/api/daerahindonesia/provinsi")
    //   .then((res)=>{
    //       console.log(res.data.semuaprovinsi)
    //       this.setState({provinsi:res.data.semuaprovinsi})
    //   })
    //   .catch((err)=> console.log(err))
    // }
    getAllProvinsi = () =>{
        configGeo = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenGeo')}
          };
        axios.get(serverUrlGeo+`client/provinsi`,configGeo)
        .then((res)=>{
            console.log(res.data.data)
            this.setState({provinsi:res.data.data})
           
        })
        .catch((err)=> console.log(err))
      }

    // getAllKabupaten = (id) =>{
    //   axios.get(`https://cors-anywhere.herokuapp.com/http://dev.farizdotid.com/api/daerahindonesia/provinsi/${id}/kabupaten`)
    //   .then((res)=>{
    //       console.log(res.data.kabupatens)
    //       this.setState({kabupaten:res.data.kabupatens,provinsiEdit:"terpilih"})
         
    //   })
    //   .catch((err)=> console.log(err))
    // }
    getAllKabupaten = (id) =>{
        axios.get(serverUrlGeo+`client/provinsi/${id}/kota`,configGeo)
        .then((res)=>{
            console.log(res.data.data)
            this.setState({kabupaten:res.data.data})
           
        })
        .catch((err)=> console.log(err))
      }
    getBankProduct = ()=>{
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
      axios.get(serverUrl+'admin/service_products',config)
      .then((res)=>{
          console.log(res.data)
          this.setState({bankProduct:res.data.data})
      })
      .catch((err)=> console.log(err))
    }

    getTypeBank = ()=>{
        axios.get(serverUrl+`admin/bank_types/${this.state.dataBank.type}`,config)
      .then((res)=>{
          console.log(res.data.name)
            this.setState({namaTipeBank:res.data.name})
      })
      .catch((err)=> console.log(err))
    }

    getBankService = ()=>{
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
      axios.get(serverUrl+'admin/bank_services',config)
      .then((res)=>{
          console.log(res.data)
          this.setState({bankService:res.data.data})
      })
      .catch((err)=> console.log(err))
    }

    renderProvinsiJsx = ()=>{
        var jsx = this.state.provinsi.map((val,index)=>{
            return (
                <option key={index} value={val.id+"-"+val.name} > {val.name} </option>
                
            )
        })
        return jsx
    }
    renderKabupatenJsx = ()=>{
        var jsx = this.state.kabupaten.map((val,index)=>{
            return (
                <option key={index} value={val.name}>{val.id} - {val.name}</option>
            )
        })
        return jsx
    }

    renderJenisLayananJsx = ()=>{
        var jsx = this.state.bankService.map((val,index)=>{
            return {id:val.id, value: val.name, label: val.name}
        })
        return jsx
    }
      renderJenisProductJsx = ()=>{
      var jsx = this.state.bankProduct.map((val,index)=>{
          return {id:val.id, value: val.name, label: val.name}
      })
      return jsx
       }

    handleChangeRadioAdmin =(e)=>{
        this.setState({adminFeeRadioValue:e.target.value})
    }
    handleChangeRadioConvience =(e)=>{
        this.setState({convinienceFeeRadioValue:e.target.value})
    }
    btnEdit = ()=>{
        var services =[]
        var products =[]
        var id=this.refs.idBank.value
        var name = this.refs.namaBank.value
        var type = parseInt(this.refs.tipeBank.value)
        var address = this.refs.alamat.value ? this.refs.alamat.value:this.refs.alamat.placeholder
        var province = this.refs.provinsi.value.includes("-") ? this.refs.provinsi.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.value.length) : this.refs.provinsi.value
        var city = this.refs.kota.value.includes("-") ? this.refs.kota.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.length):this.refs.kota.value
        var pic = this.refs.pic.value ? this.refs.pic.value:this.refs.pic.placeholder
        var phone = this.state.phone ? String(this.state.phone):String(this.state.dataBank.phone)
        var adminfee_setup = this.state.adminFeeRadioValue ? this.state.adminFeeRadioValue : this.state.dataBank.adminfee_setup
        var convfee_setup =  this.state.adminFeeRadioValue ? this.state.adminFeeRadioValue : this.state.dataBank.adminfee_setup
       
        if(city === "0" || city === null){
            this.setState({errorMessage:"Kota Kosong - Harap cek ulang"})
        }else if (pic.trim()===""){
            this.setState({errorMessage:"PIC Kosong - Harap cek ulang"})
        }else if(address.trim()===""){
            this.setState({errorMessage:"Alamat Kosong - Harap cek ulang"})
        }else{
             if(this.state.jenisLayanan){
                for (var i=0; i<this.state.jenisLayanan.length;i++){
                    services.push (this.state.jenisLayanan[i].value)
                }
            }else{
                services = this.state.serviceID
            }
            
            if(this.state.jenisProduct){
                for ( i=0; i<this.state.jenisProduct.length;i++){
                    products.push (this.state.jenisProduct[i].value)
                }
            }else{
                products = this.state.productID
            }
    
            var newData = {
                name,type,address,province,city,services,products,pic,phone,adminfee_setup,convfee_setup
            }
        
           
            axios.patch(serverUrl+`admin/banks/${id}`,newData,config)
            .then((res)=>{
                swal("Success","Data berhasil di edit","success")
                this.setState({diKlik:true,errorMessage:null})
            })
            .catch((err)=> console.log(err))
           
       }
           

        
       
    }
    
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listbank'/>            

        }
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Bank - Edit</h2>
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                                
                     </div>
                   
                   <form>
                       <fieldset disabled>
                       <div className="form-group row">
                            <label className="col-sm-2 col-form-label">ID Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="idBank" defaultValue={this.state.dataBank.id} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="namaBank" defaultValue={this.state.dataBank.name}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tipe Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="tipeBank"  defaultValue={this.state.namaTipeBank}/>
                            </div>
                        </div>
                       </fieldset>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Alamat Bank</label>
                            <div className="col-sm-10">
                            <textarea rows="6" ref="alamat" placeholder={this.state.dataBank.address} className="form-control"  autoFocus/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Provinsi</label>
                            <div className="col-sm-10">
                            <select id="provinsi" onChange={()=>{this.getAllKabupaten(this.refs.provinsi.value.slice(0,this.refs.provinsi.value.indexOf('-')))
                            document.getElementById("kota").value ="0"
                        }} ref="provinsi" className="form-control">
                           
                               {this.state.provinsiEdit===null?     <option value={this.state.dataBank.province}>{this.state.dataBank.province}</option>:null} 
                               <optgroup label="_________________________">
                               {this.renderProvinsiJsx()}
                               </optgroup>
                            </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Kota</label>
                            <div className="col-sm-10">
                            <select ref="kota" id="kota" className="form-control">
                              {this.state.provinsiEdit===null? <option value={this.state.dataBank.city}>{this.state.dataBank.city}</option>:
                           null
                            }  <option value={0}>========= PILIH KOTA =========</option>
                               
                                {this.renderKabupatenJsx()}
                           
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Admin Fee Setup</label>
                            <div className="col-sm-10">
                                {this.state.dataBank.adminfee_setup === 'beban_plafon' ?
                                <label className="form-control" style={{border:"none"}}>
                                    <input type="radio" name="adminfeeSetup"  value="potong_plafon" onClick={this.handleChangeRadioAdmin} /> Potong dari plafond
                                    <input type="radio" name="adminfeeSetup" defaultChecked={true} className="ml-3" value="beban_plafon" onClick={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                                </label> 
                                    :
                                <label className="form-control" style={{border:"none"}}>
                                    <input type="radio" name="adminfeeSetup" defaultChecked={true} value="potong_plafon" onClick={this.handleChangeRadioAdmin} /> Potong dari plafond
                                    <input type="radio" name="adminfeeSetup"  className="ml-3" value="beban_plafon" onClick={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                                </label> 
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Convinience Fee Setup</label>
                            <div className="col-sm-10">
                                <div className="form-control" style={{border:"none",cursor: "not-allowed"}}>
                                    <input type="radio" disabled="disabled" checked={this.state.adminFeeRadioValue==="potong_plafon"?"checked":""} name="convinienceFeeSetup" readOnly value="potong_plafon"  /> Potong dari plafond
                                    <input type="radio" disabled="disabled" checked={this.state.adminFeeRadioValue==="beban_plafon"?"checked":""} name="convinienceFeeSetup" readOnly className="ml-3" value="beban_plafon" /> Bebankan ke cicilan
                                </div> 
                         
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Layanan</label>
                           
                            <div className="col-sm-10" >
                            <Select
                               
                                defaultValue={this.state.jenisLayanan}
                                onChange={this.handleChangejenisLayanan}
                                isMulti={true}
                                options={this.renderJenisLayananJsx()}
                                styles={customStyles}
                                placeholder={this.state.serviceID.toString()}
                                
                            />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Produk</label>
                            <div className="col-sm-10">
                                <div>
                                <Select
                                defaultValue={this.state.jenisProduct}
                                onChange={this.handleChangejenisProduct}
                                isMulti={true}
                                options={this.renderJenisProductJsx()}
                                styles={customStyles}
                                placeholder={this.state.productID.toString()}
                                
                            />

                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama PIC</label>
                            <div className="col-sm-10">
                            <input type="text" className="form-control" ref="pic" placeholder={this.state.dataBank.pic} />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                          
                            <PhoneInput
                            country="ID"
                            ref="telp"
                            placeholder={this.state.dataBank.phone} 
                            value={ this.state.phone }
                            onChange={ phone => this.setState({ phone }) } className="form-control" />                                                       
                            </div>
                        </div>
                        <input type="button" className="btn btn-success" value="Update" onClick={this.btnEdit}/>
                        <input type="button" className="btn btn-secondary ml-2" value="Batal" onClick={()=>window.history.back()}/>

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

export default BankEdit;