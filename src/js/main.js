// Dynamic height
const body = document.querySelector('body')
let lastWidth = window.innerWidth
let lastHeight = window.innerHeight

const dynamicHeight = () => {
	const vh = window.innerHeight * 0.01
	body.style.setProperty('--vh', `${vh}px`)
	document.querySelector('.header').style.height = `calc(var(--vh) * 100)`
}
dynamicHeight()

window.addEventListener('resize', () => {
	const currentWidth = window.innerWidth
	const currentHeight = window.innerHeight
	if (Math.abs(currentWidth - lastWidth) > 100 || Math.abs(currentHeight - lastHeight) < 30) {
		dynamicHeight()
		lastWidth = currentWidth
		lastHeight = currentHeight
	}
})
screen.orientation.addEventListener('change', dynamicHeight)

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('contactForm')
	const desktopContainer = document.getElementById('desktopFormContainer')
	const mobileContainer = document.getElementById('mobileFormContainer')

	function moveForm() {
		if (window.innerWidth < 992) {
			mobileContainer.appendChild(form)
			form.classList.add('contact__form-mobile')
			form.classList.remove('contact__form')
		} else {
			desktopContainer.appendChild(form)
			form.classList.add('contact__form')
			form.classList.remove('contact__form-mobile')
		}
	}
	moveForm()
	window.addEventListener('resize', moveForm)
})

const nav = document.querySelector('.nav')
const logoScroll = document.querySelector('.nav__logo')
const menuOpenBtns = document.querySelectorAll('.nav__mobile-menu-btn--open')
const menuCloseBtn = document.querySelectorAll('.nav__mobile-menu-btn--close')
const mobileMenu = document.querySelector('.nav__menu')
const menuItems = document.querySelectorAll('.nav__menu-item')
const webMenuBtn = document.querySelector('.nav__menu-btn')
const menuList = document.querySelector('.nav__menu-items')
const aboutUs = document.querySelector('.nav__about-us')
const menuReturnBtn = document.querySelector('.nav__menu-return-btn')
const siteMAboutUs = document.querySelector('.siteMap-AboutUs')

menuOpenBtns.forEach(btn =>
	btn.addEventListener('click', () => {
		mobileMenu.classList.add('active')
		body.classList.add('stop-scrolling')
		closeLang()
	})
)
menuCloseBtn.forEach(btn => {
	btn.addEventListener('click', () => {
		mobileMenu.classList.remove('active')
		btn.classList.remove('show-btn')
		body.classList.remove('stop-scrolling')
		mobileMenu.classList.remove('active')
		aboutUs.classList.remove('active')
		menuList.classList.remove('hide')
	})
})
const openAboutOrFaq = item => {
	if (item.hasAttribute('data-aboutUs-btn')) {
		menuList.classList.add('hide')
		aboutUs.classList.add('active')
		menuCloseBtn.forEach(btn => btn.classList.add('hide-btn'))
		menuReturnBtn.classList.add('show-btn')
	} else if (item.hasAttribute('data-faq-btn')) {
		faqBody.classList.add('active')
	}
}
menuItems.forEach(item => {
	item.addEventListener('click', () => {
		if (item.hasAttribute('data-aboutUs-btn') || item.hasAttribute('data-faq-btn')) {
			openAboutOrFaq(item)
			closeLang()
		} else {
			mobileMenu.classList.remove('active')
			menuOpenBtns.forEach(btn => btn.classList.remove('hide-btn'))
			menuCloseBtn.forEach(btn => btn.classList.add('show-btn'))
			langList.classList.remove('active-lang')
			body.classList.remove('stop-scrolling')
		}
	})
})

siteMAboutUs.addEventListener('click', () => {
	body.classList.add('stop-scrolling')
	mobileMenu.classList.add('active')
	menuList.classList.add('hide')
	aboutUs.classList.add('active')
})

menuReturnBtn.addEventListener('click', () => {
	menuList.classList.remove('hide')
	aboutUs.classList.remove('active')
	menuCloseBtn.forEach(btn => btn.classList.remove('hide-btn'))
	menuReturnBtn.classList.remove('show-btn')
})

window.addEventListener('scroll', () => {
	if (window.scrollY > 10) {
		nav.classList.add('show')
		logoScroll.classList.add('show')
	} else if (window.scrollY <= 10) {
		nav.classList.remove('show')
		logoScroll.classList.remove('show')
	}
})
const htmlLang = document.querySelector('[lang]')
const multiLangBtns = document.querySelectorAll('.lang__open-btn')
const closeLangBtn = document.querySelector('.lang__close-btn')
const langList = document.querySelector('.lang__btns-list')

multiLangBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		btn.classList.add('hide')
		langList.classList.add('active-lang')
		body.classList.add('stop-scrolling')
	})
})

closeLangBtn.addEventListener('click', () => {
	closeLang()
})

const closeLang = () => {
	langList.classList.remove('active-lang')
	multiLangBtns.forEach(btn => btn.classList.remove('hide'))
	body.classList.remove('stop-scrolling')
}

const langBtns = document.querySelectorAll('.lang__btn-item')

let MultiLang = function (url, lang, onload) {
	this.phrases = {}
	this.selectedLanguage = (lang || navigator.language || navigator.userLanguage).substring(0, 2)
	this.onLoad = onload
	if (typeof url !== 'undefined') {
		let obj = this
		let req = new XMLHttpRequest()
		req.open('GET', url, true)
		req.onreadystatechange = function (evt) {
			if (evt.target.readyState == 4 && evt.target.status == 200) {
				this.phrases = JSON.parse(evt.target.responseText)

				this.setLanguage(this.selectedLanguage)

				if (this.onLoad) {
					this.onLoad()
				}
			}
		}.bind(obj)
		req.addEventListener(
			'error',
			function (e) {
				console.log('MultiLang.js: Error reading json file.')
			},
			false
		)
		req.send(null)
	}
	this.setLanguage = function (langcode) {
		if (!this.phrases.hasOwnProperty(langcode)) {
			for (let key in this.phrases) {
				if (this.phrases.hasOwnProperty(key)) {
					langcode = key
					break
				}
			}
		}
		this.selectedLanguage = langcode
	}
	this.get = function (key) {
		let str
		if (this.phrases[this.selectedLanguage]) str = this.phrases[this.selectedLanguage][key]
		str = str || key
		return str
	}
}
let multilang

function onLoad() {
	multilang = new MultiLang('multilang.json', 'pl')
}
function langSelectChange(sel) {
	multilang.setLanguage(sel.value)
	htmlLang.setAttribute('lang', sel.value)
	refreshLabels()
}
function refreshLabels() {
	let allnodes = document.querySelectorAll('[data-lang]')

	for (let i = 0, max = allnodes.length; i < max; i++) {
		let idname = allnodes[i].dataset.lang
		if (idname != '') {
			allnodes[i].textContent = multilang.get(idname)
		}
	}
}
langBtns.forEach(btn =>
	btn.addEventListener('click', e => {
		langSelectChange(e.target)
	})
)
body.addEventListener('load', onLoad())
langBtns.forEach(btn =>
	btn.addEventListener('click', () => {
		closeLang()
	})
)
const realisation = document.querySelector('.realisation')
const realisationBtns = document.querySelectorAll('[data-realisation-btn]')

const realisationObject = {
	one: {
		img: './dist/img/realisation.jpg',
	},
	two: {
		img: './dist/img/realisationevent.jpg',
	},
	three: {
		img: './dist/img/realisationconcert.jpg',
	},
	four: {
		img: './dist/img/realisationpromotion.jpg',
	},
	five: {
		img: './dist/img/realisationgala.jpg',
	},
	six: {
		img: './dist/img/realisationbanquets.jpg',
	},
}

const clearBtnCheck = btn => {
	btn.forEach(btn => {
		btn.dataset.realisationBtn = undefined
	})
}
realisationBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		clearBtnCheck(realisationBtns)
		for (const [key, value] of Object.entries(realisationObject)) {
			if (btn.value === key) {
				realisation.style.opacity = '0'
				realisation.style.backgroundImage = `url(${value.img})`
				setTimeout(() => {
					realisation.style.opacity = '1'
				}, 400)
				btn.dataset.realisationBtn = true
			}
		}
	})
})

const hiddenSection = document.querySelectorAll('.hidden')

const handleScroll = () => {
	hiddenSection.forEach(section => {
		const spos = section.getBoundingClientRect()
		if (spos.top < window.innerHeight * 0.75 && spos.bottom > 0) {
			section.classList.add('visible')
		}
	})
}

window.addEventListener('scroll', handleScroll)

