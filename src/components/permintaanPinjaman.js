import React from 'react';
import axios from 'axios'
import swal from 'sweetalert'
import {connect } from 'react-redux'
import Cookie from 'universal-cookie'
import { Redirect } from 'react-router-dom'
import {serverUrl} from './url'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import QueryString from 'query-string'
import Moment from 'react-moment'



const kukie = new Cookie()


class PermintaanPinjaman extends React.Component {
  state = {
    rows: [],detailNasabah:{}, searchRows:null,
    page: 1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    totalData:0,
    last_page:1,
    loading:true
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  
  componentDidMount(){
    this.getAllData()
  }

  getAllData = ()=>{
      var config = {
        headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
      };
      var newLink =`lender/loanrequest_list`
      if (this.props.location.search){
        var hasil = this.getLink()
        if(!isNaN(hasil)){
          newLink += `?id=${hasil}&status=processing`
        }else{
          newLink += `?owner_name=${hasil}&status=processing`
        }
      }else{
        newLink += `?status=processing`
      }
      axios.get(serverUrl+newLink,config)
      .then((res)=>{
          console.log(res.data)
          this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,totalData:res.data.total_data,last_page:res.data.last_page,page:res.data.current_page})
      })
      .catch((err)=>{
          console.log(err)
      })

  }
  getLink = ()=>{
    var obj = QueryString.parse(this.props.location.search)
   return obj.query 
  }
  pushUrl = ()=>{
    var newLink ='/permintaanpinjaman/search'
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



  onBtnSearch = ()=>{
    this.pushUrl()
    var searching = this.refs.search.value
    this.setState({loading:true,searchRows:searching})
    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
    };
    var newLink =`lender/loanrequest_list`
    if(searching){
      //search function
      if(!isNaN(searching)){
        newLink +=`?id=${searching}&status=processing`
      }else{
        newLink +=`?owner_name=${searching}&status=processing`
      }
      axios.get(serverUrl+newLink,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }else{
      axios.get(serverUrl+newLink+`?status=processing`,config)
      .then((res)=>{
          this.setState({loading:false,rows:res.data.data,searchRows:null})
      })
      .catch((err)=>{
          console.log(err)
      })
    }
  }


    getDataNextPage=()=>{
      if(this.state.page===this.state.last_page){
        swal("Access Denied","Halaman Terkahir","info")
      }
      else{
        this.setState({loading:true})
        var newLink
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
        };

        if(this.state.searchRows){
          if(!isNaN(this.state.searchRows)){
            newLink +=`?id=${this.state.searchRows}&page=${this.state.page+1}&status=processing`
          }else{
            newLink +=`?owner_name=${this.state.searchRows}&page=${this.state.page+1}&status=processing`
          }

        }else{
          newLink+=`?page=${this.state.page+1}&status=processing`
        }

        axios.get(serverUrl+`lender/loanrequest_list?`+newLink,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,page:this.state.page+1})
        })
        .catch((err)=>{
            console.log(err)
        })
      }
      
    }

getDataPreviousPage=()=>{
  if(this.state.page===this.state.last_page){
    swal("Access Denied","Halaman Terkahir","info")
  }
  else{
    this.setState({loading:true})
    var newLink
    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
    };

    if(this.state.searchRows){
      if(!isNaN(this.state.searchRows)){
        newLink +=`?id=${this.state.searchRows}&page=${this.state.page-1}&status=processing`
      }else{
        newLink +=`?owner_name=${this.state.searchRows}&page=${this.state.page-1}&status=processing`
      }

    }else{
      newLink+=`?page=${this.state.page-1}&status=processing`
    }

    axios.get(serverUrl+`lender/loanrequest_list?`+newLink,config)
    .then((res)=>{
        console.log(res.data)
        this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,page:this.state.page-1})
    })
    .catch((err)=>{
        console.log(err)
    })
  }
 
}

 
  
  getNumberOfPages = ()=>{
    // const {totalData,rowsPerPage} = this.state
    // var totalPage = Math.ceil(totalData/rowsPerPage)
    var pages =[]
    if (this.state.last_page===0){
      this.setState({last_page:1})
    }
    for (var i=1;i<= this.state.last_page;i++){
        pages.push(i)
    }
    

    if(pages.length<10){
      var jsx = pages.map((val,index)=>{
        return (
            <nav key={index}>
              <p key={val} className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataBaseOnPages(val)}>{val}</p>
            </nav>
        )
    })
     return jsx;
    }
    else{
      return(
        
          <nav className="navbar">
              <p className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataBaseOnPages(1)}>1</p>
              <p className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataBaseOnPages(2)}>2</p>
              <p className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataBaseOnPages(3)}>3</p>
              <p className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataCustomePage()}>...</p>
              <p className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataCustomePage(this.state.last_page)}>{this.state.last_page}</p>
          </nav>
      )
    }
    
    
  }
