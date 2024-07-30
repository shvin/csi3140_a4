document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const patientName = document.getElementById('patient-name');
  const patientCode = document.getElementById('patient-code');
  const waitTimeDiv = document.getElementById('wait-time');
  const patientTable = document.getElementById('patient-table').getElementsByTagName('tbody')[0];
  const updateTimesButton = document.getElementById('update-times');

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = patientName.value;
      const code = patientCode.value;

      fetch('server.php?action=checkWaitTime', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, code }),
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              waitTimeDiv.textContent = `Approximate Wait Time: ${data.waitTime} minutes`;
          } else {
              waitTimeDiv.textContent = 'Error: ' + data.message;
          }
      })
      .catch(error => {
          console.error('Error:', error);
          waitTimeDiv.textContent = 'Error checking wait time.';
      });
  });

  updateTimesButton.addEventListener('click', function() {
      fetch('server.php?action=updateTimes')
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              updatePatientTable(data.patients);
          } else {
              alert('Error updating wait times.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error updating wait times.');
      });
  });

  function updatePatientTable(patients) {
      patientTable.innerHTML = '';
      patients.forEach(patient => {
          const row = patientTable.insertRow();
          row.insertCell(0).textContent = patient.name;
          row.insertCell(1).textContent = patient.code;
          row.insertCell(2).textContent = patient.severity;
          row.insertCell(3).textContent = patient.waitTime;
      });
  }

  // Initial load
  fetch('server.php?action=getPatients')
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          updatePatientTable(data.patients);
      } else {
          alert('Error loading patients.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error loading patients.');
  });
});
