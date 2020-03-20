const protocolStr = document.location.protocol
const path = window.location.host
let wsurl = 'ws://' + path + '/api/voice/ws.jhtml'
if(protocolStr == 'http:'){
    const wsurl = 'ws://' + path + '/api/voice/ws.jhtml'
}else if(protocolStr == 'https:'){
    const wsurl = 'wss://' + path + '/api/voice/ws.jhtml'
}

export default wsurl