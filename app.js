//Random Quote Api URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Display Random Quote
const renderNewQuote = async() => {
    //Fetch content from url
    const response = await fetch(quoteApiUrl);
    //Store response
    let data = await response.json();
    //Access Quote
    quote = data.content;
    //Array of characters in the quote
    let arr = quote.split("").map(value => {
        //wrap characters in a span tag
        return "<span class='quote-chars'>" + value + "</span>"; 
    });
    //join array for displaying
    quoteSection.innerHTML += arr.join("");
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}

//Logic for comparing input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    //create an array from received span quotes
    quoteChars = Array.from(quoteChars);
    
    //Array of user input characters
    let userInputChars = userInput.value.split("");

    //Loop through every char in quote
    quoteChars.forEach((char, index) => {
        //check if char(quote) = userinputChar
        if(char.innerText == userInputChars[index]){
            char.classList.add("success");
        }
        //if user hasnt entered anything or backspaced
        else if(userInputChars[index] == null){
            //remove any class
            if(char.classList.contains("success")){
                char.classList.remove("success");
            } else{
                char.classList.remove("fail");
            };
        } 
        else{
            //Checks if we already have added fail class
            if(!char.classList.contains("fail")){
                //increment and displays mistakes
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        //Returns true if all the characters are entered correctly
        let check = quoteChars.every((element) =>{
            return element.classList.contains("success")
        });
        //End test if all characters are correct
        if (check) {
            displayResult();
        };
    });
});

//Update Timer on screen
function updateTimer() {
    if (time == 0) {
        displayResult();
    } else{
        document.getElementById("timer").innerText = --time + "s";
    }
}

//Sets Timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

//Start Test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}

//End Test

const displayResult = () => {
    //display result div
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if(time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerHTML = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
}