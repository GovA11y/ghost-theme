document.getElementById('techCheckForm').addEventListener('submit', function(e) {
  e.preventDefault();
  let url = document.getElementById('url').value;
  const resultsDiv = document.getElementById('results');
  const loader = document.querySelector('.loader');

  // Ensure the input is a valid URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  loader.style.display = 'block'; // Show loader
  resultsDiv.style.display = 'none'; // Hide results

  fetch(`https://tech.gova11y.io/extract?url=${url}`)
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none'; // Hide loader
      resultsDiv.style.display = 'block'; // Show results
      displayResponseData(data);
    })
    .catch(error => {
      console.error('Error:', error);
      loader.style.display = 'none'; // Hide loader
      resultsDiv.textContent = 'An error occurred while fetching the data. Please try again.'; // Display error message
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
  return technologies.reduce((acc, tech) => {
    const { category } = tech;
    if (!acc[category]) acc[category] = [];
    acc[category].push(tech);
    return acc;
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

  const confidenceLabel = document.createElement('p');
  confidenceLabel.className = 'confidence-label';
  confidenceLabel.textContent = 'Confidence';
  techCard.appendChild(confidenceLabel);

  const moreInfoBtn = document.createElement('a');
  moreInfoBtn.href = `${tech.website}`;
  moreInfoBtn.className = 'more-info-btn';
  moreInfoBtn.textContent = 'More Info';
  techCard.appendChild(moreInfoBtn);

  return techCard;
}

function displayURLResponseData(urls) {
  const urlsDiv = document.getElementById('urls');
  urlsDiv.innerHTML = '';
  urlsDiv.style.display = 'block';

  const urlsHeader = document.createElement('h2');
  urlsHeader.textContent = 'URL Response Data';
  urlsDiv.appendChild(urlsHeader);

  Object.entries(urls).forEach(([url, status]) => {
    const urlDiv = document.createElement('div');
    urlDiv.textContent = `${url}: ${status}`;
    urlsDiv.appendChild(urlDiv);
  });
}
