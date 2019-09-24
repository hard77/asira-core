import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import './../support/css/productEdit.css'
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

 

class ProductEdit extends React.Component{
    state = {
        selectedOption: null, errorMessage:null,rentangDari:0,rentangAkhir:0,
        collaterals:[],
        bankService:[],diKlik:false,rows:[],fees:[],bankServicebyID:{},financing_sector:[],asn_fee:'',
        agunan:["Sertifikat Tanah","Sertifikat Rumah","Kios/Lapak","Deposito","BPKB Kendaraan"]
      };

      componentDidMount(){
          this.getBankService()
          this.getProductDetailId()
        }
       
    
      getProductDetailId=()=>{
        var id = this.props.match.params.id
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
         //axios.get(serverUrl+`admin/service_products/[bank_id]`,config)
       axios.get(serverUrl+`admin/service_products/${id}`,config)
        .then((res)=>{
            
            this.setState({rows:res.data,fees:res.data.fees,asn_fee:res.data.asn_fee,
                collaterals:res.data.collaterals,
                financing_sector:res.data.financing_sector})
            if (this.state.rows.service !== undefined || this.state.rows.service !== null){
                var config = {
                    headers: {'Authorization': "Bearer " + cookie.get('token')}
                  };
                axios.get(serverUrl+`admin/bank_services/${this.state.rows.service}`,config)
                .then((res)=>{
                    console.log(res.data)
                    this.setState({bankServicebyID:res.data})
                })
                .catch((err)=> console.log(err))
            }
        })
        .catch((err)=>console.log(err)) 

    


      }
      
      handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

      renderSektorPembiayaan = ()=>{
          var jsx = this.state.financing_sector.map((val)=>{
              return(
                { value: val, label: val }
              )
          })
          return jsx
      }

