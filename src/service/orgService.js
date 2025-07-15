import {config} from '../utils.js'
import axios from 'axios';

export async function getAllOrg(){
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/org/getAllOrg`,{},{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
        return data;
    } catch (err) {
        console.log(err)
    }
}

export async function saveOrg(Org){
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/org/createOrg`,Org,{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        })
    return data

    }catch(err){
        return err.response.data;
        console.log(err)
    }
}

export async function updateOrg(org){
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/users/updateUser`,user,{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        })
    return data

    }catch(err){
        return err.response.data;
        console.log(err)
    }
}