// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyANSEcsrnbzVJ8i6-eOqv-pewPaeImdORg",
    authDomain: "pinones-congre.firebaseapp.com",
    databaseURL: "https://pinones-congre-default-rtdb.firebaseio.com",
    projectId: "pinones-congre",
    storageBucket: "pinones-congre.appspot.com",
    messagingSenderId: "1031984043314",
    appId: "1:1031984043314:web:49b38b2c60d69601d3732b",
    measurementId: "G-SR373KE6RX"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Mostrar botón Debug solo para un correo específico
function checkAdminAccess() {
    firebase.auth().onAuthStateChanged((user) => {
        const debugBtn = document.getElementById('debugBtn');
        
        // Email del único administrador autorizado
        const adminEmail = 'leonidas13456@gmail.com'; // CAMBIAR POR TU EMAIL
        
        if (user && user.email === adminEmail) {
            debugBtn.style.display = 'inline-block'; // Mostrar solo para el admin
            console.log('🔧 Administrador autorizado: Botón debug habilitado');
        } else {
            debugBtn.style.display = 'none'; // Ocultar para todos los demás
        }
    });
}

// Llamar la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
});

// Lista completa de miembros organizados por grupos
const groupsData = {
    1: {
        name: "Grupo 1",
        supervisor: "Abraham González",
        members: [
            "Abraham González", "Oscar Sanchez", "Violeta Gómez de González", "Karina Alfaro",
            "Elvira Rosales", "Rocío Urban", "Dolores Ventura", "Rocío González García",
            "Denise de Sanchez", "Ruth Garcia", "Maria Eugenia Rosette", "Juan Fernando Vazquez",
            "Fany Vazquez", "Luis Fernando Vazquez", "Gloria de Gonzalez", "Camila Gonzalez",
            "Marisol Cortez", "Maria Q. Moralez Hortega"
        ]
    },
    2: {
        name: "Grupo 2",
        supervisor: "Rafael Gómez",
        members: [
            "Rafael Gómez", "Jose Valentin Callejas", "Mariela Morales de Gómez", "Esperanza Callejas",
            "Maria del Socorro Torres Cedillo", "Xavier Valencia", "Lilia Salas", "Maira Osorio",
            "Guillermo Barrios", "Dulce Barrios", "Rocio Hernandez de Barrios", "Silvia Reyes",
            "Claudia Cornejo", "Rosalinda Cruz Sosa de Abasolo", "Patricia Matamoros", "Paola Cornejo",
            "Dominga Ventura", "Monserrat Caro del Castillo"
        ]
    },
    3: {
        name: "Grupo 3",
        supervisor: "David Novoa",
        members: [
            "David Novoa", "Uriel Salazar", "Rosa María Pérez de Novoa", "Nayely Peredo de Salazar",
            "Susana Acosta", "Alejandro Juarez", "Eduardo Lopez", "Norma de Lopez",
            "Angelica Lopez", "Anselmo Aco", "Veronica de Aco", "Fernanda Aco",
            "Daniel Aco", "Blanca de Montoya", "Manolo Montoya", "José Luis López Fernández",
            "Amparo Gonzalez", "Elia Gonzalez"
        ]
    },
    4: {
        name: "Grupo 4",
        supervisor: "Rogelio Teliz",
        members: [
            "Rogelio Teliz", "Kevin Rico", "Andrea Teliz", "Jenniffer Rico",
            "Carolina Monroy", "Mary Patron", "María Estela Ramirez de Silva", "Carmen Garcia",
            "Bertha Chino", "Cesiah Malpica", "Zohara Malpica", "Scarlett Malpica",
            "Mireya Franco de Gonzalez", "Maria del Rosario Ovalle Rosas", "Susana Alvarado Rodriguez",
            "Antonio Carlin", "Enriqueta Lopez de Carlin", "Delia Diaz"
        ]
    },
    5: {
        name: "Grupo 5",
        supervisor: "Alberto Glez. Pacheco",
        members: [
            "Alberto Glez. Pacheco", "Gabriel Diaz Tena", "Mireya García de Diaz", "Grizelda de Vazquez",
            "Moises Vazquez", "Jaziel Vazquez", "Abigail Vazquez", "Dinorah Cornejo",
            "Irma de Diaz", "Irma de Cruz", "Miguel Diaz", "Sabino Martinez",
            "Nadia Diaz Campillo", "María Estela Ortega Rodriguez", "Leonardo Glez Pacheco", "Blanca Aguilera de Flores",
            "Sebastian Cruz", "Alejandra Martinez de Hdez."
        ]
    }
};

