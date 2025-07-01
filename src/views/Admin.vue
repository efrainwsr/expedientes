<script setup>
    import AdminCrearUsuarioFrm from '../components/AdminCrearUsuarioFrm.vue'
    import AdminVerUsuariosTable from '../components/AdminVerUsuariosTable.vue';
    import {ref} from 'vue';

    const rutaFotos = "../../public/"


var listaCiudadanos = [
  {
    "id": "001",
    "cedula": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez Rodríguez",
    "fecha_nacimiento": "1985-03-15",
    "estado_pais": {"name": "Zulia", "code": 3} ,
    "ciudad": "Maracaibo",
    "municipio": "Maracaibo",
    "parroquia": "Chiquinquirá",
    "direccion": "Av. 5 de Julio, Edif. El Sol, Apto. 3B",
    "celular": "0414-1234567",
    "detenido": 1,
    "delitos": ["Robo a mano armada", "Lesiones personales"],
    "foto": "1.jpg"
  },
  {
    "id": "002",
    "cedula": "23456789",
    "nombres": "María",
    "apellidos": "González Sánchez",
    "fecha_nacimiento": "1990-11-22",
    "estado_pais": {"name": "Bolivar", "code": "1"},
    "ciudad": "Valencia",
    "municipio": "Valencia",
    "parroquia": "San Blas",
    "direccion": "Calle 100, Nro. 5-10, Urb. La Isabelica",
    "celular": "0426-9876543",
    "detenido": 0,
    "delitos": "Tráfico de drogas",
    "foto": "3.jpg"
  },
  {
    "id": "003",
    "cedula": "34567890",
    "nombres": "Pedro",
    "apellidos": "Hernández López",
    "fecha_nacimiento": "1978-07-01",
    "estado_pais": "Miranda",
    "ciudad": "Guarenas",
    "municipio": "Plaza",
    "parroquia": "Guarenas",
    "direccion": "Sector 1, Mz. 4, Casa 12, Urb. El Samán",
    "celular": "0412-3456789",
    "detenido": 1,
    "delitos": "Tráfico de drogas, Asociación para delinquir",
    "foto": "2.jpg"
  },
  {
    "id": "004",
    "cedula": "10987654",
    "nombres": "Ana",
    "apellidos": "Ramírez Vargas",
    "fecha_nacimiento": "1995-01-08",
    "estado_pais": "Lara",
    "ciudad": "Barquisimeto",
    "municipio": "Iribarren",
    "parroquia": "Concepción",
    "direccion": "Carrera 19, entre Calles 25 y 26, Edif. Sol Naciente, Apto. 2A",
    "celular": "0416-7654321",
    "detenido": 0,
    "delitos": [],
    "foto": "3.jpg"
  },
  {
    "id": "005",
    "cedula": "21098765",
    "nombres": "Luis",
    "apellidos": "Morales Castro",
    "fecha_nacimiento": "1980-09-30",
    "estado_pais": "Bolívar",
    "ciudad": "Ciudad Guayana",
    "municipio": "Caroní",
    "parroquia": "Unare",
    "direccion": "Vereda 2, Manzana 15, Casa 7, Urb. Villa Brasil",
    "celular": "0424-5432109",
    "detenido": 1,
    "delitos": "Homicidio calificado, Porte ilícito de arma de fuego",
    "foto": "1.jpg"
  },
  {
    "id": "006",
    "cedula": "32109876",
    "nombres": "Sofía",
    "apellidos": "Díaz Rojas",
    "fecha_nacimiento": "1992-04-12",
    "estado_pais": "Aragua",
    "ciudad": "Maracay",
    "municipio": "Girardot",
    "parroquia": "Las Delicias",
    "direccion": "Av. Las Delicias, C.C. Parque Aragua, Local 15",
    "celular": "0414-2109876",
    "detenido": 0,
    "delitos": "Secuestro",
    "foto": "2.jpg"
  },
  {
    "id": "007",
    "cedula": "10111213",
    "nombres": "Carlos",
    "apellidos": "Blanco Vera",
    "fecha_nacimiento": "1988-02-28",
    "estado_pais": "Anzoátegui",
    "ciudad": "Puerto La Cruz",
    "municipio": "Sotillo",
    "parroquia": "Puerto La Cruz",
    "direccion": "Calle Freites, Residencias Marina, Piso 4, Apto. 8",
    "celular": "0416-3210987",
    "detenido": 1,
    "delitos": "Extorsión, Secuestro",
    "foto": "3.jpg"
  },
  {
    "id": "008",
    "cedula": "20223344",
    "nombres": "Laura",
    "apellidos": "Gómez Silva",
    "fecha_nacimiento": "1998-06-05",
    "estado_pais": "Mérida",
    "ciudad": "Mérida",
    "municipio": "Libertador",
    "parroquia": "El Llano",
    "direccion": "Av. 3, entre Calles 20 y 21, Casa Nro. 3-45",
    "celular": "0426-4321098",
    "detenido": 0,
    "delitos": "Secuestro",
    "foto": "2.jpg"
  },
  {
    "id": "009",
    "cedula": "30334455",
    "nombres": "Diego",
    "apellidos": "Ferrer Rivas",
    "fecha_nacimiento": "1975-10-10",
    "estado_pais": "Nueva Esparta",
    "ciudad": "Porlamar",
    "municipio": "Mariño",
    "parroquia": "Mariño",
    "direccion": "Av. 4 de Mayo, C.C. Costazul, Local 123",
    "celular": "0412-5432109",
    "detenido": 1,
    "delitos": "Fraude",
    "foto": "1.jpg"
  },
  {
    "id": "010",
    "cedula": "11223344",
    "nombres": "Gabriela",
    "apellidos": "Soto Aguilar",
    "fecha_nacimiento": "1993-12-25",
    "estado_pais": "Falcón",
    "ciudad": "Punto Fijo",
    "municipio": "Carirubana",
    "parroquia": "Carirubana",
    "direccion": "Calle Mariño, entre Girardot y Ayacucho, Casa Nro. 10",
    "celular": "0414-6543210",
    "detenido": 0,
    "delitos": "Estafa",
    "foto": "3.jpg"
  }
]

