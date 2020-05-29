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
    let val = $('#word').val();
    let capitalize = (str) => str[0].toUpperCase()+str.slice(1).toLowerCase();
    let word = capitalize(val);

    if(word.toLowerCase()=='mark hoel'||word.toLowerCase()=='mr. hoel'||word.toLowerCase()=='hoel'||word.toLowerCase()=='m. hoel'||word.toLowerCase()=='m hoel'||word.toLowerCase()=='mr.hoel'||word.toLowerCase()=='mhoel') {
        hoel()
    }
    else{
        $('body').html('<form id="refresh"><button type="submit" class="btn btn-light btn-lg btn-block">Search For New Word</button></form><div class="card" style="width: 410px; height: 550px; margin: auto;"> <div class="card-body" style="background-color: #FAF0E6;overflow: scroll;"> <h4 style="text-align: center; margin-bottom: 15px; margin-top: -10px;"><b>'+word+'</b></h4> <ul class="nav nav-tabs " id="myTab" role="tablist"> <li class="nav-item"> <a class="nav-link active" id="define-tab" data-toggle="tab" href="#define" role="tab" aria-controls="define" aria-selected="true">Define</a> </li> <li class="nav-item"> <a class="nav-link" id="synonym-tab" data-toggle="tab" href="#synonym" role="tab" aria-controls="synonym" aria-selected="false">Synonyms</a> </li> <li class="nav-item"> <a class="nav-link" id="rhyme-tab" data-toggle="tab" href="#rhyme" role="tab" aria-controls="rhyme" aria-selected="false">Rhymes</a> </li> </ul> <div class="tab-content" id="myTabContent"> <div class="tab-pane fade show active" id="define" role="tabpanel" aria-labelledby="define-tab" style="background-color: white;"> <div id="def"></div> </div> <div class="tab-pane fade" id="synonym" role="tabpanel" aria-labelledby="synonym-tab" style="background-color: white;"> <div id="synonym"></div> </div> <div class="tab-pane fade" id="rhyme" role="tabpanel" aria-labelledby="rhyme-tab" style="background-color: white;"> <div id="rhyme"></div> </div> </div> </div> </div> <div class="loader-wrapper"><span class="loader"><span class="loader-inner"></span></span></div>');
        gdefsyn(word);
    };
});

