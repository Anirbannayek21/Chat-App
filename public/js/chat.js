const socket = io()

$massageform = document.querySelector('#form')
$massageformInput = document.querySelector('#text')
$massageformInputButton = document.querySelector('#send')
$sendLocationButton = document.querySelector('#location')


// place wher e the inner html render
$massages = document.querySelector('#massages')



// template
const massageTemplateSender = document.querySelector('#massage-template-sender').innerHTML
const massageTemplateReceiver = document.querySelector('#massage-template-receiver').innerHTML
const LocationTemplatereceiver = document.querySelector("#Location-template-receiver").innerHTML
const LocationTemplatesender = document.querySelector("#Location-template-sender").innerHTML
const enterExit = document.querySelector('#enterExit').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML

// user to parse gruopname and username
const {username,groupname} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll=()=>{
    // store last element
    const $newMessage = $massages.lastElementChild

    // height of new element
    const newMessageHeight = $newMessage.offsetHeight
    // visible height
    const visibleHeight = $massages.offsetHeight

    const containerHeight = $massages.scrollHeight

    const scrollOffset = $massages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $massages.scrollTop = $massages.scrollHeight
    }
}
// client receive
socket.on('sendMassageSender',(massage)=>{
    console.log(massage)

    // the dianamic contect which render inside div
    const html = Mustache.render(massageTemplateSender,{
        username:massage.username,
        massage : massage.message,
        createdAt : moment(massage.createdAt).format(' h:mm A')
    })
    // insrt massage int massges div at the bottom of div
    $massages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

socket.on('enter',(massage)=>{
    console.log(massage)

    // the dianamic contect which render inside div
    const html = Mustache.render(enterExit,{
        username:massage.username,
        massage : massage.message,
        createdAt : moment(massage.createdAt).format(' h:mm A')
    })
    // insrt massage int massges div at the bottom of div
    $massages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// client receive
socket.on('sendMassageReceiver',(massage)=>{
    console.log(massage)

    // the dianamic contect which render inside div
    const html = Mustache.render(massageTemplateReceiver,{
        username:massage.username,
        massage : massage.message,
        createdAt : moment(massage.createdAt).format('h:mm A')
    })
    // insrt massage int massges div at the bottom of div
    $massages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

// links send by server shown to users
socket.on('LocationMassagesender',(url)=>{
    console.log(url)

    // the dianamic contect which render inside div
    const html = Mustache.render(LocationTemplatesender,{
        username:url.username,
        url:url.message,
        createdAt : moment(url.createdAt).format('h:mm A')
    })
    // insrt massage int massges div at the bottom of div
    $massages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

socket.on('LocationMassagereceiver',(url)=>{
    console.log(url)

    // the dianamic contect which render inside div
    const html = Mustache.render(LocationTemplatereceiver,{
        username:url.username,
        url:url.message,
        createdAt : moment(url.createdAt).format('h:mm A')
    })
    // insrt massage int massges div at the bottom of div
    $massages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

socket.on('groupData',({groupname,users})=>{
    console.log(groupname)
    const html = Mustache.render(sidebartemplate,{
        groupname:groupname,
        users
    })
    document.querySelector('#sidebar').innerHTML=html


})
// client emit
$massageform .addEventListener('submit',(e)=>{
    e.preventDefault()

    // disable send button till fatching data
    $massageformInputButton.setAttribute('disabled','disabled')

    // massage inside input box
    let text= $massageformInput.value

    // if text == nul then return nothing
    // if(text===''){
    //     $massageformInputButton.removeAttribute('disabled')
    //     return;
    // }

    // emit data to server
    socket.emit('render',text,(massage)=>{
        console.log(text)
        // unable send button after send location to server
        $massageformInputButton.removeAttribute('disabled')
        // after sending data make the input place blank
        $massageformInput.value=''
        // focus the curser at the front of the input box
        $massageformInput.focus()
    }) 
})

$sendLocationButton.addEventListener('click',()=>{
    // if brower not not support aloowing location then show a alert
    if(!navigator.geolocation){
        return alert("your brower don't support it")
    }

    // disable send location button till fatching data
    $sendLocationButton.setAttribute('disabled','disabled')

    // send longitude and latitude to the server
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(massage)=>{
            console.log(massage)
            // unable send location button after send location to server
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join',{username,groupname},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})