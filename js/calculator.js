const calculatorApp = {
  calculator : document.querySelector(".calculator"),
  exercise: document.querySelector(".exercise"),
  flag: document.querySelector(".flag"),
  operators : [] ,
  ranges: {},
  timeLeft: 0,
  totalTime: 60,
  interval:null, // Для збереження ID інтервалу
  isRunning: false,
  currentExample: null,
  
  exerciseTime: document.getElementById('timeline'),
  radios:document.querySelectorAll('input[type="radio"]'),
  
  checkboxes : document.querySelector('.checkbox-list'),
    
  firstRange: document.getElementById('numOne'),
  secondRange: document.getElementById('numTwo'),
  firstDisplay:document.getElementById('first-value-display'),
  secondDisplay: document.getElementById('second-value-display'),
  inputField: document.getElementById('number-input'),

 modalRefs:{
    closeModalBtn: document.querySelector("[data-close]"),
    backdrop: document.querySelector("[data-modal]"),
    modalContent:document.querySelector(".modal-content"),
  },
  
  
  attachRangeListener(range, display) {
    range.addEventListener("input", () => {
    display.textContent = range.value; // Оновлення значення
    this.startRangeValues();  
    //this.createExercise(); 
    });
    
  },
   
   startRangeValues(){
    const inputs = document.querySelectorAll('input[type="range"]');
    this.ranges = Array.from(inputs).reduce((acc, input) => {
      acc[input.id] = input.value; // Додаємо в об'єкт id і значення
      return acc;
    }, {});
  
    return this.ranges;
  
  }, 
  
  
  createExercise(){
  
  this.exercise.innerHTML = "";
  this.inputField.value = " ";
  // вибирати оператор
  let operator = this.operators[Math.floor(Math.random() * this.operators.length)];
  
  //console.log(this.timeLeft,"this is the timer");
  
  const actions = {
    "+" : this.addNumbers.bind(this),
    "-": this.subtractNumbers.bind(this),
   "*": this.multiplyNumbers.bind(this),
    "/" : this.divideNumbers.bind(this),
    "%" : this.calculatePercentage.bind(this),
  }
  
  //const a  = actions[operator]?.();
  //console.log(actions[operator],"action operator");
  const {num1,  num2, result} =  actions[operator]?.();
  
  //console.log(num1, operator, num2, result); 
  if(this.timeLeft>0){
    if(operator === "%"){
    this.exercise.innerHTML = 
  `
  <li class="generated-number">${num2}   ${operator} </li>
  <li class="operator"> of</li>
   
  <li class="generated-number">${num1}</li>
  `
  }
  else{
  this.exercise.innerHTML = 
  `<li class="generated-number">${num1}</li>
  <li class="operator">${operator}</li>
  <li class="generated-number">${num2}</li>`
  
  }
  }
  // записуємо зегенерований приклад , щоб він був доступний для функції 
  // переваірки відповіді
  //this.saveExampleToLocalStorage(example);
  this.currentExample = { num1, num2, operator, result }; 
  
  this.inputField.value="";
  
          
  },
  

  
  generateNumbers(){
    const num1 = Math.floor(Math.random() * 
    (Math.pow(10, Number(this.ranges.numOne)) - 
    Math.pow(10, Number(this.ranges.numOne) - 1))) + 
    Math.pow(10, Number(this.ranges.numOne) - 1);
  
    const num2 = Math.floor(Math.random() * 
    (Math.pow(10, Number(this.ranges.numTwo)) - 
    Math.pow(10, Number(this.ranges.numTwo) - 1))) + 
    Math.pow(10, Number(this.ranges.numTwo) - 1);
  
    return {num1, num2}
  },
  
  
  addNumbers(){
  const {num1, num2} = this.generateNumbers();
  const result = num1+num2;
    
  return {num1, num2, result}; 
  },
  
  subtractNumbers(){
  const {num1, num2} = this.generateNumbers();
  const result = num1-num2;
  
  return {num1, num2, result }; 
  },
  
  multiplyNumbers(){
    const {num1, num2} = this.generateNumbers();
    const result = num1*num2;
    
    return {num1, num2, result }; 
  },
  
  divideNumbers(){
  let {num1, num2} = this.generateNumbers();
  let result= (num1*num2);
  
  //деконструкція для заміни значень result стає num1
  // це гарантує що вправа на ділення гарантовано буде ділитися націло
  // гарантує що не буде ділення на нуль
  
  [result, num1] = [num1, result]
     
  return {num1, num2, result }; 
  },
  
  calculatePercentage(){
    let {num1} = this.generateNumbers();
    const num2 = (Math.floor(Math.random() * 9) + 1)*10;
    //let result= (num1*num2);
    //[result, num1] = [num1, result];
    let result = (num2 / 100) * num1;
    result = Number(result.toFixed(1));
    
    return {num1, num2, result }; 
  },
  
  addCheckboxes(){
    let checkedAll = document.querySelectorAll('input[type="checkbox"]:checked');
    this.operators = Array.from(checkedAll).map(check => check.value);
    this.checkboxes.addEventListener("change", (e)=>{
      if(e.target.type ==="checkbox"){
       checkedAll = document.querySelectorAll('input[type="checkbox"]:checked');
        this.operators = Array.from(checkedAll).map(check => check.value);
        //this.createExercise();
       //console.log(this.operators);
      }
     })
     
  },
  
  //слухач подій на клавіатурі
  attachKeyboardListener() {
     
    
    // Додаємо подію для натискання клавіш
    document.addEventListener('keydown', (e) => {
      const key = e.key;
      //метод isNan() перевіряє чи є значення  числом
      if (!isNaN(key) || key === '.') {
        // Якщо натиснута цифра або десяткова крапка
        this.inputField.value += key;
      } 
       if (key === 'Backspace') {
        // Якщо натиснуто Backspace, видаляємо останній символ
        this.inputField.value = this.inputField.value.slice(0, -1);
      }
      if (e.code === 'Enter' || e.code === "Space") {
        if(this.inputField.value===' '){ 
          console.log(111); 
          return;}
        console.log(this.inputField.value);
      e.preventDefault();
      this.checkResult(); // Перевірка відповіді
    }
    });
  },
  
  // обробник подій на кнопках 
  handleClickButtons(e){
   
    if(e.target.closest(".key-content")){
      const value = e.target.textContent.trim();
      if(value === "-"){
       
        this.inputField.value = this.inputField.value.startsWith('-')
      ? this.inputField.value.slice(1)
      : '-' + this.inputField.value;
      }
      if(value==="=" ){
        e.preventDefault();
       this.checkResult();
      }
     
      if (value == "CE") {
        this.inputField.value = ""; // Очищаємо все поле
      }
      
      if (!isNaN(value) ) {
        this.inputField.value += value;
      } else if (value === "." && !this.inputField.value.includes(".")) {
        // Додаємо крапку, якщо її ще немає
        this.inputField.value += value;
      }
    }
  
  }, 
  
  attachButtonClickListener() {
    this.calculator.addEventListener('click', this.handleClickButtons.bind(this));
  },

//зміна часу генерації 1-3-5 хв
  attachTimeLine(){
     if(this.exerciseTime){
      this.exerciseTime.addEventListener('change', (e)=> {
   
      if (e.target.name === 'option') {
        
        this.totalTime = Number(e.target.value);
        //this.totalTime = this.timeLeft;
        let a = typeof(this.totalTime);
        console.log(a, "total time");
        //this.totalTime=this.timeLeft;
  
        console.log(this.totalTime, "total time");
        console.log(this.timeLeft, "timeLeft");
        //console.log(`Selected: ${e.target.value}`);
      }
    });
     }
    
  },
  
  checkResult() {
    if(!this.isRunning){return;}
    if(!this.inputField.value){return }

    const userAnswer = Number(this.inputField.value.trim()); // Отримуємо значення з поля вводу
     
     // Отримуємо існуючі дані з localStorage де записані попередні вправи
    let allExercise = JSON.parse(localStorage.getItem("allData")) || [];
     
     
    // Додаємо userAnswer до об'єкта currentExample
     this.currentExample.answer = userAnswer;
     const {  result } = this.currentExample;
     allExercise.push(this.currentExample)
    localStorage.setItem("allData", JSON.stringify(allExercise)); // Запис в сховище
    
    if(result===userAnswer){

    this.flag.classList.remove("red");
    this.flag.classList.add("green");  
   
  }
  else{
    this.flag.classList.remove("green");
    this.flag.classList.add("red");
  }
  if(this.timeLeft>0){
    this.createExercise();
  }
  
  
  },
  
  // Функція для блокування радіокнопок
  
  toggleRadios(disable) {
    this.radios.forEach((radio) => {
      if (radio.checked) {
        radio.disabled = false;
      } 
      else {
      radio.disabled = disable; 
    }// true - блокуємо, false - розблоковуємо
    });
  }, 

  resetApp(){
    clearInterval(this.interval); // Зупиняємо таймер
    this.inputField.value = " ";// очистити поле вводу
    this.interval = null;
    this.toggleRadios(false); // радіокнопки доступні до вибору
    this.isRunning = false; // Скидаємо статус
    this.exercise.innerHTML = ""; // очищаємо поле з згенерованими числами
    this.currentExample = null; // 
    progressBar.style.backgroundColor = "transparent";
    progressBar.style.width = "100%";
    this.flag.classList.remove("red");
    this.flag.classList.remove("green"); 
    localStorage.removeItem("allData");
  },
  
   startTimer() {
    this.resetApp();
    const progressBar=document.getElementById("progressBar");
    progressBar.style.backgroundColor="#cf8ace";
    this.timeLeft = this.totalTime;
   
    
    this.createExercise();
  
    // Якщо таймер уже працює, не запускаємо новий
    if (this.isRunning) return ;
  
      this.isRunning = true; // Встановлюємо статус, що таймер запущений
    
    // Оновлюємо ширину прогрес-бара
     this.interval = setInterval(() => {
     this.toggleRadios(true); // радіокнопки не заблоконвані
      this.timeLeft--; // Зменшуємо час
      //console.log(this.timeLeft);
      const percentage = ( this.timeLeft / this.totalTime) * 100; // Розраховуємо ширину у відсотках
      progressBar.style.width = `${percentage}%`; // Оновлюємо ширину
      this.timeLeft;
      // Коли час закінчився
      if (this.timeLeft <= 0) {
        //clearInterval(interval); // Зупиняємо таймер переніс в функцію ресет
        this.insertToModal();
        this.resetApp(); 
        
       
        this.toggleModal();
      }
    }, 1000); // Інтервал оновлення - 1 секунда
  },
  


  attachTimerListenerStartCalculator(){
  document.getElementById("startButton").addEventListener("click", this.startTimer.bind(this));
  },
  
  attachResetApp(){
document.getElementById("resetButton").addEventListener("click", this.resetApp.bind(this))
  } ,

  attachModal(){
      this.modalRefs.closeModalBtn.addEventListener("click", this.toggleModal.bind(this));
      
  },
  
// стрілочну фкнцію не пишу бо треба , бо її треба передати таймеру для виклику модалки
  toggleModal() {
    this.modalRefs.backdrop.classList.toggle("is-hidden");
  
  },

insertToModal(){
  let correct;
  let wrong;
  const data  = JSON.parse(localStorage.getItem("allData")) ;
  if(data){
 const result = data.reduce((acc, item) => {
    if (item.result === item.answer) {
      acc.correct++;
    } else {
      acc.incorrect++;
    }
    return acc;
  }, { correct: 0, incorrect: 0 });
   correct=result.correct;
   wrong = result.incorrect;
  }
else{
  correct=0;
  wrong=0;
}
 

   this.modalRefs.modalContent.innerHTML = 
  `
  <p class="modal-answers-rating right"> R - ${correct}   </p>
  <p class="modal-answers-rating wrong"> W - ${wrong}   </p>
  ` 
},

  init() {
  
  this.addCheckboxes();
  this.startRangeValues();
  this.attachRangeListener(this.firstRange, this.firstDisplay);
  this.attachRangeListener(this.secondRange, this.secondDisplay);
  this.attachKeyboardListener();
  this.attachButtonClickListener();
  this.attachTimerListenerStartCalculator();
  this.attachTimeLine();  
  this.attachResetApp();
  this.attachModal();
  } 
  
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    calculatorApp.init();
  });



  
