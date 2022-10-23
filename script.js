const input = document.querySelector('input')
const items = document.querySelectorAll('.search__item')
const searchList = document.querySelector('.search__list')
const results = document.querySelector('.result')
let handlerArr = []

function addSelect(item){
  
  const selectedItem = document.createElement('li')
  selectedItem.className = 'result__item'

  const selectedSubitem = document.createElement('ul')
  selectedSubitem.className = 'result__subitem'
  selectedItem.prepend(selectedSubitem)

  const name = document.createElement('li')
  name.textContent = `name: ${item.name}`
  selectedSubitem.append(name)

  const owner = document.createElement('li')
  owner.textContent = `owner: ${item.owner.login}`
  selectedSubitem.append(owner)
  
  const stars = document.createElement('li')
  stars.textContent = `stars: ${item.stargazers_count}`
  selectedSubitem.append(stars)
 
  const close = document.createElement('div')
  close.className = 'result__close'
  selectedItem.append(close)
  close.addEventListener('click',()=>selectedItem.remove())

  results.prepend(selectedItem)
}


async function search(inputValue){
  console.log(`запрос на сервер отправлен! ключ: ${inputValue}`)
  await fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`)
  .then(response => {
    console.log(`получен промис от запроса по ключю: ${inputValue}`)
    if(response.ok){
      return response.json()
    }
  })
  .then(response => {
    for(let i=0; i<5; i++){
      if(response.items[i].name){
        items[i].removeEventListener('click', handlerArr[i])
        const handler = ()=>addSelect(response.items[i])
        handlerArr[i] = handler
        items[i].textContent = response.items[i].name
        items[i].addEventListener('click', handler)
        
      } else{
        console.log('такой репозиторий не найден')
      }
    }
    if(input.value){
      searchList.classList.add('search__list--show')
    }
    
  })
  .catch(error => console.error(error))
}

const debounce = (fn, debounceTime) => {
  let timer 
  return function(...arg){
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, arg), debounceTime)
  }
};

search = debounce(search, 500)

input.addEventListener('keyup',  (e) => {
  if(e.target.value) {
    search(e.target.value)
  } else {
    searchList.classList.remove('search__list--show')
  }
})





