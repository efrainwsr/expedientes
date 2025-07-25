import {config} from '../utils.js'
import axios from 'axios';

export async function getAllDelitos(){
  
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/delitos/getAllDelitos`,{},{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
       // console.log(data);
        return data;
    } catch (err) {
        console.log(err)
    }
}

export async function saveDelito(delito){

    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/delitos/createDelito`,delito,{
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

export async function updateDelito(delito   ){
    console.log('delito a actualizar:', delito) 
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/delitos/updateDelito`, delito,{
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