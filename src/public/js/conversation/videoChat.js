

function videoChat(divId){
  $(`#video-chat-${divId}`).off("click").on("click" , function(){
    if( $(this).hasClass("chat-in-group")){
      alertify.notify("Chức năng video call chưa được cập nhật cho nhóm, vui lòng quay lại sau" , "error" , 5) ; 
      return false ;
    }
    let targetId = $(this).data("chat") ; 
    let dataToEmit = {
      listenerId : targetId 
    }
    socket.emit("caller-request-check-listener-is-online" , dataToEmit);
  })
}

function playVideoStream(videoTargetId , stream){
  let video = document.getElementById(videoTargetId) ;
  video.srcObject = stream ; 
  video.onloadeddata = () => {
    video.play() ;
  }
  
}

function closeVideoStream(stream){
  return stream.getTracks().forEach( track => track.stop());
}
$(document).ready(function () {
 
  //step 02 of caller
  socket.on("server-send-listener-is-offline" , () => {
   alertify.notify("Người dùng hiện không trực tuyến , vui lòng gọi lại sau" , "error" , 5) ; 
  })
  let iceServerList = $("#ice-server-list").val() ;
  iceServerList = JSON.parse(iceServerList);
  let peer =  new Peer ({
    key : "peerjs" , 
    host : "peerjs-server-trungquandev.herokuapp.com" ,
    port : 443 , 
    secure : true  ,
    // config : {'iceServers' : iceServerList} ,
    debug : 0
  }) ; 
  let getPeerId = "" ; 
  peer.on("open" , peerId => {
    getPeerId = peerId; 

  })
   //step 03 of listener
  socket.on("server-send-listener-is-online" , response => {
  let dataToEmit = {
    callerName : response.callerName , 
    callerId : response.callerId , 
    listenerId : response.listenerId ,
    listenerName : $("#user-avatar").text()
  }
  dataToEmit.listenerPeerId = getPeerId ;
      
    //step 04 : 
  socket.emit("listener-send-peerId-to-server" , dataToEmit);

  })
  let timerInterval ;
  //step 05 : 
  socket.on("server-send-peerId-to-caller" ,  response => {
  let dataToEmit = {
    callerName : response.callerName , 
    callerId : response.callerId , 
    listenerId : response.listenerId ,
    listenerName : response.listenerName , 
    listenerPeerId : response.listenerPeerId 
  }
    
    //step 06 
    socket.emit("caller-request-call-to-server" , dataToEmit) ; 
    Swal.fire({
      title : `Đang gọi cho &nbsp; <span style="color:#2ecc71">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-phone"></i>`,
      html : `Thời gian : <strong></strong> giây <br><br>
        <button id="btn-cancel-call" class="btn btn-danger">Hủy</button>
      `,
      width : "52rem" , 
      showConfirmButton : false ,
      backdrop : "rgba(85,85,85,0.4)" , 
      allowOutsideClick : false  ,
     
      timer : 30000 ,
      onBeforeOpen : function() {
        $("#btn-cancel-call").off("click").on("click" ,  function(){
          Swal.close() ; 
          clearInterval(timerInterval) ; 
          //step 07
          socket.emit("caller-cancel-request-call" ,  dataToEmit) ;
        })
        
        Swal.showLoading(); 
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil( Swal.getTimerLeft() / 1000 )
        } , 1000)
      },
      onOpen: () => {
        //step 12
        socket.on("server-send-listener-reject-call" , response => {
          let dataToEmit = {
            callerName : response.callerName , 
            callerId : response.callerId , 
            listenerId : response.listenerId ,
            listenerName : response.listenerName , 
            listenerPeerId : response.listenerPeerId 
          }
          Swal.close(); 
          clearInterval(timerInterval) ;
          Swal.fire({
            title : `<span style="color:#2ecc71">${response.listenerName}</span> &nbsp; hiện đang bận, vui lòng gọi lại sau` ,
            width : "52rem", 
            allowOutsideClick : false  ,
            showConfirmButton : true , 
            confirmButtonText : "Xác nhận"  
          })
        })
      },
      onClose : () => {
        Swal.close() ; 
        clearInterval(timerInterval) ; 
      }
    })
  })

  //step 08 : 
  socket.on("server-send-caller-request-call-to-listener" , response => {
    let dataToEmit = {
      callerName : response.callerName , 
      callerId : response.callerId , 
      listenerId : response.listenerId ,
      listenerName : response.listenerName , 
      listenerPeerId : response.listenerPeerId 
    }
    Swal.fire({
      title : `<span style="color:#2ecc71">${response.callerName}</span> &nbsp; đang gọi cho bạn`,
      html : `Thời gian :<strong></strong> giây <br><br>
        <button id="btn-accept-call" class="btn btn-success">Chấp nhận</button>
        <button id="btn-reject-call" class="btn btn-danger">Hủy</button>
      ` , 
      showConfirmButton : false ,
      backdrop : "rgba(85,85,85,0.4)"  ,
      allowOutsideClick : false , 
      width : "52rem" , 
      timer : 30000 , 
      onBeforeOpen : () =>{
        $("#btn-reject-call").off("click").on("click" , function(){
          Swal.close() ; 
          clearInterval(timerInterval) ;
          //step 10
          socket.emit("listener-reject-call-to-server" , dataToEmit) ; 
        })

        $("#btn-accept-call").off("click").on("click" , function(){
          Swal.close();
          clearInterval(timerInterval) ; 
          //step 11
          socket.emit("listerner-accept-call-to-server" , dataToEmit);  
        })

        Swal.showLoading() ; 
        timerInterval = setInterval( () => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil( Swal.getTimerLeft() / 1000)
        } , 1000 )
      },
      onOpen : () => {
        //step 09
        socket.on("server-send-caller-cancel-request-call" , response => {
          Swal.close() ; 
          clearInterval(timerInterval) ;
        })
      }
    })
  });

  //step 13
  socket.on("server-send-accept-call-to-caller" , response => {
    let dataToEmit = {
      callerName : response.callerName , 
      callerId : response.callerId , 
      listenerId : response.listenerId ,
      listenerName : response.listenerName , 
      listenerPeerId : response.listenerPeerId 
    }
    
    Swal.close();
    clearInterval(timerInterval);
     $("#streamModal").modal({
        backdrop : "static" , 
        keyboard : true , 
        show : true 
      })
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    getUserMedia({audio : true , video: true} , stream => {
      $("#streamModal").modal({
        backdrop : "static" , 
        keyboard : true , 
        show : true 
      })
      
      playVideoStream("local-stream", stream );
      let call = peer.call(response.listenerPeerId , stream) ; 
      call.on("stream" , remoteStream => {
        playVideoStream("remote-stream" , remoteStream) ; 
      })
    
      
      $("#streamModal").on("hidden.bs.modal" , function(){
        closeVideoStream(stream);
        //Thông báo cho bên kia biết đã kết thúc cuộc gọi
        socket.emit("caller-end-call" , dataToEmit)
        
      })
    },function(err){
      if(err.toString() === "NotAllowedError: Permission denied"){
        alertify.notify("Bạn đã tắt quyền truy cập vào định vị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt trình duyệt" , "error" , 10);
      }
      if(err.toString() === "NotFoundError: Requested device not found"){
        alertify.notify("Thiết bị của bạn không hỗ trợ tính năng nghe gọi" , "error" , 10);
      }
    })
  })

  //step 14
  socket.on( "server-send-accept-call-to-listener" , response => {
    let dataToEmit = {
      callerName : response.callerName , 
      callerId : response.callerId , 
      listenerId : response.listenerId ,
      listenerName : response.listenerName , 
      listenerPeerId : response.listenerPeerId 
    }
    
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ).bind(navigator);
    peer.on("call" , call => {
      getUserMedia({audio: true , video : true} , stream => {
        call.answer(stream) ; 
        $("#streamModal").modal({
          backdrop : "static" , 
          keyboard : true , 
          show : true 
        })
        playVideoStream("local-stream" , stream)
        call.on("stream" , remoteStream => {
          playVideoStream("remote-stream" , remoteStream);
        })
        
        $("#streamModal").on("hidden.bs.modal" , function(){
          closeVideoStream(stream);
          socket.emit("listener-end-call" , dataToEmit )
          
        })

      },function(err){
        if(err.toString() === "NotAllowedError: Permission denied"){
          alertify.notify("Bạn đã tắt quyền truy cập vào định vị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt trình duyệt" , "error" , 10);
        }
        if(err.toString() === "NotFoundError: Requested device not found"){
          alertify.notify("Thiết bị của bạn không hỗ trợ tính năng nghe gọi" , "error" , 10);
        }
      })
    })
  })
  //to caller
  socket.on("server-send-listener-end-call" , response => {
    if( $("#streamModal").hasClass("in") ){
      $("#streamModal").modal("hide");
      Swal.fire({
          type : "info" , 
          title : `Đã kết thúc cuộc gọi với <span style="color:#2ECC71">${response.listenerName}</span>`, 
          backdrop : "rgba(85,85,85,0.4)",
          width : "52rem" , 
          allowOutsideClick : false , 
          showConfirmButton : true ,
          confirmButtonText : 'Xác nhận'
      })
    }
   
  })

  //to listener
  socket.on("server-send-caller-end-call" , response => {
    if( $("#streamModal").hasClass("in") ){
      $("#streamModal").modal("hide");
      Swal.fire({
        type : "info" , 
        title : `Đã kết thúc cuộc gọi với <span style="color:#2ECC71">${response.callerName}</span>`, 
        backdrop : "rgba(85,85,85,0.4)",
        width : "52rem" , 
        allowOutsideClick : false , 
        showConfirmButton : true ,
        confirmButtonText : 'Xác nhận'
      })
    }
   
  })
});