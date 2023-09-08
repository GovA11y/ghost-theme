document.getElementById('techCheckForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('url').value;
  const resultsDiv = document.getElementById('results');
  const loader = document.getElementById('loader');

  resultsDiv.innerHTML = '';
  loader.style.display = 'block';  // Show loader

  fetch(`https://tech.gova11y.io/extract?url=${url}`)
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none';  // Hide loader
      displayResponseData(data);
    })
    .catch(error => {
      console.error('Error:', error);
      loader.style.display = 'none';  // Hide loader
      resultsDiv.textContent = 'An error occurred while fetching the data. Please try again.';
    });
});

function displayResponseData(data) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  // Display URL response data
  displayURLResponseData(data.urls);

  // Group technologies by category
  const techCategories = groupTechnologiesByCategory(data.technologies);

  // Create a section for each category
  Object.entries(techCategories).forEach(([categoryName, techs]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';

    const categoryHeader = document.createElement('h2');
    categoryHeader.textContent = categoryName;
    categoryDiv.appendChild(categoryHeader);

    // Create a card for each technology
    techs.forEach(tech => {
      categoryDiv.appendChild(createTechCard(tech));
    });

    resultsDiv.appendChild(categoryDiv);
  });
}

function groupTechnologiesByCategory(technologies) {
  return technologies.reduce((categories, tech) => {
    tech.categories.forEach(category => {
      if (!categories[category.name]) {
        categories[category.name] = [];
      }
      categories[category.name].push(tech);
    });
    return categories;
  }, {});
}

function createTechCard(tech) {
  const card = document.createElement('div');
  card.className = 'tech-card';
  card.innerHTML = `
    <div class="tech-header">
      <img src="https://placehold.co/50x50?${tech.icon}.svg" alt="${tech.name} icon" />
      <h3><a href="${tech.website}" target="_blank">${tech.name}</a> (${tech.version || 'No version available'})</h3>
    </div>
    <p>${tech.description || 'No description available'}</p>
    <div class="chart-container">
      <div class="confidence-chart" style="width: ${tech.confidence}%;">
        ${tech.confidence}%
      </div>
    </div>
  `;
  return card;
}

function displayURLResponseData(urls) {
  const urlsDiv = document.getElementById('urls');
  urlsDiv.innerHTML = `
    ${Object.entries(urls).map(([url, data]) => `
      <p>${url}: ${data.status} ${data.redirected ? `(Redirected to: ${data.url})` : ''}</p>
    `).join('')}
  `;
}
