let getActiveUsersCallback = initGetActiveUsers('__anonymous__')
let getMessagesCalleback = initGetMessages('__anonymous__')

const activeUsers = [];


function join() {
    event.preventDefault()
    username = document.getElementById('sender').value
    activeUsers.push(username)
    clearInterval(getActiveUsersCallback)
    clearInterval(getMessagesCalleback)
    getActiveUsersCallback = initGetActiveUsers(username)
    getMessagesCalleback = initGetMessages(username)
    document.querySelectorAll('.invisible').forEach(element => {
        element.classList.remove('invisible')
    })
}

function send() {
    event.preventDefault()
    const sender = document.getElementById('sender').value
    const message = document.getElementById('message').value
    const receiver = "__everyone__"
    const data = {
        sender,
        receiver,
        message,
    }
    document.getElementById('message').value = ''
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://messserver-thomaskkrut.b4a.run/message')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
}

function initGetActiveUsers(username) {

    return setInterval(() => {
        const xhr2 = new XMLHttpRequest()
        xhr2.open('GET', 'https://messserver-thomaskkrut.b4a.run/activeusers/' + username)
        xhr2.send()
        xhr2.onload = () => {
            const activeusers = JSON.parse(xhr2.response)
            console.log(activeusers)
          
                const activeusersSpan = document.getElementById('activeusers')
                activeusersSpan.innerHTML = ''
                activeusers.forEach(activeuser => {
                    const activeuserDiv = document.createElement('span')
                    activeuserDiv.innerHTML = `

                        ${activeuser}
                    `
                    activeusersSpan.appendChild(activeuserDiv)
                })
            
        }

    }, 3000)


}

function initGetMessages(username) {
    
    return setInterval(() => {
        const xhr1 = new XMLHttpRequest()
        xhr1.open('GET', 'https://messserver-thomaskkrut.b4a.run/message/' + username)
        xhr1.send()

        xhr1.onload = () => {
            const messages = JSON.parse(xhr1.response)
            console.log(messages)
            if (messages.length > 0) {
                const messagesDiv = document.getElementById('messages')
                
                messages.forEach(message => {
                    const messageDiv = document.createElement('span')
                    messageDiv.innerText = `
                        ${message.sender}> ${message.message}
                    `
                    messagesDiv.appendChild(messageDiv)
                })
            }
        }
    }, 3000)
}

