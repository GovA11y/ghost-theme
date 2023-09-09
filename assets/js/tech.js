document.getElementById('techCheckForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let url = document.getElementById('url').value;

  // Ensure the URL starts with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }

  const resultsDiv = document.getElementById('results');
  const loader = document.querySelector('.loader');

  resultsDiv.innerHTML = '';
  loader.style.display = 'block'; // Show loader

  fetch(`https://tech.gova11y.io/extract?url=${url}`)
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none'; // Hide loader
      displayResponseData(data, url);
    })
    .catch(error => {
      console.error('Error:', error);
      loader.style.display = 'none'; // Hide loader
      resultsDiv.textContent = 'An error occurred while fetching the data. Please try again.';
    });
});

function displayResponseData(data, url) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  // Display URL response data
  displayURLResponseData(data.urls, url, data.technologies);

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
  const techCard = document.createElement('div');
  techCard.className = 'tech-card';

  const header = document.createElement('div');
  header.className = 'tech-header';
  const img = document.createElement('img');
  img.src = `https://placehold.co/50x50?${tech.icon}.svg`;
  header.appendChild(img);
  const title = document.createElement('h3');
  title.textContent = tech.name;
  header.appendChild(title);
  techCard.appendChild(header);

  const version = document.createElement('p');
  version.textContent = tech.version ? `Version: ${tech.version}` : '';
  techCard.appendChild(version);

  const confidenceContainer = document.createElement('div');
  confidenceContainer.className = 'chart-container';
  const confidenceChart = document.createElement('div');
  confidenceChart.className = 'confidence-chart';
  confidenceChart.style.width = `${tech.confidence}%`;
  confidenceChart.textContent = `${tech.confidence}%`;
  confidenceContainer.appendChild(confidenceChart);
  techCard.appendChild(confidenceContainer);

  const moreInfoBtn = document.createElement('a');
  moreInfoBtn.href = `${tech.website}`;
  moreInfoBtn.className = 'more-info-btn';
  moreInfoBtn.textContent = 'More Info';
  techCard.appendChild(moreInfoBtn);

  return techCard;
}

function displayURLResponseData(urls, url, technologies) {
  const urlsDiv = document.getElementById('urls');
  urlsDiv.innerHTML = '';
  urlsDiv.style.display = 'block';

  const urlsHeader = document.createElement('h2');
  urlsHeader.textContent = `A11yTecher Results for ${new URL(url).hostname}`;
  urlsDiv.appendChild(urlsHeader);

  const table = document.createElement('table');
  urlsDiv.appendChild(table);

  Object.entries(urls).forEach(([url, data]) => {
    const row = document.createElement('tr');

    const requestUrlCell = document.createElement('td');
    requestUrlCell.textContent = url;
    row.appendChild(requestUrlCell);

    const responseCodeCell = document.createElement('td');
    responseCodeCell.textContent = `${data.status} ${getStatusEmoji(data.status)}`;
    row.appendChild(responseCodeCell);

    if (data.redirected) {
      const forwardedUrlCell = document.createElement('td');
      forwardedUrlCell.textContent = data.url;
      row.appendChild(forwardedUrlCell);

      const forwardedResponseCodeCell = document.createElement('td');
      forwardedResponseCodeCell.textContent = `${data.status} ${getStatusEmoji(data.status)}`;
      row.appendChild(forwardedResponseCodeCell);
    }

    table.appendChild(row);
  });

  function getStatusEmoji(status) {
    if (status >= 200 && status < 300) {
      return '✅'; // Success
    }
    if (status >= 300 && status < 400) {
      return '🔀'; // Redirection
    }
    if (status >= 400 && status < 500) {
      return '⚠️'; // Client error
    }
    if (status >= 500) {
      return '⛔'; // Server error
    }
    return '❓'; // Unknown
  }

  const techCategories = groupTechnologiesByCategory(technologies);

  // Display additional details about the check
  const detailsDiv = document.createElement('div');
  detailsDiv.textContent = `The check discovered that the URL uses ${technologies.length} different technologies spread across ${Object.keys(techCategories).length} categories, providing a diverse digital infrastructure. Details regarding the specific technologies and categories are displayed below.`;
  urlsDiv.appendChild(detailsDiv);
}

