import { database } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
  const groupNameInput = document.getElementById('groupNameInput');
  const downloadReportBtn = document.getElementById('downloadReportBtn');
  const messageArea = document.getElementById('messageArea');

  downloadReportBtn.addEventListener('click', async () => {
    const groupName = groupNameInput.value.trim();

    if (!groupName) {
      messageArea.textContent = 'Por favor, ingrese un nombre de grupo.';
      return;
    }

    messageArea.textContent = 'Generando informe... Espere por favor.';

    try {
      const usersRef = database.ref('users');
      const snapshot = await usersRef.once('value');
      const allUsersData = snapshot.val();

      if (!allUsersData) {
        messageArea.textContent = 'No se encontraron datos de usuarios.';
        return;
      }

      const groupMembers = [];
      for (const user of Object.values(allUsersData)) {
        if (user.cursosBiblicos && typeof user.cursosBiblicos.superintendente === 'string') {
          if (user.cursosBiblicos.superintendente.toLowerCase().includes(groupName.toLowerCase())) {
            groupMembers.push(user);
          }
        }
      }

      if (groupMembers.length === 0) {
        messageArea.textContent = `No se encontraron miembros para el grupo: ${groupName}.`;
        return;
      }

      const headers = ['Nombre', 'Rol', 'Horas', 'Participo', 'Fecha de Envio', 'Notas', 'Superintendente'];
      let csvContent = headers.join(',') + '\n';

      for (const member of groupMembers) {
        const nombre = member.nombre ?? '';
        const rol = member.cursosBiblicos?.rol ?? '';
        const horas = member.cursosBiblicos?.horas ?? '';
        const participo = member.cursosBiblicos?.participo ?? '';
        const fechaEnvio = member.cursosBiblicos?.fechaEnvio ?? '';
        const notas = member.cursosBiblicos?.notas ?? '';
        const superintendente = member.cursosBiblicos?.superintendente ?? '';

        const row = [nombre, rol, horas, participo, fechaEnvio, notas, superintendente];
        csvContent += row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(',') + '\n';
      }

      const link = document.createElement('a');
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const sanitizedGroupName = groupName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `informe_grupo_${sanitizedGroupName}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      messageArea.textContent = 'Informe descargado exitosamente.';

    } catch (error) {
      console.error('Error generando el informe:', error);
      messageArea.textContent = 'Error al generar el informe. Revise la consola para más detalles.';
    }
  });
});
