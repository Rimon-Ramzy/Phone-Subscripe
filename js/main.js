const inputPhone = document.querySelector(".input-num input")
const buttonPhone = document.querySelector(".submit-phone")
const errorPhone = document.querySelector(".error")
const wireType = document.querySelectorAll(".type")
const form = document.querySelector("form")
const phoneWrapper = document.querySelector('.box.box-num')
const OtpWrapper = document.querySelector('.box-code');
const mobileOperator = document.getElementsByName("mobileOperator")
const mobileOperatorArray = Array.from(mobileOperator)
const arabicPage = document.querySelector(".ar");
const englishPage = document.querySelector(".en");
const langButton = document.querySelector(".lang");
const formOTP = document.querySelector(".form-code")
const lang = 2;
const counter = document.querySelector('.counter');
const resendBtn = document.querySelector('.resend')
const inputCode = document.querySelector(".input-code")

// Lang Chooes

langButton.addEventListener("click", () => {
  if (location.pathname == "/englishPage.html") {
    location.replace("./../index.html")
  } else if (location.pathname == "/index.html") {
    location.replace("./../englishPage.html")
    lang = 1
  }
})



// Validation Method
function validationInput() {
  let regex = /^[0125][0-9]{8}$/gm;
  if (regex.test(inputPhone.value)) {
    return true
  } else {
    return false
  }
}


// Input Method
inputPhone.addEventListener("focus", (e) => {
  e.target.placeholder = "---------"

})

inputPhone.addEventListener("input", (e) => {
  if (inputPhone.value.length > 8) inputPhone.value = inputPhone.value.slice(0, 9);


  if (validationInput() == true) {
    buttonPhone.removeAttribute('disabled')
  } else {
    buttonPhone.setAttribute("disabled", "disabled")
  }
})

// Input Otp Method
inputCode.addEventListener("input", (e) => {
  if (inputCode.value.length > 4) inputCode.value = inputCode.value.slice(0, 4);
})



// Form Phone Number Submit  

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let mobileOperator = null
  let operator = mobileOperatorArray.map(r => {
    if (r.checked) {
      mobileOperator = r.value
    } else {
      return false
    }
  }
  );

  if (mobileOperator == undefined) {
    errorPhone.style.display = "block"
  } else {
    errorPhone.style.display = "none"
    operator = mobileOperatorArray.find(r => r.checked).value;
    let subscribeApi = {
      action: "subscribe",
      productName: 3,
      clickid: 43434,
      lang: lang,
      msisdn: `201${inputPhone.value}`,
      mobileOperator: Number(mobileOperator),
    }
    subscribe(subscribeApi)
  }
})


// Form OTP Number
formOTP.addEventListener('submit', (e) => {
  e.preventDefault();
  if (inputCode.value == null) {
    return false
  }
  let verifyApi = {
    action: "verify",
    productName: 3,
    clickid: 43434,
    lang: lang,
    msisdn: `201${inputPhone.value}`,
    subscriptionContractId: localStorage.getItem('subscriptionContractId'),
    pinCode: `${inputCode.value}`
  }
  verify(verifyApi)
})



resendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.counter').innerHTML = '00:10';
  countdown()
  if (inputCode.value == null) {
    return false
  }
  let resendApi = {
    action: "resend",
    productName: 3,
    clickid: 43434,
    lang: lang,
    msisdn: `201${inputPhone.value}`,
    subscriptionContractId: localStorage.getItem('subscriptionContractId'),
  }
  resend(resendApi)
})


function countdown() {
  resendBtn.setAttribute('disabled', 'disabled')
  var seconds;
  var temp;
  var GivenTime = document.querySelector('.counter').innerHTML
  let time = document.querySelector('.counter').innerHTML;
  let timeArray = time.split(':');
  seconds = timeToSeconds(timeArray);
  if (seconds == '') {
    temp = document.querySelector('.counter');
    temp.innerHTML = GivenTime;
    time = document.querySelector('.counter').innerHTML;
    timeArray = time.split(':')
    seconds = timeToSeconds(timeArray);
  }
  seconds--;
  temp = document.querySelector('.counter');
  temp.innerHTML = secondsToTime(seconds);
  var timeoutMyOswego = setTimeout(countdown, 1000);
  if (secondsToTime(seconds) == '00:00') {
    clearTimeout(timeoutMyOswego); //stop timer
    resendBtn.removeAttribute('disabled')
  }
}

function timeToSeconds(timeArray) {
  var minutes = (timeArray[0] * 1);
  var seconds = (minutes * 60) + (timeArray[1] * 1);
  return seconds;
}

function secondsToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));
  hours = hours < 10 ? '0' + hours : hours;
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return minutes + ':' + seconds;

}


async function subscribe(body) {
  await fetch("https://t4iy4pltwpmibfbbcf3lfwcqsq0rvfvz.lambda-url.eu-west-1.on.aws/", {
    method: "POST",
    body: JSON.stringify(body)
  }).then(
    (response) => {
      let resp = response.json()
      phoneWrapper.style.display = 'none';
      OtpWrapper.style.display = 'block';
      countdown()
      return resp
    }
  ).then(
    resp => {
      localStorage.setItem("subscriptionContractId", resp.subscriptionContractId)
    }
  ).catch(
    err => {
      console.log(err);
    }
  )

}


async function verify(body) {
  await fetch('https://t4iy4pltwpmibfbbcf3lfwcqsq0rvfvz.lambda-url.eu-west-1.on.aws/', {
    method: "POST",
    body: JSON.stringify(body)
  }).then((response) => {
    let resp = response.json()
    return resp
  }).then(
    resp => {
      window.location.assign(resp.redirectUrl)
    }
  )
}

async function resend(body) {
  await fetch('https://t4iy4pltwpmibfbbcf3lfwcqsq0rvfvz.lambda-url.eu-west-1.on.aws/', {
    method: "POST",
    body: JSON.stringify(body)
  }).then((response) => {
    let resp = response.json()
    return resp
  })

}














// Code
