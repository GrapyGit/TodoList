const todo = document.getElementById("todo")//блок справа(поиск, создание, задачи)
const button = document.getElementById("btn")//кнопка изменения задач
const hint = document.getElementById("hint")//подсказка
const info = document.getElementById("info")//форма для ввода значений
const textTodo = document.getElementById("text")//поле для ввода описания задачи
const content = document.getElementById("taskList")//поле для задач
const search =  document.getElementById("search")//поле поиска задачи
const taskName = document.getElementById("Name")//поле для ввода наименования задачи
const progress = document.getElementById("progress")//select выбора стадии задачи
const btnClearSearch =  document.getElementById("clearSearch")//кнопка очистки поиска
let elements//массив элементов(задач)
let x = null//значение изменения ширины элемента 
let tasks = localStorage.tasks?JSON.parse(localStorage.getItem('tasks')):[];//массив задач
search.addEventListener('input', ()=>{//прослушиваем изменения в поле поиска
  btnClearSearch.style.display="block"
  search.value = validate(search.value)
  if (search.value.length==0){//если ничего не введено, то очищаем
    clearSearch();
  }
  fillContent(search.value)
})
const updateLocalStorage =()=> localStorage.setItem('tasks',JSON.stringify(tasks))
const clearSearch =()=>{//функция очистки поля поиска
  search.value = ""
  fillContent(search.value)
  btnClearSearch.style.display="none"
}
const creatTodo =(task,index,visible)=>{//создаём шаблон задачи
  return `<div class="task" style="display:${visible?"flex":"none"}; ${task.active?"background:linear-gradient(90deg, var(--borderbtnColor) 0%,  var( --setting-bg-color) 100%);padding-left:40px;":""}">
           <img src="img/delete.png" onclick="deleteTask(${index})"><p style="color:${task.color}" onclick="redactListTodo(${index})">${task.name}</p>
         </div>`
 }
const filterTask =()=>{//фильтруем задачи(сначала идут в процессе, потом в ожидании, а следом выполненые)
  anticipatedTask = tasks.length && tasks.filter((item)=>item.color=="var(--anticipated-color)")
  progressTask = tasks.length && tasks.filter((item)=>item.color=="var(--progress-color)")
  completedTask = tasks.length && tasks.filter((item)=>item.color=="var(--completed-color)")
  tasks=[...progressTask,...anticipatedTask,...completedTask]
}
const fillContent = search_text=>{//заполняем список задач
  content.innerHTML=""
  let visible=1;//состояние видимости задачи
  if (tasks.length>0){
    filterTask()//фильтруем задачи
    tasks.forEach((item,index)=>{
    if(search_text && item.name.search(search_text)==-1) visible=0//проверяем на совпадение с поиском(если совпадает, то выводим)
      content.innerHTML+=creatTodo(item,index,visible)//добавляем задачу в список
      visible=1
    })
  }
  elements = document.querySelectorAll(".task")//получаем список задач(html)
}
taskName.addEventListener('input', () =>{taskName.value = validate(taskName.value)})//прослушиваем изменения поля ввода наименования задачи и делаем валидацию
btnClearSearch.addEventListener('click', clearSearch)//Добавляем функцию очистки поиска при клике на кнопку(img)
const validate=str=>{//проверяем строку
  str = str.replace(/^\s+/g,'');//очищаем, если введён только пробел
  str = str.replace(/[ ]{1,}/g,' ');//очищаем двойные пробелы
  return str
}
const deleteTask=index=>{//удаляем задачу
  if (tasks[index].active) settingInfo("")
  //дальше идёт подготовка к анимации удаления
  elements[index].style.height = `${elements[index].scrollHeight}px`
  window.getComputedStyle(elements[index],null).getPropertyValue("height")
  elements[index].style.height = "0"
  tasks.splice(index,1)
 setTimeout(()=>{//делаем задержку в выполнении, чтобы успела проиграться анимация удаления
  updateLocalStorage()
  fillContent(search.value)
 },500)
}
const redactListTodo=index=>{
  if (index==undefined || index==null) settingInfo("Добавить")//если индекса нет, то подготавливаем форму для добавления задачи
  if (index>=0) settingInfo("Изменить",tasks[index]);//если индекс есть, то подготавливаем форму для изменения задачи
    button.setAttribute('onclick','redacTasks('+index+')');//изменяем функцию клика кнопки(нужно, чтобы передать индекс задачи)
}
const redacTasks =index=>{
  if (taskName.value.length==0){//проверяем, что ввели наименование задачи
    alert("Введите имя задачи!")
    return;
  }
  let task = {//создаём задачу
    name : taskName.value,//читаем значение наименования
    text: textTodo.value,//читаем значение описания
    active:false,//делаем неактивной задачу
    color : progress.value//читаем цвет(так же является степень выполнения задачи)
  }
  if (index!=undefined || index!=null)//если индекс введён, то присваиваем задаче новое значение
    tasks[index] = task
  else tasks.push(task)//если индекс не введён, то добавляем в конец массива задач
  settingInfo("")//очищаем форму ввода значений
  updateLocalStorage()//обновляем локальное хранилище
  fillContent(search.value)//обновляем список задач(html)
}
function settingInfo(str, task) {
  tasks.forEach((item) => {
    item.active = false
  })
  info.style.display = "grid"//делаем формы для заполнения видимыми
  hint.style.display = "none"//скрываем задачу
  switch (str) {
    case 'Добавить'://очищаем формы для поиска
      progress.selectedIndex = 0
      taskName.value = ""
      textTodo.value = ""
      button.innerHTML = str
      break
    case 'Изменить':
      with (task) {//заполняем формы для ввода, значениями выбранной задачи
        active = true//делаем задачу активной
        taskName.value = name
        textTodo.value = text
        progress.value = color
      }
      break
    default:
      info.style.display = "none"//скрываем формы для заполнения
      hint.style.display = "block"//делаем подсказку видимой
      break
  }
  fillContent(search.value)//обновляем список задач(html, нужно для того, чтобы добавить или снять выделение с задачи)
}
const hook =e=> {//функция работает при нвжатии на элемент границы
  e = e || window.event;//получаем обьект события
  x =  e.clientX - todo.offsetWidth
}
const unhook=e=> {
  if(x)
    x = null;//если кнопка отжата, обнуляем значение
}
const move=e=> {
  if(!x)
    return;
  e = e || window.event;
  todo.style.width = e.clientX - x + 'px';
  (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
}
document.onmouseup = unhook;//отжатие кнопки мыши
document.onmousemove = move;//движение мыши
document.ondragstart = ()=>{return false}//убираем стандартное поведение браузера при перетаскивании злементов
fillContent()
//the end