const offerContextText = document.querySelector('.offer__context-text-p')
const offerNumber = document.querySelector('.offer__context-numb-p')
const offerNumberBorder = document.querySelector('.offer__context-numb')
const offerBtns = document.querySelectorAll('.offer__context-btn')

const offerObject = {
	main: {
		color: '#b9b9c2',
	},
	planning: {
		number: '01',
		pl: {
			text: 'Oferujemy wsparcie organizacyjne na każdym etapie procesu planowania wydarzenia. Pomagamy w doborze lokalizacji, dostawców, planowaniu harmonogramu, co przekłada się na zmniejszenie obciążenia organizacyjnego dla klienta.',
		},
		en: {
			text: 'We offer organizational support at every stage of the event planning process. We help in selecting locations, suppliers, and planning the schedule, which translates into a reduction in the organizational burden for the client.',
		},
		de: {
			text: 'Wir bieten organisatorische Unterstützung in jeder Phase des Veranstaltungsplanungsprozesses. Wir helfen bei der Auswahl von Standorten, Lieferanten und der Planung des Zeitplans, was zu einer Reduzierung des organisatorischen Aufwands für den Kunden führt.',
		},
		color: '#AC8BC7',
	},
	scean: {
		number: '02',
		pl: {
			text: 'Zapewniamy profesjonalne rozwiązania techniczne, które sprawiają, że każde wydarzenie staje się spektakularne. Oferujemy doskonałe oświetlenie, nagłośnienie i\u00a0efekty specjalne, dostosowane do charakteru danego eventu.',
		},
		en: {
			text: 'We provide professional technical solutions that make every event spectacular. We offer excellent lighting, sound and special effects, adapted to the nature of the event.',
		},
		de: {
			text: 'Wir bieten professionelle technische Lösungen, die jede Veranstaltung spektakulär machen. Wir bieten hervorragende Beleuchtung, Tonanlage und Spezialeffekte, angepasst an die Art einer bestimmten Veranstaltung.',
		},
		color: '#E46C31',
	},
	multimedia: {
		number: '03',
		pl: {
			text: 'Tworzymy wielowymiarowe doznania poprzez zastosowanie nowoczesnych rozwiązań multimedialnych. Nasze projekcje, mappingi i\u00a0prezentacje wideo są zaprojektowane tak, aby wzbudzać silne emocje i\u00a0zaskakiwać uczestników.',
		},
		en: {
			text: 'We create multidimensional experiences through the use of modern multimedia solutions. Our projections, mappings and video presentations are designed to arouse strong emotions and surprise participants.',
		},
		de: {
			text: 'Wir schaffen multidimensionale Erlebnisse durch den Einsatz moderner Multimedia-Lösungen. Unsere Projektionen, Mappings und Videopräsentationen sollen starke Emotionen wecken und die Teilnehmer überraschen.',
		},

		color: '#d61f32cc',
	},
	scenography: {
		number: '04',
		pl: {
			text: 'Nasze zespoły projektowe pracują nad kreacją scenografii, która w\u00a0pełni odzwierciedli charakter i\u00a0tematykę imprezy. Dbamy o\u00a0każdy detal, aby stworzyć przestrzeń, która przykuje uwagę i\u00a0wywoła silne wrażenia.',
		},
		en: {
			text: 'Our design teams work on creating a scenography that fully reflects the nature and theme of the event. We take care of every detail to create a space that will attract attention and create strong impressions.',
		},
		de: {
			text: 'Unsere Designteams arbeiten an der Erstellung eines Bühnenbildes, das die Art und das Thema der Veranstaltung vollständig widerspiegelt. Wir kümmern uns um jedes Detail, um einen Raum zu schaffen, der Aufmerksamkeit erregt und starke Eindrücke hervorruft.',
		},
		color: '#E9B86B',
	},
	booking: {
		number: '05',
		pl: {
			text: 'Współpracujemy z najbardziej utalentowanymi artystami, aby dostarczyć niezapomniane występy na każdej scenie. Od muzycznych gwiazd po utalentowanych performerów - zadbamy o\u00a0to, by każdy artysta idealnie wpasował się w\u00a0koncepcję wydarzenia.',
		},
		en: {
			text: 'We work with the most talented artists to deliver unforgettable performances on every stage. From music stars to talented performers, we will make sure that each artist fits perfectly into the event concept.',
		},
		de: {
			text: 'Wir arbeiten mit den talentiertesten Künstlern zusammen, um auf jeder Bühne unvergessliche Auftritte zu liefern. Vom Musicalstar bis zum talentierten Künstler – wir sorgen dafür, dass jeder Künstler perfekt zum Veranstaltungskonzept passt.',
		},
		color: '#6280C2',
	},
}
const observerConfig = {
	attributes: true,
	chlidlist: false,
	subtree: false,
}
const dynamicLangChange = (mutationList, languageObserver) => {
	for (const mutation of mutationList) {
		if (mutation.type === 'attributes') {
			for (const [key, value] of Object.entries(offerObject))
				if (offerContextText.dataset.btnClicked == key) {
					offerContextText.innerText = value[htmlLang.lang].text
				}
		}
	}
}
const languageObserver = new MutationObserver(dynamicLangChange)
languageObserver.observe(htmlLang, observerConfig)
window.addEventListener('load', () => {
	offerContextText.innerText = offerObject.planning['pl'].text
	offerContextText.setAttribute('data-btn-clicked', 'planning')
})
offerBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		offerBtns.forEach(otherBtn => {
			otherBtn.style.backgroundColor = `${offerObject.main.color}`
		})
		for (const [key, value] of Object.entries(offerObject)) {
			if (btn.value === key) {
				offerContextText.dataset.btnClicked = `${btn.value}`

				setTimeout(() => {
					offerContextText.style.opacity = '0'
				}, 500)

				offerContextText.style.opacity = '0'

				setTimeout(() => {
					offerContextText.style.opacity = '1'
					offerContextText.innerText = value[htmlLang.lang].text
				}, 500)

				offerNumber.innerText = value.number
				offerNumberBorder.style.border = `7px solid ${value.color}`
				btn.style.backgroundColor = `${value.color}`
			}
		}
	})
})
const newsSlider = document.querySelector('.news__carousel')
const newsBtns = document.querySelectorAll('[data-news-btn]')
newsBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		const conuterNews = btn.dataset.newsBtn === 'next' ? 1 : -1
		const newsPos = document.querySelectorAll('.news__position')
		newsPos.forEach((slide, index) => {
			const newsIndex = newsSlider.querySelector(`[data-news-${index}]`)
			let newNewsIndex = [...newsPos].indexOf(newsIndex) + conuterNews
			if (newNewsIndex < 0) newNewsIndex = newsPos.length - 1
			if (newNewsIndex > newsPos.length - 1) newNewsIndex = 0
			newsPos[newNewsIndex].dataset[`news-${index}`] = true
			delete newsIndex.dataset[`news-${index}`]
		})
	})
})

