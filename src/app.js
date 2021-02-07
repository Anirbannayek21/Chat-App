const path = require('path')
const http = require('http')
const express=require('express');
const socketio = require('socket.io')
const { genarateMessage }= require('./utilis/message')
const { addUser,removeUser,getUser,getUserINGroup } = require('./utilis/users')
const port = process.env.PORT || 3000

const app=express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath=path.join(__dirname,'../public')

app.use(express.static(publicDirPath))

// app.get('',(req,res)=>{
//     res.render('index.html')
// })



io.on('connection',(socket)=>{
    console.log('new connection')
    //  server(emit)->client(receive)->countUpdated

    socket.on('join',(options, callback)=>{

        const {error,user} = addUser({ _id:socket.id, ...options})

        if(error){
            return callback(error)
        }

        // join the user in specifi groupname
        socket.join(user.groupname)
        // emit welcome massage to user how join 
        socket.emit('enter',genarateMessage(user.username,` ,welcome to ${user.groupname}` ))

        // emit a user join massage to other user accept how joined
        socket.broadcast.to(user.groupname).emit('enter',genarateMessage(user.username,` has joined the group`))

        io.to(user.groupname).emit('groupData',{
            groupname:user.groupname,
            users:getUserINGroup(user.groupname)
        })
        callback()

        
    })
    // // client(receive)->server(emit)->increment
    socket.on('render',(text,callback)=>{
        const user = getUser(socket.id)
        console.log(user)
        // send the massage to all user
        // io.emit('sendMassage',genarateMessage(text)),

        if(user){
            // emit welcome massage to user how join 
            socket.emit('sendMassageSender',genarateMessage('You',text))

            // emit a user join massage to other user accept how joined
            socket.broadcast.to(user.groupname).emit('sendMassageReceiver',genarateMessage(user.username,text))
        }


        callback('massage delivered')
    })

    socket.on('sendlocation',(coords,callback)=>{
        const user = getUser(socket.id)
        console.log(user)
        if(user){
            // emit welcome massage to user how join 
            socket.emit('LocationMassagesender',genarateMessage("You",`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

            // emit a user join massage to other user accept how joined
            socket.broadcast.to(user.groupname).emit('LocationMassagereceiver',genarateMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        }
        callback('location shared')
    })
        
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        console.log(user)
        if(user){
            io.to(user.groupname).emit('enter',genarateMessage(user.username,` has left the group`))

            io.to(user.groupname).emit('groupData',{
                groupname:user.groupname,
                users:getUserINGroup(user.groupname)
            })
        }
    })
})

server.listen(port,()=>{
    console.log(`server running on port ${port}` )
})