function increaseNumberMessage(divId){
  let currentValue = +$(`.right[data-chat = ${divId}]`).find(".show-number-messages").text();
  currentValue++ ; 
  $(`.right[data-chat = ${divId}]`).find(".show-number-messages").html(currentValue);
}