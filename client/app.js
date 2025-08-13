/*
 * Front‑end script for the fair insurance price calculator. This script
 * manages language selection, form submission, API interaction, result
 * rendering and user interactions such as sorting and filtering. The
 * application supports Arabic (default) and English languages and uses
 * Bootstrap 5 for styling.
 */

(() => {
  // --- Configuration ---
  // Replace this URL with the publicly deployed backend endpoint once
  // deployment is complete. During development, you can point to a local
  // server (e.g., http://localhost:3000).
  const BACKEND_URL = "https://YOUR-BACKEND-URL";

  // Translation dictionary for Arabic and English
  const i18n = {
    ar: {
      title: 'حاسبة السعر العادل لتأمين السيارات',
      model: 'موديل السيارة',
      year: 'سنة الصنع',
      city: 'المدينة',
      accidents: 'عدد الحوادث المسجلة',
      driver_age: 'عمر السائق',
      btn_calc: 'احسب السعر',
      result_title: 'نتائج العروض',
      filter_label: 'بحث عن شركة:',
      table_company: 'الشركة',
      table_price: 'السعر (ريال)',
      city_placeholder: '-- اختر المدينة --',
      select_language: 'اللغة',
    },
    en: {
      title: 'Fair Car Insurance Price Calculator',
      model: 'Car Model',
      year: 'Year of Manufacture',
      city: 'City',
      accidents: 'Number of Recorded Accidents',
      driver_age: "Driver's Age",
      btn_calc: 'Calculate Price',
      result_title: 'Offers Results',
      filter_label: 'Search Company:',
      table_company: 'Company',
      table_price: 'Price (SAR)',
      city_placeholder: '-- Select City --',
      select_language: 'Language',
    },
  };

  let currentLang = 'ar';
  let offersData = [];
  let sortState = { key: 'price', asc: true };

  // Grab DOM elements
  const langSelect = document.getElementById('language-select');
  const titleEl = document.getElementById('title');
  const labels = {
    model: document.getElementById('label-model'),
    year: document.getElementById('label-year'),
    city: document.getElementById('label-city'),
    accidents: document.getElementById('label-accidents'),
    driver_age: document.getElementById('label-driver-age'),
  };
  const btnCalc = document.getElementById('btn-calc');
  const resultSection = document.getElementById('results');
  const resultTitle = document.getElementById('result-title');
  const filterLabel = document.getElementById('filter-label');
  const filterInput = document.getElementById('filter-input');
  const offersTable = document.getElementById('offers-table');
  const tableHeadCells = offersTable.querySelectorAll('th');
  const tableBody = offersTable.querySelector('tbody');

  /**
   * Update all texts in the UI according to the selected language.
   * @param {string} lang
   */
  function updateLanguage(lang) {
    currentLang = lang;
    const t = i18n[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    titleEl.textContent = t.title;
    labels.model.textContent = t.model;
    labels.year.textContent = t.year;
    labels.city.textContent = t.city;
    labels.accidents.textContent = t.accidents;
    labels.driver_age.textContent = t.driver_age;
    btnCalc.textContent = t.btn_calc;
    resultTitle.textContent = t.result_title;
    filterLabel.textContent = t.filter_label;
    // Update table headers
    offersTable.querySelector('thead th[data-sort="company"]').textContent = t.table_company;
    offersTable.querySelector('thead th[data-sort="price"]').textContent = t.table_price;

    // Update city placeholder and options text
    const citySelect = document.getElementById('city');
    citySelect.options[0].textContent = t.city_placeholder;
    // Specific cities translation (Arabic) remain the same because they are proper nouns
    // Optionally, we can map English names if required.

    // If results already displayed, re-render table to reflect new header titles
    if (offersData.length > 0) {
      renderTable();
    }
  }

  langSelect.addEventListener('change', (event) => updateLanguage(event.target.value));

  /**
   * Render the offers table based on offersData, sortState and filter value.
   */
  function renderTable() {
    // Apply filter
    const filterText = (filterInput.value || '').toLowerCase();
    let rows = offersData.filter((offer) => offer.company.toLowerCase().includes(filterText));
    // Apply sort
    rows.sort((a, b) => {
      const key = sortState.key;
      const asc = sortState.asc ? 1 : -1;
      if (a[key] < b[key]) return -1 * asc;
      if (a[key] > b[key]) return 1 * asc;
      return 0;
    });
    // Find minimum price to highlight cheapest
    const minPrice = rows.length ? Math.min(...rows.map((r) => r.price)) : null;

    // Clear existing rows
    tableBody.innerHTML = '';
    rows.forEach((offer) => {
      const tr = document.createElement('tr');
      // Highlight cheapest row
      if (offer.price === minPrice) {
        tr.classList.add('table-success');
      }
      const tdCompany = document.createElement('td');
      tdCompany.textContent = offer.company;
      const tdPrice = document.createElement('td');
      tdPrice.textContent = offer.price.toLocaleString('en-US');
      tr.appendChild(tdCompany);
      tr.appendChild(tdPrice);
      tableBody.appendChild(tr);
    });
  }

  /**
   * Handle form submission: call backend API and display results.
   * @param {Event} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    btnCalc.disabled = true;
    btnCalc.textContent = currentLang === 'ar' ? 'جاري الحساب...' : 'Calculating...';

    const payload = {
      model: document.getElementById('model').value.trim(),
      year: document.getElementById('year').value.trim(),
      city: document.getElementById('city').value.trim(),
      accidents: document.getElementById('accidents').value.trim(),
      driver_age: document.getElementById('driver-age').value.trim(),
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      offersData = data.offers || [];
      sortState = { key: 'price', asc: true };
      renderTable();
      resultSection.style.display = 'block';
    } catch (err) {
      console.error(err);
      alert(currentLang === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم' : 'An error occurred while contacting the server');
    } finally {
      btnCalc.disabled = false;
      btnCalc.textContent = i18n[currentLang].btn_calc;
    }
  }

  // Sort when clicking table headers
  tableHeadCells.forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort');
      if (sortState.key === key) {
        sortState.asc = !sortState.asc;
      } else {
        sortState.key = key;
        sortState.asc = true;
      }
      renderTable();
    });
  });

  // Filter on input
  filterInput.addEventListener('input', () => renderTable());

  // Attach form submit listener
  document.getElementById('quote-form').addEventListener('submit', handleSubmit);

  // Initial language setup
  updateLanguage(currentLang);
})();
