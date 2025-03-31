document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const findBtn = document.getElementById('findBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const formContainer = document.getElementById('formContainer');
  const messageEl = document.getElementById('message');
  const resultsEl = document.getElementById('results');

  // Show add pet form
  addBtn.addEventListener('click', () => {
    formContainer.innerHTML = `
      <div class="form">
        <h3>Добавить нового питомца</h3>
        <div>
          <label for="petId">ID:</label>
          <input type="number" id="petId" name="petId">
        </div>
        <div>
          <label for="petName">Имя:</label>
          <input type="text" id="petName" name="petName">
        </div>
        <div>
          <label for="petStatus">Статус:</label>
          <select id="petStatus" name="petStatus">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <button id="submitAdd">Добавить</button>
      </div>
    `;

    document.getElementById('submitAdd').addEventListener('click', handleAddPet);
  });

  // Show find pets form
  findBtn.addEventListener('click', () => {
    formContainer.innerHTML = `
      <div class="form">
        <h3>Найти питомцев по статусу</h3>
        <div>
          <label for="searchStatus">Статус:</label>
          <select id="searchStatus" name="searchStatus">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <button id="submitFind">Найти</button>
      </div>
    `;

    document.getElementById('submitFind').addEventListener('click', handleFindPets);
  });

  // Show delete pet form
  deleteBtn.addEventListener('click', () => {
    formContainer.innerHTML = `
      <div class="form">
        <h3>Удалить питомца</h3>
        <div>
          <label for="deleteId">ID питомца:</label>
          <input type="number" id="deleteId" name="deleteId">
        </div>
        <button id="submitDelete">Удалить</button>
      </div>
    `;

    document.getElementById('submitDelete').addEventListener('click', handleDeletePet);
  });

  // Handle add pet
  async function handleAddPet() {
    const id = document.getElementById('petId').value;
    const name = document.getElementById('petName').value;
    const status = document.getElementById('petStatus').value;

    if (!id || !name) {
      showMessage('Пожалуйста, заполните все поля', 'error');
      return;
    }

    const petData = {
      id: parseInt(id),
      category: {
        id: 0,
        name: "pets"
      },
      name: name,
      photoUrls: [
        "https://example.com/pet.jpg"
      ],
      tags: [
        {
          id: 0,
          name: "tag1"
        }
      ],
      status: status
    };

    try {
      const response = await fetch('https://petstore.swagger.io/v2/pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      showMessage(`Питомец успешно добавлен!`, 'success');
      displayResults([data]);
    } catch (error) {
      showMessage(`Ошибка при добавлении питомца: ${error.message}`, 'error');
    }
  }

  // Handle find pets by status
  async function handleFindPets() {
    const status = document.getElementById('searchStatus').value;

    try {
      const response = await fetch(`https://petstore.swagger.io/v2/pet/findByStatus?status=${status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      showMessage(`Найдено ${data.length} питомцев со статусом ${status}`, 'success');
      displayResults(data);
    } catch (error) {
      showMessage(`Ошибка при поиске питомцев: ${error.message}`, 'error');
      displayResults([]);
    }
  }

  // Handle delete pet
  async function handleDeletePet() {
    const petId = document.getElementById('deleteId').value;

    if (!petId) {
      showMessage('Пожалуйста, введите ID питомца', 'error');
      return;
    }

    try {
      const response = await fetch(`https://petstore.swagger.io/v2/pet/${petId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showMessage(`Питомец с ID ${petId} успешно удален`, 'success');
      displayResults([]);
    } catch (error) {
      showMessage(`Ошибка при удалении питомца: ${error.message}`, 'error');
    }
  }

  // Show message
  function showMessage(message, type = 'info') {
    messageEl.textContent = message;
    messageEl.style.backgroundColor = type === 'error' ? '#ffebee' : '#e7f3fe';
    messageEl.style.borderLeftColor = type === 'error' ? '#f44336' : '#2196F3';
  }

  // Display results
  function displayResults(pets) {
    if (pets.length === 0) {
      resultsEl.innerHTML = '';
      return;
    }

    let html = '<h2>Результаты:</h2>';
    pets.forEach(pet => {
      html += `
        <div class="pet-card">
          <p><strong>ID:</strong> ${pet.id}</p>
          <p><strong>Имя:</strong> ${pet.name}</p>
          <p><strong>Статус:</strong> ${pet.status}</p>
        </div>
      `;
    });

    resultsEl.innerHTML = html;
  }
});