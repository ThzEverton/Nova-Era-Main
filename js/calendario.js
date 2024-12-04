// Variáveis globais
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// Variáveis do modal
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

// Div do calendário
const calendar = document.getElementById('calendar');
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

// Funções

// Função para abrir o modal
function openModal(date) {
  clicked = date;
  const eventDay = events.find((event) => event.date === clicked);

  if (eventDay) {
    document.getElementById('eventText').innerText = eventDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

// Função load() será chamada quando a página carregar
function load() {
  const date = new Date();

  // Mudar título do mês
  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const daysMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMonth = new Date(year, month, 1);

  const dateString = firstDayMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  // Mostrar mês e ano
  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br', { month: 'long' })}, ${year}`;

  calendar.innerHTML = '';

  // Criando uma div com os dias
  for (let i = 1; i <= paddingDays + daysMonth; i++) {
    const dayS = document.createElement('div');
    dayS.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      dayS.innerText = i - paddingDays;

      const eventDay = events.find((event) => event.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        dayS.id = 'currentDay';
      }

      if (eventDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventDay.title;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener('click', () => openModal(dayString));
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}

// Função para fechar o modal
function closeModal() {
  eventTitleInput.classList.remove('error');
  newEvent.style.display = 'none';
  backDrop.style.display = 'none';
  deleteEventModal.style.display = 'none';

  eventTitleInput.value = '';
  clicked = null;
  load();
}

// Função para salvar o evento
function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

// Função para deletar o evento
function deleteEvent() {
  events = events.filter((event) => event.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

// Botões
function buttons() {
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', () => saveEvent());

  document.getElementById('cancelButton').addEventListener('click', () => closeModal());

  document.getElementById('deleteButton').addEventListener('click', () => deleteEvent());

  document.getElementById('closeButton').addEventListener('click', () => closeModal());
}

buttons();
load();
