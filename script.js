const bookList = document.querySelector('#book-list');

const formatWords = (count) => {
  return new Intl.NumberFormat('en-IN').format(count);
};

const formatYear = (value) => {
  return value || '—';
};

const renderBooks = (books) => {
  if (!books.length) {
    bookList.innerHTML = '<div class="empty-state">No books have been added yet.</div>';
    return;
  }

  const totalWords = books.reduce((sum, book) => sum + Number(book.words || 0), 0);
  const latestYear = books.reduce((max, book) => {
    const year = Number(book.published || 0);
    return year > max ? year : max;
  }, 0);

  document.querySelector('#book-count').textContent = books.length;
  document.querySelector('#total-words').textContent = formatWords(totalWords);
  document.querySelector('#latest-year').textContent = latestYear ? latestYear : '—';

  bookList.innerHTML = books
    .map((book) => {
      const shortTitle = book.title
        .split(' ')
        .slice(0, 3)
        .join(' ')
        .toUpperCase();

      return `
        <article class="book-card">
          <div class="book-cover" aria-label="${book.title} cover">${shortTitle}</div>
          <div class="book-body">
            <div class="book-header">
              <h2 class="book-title">${book.title}</h2>
              <span class="book-year">${formatYear(book.published)}</span>
            </div>

            <p class="book-blurb">${book.blurb}</p>

            <div class="meta" aria-label="Book stats">
              <div class="meta-item">
                <span class="key">Words</span>
                <span class="value">${formatWords(book.words)}</span>
              </div>
              <div class="meta-item">
                <span class="key">Pages</span>
                <span class="value">${book.pages}</span>
              </div>
              <div class="meta-item">
                <span class="key">Format</span>
                <span class="value">${book.format}</span>
              </div>
            </div>

            <div class="book-actions">
              <a class="download-link" href="${book.file}" target="_blank" rel="noreferrer noopener">Download PDF</a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
};

fetch('data/books.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to load the book data file.');
    }
    return response.json();
  })
  .then((data) => {
    renderBooks(data.books || []);
  })
  .catch((error) => {
    console.error(error);
    bookList.innerHTML = '<div class="empty-state">The book catalog is temporarily unavailable.</div>';
  });
