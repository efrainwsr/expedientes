import {config} from '../utils.js'
import axios from 'axios';

export async function getDelitosCiudadano(id_ciudadano){
    console.log('id_ciudadano:', id_ciudadano)
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ciudadanos/getDelitosCiudadano`,{id_ciudadano: id_ciudadano}, {
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

export async function buscarCiudadano(cedula){
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ciudadanos/buscarCiudadano`,{cedula: cedula}, {
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


export async function saveCiudadano(ciudadano){
    console.log('ciudadano a guardar:', ciudadano) 
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ciudadanos/createCiudadano`,ciudadano, {
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

export async function saveDelitoCiudadano(delito){
    try{    
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ciudadanos/createDelitoCiudadano`,delito, {
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