import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import './../support/css/productAdd.css'
import NumberFormat from 'react-number-format';
import axios from 'axios'
import {serverUrl} from './url'

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
        selectedOption: null, errorMessage:0,rentangDari:0,rentangAkhir:0,
        bankService:[]
      };

      componentDidMount(){
          this.getBankService()
      }
      handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

      btnSaveProduct = ()=>{
        // var service = this.refs.namaProduct.value
        // var from = this.refs.jangkaWaktuDari.value
        // var until = this.refs.jangkaWaktuSampai.value
        // var interest = this.refs.imbalHasil.value
        // var loan_min = this.state.rentangDari
        // var loan_max = this.state.rentangAkhir 
        // var asnfee = this.refs.adminFee.value
        // var convinienceFee = this.refs.convinienceFee.value
         var layanan = this.refs.layanan.value
        
        var status =  document.querySelector('.messageCheckbox').checked;
        var asuransi =  document.querySelector('.asuransi').checked;
        var otheragunan =  document.querySelector('.otheragunan').checked;


        status = status ? status = "aktif" : status ="inactive"
        asuransi = asuransi ? asuransi = this.refs.asuransi.value : asuransi=""
        otheragunan = otheragunan ? otheragunan = this.refs.lainnya.value : otheragunan =""


        //===========CODING BAGIAN SEKTOR PEMBIAYAAN

        // var sektorpembiayaan = []
        // for (var i=0 ; i < this.state.selectedOption.length; i++){
        //     sektorpembiayaan.push(this.state.selectedOption[i].value)
        // }


       //======= CODING BAGIAN AGUNAN
        var arr =[]
        var agunan = document.querySelectorAll('.agunan:checked')


        for (var i = 0; i < agunan.length; i++) {
            arr.push(agunan[i].value)   
        }
        if (otheragunan){
            arr.push(otheragunan)
        }
        
        
        console.log(layanan)




        // console.log("----- Testing -----")
        // console.log(service + " - " + from + " - "+ until + " - "+ interest +" - ")

        
        // if (parseInt(from) > parseInt(until)){
        //     alert("ga bisa")
        // } else if(parseInt(loan_min) > parseInt(loan_max)){
        //     alert("ga bisa duid")
        // }else{
        //     var time_span = until - from
        //     console.log(parseInt(time_span))
        // }




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
                 return   (<option key={index} value={val.name}>{val.name}</option>)
          })
          return jsx;
      }
  
    render(){
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
                                        <option defaultValue={0}> DARI </option>
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
                                        <option defaultValue={0}>HINGGA</option>
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
                                        <NumberFormat placeholder="Rp. 0" onValueChange={(values) => {this.setState({rentangDari:values.value})}} className="form-control textfield" ref="rentangDari" thousandSeparator={true} prefix={'Rp.'} />
                                        <label style={{marginLeft:"20px",marginRight:"-95px"}}> s/d </label>
                                        <NumberFormat placeholder="Rp. 0" onValueChange={(values) => {this.setState({rentangAkhir:values.value})}} className="form-control textfield" ref="rentangHingga" thousandSeparator={true} prefix={'Rp.'} />
                                    </div>
                                    </td>

                            </tr>
                            <tr>
                                <td>
                                    <label>Admin fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="number" className="form-control" ref="adminFee" style={{width:"80px"}} placeholder="0" />   <label>%</label>
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
                                            <option defaultValue={0}>Pilih Layanan...</option>
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
                                            <input type="text" ref="asuransi" placeholder="Masukan asuransi"></input>
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
                                <td colSpan={2}>
                                    <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnSaveProduct}/>
                                    <input type="button" className="btn btn-warning ml-2" value="Batal" onClick={this.btnSaveProduct}/>
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