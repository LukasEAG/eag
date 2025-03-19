const htmlLang = document.querySelector('[lang]')
const privacyPl = document.querySelector('.privacy-pl')
const privacyEn = document.querySelector('.privacy-en')
const privacyDe = document.querySelector('.privacy-de')

const sessionLang = localStorage.getItem('lang')

const privacyObj = {
    "pl": privacyPl,
    "en": privacyEn,
    "de": privacyDe
}

htmlLang.setAttribute('lang', sessionLang)


for (const [key, value] of Object.entries(privacyObj)) {
    if (htmlLang.lang === key) {
        value.style.display = 'block'
    }}

