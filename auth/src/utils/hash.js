const {scrypt,randomBytes} = require('crypto');
const { promisify } = require("util");
const scryptAsync = promisify(scrypt);

const hash = async (password)=>{
    try {
        const salt = randomBytes(8).toString('hex');
        const hash = await scryptAsync(password,salt,64);
        return `${hash.toString('hex')}.${salt}` 
    } catch (error) {
        console.log(error.message);
    }
}

const compare = async (passwordDB,password)=>{
    try {
        const [hashed,salt] = passwordDB.split('.');
        const buf = await scryptAsync(password,salt,64);
        return buf.toString('hex') === hashed
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {hash,compare}