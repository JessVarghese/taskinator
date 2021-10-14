var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
      alert("ypu need to fill out the task form!");
      return false;
  }

  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
  

  // package up data as an object
  var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
  };


 // has data attribute, so get task id and call function to complete edit process
 if (isEdit) {
   var taskId = formEl.getAttribute("data-task-id");
   completedEditTask(taskNameInput, taskTypeInput, taskId);
 }
 else {
   var taskDataObj = {
     name: taskNameInput,
     type: taskTypeInput
   };
   createTaskEl(taskDataObj);
 }
};

var createTaskEl = function (taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
 

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  //increase task counter fo next unique id
  taskIdCounter++;
};

var createTaskActions = function(taskID) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskID);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskID);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskID);
  
  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  //edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);

  }

  //delete button was clicked
  if(event.target.matches(".delete-btn")) {
    // get the element task ID
    var taskId = event.target.getAttribute("data-task-id");
    console.log(taskId);
  }
  if (event.target.matches(".delete-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

pageContentEl.addEventListener("click", taskButtonHandler);

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
  taskSelected.remove();
};

var editTask = function(taskId) {
  console.log("editing task #" + taskId + "']");
  
  //get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

  //get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  document.querySelector("input[name='task-name']").value = taskName;

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);

}

var completedEditTask = function(taskName, taskType, taskId) {
  //find the mathcing task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");

  // set new values
taskSelected.querySelector("h3.task-name").textContent = taskName;
taskSelected.querySelector("span.task-type").textContent = taskType;

alert("Task Updated!");

formEl.removeAttribute("data-task-id");
document.querySelector("#save-task").textContent = "Add Task";
};


var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

};

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

pageContentEl.addEventListener("change", taskStatusChangeHandler);