const budgetBoxFrom = document.querySelector('.contact__budget-box--from')
const budgetBoxTo = document.querySelector('.contact__budget-box--to')
const budgetInputFrom = document.querySelector('#budget-from')
const budgetInputTo = document.querySelector('#budget-to')

budgetInputFrom.addEventListener('focusin', () => {
	budgetInputFrom.value = ''
	budgetBoxFrom.classList.add('active')
})
budgetInputTo.addEventListener('focusin', () => {
	budgetInputTo.value = ''
	budgetBoxTo.classList.add('active')
})
budgetInputFrom.addEventListener('focusout', () => {
	budgetBoxFrom.classList.remove('active')
	budgetBoxTo.classList.remove('active')
})
budgetInputTo.addEventListener('focusout', () => {
	budgetBoxTo.classList.remove('active')
})

const btnFileUpload = document.querySelector('.contact__attachments-btn')
const hideFileInput = document.querySelector('.contact__attachments-input')
const fileUploadLabel = document.querySelector('.contact__attachments-label')

btnFileUpload.addEventListener('click', e => {
	e.preventDefault()
	hideFileInput.click()
})
hideFileInput.addEventListener('change', () => {
	const fileList = hideFileInput.files
	const fileArray = Array.from(fileList)
	let bigFile
	fileArray.map(file => {
		let fileSize = (file.size / 1000000).toFixed(1)
		if (fileSize > 5) {
			bigFile = true
			return
		}
	})
	if (bigFile === true) {
		fileValidatorError(userFile, 'Wybrano za duży plik!\nMaksymalna wielkość pliku: 5 MB')
	} else if (userFile.files.length > 5) {
		fileValidatorError(userFile, `Wybrano za dużą ilość plików!\nMaksymalna ilość plików: 5 SZT.`)
	} else {
		const filenameList = fileArray.map(file => {
			return file.name
		})
		if (multilang.selectedLanguage === 'en') {
			fileUploadLabel.innerText = 'Selected files'
		} else if (multilang.selectedLanguage === 'de') {
			fileUploadLabel.innerText = 'Ausgewählte Dateien:'
		} else {
			fileUploadLabel.innerText = 'Wybrane pliki:'
		}

		filenameList.map(file => {
			const fileListItem = document.createElement('li')
			fileListItem.innerText = file
			fileUploadLabel.appendChild(fileListItem)
		})
	}
})
const attachmentsBtns = document.querySelectorAll('[data-attachments-btns')
const attachemntsInfoBox = document.querySelector('[data-attachments-info-box]')
const attachmentsInfo = document.querySelector('[data-attachments-info]')
attachmentsBtns.forEach(btn =>
	btn.addEventListener('click', e => {
		e.preventDefault()

		if (btn.dataset.attachmentsBtns === 'open') {
			attachemntsInfoBox.classList.add('show-items')
		} else if (btn.dataset.attachmentsBtns === 'close') {
			attachemntsInfoBox.classList.remove('show-items')
		}
	})
)

