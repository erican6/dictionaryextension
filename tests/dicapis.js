//Google non-official API setup complete
$('#wordsearch').on('submit', function(e) {
    e.preventDefault();    
    let api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    let word = $('#word').val();
    
    let url = api+word;
    $.get(url, function(data) {
        console.log(data);
        meanings = data[0]['meanings'];
        indexm = Object.keys(meanings);
        lenm = indexm.length;
        defout = '<br>';
        synout = '<br>';
        //Definitions, Example, & Synonyms
        for(i=0;i<lenm;i++) {
            //Definitions & Examples
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
                };
                defout = defout+'<li><b>'+def+'</b><br><i>'+ex+'</i></li>';
                //Synonyms
                if(defs[j]['synonyms']==undefined) {
                    synout = synout+'<i>no synonyms available for definition '+(j+1)+', word<sup>'+i+'</sup></i><hr>';
                }
                else{
                    syns = defs[j]['synonyms'];
                    synout = synout+'<h5>Meaning - '+syns[0]+'</h5><ol class="list-inline">';
                    indexs = Object.keys(syns);
                    lens = indexs.length;
                    for(k=1;k<lens;k++) {
                        syn = syns[k];
                        synout = synout+'<li class="list-inline-item around">'+syn+'</li>';
                    };
                    synout = synout+'</ol><hr>';
                };
            };
            defout = defout+'</ol><hr>';
        };
        $('#def').html(defout);
        datamuses(synout);
    }).catch(err => {
        defout = '<i>Sorry, this word does not exist</i>';
        synout = '<i>Sorry, this word does not exist</i>';
        $('#def').html(defout);
        $('#synonym').html(synout);
    });
}); 

//Datamuse API
function datamuses(synout) {
    //Synonyms
    let api = 'https://api.datamuse.com/words?ml=';
    let word = $('#word').val();
    
    let url = api+word+'&max=30';
    axios.get(url).then(function(data) {
        console.log(data);
        syns = data['data'];
        indexs = Object.keys(syns);
        lens = indexs.length;
        if(lens>0){
            synout = synout+'<h5>Synonyms From DataMuse</h5><ol class="list-inline">';
            for(l=0;l<lens;l++) {
                syn = syns[l]['word'];
                synout = synout+'<li class="list-inline-item around">'+syn+'</li>';
            }
            synout = synout+'</ol><hr>';
            datamusea(synout);
            rhym();
        }
        else {
            synout = synout;
            datamusea(synout);
            rhym();
        };
    });
};

function datamusea(synout) {
    //Antonyms
    let api = 'https://api.datamuse.com/words?rel_ant=';
    let word = $('#word').val();

    let url = api+word+'&max=30';
    axios.get(url).then(function(data) {
        console.log(data);
        ants = data['data'];
        indexa = Object.keys(ants);
        lena = indexa.length;
        if(lena>0) {
            synout = synout+'<h5>Antonyms From DataMuse</h5><ol class="list-inline">';
            for(m=0;m<lena;m++) {
                ant = ants[m]['word'];
                synout = synout+'<li class="list-inline-item around">'+ant+'</li>';
            };
            synout = synout+'</ol><hr>';
            $('#synonym').html(synout);
        }
        else {
            synout = synout;
            $('#synonym').html(synout);
        };
    });
};

//Rhymes From Datamuse API
function rhym() {
    let api = 'https://api.datamuse.com/words?rel_rhy=';
    let word = $('#word').val();

    let url = api+word+'&max=65';
    axios.get(url).then(function(data) {
        console.log(data);
        rhys = data['data'];
        numrhys = Object.keys(rhys);
        lenr = numrhys.length;
        rhyout = '<br>';
        if(lenr>0) {
            maxsyl = 0;
            for(v=0;v<lenr;v++){
                sylnum = rhys[v]['numSyllables'];
                if(sylnum > maxsyl) {
                    maxsyl = sylnum;
                };
            };
            maxsyl = maxsyl+1;
            for(z=1;z<maxsyl;z++) {
                rhyout = rhyout+'<h5>Rhyme(s) with '+word+' that have '+z+' syllable(s):</h5><ol class="list-inline">';
                for(y=0;y<lenr;y++) {
                    if(rhys[y]['numSyllables']==z) {
                        rhy = rhys[y]['word'];
                        rhyout = rhyout+'<li class="list-inline-item around">'+rhy+'</li>';
                    }
                };
                rhyout = rhyout+'</ol><hr>';
            };
            $('#rhyme').html(rhyout);
        }
        else {
            rhyout = 'No rhymes available for this word';
            $('#rhyme').html(rhyout);
        };
    });
};