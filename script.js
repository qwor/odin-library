let myLibrary = []

function Book(title, author, pages, isRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
}

Book.prototype.toggleRead = function() {
    this.isRead = !this.isRead
}

const $ = document.querySelector.bind(document)

const grid = $('main')
const modal = $('.modal')
const form = $('.modal form')
const addBtn = $('.add-btn')
const clearBtn = $('.clear-btn')
const inputTitle = $('#input-title')
const inputAuthor = $('#input-author')
const inputPages = $('#input-pages')
const inputRead = $('#input-read')
const error = $('#error')


function resetGrid() {
    grid.innerHtml = ''
}

const removeBook = (e) => {
    const index = e.target.parentNode.dataset.id
    if (index >= 0 && index < myLibrary.length)
        myLibrary.splice(index, 1)
    redrawBooks()
}

const changeReadButton = (e) => {
    const index = e.target.parentNode.dataset.id
    myLibrary[index].toggleRead()

    if (myLibrary[index].isRead) {
        e.target.classList.remove('btn-green')
        e.target.classList.add('btn', 'btn-read', 'btn-red')
        e.target.textContent = 'Not read'
    } else {
        e.target.classList.remove('btn-red')
        e.target.classList.add('btn', 'btn-read', 'btn-green')
        e.target.textContent = 'Read'
    }
}

function redrawBooks() {
    grid.innerHtml = ''
    let cardEls = []

    myLibrary.forEach((el, index) => {
        const titleEl = document.createElement('p')
        titleEl.classList.add('title')
        titleEl.textContent = `\"${el.title}\"`

        const authorEl = document.createElement('p')
        authorEl.classList.add('author')
        authorEl.textContent = el.author

        const pagesEl = document.createElement('p')
        pagesEl.classList.add('pages')
        pagesEl.textContent = `${el.pages} page`
        if (el.pages !== 1) {
            pagesEl.textContent += 's'
        }

        const isReadEl = document.createElement('button')
        if (el.isRead) {
            isReadEl.classList.add('btn', 'btn-read', 'btn-red')
            isReadEl.textContent = 'Not read'
        } else {
            isReadEl.classList.add('btn', 'btn-read', 'btn-green')
            isReadEl.textContent = 'Read'
        }
        isReadEl.onclick = changeReadButton

        const removeEl = document.createElement('button')
        removeEl.classList.add('btn', 'btn-remove')
        removeEl.textContent = 'Remove'
        removeEl.onclick = removeBook

        const cardEl = document.createElement('div')
        cardEl.classList.add('card')
        cardEl.setAttribute('data-id', index)
        cardEl.appendChild(titleEl)
        cardEl.appendChild(authorEl)
        cardEl.appendChild(pagesEl)
        cardEl.appendChild(isReadEl)
        cardEl.appendChild(removeEl)

        cardEls.push(cardEl)
    })
    grid.replaceChildren(...cardEls)
}

function hideModal() {
    modal.classList.remove('active')
    form.reset()
}

modal.onclick = (e) => {
    if (e.target === modal) {
        hideModal()
    }
}

addBtn.onclick = () => {
    modal.classList.add('active')
}

clearBtn.onclick = () => {
    myLibrary = []
    redrawBooks()
}

inputRead.onclick = () => {
    inputRead.value = inputRead.value === 'false' ? 'true' : 'false'
}

form.onsubmit = (e) => {
    e.preventDefault()
    if (inputTitle.checkValidity() && inputAuthor.checkValidity() && inputPages.checkValidity()) {
        const title = inputTitle.value
        const author = inputAuthor.value
        const pages = +inputPages.value
        const isRead = inputRead.value === 'true'

        if (myLibrary.some((el) => {
            return el.title === title && el.author === author && el.pages === pages
        })) {
            error.classList.add('active')
            error.textContent = 'Book already exists'
        } else {
            error.classList.remove('active')
            error.textContent = ''
            let book = new Book(title, author, pages, isRead)
            myLibrary.push(book)
            hideModal()
            redrawBooks()
        }
    }
}

redrawBooks()
