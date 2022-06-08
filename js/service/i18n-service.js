var gTrans = {
    title: {
        en: 'My Bookshop <img src="img/book-half.svg"/>',
        he: '<img src="img/book-half.svg"/> חנות הספרים שלי',
    },
    'create-book': {
        en: 'Create new book <img src="img/book.svg"/>',
        he: 'הוסף ספר חדש <img src="img/book.svg"/>',
    },
    'search-book': {
        en: 'Search book',
        he: 'חפש ספר',
    },
    lang: {
        en: 'Language',
        he: 'שפה',
    },
    sort: {
        en: 'Sort',
        he: 'מיון',
    },
    'sort-name': {
        en: 'Name (A-Z)',
        he: 'שם הספר',
    },
    'sort-price': {
        en: 'Price (low to high)',
        he: 'מחיר (מהנמוך לגבוה)',
    },
    'sort-name-z': {
        en: 'Name (Z-A)',
        he: 'שם הספר (ת-א)',
    },
    'sort-price-high': {
        en: 'Price (high to low)',
        he: 'מחיר (מהגבוה לנמוך)',
    },
    'max-price': {
        en: 'Max Price: ',
        he: 'מחיר מקסימלי: ',
    },
    'table-title': {
        en: 'Title',
        he: 'כותר',
    },
    'table-price': {
        en: 'Price',
        he: 'מחיר',
    },
    'table-action': {
        en: 'Action',
        he: 'פעולה',
    },
    'read-book': {
        en: 'Read',
        he: 'קריאה',
    },
    'update-book': {
        en: 'Update',
        he: 'עדכון',
    },
    'delete-book': {
        en: 'Delete',
        he: 'מחיקה',
    },
}

var gCurrLang = 'en'

function getTrans(transKey) {
    const keyTrans = gTrans[transKey]
    if (!keyTrans) return 'UNKNOWN'

    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans.en

    return txt
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach((el) => {
        const transKey = el.dataset.trans
        const txt = getTrans(transKey)

        if (el.localName === 'input') el.placeholder = txt
        else el.innerHTML = txt
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function formatNumOlder(num) {
    return num.toLocaleString('es')
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

console.log(formatCurrency(123));

function formatCurrency(num, lang) {
    const country = lang === 'he'? 'he-IL' : 'en-US'
    if(lang === 'he') num *= 3.34
    return new Intl.NumberFormat(country, {
        style: 'currency',
        currency: lang === 'he'? 'ILS' : 'USD',
    }).format(num)
}

function formatDate(time) {
    var options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }

    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

function kmToMiles(km) {
    return km / 1.609
}
