import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import './../support/css/productAdd.css'
import NumberFormat from 'react-number-format';
import axios from 'axios'
import {serverUrl} from './url'
import swal from 'sweetalert'

const cookie = new Cookies()
const options = [
    { value: 'pendidikan', label: 'Pendidikan' },
    { value: 'konsumtif', label: 'Konsumtif' }
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

 

class ProductAdd extends React.Component{
    state = {
        selectedOption: null, errorMessage:null,rentangDari:0,rentangAkhir:0,
        bankService:[],diKlik:false
      };

      componentDidMount(){
          this.getBankService()
      }
      handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

      btnSaveProduct = ()=>{
        var name = this.refs.namaProduct.value
        var min_timespan = this.refs.jangkaWaktuDari.value
        var max_timespan = this.refs.jangkaWaktuSampai.value
        var interest = this.refs.imbalHasil.value ? this.refs.imbalHasil.value : this.refs.imbalHasil.placeholder
        var min_loan = this.state.rentangDari
        var max_loan = this.state.rentangAkhir 
        var adminfee = this.refs.adminFee.value ? this.refs.adminFee.value : this.refs.adminFee.placeholder

        var asn_fee = this.refs.convinienceFee.value ? this.refs.convinienceFee.value : this.refs.convinienceFee.placeholder
        var service = this.refs.layanan.value
        
        var fees= []
        var status =  document.querySelector('.messageCheckbox').checked;
        var assurance =  document.querySelector('.asuransi').checked;
        var otheragunan =  document.querySelector('.otheragunan').checked;

        var i
       
        status = status ? status = "active" : status ="inactive"
        assurance = assurance ? assurance = this.refs.asuransi.value : assurance=""
        otheragunan = otheragunan ? otheragunan = this.refs.lainnya.value : otheragunan =""

     
        
        
        if(name===""){
            this.setState({errorMessage:"Data Kosong"})
        }else if(min_timespan==="0" || max_timespan==="0"){
            this.setState({errorMessage:"Jangka Waktu Kosong"})
        }else if(parseInt(min_timespan) > parseInt(max_timespan)){
            this.setState({errorMessage:"Jangka Waktu dari lebih besar - Harap cek ulang"})
        }else if(parseFloat(interest)<0 || parseInt(interest)===0){
            this.setState({errorMessage:"Imbal Hasil tidak bole minus/ kosong - Harap cek ulang"})
        }else if(parseInt(min_loan) > parseInt(max_loan) || parseInt(min_loan) === parseInt(max_loan) ){
            this.setState({errorMessage:"Rentang Pengajuan tidak benar - Harap cek ulang"})
        }else if(parseFloat(adminfee) <0){
            this.setState({errorMessage:"Admin Fee tidak benar - Harap cek ulang"})
        }else if(parseFloat(asn_fee) <0){
            this.setState({errorMessage:"Convinience Fee tidak benar - Harap cek ulang"})
        }else if(parseInt(service)===0){
            this.setState({errorMessage:"Layanan belum terpilih - Harap cek ulang"})
        }else if(this.state.selectedOption===null){
            this.setState({errorMessage:"Sektor Pembiayaan belum terpilih - Harap cek ulang"})
        }else if(isNaN(adminfee) || isNaN(asn_fee)){
            this.setState({errorMessage:"Admin atau Convience Fee mesti angka  - Harap cek ulang"})
        }
        else{
            fees.push({
                "description": "Admin Fee",
                "amount":`${adminfee}%`
            })

               //===========CODING BAGIAN SEKTOR PEMBIAYAAN

                    var financing_sector = []
                    for ( i=0 ; i < this.state.selectedOption.length; i++){
                        financing_sector.push(this.state.selectedOption[i].value)
                    }


                //======= CODING BAGIAN AGUNAN
                    var collaterals =[]
                    var agunan = document.querySelectorAll('.agunan:checked')


                    for ( i = 0; i < agunan.length; i++) {
                        collaterals.push(agunan[i].value)   
                    }
                    if (otheragunan){
                        collaterals.push(otheragunan)
                    }
           
                    asn_fee = asn_fee +"%"
            var newData = {
                name,min_timespan,max_timespan,interest,min_loan,max_loan,fees,asn_fee,service,collaterals,financing_sector,assurance,status
            }
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
            };
            axios.post(serverUrl+'admin/service_products',newData,config)
            .then((res)=>{
                console.log(res.data)
                swal("Berhasil","Produk berhasil bertambah","success")
                this.setState({errorMessage:null,diKlik:true})
            })
            .catch((err)=>console.log(err))
         

       }


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

      renderBankService = ()=>{
          var jsx = this.state.bankService.map((val,index)=>{
                 return   (<option key={index} value={val.id}>{val.name}</option>)
          })
          return jsx;
      }

      componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
       }
  
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listproduct'/>            

        }
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                    <h2 className="mb-5">Produk - Tambah</h2>
                    <form>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>
                                   <label>Nama Produk</label>
                                </td>
                                <td>
                                   <input type="text" ref="namaProduct" className="form-control textfield" placeholder="Input Nama Produk" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                   <label>Jangka Waktu (Bulan)</label>
                                </td>
                                <td>
                                <select ref="jangkaWaktuDari" className="form-control option" style={{width:"150px"}}>
                                        <option value={0}> DARI </option>
                                        <option value={6}>6 </option>
                                        <option value={7}>7 </option>
                                        <option value={8}>8 </option>
                                        <option value={9}>9 </option>
                                        <option value={10}>10 </option>
                                        <option value={11}>11 </option>
                                        <option value={12}>12 </option> 
                                        <option value={13}>13 </option>
                                        <option value={14}>14 </option>
                                        <option value={15}>15 </option> 
                                        <option value={16}>16 </option>
                                        <option value={17}>17 </option>
                                        <option value={18}>18 </option> 
                                        <option value={19}>19 </option>
                                        <option value={20}>20 </option>
                                        <option value={21}>21 </option>
                                        <option value={22}>22 </option>
                                        <option value={23}>23 </option> 
                                        <option value={24}>24 </option>
                                        <option value={25}>25 </option>
                                        <option value={26}>26 </option> 
                                        <option value={27}>27 </option>
                                        <option value={28}>28 </option>
                                        <option value={29}>29 </option> 
                                        <option value={30}>30 </option>    
                                </select>
                              
                                <select  ref="jangkaWaktuSampai" className="form-control option" style={{width:"150px"}}>
                                        <option value={0}>HINGGA</option>
                                        <option value={12}>12 </option> 
                                        <option value={13}>13 </option>
                                        <option value={14}>14 </option>
                                        <option value={15}>15 </option> 
                                        <option value={16}>16 </option>
                                        <option value={17}>17 </option>
                                        <option value={18}>18 </option> 
                                        <option value={19}>19 </option>
                                        <option value={20}>20 </option>
                                        <option value={21}>21 </option>
                                        <option value={22}>22 </option>
                                        <option value={23}>23 </option> 
                                        <option value={24}>24 </option>
                                        <option value={25}>25 </option>
                                        <option value={26}>26 </option> 
                                        <option value={27}>27 </option>
                                        <option value={28}>28 </option>
                                        <option value={29}>29 </option> 
                                        <option value={30}>30 </option>
                                        <option value={31}>31 </option>
                                        <option value={32}>32 </option>
                                        <option value={33}>33 </option>
                                        <option value={34}>34 </option>
                                        <option value={35}>35 </option>
                                        <option value={36}>36 </option>
                                </select>
                                </td>
                            </tr>
                            <tr>
                                    <td>
                                       <label>Imbal Hasil</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <input type="number" className="form-control" ref="imbalHasil" style={{width:"80px"}} placeholder="0" /><label>%</label>
                                    </div>  
                                    </td>
                            </tr>
                            <tr>
                                    <td>
                                        <label>Rentang Pengajuan</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <NumberFormat placeholder="Rp. 0" onValueChange={(values) => {this.setState({rentangDari:values.value})}} className="form-control textfield" ref="rentangDari" thousandSeparator={true} prefix={'Rp. '} />
                                        <label style={{marginLeft:"20px",marginRight:"-95px"}}> s/d </label>
                                        <NumberFormat placeholder="Rp. 0" onValueChange={(values) => {this.setState({rentangAkhir:values.value})}} className="form-control textfield" ref="rentangHingga" thousandSeparator={true} prefix={'Rp. '} />
                                    </div>
                                    </td>

                            </tr>
                            <tr>
                                <td>
                                    <label>Admin fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" ref="adminFee" style={{width:"80px"}} placeholder="0" />   <label>%</label>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Convinience Fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" ref="convinienceFee" style={{width:"80px"}} placeholder="0" />   <label>%</label>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label>Layanan</label>
                                </td>
                                <td>
                                    <select ref="layanan" className="form-control">
                                            <option value={0}>Pilih Layanan...</option>
                                           {this.renderBankService()}
                                    </select>
                                </td>

                            </tr>
                         
                            <tr>
                                <td>
                                     <label>Agunan</label>
                                </td>
                                <td>
                             
                                <div className="col-sm-10">
                            <div className="row">
                                <div className="col ">
                              

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" value="setifikat tanah" style={{marginLeft:"110px"}}/>
                                    <label className="form-check-label">Sertifikat Tanah</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" value="sertifikat rumah"/>
                                    <label className="form-check-label" >Sertifikat Rumah</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" value="bpkb kendaraan"/>
                                    <label className="form-check-label">BPKB Kendaraan</label>
                                    </div> 
                                
                                   
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" name="agunan" value="kios/lapak" style={{marginLeft:"110px"}}/>
                                    <label className="form-check-label">Kios/ Lapak</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" name="agunan" value="deposito"/>
                                    <label className="form-check-label" >Deposito</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input otheragunan" type="checkbox" value="other" />
                                    <label className="form-check-label ">Lainnya</label> 
                                    <input type="text" ref="lainnya" style={{width:"100px"}} placeholder="Lainnya.." className="form-control ml-2"/>
                                    </div> 
                                  
                                </div>
                                
                            </div>
                      
                        </div>
                       
                                    
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label >Sektor Pembiayaan</label>
                                </td>
                                <td>
                                    <Select
                                        value={this.state.selectedOption}
                                        onChange={this.handleChange}
                                        isMulti={true}
                                        options={options}
                                        styles={customStyles}
                                        placeholder="Jenis Layanan"
                                        
                                    />
                                </td>
                            </tr>
                           
                            <tr>
                                <td>
                                    <label >Asuransi</label>
                                </td>
                                <td>
                                   
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>
                                            <input className="form-check-input asuransi" type="checkbox"/>
                                            <label className="form-check-label">Tersedia</label>
                                            <input type="text" className="ml-2" ref="asuransi" placeholder="Jika ada.."></input>
                                </div> 


                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label >Status</label>
                                </td>
                                <td>
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>
                                            <input className="form-check-input messageCheckbox" type="checkbox" id="BPKB" value="koperasi"/>
                                            <label className="form-check-label">Aktif</label>
                                </div> 
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnSaveProduct}/>
                                    <input type="button" className="btn btn-warning ml-2" value="Batal" onClick={this.btnSaveProduct}/>
                               
                                </td>
                                <td>
                                <div className="form-group row">
                                        <div style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                                {this.state.errorMessage}
                                        </div>
                                            
                                </div>
                                </td>
                            </tr>
                            </tbody>
                            
                        </table>
                        
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

export default ProductAdd;