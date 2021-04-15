//Book Class
class Book {
    constructor(titre, auteur, isbn){
       this.titre = titre
       this.auteur = auteur
       this.isbn = isbn
    }
}

//UI Class:
class UI {
    static displayBooks(){
        const books = Store.getBooks()

        books.forEach((book) => UI.addBookToList(book))
        
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${book.titre}</td>
            <td>${book.auteur}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`
            list.appendChild(row)
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert (message, className){
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form)
        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields(){
        document.querySelector('#titre').value = ''
        document.querySelector('#auteur').value = ''
        document.querySelector('#isbn').value = ''
    }

}

//store Class: Handles Storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }

    static addBook(book){
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn){
        const books = Store.getBooks()
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        })
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent actual submit
    e.preventDefault();

    //get form values
    const titre = document.querySelector('#titre').value
    const auteur = document.querySelector('#auteur').value
    const isbn = document.querySelector('#isbn').value

    //Validate
    if(titre === '' || auteur === '' || isbn === '') {
        UI.showAlert('Veuillez remplir tous les champs SVP', 'danger')
    } else {
        //instatiate book
        const book = new Book(titre, auteur, isbn)
    
        //add Book to UI
        UI.addBookToList(book)

        //add book to store
        Store.addBook(book)

        //show success message
        UI.showAlert('Livre ajouté avec succès', 'success')

        //clear fields
        UI.clearFields()
    }
    
})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {

    //remove book from UI
    UI.deleteBook(e.target)

    //remove book from store
    (e.target.parentElement.previousElementSibling.textContent)
    //show success message
    UI.showAlert('Livre supprimé avec succès', 'success')
})
