import {config} from '../utils.js'
import axios from 'axios';

export async function getAllBandas(){
  
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/bandas/getAllBandas`,{},{
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

export async function saveBanda(banda){
console.log('banda a guardar:', banda) 
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/bandas/createBanda`,banda,{
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

export async function updateBanda(banda   ){
    console.log('banda a actualizar:', banda) 
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/bandas/updateBanda`, banda,{
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