let deliveredReports = new Set();

// ====== ALGORITMO DE COINCIDENCIA MEJORADO ======

// Función mejorada para normalizar nombres
function normalizeString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[.,\-_]/g, ' ') // Reemplazar puntos, comas, guiones por espacios
        .replace(/\s+/g, ' ') // Normalizar múltiples espacios a uno solo
        .trim();
}

// Función para calcular distancia de Levenshtein (similitud de strings)
function levenshteinDistance(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitución
                    matrix[i][j - 1] + 1,     // inserción
                    matrix[i - 1][j] + 1      // eliminación
                );
            }
        }
    }

    return matrix[len2][len1];
}

// Función para calcular porcentaje de similitud
function calculateSimilarity(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    const distance = levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
}

// Función para extraer palabras clave de un nombre
function extractKeywords(name) {
    const normalized = normalizeString(name);
    const words = normalized.split(' ').filter(word => word.length > 2);
    
    // Filtrar palabras comunes que no son útiles para la coincidencia
    const stopWords = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'o', 'u'];
    return words.filter(word => !stopWords.includes(word));
}

// Función principal mejorada para encontrar coincidencias - VERSIÓN MÁS PERMISIVA
function findMatchingMember(reportName, allMembers) {
    if (!reportName || !reportName.trim()) return null;
    
    const cleanReportName = reportName.trim();
    const normalizedReport = normalizeString(cleanReportName);
    
    console.log(`    🔍 Buscando coincidencias para: "${cleanReportName}"`);
    console.log(`    📝 Normalizado: "${normalizedReport}"`);
    
    // Array para almacenar candidatos con su puntuación
    const candidates = [];
    
    for (const member of allMembers) {
        const normalizedMember = normalizeString(member);
        let score = 0;
        let matchType = '';
        
        // 1. Coincidencia exacta (puntuación máxima)
        if (member === cleanReportName) {
            console.log(`    ✅ COINCIDENCIA EXACTA: "${member}"`);
            return member;
        }
        
        // 2. Coincidencia exacta normalizada
        if (normalizedMember === normalizedReport) {
            console.log(`    ✅ COINCIDENCIA EXACTA NORMALIZADA: "${member}"`);
            return member;
        }
        
        // 3. Coincidencia sin puntuación
        const cleanMember = member.replace(/[.,\-_]/g, ' ').replace(/\s+/g, ' ').trim();
        const cleanReport = cleanReportName.replace(/[.,\-_]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanMember.toLowerCase() === cleanReport.toLowerCase()) {
            console.log(`    ✅ COINCIDENCIA LIMPIA: "${member}"`);
            return member;
        }
        
        // 4. Similitud usando Levenshtein (UMBRAL MÁS BAJO)
        const similarity = calculateSimilarity(normalizedMember, normalizedReport);
        if (similarity >= 0.70) { // Bajado de 0.85 a 0.70
            score = Math.max(score, similarity * 85);
            matchType = 'high_similarity';
        }
        
        // 5. Coincidencia por palabras clave (MÁS PERMISIVA)
        const reportKeywords = extractKeywords(cleanReportName);
        const memberKeywords = extractKeywords(member);
        
        if (reportKeywords.length > 0 && memberKeywords.length > 0) {
            let keywordMatches = 0;
            let partialMatches = 0;
            
            for (const reportWord of reportKeywords) {
                for (const memberWord of memberKeywords) {
                    // Coincidencia exacta de palabra
                    if (reportWord === memberWord) {
                        keywordMatches++;
                        break;
                    }
                    // Coincidencia parcial (MÁS PERMISIVA)
                    else if (reportWord.length > 2 && memberWord.length > 2) { // Bajado de 3 a 2
                        if (reportWord.includes(memberWord) || memberWord.includes(reportWord)) {
                            partialMatches++;
                            break;
                        }
                        // Nueva: similitud entre palabras individuales
                        else if (calculateSimilarity(reportWord, memberWord) >= 0.75) {
                            partialMatches++;
                            break;
                        }
                    }
                }
            }
            
            const totalKeywords = Math.max(reportKeywords.length, memberKeywords.length);
            const keywordScore = ((keywordMatches * 2) + partialMatches) / (totalKeywords * 2);
            
            if (keywordScore > 0) {
                const adjustedScore = keywordScore * 75;
                if (adjustedScore > score) {
                    score = adjustedScore;
                    matchType = 'keyword_match';
                }
            }
        }
        
        // 6. Coincidencia por primer nombre (MÁS PERMISIVA)
        const reportFirstName = reportKeywords[0];
        const memberFirstName = memberKeywords[0];
        
        if (reportFirstName && memberFirstName && reportFirstName.length > 2) { // Bajado de 3 a 2
            if (reportFirstName === memberFirstName) {
                const firstNameScore = 60; // Subido de 50 a 60
                if (firstNameScore > score) {
                    score = firstNameScore;
                    matchType = 'first_name_match';
                }
            }
            // Nueva: similitud en primer nombre
            else if (calculateSimilarity(reportFirstName, memberFirstName) >= 0.8) {
                const firstNameScore = 55;
                if (firstNameScore > score) {
                    score = firstNameScore;
                    matchType = 'first_name_similar';
                }
            }
        }
        
        // 7. NUEVA: Coincidencia por contención (una string contiene a la otra)
        if (normalizedReport.length > 5 && normalizedMember.length > 5) {
            if (normalizedMember.includes(normalizedReport) || normalizedReport.includes(normalizedMember)) {
                const containmentScore = 45;
                if (containmentScore > score) {
                    score = containmentScore;
                    matchType = 'containment_match';
                }
            }
        }
        
        // Solo agregar candidatos con puntuación mínima (UMBRAL MÁS BAJO)
        if (score >= 30) { // Bajado de 40 a 30
            candidates.push({ member, score, type: matchType, similarity });
        }
    }
    
    // Ordenar candidatos por puntuación descendente
    candidates.sort((a, b) => b.score - a.score);
    
    // Log de candidatos para debugging
    if (candidates.length > 0) {
        console.log(`    📊 Candidatos encontrados:`, candidates.slice(0, 3));
    }
    
    // Retornar el mejor candidato si supera el umbral mínimo (UMBRAL MÁS BAJO)
    if (candidates.length > 0 && candidates[0].score >= 40) { // Bajado de 60 a 40
        // Para debugging, agregar información del match
        candidates[0].member._matchInfo = {
            score: candidates[0].score,
            type: candidates[0].type
        };
        console.log(`    ✅ MEJOR CANDIDATO: "${candidates[0].member}" (${candidates[0].score.toFixed(1)} pts - ${candidates[0].type})`);
        return candidates[0].member;
    }
    
    console.log(`    ❌ Sin candidatos válidos para: "${cleanReportName}"`);
    return null;
}

