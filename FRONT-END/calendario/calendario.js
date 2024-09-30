document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('eventDate').value;
    const type = document.getElementById('eventType').value;
    const description = document.getElementById('eventDescription').value;

    if (date && type && description) {
        const eventList = document.getElementById('eventList');
        const listItem = document.createElement('li');
        listItem.textContent = `${date} - ${type}: ${description}`;
        eventList.appendChild(listItem);

        document.getElementById('eventForm').reset();
    }
});