function gdefsyn(word) {
    let api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    let url = api+word;
    $.get(url, function(data) {
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

//HAPPY RETIREMENT MR.HOEL
function hoel() {
    define = "<div class='positioning'> <h5>Thank You!<sup>1</sup> - Short blurbs</h5> <ol> <li>Thank you for making coding fun! I learned so much about web development in your class. Have a terrific retirement. - W. Huang</li> <li>Thank you for being an amazing coding teacher and mentor these past two great years! - I. Lee</li> <li>Thank you for being one of the most understanding and flexible teachers. - N. Manyrin</li> <li>Thank you for showing me the value of a smile. - D. Bhalwani</li> <li>Thanks for a great year! You have really made a impact at this school. Because of your class, you have made me realize how much fun coding can be. You will be truly missed. - J. Lee</li> </ol> <hr> <h5>Eager<sup>2</sup> - C. Chong</h5> <ul> <li>Mr. Hoel, you came to class with a level of excitement and enthusiasm I haven't seen in many other teachers for a long time. You were eager to help each student with any problem he had and made sure he understood. Thank you for being one of my most favourite teachers this year, and I hope retirement treats you well.</li> </ul> <h5>Hockey Fan<sup>3</sup> - O. He</h5> <ul> <li>I will keep this short and sweet, because I'm sure you will have many more letters to read through. I just wanted to say that I'll miss talking about the latest hockey news, or the latest leafs games. I couldn't have asked for a better 2 years of coding, and I'm am so incredibly lucky to have learned everything that you have taught me. May all the years ahead bring you great joy and relaxation.</li> </ul> <h5>Helpful<sup>4</sup> - Y. Mian</h5> <ul> <li>Thanks so much for being such a great coding teacher. I learned so much from you and you made my transition into computer science so smooth and easy. I went from someone who knew nothing about code or anything to a person who can now make a beautiful website all through your help. I wish you the best of luck, thank you so much!</li> </ul> <h5>Versatile<sup>5</sup> - T. Stennet</h5> <ul> <li>Your retirement sparks mixed feelings in me. In some ways, I am sad to see one of the best teachers I have ever had leave, yet in other ways, I know that you will be leaving in pursuit of greater happiness, and for that I am happy.<br><br>I am not just speaking for myself when I say you will be missed. Might that be your presence on the cross country team, or your charming smile and laughter, you would always find a way to brighten the room and make everyone feel comfortable. Your positive attitude made the programming class one of my favorite classes and learning environments which I have ever partaken in. For the many smiles you put on the faces of me and my peers, I thank you.<br><br>Your charisma was only matched by your skills as a teacher. In just one year, you're wisdom and insight in regards to the programming industry and life as a whole will undoubtedly guide me for many more years to come. You constantly stressed realism and hard-work, which grounded me and benefitted me throughout the year. For these gifts of knowledge, I thank you.<br><br>Once again, I thank you for being not only an amazing teacher but an amazing person. I wish you the best in your future endeavors, and I hope you come back and visit some time :D.</li> </ul> <h5>Favourite<sup>6</sup> - J. Li</h5> <ul> <li>From our very first activity on Python APIs to the complex sites we're designing now, there is no question that spending time in your coding class has made grade 10 my favourite year by far. Although I will miss your fun presentations and patient 1-on-1 responses, I will be sure to treasure your teachings in my coming years and remember the words \"full stack developer\" whenever I need to impress anybody!<br><br>Jokes aside, I would like to thanks you for everything that you have done for me and for the year 10 coding class. Here's to a fulfilling and well-deserved retirement!</li> </ul> <h5>Inspirational<sup>7</sup> - R. Evans</h5> <ul> <li>Thank you for such an incredible year, and inspiring my learning and love for coding. You're so comforting to be around; our class is always one to look forward to throughout the day.<br><br>Best of wishes for the future!</li> </ul> <h5>Cheerful<sup>8</sup> - A. Wang</h5> <ul> <li>Hi Mr Hoel, when I first walked into your Year 9 coding class, I gotta say, my first thought was: \"why are the walls painted like that?\" Jokes aside, your unfaltering smile always brightened my day and it was an absolute honor to meet you. I hope you have a relaxing and enjoyable retirement and I hope to see you in the near future!</li> </ul> <h5>Energetic<sup>9</sup> - R. Chan</h5> <ul> <li>When I first started computer science in Y9, I honestly wasn't excited for the course as it seemed tedious. Fast forward 2 years, even though I'm not that good at coding, comp sci has become one of my favourite classes. I've learned so much in this class all thanks to you. Mr. Hoel, thanks for not only teaching me programming, but also for bringing lots of energy and a positive vibe to class. I'm going to miss you a lot. Congrats on your retirement and best wishes moving forward.</li> </ul> <h5>Supportive<sup>10</sup> - K. Liu</h5> <ul> <li>When I first started computer science in Y9, I honestly wasn't excited for the course as it seemed tedious. Fast forward 2 years, even though I'm not that good at coding, comp sci has become one of my favourite classes. I've learned so much in this class all thanks to you. Mr. Hoel, thanks for not only teaching me programming, but also for bringing lots of energy and a positive vibe to class. I'm going to miss you a lot. Congrats on your retirement and best wishes moving forward.</li> </ul> </div>"
    synonym = '<div class="positioning"> <h5>Meaning: Legendary</h5> <ol class="list-inline"> <li class="list-inline-item around">Teacher</li> <li class="list-inline-item around">Mentor</li> <li class="list-inline-item around">Coach</li> <li class="list-inline-item around">1999</li> <li class="list-inline-item around">Geography</li> <li class="list-inline-item around">Computer Science</li> <li class="list-inline-item around">Business</li> <li class="list-inline-item around">Design</li> <li class="list-inline-item around">English</li> <li class="list-inline-item around">IB</li> <li class="list-inline-item around">Hockey</li> <li class="list-inline-item around">Cross-Country</li> <li class="list-inline-item around">Cricket</li> <li class="list-inline-item around">Soccer</li> <li class="list-inline-item around">Comforting</li> <li class="list-inline-item around">Amazing</li> <li class="list-inline-item around">Inspiring</li> <li class="list-inline-item around">LEAFS</li> <li class="list-inline-item around">Impactful</li> <li class="list-inline-item around">Joyful</li> <li class="list-inline-item around">Understanding</li> <li class="list-inline-item around">Flexible</li> <li class="list-inline-item around">Minecraft</li> <li class="list-inline-item around">Positive</li> <li class="list-inline-item around">Presence</li> <li class="list-inline-item around">Guide</li> <li class="list-inline-item around">Cheerful</li> <li class="list-inline-item around">Charismatic</li> <li class="list-inline-item around">Supportive</li> <li class="list-inline-item around">Energetic</li> <li class="list-inline-item around">Enthusiastic</li> <li class="list-inline-item around">Eager</li> <li class="list-inline-item around">Awesome</li> <li class="list-inline-item around">Fun</li> <li class="list-inline-item around">There</li> <li class="list-inline-item around">are</li> <li class="list-inline-item around">no</li> <li class="list-inline-item around">amount</li> <li class="list-inline-item around">of</li> <li class="list-inline-item around">words</li> <li class="list-inline-item around">that</li> <li class="list-inline-item around">can</li> <li class="list-inline-item around">desribe</li> <li class="list-inline-item around">your</li> <li class="list-inline-item around">impact</li> </ol> <hr> <h5>Antonyms of Mark Hoel</h5> <ol class="list-inline"> <li class="list-inline-item around">Back left corner of room 122</li> <li class="list-inline-item around">Unpublished Google sites</li> </ol> </div>'
    $('body').html('<form id="refresh"><button type="submit" class="btn btn-light btn-lg btn-block">Search For New Word</button></form><div class="card" style="width: 410px; height: 550px; margin: auto;"> <div class="card-body" style="background-color: #FAF0E6;overflow: scroll;"> <h4 style="text-align: center; margin-bottom: 15px; margin-top: -10px;"><b>Mark Hoel</b></h4> <ul class="nav nav-tabs " id="myTab" role="tablist"> <li class="nav-item"> <a class="nav-link active" id="define-tab" data-toggle="tab" href="#define" role="tab" aria-controls="define" aria-selected="true">Define</a> </li> <li class="nav-item"> <a class="nav-link" id="synonym-tab" data-toggle="tab" href="#synonym" role="tab" aria-controls="synonym" aria-selected="false">Synonyms</a> </li> </ul> <div class="tab-content" id="myTabContent"> <div class="tab-pane fade show active" id="define" role="tabpanel" aria-labelledby="define-tab" style="background-color: white;"> '+define+' </div> <div class="tab-pane fade" id="synonym" role="tabpanel" aria-labelledby="synonym-tab" style="background-color: white;"> '+synonym+' </div> </div> </div> </div> <div class="loader-wrapper"><span class="loader"><span class="loader-inner"></span></span></div>');
    $(".loader-wrapper").fadeOut('slow');
};

//Go Back To Search
$('#refresh').on('submit', function(e) {
    e.preventDefault();
    window.location.reload();
});