// ====== FUNCIONES PRINCIPALES ======

// Función para cargar informes desde Firebase - VERSIÓN CON DEBUGGING INTENSIVO
async function loadReportsFromFirebase() {
    try {
        console.log('🔄 Cargando informes desde Firebase...');
        const snapshot = await database.ref('users').once('value');
        const data = snapshot.val();
        
        deliveredReports.clear();
        const matchingLog = []; // Para debugging detallado
        
        if (data) {
            console.log('📊 Datos encontrados en Firebase:', Object.keys(data).length, 'registros');
            console.log('📄 ESTRUCTURA DE DATOS COMPLETA:', data);
            
            // Obtener todos los miembros de todos los grupos
            const allMembers = Object.values(groupsData).flatMap(group => group.members);
            console.log('👥 Total miembros en lista:', allMembers.length);
            console.log('👤 TODOS LOS MIEMBROS:', allMembers);
            
            // Mostrar todos los reportes en Firebase PRIMERO
            console.log('\n📋 TODOS LOS REPORTES EN FIREBASE:');
            Object.entries(data).forEach(([key, report], index) => {
                console.log(`${index + 1}. KEY: "${key}" | NOMBRE: "${report.nombre || 'SIN NOMBRE'}" | FECHA: "${report.fechaEnvio || 'SIN FECHA'}"`);
            });
            
            console.log('\n🔍 INICIANDO PROCESO DE COINCIDENCIAS...');
            
            Object.values(data).forEach((report, index) => {
                console.log(`\n--- PROCESANDO REPORTE ${index + 1} ---`);
                console.log('📄 Reporte completo:', report);
                
                if (report.nombre) {
                    const reportName = report.nombre.trim();
                    console.log(`📝 Nombre a procesar: "${reportName}"`);
                    
                    // DEBUGGING INTENSIVO: Probar el algoritmo paso a paso
                    console.log('🔍 Buscando coincidencias...');
                    
                    // Buscar coincidencia mejorada
                    const matchedMember = findMatchingMember(reportName, allMembers);
                    
                    if (matchedMember) {
                        deliveredReports.add(matchedMember);
                        const matchInfo = matchedMember._matchInfo || { score: 100, type: 'exact_match' };
                        matchingLog.push({
                            original: reportName,
                            matched: matchedMember,
                            score: matchInfo.score,
                            type: matchInfo.type
                        });
                        console.log(`✅ COINCIDENCIA EXITOSA: "${matchedMember}" ← "${reportName}"`);
                        console.log(`📊 Puntuación: ${matchInfo.score?.toFixed(1) || '100'} pts`);
                        console.log(`🏷️ Tipo: ${matchInfo.type || 'exact'}`);
                    } else {
                        console.log(`❌ SIN COINCIDENCIA PARA: "${reportName}"`);
                        
                        // DEBUGGING: Mostrar intentos de coincidencia
                        console.log('🔍 Intentando coincidencias manuales...');
                        const normalized = normalizeString(reportName);
                        console.log(`📝 Normalizado: "${normalized}"`);
                        
                        // Buscar coincidencias parciales manualmente para debugging
                        const partialMatches = allMembers.filter(member => {
                            const memberNorm = normalizeString(member);
                            return memberNorm.includes(normalized.split(' ')[0]) || 
                                   normalized.includes(memberNorm.split(' ')[0]);
                        });
                        
                        if (partialMatches.length > 0) {
                            console.log('🔍 Posibles coincidencias parciales encontradas:', partialMatches);
                        }
                        
                        matchingLog.push({
                            original: reportName,
                            matched: null,
                            score: 0,
                            type: 'no_match'
                        });
                    }
                } else {
                    console.log(`⚠️ Reporte ${index + 1} sin campo 'nombre':`, report);
                }
            });
            
            // Log detallado para debugging
            console.log('\n📋 RESUMEN FINAL DE COINCIDENCIAS:');
            console.log('Total reportes procesados:', Object.keys(data).length);
            console.log('Exitosas:', matchingLog.filter(m => m.matched).length);
            console.log('Fallidas:', matchingLog.filter(m => !m.matched).length);
            console.log('Set deliveredReports size:', deliveredReports.size);
            console.log('Contenido de deliveredReports:', Array.from(deliveredReports));
            
            // Mostrar coincidencias con puntuación baja (posibles falsos positivos)
            const lowScoreMatches = matchingLog.filter(m => m.matched && m.score < 80);
            if (lowScoreMatches.length > 0) {
                console.log('\n⚠️ COINCIDENCIAS CON PUNTUACIÓN BAJA (revisar):');
                lowScoreMatches.forEach(match => {
                    console.log(`- "${match.original}" → "${match.matched}" (${match.score.toFixed(1)} pts)`);
                });
            }
            
            // Mostrar nombres sin coincidencia para revisión manual
            const noMatches = matchingLog.filter(m => !m.matched);
            if (noMatches.length > 0) {
                console.log('\n❌ NOMBRES SIN COINCIDENCIA:');
                noMatches.forEach(match => {
                    console.log(`- "${match.original}"`);
                });
            }
        } else {
            console.log('❌ No hay datos en Firebase');
        }
        
        console.log('\n📈 ESTADÍSTICAS FINALES:');
        console.log('Total informes detectados:', deliveredReports.size);
        console.log('Deberían ser 90, actualmente detectados:', deliveredReports.size);
        
        renderGroups();
        updateStats();
    } catch (error) {
        console.error('❌ Error al cargar informes:', error);
        console.error('Stack trace:', error.stack);
        alert('Error al cargar datos. Verifica la consola para más detalles.');
    }
}

