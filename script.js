const input = document.querySelector('input')
const items = document.querySelectorAll('.search__item')
const searchForm = document.querySelector('.search')
let searchList 
const results = document.querySelector('.result')

function createEl(tag, classOfEl, parentEl = undefined ){
  const newEl = document.createElement(tag)
  newEl.className = classOfEl
  if(parentEl) parentEl.append(newEl)
  return newEl
}

function addSelect(item){
  const selectedItem = createEl('li','result__item')

  const selectedSubitem = createEl('ul', 'result__subitem', selectedItem )

  const name = createEl('li', '', selectedSubitem)
  name.textContent = `name: ${item.name}`

  const owner = createEl('li', '', selectedSubitem)
  owner.textContent = `owner: ${item.owner.login}`

  const stars = createEl('li', '', selectedSubitem)
  stars.textContent = `stars: ${item.stargazers_count}`

  const close = createEl('div', 'result__close', selectedItem)
  close.onclick = () => selectedItem.remove()

  results.prepend(selectedItem)
}

async function getResponse(inputValue){
  try{
    let response =  await  fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`)
    response = await response.json()
    return await response.items
  }
  catch(e){
    console.error(e)
  }
  
}  

async function search(inputValue){
  let items = await getResponse(inputValue)
  if(searchList) searchList.remove()
  searchList = createEl('ul', 'search__list')
    for(let i=0; i<5; i++){
      const newResult = createEl('li', 'search__item', searchList) 
      newResult.textContent = items[i].name
      newResult.onclick = () => addSelect(items[i])   
    }
    if(input.value) searchForm.append(searchList)
}

const debounce = (fn, debounceTime) => {
  let timer 
  return function(...arg){
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, arg), debounceTime)
  }
};

search = debounce(search, 500)

input.addEventListener('keyup',  e => {
  if(e.target.value) {
    search(e.target.value)
  } else {
    searchList.remove()
  }
})

