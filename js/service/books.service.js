'use strict'

const BOOKS_STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 6

var gBooks
var gPageIdx = 0
var gFilterBy = { maxPrice: 50, name: '' }
var gFilteredBooksCount

function moveToPage(page) {
	if (page === '+') gPageIdx++
	else if (page === '-') gPageIdx--
	else gPageIdx = +page
}

function getBooksForDisplay() {
	if (!gBooks || !gBooks.length) _createBooks()
	var books = gBooks

	books = books.filter((book) => book.name.includes(gFilterBy.name))
	books = books.filter((book) => book.price < gFilterBy.maxPrice)

	gFilteredBooksCount = books.length
	const startIdx = gPageIdx * PAGE_SIZE
	books = books.slice(startIdx, startIdx + PAGE_SIZE)
	return books
}

function addBook(name, price) {
	const book = _createBook(name, price)
	gBooks.unshift(book)
	_saveBooksToStorage()
}

function removeBook(bookId) {
	const bookIdx = gBooks.findIndex((book) => bookId === book.id)
	gBooks.splice(bookIdx, 1)
	_saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
	const book = getBookById(bookId)
	if (!book) return
	book.price = newPrice
	_saveBooksToStorage()
	return book
}

function changeRating(diff, bookId) {
	const book = getBookById(bookId)
	book.rate = book.rate + diff
	_saveBooksToStorage()
	return book.rate
}

function setFilterBy(filterBy) {
	if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
	if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
	return gFilterBy
}

function setSort(val, diff){
    var books = gBooks

    if(val !== 'name') books = books.sort((a, b) => (a[`${val}`] - b[`${val}`]) * diff) 
	else books = books.sort((a, b) => {
		if (a.name > b.name) return 1 * diff
		else return -1 * diff
	}) 
    return books     
}

function getIsReading(book) {
	return book.isReading ? true : false
}

function getFilterBy() {
	return gFilterBy
}

function getPageCount() {
	return Math.ceil(gFilteredBooksCount / PAGE_SIZE)
}

function getCurrPage() {
	return gPageIdx
}

function getBookById(bookId) {
	return gBooks.find((book) => bookId === book.id)
}

function _createBook(name, price) {
	return {
		id: makeId(),
		name,
		price,
		imgUrl: '',
		about: makeLorem(),
		aboutAuthor: makeLorem(20),
		rate: 0,
	}
}

function _createBooks() {
	var books = loadFromStorage(BOOKS_STORAGE_KEY)

	if (!books || !books.length) {
		books = []

		for (var i = 0; i < 27; i++) {
			var name = makeLorem(2)
			if(name.charAt(0) === '.') name.charAt(0) = 'The '
			name = name.charAt(0).toUpperCase() + name.slice(1)
			var price = getRandomIntInclusive(10, 49)
			books.push(_createBook(name, price))
		}
	}
	gBooks = books
	_saveBooksToStorage()
}

function _saveBooksToStorage() {
	saveToStorage(BOOKS_STORAGE_KEY, gBooks)
}