// Función para renderizar los grupos
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    const groupFilter = document.getElementById('groupFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    container.innerHTML = '';

    Object.entries(groupsData).forEach(([groupId, groupInfo]) => {
        if (groupFilter !== 'all' && groupFilter !== groupId) {
            return;
        }

        const deliveredMembers = groupInfo.members.filter(member => deliveredReports.has(member));
        const pendingMembers = groupInfo.members.filter(member => !deliveredReports.has(member));

        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        
        groupCard.innerHTML = `
            <div class="group-header">
                <h3 class="group-title">${groupInfo.name}</h3>
                <div class="group-stats">
                    <span class="stat-delivered">Entregados: ${deliveredMembers.length}</span>
                    <span class="stat-pending">Pendientes: ${pendingMembers.length}</span>
                </div>
            </div>
            <div class="supervisor">
                <i class="fas fa-user-tie"></i> Supervisor: ${groupInfo.supervisor}
            </div>
            <div class="members-grid">
                ${groupInfo.members.map(member => {
                    const isDelivered = deliveredReports.has(member);
                    const shouldShow = statusFilter === 'all' || 
                                     (statusFilter === 'delivered' && isDelivered) ||
                                     (statusFilter === 'pending' && !isDelivered);
                    
                    return shouldShow ? `
                        <div class="member-item">
                            <div class="member-status ${isDelivered ? 'status-delivered' : 'status-pending'}"></div>
                            <span class="member-name">${member}</span>
                            ${isDelivered ? '<i class="fas fa-check" style="color: #28a745; margin-left: auto;"></i>' : '<i class="fas fa-clock" style="color: #dc3545; margin-left: auto;"></i>'}
                        </div>
                    ` : '';
                }).join('')}
            </div>
        `;

        container.appendChild(groupCard);
    });
}

