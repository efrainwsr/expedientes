import imageCompression from 'browser-image-compression';
import * as yup from 'yup';

// src/config.js
export const config = {
    //apiBaseUrl: 'http://10.0.0.254:3001' // Reemplaza con la IP y puerto correctos de la api
    //apiBaseUrl: 'http://192.168.0.39:3001' 
    apiBaseUrl: 'http://localhost:3001' // Reemplaza con la IP y puerto correctos de la api
    //apiBaseUrl: 'https://kbzk6l8x-3001.use2.devtunnels.ms'
    //apiBaseUrl:   'https://r3q0t38p-3001.use2.devtunnels.ms'
  };

export const formatDate = {
  day: '2-digit',     // Día (ej: 06)
        month: '2-digit',   // Mes (ej: 10)
        year: 'numeric',    // Año (ej: 2025)
        hour: '2-digit',    // Hora (ej: 10)
        minute: '2-digit',  // Minuto (ej: 14)
        second: undefined,  // <--- CLAVE: Ignoramos los segundos
        hour12: true, 
}

export function fechaActual(){
  const actual = new Date();
  const dia = actual.getDate();
  const mes = `0${actual.getMonth() + 1}`;
  const anio = actual.getFullYear();

  return `${anio}-${mes}-${dia}`
}

 export function parseFecha(fechaStr) {
      if (!fechaStr) return null;
      const [dia, mes, anio] = fechaStr.split('/');
      return new Date(`${anio}-${mes}-${dia}`);
    }


// Utilidad para obtener fecha actual
 export function fechaActualhhmm() {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function invertDate (fecha){
  const d = new Date(`${fecha}T00:00:00`);
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${day}/${month}/${year}`
}



export function imgToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export async function compressImg(file, maxSize, WorH){
  // Opciones para la compresión de la imagen
  const options = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: WorH,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
  }  
}


export const validateForm = async (schema, formData) => {
  try {
      await schema.validate(formData, { abortEarly: false });
      return { isValid: true, errors: {} };
  } catch (err) {
      if (err instanceof yup.ValidationError) {
          const errors = err.inner.reduce((acc, error) => {
              acc[error.path] = error.message;
              return acc;
          }, {});
          return { isValid: false, errors };
      }
      throw err;
  }
};

export function resizeImage(file, maxWidth = 720, maxHeight = 720, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((maxWidth / width) * height);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round((maxHeight / height) * width);
                    height = maxHeight;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}