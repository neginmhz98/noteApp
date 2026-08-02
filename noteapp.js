// variables

let titleInput = document.getElementById("titleInput");
let noteInput = document.getElementById("noteInput");
let addButton = document.getElementById("addButton");
let notesContainer = document.getElementById("notesContainer");
let errorMessage = document.getElementById("errorMessage");
let searchInput = document.getElementById("searchInput");
let editId = null;
let notes = JSON.parse(localStorage.getItem("notes")) || [];


// Add / Update Button

addButton.addEventListener("click", function () {

    let title = titleInput.value.trim();
    let content = noteInput.value.trim();

    if (title !== "" || content !== "") {

        let note = {
            title: title,
            content: content,
            date: new Date().toLocaleString()
        };

        // Add new note

        if (editId === null) {

            note.id = Date.now();
            note.pinned = false;
            notes.push(note);


        }

        // Update existing note

        else {

            let noteIndex = notes.findIndex(function(item){
                return item.id === editId;

            });
            notes[noteIndex] = {

                id: editId,
                title: title,
                content: content,
                date: new Date().toLocaleString(),
                pinned: notes[noteIndex].pinned

            };

            editId = null;
            addButton.textContent = "Add";

        }

        localStorage.setItem("notes", JSON.stringify(notes));
        titleInput.value = "";
        noteInput.value = "";
        errorMessage.textContent = "";

        renderNotes(notes);

    } else {

        errorMessage.textContent = "*Please enter a title or note.";
    }

});



// Render Notes

function renderNotes(notesArray){

    notesContainer.innerHTML = "";

    notesArray.forEach(function(note){

        let noteCard = document.createElement("div");
        noteCard.classList.add("noteCard");

        // pinned style

        if(note.pinned){
            noteCard.classList.add("pinned");
        }


        let titleElement = document.createElement("h3");
        titleElement.dir = "auto";
        titleElement.textContent = note.title;


        let contentElement = document.createElement("p");
        contentElement.dir = "auto";
        contentElement.textContent = note.content;

        let dateElement = document.createElement("small");
        dateElement.textContent = note.date;

        // buttons container

        let buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttonsContainer");

        // Edit Button
        let editButton = document.createElement("button");
        editButton.classList.add("editButton");
        editButton.textContent = "Edit";


        // Delete Button

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteButton");
        deleteButton.textContent = "Delete";

        // Pin Button
        let pinnButton = document.createElement("button");
        pinnButton.classList.add("pinnButton");
        pinnButton.textContent = "pin";

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);
        buttonsContainer.appendChild(pinnButton);


        noteCard.appendChild(titleElement);
        noteCard.appendChild(contentElement);
        noteCard.appendChild(dateElement);
        noteCard.appendChild(buttonsContainer);

        notesContainer.appendChild(noteCard);

        // Delete Event

        deleteButton.addEventListener("click", function(){

            notes = notes.filter(function(item){
                return item.id !== note.id;

            });

            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes(notes);


        });

        // Pin Event

        pinnButton.addEventListener("click", function(){

            note.pinned = !note.pinned;


            notes.sort(function(a,b){

                return (b.pinned || false) - (a.pinned || false);

            });
            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes(notes);

        });


        // Edit Event

        editButton.addEventListener("click", function(){

            editId = note.id;
            titleInput.value = note.title;
            noteInput.value = note.content;
            addButton.textContent = "Update";
            titleInput.focus();

        });

    });



}

// Search

searchInput.addEventListener("input", function(){

    let searchText = searchInput.value.toLowerCase();
    let filteredNotes = notes.filter(function(note){
        return (

            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)


        );



    });
    renderNotes(filteredNotes);


});



// First Render

renderNotes(notes);
