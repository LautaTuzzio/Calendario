let eventos = JSON.parse(localStorage.getItem('eventosCalendario')) || {}

let diasFestivos = {
    '1-1': 'Año Nuevo',
    '5-1': 'Dia del Trabajo',
    '12-25': 'Navidad'
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
"Octubre", "Noviembre", "Diciembre"]

const datesContainer = document.getElementById("dates")
let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()

let events = JSON.parse(localStorage.getItem('calendarEvents')) || {}

// MM-DD
const holidays = {
    '1-1': 'Año Nuevo',
    '5-1': 'Dia del Trabajo',
    '12-25': 'Navidad'
}

function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return true
    }
    return false
}

function showEvents(date) {
    const eventsList = document.getElementById('events-list')
    const dayEvents = events[date] || []
    
    if (dayEvents.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No hay eventos para este dia</p>'
    } else {
        let html = ''
        for(let i = 0; i < dayEvents.length; i++) {
            html += '<div class="event-item">' + dayEvents[i] + '</div>'
        }
        eventsList.innerHTML = html
    }
}

function loadCalendar(month = currentMonth, year = currentYear) {
    datesContainer.innerHTML = ""
    document.getElementById("month").textContent = monthNames[month]
    document.getElementById("year").textContent = year + ' (' + (isLeapYear(year) ? 'Bisiesto' : 'No Bisiesto') + ')'
    
    let firstDay = new Date(year, month, 1).getDay()
    firstDay = firstDay === 0 ? 6 : firstDay - 1
    let totalDays = new Date(year, month + 1, 0).getDate()

    for (let i = 0; i < firstDay; i++) {
        let emptyDay = document.createElement("div")
        emptyDay.classList.add("day")
        datesContainer.appendChild(emptyDay)
    }
    
    for (let i = 1; i <= totalDays; i++) {
        let day = document.createElement("div")
        day.classList.add("day")
        day.textContent = i

        let today = new Date()
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add("today")
        }

        let holidayKey = (month + 1) + '-' + i
        if (holidays[holidayKey]) {
            day.classList.add('holiday')
            day.title = holidays[holidayKey]
        }

        let dateStr = year + '-' + 
                     (month + 1).toString().padStart(2, '0') + '-' + 
                     i.toString().padStart(2, '0')
        
        if (events[dateStr]) {
            day.classList.add('event')
            day.title = events[dateStr].join('\n')
        }

        day.addEventListener('click', function() {
            let selectedDay = document.querySelector('.selected-day')
            if (selectedDay) {
                selectedDay.classList.remove('selected-day')
            }
            
            day.classList.add('selected-day')
            
            document.getElementById('selected-date').textContent = 
                i + ' de ' + monthNames[month] + ' de ' + year
            
            showEvents(dateStr)
            
            document.getElementById('event-date').value = dateStr
        })

        datesContainer.appendChild(day)
    }
}

document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--
    if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
    }
    loadCalendar(currentMonth, currentYear)
})

document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++
    if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
    }
    loadCalendar(currentMonth, currentYear)
})

document.getElementById('save-event').addEventListener('click', function() {
    const date = document.getElementById('event-date').value
    const title = document.getElementById('event-title').value

    if (!date || !title) {
        alert('Por favor, complete todos los campos')
        return
    }

    if (!events[date]) {
        events[date] = []
    }
    events[date].push(title)

    localStorage.setItem('calendarEvents', JSON.stringify(events))

    document.getElementById('event-date').value = ''
    document.getElementById('event-title').value = ''

    loadCalendar(currentMonth, currentYear)
    showEvents(date)
})

loadCalendar()