const isDisabled = ref(false);

const categoryItems = ref([]);
/*const estadosItems = ref([
{ name: 'Bolivar', code: '1' },
{ name: 'Anzoategui', code: '2' },
{ name: 'Zulia', code: '3' },
{ name: 'Portuguesa', code: '4' },
{ name: 'Nueva esparta', code: '5' }
]);*/

const estadosItems = ref([]);


const sizeItems = ref([]);



const detenidoOptions = ref([
{name: "Si", code: 1},
{name: "No", code: 0},
]);


const buscarCne = async () =>{
    const res = await fetch(`https://api.cedula.com.ve/api/v1?app_id=1075&token=499a64a32fdcb13b03869b70cee3ce0d&nacionalidad=V&cedula=${ciudadanoModel.value.cedula}`)
    console.log(res.json())
}

const cedulaBuscar = ref('12345678');

const ciudadanoModel = ref(
{
    id: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    estado_pais: [{}],
    ciudad: "",
    municipio: "",
    parroquia: "",
    direccion: "",
    celular: "",
    detenido: [{}],
    delitos: "",
    foto: ""
}
);


const reglasValidacion = {
    cedula: { required: true, tipo: 'string' },
};

const validateForm = () => {
    const requiredFields = ['buscarCiudadano'];
    
    let val = validateFields(cedulaBuscar.value, requiredFields)
    return val;
};



const buscarCiudadano = async (e) => {
    
    //const res = await fetch('demo/data/ciudadanos.json');
    const ciudadanoData =  listaCiudadanos;//await res.json();
    console.log(ciudadanoData)
    //busquedaRealizada.value = true; // Indicamos que se ha iniciado una búsqueda
    const cedulaNormalizada = cedulaBuscar.value.trim().toUpperCase(); // Normalizamos la cédula para una búsqueda precisa
    // Usamos el método .find() para buscar el ciudadano por su cédula
    const encontrado = ciudadanoData.find(
    (ciudadano) => ciudadano.cedula.toUpperCase() === cedulaNormalizada
    );
    // Asignamos el resultado a la referencia reactiva
    if (encontrado) {
        ciudadanoModel.value = encontrado;
        // Opcional: Para ver el objeto puro en la consola sin el Proxy de Vue
        console.log("Ciudadano encontrado:", JSON.parse(JSON.stringify(encontrado)));
    } else {
        ciudadanoModel.value = null; // Si no se encuentra, limpiamos el valor anterior
        console.log(`No se encontró ningún ciudadano con la cédula: ${cedulaNormalizada}`);
    }
};

