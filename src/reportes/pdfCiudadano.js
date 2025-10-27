
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import {getAllDet, getTotalDetOrg} from '../service/reportesService.js'
import { buscarCiudadano, getDelitosCiudadano } from '../service/ciudadanoService.js'
import { getMunicipios, getParroquias, getEstados } from '../service/ubicacionService.js'
import { fechaActualhhmm } from '../utils.js' 

const pageHeight = 792
const pageWidth = 612
const rowsPerPage = 18 // Ajusta según el espacio disponible en páginas de delitos


function centrarTexto(text, font, size) {
  const subtitleWidth = font.widthOfTextAtSize(text, size)
  const subtitleX = (pageWidth / 2) - (subtitleWidth / 2)
  //console.log("subtitleX", subtitleX)
  return subtitleX
}

async function direccion(ciudadanoData){
  const estado = await getEstados().then(estados => estados.data.find(e => e.id_estado === ciudadanoData.id_estado)?.estado || '')
  const municipio = await getMunicipios(ciudadanoData.id_estado).then(municipios => municipios.data.find(m => m.id_municipio === ciudadanoData.id_municipio)?.municipio || '')
  const parroquia = await getParroquias(ciudadanoData.id_municipio).then(parroquias => parroquias.data.find(p => p.id_parroquia === ciudadanoData.id_parroquia)?.parroquia || '')

  return {
    estado: estado,
    municipio: municipio,
    parroquia: parroquia,
    direccion1: ciudadanoData.direccion || ''
  }
}

