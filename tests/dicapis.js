$('#wordsearch').on('submit', function(e) {
    e.preventDefault();    
    let api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    let word = $('#word').val();
    
    let url = api + word;
   $.get(url, function(data) {
        console.log(data);
        meanings = data[0]['meanings'];
        
        indexm = Object.keys(meanings);
        lenm = indexm.length;
        defout = '';
        for(i=0;i<lenm;i++) {
            pos = meanings[i]['partOfSpeech'];
            defout = defout+'<h5>Word<sup>'+i+'</sup> - '+pos+'</h5>';

            defs = meanings[i]['definitions'];
            indexd = Object.keys(defs);
            lend = indexd.length;
            defout = defout+'<ol>'
            for(j=0;j<lend;j++) {
                def = defs[j]['definition']
                ex = defs[j]['example']
                if(ex==undefined){
                    ex = 'no example available'
                }
                defout = defout+'<li><b>'+def+'</b><br><i>'+ex+'</i></li>'
            }
            defout = defout+'</ol><hr>'
        }
    $('#def').html(defout);
    });
}); 