const users=[]
let groups=[]

const addUser= ({_id, username ,groupname}) =>{
    // clean data
    username = username.trim()

    groupname = groupname.trim()

    const user = {_id,username,groupname}
    if(!username || !groupname){
        return{
            error:'username or groupname are invalid'
        }
    }

    // check for existing user
    const exitstingUser = users.find((user)=>{
        return user.groupname===groupname && user.username===username
    })

    // if user exist
    if(exitstingUser){
        return{
            error:`${username} all ready in room`
        }
    }
    // push data to users array
    users.push(user)
    // console.log(users)
    return {user}
}

// remove user
const removeUser = (id) =>{
    const index = users.findIndex((user)=>user._id===id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

// user search by id 
const getUser = (id) =>{
    return users.find((user)=>user._id===id)
}

// all users present in group
const getUserINGroup = (groupname) =>{
    groupname = groupname.trim()

    return users.filter((user)=>user.groupname===groupname)
}


const getGroups = ()=>{
    const key = 'groupname'
    groups = [...new Map(users.map(item =>[item[key], item])).values()];
    return groups
}


console.log(users)
module.exports={
    addUser,removeUser,getUser,getUserINGroup,getGroups
}
