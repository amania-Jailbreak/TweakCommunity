var queryParams = new URLSearchParams(window.location.search);
var qParameter = queryParams.get('q');
var query = qParameter || queryParams.get('package');
async function fetchJsonFromUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching JSON:', error);
      return null;
    }
  }
  
  async function getTweakHeaderImage(tweak) {
    if (!tweak.SileoDepiction) {
      console.error('SileoDepiction URL is missing');
      return 'https://repo.amania.jp/static/bernar.png'; // Default image if SileoDepiction URL is missing
    }
  
    const depictionData = await fetchJsonFromUrl(tweak.SileoDepiction);
    if (depictionData && depictionData.headerImage) {
      return depictionData.headerImage;
    } else {
      console.error('Header image not found in SileoDepiction');
      return 'https://repo.amania.jp/static/bernar.png'; // Default image if headerImage is not found
    }
  }
  async function addScreenshotsToPage(tweak, shotsDiv) {
    const screenshotUrls = await fetchScreenshotUrlsFromDepiction(tweak.SileoDepiction);
  
    // Clear existing screenshots if any
    while (shotsDiv.firstChild) {
      shotsDiv.removeChild(shotsDiv.firstChild);
    }
  
    // If there are screenshot URLs, create and append img elements for each
    if (screenshotUrls.length > 0) {
      screenshotUrls.forEach(url => {
        const screenshotImg = document.createElement('img');
        screenshotImg.src = url;
        screenshotImg.classList.add('package_screenshots_img'); // Consider using class for styling instead of id
        shotsDiv.appendChild(screenshotImg);
      });
    }
  }
function get_tweak(){
fetch(`https://api.amania.jp/package-search?q=com.opa334.crane`)
  .then(response => response.json())
  .then(async data => {
        const tweak = data[0];
        const headerImageUrl = await getTweakHeaderImage(tweak);
        const mainDiv = document.getElementsByClassName('main')[0];
        const headerImg = document.createElement('img');
        headerImg.src = headerImageUrl;
        headerImg.id = 'package_header';
        mainDiv.appendChild(headerImg);
        const packageInfoDiv = document.createElement('div');
        packageInfoDiv.id = 'package-info';
        const packageIconImg = document.createElement('img');
        packageIconImg.src = tweak.Icon || 'https://repo.amania.jp/static/favicon.ico';
        packageIconImg.id = 'package_icon';
        packageInfoDiv.appendChild(packageIconImg);
        const packageNameH3 = document.createElement('h3');
        packageNameH3.id = 'package_name';
        packageNameH3.textContent = tweak.Name;
        packageInfoDiv.appendChild(packageNameH3);
        const packageAuthorP = document.createElement('p');
        packageAuthorP.id = 'package_author';
        packageAuthorP.textContent = tweak.Author;
        packageInfoDiv.appendChild(packageAuthorP);
        const packageSectionP = document.createElement('p');
        packageSectionP.id = 'package_architecture_section';
        packageSectionP.textContent = tweak.Section;
        packageInfoDiv.appendChild(packageSectionP);
        mainDiv.appendChild(packageInfoDiv);
        const hr = document.createElement('hr');
        hr.style.width = '100%';
        hr.style.height = '1px';
        mainDiv.appendChild(hr);
        const packageScreenshotsDiv = document.createElement('div');
        packageScreenshotsDiv.id = 'package-screenshots';
        const shotsDiv = document.createElement('div');
        shotsDiv.id = 'shots';
        shotsDiv.appendChild(screenshotImg);
        packageScreenshotsDiv.appendChild(shotsDiv);
        mainDiv.appendChild(packageScreenshotsDiv);
        await addScreenshotsToPage(tweak, shotsDiv);
        const packageDescriptionDiv = document.createElement('div');
        packageDescriptionDiv.id = 'package-description';
        const packageDescriptionP = document.createElement('p');
        packageDescriptionP.id = 'package_description_text';
        packageDescriptionP.textContent = tweak.Description;
        packageDescriptionDiv.appendChild(packageDescriptionP);
        mainDiv.appendChild(packageDescriptionDiv);
        mainDiv.appendChild(packageVersionsDiv);

    })
  .catch(error => {
    console.error('Error:', error);
  });
}
get_tweak()
