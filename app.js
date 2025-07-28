const passwordInput = document.getElementById('password');
const adminArea = document.getElementById('admin-area');
const fileInput = document.getElementById('file');
const linkInput = document.getElementById('link');
const itemsContainer = document.getElementById('items');
const searchInput = document.getElementById('search');

const PASSWORD = 'admin';

let isAdmin = false;

passwordInput.addEventListener('input', () => {
  if (passwordInput.value === PASSWORD) {
    adminArea.style.display = 'block';
    isAdmin = true;
  } else {
    adminArea.style.display = 'none';
    isAdmin = false;
  }
  renderItems();
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
  };
  reader.readAsDataURL(file);
});

function saveItem(item) {
  const items = getItems();
  items.unshift(item);
  localStorage.setItem('shared_items', JSON.stringify(items));
}

function getItems() {
  return JSON.parse(localStorage.getItem('shared_items') || '[]');
}

function deleteItem(id) {
  const items = getItems().filter(item => item.id !== id);
  localStorage.setItem('shared_items', JSON.stringify(items));
  renderItems();
}

function renderItems() {
  const items = getItems();
  const search = searchInput.value.toLowerCase();
  itemsContainer.innerHTML = '';
  items
    .filter(item => item.content.toLowerCase().includes(search))
    .forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      if (item.type === 'link') {
        div.innerHTML = `<a href="${item.content}" target="_blank">🔗 ${item.content}</a>`;
      } else {
        div.innerHTML = `<p>📎 ${item.filename}</p><a href="${item.content}" download="${item.filename}">Herunterladen</a>`;
      }
      // Löschen-Button nur anzeigen, wenn Admin
      if (isAdmin) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = () => deleteItem(item.id);
        div.appendChild(deleteBtn);
      }
      itemsContainer.appendChild(div);
    });
}

searchInput.addEventListener('input', renderItems);
renderItems();
