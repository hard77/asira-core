import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {serverUrl} from './url'
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import './../support/css/pagination.css'
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import QueryString from 'query-string'
const cookie = new Cookies()
var config = {
  headers: {'Authorization': "Bearer " + cookie.get('token')}
};
class BankList extends React.Component{
    state={
        loading:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,
        searchRows:null,
        halamanConfig:`orderby=id&sort=ASC&rows=10`
    }
    componentDidMount(){
        this.getAllBankData()
    }

    getLink = ()=>{
       var obj = QueryString.parse(this.props.location.search)
       return obj.query 
      }
      pushUrl = ()=>{
        var newLink ='/listbank/search'
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
    getAllBankData = ()=>{
        config = {
            headers: {'Authorization': "Bearer " + cookie.get('token')}
          };
        var newLink =`admin/banks`
        if (this.props.location.search){
          var hasil = this.getLink()
          if(!isNaN(hasil)){
            newLink += `?id=${hasil}&`+this.state.halamanConfig
          }else{
            newLink += `?name=${hasil}&`+this.state.halamanConfig
          }
        }else{
          newLink += `?`+this.state.halamanConfig
        }
        
        axios.get(serverUrl+newLink,config)
        .then((res)=>{
            this.setState({
                rows:res.data.data,
                total_data:res.data.total_data,
                page:res.data.current_page,
                from:res.data.from,
                to:res.data.to,
                last_page:res.data.last_page,
                dataPerhalaman:res.data.rows,
                loading:false})
        })
        .catch((err)=>console.log(err))

    }

    onBtnSearch = ()=>{
      this.pushUrl()
      var searching = this.refs.search.value
      this.setState({loading:true,searchRows:searching})
      var newLink=""
      if(searching){
        //search function
      if(!isNaN(searching)){
          newLink += `id=${searching}&${this.state.halamanConfig}` 
        }else{
          newLink += `name=${searching}&${this.state.halamanConfig}`
        }     
      }else{
        newLink +=this.state.halamanConfig
      }
      axios.get(serverUrl+`admin/banks?`+newLink,config)
      .then((res)=>{
          console.log(res)
          this.setState({loading:false,rows:res.data.data,searchRows:null})
      })
      .catch((err)=>{
          console.log(err)
      })

    }

    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
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
            if(this.state.rows.length===0){
                return(
                  <tr>
                     <td align="center" colSpan={6}>Data empty</td>
                  </tr>
                )
              }else{
                var jsx = this.state.rows.map((val,index)=>{
                    return(
                        <tr key={index}>
                        <td align="center">{this.state.page >1 ? index+1 + (this.state.dataPerhalaman*(this.state.page -1)) : index+1}</td>
                        <td align="center">{val.id}</td>
                        <td align="center">{val.name}</td>
                        {/* <td align="center">{val.type}</td> */}
                        <td align="center">{val.pic}</td>
                        <td align="center">
                            <Link to={`/bankedit/${val.id}`} className="mr-2">
                                 <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                            </Link>
                            <Link to={`/bankdetail/${val.id}`} >
                                 <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                            </Link>
                        </td>
                </tr>  
                    )
                })
                return jsx;
              }
        }
      

    }

    onChangePage = (current, pageSize) => {
        this.setState({loading:true})
        console.log('onChange:current=', current);
        console.log('onChange:pageSize=', pageSize);

        var newLink =`page=${current}&${this.state.halamanConfig}`
        axios.get(serverUrl+`admin/banks?`+newLink,config)
        .then((res)=>{
            console.log(res.data)
            this.setState({loading:false,rows:res.data.data,dataPerhalaman:res.data.rows,page:current})
        })
        .catch((err)=>{
            console.log(err)
        })
      }
 
    render(){
        if(cookie.get('token')){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">List - Bank</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="search" placeholder="Search Bank.." />
                            <span className="input-group-addon ml-2" style={{border:"1px solid grey",width:"35px",height:"35px",paddingTop:"2px",borderRadius:"4px",paddingLeft:"2px",marginTop:"6px",cursor:"pointer"}} onClick={this.onBtnSearch}> 
                            <i className="fas fa-search" style={{fontSize:"28px"}} ></i></span>
                        </div>
                        </div>
                    </div>
                   <hr/>
                   <table className="table table-hover">
                   <thead className="table-warning">
                        <tr >
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Bank ID</th>
                            <th className="text-center" scope="col">Bank Name</th>
                            {/* <th className="text-center" scope="col">Bank Type</th> */}
                            <th className="text-center" scope="col">PIC</th>
                            <th className="text-center" scope="col">Action</th>
                        </tr>     
                    </thead>
                       <tbody>
                          {this.renderJSX()}

                       </tbody>
                   </table>
                   <hr/>
                <nav style={{float:"right",color:"black"}}> 
                <Pagination className="ant-pagination"  
                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                total={this.state.total_data}
                pageSize={this.state.dataPerhalaman}
                onChange={this.onChangePage}
                locale={localeInfo}
                />
                </nav>
               
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

export default BankList;