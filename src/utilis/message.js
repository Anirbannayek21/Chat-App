const genarateMessage = (name,text) =>{
    return {
        username:name,
        message:text,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    genarateMessage
}