// Función para actualizar estadísticas
function updateStats() {
    const allMembers = Object.values(groupsData).flatMap(group => group.members);
    const totalMembers = allMembers.length;
    const deliveredCount = allMembers.filter(member => deliveredReports.has(member)).length;
    const pendingCount = totalMembers - deliveredCount;
    const percentage = totalMembers > 0 ? Math.round((deliveredCount / totalMembers) * 100) : 0;

    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('deliveredCount').textContent = deliveredCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('deliveryPercentage').textContent = percentage + '%';
}

// Función de utilidad para testing manual
function testMatching(reportName) {
    const allMembers = Object.values(groupsData).flatMap(group => group.members);
    const result = findMatchingMember(reportName, allMembers);
    
    console.log(`\n🧪 TEST DE COINCIDENCIA:`);
    console.log(`Entrada: "${reportName}"`);
    
    if (result) {
        const matchInfo = result._matchInfo || { score: 100, type: 'exact_match' };
        console.log(`✅ Resultado: "${result}"`);
        console.log(`📊 Puntuación: ${matchInfo.score?.toFixed(1) || '100.0'}`);
        console.log(`🏷️ Tipo: ${matchInfo.type || 'exact_match'}`);
    } else {
        console.log(`❌ Sin coincidencias encontradas`);
    }
    
    return result;
}

// FUNCIÓN DE EMERGENCIA: Algoritmo simple y muy permisivo
function findMatchingMemberSimple(reportName, allMembers) {
    if (!reportName || !reportName.trim()) return null;
    
    const cleanReport = normalizeString(reportName);
    const reportWords = cleanReport.split(' ').filter(w => w.length > 2);
    
    console.log(`    🚨 ALGORITMO SIMPLE para: "${reportName}"`);
    console.log(`    📝 Palabras clave: [${reportWords.join(', ')}]`);
    
    // 1. Buscar por primera palabra (nombre)
    if (reportWords.length > 0) {
        const firstName = reportWords[0];
        for (const member of allMembers) {
            const memberWords = normalizeString(member).split(' ');
            if (memberWords[0] === firstName) {
                console.log(`    ✅ COINCIDENCIA POR PRIMER NOMBRE: "${member}"`);
                return member;
            }
        }
    }
    
    // 2. Buscar por cualquier palabra significativa
    for (const word of reportWords) {
        if (word.length > 3) {
            for (const member of allMembers) {
                if (normalizeString(member).includes(word)) {
                    console.log(`    ✅ COINCIDENCIA POR PALABRA "${word}": "${member}"`);
                    return member;
                }
            }
        }
    }
    
    // 3. Buscar por similitud muy básica
    for (const member of allMembers) {
        const memberNorm = normalizeString(member);
        if (cleanReport.includes(memberNorm.split(' ')[0]) || 
            memberNorm.includes(cleanReport.split(' ')[0])) {
            console.log(`    ✅ COINCIDENCIA POR CONTENCIÓN: "${member}"`);
            return member;
        }
    }
    
    console.log(`    ❌ ALGORITMO SIMPLE falló para: "${reportName}"`);
    return null;
}

