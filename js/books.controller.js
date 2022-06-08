'use strict'

var gCurrLang = 'en'

function onInit() {
    renderFilterByQueryStringParams()
	render()
	renderModalQueryStringParams()
}

function render(){
	renderBooks()
    renderPageBtns()
}

function renderBooks() {
    const books = getBooksForDisplay()
    const strHTMLs = books.map(
        (book) => `
    <tr class="table-success">
		<th scope="row">${book.id}</th>
        <td>${book.name}</td>
        <td>${formatCurrency(book.price, gCurrLang)}</td>
        <td><button class="read" data-trans="read-book" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="onReadBook('${book.id}')">Read</button></td>
        <td><button class="update" data-trans="update-book" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="delete" data-trans="delete-book" onclick="onRemoveBook('${book.id}')">Delete</button></td>
    </tr>`
    )
    document.querySelector('tbody').innerHTML = strHTMLs.join('')
	doTrans()
}

function onMoveToPage(page, elBtn) {
    moveToPage(page)
	render()

    const currPage = getCurrPage()
    document.querySelector(`.btn${currPage}`).classList.add('pressed')
    document.querySelector('.next').disabled =
        currPage === getPageCount() - 1 ? true : false
    document.querySelector('.prev').disabled = currPage === 0 ? true : false
}

function onAddBook() {
    const name = prompt('Enter book name')
    const price = +prompt('Enter price')
    addBook(name, price)
    renderBooks()
}
function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

// function onUpdateBook(bookId) {
//     document.querySelector('.update-modal').classList.add('open')
//     var book = getBookById(bookId)
//     document.querySelector('[name="update-price"]').value = book.price

//     const newPrice = document.querySelector('[name="update-price"]').value
//     updateBook(bookId, newPrice)
//     renderBooks()
// }

// function onCloseUpdate(){

//     document.querySelector('.update-modal').classList.remove('open')
// }
function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    const newPrice = +prompt('Enter the updated price for the book', book.price)
    if (newPrice === book.price) return
    updateBook(bookId, newPrice)
    renderBooks()
}

function onReadBook(bookId) {
    renderRateBtns(bookId)
    const book = getBookById(bookId)
    const elModal = document.querySelector('.my-modal')

    elModal.querySelector('#staticBackdropLabel').innerText = book.name
    elModal.querySelector('h5 span').innerText = book.price + '$'
    elModal.querySelector('.about-book').innerText = book.about
    elModal.querySelector('.about-author').innerText = book.aboutAuthor
    elModal.querySelector('.rating span').innerText = book.rate
	setRateBtnsDisable(book.rate)

    elModal.classList.add('open')

    saveQueryString(book)
}

function onChangeRating(diff, bookId) {
    const currRate = changeRating(diff, bookId)
    const elNum = document.querySelector('.rating span')
    elNum.innerText = currRate
	setRateBtnsDisable(currRate)
}

function setRateBtnsDisable(rate) {
	document.querySelector('.plus').disabled = rate >= 10 ? true : false
	document.querySelector('.minus').disabled = rate <= 0 ? true : false
}

function onCloseModal() {
    // document.querySelector('.modal').classList.remove('open')
    saveQueryString()
}

function renderRateBtns(bookId) {
    var strHTML = `<button type="button" class="minus btn btn-secondary" onclick="onChangeRating(-1, '${bookId}')">-</button>
                    <span>0</span>
                    <button type="button" class="plus btn btn-secondary" onclick="onChangeRating(1, '${bookId}')">+</button>`

    document.querySelector('.rating').innerHTML = strHTML
}

function renderPageBtns() {
    const currPage = getCurrPage()
    const pageCount = getPageCount()
    var strHTML = ''
    for (var i = 0; i < pageCount; i++) {
        strHTML += `<button type="button" class="btn btn-outline-secondary btn${i}" onclick="onMoveToPage('${i}', this)">${
            i + 1
        }</button>`
    }
    document.querySelector('.page-btns-nums').innerHTML = strHTML
    document.querySelector(`.btn${currPage}`).classList.add('pressed')
}

function onSetLang(lang) {
	gCurrLang = lang
	setLang(lang)
    if (lang === 'he') $('body').css('direction', 'rtl')
    else $('body').css('direction', 'ltr')
	doTrans()
	render()
}

function onSetFilterBy(filterBy) {
    // filterBy.name = $('[name="filter-name"]').val()
	$('.price-value').text(filterBy.maxPrice)
    filterBy = setFilterBy(filterBy)
	render()
    saveQueryString()
}

function onSetSort(val, diff = 1){
    setSort(val, diff)
    render()
}

// function saveFilterQueryString(){
//     const filter = getFilterBy()

//     const queryStringParams = `?name=${filter.name}&maxPrice=${filter.maxPrice}`
//     const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
//     window.history.pushState({ path: newUrl }, '', newUrl)
// }

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        name: queryStringParams.get('name') || '',
        maxPrice: +queryStringParams.get('maxPrice') || 50,
    }

    document.querySelector('[name="filter-name"]').value = filterBy.name
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    setFilterBy(filterBy)
}
function saveQueryString(book = '') {
    const filter = getFilterBy()

    const queryStringParams = `?name=${filter.name}&maxPrice=${filter.maxPrice}&readingId=${book.id}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderModalQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)

    const readingId = queryStringParams.get('readingId') || ''
    if (readingId) onReadBook(readingId)
}
