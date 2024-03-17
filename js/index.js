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
get_tweak()
const input = document.getElementsByClassName('search-box')[0];
input.addEventListener("input", (e) => {
  console.log("INPUT:" + e.target.value);
  fetch(`https://api.amania.jp/choice?text=${e.target.value}`)
  .then(response => response.json())
  .then(data => {
    const choice = document.getElementById('choice');
    choice.innerHTML = null
    data.forEach(tweak => {
      const couho = document.createElement('a')
      couho.innerText = tweak + '\n'
      couho.href = `/search?q=${tweak}`
      choice.appendChild(couho)
    })
})});

window.addEventListener('scroll', () => {
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    
    // 一番下までスクロールした時の数値を取得(window.innerHeight分(画面表示領域分)はスクロールをしないため引く)
    const pageMostBottom = scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // iosはバウンドするので、無難に `>=` にする
    if (scrollTop >= pageMostBottom) {
        get_tweak()
    }
});