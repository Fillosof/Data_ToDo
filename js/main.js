(function(){
    var currentData = [];



    const taskInput = document.getElementById('taskInput'),
        toDoList = document.getElementById('toDoList'),
        doneList = document.getElementById('doneList'),
        updateMessageWrapper = document.getElementById('update-message-wrapper'),
        taskEditInput = document.getElementById('task-edit-input'),
        storage = window.localStorage;

    const createHumanDate = date => moment(date).format("YYYY/MM/DD hh:mm");


    const taskTemplate = item => {
        return `
        <div class="list-group-item task ${stylingDoneTask(item.status)}" data-id="${item.id}">
            <div class="row">
                <button type="button" class="btn ${stylingDoneTaskBtn(item.status)} " role="task-swich" data-id="${item.id}">
                    <i class="far fa-lg ${switchCekboxIcon(item.status)}"></i>
                </button>
                <div class="col align-self-center text-wrap">
                    <p class="m-0">${item.name}</p>
                </div>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary" role="task-edit" data-id="${item.id}">
                        <i class="fas fa-lg fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" role="task-delete" data-id="${item.id}">
                        <i class="far fa-lg fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    const stylingDoneTask = (isDone) => isDone ? "list-group-item-success" : "";
    const stylingDoneTaskBtn = (isDone) => isDone ? "btn-outline-success" : "btn-outline-primary";
    const switchCekboxIcon = (isDone) => isDone ? "fa-check-square" : "fa-square";

    const hideMessage = () => updateMessageWrapper.classList.add("hide");


// functions

    // CREATE
    let addTask = () => {
        let currentTime = new Date();

        if (taskInput.value === "") return; 

        currentData.push({   
            name: taskInput.value,
            status: false,
            priority: 0,
            date : currentTime.getTime()
        });            
        taskInput.value = ""; 

        saveData();
    }

    // READ
    let getData = (storage) => {  
        let data = [];
        data = ( storage.getItem("myToDoList") == "[]" || storage.getItem("myToDoList") == null ) ? 
                        standatData :
                        JSON.parse(storage.getItem("myToDoList"));
        
        return data
    };

    let renderLists = (renderData) => {
        
        let addIdToData = (data) => {
            let tempData = [];

            tempData = data.slice()
            tempData.forEach((element, index) => {
                element.id = index;              
            });

            return tempData
        }
  

        let filterTasks = (data, isDone) => {        
            let filterData = [];
            filterData = data.filter(
                (item) => {
                    return item.status === isDone 
                });
            return filterData
        }

        toDoList.innerHTML = filterTasks(addIdToData(renderData), false).map(taskTemplate).join("");
        doneList.innerHTML = filterTasks(addIdToData(renderData), true).map(taskTemplate).join("");
    }

    // UPDATE

    let updateTask = (id) => {  
        id = +id;
        let item = currentData[id];
        taskEditInput.value = item.name;
        taskEditInput.setAttribute("data-id", id);
        updateMessageWrapper.classList.remove("hide");
        taskEditInput.focus()
    }

    let saveUpdateTask = () => {
        let id = "";
        id = taskEditInput.getAttribute("data-id");
        id = +id;
        currentData[id].name = taskEditInput.value;
        hideMessage();
        saveData();
    }

    // DESTROY
    let deleteTask = (id) => {
        id = +id;        
        currentData.splice( id, 1 );
        saveData();
    }

    // SERVISES
    let saveData = () => {
        storage.setItem("myToDoList", JSON.stringify(currentData));
        initFlow();
    }
    
    let swichTask = (id) => {      
        console.log("swichTask");  
        id = +id;        
        currentData[id].status = !currentData[id].status;
        saveData();        
    }
    
    let initInterfase = () => {
        let btns = [];
        
        btns = [].slice.call(document.getElementsByClassName("btn"));

        btns.forEach(item => item.addEventListener("click", ()=>takeAction(item)));
        
        let takeAction = (button) => {  
            if (button.getAttribute("role")==="task-add") addTask();
            if (button.getAttribute("role")==="task-swich") swichTask(button.getAttribute("data-id"));
            if (button.getAttribute("role")==="task-edit") updateTask(button.getAttribute("data-id"));
            if (button.getAttribute("role")==="task-delete") deleteTask(button.getAttribute("data-id"));
            if (button.getAttribute("role")==="task-save") saveUpdateTask();
            if (button.getAttribute("role")==="task-reset") hideMessage();
        };

        window.onclick = function(event) {
            if (event.target == updateMessageWrapper) hideMessage();
        } 
        taskEditInput.addEventListener("keyup", (event)=>{
            if (event.keyCode === 13) saveUpdateTask();
            if (event.keyCode === 27) hideMessage();
        })

        taskInput.addEventListener("keyup", (event)=>{
            if (event.keyCode === 13) addTask();
            if (event.keyCode === 27) taskInput.value="";
        })
    }




// start block
    let initFlow = () => {
        currentData = [];
        currentData = getData(storage);
        renderLists(currentData);
        initInterfase();        
    }  

    initFlow();
})()