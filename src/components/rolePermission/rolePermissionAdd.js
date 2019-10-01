import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
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

const config = {
  headers: {'Authorization': "Bearer " + cookie.get('token')}
};

class rolePermissionAdd extends React.Component{
    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission,
      listRolePermission: [],
      disabled: false,
      role : '',
      listRole: [],
    };

    componentDidMount(){
      this.getAllRole()

      console.log(cookie.get('token'))
    }

    getAllRole = ()=>{
      axios.get(serverUrl+`admin/roles`,config).then((res)=>{
        console.log(res.data)
        const listRole = res.data && res.data.data

        this.setState({
          listRole,
          loading:false,
        }, () => {
          this.getAllRolePermission()
        })
      }).catch((err)=>{
          console.log(err.response)
          this.setState({
            errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
            disabled: true,
          })
      })
    }

    getAllRolePermission = ()=>{
      axios.get(serverUrl+`admin/permission`,config)
      .then((res)=>{
          const listPermission = res.data && res.data.data
          const listRole = this.state.listRole;
          const newRole = [];

          for(const key in listRole) {
              const rolePerLine = listRole[key];
              rolePerLine.permission = []
              for(const keyPermission in listPermission) {
                  if(rolePerLine.id.toString() === listPermission[keyPermission].role_id.toString()) {
                      rolePerLine.permission.push(listPermission[keyPermission].permission)
                  }
              }

              if(rolePerLine.permission.length === 0) {
                  newRole.push(rolePerLine);
              }
          }

          this.setState({
              listRole: newRole,
              loading:false,
          })

      }).catch((err)=>{
          console.log(err.response)
          this.setState({errorMessage: err.toString()})
      })
  }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnSave=()=>{
        if(this.state.listRolePermission.length && this.state.listRolePermission.length === 0) {
          this.setState({errorMessage:"Data Role Permission Tidak Boleh Kosong"})
        } else{
          const listRolePermission = this.state.listRolePermission;
          const dataRolePermission = {};
          dataRolePermission.idRole = this.state.role.id;
          dataRolePermission.permission = this.constructRolePermission(listRolePermission);

          console.log(dataRolePermission)
          axios.post(serverUrl+'admin/permission',dataRolePermission,config).then((res)=>{
            swal("Success","Role Permission berhasil di tambah","success")
            this.setState({diKlik:true})
          }).catch((err)=>{
              console.log(err.toString())
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

    checkingRole = (role, labelName) => {
        for (const key in role) {
          if (
            role[key].id.toString().trim() ===
            labelName.toString().trim()
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
        console.log(profileUserNew)
        this.setState({
          listRolePermission: profileUserNew,
        });
      };

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listRolePermission'/>            
        }
        if(cookie.get('token')){
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
                            value={this.state.role && this.state.role.id}
                            label="Role"
                            data={this.state.listRole}
                            id="id"
                            labelName="label"
                            onChange={this.onChangeAutoCompleteApproval}
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
                              labelName="name"
                              modules="menu"      
                              labelPlacement= "top"                       
                              onChange={this.onChangeCheck}
                              onChecked={(labelName) => this.checkingRole(this.state.listRolePermission, labelName)}
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
        }
        if(!cookie.get('token')){
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