// encryption and decryption functions
var encryptSort = function(elements, key){
  var temp = {}, sorted = '';
  var key = key.toString();

  for(var i=0; i<elements.length; i++){
    if(temp.hasOwnProperty(key[i])){
      temp[key[i]].push(elements[i]);
    }else{
      temp[key[i]] = [elements[i]];
    }
  }

  var newKey = Object.keys(temp).sort(function(a,b){return a > b});

  for(var i=0; i<newKey.length; i++){
    sorted += temp[newKey[i]].join('');
  }

  return sorted;
}

var decryptSort = function(elements, key){
  var temp = {}, sorted = '';
  key = key.toString().slice(0, elements.length);

  var newKey = key.split('').sort(function(a,b){return a > b});

  for(var i=0; i<elements.length; i++){
    if(temp.hasOwnProperty(newKey[i])){
      temp[newKey[i]].push(elements[i]);
    }else{
      temp[newKey[i]] = [elements[i]];
    }
  }

  for(var i=0; i<key.length; i++){
    sorted += temp[key[i]].shift();
  }

  return sorted;
}

var encrypt = function(key, message, direction){
  key = key.toString();

  var chunks = message.match(new RegExp('.{1,'+key.length+'}',"g"));
  var cipherText = '';

  for(var i=0; i<chunks.length; i++){
    var elements = chunks[i].split('');
    cipherText += (direction === 'encrypt') ? encryptSort(elements, key) : decryptSort(elements, key);
  }

  return cipherText;
}

// non alphabetic char holder
var messageChars = {
  special: [],
  specialDict: {}
}

var display = function(message){
  message.split('').forEach(function(letter, index){
    $('#cipherContainer').append('<span style="padding-right:5px;" id="'+ index +'">'+ letter +'</span>')
  })
}

var nextLetter = function(letter){
  var index = letter.charCodeAt();
  
  if(letter.search(/[a-zA-Z]/) < 0){
    // cycle through special chars
    index = ++messageChars.special.match(new RegExp(letter, '')).index;
    if(index === messageChars.special.length){
      return 'A';
    }else{
      return messageChars.special[index];
    }
  }else if(index === 90){
    // end of uppercase chars
    return 'a';
  }else if(index === 122){
    // end lower case chars, begin cycling through special cares
    if(messageChars.special !== null){
      return messageChars.special[0];
    }else{
      return 'A';
    }
  }else{
    // cycle throuhg alphebet
    return String.fromCharCode(index + 1);
  }
}

var slow = function(start){
  var spans = $('span');
  for(var i=start; i<spans.length; i++){
    var text = nextLetter($('span#'+i).text());

    $('span[id='+i+']').text(text);
  };
}

var cycle = function(cipherText){
  var count = arguments[1] || 0;
  setTimeout(function(){
    var mess = '';
    $('span').each(function(i, element){
      mess += $(element).text();
    })
    
    if(mess === cipherText){
      return true;
    }else{
      if(mess[count] === cipherText[count]){
        count++;
      }
      slow(count);
      return cycle(cipherText, count);
    }
  }, 25);
}

var performEncryption = function(){
  var key = $('#key').val();
  var mess = $('#plainText').val();
  var flag = ($('#decrypt').is(':checked')) ? 'decrypt' : 'encrypt';
  var newMessage = encrypt(key, mess, flag);

  try{
    messageChars.special = newMessage.match(/[^a-zA-Z]/g);
    messageChars.special.forEach(function(el, i){
      messageChars.specialDict[el] = true;
    })
    messageChars.special = Object.keys(messageChars.specialDict).join('');
  }catch(ex){
    void(0);
  }

  cycle(newMessage);
}

var clipBoardCopy = function(){
  var message = '';
  $('span').each(function(i, el){
    message += $(el).text();
  })
  window.prompt("Copy to clipboard: Ctrl+C, Enter", message);
}


$('#plainText').on('keyup', function(event){
  $('#cipherContainer').html('');
  display(event.currentTarget.value);
})

