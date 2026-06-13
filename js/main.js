// ポートフォリオデータを読み込んでグリッドを構築する
(function () {
  const grid = document.getElementById('grid');
  const loading = document.getElementById('loading');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxNumber = document.getElementById('lightboxNumber');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let posts = [];
  let currentIndex = 0;

  // データ読み込み
  fetch('data/posts.json')
    .then(r => r.json())
    .then(data => {
      posts = data;
      renderGrid(posts);
    })
    .catch(() => {
      loading.textContent = 'No data found. Run the scraper first.';
      loading.classList.add('visible');
    });

  // サイズパターン（4列グリッド用、grid-auto-flow: dense で隙間補完）
  const sizePattern = [
    'wide tall', // 2×2
    '',
    'tall',      // 1×2
    'wide',      // 2×1
    '',
    '',
    'wide',      // 2×1
    '',
    'tall',      // 1×2
  ];

  function renderGrid(items) {
    grid.innerHTML = '';
    items.forEach((post, i) => {
      const isHero     = i === 0;
      const isFeatured = !isHero && (i + 1) % 9 === 0;
      const sizeClass  = isHero || isFeatured ? '' : sizePattern[(i - 1) % sizePattern.length];
      const card = createCard(post, i, isHero, isFeatured, sizeClass);
      grid.appendChild(card);
    });
  }

  function createCard(post, index, hero, featured, sizeClass) {
    const card = document.createElement('div');
    let cls = 'photo-card';
    if (hero)     cls += ' hero';
    else if (featured) cls += ' featured';
    else if (sizeClass) cls += ' ' + sizeClass;
    card.className = cls;
    card.dataset.index = index;

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.location || post.title;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'photo-card-overlay';

    const numLabel = post.number ? `#${String(post.number).padStart(3, '0')}` : '';
    overlay.innerHTML = `
      <div class="card-number">${numLabel}</div>
      <div class="card-location">${post.location || ''}</div>
      <div class="card-date">${formatDate(post.date)}</div>
    `;

    card.appendChild(img);
    card.appendChild(overlay);

    card.addEventListener('click', () => openLightbox(index));
    return card;
  }

  // ライトボックス
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const post = posts[currentIndex];
    lightboxImg.src = post.image;
    lightboxImg.alt = post.location || post.title;
    lightboxNumber.textContent = post.number ? `#${String(post.number).padStart(3, '0')}` : '';
    lightboxLocation.textContent = post.location || '';
    lightboxDate.textContent = formatDate(post.date);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + posts.length) % posts.length;
    updateLightbox();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigate(-1));
  lightboxNext.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
})();
