const statsBtn = document.getElementById("statsBtn")
const logBtn = document.getElementById("logBtn")
const lbBtn = document.getElementById("lbBtn")

const statsPage = document.getElementById("statsPage")
const logPage = document.getElementById("logPage")
const lbPage = document.getElementById("lbPage")

const addWorkout = document.getElementById("addWorkout")

statsBtn.addEventListener("click", (e) => {
  statsPage.hidden = false
  logPage.hidden = true
  lbPage.hidden = true
})

logBtn.addEventListener("click", (e) => {
  statsPage.hidden = true
  logPage.hidden = false
  lbPage.hidden = true
})

lbBtn.addEventListener("click", (e) => {
  statsPage.hidden = true
  logPage.hidden = true
  lbPage.hidden = false
})


let listNumber = 1
addWorkout.addEventListener("click", (e) => {

  const newElement = document.createElement("div")
  if (listNumber % 2 == 0) {
    newElement.classList = "logList logList_B"
  } else newElement.classList = "logList logList_A"
  newElement.innerHTML = "Workout " + listNumber
  document.getElementById("workoutList").appendChild(newElement)

  const deleteBtn = document.createElement("i")
  deleteBtn.classList = "fa-regular fa-square-minus"
  newElement.appendChild(deleteBtn)
  deleteBtn.addEventListener("click", () => {
    newElement.remove()
  })

  listNumber += 1
})