const sendFormBtn = document.querySelector('.contact__form-btn--send')
const clearFormBtn = document.querySelector('.contact__form-btn--clear')
const userName = document.querySelector('#name')
const userEmail = document.querySelector('#email')
const checkboxPlan = document.querySelector('#plan')
const checkboxBooking = document.querySelector('#booking')
const checkboxStage = document.querySelector('#stage')
const checkboxOthers = document.querySelector('#others')
const userBudgetFrom = document.querySelector('#budget-from')
const userBudgetTo = document.querySelector('#budget-to')
const budgetCurrency = document.querySelector('[data-currency]')
const userTopic = document.querySelector('#topic')
const userMsg = document.querySelector('#message')
const userFile = document.querySelector('#fileInput')
const contactForm = document.querySelector('.contact__form')
const contactFormPopup = document.querySelector('.contact__popup-box')
const closeFormPopup = document.querySelector('[data-btn-popup]')
const fileErrorPopup = document.querySelector('[data-file-popup]')
const closeFilePopup = document.querySelector('[data-btn-filePopup]')
const bodyError = document.querySelector('.contact')
const checkedArray = []

const validatorError = (input, msg) => {
	const formBox = input.parentElement

	input.value = ''
	formBox.classList.add('error')
	input.placeholder = msg
}
const fileValidatorError = (input, msg) => {
	const formBox = input.parentElement
	const erroMsg = fileErrorPopup.querySelector('span')
	erroMsg.innerText = msg
	formBox.classList.add('error')
	fileErrorPopup.classList.add('error')
	sendFormBtn.classList.add('error')
	bodyError.classList.add('error')
}
const clearValidatorError = input => {
	const formBox = input.parentElement
	formBox.classList.remove('error')
	fileErrorPopup.classList.remove('error')
	sendFormBtn.classList.remove('error')
	bodyError.classList.remove('error')
}
const checkFormValue = input => {
	input.forEach(element => {
		if (element.value === '') {
			validatorError(element, element.placeholder)
		} else {
			clearValidatorError(element)
		}
	})
}

const checkFormUser = (input, min) => {
	const reUser = /^[a-zA-ZąęćłńóśźżĄĘĆŁŃÓŚŹŻ\s]+$/
	if (input.value.length < min) {
		validatorError(input, `Pole musi zawierać min. ${min} znaki`)
	} else if (!reUser.test(input.value)) {
		validatorError(input, 'Nie poprawny format danych')
	}
}
const checkFormEmail = (mail, min) => {
	const reMail =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (mail.value.length < min) {
		validatorError(mail, `Pole ${mail.previousElementSibling.innerText.slice(0)} nie może być puste `)
	} else if (!reMail.test(mail.value)) {
		validatorError(mail, 'Nie poprawny adres e-mail')
	}
}
const checkFormTopic = (input, min) => {
	const reTopic = /[A-Za-z0-9]+/
	if (input.value.length < min) {
		validatorError(input, `Pole musi zawierać min. ${min} znaków `)
	} else if (!reTopic.test(input.value)) {
		validatorError(input, 'Pole nie może składać się wyłącznie ze spacji i znaków interpunkcyjnych')
	}
}
const checkFormMsg = (input, min) => {
	const reMsg = /[A-Za-z0-9]+/
	if (input.value.length < min) {
		validatorError(input, `Pole musi zawierać min. ${min} znaków `)
	} else if (!reMsg.test(input.value)) {
		validatorError(input, 'Pole nie może składać się wyłącznie ze spacji i znaków interpunkcyjnych')
	}
}

