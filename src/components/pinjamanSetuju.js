import React from 'react';

import axios from 'axios'

import DatePicker from "react-date-picker";
import swal from 'sweetalert'
import { CSVLink } from "react-csv";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Loader from 'react-loader-spinner'


import "react-datepicker/dist/react-datepicker.css";

import {connect } from 'react-redux'
import Cookie from 'universal-cookie'
import { Redirect } from 'react-router-dom'

import {serverUrl} from './url'
import {Link} from 'react-router-dom'



const kukie = new Cookie()
var arr=[]
class PinjamanSetuju extends React.Component {
   

  state = {
    rows: [],fromDate:null,toDate:null,
    page: 1,last_page:1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    startDate: new Date() ,endDate: new Date(),
    downloadDataCSV: [],downloadModal:false,
    totalData:0,
    loading:true,loadingBtn:false
    
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  
  componentDidMount(){
    this.getAllData()
  }

  
  getAllData = ()=>{
      var config = {
        headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
      };
      axios.get(serverUrl+`lender/loanrequest_list?status=approved`,config)
      .then((res)=>{
          console.log(res.data)
          this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,page:res.data.current_page,last_page:res.data.last_page,totalData:res.data.total_data})

      })
      .catch((err)=>{
          console.log(err)
      })
  }

//   pushUrl = ()=>{
//     var newLink ='/pinjamansetuju/search'
//     var params =[]
//     //categoryDropdown,search
//     if(this.state.fromDate && this.state.toDate){
//         params.push({
//             params:'fromDate',
//             value:this.state.fromDate
//         },{
//           params:'toDate',
//           value:this.state.toDate
//       })
//     }
    

//     for (var i=0;i<params.length;i++){
//         if(i===0){
//             newLink += '?'+params[i].params+ '='+ params[i].value
//         }else{
//             newLink += '&'+params[i].params+ '='+ params[i].value
//         }
//     }
//     this.props.history.push(newLink)
// }

  //UNTUK TANGGAL 
  handleStartChange = (date)=> {
    this.setState({
      startDate: date
    });
  }
  handleEndChange = (date)=> {
    this.setState({
      endDate: date
    });
  }
  
  onBtnSearch = ()=>{
    
    this.setState({loading:true})
    const {startDate, endDate} = this.state

      var startMonth =''+ (startDate.getMonth()+1),
      startDay = '' + startDate.getDate(),
      startYear = startDate.getFullYear();

      var endMonth =''+ (endDate.getMonth()+1),
      endDay = '' + endDate.getDate(),
      endYear = endDate.getFullYear();

      if (startMonth.length < 2) startMonth = '0' + startMonth;
      if (startDay.length < 2) startDay = '0' + startDay;

      if (endMonth.length < 2) endMonth = '0' + endMonth;
      if (endDay.length < 2) endDay = '0' + endDay;
      
      var newFormatStartDate = startYear+"-"+startMonth+"-"+startDay+"T00:00:00.000Z"
      var newFormatEndDate = endYear+"-"+endMonth+"-"+endDay+"T23:59:59.000Z"

      if(endDate.getTime() < startDate.getTime() ){
        alert("Please input correct month range")
        this.setState({loading:false})
      }
      else{
  
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
        };
        axios.get(serverUrl+`lender/loanrequest_list?rows=1000&start_date=${newFormatStartDate}&end_date=${newFormatEndDate}&status=approved`,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,fromDate:newFormatStartDate,toDate:newFormatEndDate})
        })
        .catch((err)=>{
            console.log(err)
        })

      }


  }

  onBtnReset =()=>{
    this.setState({loading:true})
   
    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
    };
    axios.get(serverUrl+`lender/loanrequest_list?&status=approved`,config)
    .then((res)=>{
        console.log(res.data)
        this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,fromDate:null,toDate:null})
    })
    .catch((err)=>{
        console.log(err)
    })

  }
  
