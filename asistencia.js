// Configuración de Firebase (reemplaza con tus propios datos)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    // Ocultar pantalla de carga
    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
    }, 1000);
    
    // Configurar año actual y anteriores en el select
    const anioSelect = document.getElementById('anio-estadisticas');
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        anioSelect.appendChild(option);
    }
    
    // Configurar fecha actual como valor por defecto
    const fechaInput = document.getElementById('fecha-asistencia');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    fechaInput.value = formattedDate;
    
    // Evento para registrar asistencia
    document.getElementById('btn-registrar').addEventListener('click', registrarAsistencia);
    
    // Evento para calcular promedios
    document.getElementById('btn-calcular').addEventListener('click', calcularPromedios);
});

async function registrarAsistencia() {
    const fecha = document.getElementById('fecha-asistencia').value;
    const tipoReunion = document.getElementById('tipo-reunion').value;
    const asistentes = parseInt(document.getElementById('asistentes').value);
    
    if (!fecha || !tipoReunion || isNaN(asistentes)) {
        alert('Por favor complete todos los campos correctamente.');
        return;
    }
    
    try {
        // Convertir fecha a objeto Date
        const fechaObj = new Date(fecha);
        const diaSemana = fechaObj.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
        
        // Determinar si es fin de semana (0=Domingo, 6=Sábado)
        const esFinSemana = diaSemana === 0 || diaSemana === 6;
        
        // Crear objeto de asistencia
        const asistenciaData = {
            fecha: fecha,
            tipoReunion: tipoReunion,
            asistentes: asistentes,
            esFinSemana: esFinSemana,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            mes: fechaObj.getMonth() + 1, // Mes (1-12)
            anio: fechaObj.getFullYear()
        };
        
        // Guardar en Firestore
        await db.collection('asistencias').add(asistenciaData);
        
        alert('Asistencia registrada correctamente!');
        document.getElementById('asistentes').value = '';
    } catch (error) {
        console.error('Error al registrar asistencia:', error);
        alert('Ocurrió un error al registrar la asistencia.');
    }
}

async function calcularPromedios() {
    const mes = parseInt(document.getElementById('mes-estadisticas').value);
    const anio = parseInt(document.getElementById('anio-estadisticas').value);
    
    try {
        // Obtener asistencias del mes y año seleccionados
        const snapshot = await db.collection('asistencias')
            .where('mes', '==', mes)
            .where('anio', '==', anio)
            .get();
        
        if (snapshot.empty) {
            alert('No hay datos de asistencia para el mes seleccionado.');
            return;
        }
        
        let totalSemana = 0;
        let countSemana = 0;
        let totalFinSemana = 0;
        let countFinSemana = 0;
        let totalMensual = 0;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            totalMensual += data.asistentes;
            
            if (data.esFinSemana) {
                totalFinSemana += data.asistentes;
                countFinSemana++;
            } else {
                totalSemana += data.asistentes;
                countSemana++;
            }
        });
        
        // Calcular promedios
        const promedioSemana = countSemana > 0 ? Math.round(totalSemana / countSemana) : 0;
        const promedioFinSemana = countFinSemana > 0 ? Math.round(totalFinSemana / countFinSemana) : 0;
        
        // Mostrar resultados
        document.getElementById('promedio-semana').textContent = promedioSemana;
        document.getElementById('promedio-fin-semana').textContent = promedioFinSemana;
        document.getElementById('total-mensual').textContent = totalMensual;
        
    } catch (error) {
        console.error('Error al calcular promedios:', error);
        alert('Ocurrió un error al calcular los promedios.');
    }
}