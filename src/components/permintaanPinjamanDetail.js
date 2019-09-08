import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import {serverUrl} from './url'
import Moment from 'react-moment';

import Axios from 'axios';
import swal from 'sweetalert';
const cookie = new Cookies()

class Main extends React.Component{
    state = {rows:{},items:[],borrowerDetail:{},status:''}

    formatMoney=(number)=>
    { return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})}

    componentDidMount(){
        this.getDataDetail()
        this.getDataBorrower()

    }
    
    getDataDetail =()=>{
       var idLoan = this.props.match.params.idLoan
        if(cookie.get('tokenClient')){
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
              };
            Axios.get(serverUrl+`lender/loanrequest_list/${idLoan}/detail`,config)
            .then((res)=>{
                console.log(res.data)
                this.setState({rows:res.data,items:res.data.fees,status:res.data.status})
            })
            .catch((err)=>console.log(err))
        }
    
    }

    
   
    getDataBorrower =()=>{
        var idBorrower = this.props.match.params.idBorrower
        if (cookie.get('tokenClient')){
            var config = {
                headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
              };
              Axios.get(serverUrl+`lender/borrower_list/${idBorrower}/detail`,config)
              .then((res)=>{
                  console.log(res.data)
                  this.setState({borrowerDetail:res.data})
              })
              .catch((err)=>{
                  console.log(err)
              })
        }
        
    }
    
    btnTerimaPinjaman = ()=>{
        var idLoan = this.props.match.params.idLoan
        
        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
          };
        Axios.get(serverUrl+`/lender/loanrequest_list/${idLoan}/detail/approve`,config)
        .then((res)=>{
            swal("Permintaan","Diterima","success")
            this.setState({status:"approved"})

        })
        .catch((err)=>console.log(err))
    }

    btnTolakPinjaman = ()=>{
        var idLoan = this.props.match.params.idLoan

        var config = {
            headers: {'Authorization': "Bearer " + cookie.get('tokenClient')}
          };
        Axios.get(serverUrl+`/lender/loanrequest_list/${idLoan}/detail/reject`,config)
        .then((res)=>{
            swal("Permintaan","Ditolak","error")
            this.setState({status:"rejected"})
        })
        .catch((err)=>console.log(err))
    }

    btnBack = ()=>{
        window.history.back()
    }

    getBiayaAdmin =()=>{
        var jsx = this.state.items
        .map((val)=>{
            return (
                    <tr>
                    <td>{val.description}</td>
                    <td>: {this.formatMoney(parseInt(val.amount))}</td>
                    </tr>
            )
        })
         return jsx;
    }

    render(){
        if(cookie.get('token') && cookie.get('tokenClient')){
            return(
                <div>

                    <h2>Pinjaman - Detail</h2>
                    <hr></hr>

                    {/* -----------------------------------------------------FIRST ROW----------------------------------------------------------------- */}
                    <div className="row" style={{marginTop:"20px", background:"#f7f7f7f7"}}>
                        <div className="col-12 col-md-6">
                            <table key={this.props.match.params.idLoan}>
                                <tbody>
                                <tr>
                                    <td>ID Pinjaman</td>
                                    <td>: {this.state.rows.id}</td>
                                </tr>
                                <tr>
                                    <td>Nama Nasabah</td>
                                    <td>: {this.state.rows.owner_name}</td>
                                </tr>
                                </tbody>
                             
                            </table>

                        </div>
                        <div className="col-12 col-md-6">
                        <table key={this.props.match.params.idLoan}>
                            
                                <tbody>
                                <tr>
                                    <td>Rekening Peminjam</td>
                                    <td>: {this.state.borrowerDetail.idcard_number}</td>
                                </tr>
                                <tr>
                                    <td>Status Pinjaman</td>
                                    <td>: {
                                    this.state.status === "processing"?
                                        <label style={{color:"blue"}}>{this.state.status}</label>
                                    : this.state.status === "approved"?
                                    <label style={{color:"green"}}>{this.state.status}</label>:
                                    <label style={{color:"red"}}>{this.state.status}</label>
                                    
                                    }</td>
                                </tr>
                                </tbody>
                               
                            </table>

                        </div>
                        

                    </div>
             {/* -----------------------------------------------------SECOND ROW----------------------------------------------------------------- */}
             <div className="row mt-4" >
                        <div className="col-12 col-md-6">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Pinjaman Pokok</td>
                                    <td>: {this.formatMoney(parseInt(this.state.rows.loan_amount))}</td>
                                </tr>
                                <tr>
                                    <td>Tenor (Bulan)</td>
                                    <td>: {this.state.rows.installment}</td>
                                </tr>
                                
                                 
                                   {this.getBiayaAdmin()}
                                
                                <tr>
                                    <td>Bunga (%)</td>
                                    <td>: {this.state.rows.interest}</td>
                                </tr>
                                <tr>
                                    <td>Total Pinjaman</td>
                                    <td>: {this.formatMoney(parseInt(this.state.rows.total_loan))}</td>
                                </tr>
                                <tr>
                                    <td>Angsuran Perbulan</td>
                                    <td>: {this.formatMoney(parseInt(this.state.rows.layaway_plan))}</td>
                                </tr>
                                </tbody>
                                
                            </table>
                        </div>
                        <div className="col-12 col-md-6">
                            <table>
                                <tbody>
                                {/* <tr>
                                    <td>Product</td>
                                    <td>: {this.state.borrowerDetail.idcard_number}</td>
                                </tr>
                                <tr>
                                    <td>Layanan</td>
                                    <td>: {this.state.rows.status}</td>
                                </tr> */}
                                <tr>
                                    <td>Tujuan Pinjaman</td>
                                    <td>: {this.state.rows.loan_intention}</td>
                                </tr>
                                <tr>
                                    <td>Detail Tujuan</td>
                                    <td>: {this.state.rows.intention_details}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal Pengajuan</td>
                                    <td>: 
                                    <Moment date={this.state.rows.created_time} format=" DD  MMMM  YYYY" />
                                    {/* {String(this.state.rows.created_time).substr(0, String(this.state.rows.created_time).indexOf('T'))} */}
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td>Pinjaman Ke-</td>
                                    <td>: {this.state.rows.status}</td>
                                </tr> */}
                                </tbody>
                                
                            </table>

                        </div>
                        

                 </div>
             {/* -----------------------------------------------------THIRD ROW----------------------------------------------------------------- */}
             <h2 className="mt-4">Info Penghasilan Saat Pengajuan</h2>
            
             <div className="row">
                        <div className="col-12 col-md-12">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Pendapatan perbulan</td>
                                    <td>: {this.state.borrowerDetail.monthly_income ?
                                        this.formatMoney(parseInt(this.state.borrowerDetail.monthly_income))
                                        : 0
                                        }</td>
                                </tr>
                                <tr>
                                    <td>Penghasilan lain lain(jika ada)</td>
                                    <td>: {this.state.borrowerDetail.other_income ?
                                        this.formatMoney(parseInt(this.state.borrowerDetail.other_income)):0}</td>
                                </tr>
                                <tr>
                                    <td>Sumber Penghasilan lain lain</td>
                                    <td>: {this.state.borrowerDetail.other_incomesource}</td>
                                </tr>
                                
                               
                                </tbody>
                                
                            </table>
                        </div>
            </div>
             {/* -----------------------------------------------------FOURTH ROW----------------------------------------------------------------- */}
             <div className="row mt-3">
                        <div className="col-12 col-md-6">
                            <table>
                                <tbody>
                                    {
                                         this.state.status === "approved" || this.state.status === "rejected"? 
                                         <tr>
                                 
                                         <td>
                                             <input type="button" onClick={this.btnBack}  className="btn btn-info" value="Back"></input>
                                         </td>
                                     </tr>
                                         
                                         :
                                         <tr>
                                         <td>
                                             <input type="button" onClick={this.btnTerimaPinjaman} className="btn btn-success" value="Terima"></input>
                                         </td>
                                         <td>
                                             <input type="button" onClick={this.btnTolakPinjaman}  className="btn btn-danger ml-2" value="Tolak"></input>
                                         </td>
                                     </tr>
                                    }
                               
                                </tbody>
                                
                            </table>
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

export default Main;