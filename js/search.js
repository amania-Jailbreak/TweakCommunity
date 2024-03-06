var queryParams = new URLSearchParams(window.location.search);
var qParameter = queryParams.get('q');
var query = qParameter || queryParams.get('package');
document.querySelector(".search-box").value = query;
function get_tweak(){
fetch(`https://api.amania.jp/search?q=${query}&newer_only=true`)
  .then(response => response.json())
  .then(data => {
    data.forEach(tweak => {
      const container = document.getElementsByClassName("sileo-featured")[0];
      const card = document.createElement("div");
      card.classList.add("tweak-card");
      const img = document.createElement("img");
      img.classList.add("card-img");
      img.src = tweak.Icon;
      img.onerror = function(){this.onerror=null;this.src='https://repo.amania.jp/static/bernar.png'}
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
      name.innerText = tweak.Name.replace(/\r/g,'');
      description.innerText = tweak.Description.replace(/\r/g,'');
      repository.innerText = tweak.repository_name.replace(/\r/g,'') + ' | ';
      repository_icon.src = tweak.repository.replace(/\r/g,'') + '/CydiaIcon.png'
      repository_icon.onerror = function(){this.onerror=null;this.src='https://repo.amania.jp/static/favicon.ico'}
      const architecture = document.createElement('span')
      architecture.classList.add('card-architecture')
      architecture.innerText =  tweak.Architecture.replace(/\r/g,'')
      if (tweak.Architecture == 'iphoneos-arm64'){
        architecture.style.color = 'green'
      } else if (tweak.Architecture == 'iphoneos-arm'){
        architecture.style.color = 'red'
      } else  if (tweak.Architecture == 'iphoneos-arm64e'){
        architecture.style.color = 'blue'
      } else {
        architecture.style.color = 'purple'
      }
      name.href = `/package?q=${tweak.Package}`
      cardIn.appendChild(name);
      cardIn.appendChild(description);
      repository.prepend(repository_icon)
      card.appendChild(img);
      card.appendChild(cardIn);
      repository.appendChild(architecture)
      card.appendChild(repository);
      container.appendChild(card);
      const label = document.getElementById('label')
      label.innerText = query
    });
  })
  .catch(error => {
    console.error(error);
  });
}
get_tweak()
