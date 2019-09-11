import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import {serverUrl} from './url'
import Moment from 'react-moment'

import axios from 'axios'

const cookie = new Cookies()

class BankDetail extends React.Component{
    state = {rows:[],layanan:["c","d","s"],produk:["a","b","c"]}
    componentDidMount(){
        this.getBankDetail()
    }

    getBankDetail = ()=>{
        var id = this.props.match.params.id
        if(cookie.get('token')){
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('token')}
              };
            axios.get(serverUrl+`admin/banks/${id}`,config)
            .then((res)=>{
                console.log(res.data)
                this.setState({rows:res.data,layanan:res.data.services,produk:res.data.products})
            })
            .catch((err)=>console.log(err))
        }
    }
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                   <h2>Bank - Detail</h2>
                   <hr/>
                   <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">ID Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.id}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tipe Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.type}
                        
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Alamat Bank</label>
                            <div className="col-sm-8">
                            : {this.state.rows.address}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Provinsi</label>
                            <div className="col-sm-8">
                            : {this.state.rows.province}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Kota</label>
                            <div className="col-sm-8">
                            : {this.state.rows.city}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Admin Fee setup</label>
                            <div className="col-sm-8">
                            : {this.state.rows.adminfee_setup}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Convinience Fee setup</label>
                            <div className="col-sm-8">
                            : {this.state.rows.convfee_setup}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Layanan</label>
                            <div className="col-sm-8">
                            : {this.state.layanan === undefined ? "-" :this.state.layanan.toString()}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Product</label>
                            <div className="col-sm-8">
                            : {this.state.produk === undefined ? "-" :this.state.produk.toString()}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama PIC</label>
                            <div className="col-sm-8">
                            : {this.state.rows.pic}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">No Telp</label>
                            <div className="col-sm-8">
                            : {this.state.rows.phone}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tanggal Bergabung</label>
                            <div className="col-sm-8">
                            :  <Moment date={this.state.rows.join_date} format=" DD  MMMM  YYYY" />                         
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=>  window.history.back()}/>
                            </label>
                            <div className="col-sm-8">
                            </div>
                        </div>
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

export default BankDetail;