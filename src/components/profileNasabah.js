import React from 'react';
import axios from 'axios'

import Loader from 'react-loader-spinner'
import Moment from 'react-moment';
import {connect } from 'react-redux'
import Cookie from 'universal-cookie'
import { Redirect } from 'react-router-dom'
import QueryString from 'query-string'
import {serverUrlBorrower} from './url'
import {Link} from 'react-router-dom'
import Pagination from 'rc-pagination';
import './../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID';
const kukie = new Cookie()
const config = {
  headers: {'Authorization': "Bearer " + kukie.get('token')}
};
class profileNasabah extends React.Component {
  state = {
    rows: [], searchRows:null,
    page: 1,
    rowsPerPage: 5,
    isEdit: false,
    editIndex:Number,
    totalData:0,
    last_page:1,
    loading:true,
    bankID:0,bankName:''
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  componentDidMount(){
    this.getAllData()
  }

  pushUrl = ()=>{
    var newLink ='/profileNasabah/search'
    var params =[]
    //categoryDropdown,search
    if(this.refs.search.value){
        params.push({
            params:'query',
            value:this.refs.search.value
        })
    }
    

    for (var i=0;i<params.length;i++){
        if(i===0){
            newLink += '?'+params[i].params+ '='+ params[i].value
        }else{
            newLink += '&'+params[i].params+ '='+ params[i].value
        }
    }
    this.props.history.push(newLink)
}
//GET LINK
getLink = ()=>{
  var obj = QueryString.parse(this.props.location.search)
 return obj.query 
}
  
  //Ambil data pertama kali
  getAllData = ()=>{
   var newLink='admin/borrower'
   
    if (this.props.location.search){
      var hasil = this.getLink()
      if(!isNaN(hasil)){
        newLink += `?id=${hasil}`
      }else{
        newLink += `?fullname=${hasil}`
      }
    }
    axios.get(serverUrlBorrower+newLink,config)
    .then((res)=>{
      console.log(res.data)
        this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,jumlahBaris:null,totalData:res.data.total_data,last_page:res.data.last_page,page:res.data.current_page})
    })
    .catch((err)=>{
        console.log(err)
    })
}

  onBtnSearch = ()=>{
    
    var searching = this.refs.search.value
    this.setState({loading:true,searchRows:searching})
    this.pushUrl()
    var newLink=''
    if(searching){
      //search function
    
      if(!isNaN(searching)){
        newLink += `admin/borrower?id=${searching}`
       
      }else{
        newLink += `admin/borrower?fullname=${searching}`
      }

     
    }else{
      newLink += `admin/borrower`
      
    }
    axios.get(serverUrlBorrower+newLink,config)
      .then((res)=>{
          this.setState({loading:false,rows:res.data.data,searchRows:null})
      })
      .catch((err)=>{
          console.log(err)
      })
  }

 
 
 // rpp =5
 // p = 3
 // index = 11

 onChangePage = (current, pageSize) => {
  this.setState({loading:true})
  console.log('onChange:current=', current);
  console.log('onChange:pageSize=', pageSize);

  var newLink =`page=${current}`
  axios.get(serverUrlBorrower+`admin/borrower?`+newLink,config)
  .then((res)=>{
      console.log(res.data)
      this.setState({loading:false,rows:res.data.data,dataPerhalaman:res.data.rows,page:current})
  })
  .catch((err)=>{
      console.log(err)
  })
}
  
  renderJSX = ()=>{
    if (this.state.loading){
      return  (
        <tr>
          <td align="center" colSpan={6}>
                <Loader 
            type="Circles"
            color="#00BFFF"
            height="40"	
            width="40"
        />   
          </td>
        </tr>
      )
      
      
   
  }else{
    if (this.state.rows.length===0){
      return(
        <tr>
          <td align="center" colSpan={6}>Data empty</td>
        </tr>
      )
    }else{
      var jsx = this.state.rows.map((val,index)=>{
        return (
        <tr key={index}>
            <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
            <td align="center">{val.id}</td>
            <td align="center">{val.fullname}</td>
            {/* <td align="center">{this.getBankName(val.bank.Int64)}</td>             */}
            <td align="center"><Moment date={val.created_time} format=" DD  MMMM  YYYY" /></td>
            {/* <TableCell align="center">{val.status}</TableCell> */}
            <td align="center">
            <Link style={{textDecoration:"none"}} to={`/profileNasabahDetail/${val.id}`}>
              <i className="fas fa-eye" style={{color:"black",fontSize:"28px",marginRight:"10px"}}/>
            </Link>
            </td>
        </tr>
        )
    })
     return jsx;
    }
    
  }

     
  }
    
  render() {
   

if(kukie.get("token")){
    return (
        <div className="container">
         <div className="row">
                        <div className="col-6">
                             <h2 className="mt-3">Nasabah - List</h2>
                        </div>
                        <div className="col-5 mt-3 ml-5">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="search" placeholder="Search.." style={{width:"150px"}} />
                            <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                            <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
                        </div>
                        </div>
          </div>
        <hr></hr>
          <table className="table table-hover">
          <thead className="table-warning">
              <tr>
                  <th className="text-center" scope="col">#</th>
                  <th className="text-center" scope="col">Id Nasabah</th>
                  <th className="text-center" scope="col">Nama Nasabah</th>
                  {/* <th className="text-center" scope="col">Bank Akun</th> */}
                  <th  className="text-center" scope="col">Tanggal Registrasi</th>
                  {/* <TableCell align="center">Status Nasabah</TableCell> */}
                  <th  className="text-center" scope="col">Action</th>
                 
              </tr>     
          </thead>
            <tbody>
              {this.renderJSX()}
 </tbody>  
          </table>
                <hr/>
          <nav className="navbar" style={{float:"right"}}> 
                <Pagination className="ant-pagination"  
                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                total={this.state.totalData}
                pageSize={25}
                onChange={this.onChangePage}
                locale={localeInfo}
                />     
          </nav>
        </div>
    );

}else if (!kukie.get("token")){
  return  <Redirect to='/login' />
}
    
  }
}


const mapStateToProp = (state)=>{
  return{     
      id: state.user.id
  }
  
}
export default connect (mapStateToProp)(profileNasabah) ;