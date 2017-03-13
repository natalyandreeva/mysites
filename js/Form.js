// Заметки для себя
// ДОБАВЛЯЯ СЮДА НОВЫЕ СТРАНЫ - НЕ ЗАБЫВАЕМ ДОПОЛНЯТЬ ПРАВИЛА ВАЛИДАЦИИ ДАННЫХ В СКРИПТЕ Responser.php
function Form() {
    this.country = "";
    this.status;
    // Длина телефонного номера для стран
	this.mobileDigits = {ua:12, ru:11, by:12, kz:11, lv:11, ge:12};
	// Длина ИНН и ID для стран: Казахстан, Латвия и Грузия пока указаны наугад
	this.INNDigits = {ua:10, ru:12, by:14, kz:14, lv:14, ge:14};
    this.mobileCodes = {};
    // Украина
    this.mobileCodes.ua = new Array (
        "+38038", "+38039", "+38050", "+38063", "+38066", "+38067", "+38068",  "+38073", "+38091",
        "+38092", "+38093", "+38094", "+38095", "+38096", "+38097", "+38098", "+38099"
    );

    // РФ
    this.mobileCodes.ru = new Array(
        "+790","+791","+792","+793","+7950","+7951","+7952","+7953","+796","+798","+7997"
    );

    // Латвия
    this.mobileCodes.lv = new Array(
        "+3712"
    );

    // Грузия
    this.mobileCodes.ge = new Array(
        "+9955","+9957"
    );

    // Казахстан
    this.mobileCodes.kz = new Array(
        "+7700","+7701","+7702","+7705","+7760","+7762","+7763","+7774","+7775","+7777"
    );

    // Белоруссия
    this.mobileCodes.by = new Array(
        "+375259","+37529","+37533","+37544"
    );

    this.selectCountry = function () {
        this.country = $('#country').val();
        if(this.country == '' || this.INNDigits[this.country] == 'undefined') {
            $('#INN').attr('maxlength', '14');
        } else {
            $('#INN').attr('maxlength', this.INNDigits[this.country]);
            $('#INN').val($('#INN').val().substring(0,this.INNDigits[this.country]));
        }
    };
    this.errors = 0;
}
Form.prototype = {
    hideErrors: function () {
        $('.jserror').hide();
        $('#mainForm input').removeClass('error');
        $('#mainForm select').removeClass('error');
        $('#mainForm textarea').removeClass('error');
    },
    addError: function(id) {
        var errorFieldId = '#error_' + id;
        var fieldId = '#' + id;
        $(errorFieldId).show();
        $(fieldId).addClass('error');
        this.errors++;
    },

    sendDataViaAjax: function () {
        $('#sendButton').attr("disabled", true);
        $('#sendButton').val("идет отправка...");
    
        var form = this;
        $.ajax({
            type: "POST",
            data: this.createAjaxDataObj(),
            url: 'lib/Responser.php',
            success: function( dataJson ) {
                if (window.console !== undefined)
                    console.log(dataJson);
                try {
                    var data = jQuery.parseJSON(dataJson);
                    form.processResponse(data);
                } catch (e){
                    console.info(e);
                    $('#no_answer').show();
                    $('#sendButton').attr("disabled", false);
                    $('#sendButton').val("ОТПРАВИТЬ ЗАЯВКУ");
                }

            },
            error: function( dataJson ) {
                $('#no_answer').show();
                $('#sendButton').attr("disabled", false);
                $('#sendButton').val("ОТПРАВИТЬ ЗАЯВКУ");
            }
        });
    },


    isNameValid: function(name) {
        return /^[A-Za-zА-Яа-яҐґІіЄєЎўЇїЁёӘәҒғҚқҢңӨөҰұІіĀāČčĒēĢģĪīĶķĻļŅņŌōŠšŪūŽžҬҭҦҧҚқҔҕГгҞҟӠӡҴҵҶҷЏџҲҳ'-]{2,}\s-?\s?[A-Za-zА-Яа-яҐґІіЄєЎўЇїЁёӘәҒғҚқҢңӨөҰұІіĀāČčĒēĢģĪīĶķĻļŅņŌōŠšŪūŽžҬҭҦҧҚқҔҕГгҞҟӠӡҴҵҶҷЏџҲҳ'-]{2,}\s(([A-Za-zА-Яа-яҐґІіЄєЎўЇїЁёӘәҒғҚқҢңӨөҰұІіĀāČčĒēĢģĪīĶķĻļŅņŌōŠšŪūŽžҬҭҦҧҚқҔҕГгҞҟӠӡҴҵҶҷЏџҲҳ'-]|\s){2,})+$/.test(name);
    },
    isEmailValid: function(email) {
        email = email.toLowerCase();
        if (email == '') {
             return false;
        }
        var email_array = email.split('.');

        if (email_array.length < 2) {
            return false;
        }

        var ext = email_array[email_array.length - 1];

        if (ext.length > 4 || /\d/.test(ext)) {
            return false
        }
        return /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(email);
    },
    isEmailValidt: function(email) {
        email = email.toLowerCase();
        var email_not_valid = [
        // ВНИМАНИЕ!!! Все ящики здесь нужно вводить в нижнем регистре.
        // ящики на час по состоянию на февраль 2015. Спасибо http://vbotinke.ru/user/yandex статья http://vbotinke.ru/blog/web/1021.html
//		'@shitmail.me', '@shitmail.org', '@crapmail.org', '@lackmail.net', '@alivance.com', '@walkmail.net', '@tempinbox.com', '@dingbone.com', '@fudgerub.com', '@lookugly.com',
//		'@smellfear.com', '@hmamail.com', '@wh4f.org', '@mt2014.com', '@thankyou2010.com', '@trash2009.com', '@mt2009.com', '@trashymail.com', '@mytrashmail.com', '@tempemail.net',
//		'@zipzaprap.beerolympics.se', '@junk.yourdomain.com', '@jetable.org', '@mailnesia.com', '@anobox.ru', '@7mail7.com', '@ee1.pl', '@ee2.pl', '@spam4.me', '@sharklasers.com',
//		'@grr.la', '@guerrillamail.biz', '@guerrillamail.com', '@guerrillamail.de', '@guerrillamail.net', '@guerrillamail.org', '@guerrillamailblock.com', '@trbvm.com', '@mailinator.com',
//		'@imgof.com', '@yopmail.com', '@yopmail.net', '@cool.fr.nf', '@jetable.fr.nf', '@nospam.ze.tc', '@nomail.xl.cx', '@mega.zik.dj',
//		'@speed.1s.fr', '@courriel.fr.nf', '@moncourrier.fr.nf', '@monemail.fr.nf', '@monmail.fr.nf', '@maildrop.cc', '@fakeinbox.com', '@cuvox.de', '@armyspy.com', '@dayrep.com', '@einrot.com',
//		'@fleckens.hu', '@gustr.com', '@jourrapide.com', '@rhyta.com', '@superrito.com', '@teleworm.us', '@ce.mintemail.com', '@voidbay.com', '@dropmail.me', '@discard.email', '@discardmail.com', '@discardmail.de',
//		'@spambog.com', '@spambog.de', '@spambog.ru', '@cachedot.net', '@mynetstore.de', '@0815.ru', '@hulapla.de', '@s0ny.net', '@teewars.org', '@nonspam.eu', '@nonspammer.de', '@spamstack.net', '@bundes-li.ga',
//		'@freundin.ru', '@pfui.ru', '@0815.su', '@hartbot.de', '@a45.in', '@sweetxxx.de', '@noref.in', '@loadby.us', '@manifestgenerator.com', '@bund.us', '@germanmails.biz', '@fiifke.de', '@showslow.de',
//		'@watchever.biz', '@webuser.in', '@incognitomail.org', '@trashmail.com', '@trashmail.me', '@trashmail.at', '@trash-mail.at', '@rcpt.at', '@kurzepost.de', '@wegwerfmail.de', '@wegwerfmail.net', '@wegwerfmail.org',
//		'@objectmail.com', '@proxymail.eu', '@deadaddress.com', '@spamgourmet.com', '@dispostable.com', '@meltmail.com', '@tempsky.com', '@eyepaste.com', '@nowmymail.com', '@20mail.it', '@emailsensei.com',
//		'@forward.cat', '@mailcatch.com', '@easytrashmail.com', '@ineec.net', '@tmpeml.info', '@insorg-mail.info', '@maildu.de', '@e4ward.com', '@dontmail.net', '@sofimail.com', '@no-spam.ws', '@explodemail.com',
//		'@1usemail.com', '@q314.net', '@hideme.be', '@dodsi.com', '@one-time.email', '@tempemail.org', '@anonymbox.com', '@mailismagic.com', '@mailinator.com', '@mailinator2.net', '@trash-me.com', '@re-gister.com',
//		'@trash-me.com', '@you-spam.com', '@fake-box.com', '@opentrash.com', '@flurred.com', '@zetmail.com', '@tryalert.com', '@tafmail.com', '@grandmamail.com', '@getairmail.com', '@anappthat.com', '@vomoto.com',
//		'@abyssmail.com', '@boximail.com', '@eelmail.com', '@clrmail.com', '@6paq.com', '@bigprofessor.so', '@thisisnotmyrealemail.com', '@spamherelots.com', '@uggsrock.com', '@emailtemporario.com.br', '@spam.la',
//		'@sogetthis.com', '@spamcorptastic.com', '@spamsphere.com', '@owlpic.com', '@incognitomail.net', '@lhsdv.com', '@10mail.org', '@pwrby.com', '@qisoa.com', '@flurre.com', '@flurred.ru', '@mailspeed.ru',
//		'@my10minutemail.com',
        // ошибочные или абсолютно левые домены. Всё что ниже по сути либо опечатки, либо неумышленно указываются из-за неопытности в компах и интернетах
        '@com.ua','@kis.ru', '@com.ru','@mail.com.ua','@mail.com.ru','@net.ua','@net.ru', '@mail.com', '@example.com', '@sitemail.com', '@site.com','@digmir.net',
        // GMAIL.COM
        '@gmail.ru', '@qmail.ua', '@gmail.ua', '@qmail.com', '@gmeil.com', '@gmil.com', '@jmail.com', '@gmai.com','@gmaii.com',
        // YANDEX
        '@yndex.ua', '@yndex.ru', '@ya.ua', '@yandeks.ru','@yandeks.ua','@uandex.ru','@jandex.ua','@jandex.ru',
        // MAIL.RU
		'@mfil.ru', '@meil.ru', '@mil.ru','@maii.ru','@br.ru','@mai.ru', '@dk.ru','@list.ua', '@maul.ru','@masl.ru','@maik.ru','@maik.ua'];
		var from  = email.search('@');
		var to    = email.length;
		var new_email = email.substring(from,to);
        var domain_not_valid = [
        // ошибочные зоны
        '.ry','.cjm','.orq','.ya','.ri','.kom'];

        for(var cx=0; cx < email_not_valid.length; cx++){
	        if(email_not_valid[cx] == new_email) {
                return false;
            }
	    }

        for (var cx=0; cx < domain_not_valid.length; cx++){
            var from = to - domain_not_valid[cx].length;
            var email_domain =  email.substring(from,to);
            if (email_domain == domain_not_valid[cx]){
                return false;
            }
        }

        return true;
    },
    isRussianINNValid: function(inn) {
        return /^\d{12}$/.test(inn);
    },
    isUkrainianINNValid: function(inn) {
        return /^\d{10}$/.test(inn);
    },
    isMobilePhoneValid: function(number, country) {
        var ok = false;
        for(var i = 0; i < this.mobileCodes[country].length; i++)
            if(number.indexOf(this.mobileCodes[country][i]) + 1)
                ok = true;

        if(ok) {

            var pattern = new RegExp('^\\+\\d{'+this.mobileDigits[country]+'}$');
            return pattern.test(number);
        }
        return ok;
    },
    isCountryMobilePhoneValid: function(number) {
        if (this.country == '') {
            return false;
        }
        return this.isMobilePhoneValid(number, this.country);
    },
    isYearLeap: function(year){
        if(year%400 == 0)return true;
        if(year%100 == 0)return false;
        if(year%4 == 0)return true;
        return false;
    },
    returnDaysFromJanTillMonth: function(month, isYearLeap){
        var days = 0;
        if(month>1)days+=31;
        if(month>2 && !isYearLeap)days+=28;
        if(month>2 &&  isYearLeap)days+=29;
        if(month>3)days+=31;
        if(month>4)days+=30;
        if(month>5)days+=31;
        if(month>6)days+=30;
        if(month>7)days+=31;
        if(month>8)days+=31;
        if(month>9)days+=30;
        if(month>10)days+=31;
        if(month>11)days+=30;
        return days;
    },
    isAdult: function(day, month, year) {
        var today = new Date();
        var birthDate = new Date();
        birthDate.setDate(day);
        birthDate.setMonth(month-1);
        birthDate.setYear(year);
//      birthDate.setTime(Date.parse(year+'/'+month+'/'+day));
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 17;
    },
    compareINNandDateOfBirth: function(inn5, d, m, y){
        y = parseInt(y,10); d = parseInt(d,10);  // переводим в integer
        var daysFrom1900fromYears = (y - 1900) * 365 + Math.ceil((y - 1900)/4) - 1; // находим количество дней от 01.01.1900 до 01.01.yyyy
        var daysFrom1900fromMonthes = this.returnDaysFromJanTillMonth(m, this.isYearLeap(y)); // находим количество дней от 01.01 до 01.mm
        var daysFrom1900 = daysFrom1900fromYears - (-daysFrom1900fromMonthes) + d; // находим общее количество дней от 01.01.1900 до dd.mm.yyyy
		console.info(daysFrom1900);
        if (daysFrom1900 == inn5)return true; // если полученное количество дней равно первым 5 цифрам ИНН -> true
        return false;
    },
    detectCountry: function (number) {
        var self = this;
        self.country = '';
        $.each( this.mobileCodes, function( key, value ) {
            if (self.isMobilePhoneValid(number, key)) {
                self.country = key;
            }
        });
        return self.country;
    }
};
Form.prototype.constructor = Form;

function FormIndex() {}
FormIndex.prototype = new Form();

FormIndex.prototype.createEventHandlers = function() {
    var form = this;

    $('#status, #region, #country').bind('click', function(e){
        $('#tip > span, #tip_status > .jserror').hide();
        form.hideErrors();
    });

    $('#status, #region, #country').bind('change keypress keydown keyup', function(e){
        $('#tip > span, #money select, #tip_status > .jserror').hide();

        form.hideErrors();

        $('#region_' + form.country).hide();
        form.selectCountry();
        $('#region_' + form.country).show();

        switch( $('#status').val() ) {
            case "borrower":
                $('#income_' + form.country).hide();
                $('#borrower').show();
                $('#sum_' + form.country).show();
                break;
            case "donor":
                $('#donor').show();
                $('#income_' + form.country).show();
                break;
            case "broker":
                $('#partner').show();
                if(form.country != '')
                    $('#recruit').show();
                break;
        }
    });

    $('#region, #country, #money, #mobilePhone, #INN, #birthDay, #birthMonth, #birthYear, #name, #email').bind('click', function(){
        form.hideErrors();
    });
}
FormIndex.prototype.checkForm = function() {
    this.hideErrors();

    if(this.country == '') {
        this.addError("country");
        return false;
    }

    if($('#region_' + this.country).val() == 0){
        this.addError('region');
        this.addError('region_' + this.country);
    }

    this.status = $('#status').val();
    switch( this.status ) {
        case "borrower":
            if($('#sum_' + this.country).val() == 0){
                this.addError("sum_" + this.country);
            }
            break;
        case "donor":
            if($('#income_' + this.country).val() == 0){
                this.addError("income_" + this.country);
            }
            break;
        case "broker":
            if( $('#recruit').val() == 0 )
                this.addError("recruit");
            break;
    }

    if( ! this.isNameValid( $('#name').val() || $('#name').val().length < 8) )
        this.addError("name");
    if( ! this.isEmailValid( $('#email').val() ) )
        this.addError("email");
    if( ! this.isEmailValidt( $.trim($('#email').val()) ) )
        this.addError("email");		

	
    if( $('#birthDay').val() == 0 || $('#birthMonth').val() == 0 || $('#birthYear').val() == 0)
        this.addError("INN");
    if ($('#birthDay').val() == 0)$('#birthDay').addClass('error');
    if ($('#birthMonth').val() == 0)$('#birthMonth').addClass('error');
    if ($('#birthYear').val() == 0)$('#birthYear').addClass('error');



// Существует два типа уведомления об ошибках введённых данных. 
// Одна обобщённая, на случай если мы не знаем страну клиента, а вторая индивидуальная, на случай если знаем страну
// Благодаря этому, в случае если мы знаем страну, можно показывать более чёткую ошибку вместо обобщённого <span id="error_mobilePhone" class="jserror" style="display:none;">МОБИЛЬНЫЙ в формате +XXX00000000</span>
// Можно показывать что-то вроде "<span id="error_mobilePhone_lv"  class="jserror" style="display:none">MOBILE formāts +371ХХХХХХХХ</span>"

    switch( this.country ) {
        case "ru":
                if( ! this.isCountryMobilePhoneValid( $('#mobilePhone').val()) ) {
                    this.addError("mobilePhone");
                    this.addError("mobilePhone_ru");
                }
                if( ! this.isRussianINNValid( $('#INN').val() ))
                    this.addError("INN");
            break;
        case "ua":
                var INN5 = document.getElementById('INN').value.substr(0, 5);
                if( ! this.isCountryMobilePhoneValid( $('#mobilePhone').val()) ) {
                    this.addError("mobilePhone");
                    this.addError("mobilePhone_ua");
                }
                if( ! this.isUkrainianINNValid( $('#INN').val() ))
                    this.addError("INN");
                else if( ! this.compareINNandDateOfBirth(INN5, $('#birthDay').val(), $('#birthMonth').val(), $('#birthYear').val() ))
                    this.addError("INN");
            break;
    }

    if (!this.isAdult($('#birthDay').val(), $('#birthMonth').val(), $('#birthYear').val())) {
        this.addError("Adult");
    }

    if(this.errors == 0){
        this.sendDataViaAjax();
    }
    this.errors = 0;
}

FormIndex.prototype.createAjaxDataObj = function() {
    var elemsToSend = [
        "status", "region", "country", "recruit",
        "name", "mobilePhone", "email", "INN", "birthDay", "birthMonth", "birthYear"
    ];
    var data = {};

    for(var ind in elemsToSend) {
        if (elemsToSend[ind] == "region") {
            data[elemsToSend[ind]] = $('#' + elemsToSend[ind] + '_' + this.country).val();
        } else {
            data[elemsToSend[ind]] = $('#' + elemsToSend[ind]).val();
        }
    }
    if(this.status == "borrower"){
            data.sum = $('#sum_' + this.country).val();
    }
    if(this.status == "donor"){
            data.income = $('#income_' + this.country).val();
    }
    data.type = "index";

    return data;
}
FormIndex.prototype.processResponse = function (data) {
    $('#error_php_INN').hide();
    $('#mail_take').hide();

    if(data.response == "ok") {
        $('#formDiv').hide();
        $('#responseYes').show();
        $('#e-mail').html($('#email').val());
		if($('#status').val() == "borrower"){
			goog_report_conversion();
		}
    } else {
        if(data.response == "notUnique") {
            $('#formDiv').hide();
            $('#mail_take').show();
        }
        if(data.response == "db") {
            $('#formDiv').hide();
            $('#responseNo').show();
        }
        if(data.response == "php_INN") {
            $('#error_php_INN, #formDiv').show();
            $('#responseNo').hide();
        }

        if(data.response == "php_data") {
        	$('#formDiv').hide();
            $('#mail_take').show();
            $('#responseNo').hide();
        }
        $('#sendButton').attr("disabled", false);
        $('#sendButton').val("ОТПРАВИТЬ ЗАЯВКУ");
    }

};

function FormFeedback() {}
FormFeedback.prototype = new Form();

FormFeedback.prototype.createEventHandlers = function() {
    var form = this;

    $('#subject').bind('change', function(){
        form.hideErrors();
        if ($(this).val() == 'change_sum') {
            $('#comments').hide();
            if (form.country != '') {
                $('#sum_' + form.country).show();
            } else {
                $('#sum_d').show();
            }
        } else {
            $('#comments').show();
            $('#sum_d').hide();
            if (form.country != '') {
                $('#sum_' + form.country).hide();
            }
        }
    });

    $('#sum, #email, #comments').bind('click', function(){
        form.hideErrors();
    });

    $('#mobilePhone').bind('keyup', function(){
        form.hideErrors();
        if ($('#subject').val() == 'change_sum') {
            if (form.country != '') {
                $('#sum_' + form.country).hide();
                $('#sum_d').show();
            }
            var country = form.detectCountry($(this).val());
            if (country != '' && $('#subject').val() == 'change_sum') {
                $('#sum_' + country).show();
                $('#sum_d').hide();
            }
        }
        form.detectCountry($(this).val());
    });

}

FormFeedback.prototype.checkForm = function() {
    this.hideErrors();

    var subject = $('#subject').val();

    if( $('#subject').val() == "none")
        this.addError("subject");
    if( ! this.isEmailValid( $('#email').val() ) )
        this.addError("email");
		
    if( $('#mobilePhone').val() == '' || !this.isCountryMobilePhoneValid( $('#mobilePhone').val()))
        this.addError("mobilePhone");

    if ($('#subject').val() == 'change_sum') {
        if( $('#sum_' + this.country).val() == 0) {
            this.addError('sum_' + this.country);
            this.addError('sum');
        }
    } else {
        if( $('#comments').val() == "" || $('#comments').val().length < 5)
            this.addError("comments");
    }
    if( ! this.isEmailValidt( $('#email').val() ) )
        this.addError("email");

    if( ! this.errors){
        this.sendDataViaAjax();
    }
    this.errors = 0;
}
FormFeedback.prototype.createAjaxDataObj = function() {
    var elemsToSend = [
        "subject", "email", "mobilePhone", "comments"
    ];
    var data = {};
    for(var ind in elemsToSend) {
        data[elemsToSend[ind]] = $('#' + elemsToSend[ind]).val();
    }
    if ($('#subject').val() == 'change_sum') {
        data.sum = $('#sum_' + this.country).val();
    }

    data.type = "feedback";
    return data;
}
FormFeedback.prototype.processResponse = function (data) {
    $('#formDiv').hide();
    if(data.response == "ok"){
		$('#responseYes').show();
        $('#e-mail').html($('#email').val());
		if($('#status').val() == "borrower"){
			goog_report_conversion();
		}
	}
    if (typeof data.response.old_sum != 'undefined') {
        $('#changeSum').show();
        $('#old_sum').html(data.response.old_sum);
        $('#new_sum').html(data.response.new_sum);
    }
    if(data.response == "fail" || data.response == "allError"){
        $('#allError').show();
    }

    if(data.response == "notfound"){
        $('#notfound').show();
    }

    if(data.response == "otkazano"){
        $('#otkazano').show();
    }
};
FormFeedback.prototype.reopen = function (el) {
    $('#formDiv').show();
    $('#sendButton').attr("disabled", false);
    $('#sendButton').val("ОТПРАВИТЬ ВОПРОС");
    $(el).parent().parent().hide();
}
FormIndex.prototype.reopen = function (el) {
    $('#formDiv').show();
    $('#sendButton').attr("disabled", false);
    $('#sendButton').val("ОТПРАВИТЬ ЗАЯВКУ");
    $(el).parent().parent().hide();
}