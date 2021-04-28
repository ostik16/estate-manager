

// redo contracts, so it does not contain whole Property object, but just id of property
class Contract{
    constructor(property, duration, skills) { //initializing all important things for contract
        this.id = Math.floor(Math.random() * 1000000000); //ID - maybe get better system for giving ID's
        this.timeCreated = null; //when created
        this.timeEnd = this.timeCreated + duration; //when will expire
        this.timeEndedByPlayer = null; //when will expire
        this.duration = duration; //time contract is active
        this.property = property; //which property is this contract bond to
        this.rent = Math.floor(property.price / 100); //monthly money for this property lending
        this.services = property.servicePrice; //monthly money for services
        this.totalMonthly = this.rent + this.services; //total money to pay a month
    }

    start(player, skills){ //add customer later?
        this.timeCreated = player.timeCurrent;
        player.contracts.push(this);
        player.properties[player.properties.indexOf(this.property)].hasContract = true;
        player.render();
    }

    end(player, skills){
        this.timeEndedByPlayer = player.timeCurrent;
        player.properties[player.properties.indexOf(this.property)].hasContract = false;
        player.contracts.splice(player.contracts.indexOf(this), 1);
    }
}

class Property{
    constructor(location, type, materialPrice, skills) { //initializing all important things for property
        this.id = Math.floor(Math.random() * 1000000000); //ID - maybe get better system for giving ID's
        this.timeBought = null; //when bought
        this.timeSold = null;
        this.level = Math.floor(Math.random() * 5) + 1;
        this.type = type;
        this.location = location;
        this.materialPrice = materialPrice; //base price of property without bonuses
        this.hasContract = false;

        this.price = Math.floor(this.materialPrice * this.level * this.location.landValue);

        this.servicePrice = Math.floor(this.price * 0.1); //10% of normal price
    }

    buy(player, skills){
        if(!player.spend(this.price)) return //not enough money
        this.timeBought = player.timeCurrent;
        player.properties.push(this);
        player.render();
        buyProperties();
    }

    sell(player, skills){
        // console.log(this);
        player.recieve(this.price); //give player money for this property
        this.timeSold = player.timeCurrent;
        player.properties.splice(player.properties.indexOf(this), 1); //remove this property from list of properties player owns
    }

}

class Location{
    constructor(density = 50, distanceFromCenter = 50){
        this.density = density; //50 people per square km, 50 - 50k
        this.distanceFromCenter = distanceFromCenter; //km
        this.landValue = this.density / this.distanceFromCenter;
    }
}

class Player{
    constructor(){
        this.timeStarted = 0; //i guess this will be always zero
        this.timeCurrent = 0; //current in-game time
        this.money = 10000;
        this.properties = []; //list of all owned properties
        this.contracts = []; //list of all active contracts
        this.skills = {}; //list of skills that might be added
        this.rent = 0; //add rent for every contract when contract is added, so it doesnt have to go through all contracts every second and count it
    }

    recieve(money){ //function for receiving money
        //make some kind of alert?
        this.money += money;
        this.render();
    }

    spend(money){ //function for spendin money and checking if enough money is available
        if(money > this.money) return false;
        this.money -= money;
        this.render();
        return true
    }

    // modify to variable this.rent
    getRent(notify = false){
        let sum = 0;
        for(let i = 0; i < this.contracts.length; i++){
            sum += this.contracts[i].rent;
        }
        if(notify) console.log(sum);
        return sum;
    }

    render(){
        // console.log("render");
        // TIME
        document.getElementById("time").innerHTML = this.timeCurrent;
        
        // MONEY
        document.getElementById("money").innerHTML = this.money;
        
        // PROPERTIES
        document.getElementById("properties").innerHTML = "";
        for(let i = 0; i < player.properties.length; i++){
            document.getElementById("properties").innerHTML += `
                <li class="list-group-item">
                    <div>id: ${player.properties[i].id}</div>
                    <div>level: ${player.properties[i].level}</div>
                    <div>dist.: ${player.properties[i].location.distanceFromCenter} dens.: ${player.properties[i].location.density}</div>
                    <div>price: ${player.properties[i].price}</div>
                    ${player.properties[i].hasContract ? `` : `<button onclick="createContract(${player.properties[i].id})" id="${player.properties[i].id}">create contract</button>`}
                </li>
            `;
        }

        // CONTRACTS
        document.getElementById("contracts").innerHTML = this.getRent();
        for(let i = 0; i < player.contracts.length; i++){
            document.getElementById("contracts").innerHTML += `
                <li class="list-group-item">
                    <div>id: ${player.contracts[i].id}</div>
                    <div>rent: ${player.contracts[i].rent}</div>
                </li>
            `;
        }
        
        // SKILLS
    }
}

class PropertiesForSale{
    constructor(player){
        this.properties = [];
        // this.amount = player.skills.properties; //number of properties offered to player each year
        this.amount = 1;
    }

    getNew(){
        for(let i = 0; i < 1; i++){
            let location = new Location(Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 100) + 1)
            let property = new Property(location, 1, 10000);
            this.properties.push(property)
        }
    }

    render(){
        document.getElementById("buy-properties").innerHTML = "";
        for(let i = 0; i < listOfProperties.length; i++){
            document.getElementById("buy-properties").innerHTML += `
                <li class="list-group-item">
                    <div>id: ${listOfProperties[i].id}</div>
                    <div>level: ${listOfProperties[i].level}</div>
                    <div>price: ${listOfProperties[i].price}</div>
                    <button id="${listOfProperties[i].id}">buy</button>
                </li>
            `;
        }
    }
}

let player = new Player();

// function showPlayer() {
//     console.log(player);
//     console.log(listOfProperties);
// }
// showPlayer();

function createContract(id){
    let property;
    for(let i = 0; i < player.properties.length; i++){
        if(player.properties[i].id == id) property = player.properties[i];
    }
    let newContract = new Contract(property, 1);
    newContract.start(player);
}

function buyProperties() {
    let listOfProperties = [];
    for(let i = 0; i < 1; i++){
        let location = new Location(Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 100) + 1)
        let property = new Property(location, 1, 10000);
        listOfProperties.push(property)
    }
    document.getElementById("buy-properties").innerHTML = "";
    for(let i = 0; i < listOfProperties.length; i++){
        document.getElementById("buy-properties").innerHTML += `
            <li class="list-group-item">
                <div>id: ${listOfProperties[i].id}</div>
                <div>level: ${listOfProperties[i].level}</div>
                <div>price: ${listOfProperties[i].price}</div>
                <button id="${listOfProperties[i].id}">buy</button>
            </li>
        `;
    }
    document.getElementById(listOfProperties[0].id).addEventListener("click", () => {
        listOfProperties[0].buy(player);
    })

    
}
buyProperties();
player.render();
// GAME LOOP

setInterval(() => {
    player.recieve(player.getRent());
    player.timeCurrent++;
    player.render();
}, 1000);

setInterval(() => {
    buyProperties();
}, 12000);

console.log("%cI HOPE YOU ARE DEBUGGING THIS IF YOU ARE HERE","color:red; font-size: 50px; font-weight: bolder; background-color: black; padding: 1rem; margin: 1rem");