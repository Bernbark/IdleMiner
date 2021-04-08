var gameData = {
    lastTick: Date.now(),
    clock: 0,
    frameTime: 100,
    gold: 0,
    crystal: 0,
    crystalFind: 100,
    crystalMulti: 1,
    totalGold: 0,
    goldPerClick: 1,
    goldPerClickCost: 5,
    gpcCount: 0,
    glovesCost: 10000,
    glovesMulti: 1,
    priceDropCost: 10000,
    dcpCount: 0, // counts priceDropCost bought
    handleCost: 5000,
    handleMulti: 1,
    handleBought: 0,
    pickCost: 5000,
    pickMulti: 1,
    pickBought: 0,
    lightCost: 5000,
    lightCount: 0,
    cartCost: 50,
    cartCount: 0,
    
}

window.onload = init;
function init(){
    window.requestAnimationFrame(gameLoop)
}

//checks if the window is inactive, in which case it saves the time then calculates resources earned by certain equations below
var lastTime = 0;
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        lastTime = Date.now();
      console.log("Hidden");
    }
    else{
        diff = Date.now() - lastTime;      
        gameData.gold += goldPerSecond*diff/1000
        gameData.totalGold += goldPerSecond*diff/1000
        if(gameData.goldPerClickCost - gameData.dcpCount*diff >= 10000){
            gameData.goldPerClickCost -= gameData.dcpCount*diff/50
        }
        else if(gameData.over10000 === true){
            gameData.goldPerClickCost=10000
        }
        gameData.crystal += diff/500
        console.log("Visible");
    }
})
//TODO Create a system where you can use gold mined/interval to perform other actions like paying for a gym membership, getting stronger, 

//Click to mine gold, textContent brings the action to the button ID goldMined
function mineGold(){
    gameData.gold += gameData.goldPerClick
    gameData.totalGold += gameData.goldPerClick
    chance = Math.floor(Math.random() * gameData.crystalFind)+1
    if (chance === gameData.crystalFind){
        gameData.crystal+=gameData.glovesMulti*(1+gym.gripCount/4)
    }  
}
// find more gold at a time
function cartBuy(){
    if (gameData.crystal >= gameData.cartCost){
        gameData.crystal-=gameData.cartCost
        gameData.cartCount++
        gameData.cartCost+=50*(gameData.cartCount)/2
        gameData.goldPerClick*=1.5
    }
}
// find more crystals at a time
function buyGloves(){
    if (gameData.gold >= gameData.glovesCost){
        gameData.gold-=gameData.glovesCost
        gameData.glovesMulti++
        gameData.glovesCost*=5
    }
}

function buyLight(){
    if (gameData.gold >= gameData.lightCost && gameData.lightCount < 51){
        gameData.gold -= gameData.lightCost
        gameData.lightCost*=3
        gameData.lightCount++
        gameData.crystalFind--
    }
}

function pickHead(){
    if (gameData.crystal >= gameData.pickCost){
        gameData.crystal -= gameData.pickCost
        gameData.pickCost*=4
        gameData.pickBought++
        gameData.pickMulti+=.1;
        gameData.goldPerClick*=gameData.pickMulti
    }
}
function buyHandle(){
    if (gameData.gold > gameData.handleCost){
        gameData.gold -= gameData.handleCost
        gameData.handleBought+=1       
        gameData.handleCost*=3
        gameData.handleMulti+=.1
        gameData.goldPerClick*=gameData.handleMulti
    }
}
//Decreases the cost of the Pickaxe upgrade, will be upgradable as a time element
function decreaseCostPerSecond(){
    if(gameData.priceDropCost >= 10000 && gameData.goldPerClickCost >= 10000 && gameData.dcpCount > 0){
    gameData.goldPerClickCost-=gameData.dcpCount        
    } 
}

//per click version of the above func
function decreaseCostPerClick(){
    if (gameData.gold > gameData.priceDropCost && gameData.goldPerClickCost >= 10000){
        gameData.gold -= gameData.priceDropCost
        gameData.goldPerClickCost-=1
        gameData.priceDropCost*=3
        gameData.dcpCount += 1
    }
}

//Pickaxe upgrade, increases gold per click and gold per click cost
function buyGoldPerClick(){
    if (gameData.gold >= gameData.goldPerClickCost){
        gameData.gold-=gameData.goldPerClickCost
        gameData.goldPerClick += 1*gameData.gpcCount
        gameData.gpcCount += 1
        gameData.goldPerClickCost *= gameData.gpcCount
        
    }
}