// Función auxiliar (debes definirla, o usar librerías si estás en un entorno específico)
const base64ToUint8Array = (base64) => {
  // 1. Quitar el prefijo si existe
  const base64Data = base64.includes('base64,') 
    ? base64.split('base64,')[1] 
    : base64;

  // 2. Decodificar
  const binaryString = atob(base64Data); // 'atob' es global en navegadores
  
  // 3. Convertir a Uint8Array
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export async function pdfCiudadano(cedula){

  //Obtencion de los datos del ciudadano y sus delitos
  const cRes = await buscarCiudadano(cedula);
  const ciudadanoData = cRes.data[0];
  const dRes = await getDelitosCiudadano(ciudadanoData.id_ciudadano); 
  const delitosData = dRes.data;
  const dir = await direccion(ciudadanoData)

  // Crear documento PDF
  const pdfDoc = await PDFDocument.create()
  
  // Cargar imágenes (desde public/)
  const imageBytes = await fetch('public/redcrim.jpg').then(res => res.arrayBuffer())
  const footerBytes = await fetch('public/imgfooter.png').then(res => res.arrayBuffer())
  
  const ciudadanoBytes = ciudadanoData.foto != "" ? base64ToUint8Array(ciudadanoData.foto) : await fetch('public/person-icon.jpg').then(res => res.arrayBuffer());
  
  const foto = await pdfDoc.embedJpg(ciudadanoBytes);
  const image = await pdfDoc.embedJpg(imageBytes)
  const footer = await pdfDoc.embedPng(footerBytes)
  const logoSize = 56

  // Fuentes
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  //Header 
  const posLogo = { x: pageWidth - logoSize - 20, y: pageHeight - logoSize - 20 }
  const subtitleText = 'ANTECEDENTES POLICIALES'
  const subtitleCicpc = 'CUERPO DE INVESTIGACIONES CIENTÍFICAS, PENALES Y CRIMINALÍSTICAS'
  const subtitleDelegacion = 'DELEGACIÓN MUNICIPAL GUAYANA'
  const subtitleSize = 12
  
  const footerText = 'Sistema integrado de reseñas internas para detenidos'
  const footerSize = 7

  

  function drawHeaderFooter(page, pageIndex, totalPages) {

    //Header, emision y logo
    const now = `EMISIÓN: ${fechaActualhhmm()}`
    page.drawText(now, { x: 50, y: pageHeight - 35, size: 6, font: regularFont })
    page.drawImage(image, { x: posLogo.x, y: posLogo.y, width: logoSize, height: logoSize })

    
    //Subtitulos y rango de fechas
    const xSub = centrarTexto(subtitleText, boldFont, subtitleSize)
    const xCicpc = centrarTexto(subtitleCicpc, boldFont, subtitleSize)
    const xDelegacion = centrarTexto(subtitleDelegacion, boldFont, subtitleSize)


    page.drawText(subtitleCicpc, { x: xCicpc, y: 735, size: subtitleSize, font: boldFont })
    page.drawText(subtitleDelegacion, { x: xDelegacion, y: 723, size: subtitleSize, font: boldFont })
    page.drawText(subtitleText, { x: xSub, y:690 , size: subtitleSize, font: boldFont })
    //page.drawText(fecha, { x: 50, y: 600, size: 10, font: boldFont })

    // Footer
    page.drawImage(footer, { x: 45, y: 15, width: 154, height: 48 })
    const footerWidth = boldFont.widthOfTextAtSize(footerText, footerSize)
    const footerPosX = (pageWidth / 2) - (footerWidth / 2)
    page.drawText(footerText, { x: footerPosX, y: 25, size: footerSize, font: boldFont })

    
    //Contador de paginas
    if (typeof totalPages === 'number') {
      const pageCountText = `Página ${pageIndex + 1} de ${totalPages}`
      const pageCountWidth = regularFont.widthOfTextAtSize(pageCountText, 10)
      page.drawText(pageCountText, { x: pageWidth - pageCountWidth - 50, y: 25, size: 10, font: regularFont })
    }
  }

  // Preparar array de delitos (si existen) y calcular total de páginas
  const delitos = (!delitosData || delitosData === false || delitosData.length === 0) ? [] : delitosData.map(d => ({
    expediente: d.expediente || '',
    fecha: d.fecha_detencion ? new Date(d.fecha_detencion).toLocaleString('es-VE') : '',
    lugar: d.lugar_detencion || '',
    delito: d.nombre_delito || d.delito_desc || '',
    org: d.org_nombre || d.org_siglas || '',
    // nuevos campos: fecha de registro y usuario que registró
    fecha_registro: d.fecha_registro ? new Date(d.fecha_registro).toLocaleString('es-VE') : (d.created_at ? new Date(d.created_at).toLocaleString('es-VE') : ''),
    //registrado_por: ((d.u_nombre || '') + ' ' + (d.u_apellido || '')).trim() || d.u_username || d.u_cedula || ''
    registrado_por: (d.u_username)
  
  }))

  const totalDelPages = delitos.length > 0 ? Math.ceil(delitos.length / rowsPerPage) : 0
  const totalPages = 1 + totalDelPages

  // === Primera página: datos del ciudadano ===
  const firstPage = pdfDoc.addPage([pageWidth, pageHeight])
  drawHeaderFooter(firstPage, 0, totalPages)

  // Datos del ciudadano - ajusta campos según ciudadanoData
  let y = 500
  const leftX = 60

  //FOTO DEL CIUDADANO
  firstPage.drawImage(foto, { x: leftX, y: y, width: foto.width *0.2, height: foto.height *0.2 })
  y -= 35

  firstPage.drawText(`DATOS PERSONALES`, { x: leftX, y: y, size: 12, font: boldFont })
  y -= 22
  firstPage.drawText(`CEDULA: ${ciudadanoData.cedula || ''}`, { x: leftX, y: y, size: 12, font: regularFont })
  y -= 20
  firstPage.drawText(`NOMBRES: ${(ciudadanoData.nombres || '').toUpperCase()}`, { x: centrarTexto(ciudadanoData.nombres || '', regularFont, 12)+15, y: y, size: 12, font: regularFont })
  //y -= 18
  firstPage.drawText(`APELLIDOS: ${ciudadanoData.apellidos.toUpperCase() || ''}`, { x: leftX, y: y, size: 12, font: regularFont })
  y -= 18
  firstPage.drawText(`FECHA DE NACIMIENTO: ${ciudadanoData.fecha_nacimiento || ''}`, { x: leftX, y: y, size: 12, font: regularFont })
  y -= 18
  firstPage.drawText(`ALIAS: ${(ciudadanoData.alias || 'No posee.').toUpperCase()}`, { x: leftX, y: y, size: 12, font: regularFont })
  y -= 18
  const sexoText = (ciudadanoData.sexo || '').toString().toUpperCase() === 'M' ? 'MASCULINO' : ((ciudadanoData.sexo || '').toString().toUpperCase() === 'F' ? 'FEMENINO' : '')
  firstPage.drawText(`SEXO: ${sexoText}`, { x: leftX, y: y, size: 12, font: regularFont })
  y -= 35


  firstPage.drawText(`DATOS DE UBICACIÓN`, { x: leftX, y: y, size: 12, font: boldFont })
  y-= 22

  /*firstPage.drawText(`ESTADO: ${dir.estado || ''}`, {  x: leftX, y: y, size: 12, font: regularFont })
   y -= 18
  firstPage.drawText(`MUNICIPIO: ${dir.municipio || ''}`, {  x: leftX, y: y, size: 12, font: regularFont })
   y -= 18
  firstPage.drawText(`PARROQUIA: ${dir.parroquia || ''}`, {  x: leftX, y: y, size: 12, font: regularFont })
   y -= 18
  firstPage.drawText(`TELÉFONO: ${ciudadanoData.telefono || ''}`, { x: leftX, y: y, size: 12, font: regularFont })*/

  firstPage.drawText(`ESTADO: ${dir.estado || ''}`, {  x: leftX, y: y, size: 12, font: regularFont })

  firstPage.drawText(`MUNICIPIO: ${dir.municipio || ''}`, {  x: leftX+140, y: y, size: 12, font: regularFont })

  firstPage.drawText(`PARROQUIA: ${dir.parroquia || ''}`, {  x: leftX+320, y: y, size: 12, font: regularFont })
  y -= 18
  firstPage.drawText(`TELÉFONO: ${ciudadanoData.telefono || ''}`, { x: leftX, y: y, size: 12, font: regularFont })




  //firstPage.drawText('Delitos registrados:', { x: leftX, y: y, size: 13, font: boldFont })

  // Si no hay delitos, indicarlo y terminar
  if (delitos.length === 0) {
    firstPage.drawText('SIN DELITOS REGISTRADOS.', { x: leftX, y: y - 35, size: 14, font: boldFont })
  } else {
    // Mostraremos cada delito en un bloque (varias líneas) con separación considerable.
    // Definir área disponible para contenido (máximo y mínimo Y)
    const contentTop = 580 // inicio del contenido en Y
    const contentBottom = 90 // margen inferior por footer

    

  // Altura estimada por bloque (ajustable): ahora tenemos más líneas (incluye fecha registro y registrado por)
  const blockHeight = 110
    const blocksPerPage = Math.max(1, Math.floor((contentTop - contentBottom) / blockHeight))
    const totalDelPagesBlocks = Math.ceil(delitos.length / blocksPerPage)
    const totalPagesBlocks = 1 + totalDelPagesBlocks

    for (let p = 0; p < totalDelPagesBlocks; p++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight])

      page.drawText(`CIUDADANO: ${ciudadanoData.nombres.toUpperCase()} ${ciudadanoData.apellidos.toUpperCase()} `, { x: leftX, y: 650, size: 12, font: boldFont })
      page.drawText(`C.I: ${ciudadanoData.cedula}`, { x: leftX, y: 632, size: 12, font: boldFont })
      page.drawText(`DELITOS ASOCIADOS: ${delitosData.length}`, { x: leftX, y: 614, size: 12, font: boldFont })




      drawHeaderFooter(page, p + 1, totalPagesBlocks)

      let currentY = contentTop
      const startIdx = p * blocksPerPage
      const endIdx = Math.min(startIdx + blocksPerPage, delitos.length)

      for (let i = startIdx; i < endIdx; i++) {
        const d = delitos[i]
  // Dibujar un rectángulo de fondo suave opcional (cubre todo el bloque)
  page.drawRectangle({ x: leftX - 6, y: currentY - blockHeight + 23, width: pageWidth - (leftX * 2) + 12, height: blockHeight - 12, color: rgb(0.98, 0.98, 0.98) })

        // Líneas del bloque
        const lineSize = 11
        const gap = 4
        let ly = currentY

        page.drawText(`EXPEDIENTE: ${d.expediente || ''}`, { x: leftX, y: ly, size: lineSize, font: boldFont })
        ly -= (lineSize + gap)

        page.drawText(`FECHA DE DETENCIÓN: ${d.fecha || ''}`, { x: leftX, y: ly, size: lineSize, font: regularFont })
        ly -= (lineSize + gap)

        page.drawText(`LUGAR DE DETENCIÓN: ${d.lugar || ''}`, { x: leftX, y: ly, size: lineSize, font: regularFont })
        ly -= (lineSize + gap)

        page.drawText(`DELITO: ${d.delito || ''}`, { x: leftX, y: ly, size: lineSize, font: regularFont, maxWidth: pageWidth - (leftX * 2) })
        ly -= (lineSize + gap)

        page.drawText(`ORGANISMO APREHENSOR: ${d.org || ''}`, { x: leftX, y: ly, size: lineSize, font: regularFont })
        ly -= (lineSize + gap + 5)

  page.drawText(`FECHA DE REGISTRO: ${d.fecha_registro || ''}`, { x: leftX, y: ly, size: 8, font: regularFont })

  page.drawText(`REGISTRADO POR EL USUARIO: ${d.registrado_por || ''}`, { x: leftX + 230, y: ly, size: 8, font: regularFont })

        // Separador (línea fina)
        page.drawLine({ start: { x: leftX, y: ly - 8 }, end: { x: pageWidth - leftX, y: ly - 8 }, thickness: 0.5, color: rgb(0.75,0.75,0.75) })

        // Avanzar al siguiente bloque
        currentY -= blockHeight
      }
    }
  }

  // Descargar PDF en el navegador
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'reporte.pdf'
  link.click()

}


