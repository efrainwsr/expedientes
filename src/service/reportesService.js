import {config} from '../utils.js'
import axios from 'axios';

export async function getTotalDetOrg(org, rangoFechas){
  const datos = {
    org: org,
    rangoFechas: rangoFechas
  }
  console.log(datos, "datos en getTotalDetOrg service")
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/reportes/getTotalDetOrg`,{org, rangoFechas},{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
        //console.log(data, "en getTotalDetOrg");
        return data;
    } catch (err) {
        console.log(err)
    }
}

export async function getAllDet(rangoFechas){
    console.log("4. llegamos a getAllDet")
    try {
        const {data} = await axios.post(`${config.apiBaseUrl}/api/reportes/getAllDet`,{rangoFechas},{
            headers:{
                'auth-token': localStorage.getItem('token')
            }
        });
        //console.log(data, "en getTotalDetOrg");
        return data;
    } catch (err) {
        console.log(err)
    }
}