const checkCheckedField = () => {
	const checkedField = document.querySelectorAll('[data-check-field')
	checkedField.forEach(field => {
		if (field.checked) {
			field.value = field.nextElementSibling.innerText
			checkedArray.push(field.value)
		}
		return checkedArray
	})
}
const checkErrors = () => {
	const validInput = document.querySelectorAll('[data-form-validation]')
	let countError = 0

	validInput.forEach(input => {
		if (input.classList.contains('error')) {
			input.scrollIntoView({ behavior: 'smooth', block: 'center' })
			countError++
		}
	})
	if (countError === 0) return true
}
const clearForm = () => {
	;[
		userName,
		userEmail,
		userBudgetFrom,
		userBudgetTo,
		userTopic,
		userMsg,
		checkboxPlan,
		checkboxStage,
		checkboxBooking,
		checkboxOthers,
		userFile,
	].forEach(el => {
		el.value = ''
		el.checked = false
		clearValidatorError(el)
	})
	;[userName, userEmail, userTopic, userMsg].forEach(el => {
		el.placeholder = ''
	})

	userFile.value = ''
	const clearFileList = fileUploadLabel.querySelectorAll('li')
	clearFileList.forEach(file => {
		file.remove()
	})
}
const dataSend = status => {
	const message = contactFormPopup.querySelector('span')
	if (status === 200) {
		message.textContent = 'Wiadomość wysłana poprawnie '
		//contactForm.classList.add('show')
		contactFormPopup.classList.add('show')
		bodyError.classList.add('error')
	} else {
		message.textContent = 'Błąd wysyłania wiadmości spróbuj ponownie'
		//contactForm.classList.add('show')
		contactFormPopup.classList.add('show')
		bodyError.classList.add('error')
	}
}
const checkBackendValid = data => {
	const backendData = data
	for (const [key, value] of Object.entries(backendData))
		if ('name' == key) {
			checkFormUser(userName, 3)
		} else if ('email' == key) {
			checkFormEmail(userEmail, 1)
		} else if ('topic' == key) {
			checkFormTopic(userTopic, 5)
		} else if ('message' == key) {
			checkFormMsg(userMsg, 10)
		} else if ('files' == key) {
			fileValidatorError(userFile, value)
		}
	checkFormValue([userName, userEmail, userTopic, userMsg])
}
const sendFormValidator = e => {
	e.preventDefault()
	checkFormValue([userName, userEmail, userTopic, userMsg])
	checkFormUser(userName, 3)
	checkFormEmail(userEmail, 1)
	checkFormTopic(userTopic, 5)
	checkFormMsg(userMsg, 10)
	checkCheckedField()
	checkErrors()
}
async function sendFormBackend(e) {
	e.preventDefault()
	const formData = new FormData()
	for (let i = 0; i < userFile.files.length; i++) {
		formData.append('files[]', userFile.files[i])
	}
	formData.append('name', userName.value)
	formData.append('email', userEmail.value)
	formData.append('checkField', checkedArray)
	formData.append('budgetFrom', userBudgetFrom.value)
	formData.append('budgetTo', userBudgetTo.value)
	formData.append('budgetCurrency', budgetCurrency.textContent)
	formData.append('topic', userTopic.value)
	formData.append('message', userMsg.value)

	const request = await fetch('/api/webform', {
		method: 'POST',
		body: formData,
	})
		.then(res => res.json())
		.then(data => {
			if (data.status === 400) {
				checkBackendValid(data.msg)
			} else if (data.status === 200) {
				checkFormValue([userName, userEmail, userTopic, userMsg])
				dataSend(data.status)
			} else {
				dataSend(data.status)
			}
		})
}

