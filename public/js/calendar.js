const date = new Date();
let selectedDate = null;

events = []

const renderCalendar = () => {
    date.setDate(1);

    const monthDays = document.querySelector('.days');

    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1, 
        0
    ).getDate();

    const prevLastDay = new Date(
        date.getFullYear(), 
        date.getMonth(), 
        0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
        date.getFullYear(), 
        date.getMonth() + 1, 
        0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    document.querySelector('.date h1').innerHTML = months[date.getMonth()];

    document.querySelector('.date p').innerHTML = new Date().toDateString();




    $.ajax({
        url: '/api/tasks',
        type: 'GET',
        dataType: 'json',
        success: function(tasks) {
          tasks.forEach(function(task) {
            if(task.taskDate != "" && task.acceptance == false){
                const isEventExists = events.some(event => event.id === task._id);
                if(!isEventExists){
                    events.push({
                        date: task.taskDate,
                        title: task.title,
                        time: task.PeriodStart + ' - ' + task.PeriodEnd,
                        description: task.description,
                        id : task._id
                      });
                }
                
            }
          });
          let days = "";

          for(let x = firstDayIndex; x > 0; x--) {
              days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
          }

            for (let i = 1; i <= lastDay; i++) {
                const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const eventForDay = events.find(event => event.date === fullDate);
                console.log(events);

                let dayHTML = `<div class="${eventForDay ? 'event-day' : 'not-event-day'} ${i === new Date().getDate() && date.getMonth() === new Date().getMonth() ? 'today' : ''}" data-date="${fullDate}">${i}</div>`;
        
                days += dayHTML;
            }

            for(let j = 1; j <= nextDays; j++) {
                days += `<div class="next-date">${j}</div>`;
            }
            monthDays.innerHTML = days;

            monthDays.querySelectorAll('div').forEach(day => {
                day.addEventListener('click', () => {
                    selectedDate = day.getAttribute('data-date');
                    displayEventsForDay(selectedDate);
                });
            });
        },
        error: function(xhr, status, error) {
          console.error("Error fetching tasks: ", error);
        }
      });

      





    
    // Define displayEventsForDay outside of renderCalendar
    function displayEventsForDay(selectedDate) {
        $.ajax({
          url: '/api/tasks',
          type: 'GET',
          dataType: 'json',
          success: function(tasks) {
            // Clear existing task cards
            $('#MainContentArea').empty();
            $('#MainContentArea').append(`
            <div class="card mt-3 TaskSelectionArea">
                <h6 class="mt-2">
                    Filter by Date
                </h6>
                <div class="row" id="filterWindow"></div>
            </div>`);
              
  
            // Dynamically create task cards and add them to the page
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
                    if(selectedDate == task.taskDate){
                        $('#filterWindow').append(taskCard); // 添加新创建的任务卡片到容器
                    }
                }
            });
          },
          error: function(xhr, status, error) {
            console.error("Error fetching tasks: ", error);
          }
        });
      }
}

document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
