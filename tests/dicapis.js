$('#wordsearch').on('submit', function(e) {
    e.preventDefault();
    let api = 'https://api.dictionaryapi.dev/api/v1/entries/en/';
    let word = $('#word').val();
    console.log(word);
    
    let url = api + word;
    console.log(url);
   $.get(url, function(data) {
    console.log(data);
    meanings = data[0]['meaning'];
    console.log(meanings)
    
    index = Object.keys(meanings);
    len = index.length;
    for(i=0;i<len;i++) {
        meaning = meanings[i];
        console.log(meaning);
    }
   });


}); 