import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
const cookie = new Cookies()

class ProductDetail extends React.Component{
    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div className="container">
                   <h2>Produk - Detail</h2>
                    <hr></hr>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Produk</label>
                            <div className="col-sm-8">
                            :
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jangka Waktu (Bulan)</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Imbal Hasil</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Rentang Pengajuan</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Admin Fee</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Convinence Fee</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Layanan</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Bank Pengguna</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Agunan</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Sektor Pembiayaan</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jenis Bank Pengguna</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Asuransi</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                            : 
                            </div>
                        </div>
                    </form>

                    <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=>  window.history.back()}/>
                            </label>
                            <div className="col-sm-8">

                            </div>
                        </div>
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

export default ProductDetail;