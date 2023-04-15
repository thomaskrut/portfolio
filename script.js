let getActiveUsersCallback = initGetActiveUsers('__anonymous__')
let getMessagesCalleback = initGetMessages('__anonymous__')

const activeUsers = [];

const localMessagesArray = [];

function updateMessages() {
    const messagesDiv = document.getElementById('messages')
    messagesDiv.innerText = ''
    localMessagesArray.forEach(message => {
        const messageSpan = document.createElement('span')
        messageSpan.innerText = `
            ${message.sender}> ${message.message}
        `
        messagesDiv.appendChild(messageSpan)
    })
}

function updateActiveUsers() {
    const activeusersSpan = document.getElementById('activeusers')
    activeusersSpan.innerText = ''
    activeUsers.forEach(activeuser => {
        const activeuserSpan = document.createElement('span')
        activeuserSpan.innerText = `
            ${activeuser}
        `
        activeusersSpan.appendChild(activeuserSpan)

    })
}

function join() {
    event.preventDefault()
    username = document.getElementById('sender').value
    activeUsers.push(username)
    updateActiveUsers()
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
    const messageData = {
        sender,
        receiver,
        message,
    }
    localMessagesArray.push(messageData)
    updateMessages()
    document.getElementById('message').value = ''
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://messserver-thomaskkrut.b4a.run/message')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(messageData))
}

function initGetActiveUsers(username) {

    return setInterval(() => {
        const xhr2 = new XMLHttpRequest()
        xhr2.open('GET', 'https://messserver-thomaskkrut.b4a.run/activeusers/' + username)
        xhr2.send()
        xhr2.onload = () => {
            const usersResponse = JSON.parse(xhr2.response)

            usersResponse.forEach(user => {
                if (!activeUsers.includes(user)) {
                    activeUsers.push(user)
                }
            })

        }

        updateActiveUsers()

    }, 3000)


}

function initGetMessages(username) {

    return setInterval(() => {
        const xhr1 = new XMLHttpRequest()
        xhr1.open('GET', 'https://messserver-thomaskkrut.b4a.run/message/' + username)
        xhr1.send()

        xhr1.onload = () => {
            const messagesRespone = JSON.parse(xhr1.response)
            console.log(messagesRespone)

            messagesRespone.forEach(message => {
                if (message.sender != username) {
                    localMessagesArray.push(message)
                }
            })
            
            updateMessages()

        }
    }, 3000)
}

