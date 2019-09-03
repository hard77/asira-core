import React from 'react';
import axios from 'axios'
import swal from 'sweetalert'

import Loader from 'react-loader-spinner'
import Moment from 'react-moment';
import {connect } from 'react-redux'
import Cookie from 'universal-cookie'
import { Redirect } from 'react-router-dom'
import QueryString from 'query-string'
import {serverUrlBorrower} from './url'
import {Link} from 'react-router-dom'

const kukie = new Cookie()

class profileNasabah extends React.Component {
  state = {
    rows: [], searchRows:null,
    page: 1,
    rowsPerPage: 5,
    isEdit: false,
    editIndex:Number,
    totalData:0,
    last_page:1,
    loading:true
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
    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('token')}
    };
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

  getDataNextPage=()=>{
    
    if(this.state.page===this.state.last_page){
      swal("Access Denied","Halaman Terkahir","info")
    }else{
      this.setState({loading:true})
      var newLink=""
      var config = {
        headers: {'Authorization': "Bearer " + kukie.get('token')}
      };
      if(this.state.searchRows){
          if(!isNaN(this.state.searchRows)){
            newLink+=`id=${this.state.searchRows}&page=${this.state.page+1}`
          }else{
            newLink+=`fullname=${this.state.searchRows}&page=${this.state.page+1}`
          }
      }else{
        newLink =`page=${this.state.page+1}`
      }
  
        axios.get(serverUrlBorrower+`admin/borrower?`+newLink,config)
        .then((res)=>{
          
            this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,page:this.state.page+1})
        })
        .catch((err)=>{
            console.log(err)
        })
    }
   
   
  }

  getDataPreviousPage=()=>{

    if (this.state.page===1){
      swal("Access Denied","Halaman Terkahir","info")
      this.setState({page:1,loading:false})
    }else{
      var newLink=""
      this.setState({loading:true})
      var config = {
        headers: {'Authorization': "Bearer " + kukie.get('token')}
      };
      if(this.state.searchRows){
        if (!isNaN(this.state.searchRows)){
          newLink += `id=${this.state.searchRows}&page=${this.state.page-1}`
        }else{
          newLink += `fullname=${this.state.searchRows}&page=${this.state.page-1}`
        }
      }else{
        newLink+=`page=${this.state.page-1}`
      }
      axios.get(serverUrlBorrower+`admin/borrower?`+newLink,config)
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
              <p className="mr-2" style={this.state.page === val ?
                {border:"1px solid black",backgroundColor="#F1E8E7",width:"25px",textAlign:"center",cursor:"pointer"}:
                {border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}
                }onClick={()=>this.getDataBaseOnPages(val)}>{val}</p>
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
    var newLink=""
    this.setState({loading:true})
    swal("Halaman Berapa:", {
      content: "input",
    })
    .then((num) => {
      if(num > this.state.last_page){
        swal("error","Halaman melebihi","error")
        this.setState({loading:false})
      }else if(isNaN(num) || num<0){
        swal("error","Invalid Input","error")
        this.setState({loading:false})
      }
      else{
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('token')}
        };
        if(this.state.searchRows){
          if(!isNaN(this.state.searchRows)){
            newLink+=`page=${num}&id=${this.state.searchRows}`

          }else{
            newLink+=`page=${num}&fullname=${this.state.searchRows}`
          }
        }else{
          newLink+=`page=${num}`
        }
        axios.get(serverUrlBorrower+`admin/borrower?`+newLink,config)
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
    var newLink=""
    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('token')}
    };
    if(this.state.searchRows){
      if(!isNaN(this.state.searchRows)){
        newLink+=`page=${num}&id=${this.state.searchRows}`

      }else{
        newLink+=`page=${num}&fullname=${this.state.searchRows}`
      }
    }else{
      newLink+=`page=${num}`
    }

    axios.get(serverUrlBorrower+`admin/borrower?`+newLink,config)
    .then((res)=>{
        console.log(res.data)
        this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,totalData:res.data.total_data,page:num})
    })
    .catch((err)=>{
        console.log(err)
    })
  }


  onBtnSearch = ()=>{
    
    var searching = this.refs.search.value
    this.setState({loading:true,searchRows:searching})
    this.pushUrl()
    if(searching){
      //search function
    
      if(!isNaN(searching)){
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('token')}
        };
        axios.get(serverUrlBorrower+`admin/borrower?id=${searching}`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data})
        })
        .catch((err)=>{
            console.log(err)
        })
      }else{
       
       config = {
         headers: {'Authorization': "Bearer " + kukie.get('token')}
       };
       axios.get(serverUrlBorrower+`admin/borrower?fullname=${searching}`,config)
       .then((res)=>{
           console.log(res.data)
           this.setState({loading:false,rows:res.data.data,searchRows:null})
       })
       .catch((err)=>{
           console.log(err)
       })
      }

     
    }else{
      config = {
        headers: {'Authorization': "Bearer " + kukie.get('token')}
      };
      axios.get(serverUrlBorrower+`admin/borrower`,config)
      .then((res)=>{
          this.setState({loading:false,rows:res.data.data,searchRows:null})
      })
      .catch((err)=>{
          console.log(err)
      })
    }
  }

 
 
 // rpp =5
 // p = 3
 // index = 11
  
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
                <p className="mr-2" style={{cursor:"pointer"}} onClick={this.getDataPreviousPage}><i className="fas fa-arrow-left"></i></p> 
                {this.getNumberOfPages()} 
                <p style={{cursor:"pointer"}}  onClick={this.getDataNextPage}><i className="fas fa-arrow-right"></i></p>
               
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