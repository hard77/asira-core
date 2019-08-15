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
class Main extends React.Component{
      state = {
        selectedOption: null, errorMessage: null
      };
      componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
      handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

    btnSaveBank =()=>{
        var arr = []
        // console.log(this.refs.namaBank.value)
        // console.log(this.refs.tipeBank.value)
        // console.log(this.refs.alamat.value)
        // console.log(this.refs.provinsi.value)
        // console.log(this.refs.kota.value)
        // console.log(this.refs.layanan.value)
        //console.log(this.state.selectedOption)
       

        // if(this.refs.namaBank.value === "" || this.refs.tipeBank.value ==="0" || this.refs.alamat.value ==="" ||
        // this.refs.provinsi.value==="0" || this.refs.kota.value==="0" || this.refs.PIC.value ==="" || this.refs.telp.value===""){
        //     this.setState({errorMessage:"Data masih ada yang kosong"})
        // }else{
        //     this.setState({errorMessage:null})
        //   alert("gas axios kl ke isi semua")
        // }
      
        for (var i=0; i<this.state.selectedOption.length;i++){
            arr.push (this.state.selectedOption[i].value)
        }
        
        console.log(arr)
      



    }
    render(){
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
                                <option value={1}>One</option>
                                <option value={2}>Two</option>
                                <option value={3}>Three</option>
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
                        <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnSaveBank}/>
                        <input type="button" className="btn btn-secondary ml-2" value="Batal" />


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