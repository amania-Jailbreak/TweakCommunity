function get_tweak(){
fetch("https://api.amania.jp/random-tweak?count=20")
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
      const name = document.createElement("p");
      name.classList.add("card-name");
      name.style.marginBottom = "0px";
      const description = document.createElement("p");
      description.classList.add("card-description");
      const repository = document.createElement("p");
      repository.classList.add("card-repository");
      name.innerText = tweak.Name;
      description.innerText = tweak.Description;
      repository.innerText = tweak.repository_name;

      cardIn.appendChild(name);
      cardIn.appendChild(description);

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
get_tweak()
