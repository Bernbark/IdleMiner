var gym = {
    bought: false,
    strength: 1,
    strPerSecond: 0,
    gripCost: 200,
    gripCount: 0,
    lastTick: Date.now(),
}

function buyMembership(){
    
    if (goldPerSecond > 5000 && gym.bought === false){
        gameData.goldPerClick-=200
        gym.bought = true
        gym.strPerSecond+=1
    }
}

function buyGrip(){
    if(gym.strength >= gym.gripCost){
        gym.strength -= gym.gripCost
        gym.gripCost*=2
        gym.gripCount++
        gameData.goldPerClick*=1.25
    }
}

function strengthPerSecond(){
    gym.strength+=gym.strPerSecond
}

window.setInterval(strengthPerSecond,1000)

var gymSave = JSON.parse(localStorage.getItem("_gym"))


var saveGym = window.setInterval(function(){
    gym.lastTick = Date.now()
    localStorage.setItem("_gym", JSON.stringify(gym))
}, 1000)

if (gymSave !== null){
    gym = gymSave
    diff = Date.now() - gym.lastTick;
    gym.strength += gym.strPerSecond*diff/1000
}