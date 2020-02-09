function increaseMemberAmount(groupId , dataUser){
  let currentValue = +$(`#to_${groupId}[data-user = ${groupId}-${dataUser}]`).find(".show-number-members").text();
  currentValue++; 
  $(`#to_${groupId}[data-user = ${groupId}-${dataUser}]`).find(".show-number-members").html(`${currentValue} <i class="fa fa-users"></i>` );
}

function decreaseMemberAmount(groupId , dataUser){
  let currentValue = +$(`#to_${groupId}[data-user = ${groupId}-${dataUser}]`).find(".show-number-members").text();
  currentValue--; 
  $(`#to_${groupId}[data-user = ${groupId}-${dataUser}]`).find(".show-number-members").html(`${currentValue} <i class="fa fa-users"></i>` );
}