document.addEventListener("DOMContentLoaded", () => {

const menteeBtn = document.getElementById('menteeBtn')
const mentorBtn = document.getElementById('mentorBtn')


menteeBtn.addEventListener('click', function(){
    localStorage.setItem('mentee', true)
    // console.log(localStorage.getItem('mentee'))
    
    
})

mentorBtn.addEventListener('click', function(){
    localStorage.setItem('mentee', false)
    // console.log(localStorage.getItem('mentee'))

})  
})
