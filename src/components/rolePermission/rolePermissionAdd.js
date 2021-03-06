import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import axios from 'axios'
import { serverUrl } from '../url';
import CheckBox from '../subComponent/CheckBox';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import {listAllRolePermission} from './../global/globalConstant'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

const cookie = new Cookies();



class rolePermissionAdd extends React.Component{
    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission,
      listRolePermission: [],
      disabled: false,
      role : '',
      listRole: [],
      loading: true,
    };

    componentDidMount(){
      this.getAllRole();
    }

    getAllRole = ()=>{
      const config = {
        headers: {'Authorization': "Bearer " + cookie.get('token')}
      };

      axios.get(serverUrl+`admin/roles`,config).then((res)=>{
        const listRole = res.data && res.data.data;

        this.setState({
          listRole,
        }, () => {
          this.getAllRolePermission()
        })
      }).catch((err)=>{
          console.log(err.toString())
          this.setState({
            errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
            loading: false,
            disabled: true,
          })
      })
    }

    getAllRolePermission = ()=>{
      const config = {
        headers: {'Authorization': "Bearer " + cookie.get('token')}
      };

      axios.get(serverUrl+`admin/permission`,config)
      .then((res)=>{
          const listPermission = res.data && res.data.data ? res.data.data : res.data;
          const listRole = this.state.listRole;
          const newRole = [];
          let role = 0;

          for(const key in listRole) {
            const rolePerLine = listRole[key];
            rolePerLine.permission = []
            for(const keyPermission in listPermission) {
              if(
                rolePerLine.id.toString() === listPermission[keyPermission].role_id.toString() && 
                listPermission[keyPermission].permissions.toString().trim().length !== 0
              ) {
                rolePerLine.permission.push(listPermission[keyPermission].permissions)
              }
            }

            if(rolePerLine.permission.length === 0) {
              if(role === 0) {
                role = rolePerLine.id;
              }
              newRole.push(rolePerLine);
            }
          }

          if(newRole.length && newRole.length !== 0) {
            this.setState({
              role,
              listRole: newRole,
              loading:false,
            })
          } else {
            this.setState({
              disabled:true,
              errorMessage: 'Data Role yang belum di setup tidak ditemukan',
              loading:false,
            })
          }
          
          this.setState({
            role,
            listRole: newRole,
            loading:false,
          })

      }).catch((err)=>{
        console.log(err.toString())
        this.setState({
          errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
          loading: false,
          disabled: true
        })
      })
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
      if(this.state.listRolePermission.length === 0) {
        this.setState({errorMessage:"ERROR : Data Role Permission Tidak Boleh Kosong"})
      } else if(this.state.listRole.length === 0 || this.state.role === 0) {
        this.setState({errorMessage:"ERROR : Data Role Tidak Boleh Kosong"})
      } else{
        const listRolePermission = this.state.listRolePermission;
        const dataRolePermission = {};
        dataRolePermission.role_id = parseInt(this.state.role);
        dataRolePermission.permissions = this.constructRolePermission(listRolePermission);

        this.setState({loading: true});
        
        const config = {
          headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        axios.post(serverUrl+'admin/permission',dataRolePermission,config).then((res)=>{
          swal("Success","Role Permission berhasil di tambah","success")
          this.setState({diKlik:true})
        }).catch((err)=>{
          this.setState({
            errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
            disabled: true,
          })
        })
      }
    }

    constructRolePermission = (rolePermission) => {
      const newPermission = [];

      for(const key in rolePermission) {
        newPermission.push(`${rolePermission[key].modules}_${rolePermission[key].name}`)
      }
      return newPermission;
    }

    checkingRole = (role, id) => {
      for (const key in role) {
        if (
          role[key].id.toString().trim() === id.toString().trim()
        ) {
          return true;
        }
      }
      return false;
    }

    onChangeCheck = (e) => {
      const profileUserAll = Object.assign({}, this.state.listAllRolePermission);
      const profileUser = Object.assign({}, this.state.listRolePermission);
      const profileUserNew = [];
      let flag = false;
      let name = '';
      let modules = '';
  
      for (const key in profileUserAll) {
        if (
          profileUserAll[key].id.toString().trim() ===
          e.target.value.toString().trim()
        ) {
          name = profileUserAll[key].name;
          modules = profileUserAll[key].modules;

          for(const keyRole in profileUser) {
            if(profileUser[keyRole].id.toString().trim() !== e.target.value.toString().trim()) {
              profileUserNew.push(profileUser[keyRole])
            } else {
              flag = true;
            }
          }
        } 
      }
  
      if (!flag) {
        profileUserNew.push({
          id: e.target.value,
          name: name,
          modules: modules,
        });
      }
      
      this.setState({
        listRolePermission: profileUserNew,
      });
    };

    onChangeDropDown = (e) => {
      this.setState({role: e.target.value})
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/listRolePermission'/>            
        } else if (this.state.loading){
          return  (
            <div  key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(cookie.get('token')){
          return(
              <div className="container mt-4">
                <h3>Role Permission - Tambah</h3>
                
                <hr/>
                
                <form>
                  <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Role Name
                      </label>
                      <div className="col-sm-4">
                        <DropDown
                          value={this.state.role}
                          label="Role"
                          data={this.state.listRole}
                          id="id"
                          labelName="name"
                          onChange={this.onChangeDropDown}
                          fullWidth
                          error={this.state.roleHelper}
                          disabled={this.state.disabled}
                        />
                      </div>                 
                  </div>

                  <div className="form-group row">
                      <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                        {this.state.errorMessage}
                      </div>     
                      <div className="col-12" style={{color:"black",fontSize:"15px",textAlign:'left'}}>
                        <CheckBox
                          label="Core - Permission Setup"
                          modulesName="Menu"
                          data={this.state.listAllRolePermission}
                          id="id"
                          labelName="label"
                          modules="menu"      
                          labelPlacement= "top"                       
                          onChange={this.onChangeCheck}
                          onChecked={(id) => this.checkingRole(this.state.listRolePermission, id)}
                          style={{ width: '97%'}}
                          disabled={this.state.disabled}
                        />
                      </div>           
                  </div>
                  
                  <div className="form-group row">
                      <div className="col-sm-12 ml-3 mt-3">
                        <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave} disabled={this.state.disabled}/>
                        <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>
                  </div>
                  
                </form>
              
              </div>
          )
        } else if(!cookie.get('token')){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(rolePermissionAdd);