const todo = document.getElementById("todo")
const button = document.getElementById("btn")
const hint = document.getElementById("hint")
const info = document.getElementById("info")
const textTodo = document.getElementById("text")
const content = document.getElementById("taskList")
const search =  document.getElementById("search")
const taskname = document.getElementById("Name")
const progress = document.getElementById("progress")
const btnclearsearch =  document.getElementById("clearSearch")
let elements
let cur = null
let tasks = localStorage.tasks?JSON.parse(localStorage.getItem('tasks')):[];
search.addEventListener('input', ()=>{
  btnclearsearch.style.display="block"
  search.value = validate(search.value)
  if (search.value.length==0){
    clearSearch();
  }
  fillContent(search.value)
})
taskname.addEventListener('input', () =>{taskname.value = validate(taskname.value)})
btnclearsearch.addEventListener('click', clearSearch)
function clearSearch(){
  search.value = ""
  fillContent(search.value)
  btnclearsearch.style.display="none"
}
function updateLocalStorage(){
  localStorage.setItem('tasks',JSON.stringify(tasks))
}
function filterTask(){
  let anticipatedTask = tasks.length && tasks.filter((item)=>item.color=="var(--anticipated-color)")
  let progressTask = tasks.length && tasks.filter((item)=>item.color=="var(--progress-color)")
  let completedTask = tasks.length && tasks.filter((item)=>item.color=="var(--completed-color)")
  tasks=[...progressTask,...anticipatedTask,...completedTask]
}
function fillContent(search_text){
  content.innerHTML=""
  let visible=1;
  if (tasks.length>0){
     filterTask()
    tasks.forEach((item,index)=>{
    if(search_text && item.name.search(search_text)==-1) visible=0
      content.innerHTML+=creatTodo(item,index,visible)
      visible=1
    })
  }
  elements = document.querySelectorAll(".task")
}
fillContent()
function validate(str){
  str = str.replace(/^\s+/g,'');
  str = str.replace(/[ ]{1,}/g,' ');
  return str
}
function creatTodo(task,index,visible){
 return `<div class="task" style="display:${visible?"flex":"none"}">
          <img src="img/delete.png" onclick="deleteTask(${index})"><p style="color:${task.color}" onclick="redacListTodo(${index})">${task.name}</p>
        </div>`
}
function deleteTask(index){
  if (elements[index].style.background == "var(--main-color)"){ clearInfo("")
}
  elements[index].style.height = `${elements[index].scrollHeight}px`
  window.getComputedStyle(elements[index],null).getPropertyValue("height")
  elements[index].style.height = "0"
  tasks.splice(index,1)
 setTimeout(()=>{
  updateLocalStorage()
  fillContent(search.value)
 },500)
}
function redacListTodo(index){
  fillContent(search.value)
  info.style.display = "grid"
  hint.style.display = "none"
  if (index==undefined || index==null){
    button.innerHTML = "Добавить"
    taskname.value = ""
    textTodo.value=""
    progress.selectedIndex =0
  }
  if (index>=0){
    elements[index].style.background="var(--main-color)"
    taskname.value = tasks[index].name
    textTodo.value = tasks[index].text
    progress.value = tasks[index].color
    button.innerHTML="Изменить"
  }
    button.setAttribute('onclick','redact('+index+')');
}
function redact(index){
  if (taskname.value.length!=0){
  let task = {
  name : taskname.value,
  text: textTodo.value,
  color : progress.value
  }
  if (index!=undefined || index!=null){
    tasks[index] = task
  }
  else tasks.push(task)

  clearInfo("")
  updateLocalStorage()
  fillContent(search.value)
}
else alert("Введите имя задачи!")
}
function clearInfo(str){
 fillContent(search.value)
  info.style.display = "none"
  hint.style.display = "block"
  progress.selectedIndex =0
  taskname.value =""
  textTodo.value =""
  button.innerHTML=str
}
//потом разобраться
function hook(e) {
  e = e || window.event;
  cur = { 'el': todo, 'x': e.clientX - todo.offsetWidth, 'y': e.clientY - todo.offsetHeight }
}

function unhook(e) {
  if( cur )
    cur = null;
}
function move(e) {
  if( !cur )
    return;
  e = e || window.event;
    with( cur )
    {
      var nx = e.clientX - x;
      if( nx < 40 ) nx = 40;
      todo.style.width = nx + 'px';
  }
  (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
}
document.onmouseup = unhook;
document.onmousemove = move;
document.ondragstart = function()
{
    return false;
}
