import Axios from 'axios'
import {serverUrl} from './../components/url'
import Cookie from 'universal-cookie'

const kukie = new Cookie()

export const keepLogin = ()=>{
  return (dispatch)=>{
        var config = {
          headers: {'Authorization': "Bearer " + kukie.get('tokenClient')}
        };
      Axios.get(serverUrl+"lender/profile",config)
      .then((res)=>{
        
         if (res.data !== "undefined"){
              dispatch({
                  type:'LOGIN_SUCCESS',
                  payload : res.data
              },
              )
          }
      })
      .catch((err)=>console.log(err))
  }
}


export const resetUser = ()=>{
  return {
      type: 'RESET_USER'
  }
}