<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import ItemMenu from '../components/ItemMenu.vue';
import axios from 'axios'


const { isDarkTheme } = useLayout();
const lineOptions = ref(null);
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);


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

const statusItems = ref([
{name: "Disponible"},
{name: "No Disponible"},
]);

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




const clearMenuModel = () => {
    menuModel.value = {
        name: "",
        desc: "",
        price: "",
        category: null,
        size: "",
        status: "",
        ingredients: ""
    };
};

//  CONSULTAR CATERGORIAS
/*onMounted(async () => {
    const query = await getDocs(collection(db, "categories"));
    const data = query.docs.map((doc) =>{
        return {id: doc.id, ...doc.data()};
    });
    categoryItems.value = data;
    console.log(data)
});*/


//CONSULTAR TAMAÑOS
/*onMounted(async () => {
    const query = await getDocs(collection(db, "sizes"));
    const data = query.docs.map((doc) =>{
        return {...doc.data()};
    });
    sizeItems.value = data;
    //console.log(data)
}); */

/*onMounted(async () => {
    try {
        const res = await fetch('src/assets/venezuela.json');
        if (!res.ok) { // Always check if the response was successful
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        estadosItems.value = await res.json(); // Await the res.json() promise
        console.log(estadosItems.value);
    } catch (error) {
        console.error("Error al cargar los estados:", error);
        // You might want to handle this error in the UI, e.g., show a message
    }
});*/



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


// Add a new document in collection "menu"
const saveMenuItem = async (e)=>{
    
    if(validateForm(menuModel.value, )==true){ 
        const categoryId = menuModel.value.category.id;
        const sizeName = menuModel.value.size.name;
        const statusName = menuModel.value.status.name;
        menuModel.value.status = statusName;
        menuModel.value.category = categoryId;
        menuModel.value.size = sizeName;
        menuModel.value.price = parseFloat(menuModel.value.price);
        
        //const saveDoc = await addDoc(collection(db, "menu"), menuModel.value );
        //clearMenuModel();
        //console.log("Document written with ID: ", saveDoc.id);
        toast.add({ severity: 'success', summary: 'Exito', detail: 'Los datos se han guardado.', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
    }
}; 


</script>

<template>
        <!--<div class="col-12 xl:col-6">
            
            <div class="card">
                <h5>Recent Sales</h5>
                <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column style="width: 15%">
                        <template #header> Image </template>
                        <template #body="slotProps">
                            <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" width="50" class="shadow-2" />
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                    <Column field="price" header="Price" :sortable="true" style="width: 35%">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column style="width: 15%">
                        <template #header> View </template>
                        <template #body>
                            <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <h5>Best Selling Products</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                        <Menu ref="menu2" :popup="true" :model="items"></Menu>
                    </div>
                </div>
                <ul class="list-none p-0 m-0">
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                            <div class="mt-1 text-600">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-orange-500 h-full" style="width: 50%"></div>
                            </div>
                            <span class="text-orange-500 ml-3 font-medium">%50</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium">%16</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-pink-500 h-full" style="width: 67%"></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium">%67</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                            <div class="mt-1 text-600">Office</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-green-500 h-full" style="width: 35%"></div>
                            </div>
                            <span class="text-green-500 ml-3 font-medium">%35</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-purple-500 h-full" style="width: 75%"></div>
                            </div>
                            <span class="text-purple-500 ml-3 font-medium">%75</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                            <div class="mt-1 text-600">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-teal-500 h-full" style="width: 40%"></div>
                            </div>
                            <span class="text-teal-500 ml-3 font-medium">%40</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

         <div class="col-12 xl:col-6"> 
            <div class="card">
                <h5>Sales Overview</h5>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Notifications</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items"></Menu>
                    </div>
                </div>

                <span class="block text-600 font-medium mb-3">TODAY</span>
                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-dollar text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >Richard Jones
                            <span class="text-700">has purchased a blue t-shirt for <span class="text-blue-500">79$</span></span>
                        </span>
                    </li>
                    <li class="flex align-items-center py-2">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-download text-xl text-orange-500"></i>
                        </div>
                        <span class="text-700 line-height-3">Your request for withdrawal of <span class="text-blue-500 font-medium">2500$</span> has been initiated.</span>
                    </li>
                </ul>

                <span class="block text-600 font-medium mb-3">YESTERDAY</span>
                <ul class="p-0 m-0 list-none">
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-dollar text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >Keyser Wick
                            <span class="text-700">has purchased a black jacket for <span class="text-blue-500">59$</span></span>
                        </span>
                    </li>
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-question text-xl text-pink-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >Jane Davis
                            <span class="text-700">has posted a new questions about your product.</span>
                        </span>
                    </li>
                </ul>
            </div>
            <div
                class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                style="border-radius: 1rem; background: linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%)"
            >
                <div>
                    <div class="text-blue-100 font-medium text-xl mt-2 mb-3">TAKE THE NEXT STEP</div>
                    <div class="text-white font-medium text-5xl">Try PrimeBlocks</div>
                </div>
                <div class="mt-4 mr-auto md:mt-0 md:mr-0">
                    <a href="https://www.primefaces.org/primeblocks-vue" class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"> Get Started </a>
                </div>
            </div>
        </div> -->
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
