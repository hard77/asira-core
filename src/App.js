import React from 'react';
import './App.css';
import {Route, Router, withRouter,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'


import Testing from './components/testing'

import PageNotFound from './components/404'

import TambahBank from './components/bankAdd'
import ListBank from './components/bankList'
import EditBank from './components/bankEdit'
import DetailBank from './components/bankDetail'


import LayananEdit from './components/layananEdit'
import LayananAdd from './components/layananAdd'
import LayananList from './components/layananList'
import LayananDetail from './components/layananDetail'


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
import ProductDetail from './components/productDetail'

import ProductEdit from './components/productEdit'
import Cookies from 'universal-cookie';


const kukie =new Cookies()


class App extends React.Component {
  state ={loading : true , tokenClient : null , Token : null}
  render() {  
      return (
      
        <div>
          <ScrollTop>
            <div className="row">
            {
                kukie.get('token') ? 
              <div className="col-2 col-md-3">
              <Header/>
              </div>
              :
              null
            }
              <div className="col-10 col-md-9">
              <Switch> 
                <Router basename={'/api-core'}>

                
                    <Route path='/test' component={Testing}></Route>
                    <Route path={`${process.env.PUBLIC_URL}/`} component={Home} />
                    <Route path={`${process.env.PUBLIC_URL}/profileNasabah`} component={Nasabah} />
                    <Route path={`${process.env.PUBLIC_URL}/profileNasabahDetail/:id`} component={profileNasabahDetail} />
                    <Route path={`${process.env.PUBLIC_URL}/permintaanpinjaman`} component={PermintaanPinjaman} />
                    <Route path={`${process.env.PUBLIC_URL}/permintaanpinjamanDetail/:idLoan/:idBorrower`} component={PermintaanPinjamanDetail} />
                    <Route path={`${process.env.PUBLIC_URL}/pinjamansetuju`} component={PinjamanSetuju} />
                    <Route path={`${process.env.PUBLIC_URL}/pinjamanrejected`} component={PinjamanRejected} />

                    <Route path={`${process.env.PUBLIC_URL}/tambahbank`} component={TambahBank} />
                    <Route path={`${process.env.PUBLIC_URL}/listbank`} component={ListBank} />
                    <Route path={`${process.env.PUBLIC_URL}/bankedit/:id`} component={EditBank} />
                    <Route path={`${process.env.PUBLIC_URL}/bankdetail/:id`} component={DetailBank} />

                    <Route path={`${process.env.PUBLIC_URL}/tambahproduct`} component={ProductAdd} />
                    <Route path={`${process.env.PUBLIC_URL}/listproduct`} component={ProductList} />
    
                    <Route path={`${process.env.PUBLIC_URL}/tambahlayanan`} component={LayananAdd} />
                    <Route path={`${process.env.PUBLIC_URL}/listlayanan`} component={LayananList} />


                    {kukie.get('token') ?      <Route path={`${process.env.PUBLIC_URL}/login`} component={Home} />:       <Route path={`${process.env.PUBLIC_URL}/login`} component={Login} />} 

                    <Route path={`${process.env.PUBLIC_URL}/*`} component={PageNotFound} />
                  
                    </Router>
              </Switch>
              {/* <Switch> 
                

                
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
                    <Route path='/productdetail/:id' component={ProductDetail}></Route>
                  
                    <Route path='/layananedit/:id' component={LayananEdit}></Route>
                    <Route path='/productedit/:id' component={ProductEdit}></Route>
                    <Route path='/tambahlayanan' component={LayananAdd}></Route>
                    <Route path='/listlayanan' component={LayananList}></Route>
                    <Route path='/layanandetail/:id' component={LayananDetail}></Route>



                    


                    {kukie.get('token') ?  <Route path="/login" component={Home}></Route>:  <Route path="/login" component={Login}></Route>} 

                    <Route path='*' component={PageNotFound} />
                  
              </Switch> */}
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