// Función para usar algoritmo de emergencia
async function loadReportsWithEmergencyMode() {
    try {
        console.log('🚨 MODO EMERGENCIA: Algoritmo simple y permisivo');
        const snapshot = await database.ref('users').once('value');
        const data = snapshot.val();
        
        deliveredReports.clear();
        
        if (data) {
            const allMembers = Object.values(groupsData).flatMap(group => group.members);
            console.log('👥 Total miembros:', allMembers.length);
            
            Object.values(data).forEach((report, index) => {
                if (report.nombre) {
                    const reportName = report.nombre.trim();
                    console.log(`\n📝 ${index + 1}. Procesando: "${reportName}"`);
                    
                    // Primero intentar algoritmo normal
                    let matched = findMatchingMember(reportName, allMembers);
                    
                    // Si falla, usar algoritmo simple
                    if (!matched) {
                        console.log('    🚨 Intentando algoritmo simple...');
                        matched = findMatchingMemberSimple(reportName, allMembers);
                    }
                    
                    if (matched) {
                        deliveredReports.add(matched);
                        console.log(`✅ AGREGADO: "${matched}"`);
                    } else {
                        console.log(`❌ FALLO TOTAL: "${reportName}"`);
                    }
                }
            });
        }
        
        console.log('\n📊 RESULTADOS MODO EMERGENCIA:');
        console.log('Total detectados:', deliveredReports.size);
        console.log('Lista:', Array.from(deliveredReports));
        
        renderGroups();
        updateStats();
    } catch (error) {
        console.error('❌ Error en modo emergencia:', error);
    }
}

// ====== EVENT LISTENERS ======

// Event listeners
document.getElementById('groupFilter').addEventListener('change', renderGroups);
document.getElementById('statusFilter').addEventListener('change', renderGroups);
document.getElementById('refreshBtn').addEventListener('click', loadReportsFromFirebase);

// Agregar funciones de emergencia a la consola (llamar manualmente)
window.loadEmergencyMode = loadReportsWithEmergencyMode;
window.testMatch = testMatching;
window.resetAndReload = async () => {
    deliveredReports.clear();
    console.log('🔄 Reset completo - recargando...');
    await loadReportsFromFirebase();
};

// Botón de debug para mostrar información detallada
document.getElementById('debugBtn').addEventListener('click', async () => {
    console.log('🔍 MODO DEBUG ACTIVADO');
    console.log('📋 Lista completa de miembros por grupo:');
    Object.entries(groupsData).forEach(([groupId, groupInfo]) => {
        console.log(`\n${groupInfo.name}:`);
        groupInfo.members.forEach((member, index) => {
            console.log(`  ${index + 1}. "${member}"`);
        });
    });
    
    console.log('\n🔄 Cargando datos de Firebase...');
    try {
        const snapshot = await database.ref('users').once('value');
        const data = snapshot.val();
        
        if (data) {
            console.log('\n📊 Datos en Firebase:');
            Object.entries(data).forEach(([key, report], index) => {
                console.log(`${index + 1}. ID: ${key}`);
                console.log(`   Nombre: "${report.nombre}"`);
                console.log(`   Fecha: ${report.fechaEnvio}`);
                console.log(`   Grupo: ${report.superintendente}`);
                console.log('   ---');
            });
            
            // Test de coincidencias individuales
            console.log('\n🧪 ANÁLISIS DE COINCIDENCIAS:');
            const allMembers = Object.values(groupsData).flatMap(group => group.members);
            Object.values(data).forEach((report) => {
                if (report.nombre) {
                    testMatching(report.nombre);
                }
            });
        } else {
            console.log('❌ No se encontraron datos en Firebase');
        }
        
        alert('Revisa la consola del navegador (F12) para ver el debug completo');
    } catch (error) {
        console.error('❌ Error en debug:', error);
    }
});

// ====== INICIALIZACIÓN ======

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await loadReportsFromFirebase();
    
    // Ocultar pantalla de carga
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1500);
});

// Actualizar automáticamente cada 30 segundos
setInterval(loadReportsFromFirebase, 30000);