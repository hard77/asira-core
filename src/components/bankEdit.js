import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import {serverUrl} from './url'
import axios from 'axios'
import swal from 'sweetalert'

const cookie = new Cookies()


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
        jenisProduct:null, jenisLayanan: null, 
        errorMessage: null, diKlik:false,
        typeBank:[],bankService:[],bankProduct:[],
        provinsi:[],kabupaten:[],idProvinsi:null,dataBank:[]
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
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
          };
       // axios.get(serverUrl+'admin/banks/[bank_id]',config)
        axios.get(serverUrl+`admin/banks/${id}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({dataBank:res.data})
        })
        .catch((err)=> console.log(err))

    }
    getAllProvinsi = () =>{
      axios.get("https://cors-anywhere.herokuapp.com/http://dev.farizdotid.com/api/daerahindonesia/provinsi")
      .then((res)=>{
          console.log(res.data.semuaprovinsi)
          this.setState({provinsi:res.data.semuaprovinsi})
      })
      .catch((err)=> console.log(err))
    }

    getAllKabupaten = (id) =>{
      axios.get(`https://cors-anywhere.herokuapp.com/http://dev.farizdotid.com/api/daerahindonesia/provinsi/${id}/kabupaten`)
      .then((res)=>{
          console.log(res.data.kabupatens)
          this.setState({kabupaten:res.data.kabupatens})
         
      })
      .catch((err)=> console.log(err))
    }
    getBankProduct = ()=>{
      var config = {
          headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
        };
      axios.get(serverUrl+'admin/service_products',config)
      .then((res)=>{
          console.log(res.data)
          this.setState({bankProduct:res.data.data})
      })
      .catch((err)=> console.log(err))
    }

    getBankService = ()=>{
      var config = {
          headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
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
                <option key={index} value={val.id+"T"+val.nama} > {val.nama} </option>
            )
        })
        return jsx
    }
    renderKabupatenJsx = ()=>{
        var jsx = this.state.kabupaten.map((val,index)=>{
            return (
                <option key={index} value={val.nama}>{val.id_prov} - {val.nama}</option>
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
          return {id:val.id, value: val.service, label: val.service}
      })
      return jsx
       }
   
    btnEdit = ()=>{
        var services =[]
        var products =[]
        var id=this.refs.idBank.value
        var name = this.refs.namaBank.value
        var type = this.refs.tipeBank.value
        var address = this.refs.alamat.value ? this.refs.alamat.value:this.refs.alamat.placeholder
        var province = this.refs.provinsi.value.includes("T") ? this.refs.provinsi.value.slice(this.refs.provinsi.value.indexOf('T')+1,this.refs.provinsi.length):this.refs.provinsi.value
        var city = this.refs.kota.value.includes("T") ? this.refs.kota.value.slice(this.refs.provinsi.value.indexOf('T')+1,this.refs.provinsi.length):this.refs.kota.value
        var pic_name = this.refs.pic_name.value ? this.refs.pic_name.value:this.refs.pic_name.placeholder
        var phone = this.refs.telp.value ? this.refs.telp.value:this.refs.telp.placeholder


        if(this.state.jenisLayanan===null || this.state.jenisProduct===null){
                this.setState({errorMessage:"Harap cek ulang masih ada data yang belum terisi"})
        }else{

            for (var i=0; i<this.state.jenisLayanan.length;i++){
                services.push (this.state.jenisLayanan[i].value)
            }
            for ( i=0; i<this.state.jenisProduct.length;i++){
                products.push (this.state.jenisProduct[i].value)
            }
    
            var newData = {
                name,type,address,province,city,services,products,pic_name,phone
            }
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
              };
           
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
        if(cookie.get('token') && cookie.get('tokenClient')){
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
                            <input type="text" id="disabledTextInput" className="form-control" ref="tipeBank"  defaultValue={this.state.dataBank.type}/>
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
                            <select onChange={()=>this.getAllKabupaten(this.refs.provinsi.value.slice(0,this.refs.provinsi.value.indexOf('T')))} ref="provinsi" className="form-control">
                                <option value={this.state.dataBank.province}>{this.state.dataBank.province}</option>
                               {this.renderProvinsiJsx()}
                            </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Kota</label>
                            <div className="col-sm-10">
                            <select ref="kota" className="form-control">
                                <option value={this.state.dataBank.city}>{this.state.dataBank.city}</option>
                                {this.renderKabupatenJsx()}
                            </select>
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
                                placeholder="Jenis Layanan"
                                
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
                                placeholder="Jenis Produk"
                            />

                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama PIC</label>
                            <div className="col-sm-10">
                            <input type="text" className="form-control" ref="pic_name" placeholder={this.state.dataBank.pic_name} />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                            <input type="number" className="form-control" ref="telp"  placeholder={this.state.dataBank.phone} />                                                        
                            </div>
                        </div>
                        <input type="button" className="btn btn-success" value="Update" onClick={this.btnEdit}/>
                        <input type="button" className="btn btn-secondary ml-2" value="Batal" onClick={()=>window.history.back()}/>

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

export default BankEdit;