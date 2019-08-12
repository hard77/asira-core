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

class BankDetail extends React.Component{
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
                   <h2>Bank Details</h2>
                   <hr/>
                   
                   <form>
                       <fieldset disabled>
                       <div className="form-group row">
                            <label className="col-sm-2 col-form-label">ID Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="idBank" defaultValue="ID Bank" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="namaBank" defaultValue="Nama Bank"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tipe Bank</label>
                            <div className="col-sm-10">
                            <input type="text" id="disabledTextInput" className="form-control" ref="tipeBank"  defaultValue="Type Bank"/>
                            </div>
                        </div>
                       </fieldset>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Alamat Bank</label>
                            <div className="col-sm-10">
                            <textarea rows="6" ref="alamat" defaultValue="hehe" className="form-control"  placeholder="Description" required autoFocus/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Provinsi</label>
                            <div className="col-sm-10">
                            <select ref="provinsi" className="form-control">
                                <option defaultValue={0}>Choose...</option>
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
                                <option defaultValue={0}>Choose...</option>
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
                            <label className="col-sm-2 col-form-label">Jenis Produk</label>
                            <div className="col-sm-10">
                                <div>
                                <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
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
                            <input type="text" className="form-control" ref="PIC" placeholder="Input Nama PIC.." />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                            <input type="number" className="form-control" ref="telp" placeholder="Nomor telp" />                                                        
                            </div>
                        </div>
                        <input type="button" className="btn btn-success" value="Update" onClick={this.btnSaveBank}/>
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

export default BankDetail;