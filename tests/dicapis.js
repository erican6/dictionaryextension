//Google non-official API setup complete
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
        defout = '<br>';
        synout = '<br>';
        //Definitions, Example, & Synonyms
        for(i=0;i<lenm;i++) {
            pos = meanings[i]['partOfSpeech'];
            defout = defout+'<h5>Word<sup>'+i+'</sup> - '+pos+'</h5><ol>';
            defs = meanings[i]['definitions'];
            indexd = Object.keys(defs);
            lend = indexd.length;
            for(j=0;j<lend;j++) {
                def = defs[j]['definition'];
                ex = defs[j]['example'];
                if(ex==undefined){
                    ex = 'no example available';
                }
                defout = defout+'<li><b>'+def+'</b><br><i>'+ex+'</i></li>';

                syns = defs[j]['synonyms'];
                synout = synout+'<h5>Meaning - '+syns[0]+'</h5><ol class="list-inline">';
                indexs = Object.keys(syns);
                lens = indexs.length;
                for(k=1;k<lens;k++) {
                    syn = syns[k];
                    synout = synout+'<li class="list-inline-item around">'+syn+'</li>';
                }
            synout = synout+'</ol><hr>';
            }
            defout = defout+'</ol><hr>';
        }
        $('#def').html(defout);
        $('#synonym').html(synout);
    }).catch(err => {
        defout = 'nope'
        synout = 'nope'
        $('#def').html(defout);
        $('#synonym').html(synout);
    });
}); 