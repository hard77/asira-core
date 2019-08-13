import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Select from 'react-select';

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
                    <h2>Product Tambah</h2>
                    <hr></hr>

                    <form>
                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Nama Produk</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" ref="namaProduct" placeholder="Input Nama Produk" />
                        </div>
                        </div>
                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Jangka Waktu</label>
                            <div className="col-sm-10 form-inline" >
                                <select ref="jangkaWaktu" className="form-control" style={{width:"80px"}}>
                                        <option defaultValue={0}>...</option>
                                        <option value={1}>1 </option>
                                        <option value={2}>2 </option>
                                        <option value={3}>3 </option>
                                        <option value={4}>4 </option>
                                        <option value={5}>5 </option>
                                        <option value={6}>6 </option>
                                        <option value={7}>7 </option>
                                        <option value={8}>8 </option>
                                        <option value={9}>9 </option>
                                        <option value={10}>10 </option>
                                        <option value={11}>11 </option>
                                        <option value={12}>12 </option> 
                                </select>
                                <label className="ml-2">Bulan</label>
                            </div>
                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Bunga/ Imbal Hasil</label>
                        <div className="col-sm-10 form-inline">
                            <input type="text" className="form-control" ref="bunga" style={{width:"80px"}} placeholder="" /> 
                            <label className="ml-2">%</label>
                       
                        </div>
                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Rentang Pengajuan</label>
                        <div className="col-sm-10 form-inline">
                            <input type="text" className="form-control" ref="moneyFrom" style={{width:"300px"}} placeholder="" />
                            <label className="ml-5"> s/d </label>
                            <input type="text" className="form-control" ref="moneyTo" style={{width:"300px"}} placeholder="" /> 
                        </div>
                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Admin fee</label>
                        <div className="col-sm-10 form-inline">
                            <input type="text" className="form-control" ref="adminFee" style={{width:"80px"}} placeholder="" /> 
                            <label className="ml-2">%</label>
                       
                        </div>
                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Convinience Fee</label>
                        <div className="col-sm-10 form-inline">
                            <input type="text" className="form-control" ref="convinienceFee" style={{width:"80px"}} placeholder="" /> 
                            <label className="ml-2">%</label>
                       
                        </div>
                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Layanan</label>
                        <div className="col-sm-10">
                               <select ref="layanan" className="form-control">
                                        <option defaultValue={0}>Pilih Layanan...</option>
                                        <option value={1}>1 </option>
                                        <option value={2}>2 </option>
                                </select>
                        </div>
                        </div>
                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Bank Pengguna</label>
                        <div className="col-sm-10">
                        <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                isMulti={true}
                                options={options}
                                styles={customStyles}
                                placeholder="Jenis Layanan"
                                
                            />
                        </div>
                        </div>
                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Angunan</label>
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
                                    <label className="form-check-label" >Kios/ Lapak</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                                    <label className="form-check-label" >Deposito</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" id="BPKB" value="option1"/>
                                    <label className="form-check-label">Lainnya</label> 
                                    <input type="text" ref="lainnya" placeholder="Lainnya.." className="form-control ml-2"/>
                                    </div> 
                                </div>
                            </div>
                      

                        </div>
                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Sektor Pembiayaan</label>
                        <div className="col-sm-10">
                        <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                isMulti={true}
                                options={options}
                                styles={customStyles}
                                placeholder="Jenis Layanan"
                                
                            />

                        </div>
                        </div>


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