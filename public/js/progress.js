document.addEventListener('DOMContentLoaded', (event) => {
    // Function to filter task cards
    function progressfilterTasks() {
      var progressSituation = document.getElementById('progressFilter').value;
      
      $.ajax({
        url: '/api/tasks',
        type: 'GET',
        dataType: 'json',
        success: function(tasks) {
          // Clear existing task cards
          $('#MainProgressArea').empty();
          $('#MainProgressArea').append(`
            <div class="card mt-3 TaskSelectionArea">
                <h6 class="mt-2">
                    Filter Result
                </h6>
                <div class="row" id="ProgressFilterWindow"></div>
            </div>`);
            

          // Dynamically create task cards and add them to the page
          tasks.forEach(function(task) {
            var taskCard = `
              <div class="col-md-4 mb-3 task-card" data-taskid="${task._id}">
                <div class="card TaskCard">
                  <div class="card-header">${task.title}</div>
                  <div class="card-body">
                    <h5 class="card-title">${task.urgency} Task</h5>
                    <p class="card-text">${task.description}</p>
                    <div class="task-actions">
                      <button class="btn btn-success start-task" data-id="${task._id}">Start</button>
                      <button class="btn btn-danger cancel-task" data-id="${task._id}">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>`;
            if(task.acceptance == true){
                // In progress
                if(task.Start == true && task.Done == false && progressSituation == "In progress"){
                  $('#ProgressFilterWindow').append(taskCard); 
                  var startTime = new Date(task.StartAt);
                  var $taskCard = $(`[data-taskid="${task._id}"]`).last();
                  startTimeJob(task._id, $taskCard,startTime);
                }
                // Scheduled, not started
                else if(task.Start == false && task.Done == false && progressSituation == "Scheduled"){
                  $('#ProgressFilterWindow').append(taskCard); 
                }
                // Completed
                else if(task.Start == true && task.Done == true && progressSituation == "Completed"){
                  $('#ProgressFilterWindow').append(taskCard); 
                  var $taskCard = $(`[data-taskid="${task._id}"]`).last();
                  $taskCard.find('.task-actions').html(`<button class="btn btn-primary" disabled>Completed</button>`);
                } 
                // Normal display
                else if (progressSituation == "All tasks"){
                  $('#ProgressFilterWindow').append(taskCard); 
                  if(task.Start == true){
                    var startTime = new Date(task.StartAt);
                    var $taskCard = $(`[data-taskid="${task._id}"]`).last();
                    if(task.Done == true){
                      $taskCard.find('.task-actions').html(`<button class="btn btn-primary" disabled>Completed</button>`);
                    } else {
                      startTimeJob(task._id, $taskCard,startTime);
                    }
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
    document.getElementById('applyProgressFilters').addEventListener('click', progressfilterTasks);
  });

  function startTimeJob(taskId, $taskCard, sT) {
    // Get the start time
    var startTime = sT;

    // Updated task and timer
    $taskCard.find('.task-actions').html(`
        <div class="timer">--:--:--</div>
        <button class="btn btn-primary complete-task" data-id="${taskId}">Complete</button>
    `);

    // start time interval
    var interval = setInterval(() => {
        var now = new Date();
        var elapsed = new Date(now - startTime);
        var hours = elapsed.getUTCHours().toString().padStart(2, '0');
        var minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
        var seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');
        $taskCard.find('.timer').text(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    // Click event for binding the "Complete" button
    // Unbind the old click event handling function first to avoid duplicate binding
    $taskCard.find('.complete-task').off('click').on('click', function() {
        $(this).html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
        )
        clearInterval(interval); // stop timer
        $.ajax({
            url: '/api/tasks/complete/' + taskId,
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                $taskCard.find('.task-actions').html(`<button class="btn btn-primary" disabled>Completed</button>`);
            },
            error: function(xhr, status, error) {
                console.error("Error Completing task: ", error);
            }
        });
    });
  }
  