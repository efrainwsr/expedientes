import {config} from '../utils.js'
import axios from 'axios';

export async function getMunicipios(id_estado){
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ubicacion/getMunicipios`,{
            id_estado: id_estado
        },{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
    return data
    } catch (err) {
        console.log(err)
    }
}

export async function getParroquias(id_municipio){
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ubicacion/getParroquias`,{
            id_municipio: id_municipio
        },{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
    return data
    } catch (err) {
        console.log(err)
    }
}

export async function getEstados(){
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/ubicacion/getEstados`,{},{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
        //console.log("estados", data)
    return data
    } catch (err) {
        console.log(err)
    } 
}