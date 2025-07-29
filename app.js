const passwordInput = document.getElementById('password');
const adminArea = document.getElementById('admin-area');
const fileInput = document.getElementById('file');
const linkInput = document.getElementById('link');
const descriptionInput = document.getElementById('description');
const itemsContainer = document.getElementById('items');
const searchInput = document.getElementById('search');

const PASSWORD = 'admin';

let isAdmin = false;

passwordInput.addEventListener('input', () => {
  if (passwordInput.value === PASSWORD) {
    adminArea.style.display = 'block';
    isAdmin = true;
    renderItems(); // Anzeige aktualisieren, um Delete-Buttons einzublenden
  } else {
    adminArea.style.display = 'none';
    isAdmin = false;
    renderItems(); // Delete-Buttons ausblenden
  }
});

function addLink() {
  const link = linkInput.value.trim();
  if (!link) return;
  const item = {
    id: Date.now(),
    type: 'link',
    content: link,
    createdAt: new Date().toISOString()
  };
  saveItem(item);
  renderItems();
  linkInput.value = '';
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const item = {
      id: Date.now(),
      type: 'file',
      content: reader.result,
      filename: file.name,
      createdAt: new Date().toISOString()
    };
    saveItem(item);
    renderItems();
    const labelText = document.getElementById('file-label-text');
    if (labelText) labelText.textContent = file.name;
    const uploadBtn = document.querySelector('.file-upload-btn');
    if (uploadBtn) uploadBtn.textContent = file ? `📁 ${file.name}` : '📁 Datei auswählen';
  };
  reader.readAsDataURL(file);
});

function addDescription() {
  if (!isAdmin) return;
  const desc = descriptionInput.value.trim();
  if (!desc) return;
  const item = {
    id: Date.now(),
    type: 'description',
    content: desc,
    createdAt: new Date().toISOString()
  };
  saveItem(item);
  renderItems();
  descriptionInput.value = '';
}

function saveItem(item) {
  const items = getItems();
  items.unshift(item);
  localStorage.setItem('shared_items', JSON.stringify(items));
}

function getItems() {
  return JSON.parse(localStorage.getItem('shared_items') || '[]');
}

function deleteItem(id) {
  let items = getItems();
  items = items.filter(item => item.id !== id);
  localStorage.setItem('shared_items', JSON.stringify(items));
  renderItems();
}

function renderItems() {
  const items = getItems();
  const search = searchInput.value.toLowerCase();
  itemsContainer.innerHTML = '';

  items.filter(item => item.content.toLowerCase().includes(search))
       .forEach(item => {
    const div = document.createElement('div');

    let innerHTML = '';

    if (item.type === 'link') {
      div.className = 'item';
      innerHTML = `<a href="${item.content}" target="_blank">🔗 ${item.content}</a>`;
    } else if (item.type === 'file') {
      div.className = 'item';
      innerHTML = `<p>📎 ${item.filename}</p><a href="${item.content}" download="${item.filename}">Herunterladen</a>`;
    } else if (item.type === 'description') {
      div.className = 'description';
      innerHTML = `<p>${item.content}</p>`;
    }

    // Nur Admin sieht Löschen-Button
    if (isAdmin) {
      innerHTML += `<button onclick="deleteItem(${item.id})" class="delete-btn">🗑️ Löschen</button>`;
    }

    div.innerHTML = innerHTML;
    itemsContainer.appendChild(div);
  });
}

searchInput.addEventListener('input', renderItems);
