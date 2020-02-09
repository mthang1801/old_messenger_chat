import moment from "moment"; 
export let bufferToBase64 = (buffer)=> {
  return Buffer.from(buffer).toString("base64"); 
}

export let lastItemOfArray = (array) => {
  if(!array.length){
    return [] ; 
  }
  return array[array.length - 1 ] ;
}

export let convertTimeOfLastMessage = (timeStamp) => {
  if(!timeStamp){
    return "" ; 
  }
  return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
}

export let popupMessageTime = (timeStamp) => {
  if(!timeStamp){
    return "" ;
  }
  return moment(timeStamp).format('lll');
}