let allValues = ["Anais", "BananaJoe", "PrincipalBrown", "Darwin", "Gumball", "KidGumball", "Lebron", "Mario", "Nicole", "Penny", "Richard", "Sarah", "MissSimian", "Sussie", "Tobias", "Trump"];
let valueArray = [];
let logicArray = [];
let matches = [];
let score = 0;
let scoreText, lastFlip, diffInput, sliderEl;
let midFlip = false;

function initialize() {
    scoreText = document.getElementById("scoretext");
    diffInput = document.getElementById("diffRange");

    progressScript();
    createGrid(diffInput.value);
}

function update() {
    scoreText.innerHTML = checkForWin() ? `YOU WIN! Your final score was ${score}` : `Score: ${score}`;
}

function progressScript() {
    const sliderValue = ((diffInput.value - 3) / 5) * 100;
    diffInput.style.background = `linear-gradient(to right, #ff4747 ${sliderValue}%, #fdffe2 ${sliderValue}%)`;
}

function createGrid(size) {
    getValueArray();

    logicArray = new Array(4);
    for (let i = 0; i < 4; i++) {
        logicArray[i] = new Array(size);
    }

    for (let i = 0; i < 4; i++) {
        let newdiv = document.createElement("div");
        newdiv.id = `row${i}`;
        newdiv.className = "cardrow";
        document.getElementById("grid").appendChild(newdiv);

        for (let j = 0; j < size; j++) {
            document.getElementById("row" + i).appendChild(createCard(assignValues(i, j), i, j));
        }
    }
}

function createCard(value, row, col) {
    let card = document.createElement("div");
    card.className = value + " card";
    card.onclick = function() {cardFlip(row, col)};
    card.id = `card${row}${col}`;

    return card;
}

function assignValues(row, col) {
    if (valueArray.length > 0) {
        let newVal = valueArray[Math.floor(Math.random() * valueArray.length)];
        logicArray[row][col] = newVal;
        removeDoubles();
        return newVal;
    }
    else {
        return "nuh uh";
    }
}

function getValueArray()
{
    let randValue = new Array(allValues.length);
    for(let i = 0; i < randValue.length; i++)
    {
        randValue[i] = i;
    }

    for(let i = 0; i < diffInput.value * 2; i++)
    {
        let idx = Math.floor(Math.random() * randValue.length);
        valueArray.push(allValues[randValue[idx]]);
        randValue.splice(idx, 1);
    }
}

function removeDoubles() {
    for (let k = 0; k < valueArray.length; k++) {
        let count = 0;

        scanGrid:
        for (let i = 0; i < logicArray.length; i++) {
            for (let j = 0; j < logicArray[i].length; j++) {
                if (logicArray[i][j] === valueArray[k]) {
                    count++;
                }
                if (count >= 2) {
                    valueArray.splice(k, 1);
                    k--;
                    break scanGrid;
                }
            }
        }
    }
}

function cardFlip(row, col)
{
    if(!midFlip && !matches.includes(logicArray[row][col]) && !(lastFlip != null && lastFlip[0] === row && lastFlip[1] === col))
    {
        midFlip = true;
        score++;

        document.getElementById(`card${row}${col}`).className = `${logicArray[row][col]} card cardflip cardfront`;

        if(!lastFlip)
        {
            lastFlip = [row, col];
            midFlip = false;
        }
        else if(logicArray[lastFlip[0]][lastFlip[1]] === logicArray[row][col])
        {
            matches.push(logicArray[row][col]);
            console.log("Match found!");
            lastFlip = null;
            flipBack();
            midFlip = false;
        }
        else
        {
            lastFlip = null;
            setTimeout(() => {
                flipBack();
                midFlip = false;
            }, 1000);
        }

        update();
    }
}

function flipBack()
{
    for(let i = 0; i < logicArray.length; i++)
    {
        for(let j = 0; j < logicArray[i].length; j++)
        {
            if(!matches.includes(logicArray[i][j]) && document.getElementById(`card${i}${j}`).className.includes("cardflip"))
            {
                document.getElementById(`card${i}${j}`).className = `${logicArray[i][j]} card flipback`;
            }
        }
    }
}

function checkForWin()
{
    for(let i = 0; i < logicArray.length; i++)
    {
        for(let j = 0; j < logicArray[i].length; j++)
        {
            if(!matches.includes(logicArray[i][j]))
            {
                return false;
            }
        }
    }
    return matches.length > 0;
}

function reset()
{
    logicArray = [];
    matches = [];
    score = 0;
    lastFlip = null;
    midFlip = false;

    update();

    document.getElementById("grid").innerHTML = "";
    createGrid(diffInput.value);
}

function changeInput()
{
    reset();
}