sendFormBtn.addEventListener('click', e => {
	sendFormValidator(e)
	if (checkErrors()) {
		sendFormBackend(e)
	}
})
clearFormBtn.addEventListener('click', e => {
	e.preventDefault()
	clearForm()
})
closeFormPopup.addEventListener('click', () => {
	contactFormPopup.classList.remove('show')
	bodyError.classList.remove('error')
	clearForm()
})
closeFilePopup.addEventListener('click', e => {
	e.preventDefault()
	clearValidatorError(userFile)
	userFile.value = ''
	const clearFileList = fileUploadLabel.querySelectorAll('li')
	clearFileList.forEach(file => {
		file.remove()
	})
})
const faqAccordeon = document.querySelector('.faq__box-lists')
const faqAccordeonBtns = document.querySelectorAll('.faq__accordeon-box-content')
function openAccordeonItems() {
	if (this.nextElementSibling.classList.contains('show-acc')) {
		this.nextElementSibling.classList.remove('show-acc')
		this.lastElementChild.classList.remove('active')
	} else {
		closeAccordeonItems()
		this.nextElementSibling.classList.toggle('show-acc')
		this.lastElementChild.classList.toggle('active')
	}
}

const closeAccordeonItems = () => {
	const allActiveItems = document.querySelectorAll('.faq__accordeon-info')
	allActiveItems.forEach(item => item.classList.remove('show-acc'))
	faqAccordeonBtns.forEach(btn => {
		btn.lastElementChild.classList.remove('active')
	})
}
const clickOutsideAccordeon = e => {
	if (
		e.target.classList.contains('target') ||
		e.target.classList.contains('faq__accordeon-info') ||
		e.target.classList.contains('faq__accordeon-info-text')
	)
		return
	closeAccordeonItems()
}
faqAccordeonBtns.forEach(btn => {
	btn.addEventListener('click', openAccordeonItems)
})
window.addEventListener('click', clickOutsideAccordeon)
const faqBody = document.querySelector('.faq')
const faqOpenBtn = document.querySelectorAll('[data-faq-btn]')
const faqCloseBtn = document.querySelector('[data-faq-close-btn]')

const openFaq = () => {
	faqBody.classList.add('active')
	body.classList.add('stop-scrolling')
}
const closeFaq = () => {
	faqBody.classList.remove('active')
	body.classList.remove('stop-scrolling')
}
faqOpenBtn.forEach(btn => {
	btn.addEventListener('click', e => {
		e.preventDefault()
		openFaq()
	})
})
faqCloseBtn.addEventListener('click', () => {
	closeFaq()
})
const privacyBody = document.querySelector('.privacypolicy')
const privacyOpenBtn = document.querySelectorAll('[data-privacy-btn]')
const privacyCloseBtn = document.querySelector('[data-privacy-close-btn]')
privacyOpenBtn.forEach(btn => {
	btn.addEventListener('click', e => {
		e.preventDefault()
		privacyBody.classList.add('active')
		body.classList.add('stop-scrolling')
	})
})

privacyCloseBtn.addEventListener('click', () => {
	privacyBody.classList.remove('active')
	body.classList.remove('stop-scrolling')
})
const jobBody = document.querySelector('.job')
const jobOpenBtn = document.querySelectorAll('[data-job-btn]')
const jobCloseBtn = document.querySelector('[data-job-closeBtn')
const jobAgreeBtn = document.querySelector('[data-job-agreementBtn]')
const jobAgreeStar = document.querySelector('[data-job-star]')
const jobAgreeErrpr = document.querySelector('.job__form-checkAgreement-box span')
jobOpenBtn.forEach(btn => {
	btn.addEventListener('click', e => {
		e.preventDefault()
		jobBody.classList.add('active')
		body.classList.add('stop-scrolling')
	})
})
jobCloseBtn.addEventListener('click', () => {
	jobBody.classList.remove('active')
	body.classList.remove('stop-scrolling')
})
jobAgreeBtn.addEventListener('click', () => {
	if (jobAgreeStar.classList.contains('checked')) {
		jobAgreeBtn.removeAttribute('data-job-agree')
		jobAgreeStar.classList.remove('checked')
	} else {
		jobAgreeStar.classList.add('checked')
		jobAgreeBtn.setAttribute('data-job-agree', 'true')
	}
})

const goUp = document.querySelector('.go-up')
const btnGoUp = goUp.querySelector('.go-up__btn')

window.onscroll = () => {
	btnUpScroll()
}

const btnUpScroll = () => {
	document.body.scrollTop || document.documentElement.scrollTop > 1200
		? goUp.classList.add('show')
		: goUp.classList.remove('show')
}

btnGoUp.addEventListener('click', () => {
	window.scroll({
		top: 0,
	})
})
const footerYear = document.querySelector('.footer__foot-year')
const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year
}
handleCurrentYear()

