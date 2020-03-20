const path = window.location.host
const wsuri = 'ws://' + path + '/api/voice/ws.jhtml'
const webSocketObj = new WebSocket(wsuri)
webSocketObj.onopen = function(event) {
    console.log("WebSocket:已连接");
    console.log(event);
};
webSocketObj.onmessage = function(event) {
    console.log(event)
}
webSocketObj.onerror = function(e){
    console.log("WebSocket:发生错误 ");
    console.log(event);
}
webSocketObj.onclose = function(e) {
    console.log("WebSocket:已关闭");
      console.log(event);
}

export default webSocketObj