      btnEditProduct = ()=>{
        var id = this.props.match.params.id
        var i
        var name = this.refs.namaProduct.value? this.refs.namaProduct.value:this.refs.namaProduct.placeholder
        var min_timespan = parseInt(this.refs.jangkaWaktuDari.value)
        var max_timespan = parseInt(this.refs.jangkaWaktuSampai.value)
        var interest = this.refs.imbalHasil.value ? parseInt(this.refs.imbalHasil.value) : parseInt(this.refs.imbalHasil.placeholder)
        var min_loan = this.state.rentangDari ? parseInt(this.state.rentangDari) : this.state.rows.min_loan
        var max_loan = this.state.rentangAkhir ? parseInt(this.state.rentangAkhir) : this.state.rows.max_loan
        var adminfee = this.refs.adminFee.value ? this.refs.adminFee.value : this.refs.adminFee.placeholder
        var asn_fee = this.refs.convinienceFee.value ? this.refs.convinienceFee.value : parseInt(this.refs.convinienceFee.placeholder)
        var service = parseInt(this.refs.layanan.value)
        
        var fees= []
        var status =  document.querySelector('.messageCheckbox').checked;
        var assurance =  document.querySelector('.asuransi').checked;
        var otheragunan =  document.querySelector('.otheragunan').checked;
       
        status = status ? status = "active" : status ="inactive"
        assurance = assurance ? assurance = this.refs.asuransi.value : assurance=""
        otheragunan = otheragunan ? otheragunan = this.refs.lainnya.value : otheragunan = ""
        if(min_timespan==="0" || max_timespan==="0"){
            this.setState({errorMessage:"Jangka Waktu Kosong"})
        }else if(parseInt(min_timespan) > parseInt(max_timespan)){
            this.setState({errorMessage:"Jangka Waktu dari lebih besar - Harap cek ulang"})
        }else if(parseFloat(interest)<0 || parseInt(interest)===0){
            this.setState({errorMessage:"Imbal Hasil tidak bole minus/ kosong - Harap cek ulang"})
        }else if(parseFloat(interest)>200){
            this.setState({errorMessage:"Imbal Hasil tidak boleh lebih dari 200 - Harap cek ulang"})
        }
        else if(parseInt(min_loan) > parseInt(max_loan)){
            this.setState({errorMessage:"Rentang Pengajuan tidak benar - Harap cek ulang"})
        }else if(parseFloat(adminfee) <0){
            this.setState({errorMessage:"Admin Fee tidak benar - Harap cek ulang"})
        }else if(parseFloat(adminfee) >100){
            this.setState({errorMessage:"Admin Fee lebih dari 100%- Harap cek ulang"})
        }else if(parseFloat(asn_fee) >100){
            this.setState({errorMessage:"Convinience Fee lebih dari 100% - Harap cek ulang"})
        }else if(parseFloat(asn_fee) <0){
            this.setState({errorMessage:"Convinience Fee tidak benar - Harap cek ulang"})
        }else if(isNaN(asn_fee)){
            this.setState({errorMessage:"Convience Fee harus angka atau desimal harus menggunakan titik (.) contoh 2.00  - Harap cek ulang"})
        }else if(isNaN(adminfee)){
            this.setState({errorMessage:"Admin Fee harus angka atau desimal harus menggunakan titik (.) contoh 2.00 - Harap cek ulang"})
        }
        else{

            asn_fee=asn_fee+"%"
            String(adminfee)
        
            
            fees.push({
                "description": "Admin Fee",
                "amount":`${adminfee}%`
            })
               //===========CODING BAGIAN SEKTOR PEMBIAYAAN

                    var financing_sector = []
                    if (this.state.selectedOption){
                        for ( i=0 ; i < this.state.selectedOption.length; i++){
                            financing_sector.push(this.state.selectedOption[i].value)
                        }
                    }else{
                        financing_sector = this.state.financing_sector
                    }
                    

                //======= CODING BAGIAN AGUNAN
                    var collaterals =[]
                    var agunan = document.querySelectorAll('.agunan:checked')

                    if (agunan.length===0){
                        collaterals=[]
                    }else{
                        for ( i = 0; i < agunan.length; i++) {
                            collaterals.push(agunan[i].value)   
                        }
                        if (otheragunan){
                            collaterals.push(otheragunan)
                        }
                    }
                    
                    collaterals.reverse()
                    
            var newData = {
                name,min_timespan,max_timespan,interest,min_loan,max_loan,fees,asn_fee,service,collaterals,financing_sector,assurance,status
            }
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
            };
            axios.patch(serverUrl+`admin/service_products/${id}`,newData,config)
            .then((res)=>{
                console.log(res.data)
                swal("Berhasil","Produk berhasil diEdit","success")
                this.setState({errorMessage:null,diKlik:true})
            })
            .catch((err)=>console.log(err))
       }
      }
      
      getBankService = ()=>{
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+'admin/bank_services',config)
        .then((res)=>{
            console.log(res.data)
            this.setState({bankService:res.data.data})
        })
        .catch((err)=> console.log(err))
      }

      getBankServiceID = ()=>{
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        axios.get(serverUrl+`admin/bank_services/${this.state.rows.service}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({bankServicebyID:res.data})
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
      renderAdminJsx =()=>{
          var jsx = this.state.fees.map((val,index)=>{
            return(
                <tr key={index}>
                <td>
                    <label>{val.description}</label>
                </td>
                <td>
                <div className="form-inline">
                    <input type="text" className="form-control" ref="adminFee" style={{width:"80px"}} defaultValue={val.amount.slice(0,val.amount.indexOf('%'))} placeholder={val.amount.slice(0,val.amount.indexOf('%'))} /><label>%</label>
                </div>
                </td>
            </tr>
            )
          })
          return jsx
      }

      renderAngunanJsx = ()=>{
        
        var jsx = this.state.agunan.map((val,index)=>{
            var dataSame= false
            for (var i=0;i < this.state.collaterals.length;i++){
                if (val === this.state.collaterals[i]){
                  dataSame= true
                }
            }
            if (dataSame) {
               return (
                    <div key={index} className="form-check form-check-inline">
                    <input defaultChecked className="form-check-input agunan" type="checkbox" value={val}/>
                    <label className="form-check-label">{val}</label>
                    </div> 
    
                ) 
            }else {
                return (
                    <div key={index} className="form-check form-check-inline">
                    <input className="form-check-input agunan" type="checkbox" value={val}/>
                    <label className="form-check-label">{val}</label>
                    </div> 
    
                ) 
            }
              
      })
      return jsx
          
      }

      renderAgunanLainJsx =()=>{
          for (var i=0; i<this.state.collaterals.length;i++){
             
                if (!this.state.agunan.includes(this.state.collaterals[i]))
                {
                    return (
                        <div className="form-check form-check-inline">
                        <input defaultChecked className="form-check-input otheragunan" type="checkbox" value="lainnya"/>
                        <label className="form-check-label">Lainnya</label>
                        <input type="text" ref="lainnya" style={{width:"200px"}} defaultValue={this.state.collaterals[i]} className="form-control ml-2"/>
                        </div> 
                    )
                }else{
                    return (
                        <div className="form-check form-check-inline">
                        <input className="form-check-input otheragunan" type="checkbox" value="lainnya"/>
                        <label className="form-check-label">Lainnya</label>
                        <input type="text" ref="lainnya" style={{width:"200px"}} placeholder="Jika ada.." className="form-control ml-2"/>
                        </div> 
                    )
                }
              }  
      }

      btnCancel=()=>{
          this.setState({diKlik:true})
      }
  
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listproduct'/>            

        }
        if(cookie.get('token')){
            return(
                <div className="container">
                    <h2 className="mb-5">Produk - Ubah</h2> 
                  <form>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>
                                   <label>Nama Produk</label>
                                </td>
                                <td>
                                   <input disabled type="text" ref="namaProduct" className="form-control textfield" placeholder={this.state.rows.name} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                   <label>Jangka Waktu (Bulan)</label>
                                </td>
                                <td>
                                <select ref="jangkaWaktuDari" className="form-control option" style={{width:"150px"}}>
                                        <option value={this.state.rows.min_timespan}>{this.state.rows.min_timespan} </option>
                                        <optgroup label="___________">                                       
                                        <option value={6}>6 </option>
                                        <option value={12}>12 </option> 
                                        <option value={18}>18 </option> 
                                        <option value={24}>24 </option>
                                        <option value={30}>30 </option>  
                                        <option value={36}>36 </option>
                                        </optgroup>
                                </select>
                                <label style={{marginLeft:"80px",marginRight:"-90px"}}> s/d </label>
                                <select  ref="jangkaWaktuSampai" className="form-control option" style={{width:"150px"}}>
                                <option value={this.state.rows.max_timespan}> {this.state.rows.max_timespan}</option>     
                                <optgroup label="___________">    
                                        <option value={6}>6 </option>
                                        <option value={12}>12 </option> 
                                        <option value={18}>18 </option> 
                                        <option value={24}>24 </option>
                                        <option value={30}>30 </option>
                                        <option value={36}>36 </option>
                                    </optgroup>  
                                </select>
                                </td>
                            </tr>
                            <tr>
                                    <td>
                                       <label>Imbal Hasil</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <input type="number" defaultValue={this.state.rows.interest} className="form-control" ref="imbalHasil" style={{width:"80px"}} placeholder="0" /><label>%</label>
                                    </div>  
                                    </td>
                            </tr>
                            <tr>
                                    <td>
                                        <label>Rentang Pengajuan</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <NumberFormat placeholder={this.state.rows.min_loan}  onValueChange={(values) => {this.setState({rentangDari:values.value})}} className="form-control textfield" ref="rentangDari" thousandSeparator={true} prefix={'Rp. '} />
                                        <label style={{marginLeft:"20px",marginRight:"-95px"}}> s/d </label>
                                        <NumberFormat placeholder={this.state.rows.max_loan} onValueChange={(values) => {this.setState({rentangAkhir:values.value})}} className="form-control textfield" ref="rentangHingga" thousandSeparator={true} prefix={'Rp. '} />
                                    </div>
                                    </td>

                            </tr>
                          {this.renderAdminJsx()}
                            <tr>
                                <td>
                                    <label>Convinience Fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" ref="convinienceFee" placeholder={this.state.asn_fee.slice(0,this.state.asn_fee.indexOf('%'))} defaultValue={this.state.asn_fee.slice(0,this.state.asn_fee.indexOf('%'))} style={{width:"80px"}}/> <label>%</label>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label>Layanan</label>
                                </td>
                                <td>
                                    <select ref="layanan" className="form-control">
                                            <option value={this.state.bankServicebyID.id}>{this.state.bankServicebyID.name} [DEFAULT]</option>
                                            <optgroup label="--------------------------------">    
                                           {this.renderBankService()}
                                           </optgroup>
                                    </select>
                                </td>

                            </tr>
                         
                            <tr>
                                <td>
                                     <label>Agunan</label>
                                </td>
                                <td>
                             
                                <div className="col-sm-10" style={{marginLeft:"105px"}}>
                        
                                {this.renderAngunanJsx()}
                                {this.state.collaterals.length===0?
                                <div className="form-check form-check-inline">
                                <input className="form-check-input otheragunan" type="checkbox" value="lainnya"/>
                                <label className="form-check-label">Lainnya</label>
                                <input type="text" ref="lainnya" style={{width:"200px"}} placeholder="Jika ada.." className="form-control ml-2"/>
                                </div> 
                                :this.renderAgunanLainJsx()}
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
                                        placeholder={this.state.financing_sector.toString()}
                                        
                                    />
                                </td>
                            </tr>
                           
                            <tr>
                                <td>
                                    <label >Asuransi</label>
                                </td>
                                <td>
                                {this.state.rows.assurance ?<div className="form-check-inline" style={{marginLeft:"125px"}}>
                                            <input className="form-check-input asuransi" type="checkbox" defaultChecked/>
                                            <label className="form-check-label">Tersedia</label>
                                            <input type="text" className="ml-2" ref="asuransi" defaultValue={this.state.rows.assurance}></input>
                                </div>  :
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>
                                <input className="form-check-input asuransi" type="checkbox"/>
                                <label className="form-check-label">Tersedia</label>
                                <input type="text" className="ml-2" ref="asuransi" placeholder="Jika ada.."></input>
                    </div> 
                                }
                                


                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label >Status</label>
                                </td>
                                <td>
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>

                                {this.state.rows.status ==="active"?<input className="form-check-input messageCheckbox" value="active" type="checkbox" defaultChecked/>   :
                        <input className="form-check-input messageCheckbox " value="active" type="checkbox"/> 
                        }
                                            <label className="form-check-label">Aktif</label>
                                </div> 
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                        
                                    <div className="form-group row">
                                            <div style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                                    {this.state.errorMessage}
                                            </div>
                                    </div>
                                    <input type="button" className="inline-block btn btn-success" value="Simpan" onClick={this.btnEditProduct}/>
                                    <input type="button" className="inline-block btn btn-warning ml-2" value="Batal" onClick={this.btnCancel}/>
                               
                                
                                </td>
                            </tr>
                            </tbody>
                            
                        </table>
                        
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

export default ProductEdit;