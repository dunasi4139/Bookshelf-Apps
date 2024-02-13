const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "books";
const STORAGE_KEY = "BOOK_APPS";

const generateId = () => {
    return +new Date();
};

const generateBook = (id, title, author, year, isCompleted) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
};

const findBook = (id) => {
    for (const book of books) {
        if (book.id === id) {
            return book;
        }
    }
    return null;
};

const findBookIndex = (id) => {
    for (const index in books) {
        if (books[index].id === id) {
            return index;
        }
    }

    return -1;
};
const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
};

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));

    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(STORAGE_KEY));
    });
}

const createBook = (book) => {
    const textTitle = document.createElement("h3");
    textTitle.innerText = book.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = book.author;

    const textYear = document.createElement("p");
    textYear.innerText = book.year;

    const container = document.createElement("article");
    container.classList.add("book-item");
    container.append(textTitle, textAuthor, textYear);
    container.setAttribute("id", `book-${book.id}`);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn-read");

    const isNotCompletedButton = document.createElement("button");
    isNotCompletedButton.classList.add("success");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("danger");
    deleteButton.innerText = "Hapus buku";

    deleteButton.addEventListener("click", function () {
        removeBookFromRead(book.id);
    });

    if (book.isCompleted) {
        isNotCompletedButton.innerText = "Belum selesai";

        isNotCompletedButton.addEventListener("click", function () {
            undoBookFromRead(book.id);
        });

        buttonContainer.append(isNotCompletedButton, deleteButton);
        container.append(buttonContainer);
    } else {
        isNotCompletedButton.innerText = "Selesai dibaca";

        isNotCompletedButton.addEventListener("click", function () {
            addBookToRead(book.id);
        });

        buttonContainer.append(isNotCompletedButton, deleteButton);
        container.append(buttonContainer);
    }

    return container;
};
const addBook = () => {
    const bookTitle = document.getElementById("input-title").value;
    const bookAuthor = document.getElementById("input-author").value;
    const bookYear = document.getElementById("input-year").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const generateBookID = generateId();
    const book = generateBook(
        generateBookID,
        bookTitle,
        bookAuthor,
        bookYear,
        bookIsComplete
    );
    books.push(book);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const addBookToRead = (id) => {
    const bookTarget = findBook(id);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const removeBookFromRead = (id) => {
    const bookTarget = findBookIndex(id);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const undoBookFromRead = (id) => {
    const bookTarget = findBook(id);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const clearForm = () => {
    const bookTitle = document.getElementById("input-title");
    const bookAuthor = document.getElementById("input-author");
    const bookYear = document.getElementById("input-year");
    const bookIsComplete = document.getElementById("inputBookIsComplete");

    bookTitle.value = "";
    bookAuthor.value = "";
    bookAuthor.value = "";
    bookYear.value = "";
    bookIsComplete.value = false;
};
const search = () => {
    const searchInput = document
        .getElementById("search-title")
        .value.toLowerCase();

    for (i = 0; i < books.length; i++) {
        const inner = books[i].title;
        const bookIdElement = document.getElementById(`book-${books[i].id}`);

        if (inner.toLowerCase().indexOf(searchInput) > -1) {
            bookIdElement.style.display = "";
        } else {
            bookIdElement.style.display = "none";
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form-book");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
        clearForm();
    });

    const searchForm = document.getElementById("form-search");
    searchForm.addEventListener("keyup", (event) => {
        event.preventDefault();
        search();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const unreadBook = document.getElementById("incomplete-book");
    unreadBook.innerHTML = "";

    const readBook = document.getElementById("complete-book");
    readBook.innerHTML = "";

    for (const book of books) {
        const bookEl = createBook(book);
        if (!book.isCompleted) unreadBook.append(bookEl);
        else readBook.append(bookEl);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

