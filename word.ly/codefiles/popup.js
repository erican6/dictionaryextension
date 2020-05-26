//Loader Fadeout
$(".loader-wrapper").fadeOut('slow');

//Automatically inputting value
$('#check').change(function(e) {
    e.preventDefault();
    let bgpage = chrome.extension.getBackgroundPage();
    let word = bgpage.word;
    let cword = $('#word').val();
    if(cword.length==0) {
        $('#word').val(word);
    }
    else if(cword!=word) {
        $('#word').val(word);
    }
    else {
        $('#word').val('');
    };
});

//Google non-official API setup complete
$('#wordsearch').on('submit', function(e) {
    e.preventDefault();
    let word = $('#word').val();
    $('body').html('<form id="refresh"><button type="submit" class="btn btn-light btn-lg btn-block">Search For New Word</button></form><div class="card" style="width: 410px; height: 550px; margin: auto;"> <div class="card-body" style="background-color: #FAF0E6;overflow: scroll;"> <h4 style="text-align: center; margin-bottom: 15px; margin-top: -10px;"><b>'+word+'</b></h4> <ul class="nav nav-tabs " id="myTab" role="tablist"> <li class="nav-item"> <a class="nav-link active" id="define-tab" data-toggle="tab" href="#define" role="tab" aria-controls="define" aria-selected="true">Define</a> </li> <li class="nav-item"> <a class="nav-link" id="synonym-tab" data-toggle="tab" href="#synonym" role="tab" aria-controls="synonym" aria-selected="false">Synonyms</a> </li> <li class="nav-item"> <a class="nav-link" id="rhyme-tab" data-toggle="tab" href="#rhyme" role="tab" aria-controls="rhyme" aria-selected="false">Rhymes</a> </li> </ul> <div class="tab-content" id="myTabContent"> <div class="tab-pane fade show active" id="define" role="tabpanel" aria-labelledby="define-tab" style="background-color: white;"> <div id="def"></div> </div> <div class="tab-pane fade" id="synonym" role="tabpanel" aria-labelledby="synonym-tab" style="background-color: white;"> <div id="synonym"></div> </div> <div class="tab-pane fade" id="rhyme" role="tabpanel" aria-labelledby="rhyme-tab" style="background-color: white;"> <div id="rhyme"></div> </div> </div> </div> </div> <div class="loader-wrapper"><span class="loader"><span class="loader-inner"></span></span></div>');
    gdefsyn(word);
});

function gdefsyn(word) {
    let api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    let url = api+word;
    $.get(url, function(data) {
        console.log(data);
        meanings = data[0]['meanings'];
        indexm = Object.keys(meanings);
        lenm = indexm.length;
        defout = '<div class="positioning">';
        synout = '<div class="positioning">';
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
        defout = defout+'</div>';
        $('#def').html(defout);
        datamuses(synout,word);
    }).catch(err => {
        //Loader Fadeout
        $(".loader-wrapper").fadeOut('slow');
        defout = '<div class="positioning"><i>Sorry, this word is not available</i></div>';
        synout = '<div class="positioning"><i>Sorry, this word is not available</i></div>';
        rhyout = '<div class="positioning"><i>Sorry, this word is not available</i></div>';
        $('#def').html(defout);
        $('#synonym').html(synout);
        $('#rhyme').html(rhyout);
    });
};

//Datamuse API
function datamuses(synout,word) {
    //Synonyms
    let api = 'https://api.datamuse.com/words?ml=';

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
            datamusea(synout,word);
            rhym(word);
        }
        else {
            synout = synout;
            datamusea(synout,word);
            rhym(word);
        };
    });
};

function datamusea(synout,word) {
    //Antonyms
    let api = 'https://api.datamuse.com/words?rel_ant=';

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
            synout = synout+'</ol><hr></div>';
            $('#synonym').html(synout);
        }
        else {
            synout = synout+'</div>';
            $('#synonym').html(synout);
        };
    });
};

//Rhymes From Datamuse API
function rhym(word) {
    let api = 'https://api.datamuse.com/words?rel_rhy=';

    let url = api+word+'&max=65';
    axios.get(url).then(function(data) {
        console.log(data);
        rhys = data['data'];
        numrhys = Object.keys(rhys);
        lenr = numrhys.length;
        rhyout = '<div class="positioning">';
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
            rhyout = rhyout+'</div>';
            $('#rhyme').html(rhyout);
            //Loader Fadeout
            $(".loader-wrapper").fadeOut('slow');
        }
        else {
            rhyout = '<div class="positioning">No rhymes available for this word</div>';
            rhyout = rhyout+'</div>';
            $('#rhyme').html(rhyout);
            //Loader Fadeout
            $(".loader-wrapper").fadeOut('slow');
        };
    });
};

//Go Back To Search
$('#refresh').on('submit', function(e) {
    e.preventDefault();
    window.location.reload();
});
