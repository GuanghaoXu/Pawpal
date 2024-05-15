document.addEventListener('DOMContentLoaded', (event) => {
    // Function to filter task cards
    function filterTasks() {
      var durationValue = document.getElementById('durationFilter').value;
      var urgencyValue = document.getElementById('urgencyFilter').value;
      
      $.ajax({
        url: '/api/tasks', // 确保这个URL与您的后端路由匹配
        type: 'GET',
        dataType: 'json', // 预期从服务器返回的数据类型
        success: function(tasks) {
          // 清空原有的任务卡片
          $('#MainContentArea').empty();
          $('#MainContentArea').append(`
            <div class="card mt-3 TaskSelectionArea">
                <h6 class="mt-2">
                    Filter Result
                </h6>
                <div class="row" id="filterWindow"></div>
            </div>`);
            

          // 动态创建任务卡片并添加到页面
          tasks.forEach(function(task) {
            var taskCard = `
              <div class="col-md-4 mb-3 task-card" data-taskid="${task._id}">
                <div class="card TaskCard">
                  <div class="card-header"><b>${task.title}</b></div>
                  <div class="card-body">
                    <h5 class="card-title">${task.urgency} Task</h5>
                    <p class="card-text">${task.description}</p>
                    <button class="btn btn-primary accept-task" data-id="${task._id}">Accept</button>
                  </div>
                </div>
              </div>`;
            if(task.acceptance == false){
                if(durationValue == task.duration || durationValue == "All Durations"){
                    if(urgencyValue == task.urgency || urgencyValue == "All Tasks"){
                        $('#filterWindow').append(taskCard); // 添加新创建的任务卡片到容器
                    }
                }
            }
          });
        },
        error: function(xhr, status, error) {
          console.error("Error fetching tasks: ", error);
        }
      });
    }
    
    // Add event listener to the button
    document.getElementById('applyFilters').addEventListener('click', filterTasks);
  });
  