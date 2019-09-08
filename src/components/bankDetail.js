import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class BankDetail extends React.Component{
    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                   <h2>Bank Details</h2>
                   <hr/>
                   
                   <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">ID Bank</label>
                            <div className="col-sm-8">
                            : BABABA

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Bank</label>
                            <div className="col-sm-8">
                            : BABABA

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tipe Bank</label>
                            <div className="col-sm-8">
                                : BABABA
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Alamat Bank</label>
                            <div className="col-sm-8">
                                 : BABABA
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Provinsi</label>
                            <div className="col-sm-8">
                                 : BABABA
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Kota</label>
                            <div className="col-sm-8">
                                 : BABABA
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Layanan</label>
                            <div className="col-sm-8">
                            : BABABA

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Product</label>
                            <div className="col-sm-8">
                            : BABABA

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama PIC</label>
                            <div className="col-sm-8">
                            : BABABA

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tanggal Bergabung</label>
                            <div className="col-sm-8">
                                 : BABABA

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
        if(cookie.get('token')){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default BankDetail;