//Function buat direct langsung ke halaman berapa

  getDataCustomePage =()=>{
    // const {totalData,rowsPerPage} = this.state
    // var totalPage = Math.ceil(totalData/rowsPerPage)
    swal("Halaman Berapa:", {
      content: "input",
    })
    .then((num) => {
      if(num > this.state.last_page){
        swal("error","Halaman melebihi","info")
        this.setState({loading:false})

      }else if(isNaN(num) || num<0){
        swal("error","Input Salah","error")
       this.setState({loading:false})

      }
      else{
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
        };
        var newLink
        if(this.state.searchRows){
          if(!isNaN(this.state.searchRows)){
            newLink+=`page=${num}&id=${this.state.searchRows}&status=processing`

          }else{
            newLink+=`page=${num}&owner_name=${this.state.searchRows}&status=processing`
          }
        }else{
          newLink+=`page=${num}&status=processing`
        }
        axios.get(serverUrl+`lender/loanrequest_list?`+newLink,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,totalData:res.data.total_data,page:num})
        })
        .catch((err)=>{
            console.log(err)
        })
      }
      
    });
  }

  //pagination 
  getDataBaseOnPages=(num)=>{
    this.setState({loading:true})

    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
    };
    var newLink
    if(this.state.searchRows){
      if(!isNaN(this.state.searchRows)){
        newLink+=`page=${num}&id=${this.state.searchRows}&status=processing`

      }else{
        newLink+=`page=${num}&owner_name=${this.state.searchRows}&status=processing`
      }
    }else{
      newLink+=`page=${num}&status=processing`
    }
    axios.get(serverUrl+`lender/loanrequest_list?`+newLink,config)
    .then((res)=>{
        console.log(res.data)
        this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,totalData:res.data.total_data,page:num})
    })
    .catch((err)=>{
        console.log(err)
    })
  }
  renderJSX = ()=>{
    if (this.state.loading){
      return  (
        <tr>
          <td align="center" colSpan={9}>
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
    if(this.state.rows.length===0){
      return(
        <tr>
           <td align="center" colSpan={9}>Data empty</td>
        </tr>
      )
    }else{
      var jsx = this.state.rows.map((val,index)=>{
        return (
            <tr key={index}>
              <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
              <td align="center">{val.id}</td>
              <td align="center">{val.owner_name}</td>
              <td align="center"> - </td>
              <td align="center"> - </td>
              <td align="center"> - </td>
              <td align="center"><Moment date={val.created_time} format=" DD  MMMM  YYYY" /></td>
              <td align="center">{val.status}</td>
              <td align="center">
              <Link style={{textDecoration:"none"}} to={`/permintaanpinjamanDetail/${val.id}/${val.owner.Int64}`}>
              <input type="button" className="btn btn-primary" value="Details"></input>
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
   
  
if(kukie.get("tokenClient")&&kukie.get("token")){
      
    return (
        <div className="container">
        <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">Permintaan Pinjaman</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="search" placeholder="Search Bank.." />
                            <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                            <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
                        </div>
                        </div>
                    </div>
        <hr></hr>
          <table className="table table-hover">
          <thead className="table-warning" style={{fontWeight:'bold'}}>

              <tr>
                  <th className="text-center" scope="col">#</th>
                  <th className="text-center" scope="col">Id Pinjaman</th>
                  <th className="text-center" scope="col">Nama Nasabah</th>
                  <th className="text-center" scope="col">Bank Akun</th>
                  <th className="text-center" scope="col">Layanan</th>
                  <th className="text-center" scope="col">Produk</th>
                  <th className="text-center" scope="col">Tanggal Pengajuan</th>
                  <th className="text-center" scope="col">Status Pinjaman</th>
                  <th className="text-center" scope="col">Action</th>
              </tr>     
          </thead>
            <tbody>
  
            {this.renderJSX()}
  
            </tbody>
            
          </table>
          <hr></hr>
          <nav className="navbar" style={{float:"right"}}> 
            <p className="mr-2" style={{cursor:"pointer"}} onClick={this.getDataPreviousPage}><i className="fas fa-arrow-left"></i></p> 
                {this.getNumberOfPages()} 
            <p style={{cursor:"pointer"}}  onClick={this.getDataNextPage}><i className="fas fa-arrow-right"></i></p>
          </nav>
        </div>
      

    );
  
  

}else if (kukie.get("token")){
  return  <Redirect to='/login' />
}
    
  }
}

const mapStateToProp = (state)=>{
  return{
     
      role: state.user.role,
      id: state.user.id
     
  }
  
}
export default connect (mapStateToProp)(PermintaanPinjaman) ;
