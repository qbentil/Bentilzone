// import Mysqli from 'mysqli';
const Mysqli = require('mysqli')

let  conn  =  new  Mysqli ( { 
    host : 'localhost' ,
    post : 3306 ,  // default 3306 
    user : 'root' , 
    passwd : '' , 
    db : 'bentilzone_angular' 
} )

let db = conn.emit(false, ''); // There is not emit database


module.exports = {
    database: db
}