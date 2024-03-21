var queryParams = new URLSearchParams(window.location.search);
var qParameter = queryParams.get('q');
var query = qParameter || queryParams.get('package');
async function fetchJsonFromUrl(url) {
    try {
      const response = await fetch("https://api.amania.jp/cors-bypass?url=" + url);
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
  async function createVersionArchitectureFilenameList(data) {
    const list = data.map(tweak => {
      return [tweak.Version, tweak.Architecture, tweak.Filename];
    });
    return list;
  }
  async function insertDownloads(data) {
    const downloadsDiv = document.querySelector('.Downloads');
    if (!downloadsDiv) {
      console.error('Downloads class not found');
      return;
    }
    const list = (await createVersionArchitectureFilenameList(data)).reverse();
  
    list.forEach(([Version, Architecture, Filename]) => {
      const link = document.createElement('button');
      link.textContent = `${Version} | ${Architecture}`;
      link.classList.add('btn');
      link.classList.add('btn-secondary');
      link.onclick = function(){location.href=Filename}
      downloadsDiv.appendChild(link);
    });
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

  async function fetchScreenshotUrlsFromDepiction(depictionUrl) {
    try {
      const depictionData = await fetchJsonFromUrl(depictionUrl);
      const screenshotUrls = [];
  
      // Iterate through the tabs array
      depictionData.tabs.forEach(tab => {
        // Iterate through the views array within each tab
        tab.views.forEach(view => {
          // Check if the view class is DepictionScreenshotsView
          if (view.class === "DepictionScreenshotsView") {
            // Iterate through the screenshots array within the view
            view.screenshots.forEach(screenshot => {
              // Add the screenshot URL to the screenshotUrls array
              screenshotUrls.push(screenshot.url);
            });
          }
        });
      });
  
      return screenshotUrls;
    } catch (error) {
      console.error('Error fetching or processing screenshots:', error);
      return [];
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
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('data-lightbox', 'group');
        link.appendChild(screenshotImg);
        shotsDiv.appendChild(link);
      });
    }
  }
  function get_others(){
    fetch("https://api.amania.jp/random-tweak?count=10")
      .then(response => response.json())
      .then(data => {
        
        data.forEach(tweak => {
          const container = document.getElementsByClassName("sileo-featured")[0];
          const card = document.createElement("div");
          card.classList.add("tweak-card");
          const img = document.createElement("img");
          img.classList.add("card-img");
          img.src = tweak.Icon;
          img.onerror = function(){this.onerror=null;this.src='/img/bernar.png'}
          const cardIn = document.createElement("div");
          cardIn.classList.add("card-in");
          const name = document.createElement("a");
          name.classList.add("card-name");
          name.style.marginBottom = "0px";
          const description = document.createElement("p");
          description.classList.add("card-description");
          const repository = document.createElement("p");
          const repository_icon = document.createElement('img')
          repository_icon.classList.add('card-repo-icon')
          repository.classList.add("card-repository");
          name.innerText = tweak.Name;
          description.innerText = tweak.Description;
          repository.innerText = tweak.repository_name;
          repository_icon.src = tweak.repository + '/CydiaIcon.png'
          repository_icon.onerror = function(){this.onerror=null;this.src='favicon.ico'}
          name.href = `/package?q=${tweak.Package}`
          cardIn.appendChild(name);
          cardIn.appendChild(description);
          repository.prepend(repository_icon)
          card.appendChild(img);
          card.appendChild(cardIn);
          card.appendChild(repository);
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error(error);
      });
    }
function get_tweak(){
fetch(`https://api.amania.jp/package-search?q=${query}`)
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
        packageIconImg.src = tweak.Icon || 'favicon.ico';
        packageIconImg.id = 'package_icon';
        packageInfoDiv.appendChild(packageIconImg);
        document.getElementById('og:image').content = tweak.Icon;
        const packageNameH3 = document.createElement('h3');
        packageNameH3.id = 'package_name';
        packageNameH3.textContent = tweak.Name;
        document.getElementById('og-title').content = tweak.Name + ' | TweakCommunity';
        document.getElementById('og:site_name').content = tweak.Name + ' | TweakCommunity';
        document.title = tweak.Name + ' | TweakCommunity';
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
        packageScreenshotsDiv.appendChild(shotsDiv);
        mainDiv.appendChild(packageScreenshotsDiv);
        await addScreenshotsToPage(tweak, shotsDiv);
        const packageDescriptionDiv = document.createElement('div');
        packageDescriptionDiv.id = 'package-description';
        const packageDescriptionP = document.createElement('p');
        packageDescriptionP.id = 'package_description_text';
        packageDescriptionP.textContent = tweak.Description;
        packageDescriptionDiv.appendChild(packageDescriptionP);
        const packagedownload = document.createElement('div');
        packagedownload.classList.add('Downloads');
        packagedownload.classList.add('d-grid');
        packagedownload.classList.add('gap-2');
        packagedownload.classList.add('d-md-block');
        const downloadh1 = document.createElement('h1');
        downloadh1.textContent = 'Downloads';
        packagedownload.appendChild(downloadh1);
        mainDiv.appendChild(packageDescriptionDiv);
        mainDiv.appendChild(packagedownload);
        const container = document.createElement('div');
        container.classList.add('sileo-featured')
        const list = document.createElement('h1');
        list.textContent = 'Other Tweaks';
        list.id = 'othertweak'
        mainDiv.appendChild(list);
        mainDiv.appendChild(container)
        get_others()
        insertDownloads(data);
        const loading = document.getElementById('loading')
        loading.style.display = 'none'
    })
  .catch(error => {
    console.error('Error:', error);
  });
}
get_tweak()

