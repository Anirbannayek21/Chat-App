const socket = io()

const $create = document.querySelector('#Create')
const $join = document.querySelector('#join')
const $enteroption = document.querySelector('#enter-option')
const $newgroup = document.querySelector('#new-group')
const $existinggroup = document.querySelector('#existing-group')

const $exstgroup = document.querySelector('#Exst-group').innerHTML

$create.addEventListener('click',()=>{
    $enteroption.remove()
    $existinggroup.remove()
    $newgroup.style.display='block'
})

$join.addEventListener('click',()=>{
    $enteroption.remove()
    $newgroup.remove()
    $existinggroup.style.display='block'

    socket.emit('groupname')
})

socket.on('view',(groups)=>{
    console.log(groups)
    const html = Mustache.render($exstgroup,{
        groups
    })
    document.querySelector('#select-option').insertAdjacentHTML('beforeend', html)
})