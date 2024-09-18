const homeBtn = document.getElementById("homeBtn")
const aboutBtn = document.getElementById("aboutBtn")
const otherBtn = document.getElementById("otherBtn")

const homePage = document.getElementById("homePage")
const aboutPage = document.getElementById("aboutPage")
const otherPage = document.getElementById("otherPage")

homeBtn.addEventListener("click", () => {
  homePage.hidden = false
  aboutPage.hidden = true
  otherPage.hidden = true
})
aboutBtn.addEventListener("click", () => {
  homePage.hidden = true
  aboutPage.hidden = false
  otherPage.hidden = true
})
otherBtn.addEventListener("click", () => {
  homePage.hidden = true
  aboutPage.hidden = true
  otherPage.hidden = false
})

const igBtn = document.getElementById("igBtn")
const liBtn = document.getElementById("liBtn")
const ghBtn = document.getElementById("ghBtn")

igBtn.addEventListener("click", () => {
  window.open("https://www.instagram.com","_blank")
})
liBtn.addEventListener("click", () => {
  window.open("https://www.linkedin.com/in/alex-giannopoulos/","_blank")
})
ghBtn.addEventListener("click", () => {
  window.open("https://github.com/agiano","_blank")
})