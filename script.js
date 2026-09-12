import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getDatabase, onValue, ref, runTransaction } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js';

const counterElements = document.querySelectorAll('[data-download-count]');
const downloadLinks = document.querySelectorAll('[data-download-link]');
const initialDownloadCount = 230;

function renderDownloadCount(value) {
  const count = Number.isFinite(value) ? value : initialDownloadCount;
  counterElements.forEach(element => {
    element.textContent = new Intl.NumberFormat('zh-CN').format(count);
  });
}

renderDownloadCount(initialDownloadCount);

try {
  const app = initializeApp({
    projectId: 'morning-sun-visualnovel',
    databaseURL: 'https://morning-sun-visualnovel-default-rtdb.asia-southeast1.firebasedatabase.app'
  });
  const countRef = ref(getDatabase(app), 'stats/downloadStarts');

  onValue(countRef, snapshot => {
    const value = snapshot.val();
    renderDownloadCount(typeof value === 'number' ? value : initialDownloadCount);
  });

  downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      runTransaction(countRef, current => {
        const value = typeof current === 'number' ? current : initialDownloadCount;
        return Math.max(initialDownloadCount, value) + 1;
      }).catch(() => {
        // The download remains available even if a visitor is offline.
      });
    });
  });
} catch {
  // Keep the initial count visible if Firebase is unavailable.
}
