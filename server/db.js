const sqlite = require('sqlite')
const sqlite3 = require('sqlite3').verbose();


// const db = new sqlite3.Database('C:\\sqlite\\game', err => {
//     if (err) console.log("connection error: " + err.message)
//     else console.log("Connected to db")
// });

function createDBconnection(){
    return sqlite.open({filename: 'C:\\sqlite\\game', driver:sqlite3.Database})
}


async function addLog(entityType, entityAction, entityId){
    var time= new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = await createDBconnection();
    var stm= await db.prepare("INSERT INTO log (time, entity_type, entity_action, entity_id) VALUES (?, ?, ?, ?)");

    (await stm).run(time, entityType, entityAction, entityId);
}


async function addUser(uname, socketid){
    var login= new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = await createDBconnection();
    var stm= db.prepare("INSERT INTO user (socketid, username, login) VALUES (?, ?, ?)");
    (await stm).run(socketid, uname, login);
    //stm.(socketid, uname, login)
    //stm.finalize();
}

async function logoutUser(socketid){
    var logout= new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = await createDBconnection();
    var stm= db.prepare("UPDATE user SET logout=? WHERE socketid=?");

    (await stm).run(logout, socketid);
}

async function addScore(username, score){
    console.log("adding score" + username, score)
    var time= new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = await createDBconnection();
    var stm= db.prepare("INSERT INTO scoreboard (username, score, date) VALUES (?, ?, ?)");

    (await stm).run(username, score, time);
}

async function getScoreboard(){  
    const db = await createDBconnection();
    var res = await db.all("SELECT * FROM scoreboard ORDER BY score DESC, username LIMIT 10")
    return res
}


async function getLoggedInUsers(){
    const db = await createDBconnection();
    var res = await db.all("SELECT * FROM user WHERE logout IS NULL");
    return res
}

async function getLogs(){  
    const db = await createDBconnection();
    var res = await db.all("SELECT * FROM log")
    return res
}


//max score is 14. score is (own score-enemy score)+7
//test game is 7-5
//addScore("test_win", 9)
//addScore("test_lose", 5)

module.exports.addUser = addUser
module.exports.logoutUser = logoutUser
module.exports.addLog = addLog
module.exports.getLoggedInUsers = getLoggedInUsers
module.exports.getLogs = getLogs
module.exports.addScore = addScore
module.exports.getScoreboard = getScoreboard

