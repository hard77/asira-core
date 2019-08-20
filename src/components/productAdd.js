import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import './../support/css/productAdd.css'

const cookie = new Cookies()
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
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
        selectedOption: null,
      };
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };
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
                                        <input type="text" className="form-control" ref="bunga" style={{width:"80px"}} placeholder="" /><label className="ml-2">%</label>
                                    </div>  
                                    </td>
                            </tr>
                            <tr>
                                    <td>
                                        <label>Rentang Pengajuan</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <input type="text" className="form-control textfield" ref="moneyFrom" placeholder="" />
                                        <label style={{marginLeft:"20px",marginRight:"-95px"}}> s/d </label>
                                        <input type="text" className="form-control textfield" ref="moneyTo" placeholder="" /> 
                                    </div>
                                    </td>

                            </tr>
                            <tr>
                                <td>
                                    <label>Admin fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" ref="adminFee" style={{width:"80px"}} placeholder="" />   <label>%</label>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Convinience Fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" ref="convinienceFee" style={{width:"80px"}} placeholder="" />   <label>%</label>
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
                                            <option value={1}>1 </option>
                                            <option value={2}>2 </option>
                                    </select>
                                </td>

                            </tr>
                            <tr>
                                 <td>
                                    <label>Bank Pengguna</label>
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
                                     <label>Angunan</label>
                                </td>
                                <td>
                                <div className="col-sm-10">
                            <div className="row">
                                <div className="col ">
                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" value="option1" style={{marginLeft:"110px"}}/>
                                    <label className="form-check-label">Sertifikat Tanah</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                                    <label className="form-check-label" >Sertifikat Rumah</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="BPKB" value="option1"/>
                                    <label className="form-check-label">BPKB Kendaraan</label>
                                    </div> 
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" style={{marginLeft:"110px"}}/>
                                    <label className="form-check-label">Kios/ Lapak</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                                    <label className="form-check-label" >Deposito</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="BPKB" value="option1"/>
                                    <label className="form-check-label">Lainnya</label> 
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
                                    <label >Jenis Bank Pengguna</label>
                                </td>
                                <td>
                                    <div className="row">
                                        <div className="col ml-3">
                                            <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" value="bpd" style={{marginLeft:"110px"}}/>
                                            <label className="form-check-label">BPD</label>
                                            </div>

                                            <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="bpr"/>
                                            <label className="form-check-label" >BPR</label>
                                            </div>

                                            <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" id="BPKB" value="koperasi"/>
                                            <label className="form-check-label">Koperasi</label>
                                            </div> 
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label >Asuransi</label>
                                </td>
                                <td>
                                   
                                <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" id="BPKB" value="koperasi"/>
                                            <label className="form-check-label">Koperasi</label>
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