const guardarCiudadano = async () => {
    ciudadanoModel.value.id = listaCiudadanos.length

    const plainCiudadano = JSON.parse(JSON.stringify(ciudadanoModel.value));
    listaCiudadanos.push(plainCiudadano)
    console.log(listaCiudadanos)
}

</script>

<template>
    <AdminCrearUsuarioFrm/>
    <AdminVerUsuariosTable/>

    <div class="grid">
        <Toast/>
        
        <div class="col-12 md:col-3">
            <div class="card">
                <h5>Buscar</h5>
                <form >
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="buscarCiudadano">Ingrese umero de cedula</label>
                            <InputText v-model="cedulaBuscar" id="buscarCiudadano" type="text"  placeholder="Ej. 13555666" />
                        </div>
                    </div>
                    <Button @click="buscarCiudadano" class="" label="Buscar"  icon="pi pi-check"></Button>
                </form>
            </div>
        </div>
        
        <div class="col-12">
            <div class="card">
                <h5>Expediente</h5>
                <form >
                    <div class="p-fluid formgrid grid">
                        
                        <div class="card flex justify-center">
                            <Image :src="rutaFotos+ciudadanoModel.foto" alt="Image" width="250" />
                        </div>

                        <div class="field col-12 md:col-2">
                            <label for="name">Cedula</label>
                            <InputText @keyup.enter="buscarCne" :disabled="isDisabled" v-model="ciudadanoModel.cedula" id="name" type="text"  placeholder="Ej. 12345678" />
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="name">Nombres</label>
                            <InputText :disabled="isDisabled" v-model="ciudadanoModel.nombres" id="name" type="text"  placeholder="Ej. Jose" />
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="desc">Apellidos</label>
                            <InputText :disabled="isDisabled" v-model="ciudadanoModel.apellidos" id="desc" type="text"  placeholder="Ej. Garcia" />
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="desc">Fecha de nacimiento</label>
                            <Calendar dateFormat="yy-mm-dd" placeholder="Ej. 2000/05/28" :showIcon="true" :showButtonBar="true" v-model="ciudadanoModel.fecha_nacimiento"></Calendar>
                        </div>
                

                        <div class="field col-12 md:col-3">
                            <label for="categories">Estado</label>
                            <Dropdown v-model="ciudadanoModel.estado_pais" :options="estadosItems" showClear optionLabel="name" placeholder="Seleccione..." />
                        </div>
                        
                        <div class="field col-6">
                            <label for="address">Direccion</label>
                            <InputText v-model="ciudadanoModel.direccion" id="address" rows="4" placeholder="Av. rafael urdaneta" />
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="celular">Celular</label>
                            <InputText :disabled="isDisabled" v-model="ciudadanoModel.celular" id="celular" type="text"  placeholder="Ej. 0412888777" />
                        </div>
                         
                        
                        <div class="field col-12 md:col-3">
                            <label for="status">Detenido</label>
                            <Dropdown v-model="ciudadanoModel.detenido" id="status" :options="detenidoOptions" optionLabel="name" placeholder="Seleccione SI o NO"></Dropdown>
                        </div>
                        
                        
                        <div class="field col-12 md:col-12">
                            <label for="delitos">Delitos</label>
                            <InputText v-model="ciudadanoModel.delitos" id="delitos" type="text"  placeholder="robo, desorden publico" />
                        </div>
                    </div>
                    
                    
                    <Button @click="guardarCiudadano" class="" label="Guardar"  icon="pi pi-check"></Button>
                </form>
            </div>
        </div>
    </div>

</template>