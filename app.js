const pageTitle = document.getElementById('pageTitle');
const uploadBtn = document.getElementById('uploadInvoicesBtn');
const backdrop = document.getElementById('uploadModalBackdrop');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelUploadBtn = document.getElementById('cancelUploadBtn');
const uploadPreviewBtn = document.getElementById('uploadPreviewBtn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const filePickerBtn = document.getElementById('filePickerBtn');
const fileList = document.getElementById('fileList');
const historyBody = document.getElementById('historyBody');
const errorDrawer = document.getElementById('errorDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const mainCtas = document.getElementById('mainCtas');
const previewCtas = document.getElementById('previewCtas');
const backToHistory = document.getElementById('backToHistory');

const pages = {
  accounts: document.getElementById('accountsPage'),
  history: document.getElementById('historyPage'),
  mapping: document.getElementById('mappingPage'),
  preview: document.getElementById('previewPage')
};

const historyRows = [
  {
    fileName: 'ar-batch-may.xlsx',
    uploadedAt: '2026-03-17 09:12',
    status: 'Ready',
    synced: 'No',
    pending: 'Needs review',
    mappingSaved: true
  },
  {
    fileName: 'regional-clients.xls',
    uploadedAt: '2026-03-17 09:06',
    status: 'Ready',
    synced: 'Yes',
    pending: 'None',
    mappingSaved: false
  },
  {
    fileName: 'quarter-close.xlsx',
    uploadedAt: '2026-03-17 08:58',
    status: 'Extracting',
    synced: 'No',
    pending: 'Processing',
    mappingSaved: false
  },
  {
    fileName: 'july-bulk-ar.xlsx',
    uploadedAt: '2026-03-17 08:51',
    status: 'Failed',
    synced: 'No',
    pending: 'Resolve column mismatch',
    mappingSaved: false
  }
];

let uploadedFiles = [];

function showPage(name) {
  Object.entries(pages).forEach(([key, section]) => {
    section.classList.toggle('active', key === name);
  });

  if (name === 'preview') {
    pageTitle.textContent = 'Import Preview';
    mainCtas.classList.add('hidden');
    previewCtas.classList.remove('hidden');
  } else {
    pageTitle.textContent =
      name === 'history' ? 'Invoice Upload History' : name === 'mapping' ? 'Invoice Mapping' : 'Accounts Receivable';
    mainCtas.classList.remove('hidden');
    previewCtas.classList.add('hidden');
  }
}

function openModal() {
  backdrop.classList.remove('hidden');
}

function closeModal() {
  backdrop.classList.add('hidden');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function addFiles(files) {
  const validFiles = [...files].filter((file) => /\.(xls|xlsx)$/i.test(file.name));
  uploadedFiles = [...uploadedFiles, ...validFiles];
  renderFiles();
}

function renderFiles() {
  fileList.innerHTML = '';

  if (!uploadedFiles.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No files uploaded yet.';
    fileList.appendChild(empty);
    return;
  }

  uploadedFiles.forEach((file, index) => {
    const row = document.createElement('li');
    row.innerHTML = `
      <span>${file.name} • ${formatFileSize(file.size)}</span>
      <button class="icon-btn" data-index="${index}" aria-label="Remove file">🗑</button>
    `;
    fileList.appendChild(row);
  });
}

function badgeClass(status) {
  if (status === 'Extracting') return 'extracting';
  if (status === 'Failed') return 'failed';
  return 'ready';
}

function renderHistory() {
  historyBody.innerHTML = '';

  historyRows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.className = row.status === 'Extracting' ? '' : 'clickable';

    tr.innerHTML = `
      <td>${row.fileName}</td>
      <td>${row.uploadedAt}</td>
      <td>
        <span class="badge ${badgeClass(row.status)}">${row.status === 'Extracting' ? '●' : ''} ${row.status}</span>
      </td>
      <td>${row.synced}</td>
      <td>${row.pending}</td>
      <td>
        <button class="text-btn" data-action="excel">View Excel</button>
        <button class="text-btn" data-action="mapping">View Mapping</button>
      </td>
      <td><button class="icon-btn" data-action="delete">🗑</button></td>
    `;

    tr.addEventListener('click', (event) => {
      const inActions = event.target.closest('[data-action]');
      if (inActions) return;

      if (row.status === 'Extracting') return;
      if (row.status === 'Failed') {
        errorDrawer.classList.remove('hidden');
        return;
      }

      showPage(row.mappingSaved ? 'preview' : 'mapping');
    });

    tr.querySelectorAll('[data-action]').forEach((actionBtn) => {
      actionBtn.addEventListener('click', (event) => {
        event.stopPropagation();

        const action = actionBtn.dataset.action;

        if (action === 'delete') {
          tr.remove();
          return;
        }

        if (action === 'mapping') {
          showPage('mapping');
          return;
        }

        if (action === 'excel') {
          alert(`Opening ${row.fileName}...`);
        }
      });
    });

    historyBody.appendChild(tr);
  });
}

uploadBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelUploadBtn.addEventListener('click', () => {
  closeModal();
  showPage('accounts');
});
uploadPreviewBtn.addEventListener('click', () => {
  closeModal();
  showPage('history');
});

filePickerBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (event) => addFiles(event.target.files));
fileList.addEventListener('click', (event) => {
  const target = event.target.closest('[data-index]');
  if (!target) return;
  uploadedFiles.splice(Number(target.dataset.index), 1);
  renderFiles();
});

['dragenter', 'dragover'].forEach((type) => {
  dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    dropzone.classList.add('dragging');
  });
});

['dragleave', 'drop'].forEach((type) => {
  dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    dropzone.classList.remove('dragging');
  });
});

dropzone.addEventListener('drop', (event) => {
  addFiles(event.dataTransfer.files);
});

closeDrawerBtn.addEventListener('click', () => errorDrawer.classList.add('hidden'));
backToHistory.addEventListener('click', () => showPage('history'));

renderFiles();
renderHistory();
showPage('accounts');