//BUAT DOWNLOAD CSV
  btnDownloadCsv = ()=>{
    this.setState({loadingBtn:true})
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    for (var i = 0; i < checkboxes.length; i++) {
    arr.push(checkboxes[i].value)
    }

    if (arr.length===0){
      swal("Info","Silahkan Pilih Data yang ingin di download","info")
      this.setState({loadingBtn:false})
    }else{
      for (var j=0;j<arr.length;j++){
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
        };
        axios.get(serverUrl+`lender/loanrequest_list?id=${arr[j]}&sort=asc&status=approved`,config)
        
        .then((res)=>{
            this.setState({loadingBtn:false,downloadModal:true,downloadDataCSV:[...this.state.downloadDataCSV,...res.data.data]})
            
          })
        .catch((err)=>{
            console.log(err)
        })

      }
    }
    

  }
 //---------------------------------PAGINATION------------------------------------------------------

getDataNextPage=()=>{
    // const {totalData,rowsPerPage} = this.state
    // var totalPage = Math.ceil(totalData/rowsPerPage)
    if(this.state.page === this.state.last_page){
       alert('Halaman Terakhir')
    }else{
      this.setState({loading:true})
      var newLink
      var config = {
        headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
      };
      if(this.state.toDate && this.state.fromDate){
        newLink+= `rows=1000&page=${this.state.page+1}&status=approved&start_date=${this.state.fromDate}&end_date=${this.state.toDate}`
      }else{
        newLink+= `rows=${this.state.page}&page=${this.state.page+1}&status=approved`
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
    if(this.state.page === this.state.last_page){
      alert('Halaman Terakhir')
  }else{
    this.setState({loading:true})
    var newLink
    var config = {
      headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
    };
    if(this.state.toDate && this.state.fromDate){
      newLink+= `rows=1000&page=${this.state.page-1}&status=approved&start_date=${this.state.fromDate}&end_date=${this.state.toDate}`
    }else{
      newLink+= `rows=${this.state.page}&page=${this.state.page-1}&status=approved`
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
              <p className="mr-2" style={{border:"1px solid black",width:"25px",textAlign:"center",cursor:"pointer"}}onClick={()=>this.getDataBaseOnPages(val)}>{val}</p>
            </nav>
        )
    })
     return jsx;
    }
    else{
      return(
        
          <nav  className="navbar">
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
  this.setState({loading:true})

    const {totalData,rowsPerPage} = this.state
    var totalPage = Math.ceil(totalData/rowsPerPage)
    swal("Halaman Berapa:", {
      content: "input",
    })
    .then((num) => {
      if(num > totalPage){
        swal("error","Halaman melebihi","error")
      }else if(isNaN(num)){
        swal("error","Harus angka","error")
        
      }
      else{
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
        };  
        var newLink
        if(this.state.toDate && this.state.fromDate){
          newLink += `?rows=1000&status=approved&start_date=${this.state.fromDate}&end_date=${this.state.toDate}&page=${num}`
        }else{  
          newLink += `?rows=${this.state.rowsPerPage}&status=approved&start_date=${this.state.fromDate}&end_date=${this.state.toDate}&page=${num}`
        }
        axios.get(serverUrl+`lender/loanrequest_list`+newLink,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data,rowsPerPage:res.data.rows,totalData:res.data.total_data})
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
    
    var newLink=''
    if(this.state.toDate && this.state.fromDate){
      newLink += `?rows=1000&status=approved&start_date=${this.state.fromDate}&end_date=${this.state.toDate}&page=${num}`
    }else{  
      newLink += `?rows=${this.state.rowsPerPage}&status=approved&page=${num}`
    }

    axios.get(serverUrl+`lender/loanrequest_list`+newLink,config)
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
          <td align="center" colSpan={6}>Data Empty</td>
        </tr>
      )
    }
    var jsx = this.state.rows.map((val,index)=>{
      return (
          <tr key={index}>
          <td align="center">
          <input type="checkbox" value={val.id} style={{width:"20px",height:"20px"}} /> 
          </td>
          {/* <td align="center">{index+1}</td> */}
          <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>

          <td align="center">{val.id}</td>
          <td align="center">{val.owner_name}</td>
          <td align="center">{val.created_time.substr(0, val.created_time.indexOf('T'))}</td>
          {/* <TableCell align="center">{val.status}</TableCell> */}
          <td align="center">
          <Link style={{textDecoration:"none"}} to={`/permintaanpinjamanDetail/${val.id}/${val.owner.Int64}`}>

              <input type="button" className="btn btn-primary" value="Details"/>
          </Link>
          </td>
      </tr>
      )
  })
   return jsx;

  }
    
  }

  //RENDER HASIL SEARCH
  renderSearchJsx = ()=>{
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
    if (this.state.rowsCari.length===0){
      return(
        <tr>
          <td align="center" colSpan={6}>Data Empty</td>
        </tr>
      )
    }
    var jsx = this.state.rowsCari.map((val,index)=>{
      return (
          <tr key={index}>
          <td align="center">
          <input type="checkbox" value={val.id} style={{width:"20px",height:"20px"}} /> 
          </td>
          {/* <td align="center">{index+1}</td> */}
          <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>

          <td align="center">{val.id}</td>
          <td align="center">{val.owner_name}</td>
          <td align="center">{val.created_time.substr(0, val.created_time.indexOf('T'))}</td>
          {/* <TableCell align="center">{val.status}</TableCell> */}
          <td align="center">
          <Link style={{textDecoration:"none"}} to={`/permintaanpinjamanDetail/${val.id}/${val.owner.Int64}`}>

              <input type="button" className="btn btn-primary" value="Details"/>
          </Link>
          </td>
      </tr>
      )
  })
   return jsx;

  }
    
  }
  //FUNCTION BUAT MODAL
 
  btnCancelModalDownload = ()=>{
    this.setState({downloadModal:false,downloadDataCSV:[]})
    arr = []

  }
  renderBtnOrLoading =()=>{
    if (this.state.loadingBtn){
        return  <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height="30"	
        width="30"
        
     />   
    }
    else{
        return(
          <input type="button" className="btn btn-primary ml-3" onClick={this.btnDownloadCsv} value="CSV Download"></input>
        )
    }
}


    
  render() {
if(kukie.get("tokenClient")&&kukie.get("token")){
    return (
        <div className="container">

        <Modal isOpen={this.state.downloadModal} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Jumlah Download CSV: {arr.length} item(s)</ModalHeader>
          <ModalBody>
          <CSVLink data={this.state.downloadDataCSV} 
          > Click Here to Download CSV </CSVLink>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.btnCancelModalDownload}>Close</Button>
          </ModalFooter>
        </Modal>


        <nav className="navbar">
          <h2>Pinjaman Disetujui</h2>
       
     
        </nav>
         <div className="row">
            <div className="col-12 col-md-12">
                
        <DatePicker
        className="ml-3"
        format="yyyy-MM-dd"
        onChange={this.handleStartChange}
        value={this.state.startDate}
        clearIcon={null}
            />  -  <DatePicker
        format="y-MM-d"
        onChange={this.handleEndChange}
        value={this.state.endDate}
        clearIcon={null}
        
        />
                
            <input type="button" className="btn btn-info ml-2" onClick={this.onBtnSearch} value="Search"></input>
            <input type="button" className="btn btn-info ml-2" onClick={this.onBtnReset} value="Reset"></input>
            
            </div>
        </div> 
        <hr></hr>
          <table className="table table-hover">
          <thead className="table-warning">
              <tr>
                <td align="center">
                    Select
                </td>
                  <td align="center">#</td>
                  <td align="center">Id Nasabah</td>
                  <td align="center">Nama Nasabah</td>
                  <td align="center">Tanggal Registrasi</td>
                  {/* <td align="center">Status Nasabah</td> */}
                  <td align="center">Action</td>
              </tr>     
          </thead>
            <tbody>
  
            {this.renderJSX()}
         
            </tbody>
            <tfoot>
              <tr>
              </tr>
            </tfoot>
          </table>
          <hr></hr>
          {this.renderBtnOrLoading()}        

          <nav className="navbar" style={{float:"right"}}> 
                  <p className="mr-2" style={{cursor:"pointer"}} onClick={this.getDataPreviousPage}>Prev</p> 
                  {this.getNumberOfPages()} 
                  <p style={{cursor:"pointer"}} onClick={this.getDataNextPage}>Next </p>
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
export default connect (mapStateToProp)(PinjamanSetuju) ;
