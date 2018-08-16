/**
 * Created by venkatsrinag on 5/8/17.
 */

import io from 'socket.io-client'
import kinda_ntp from 'socket-kinda-ntp/client/socket-kinda-ntp'

class Conversations{
    constructor(){
        this.socket      = null;
        this.utils 		 = null;
        this.socketUtils = null;
    }

    init(){
        this.utils 		 = new __Utils();
        this.socketUtils = new __SocketUtils();
    }

    connect(url){
        var token = this.utils.getToken();
        if(token){
          this.socket = this.socketUtils.connect(url, this.utils.getToken())
        }
    }
}

class __Utils{
    constructor(){
    }

    setToken(token){
        localStorage.setItem('auth_token', token);
        console.log('-----save auth token-----');
    }

    setBuildVersionToken(version){
      localStorage.setItem('build_version', version);
      console.log('-----build_version saved-----');
    }

    getToken(){
        return localStorage.getItem('auth_token')
    }
}

class __SocketUtils{
    constructor(){
    }

    connect(url, token){
        var socket = io(url, {query:{'x-access-token':token}}, {'forceNew': true}, {'sync disconnect on unload' : true}, {'secure': true}, {'reconnection':true})
        // kinda_ntp.init(socket);
      // console.log('-------------connecting socket-----------------', socket);
        return socket;
    }

    emitMessage(socket, eventName, payload, ackCallback){
      if(socket) {
        socket.emit(eventName, payload, function (response) {
          if (ackCallback)
            ackCallback(response)
        });
      }
    }

    listenMessage(socket, eventName, respCallback){
      if(socket){
        socket.on(eventName, function (response) {
          if(respCallback)
            respCallback(eventName, response)
        })
      }
    }

    // getServerTime(){
    //     return Math.round(kinda_ntp.time())
    // }
}

var rkConversations = new Conversations();
export default rkConversations;
