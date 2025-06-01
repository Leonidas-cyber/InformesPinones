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
        // Agregar esta función después de la inicialización de Firebase

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
            // ... resto de tu código de inicialización
        });

  // Lista completa de miembros organizados por grupos
const groupsData = {
    1: {
        name: "Grupo 1",
        supervisor: "Abraham González",
        members: [
            "Abraham González", "Oscar Sanchez", "Violeta Gómez de González", "Karina Alfaro",
            "Elvira Rosales", "Rocío Urban", "Dolores Ventura", "Rocío Gonzáles",
            "Denise de Sanchez", "Ruth Garcia", "Maria Eugenia Rosette", "Fernando Vazquez",
            "Fany Vazquez", "Luis Vazquez", "Gloria de Gonzalez", "Camila Gonzalez",
            "Marisol Cortez", "Maria Q. Moralez Hortega"
        ]
    },
    2: {
        name: "Grupo 2",
        supervisor: "Rafael Gómez",
        members: [
            "Rafael Gómez", "Jose Valentin Callejas", "Mariela Morales de Gómez", "Esperanza Callejas",
            "Socorro Torres", "Xavier Valencia", "Lilia Salas", "Maira Osorio",
            "Guillermo Barrios", "Dulce Barrios", "Rocio Hernandez", "Silvia Reyes",
            "Claudia Cornejo", "Rosalinda Abasolo", "Patricia Matamoros", "Paola Cornejo",
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
            "Daniel Aco", "Blanca de Montoya", "Manolo Montoya", "Jose Luis Lopez",
            "Amparo Gonzalez", "Elia Gonzalez"
        ]
    },
    4: {
        name: "Grupo 4",
        supervisor: "Rogelio Teliz",
        members: [
            "Rogelio Teliz", "Kevin Rico", "Andrea Teliz", "Jenifer Rico",
            "Carolina Monroy", "Mary Patron", "Estela Ramirez de Silva", "Carmen Garcia",
            "Bertha Chino", "Cesia Malpica", "Soara Malpica", "Scarlett Malpica",
            "Mireya Franco de Gonzalez", "Rosario Medina de Ovalle", "Susana Alvarado",
            "Antonio Carlin", "Enriqueta Lopez de Carlin", "Delia Diaz"
        ]
    },
    5: {
        name: "Grupo 5",
        supervisor: "Alberto Glez. Pacheco",
        members: [
            "Alberto Glez. Pacheco", "Gabriel Diaz Tena", "Mireya de Diaz", "Grizelda de Vazquez",
            "Moises Vazquez", "Jaziel Vazquez", "Abigail Vazquez", "Dinora Cornejo",
            "Irma de Diaz", "Irma de Cruz", "Miguel Diaz", "Sabino Martinez",
            "Nadia Martinez", "Estela Ortega", "Leonardo Glez Pacheco", "Blanca Aguilera de Flores",
            "Sebastian Cruz", "Alejandra Martinez de Hdez."
        ]
    }
};

        let deliveredReports = new Set();

        // Función para normalizar nombres (eliminar acentos, puntos, espacios extra)
        function normalizeString(str) {
            return str
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
                .replace(/[.,]/g, '') // Eliminar puntos y comas
                .replace(/\s+/g, ' ') // Normalizar espacios
                .trim();
        }

        // Función mejorada para encontrar coincidencias
        function findMatchingMember(reportName, allMembers) {
            // 1. Coincidencia exacta
            const exactMatch = allMembers.find(member => member === reportName);
            if (exactMatch) return exactMatch;
            
            // 2. Coincidencia sin puntuación
            const cleanReportName = reportName.replace(/[.,]/g, '').trim();
            const cleanMatch = allMembers.find(member => 
                member.replace(/[.,]/g, '').trim() === cleanReportName
            );
            if (cleanMatch) return cleanMatch;
            
            // 3. Coincidencia normalizada (sin acentos, case insensitive)
            const normalizedReport = normalizeString(reportName);
            const normalizedMatch = allMembers.find(member => 
                normalizeString(member) === normalizedReport
            );
            if (normalizedMatch) return normalizedMatch;
            
            // 4. Coincidencia por nombre principal (primer nombre)
            const firstName = normalizedReport.split(' ')[0];
            if (firstName.length > 3) {
                const firstNameMatch = allMembers.find(member => 
                    normalizeString(member).split(' ')[0] === firstName
                );
                if (firstNameMatch) return firstNameMatch;
            }
            
            // 5. Coincidencia parcial (al menos 2 palabras coinciden)
            const reportWords = normalizedReport.split(' ').filter(w => w.length > 2);
            return allMembers.find(member => {
                const memberWords = normalizeString(member).split(' ').filter(w => w.length > 2);
                const matchingWords = reportWords.filter(rWord => 
                    memberWords.some(mWord => mWord.includes(rWord) || rWord.includes(mWord))
                );
                return matchingWords.length >= 2;
            });
        }

        // Función para cargar informes desde Firebase - VERSIÓN CORREGIDA
        async function loadReportsFromFirebase() {
            try {
                console.log('🔄 Cargando informes desde Firebase...');
                const snapshot = await database.ref('users').once('value');
                const data = snapshot.val();
                
                deliveredReports.clear();
                
                if (data) {
                    console.log('📊 Datos encontrados en Firebase:', Object.keys(data).length, 'registros');
                    
                    // Obtener todos los miembros de todos los grupos
                    const allMembers = Object.values(groupsData).flatMap(group => group.members);
                    console.log('👥 Total miembros en lista:', allMembers.length);
                    
                    Object.values(data).forEach((report, index) => {
                        if (report.nombre) {
                            const reportName = report.nombre.trim();
                            console.log(`📝 Procesando informe ${index + 1}: "${reportName}"`);
                            
                            // Buscar coincidencia mejorada
                            const matchedMember = findMatchingMember(reportName, allMembers);
                            
                            if (matchedMember) {
                                deliveredReports.add(matchedMember);
                                console.log(`✅ COINCIDENCIA: "${matchedMember}" ← "${reportName}"`);
                            } else {
                                console.log(`❌ SIN COINCIDENCIA: "${reportName}"`);
                            }
                        }
                    });
                }
                
                console.log('📈 Total informes detectados:', deliveredReports.size);
                console.log('📋 Lista de informes entregados:', Array.from(deliveredReports).sort());
                renderGroups();
                updateStats();
            } catch (error) {
                console.error('❌ Error al cargar informes:', error);
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

        // Event listeners
        document.getElementById('groupFilter').addEventListener('change', renderGroups);
        document.getElementById('statusFilter').addEventListener('change', renderGroups);
        document.getElementById('refreshBtn').addEventListener('click', loadReportsFromFirebase);
        
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
                } else {
                    console.log('❌ No se encontraron datos en Firebase');
                }
                
                alert('Revisa la consola del navegador (F12) para ver el debug completo');
            } catch (error) {
                console.error('❌ Error en debug:', error);
            }
        });

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