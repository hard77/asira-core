import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../url';
import CheckBox from '../subComponent/CheckBox';
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { listAllRolePermission } from '../global/globalConstant'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

const cookie = new Cookies();
const config = {
  headers: {'Authorization': "Bearer " + cookie.get('token')}
};


class rolePermissionDetail extends React.Component{
    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission,
      listRolePermission: [],
      listRole: {},
      role : {},
      roleId: 0,
      disabled: true,
      loading: true,
    };

    componentDidMount(){
      console.log(this.props)
      this.setState({
        roleId: this.props.match.params.id,
      },() => {
        this.getRole()
      })
      
    }

    getRole = ()=>{
      axios.get(serverUrl+`admin/roles/${this.state.roleId}`,config).then((res)=>{
        console.log(res.data)
        const listRole = res.data

        console.log(listRole)

        this.setState({
          listRole,
        }, () => {
          this.getRolePermission()
        })
      }).catch((err)=>{
          console.log(err.response)
          this.setState({
            errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
            loading: false,
            disabled: true,
          })
      })
    }

    getRolePermission = ()=>{
      console.log(this.state.roleId)
      axios.get(serverUrl+`admin/permission?role_id=${this.state.roleId}`,config)
      .then((res)=>{
        console.log(res.data)
        const listPermission = res.data && res.data.data;
        console.log(listPermission)
        const listRole = this.state.listRole;
        console.log(listRole)
        const newPermission = [];
        // listRole.permission = this.destructRolePermission(listPermission)
        console.log(listRole)

        for(const keyPermission in listPermission) {
          if(
            listRole.id.toString() === listPermission[keyPermission].role_id.toString() &&
            listPermission[keyPermission].permissions.toString().trim().length !== 0
          ) {
            if(listPermission[keyPermission].permissions.toString().trim().toLowerCase() === 'all') {
              newPermission = this.destructRolePermissionAll();
              break;
            } else {
              newPermission.push(this.destructRolePermission(listPermission[keyPermission].permissions))
            }
            
          }
        }

        console.log(newPermission)

        this.setState({
          listRolePermission: newPermission,
          loading: false,
        },() => {
          console.log(this.state.listRole)
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

    destructRolePermissionAll = (permission) => {
      let newPermission = [];

      const dataPermission = permission.split('_');

      for(const key in this.state.listAllRolePermission) {
        newPermission.push({
          id: this.state.listAllRolePermission[key].id,
          name: this.state.listAllRolePermission[key].name,
          modules: this.state.listAllRolePermission[key].modules,
        });
      }

      return newPermission
    }

    destructRolePermission = (permission) => {
      let newPermission = {};

      const dataPermission = permission.split('_');

      newPermission = {
        id: this.findIdRolePermission(dataPermission),
        name: dataPermission[0],
        modules: dataPermission[1] || dataPermission[0],
      };
      
      return newPermission
    }

    findIdRolePermission = (dataPermission) => {
      let idPermission = 0;
      console.log(dataPermission)
      for(const key in this.state.listAllRolePermission) {
        if(
          this.state.listAllRolePermission[key].modules.toString().toLowerCase().trim() === dataPermission[0].toString().toLowerCase().trim() && 
          dataPermission[1] &&
          this.state.listAllRolePermission[key].name.toString().toLowerCase().trim() === dataPermission[1].toString().toLowerCase().trim()
        ) {
          console.log('test')
          idPermission = this.state.listAllRolePermission[key].id;
        }
      }

      return idPermission
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnSave=()=>{

    }

    checkingRole = (role, idRolePermission) => {
        for (const key in role) {
          if (
            role[key].id.toString().trim() ===
            idRolePermission.toString().trim()
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
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.role && this.state.role.name}
                      </label>               
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
                          <input type="button" value="Ubah" className="btn btn-success" onClick={this.btnSave} />
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
    //   },
    //   getApplication: () => {
    //     dispatch(applicationRequest());
    //   },
    //   getSecurityAdministrator: (application) => {
    //     dispatch(securityAdministratorRequest(application));
    //   },
    //   getToken: (application) => {
    //     dispatch(rpsTokenRequest(application));
    //   },
    //   getTokenUpdate: (application) => {
    //     dispatch(rpsTokenUpdateRequest(application));
    //   },
    //   getAction: (application) => {
    //     dispatch(rpsActionRequest(application));
    //   },
    //   getProfileUserId: (application) => {
    //     dispatch(profileUserIdRequest(application));
    //   },
    //   getCurrency: () => {
    //     dispatch(currencyRequest());
    //   },
    //   getKanwil: () => {
    //     dispatch(kanwilRequest());
    //   },
    //   getKCU: (kanwil) => {
    //     dispatch(kcuRequest(kanwil));
    //   },
    //   getBranch: (kodeKcu) => {
    //     dispatch(branchRequest(kodeKcu));
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    //   handleCreaterpsTransaction: (rpsTransaction) => {
    //     dispatch(rpsTransactionCreate(rpsTransaction));
    //   },
    //   handleUpdaterpsTransaction: (rpsTransaction) => {
    //     dispatch(rpsTransactionUpdate(rpsTransaction));
    //   },
    //   handleGetrpsUserIdDetail: (rpsUserId) => {
    //     dispatch(rpsUserIdDetail(rpsUserId));
    //   },
    //   handleGetDetailProfileUser: (rpsUserId) => {
    //     dispatch(rpsProfileUserDetail(rpsUserId));
    //   },
    //   handleDelete: (rpsUserId) => {
    //     dispatch(rpsUserIdDelete(rpsUserId));
    //   },
    //   handleSetMessage: (message) => {
    //     dispatch(setAlert(message));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // rpsUserIdDetailNew: getrpsUserIdDetail(),
  // profileUserDetail: getrpsProfileUserDetail(),
  // listSourceTransaction: getListSourceTransaction(),
  // listAction: getListAction(),
  // listToken: getListToken(),
  // listEmployee: getListEmployee(),
  // listBranch: getListBranch(),
  // listApplication: getListApplication(),
  // listSecurityAdministrator: getListSecurityAdministrator(),
  // listCurrency: getListCurrency(),
  // listprofileUserId: getListProfileUserId(),
  // listKanwil: getListKanwil(),
  // listKCU: getListKCU(),
  // message: getMessageValue(),
  // redirect: getRedirectValue(),
  // fetching: getFetchStatus(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);
// const withReducer = injectReducer({ key: 'rpsTransaction', reducer });
// const withSaga = injectSaga({ key: 'rpsTransaction', saga });

export default compose(
    // withReducer,
    withConnect,
    // withSaga,
    withStyle,
    withRouter
  )(rolePermissionDetail);
// export default RoleAdd;