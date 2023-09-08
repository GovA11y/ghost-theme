document.getElementById('techCheckForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('url').value;
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = 'Loading...'; // Display loading message

  fetch(`https://tech.gova11y.io/extract?url=${url}`)
    .then(response => response.json())
    .then(data => {
      displayResponseData(data);
    })
    .catch(error => {
      console.error('Error:', error);
      resultsDiv.textContent = 'An error occurred while fetching the data. Please try again.'; // Display error message
    });
});


function displayResponseData(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // clear any previous results

    if (data && data.technologies) {
        const highConfidence = [];
        const mediumConfidence = [];
        const lowConfidence = [];

        data.technologies.forEach(tech => {
            if (tech.confidence > 80) {
                highConfidence.push(tech);
            } else if (tech.confidence > 50) {
                mediumConfidence.push(tech);
            } else {
                lowConfidence.push(tech);
            }
        });

        if (highConfidence.length > 0) {
            const highConfidenceDiv = document.createElement('div');
            highConfidenceDiv.className = 'result-card';
            highConfidenceDiv.innerHTML = '<h3>High Confidence Technologies</h3>' + highConfidence.map(tech => `<p>${tech.name} (${tech.confidence}% confidence)</p>`).join('');
            resultsDiv.appendChild(highConfidenceDiv);
        }

        if (mediumConfidence.length > 0) {
            const mediumConfidenceDiv = document.createElement('div');
            mediumConfidenceDiv.className = 'result-card';
            mediumConfidenceDiv.innerHTML = '<h3>Medium Confidence Technologies</h3>' + mediumConfidence.map(tech => `<p>${tech.name} (${tech.confidence}% confidence)</p>`).join('');
            resultsDiv.appendChild(mediumConfidenceDiv);
        }

        if (lowConfidence.length > 0) {
            const lowConfidenceDiv = document.createElement('div');
            lowConfidenceDiv.className = 'result-card';
            lowConfidenceDiv.innerHTML = '<h3>Low Confidence Technologies</h3>' + lowConfidence.map(tech => `<p>${tech.name} (${tech.confidence}% confidence)</p>`).join('');
            resultsDiv.appendChild(lowConfidenceDiv);
        }
    } else {
        resultsDiv.textContent = 'No technologies found or an error occurred.';
    }
}