// Makes sure the text on page is being updated when the page is refreshed, used in the gameLoop
function refresh(){
    document.getElementById("grip").textContent = "Train Grip || "+beautify(gym.gripCost)+" Strength"
    document.getElementById("mineGold").textContent = "Mine "+beautify(gameData.goldPerClick)+" Gold"
    document.getElementById("cartBuy").textContent = beautify(gameData.cartCost)+" Crystal"
    document.getElementById("buyGloves").textContent = "Buy Gloves || "+ beautify(gameData.glovesCost,1)+" Gold"
    document.getElementById("totalGold").textContent = "Total earned:" + beautify(gameData.totalGold,1)
    if (gameData.crystal < 1000){
        document.getElementById("crystalsOwned").textContent = beautify(gameData.gold,1) + " Gold Mined || "+Math.floor(gameData.crystal)+" Crystals Owned || "+Math.round((100-gameData.crystalFind))+"% Crystal Find per Click or Second"
    }
    else{
        document.getElementById("crystalsOwned").textContent = beautify(gameData.gold,1) + " Gold Mined || "+beautify(gameData.crystal,1)+" Crystals Owned || "+Math.round((100-gameData.crystalFind))+"% Crystal Find per Click or Second"
    }
    document.getElementById("perClickUpgrade").textContent = "Upgrade Pickaxe Cost: " + beautify(gameData.goldPerClickCost,1) + " Gold"
    if (gameData.crystal < 1000){
        document.getElementById("goldMined").textContent = beautify(gameData.gold,1) + " Gold Mined || Gold Per Second: "+Math.round(goldPerSecond)+" || "+Math.floor(gameData.crystal)+" Crystals Owned"
    }
    else{
        document.getElementById("goldMined").textContent = beautify(gameData.gold,1) + " Gold Mined || Gold Per Second: "+Math.round(goldPerSecond)+" || "+beautify(gameData.crystal,1)+" Crystals Owned"
    }
    document.getElementById("perClickPriceDrop").textContent = beautify(gameData.priceDropCost,1) + " Gold"
    document.getElementById("buyLight").textContent = "Buy Light || "+beautify(gameData.lightCost,1)+" Gold"
    document.getElementById("strength").textContent = "Strength: "+ beautify(gym.strength)
    document.getElementById("pickHead").textContent = beautify(gameData.pickCost,1)+" crystal || Hardness: "+beautify(gameData.pickMulti,1)
    document.getElementById("handle").textContent = "Buy a new handle and increase your mining multiplier by 10% || Current Multi: "+beautify(gameData.handleMulti,1)+" || Price: "+beautify(gameData.handleCost,1)
}

//This section helps to display a gold per second value. Doesn't need to be saved since it is just created live.
const fps = 25;
var then = 0;
var goldPerSecond = 0;
var now = 0;
function gPS(){
    then = gameData.gold
    now = gameData.goldPerClick*50+then
    goldPerSecond = (now-then)/2
}

window.setInterval(gPS,1000)
//main game loop, runs constantly
function gameLoop(){
    
    setTimeout(()=>{
        refresh()        
        mineGold()
        decreaseCostPerSecond()
        window.requestAnimationFrame(gameLoop)
    },1000/fps)
    
     
}

function reset(){
    localStorage.removeItem("save")
    localStorage.removeItem("_gym")
    location.reload();
}

var savegame = JSON.parse(localStorage.getItem("save"))

if(savegame != null){
    gameData = savegame
}
diff = Date.now()- gameData.lastTick;
console.log(diff)
console.log(gameData.lastTick)
gPS()      
gameData.gold += goldPerSecond*diff/1000
gameData.totalGold += goldPerSecond*diff/1000
if(gameData.goldPerClickCost - gameData.dcpCount*diff >= 10000){
    gameData.goldPerClickCost -= gameData.dcpCount*diff/1000
}
else if(gameData.over10000 === true){
    gameData.goldPerClickCost=10000
}
gameData.crystal += diff/1000

var saveGameLoop = window.setInterval(function(){
    gameData.lastTick = Date.now()
    localStorage.setItem("save", JSON.stringify(gameData))
}, 1000)

//MENU TABS
function tab(tab) {
    // hide all your tabs, then show the one the user selected.
    document.getElementById("homeScreen").style.display = "none"
    document.getElementById("crystalMenu").style.display = "none"
    document.getElementById("gym").style.display = "none"
    document.getElementById(tab).style.display = "inline-block"
  }
  // go to a tab for the first time, so not all show
tab("homeScreen")

//Once you add more variables for an update, save extra variables as following
if (typeof savegame.gold !== "undefined") gameData.gold = savegame.gold;
if (typeof savegame.crystal !== "undefined") gameData.crystal = savegame.crystal;
if (typeof savegame.crystalFind !== "undefined") gameData.crystalFind = savegame.crystalFind;
if (typeof savegame.lastTick !== "undefined") gameData.lastTick = savegame.lastTick;
if (typeof savegame.totalGold !== "undefined") gameData.totalGold = savegame.totalGold;
if (typeof savegame.over10000 !== "undefined") gameData.over10000 = savegame.over10000;
if (typeof savegame.goldPerClick !== "undefined") gameData.goldPerClick = savegame.goldPerClick;
if (typeof savegame.goldPerClickCost !== "undefined") gameData.goldPerClickCost = savegame.goldPerClickCost;
if (typeof savegame.gpcCount !== "undefined") gameData.gpcCount = savegame.gpcCount;
if (typeof savegame.priceDropCost !== "undefined") gameData.priceDropCost = savegame.priceDropCost;
if (typeof savegame.dcpCount !== "undefined") gameData.dcpCount = savegame.dcpCount;
if (typeof savegame.handleCost !== "undefined") gameData.handleCost = savegame.handleCost;
if (typeof savegame.handleMulti !== "undefined") gameData.handleMulti = savegame.handleMulti;
if (typeof savegame.handleBought !== "undefined") gameData.handleBought = savegame.handleBought;
if (typeof savegame.pickCost !== "undefined") gameData.pickCost = savegame.pickCost;
if (typeof savegame.pickBought !== "undefined") gameData.pickBought = savegame.pickBought;