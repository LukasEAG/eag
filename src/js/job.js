const jobName = document.querySelector('#username')
const jobPhone = document.querySelector('#phone')
const jobMail = document.querySelector('#mail')
const jobCity = document.querySelector('#city')
const jobPrev = document.querySelector('#prevJob')
const jobFuture = document.querySelector('#futureJob')
const jobLang = document.querySelector('#jobLanguage')
const jobLicense = document.querySelector('#joblicense')
const jobMsg = document.querySelector('#aboutYou')
const sendJobFormBtn = document.querySelector('.job__sendFormBtn')
const agreeConfirm = document.querySelector('[data-job-agreementbtn')
const agreeError = document.querySelector('.job__form-checkAgreement span')
const validationPopup = document.querySelector('.job__validation-popup')
const closePopupBtn = document.querySelector('.job__validation-popup-closeBtn')
const jobForm = document.querySelector('.job__form')
const jobFields = [jobName, jobPhone, jobMail, jobCity, jobPrev, jobFuture, jobLang, jobLicense, jobMsg, agreeError]
const jobFieldMap = {
    name:{field: jobName, length: 3},
    city: {field: jobCity, length: 3},
    skills: {field: jobLicense, length:3 },
    jobPrev: {field: jobPrev, length: 5},
    jobFuture: {field: jobFuture, length: 5},
    languages: {field: jobLang, length: 5},

}

const checkJobValue = fields => {
	fields.forEach(field => {
		if (field.value === '') {
			validationError(field, field.placeholder)
		} else {
			clearValidatonError(field)
		}
	})
}
const validationLengthAndFormat = (input, min) => {
	const validSyntax = /^[a-zA-ZąęćłńóśźżĄĘĆŁŃÓŚŹŻ\s]+$/
	if (input.value.length < min) {
		validationError(input, `Min. ilość znaków: ${min}`)
	} else if (!validSyntax.test(input.value)) {
		validationError(input, 'Nie poprawny format danych')
	}
}
const validationEmail = (mail, min) => {
	const jobMailSytnax =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (mail.value.length < min) {
		validationError(mail, `Min. ilość znaków: ${min} `)
	} else if (!jobMailSytnax.test(mail.value)) {
		validationError(mail, 'Nie poprawny adres e-mail')
	}
}
const validationPhone = (phone, min) => {
	const jobPhoneSyntax = /^\+?[0-9 ]{9,15}$/
	if (phone.value.length < min) {
		validationError(phone, `Min. ilość znaków: ${min} `)
	} else if (!jobPhoneSyntax.test(phone.value)) {
		validationError(phone, 'Nie poprawny nr. telefonu')
	}
}
const validationMsg = (input, min) => {
	const jobMsg = /[A-Za-z0-9]+/
	if (input.value.length < min) {
		validationError(input, `Minimalna ilość znaków: ${min} `)
	} else if (!jobMsg.test(input.value)) {
		validationError(input, 'Pole nie może składać się wyłącznie ze spacji i znaków interpunkcyjnych')
	}
}
const agreeValidation = agree => {
	if (!agree.hasAttribute('data-job-agree')) {
		agreeError.classList.add('error')
		agreeConfirm.value = false
	} else {
		agreeError.classList.remove('error')
		agreeConfirm.value = true
	}
}
const backendValidation = data => {
	const backendRes = data
    const backendField = jobFields.slice(0, 8)
	for (const [key, value] of Object.entries(backendRes))
		if (jobFieldMap[key]) {
            const {field, length} = jobFieldMap[key]
			validationLengthAndFormat(field, length)
		} else if ('prevJob' == key || 'futureJob' == key || 'languages' == key) {
			validationLengthAndFormat(key, 5)
		} else if ('email' == key) {
			validationEmail(jobMail, 6)
		} else if ('phone' == key) {
			validationPhone(jobPhone, 9)
		} else if ('message' == key) {
			validationMsg(jobMsg, 10)
		} else if ('confirme' == key) {
			agreeValidation(agreeConfirm)
		}
	checkJobValue(backendField)
}
const jobFormPopup = status => {
	const msg = validationPopup.querySelector('span')
	if (status === 200) {
		msg.textContent = 'Formularz wysłany poprawnie. Jeseśmy w kontakcie.'
		validationPopup.classList.add('show')
		jobForm.classList.add('popup')
	} else {
		msg.textContent = 'Coś poszło nie tak. Spróbuj ponownie.'
		validationPopup.classList.add('show')
		jobForm.classList.add('popup')
	}
}
const clearJobForm = () => {
	jobFields.forEach(field => {
		field.value = ''
	})
    jobAgreeStar.classList.remove('checked')
}
const checkJobErrors = () => {
	let countError = 0
	jobFields.forEach(field => {
		if (field.classList.contains('error')) {
			countError++
		}
	})
	if (countError === 0) return true
}
const frontendValidation = e => {
	e.preventDefault()
	validationLengthAndFormat(jobName, 3)
	validationLengthAndFormat(jobCity, 3)
	validationLengthAndFormat(jobPrev, 5)
	validationLengthAndFormat(jobFuture, 5)
	validationLengthAndFormat(jobLang, 5)
	validationLengthAndFormat(jobLicense, 3)
	validationEmail(jobMail, 6)
	validationPhone(jobPhone, 9)
	validationMsg(jobMsg, 10)
	agreeValidation(agreeConfirm)
	checkJobErrors()
}
async function sendJobForm(e) {
	e.preventDefault()
	const jobData = new FormData()
	jobData.append('name', jobName.value)
	jobData.append('phone', jobPhone.value)
	jobData.append('email', jobMail.value)
	jobData.append('city', jobCity.value)
	jobData.append('prevJob', jobPrev.value)
	jobData.append('futureJob', jobFuture.value)
	jobData.append('languages', jobLang.value)
	jobData.append('skills', jobLicense.value)
	jobData.append('msg', jobMsg.value)
	jobData.append('confirme', agreeConfirm.value)
	const request = await fetch('/api/jobform', {
		method: 'POST',
		body: jobData,
	})
		.then(res => res.json())
		.then(data => {
			if (data.status === 400) {
				backendValidation(data.msg)
			} else if (data.status === 200) {
				checkJobValue(jobFields)
				jobFormPopup(data.status)
			} else {
				sendJobForm(data.status)
			}
		})
}
const clearValidatonError = field => {
	field.classList.remove('error')
	field.placeholder = ''
}
const validationError = (field, msg) => {
	field.value = ''
	field.setAttribute('class', '')
	field.classList.add('error')
	field.placeholder = msg
}
sendJobFormBtn.addEventListener('click', e => {
	frontendValidation(e)
	if (checkJobErrors()) {
		sendJobForm(e)
	}
})
jobFields.forEach(field => {
	field.addEventListener('keydown', () => {
		clearValidatonError(field)
	})
})
closePopupBtn.addEventListener('click', () => {
	validationPopup.classList.remove('show')
	jobForm.classList.remove('popup')
	clearJobForm()
	agreeError.classList.remove('error')
		agreeConfirm.value = true

})
