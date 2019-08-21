import React from 'react';
import './App.css';
import {Route,withRouter,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'
import {serverUrl} from './components/url'
import {serverUrlBorrower} from './components/url'

import Testing from './components/testing'

import PageNotFound from './components/404'

import TambahBank from './components/bankAdd'
import ListBank from './components/bankList'
import EditBank from './components/bankEdit'
import DetailBank from './components/bankDetail'



import LayananAdd from './components/layananAdd'
import LayananList from './components/layananList'


import Login from './components/login'
import Home from './components/main'
import Nasabah from './components/profileNasabah'
import ScrollTop from './components/scrollToTop'
import Header from './components/header'
import profileNasabahDetail from './components/profileNasabahDetail'
import PermintaanPinjaman from './components/permintaanPinjaman'
import PermintaanPinjamanDetail from './components/permintaanPinjamanDetail'
import PinjamanSetuju from './components/pinjamanSetuju'
import PinjamanRejected from './components/pinjamanRejected'

import ProductAdd from './components/productAdd'
import ProductList from './components/productList'

import Cookies from 'universal-cookie';
import axios from 'axios'

const kukie =new Cookies()
var tokenClient = kukie.get("tokenClient")

class App extends React.Component {
  state ={loading : true , tokenClient : null , Token : null}
 componentDidMount(){
  this.getAuth()
  this.getAuthBorrower()

  if (tokenClient){
   this.props.keepLogin()
   }

  }


  getAuthBorrower =()=>{
    var urlBorrow = serverUrlBorrower+"clientauth"
    axios.get(urlBorrow ,{
      auth : {
          username : 'androkey',
          password : 'androsecret'
      }
  })
      .then((res)=>{
          var date = new Date();
          date.setTime(date.getTime() + (res.data.expires*1000));
          kukie.set('tokenBorrower',res.data.token,{expires: date})
          
         
      })
      .catch((err)=>{
        console.log(err)
      }
         
      )
  }
 getAuth = ()=>{
  var url =serverUrl+"clientauth"
  axios.get(url ,{
      auth : {
          username : 'reactkey',
          password : 'reactpass'
      }
  })
      .then((res)=>{
          var date = new Date();
          date.setTime(date.getTime() + (res.data.expires*1000));
          kukie.set('token',res.data.token,{expires: date})
          this.setState({loading : false})
         
      })
      .catch((err)=>{
        console.log(err)
        setTimeout(function(){ alert("Coba reload halaman/ cek koneksi internet"); }, 2000);
      }
         
      )
}


  render() {
    if(this.state.loading){
      return(
        <p> loading ....</p>
      )
    }
    
      return (
      
        <div>
          <ScrollTop>
            <div className="row">
            {
                kukie.get('tokenClient') ? 
              <div className="col-2 col-md-3">
              <Header/>
              </div>
              :
              null
            }
              <div className="col-10 col-md-9">
              <Switch> 
                    <Route path='/test' component={Testing}></Route>
                    <Route path='/' component={Home} exact></Route>
                    <Route path='/profileNasabah' component={Nasabah}></Route>
                    <Route path="/profileNasabahDetail/:id" component={profileNasabahDetail}></Route>
                    <Route path="/permintaanpinjaman" component={PermintaanPinjaman}></Route>
                    <Route path="/permintaanpinjamanDetail/:idLoan/:idBorrower" component={PermintaanPinjamanDetail}></Route>
                    <Route path='/pinjamansetuju' component={PinjamanSetuju}></Route>
                    <Route path='/pinjamanrejected' component={PinjamanRejected}></Route>

                    <Route path='/tambahbank' component={TambahBank}></Route>
                    <Route path='/listbank' component={ListBank}></Route>
                    <Route path='/bankedit/:id' component={EditBank}></Route>
                    <Route path='/bankdetail/:id' component={DetailBank}></Route>

                    <Route path='/tambahproduct' component={ProductAdd}></Route>
                    <Route path='/listproduct' component={ProductList}></Route>
                  

                    <Route path='/tambahlayanan' component={LayananAdd}></Route>
                    <Route path='/listlayanan' component={LayananList}></Route>


                    


                    {kukie.get('tokenClient') ?  <Route path="/login" component={Home}></Route>:  <Route path="/login" component={Login}></Route>} 

                    <Route path='*' component={PageNotFound} />
              </Switch>
              </div>
            </div>
          </ScrollTop>
        </div>
     
         );
    
  
     
 
  }
}
  
const mapStateToProps = (state)=>{
  return {
      id : state.user.id

  }
}

export default withRouter(connect(mapStateToProps,{keepLogin}) (App));


