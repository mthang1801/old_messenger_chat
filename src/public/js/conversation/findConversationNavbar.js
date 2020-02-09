
function niceScrollNavbarSearch(){
  $('.search_content').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}
function findConversationNavbar(){
  $(".searchBox").off("keypress").on("keypress" , function(event){
      if(event.which == 13){
        let inputVal = $(this).val();
        if( inputVal.length == 0){
          return false ; 
        }
        $.get(`/contact/get-conversation-from-navbar-search?inputVal=${inputVal}` , function(data){
          
          if(data.findUserContactAtNavbar.trim() == ""){
            $("#search-results").show("slow");
            $("ul.people-navbar").html(`<li class="text-center"> <div>Không tìm thấy kết quả <i class="glyphicon glyphicon-search"></i></div></li>`)
            return false ; 
          }
          //step00 : remove data from navbar search before passing data 
          $("ul.people-navbar").find("a").remove();
          //step01 : render data to ul.people-navbar
          niceScrollNavbarSearch();
          $("ul.people-navbar").prepend(data.findUserContactAtNavbar) ; 
          //step02 : show #search-results
          $("#search-results").show("slow");

          chatFromContactList();
          socket.emit("check-status");
        });
      }
  
  })

  $(".searchBox").off("keyup").on("keyup" , function(){
      let inputVal = $(this).val();
      if( inputVal.length == 0){
        return false ; 
      }
      $.get(`/contact/get-conversation-from-navbar-search?inputVal=${inputVal}` , function(data){
        console.log(data);
        if(data.findUserContactAtNavbar.trim() == ""){
          $("#search-results").css("display" , "block");
          $("ul.people-navbar").html(`<li class="text-center"> <div>Không tìm thấy kết quả <i class="glyphicon glyphicon-search"></i></div></li>`)
          return false ; 
        }
        //step00 : remove data from navbar search before passing data 
        $("ul.people-navbar").find("a").remove();
        //step01 : render data to ul.people-navbar
        niceScrollNavbarSearch();
        $("ul.people-navbar").prepend(data.findUserContactAtNavbar) ; 
        //step02 : show #search-results
        $("#search-results").css("display" , "block");

        chatFromContactList();
        socket.emit("check-status");
      });
})
}



$(document).ready(function () {
  findConversationNavbar() ;
});