//

// Заметки для себя
// ДОБАВЛЯЯ СЮДА НОВЫЕ СТРАНЫ ИЛИ ТЕЛЕФОННЫЕ КОДЫ - НЕ ЗАБЫВАЕМ ДОПОЛНЯТЬ ПРАВИЛА ВАЛИДАЦИИ ДАННЫХ НА СТОРОНЕ СЕРВЕРА В СКРИПТАХ Proc**.php и SMSSender***
// Скрипт пока полностью работоспособен только для Украины, РФ. Вроде готов но не тестировался для Белоруссии
function Form() {
    this.action = "lib/fb.php";
    this.country = "";
    this.status;
    // Длина телефонного номера для стран
    this.mobileDigits = {ua: 12, ge: 12, by: 12, kz: 11, lv: 11, ru: 11, md: 11};
    // Длина ИНН и ID для стран: Казахстан, Латвия, Грузия и Молдавия пока указаны наугад
    this.INNDigits = {ua: 10, ru: 12, by: 14, kz: 14, lv: 14, ge: 14, md: 14};
    this.mobileCodes = {};
    // Украина
    this.mobileCodes.ua = new Array(
    	// Точные коды мобильных операторов
           "+7700", "+7701", "+7702", "+7705", "+7760", "+7762", "+7763", "+7774", "+7775", "+7777"
            );

    // РФ
    this.mobileCodes.ru = new Array(
    	// Пока указал сжатые коды. Подробные и точные тут kody.su/mobile/ (всего примерно 73 кода)
            "+790", "+791", "+792", "+793", "+7941", "+795", "+796", "+797", "+798", "+799"
            );

    // Латвия
    this.mobileCodes.lv = new Array(
            "+3712"
            );

    // Грузия
    this.mobileCodes.ge = new Array(
            "+9955", "+9957"
            );

    // Казахстан
    this.mobileCodes.kz = new Array(
            "+7700", "+7701", "+7702", "+7705", "+7760", "+7762", "+7763", "+7774", "+7775", "+7777"
            );

    // Белоруссия
    this.mobileCodes.by = new Array(
            "+375259", "+37529", "+37533", "+37544"
            );

    // Молдавия
    this.mobileCodes.md = new Array(
            "+3736", "+3737"
            );

    /**
     * Определяет принадлежит ли юзер к стране
     * @param arr массив телефоных номеров
     * @returns {boolean}
     */
    this.isCountryMobile = function (arr) {
        var phone_nubber = $('#mobilePhone').val();

        for (var i = 0; i < arr.length; i++) {
            if (phone_nubber.indexOf(arr[i]) != -1) {
                return true;
            }
        }
        return false;
    };



    this.selectCountry = function () {
        this.country = $('#country').val();
        if (this.country == '' || this.INNDigits[this.country] == 'undefined') {
            $('#INN').attr('maxlength', '14');
        } else {
            $('#INN').attr('maxlength', this.INNDigits[this.country]);
            $('#INN').val($('#INN').val().substring(0, this.INNDigits[this.country]));
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
    addError: function (id) {
        var errorFieldId = '#error_' + id;
        var fieldId = '#' + id;
        $(errorFieldId).show();
        $(fieldId).addClass('error');
        this.errors++;
    },
    sendDataViaAjax: function () {
        $('#sendButton').prop("disabled", true);
        $('#sendButton2').prop("disabled", true);
        $('#sendButton').data("old-val",$('#sendButton').val());
        $('#sendButton').val("идет отправка...");
        //console.log(this.createAjaxDataObj());
        //return false;
        var form = this;
        $.ajax({
            type: "POST",
            data: this.createAjaxDataObj(),
            url: this.action,
            success: function (dataJson) {
                if (window.console !== undefined)
                    console.log(dataJson);
                try {
                    var data = jQuery.parseJSON(dataJson);
                    form.processResponse(data);
                } catch (e) {
                    console.info(e);
                    $('#formDiv').hide();
                    $('#no_answer').show();
                    $('#sendButton').prop("disabled", true);
                    $('#sendButton2').prop("disabled", true);
                    $('#sendButton').val($('#sendButton').data("old-val"));
                }

            },
            error: function (dataJson) {
                $('#formDiv').hide();
                $('#no_answer').show();
                $('#sendButton').prop("disabled", true);
                $('#sendButton2').prop("disabled", true);
                $('#sendButton').val($('#sendButton').data("old-val"));
            }
        });
    },
// Валидация поля ФИО
    isNameValid: function (name) {
        return /^[A-Za-zА-Яа-яҐґІіЄєЎўЇїЁёӘәҒғҚқҢңӨөҰұІіĀāČčĒēĢģĪīĶķĻļŅņŌōŠšŪūŽžҬҭҦҧҚқҔҕГгҞҟӠӡҴҵҶҷЏџҲҳ'-]{2,}\s-?\s?[A-Za-zА-Яа-яҐґІіЄєЎўЇїЁёӘәҒғҚқҢңӨөҰұІіĀāČčĒēĢģĪīĶķĻļŅņŌōŠšŪūŽžҬҭҦҧҚқҔҕГгҞҟӠӡҴҵҶҷЏџҲҳ'-]{2,}\s(([A-Za-zА-Яа-яҐґІіЄєЎўЇїЁёӘәҒғҚқҢңӨөҰұІіĀāČčĒēĢģĪīĶķĻļŅņŌōŠšŪūŽžҬҭҦҧҚқҔҕГгҞҟӠӡҴҵҶҷЏџҲҳ'-]|\s){2,})+$/.test(name);
    },
//изменить правиписание
    checkName: function (name) {


        // Только если последнее
        var latName = name.split(' ');
        if (latName[2] != undefined && latName[2].indexOf('иева') != -1) {
            latName[2] = latName[2].replace('иева', 'иевна');
            name = latName[0] + ' ' + latName[1] + ' ' + latName[2];
        }
        name = name.replace('Генад', 'Геннад');
        name = name.replace('евичь', 'евич');
        name = name.replace('йовичь', 'йович');
        name = name.replace('ныч', 'ович');
        name = name.replace('выч', 'вич');
        name = name.replace('вичь', 'вич');
        name = name.replace('євичь', 'йович');
        name = name.replace('євич', 'йович');
// Закоментировал спорное правило в связи с существованием фамилии васильева...
//        name = name.replace('ьева', 'ьевна');
        name = name.replace('Юриевич', 'Юрьевич');
        name = name.replace('Юриевна', 'Юрьевна');
        name = name.replace('Валериевич', 'Валерьевич');
        name = name.replace('Валериевна', 'Валерьевна');
        name = name.replace('Анатолиевич', 'Анатольевич');
        name = name.replace('Анатолиевна', 'Анатольевна');
        name = name.replace('Евгениевич', 'Евгеньевич');
        name = name.replace('Евгениевна', 'Евгеньевна');
        name = name.replace('Василиевич', 'Васильевич');
        name = name.replace('Василиевна', 'Васильевна');
        name = name.replace('Геннадиевич', 'Геннадьевич');
        name = name.replace('Геннадиевна', 'Геннадьевна');
        name = name.replace('Дмитревич', 'Дмитриевич');
        name = name.replace('Дмитревна', 'Дмитриевна');
        name = name.replace('Владимерович', 'Владимирович');
        name = name.replace('Свитлана', 'Светлана');
        name = name.replace('Иванивна', 'Ивановна');
        name = name.replace("В'ячеславович", "Вячеславович");
        name = name.replace("Сергеивна", "Сергеевна");
        name = name.replace("Наташа", "Наталья");
// Пока не знаю что делать и просто оставлю это здесь
// ВСЕ украинские имена с апострофом
// Мар'яна, Мар'ян, Валер'ян, Дем'ян, Лук'ян, В'ячеслав
// В Украине есть Фамилии с апострофом и естественно отчества


        $('#name').val(name);
    },
// Валидация поля ЭМАИЛ
    isEmailValid: function (email) {

        email = email.toLowerCase();

        if (email == '') {
            return false;
        }




        // Длина маила не более 4 симовло
        var last_point = email.lastIndexOf('.');
        var last_sobaka = email.lastIndexOf('@');
        var domain_zone = email.substr(last_point);
        var l_email = email.substr(0, last_sobaka);
        var r_email = email.substr(+last_sobaka + 1);

        // Проверяем на цифры в доменном имени
        if(r_email.indexOf('0') >= 0){
            return false;
        }
        if(r_email.indexOf('1') >= 0){
            return false;
        }
        if(r_email.indexOf('2') >= 0){
            return false;
        }
        if(r_email.indexOf('3') >= 0){
            return false;
        }
        if(r_email.indexOf('4') >= 0){
            return false;
        }
        if(r_email.indexOf('5') >= 0){
            return false;
        }
        if(r_email.indexOf('6') >= 0){
            return false;
        }
        if(r_email.indexOf('7') >= 0){
            return false;
        }
        if(r_email.indexOf('8') >= 0){
            return false;
        }
        if(r_email.indexOf('9') >= 0){
            return false;
        }

        // Минимальная длина маила для некторых почтовых ящиков
        if (r_email.indexOf('i.ua') != -1 && l_email.length < 6)
            return false;
        if (r_email.indexOf('ro.ru') != -1 && l_email.length < 6)
            return false;
        if (r_email.indexOf('r0.ru') != -1 && l_email.length < 6)
            return false;
        if (r_email.indexOf('rambler.ru') != -1 && l_email.length < 6)
            return false;
        if (r_email.indexOf('lenta.ru') != -1 && l_email.length < 6)
            return false;
        if (r_email.indexOf('myrambler.ru') != -1 && l_email.length < 6)
            return false;
        // У гугла минималка сейчас 6 (но неизвестно как было раньше) без точек и тире
        if (r_email.indexOf('gmail.com') != -1 && l_email.length < 5)
            return false;
        if (r_email.indexOf('mail.ru') != -1 && l_email.length < 3)
            return false;
        if (r_email.indexOf('mail.ua') != -1 && l_email.length < 3)
            return false;
        if (r_email.indexOf('inbox.ru') != -1 && l_email.length < 3)
            return false;
        if (r_email.indexOf('list.ru') != -1 && l_email.length < 3)
            return false;


        // Два сивола подряд
        if (
                (
                        r_email.indexOf('ya.ru') != -1 ||
                        r_email.indexOf('yandex') != -1 ||
                        r_email.indexOf('mail.ru') != -1 ||
                        r_email.indexOf('bk.ru') != -1 ||
                        r_email.indexOf('mail.ua') != -1 ||
                        r_email.indexOf('inbox.ru') != -1 ||
            			r_email.indexOf('gmail.com') != -1 ||
                        r_email.indexOf('list.ru') != -1
                        ) &&
                (
                        l_email.indexOf('..') != -1 ||
                        l_email.indexOf('-.') != -1 ||
                        l_email.indexOf('.-') != -1 ||
                        l_email.indexOf('_.') != -1 ||
                        l_email.indexOf('._') != -1 ||
                        l_email.indexOf('--') != -1 ||
                        l_email.indexOf('-_') != -1 ||
                        l_email.indexOf('_-') != -1 ||
                        l_email.indexOf('__') != -1
                        )
                )
            return false;

        // Все вариации яндекс ящиков (@ya.ru, @yandex.net, @yandex.kz, @yandex.ua, @ yandex.ru, @yandex.com) не могут содержать нижний тире «_» в адресе
        if (
                (
                        r_email.indexOf('ya.ru') != -1 ||
                        r_email.indexOf('yandex') != -1
                        ) &&
                (
                        l_email.indexOf('_') != -1
                        )
                )
            return false;

        // доменное имя не может быть из одной буквы, за исключением I.UA и A.UA, другие же сервисы (типа x.com) это ошибка
        if (r_email != undefined) {
            if (r_email.indexOf('i.ua') == -1 && r_email.indexOf('a.ua') == -1) {
                var split_email = r_email.split('.');
                if (split_email[0].length == 1)
                    return false;
            }
        }


        if (l_email[0] != undefined) {
            // Проверка перовго символа
            if (
                    l_email[0].indexOf('.') != -1 ||
                    l_email[0].indexOf('-') != -1 ||
                    l_email[0].indexOf('_') != -1
                    )
                return false;

            // Проверка последнего симовла
            if (
                    l_email[l_email.length - 1].indexOf('.') != -1 ||
                    l_email[l_email.length - 1].indexOf('-') != -1 ||
                    l_email[l_email.length - 1].indexOf('_') != -1
                    )
                return false;





        }



        // Если в майле две точки отсекать таки майлы
        if (/\..*?\./.test(r_email))
            return false;



        if (domain_zone.length > 4)
            return false;
        if (domain_zone == '.org' || domain_zone == '.xxx' || domain_zone == '.biz')
            return false;



        if (!validateEmail(email)) {
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
    // Только не НА
    isEmailNotOn: function (email) {

        email = email.toLowerCase();

        // Длина маила не более 4 симовло
        var last_point = email.lastIndexOf('.');
        var last_sobaka = email.lastIndexOf('@');
        var domain_zone = email.substr(last_point);
        var l_email = email.substr(0, last_sobaka);
        var r_email = email.substr(+last_sobaka + 1);

        if(r_email == 'yahoo.com'){
            return 'yahoo.com';
        }
        if(r_email == 'ua.fm'){
            return 'ua.fm';
        }
        if(r_email == 'my.com'){
            return 'my.com';
        }
        if(r_email == 'mail.ua'){
            return 'mail.ua';
        }

        return false;
    },
    /**
     * Удаляет все пробелы, и плюс на страте
     * @param from
     * @returns {*}
     */
    deleteSpaсeAndPlus: function (from) {
        if (from) {
            from = from.replace(/ /gi, '');
            if (from[0] == '+') {
                from = from.substr(1);
            }

            return from
        } else {
            return from
        }

    },
    isEmailValidByFnone: function (email) {
        // Только яндекс TODO: Яндекс ящики начинающиеся с номеров телефонов

        email = email.toLowerCase();


        var last_point = email.lastIndexOf('.');
        var last_sobaka = email.lastIndexOf('@');
        var domain_zone = email.substr(last_point);
        var l_email = email.substr(0, last_sobaka);
        var r_email = email.substr(+last_sobaka + 1);


        if (r_email.indexOf('yandex') || r_email.indexOf('ya.ru')) {

            // Валидация email если содержит телефон
            if (
                    /^38/.test(l_email) ||
                    /^375/.test(l_email) ||
                    /^99/.test(l_email) ||
                    /^79/.test(l_email) ||
                    /^371/.test(l_email) ||
                    /^77/.test(l_email)
                    ) {
                // Провремя что в маили только фиры
                if (/[0-9]{11,13}/.test(l_email)) {
                    return false;
                }
            }

        }

        return true;

    },
    isEmailValidyou: function (email) {
        email = email.toLowerCase();
        //То есть если клиент на сайте example.com подаёт заявку, то все ящики с домена @example.com нельзя использовать в качестве ящика.
        var doman_email = email.split('@');
        if (doman_email[1] == window.location.host) {
            return false
        }
        var email_not_you = [
            // Откровенные неверные и/или лживые ящики
            'mail@mail.ru', 'yandex@yandex.ru', 'icred@mail.ru', 'free.credit@mail.ru'
        ];
        for (var cx = 0; cx < email_not_you.length; cx++) {
            if (email_not_you[cx] == email) {
                return false;
            }
        }
        return true;
    },
    isEmailValidt: function (email) {
        email = email.toLowerCase();
        var email_not_valid = [
            // ВНИМАНИЕ!!! Все ящики здесь нужно вводить в нижнем регистре.
            // ящики на час по состоянию на февраль 2015. Спасибо http://vbotinke.ru/user/yandex статья http://vbotinke.ru/blog/web/1021.html за дополнения в мой список
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
//		'@my10minutemail.com', 'anonbox.net', 'koszmail.pl', 'uu1.pl', 'squizzy.de',
            // ошибочные или абсолютно левые домены. Всё что ниже по сути либо опечатки, либо неумышленно указываются из-за неопытности в компах и интернетах
            '@com.ua', '@ua.com', '@kis.ru', '@com.ru', '@emeil.ru', '@imeil.ua', '@mail.com.ua', '@mail.com.ru', '@net.ua', '@net.ru', '@mail.com',
            '@example.com', '@sitemail.com', '@site.com', '@digmir.net', '@ramler.ru', '@biqmir.net', '@icloud.ru',
            // GMAIL.COM
            '@gmail.ru', '@qmail.ua', '@gmail.ua', '@gmal.com', '@qmail.com', '@gmeil.com', '@gmil.com', '@jmail.com', '@gmai.com', '@gmaii.com',
            // YANDEX
            '@yndex.ua', '@yndex.ru', '@ya.ua', '@yandeks.ru', '@yandeks.ua', '@uandex.ru', '@jandex.ua', '@jandex.ru',
            // MAIL.RU
            '@mfil.ru', '@meil.ru', '@meil.ua', '@mil.ru', '@mael.ru', '@inboks.ru', '@maii.ru', '@br.ru', '@mai.ru', '@mal.ru', '@dk.ru', '@list.ua', '@maul.ru', '@masl.ru', '@maik.ru', '@maik.ua', '@mai.ua', '@ail.ru', '@iist.ru'];
        var from = email.search('@');
        var to = email.length;
        var new_email = email.substring(from, to);
        var domain_not_valid = [
            // ошибочные зоны
            '.ry', '.cjm', '.orq', '.ya', '.ri', '.kom', '.con'];

        for (var cx = 0; cx < email_not_valid.length; cx++) {
            if (email_not_valid[cx] == new_email) {
                return false;
            }
        }


        for (var cx = 0; cx < domain_not_valid.length; cx++) {
            var from = to - domain_not_valid[cx].length;
            var email_domain = email.substring(from, to);
            if (email_domain == domain_not_valid[cx]) {
                return false;
            }
        }


        return true;
    },
// Валидация поля ИНН (тут нехватает ещё: Latvia, Georgia, Kazakhstan, Byelorussia, Moldova)
    isRussianINNValid: function (inn) {
        return /^\d{12}$/.test(inn);
    },
    isUkrainianINNValid: function (inn) {
        return /^\d{10}$/.test(inn);
    },
// Валидация поля МОБИЛЬНЫЙ НОМЕР исходя из страны указанной клиентом
    isMobilePhoneValid: function (number, country) {
        var ok = false;
        for (var i = 0; i < this.mobileCodes[country].length; i++)
            if (number.indexOf(this.mobileCodes[country][i]) + 1)
                ok = true;

        if (ok) {

            var pattern = new RegExp('^\\+\\d{' + this.mobileDigits[country] + '}$');
            return pattern.test(number);
        }
        return ok;
    },
    isCountryMobilePhoneValid: function (number) {
        if (this.country == '') {
            return false;
        }
        return this.isMobilePhoneValid(number, this.country);
    },
    is7DigitsMobilePhoneValid: function (number) {
        number = number + '';
        if (number.indexOf('0000000') != -1)
            return false;
        if (number.indexOf('1111111') != -1)
            return false;
        if (number.indexOf('2222222') != -1)
            return false;
        if (number.indexOf('3333333') != -1)
            return false;
        if (number.indexOf('4444444') != -1)
            return false;
        if (number.indexOf('5555555') != -1)
            return false;
        if (number.indexOf('6666666') != -1)
            return false;
        if (number.indexOf('7777777') != -1)
            return false;
        if (number.indexOf('8888888') != -1)
            return false;
        if (number.indexOf('9999999') != -1)
            return false;
        return true;
    },
    isYearLeap: function (year) {
        if (year % 400 == 0)
            return true;
        if (year % 100 == 0)
            return false;
        if (year % 4 == 0)
            return true;
        return false;
    },
    returnDaysFromJanTillMonth: function (month, isYearLeap) {
        var days = 0;
        if (month > 1)
            days += 31;
        if (month > 2 && !isYearLeap)
            days += 28;
        if (month > 2 && isYearLeap)
            days += 29;
        if (month > 3)
            days += 31;
        if (month > 4)
            days += 30;
        if (month > 5)
            days += 31;
        if (month > 6)
            days += 30;
        if (month > 7)
            days += 31;
        if (month > 8)
            days += 31;
        if (month > 9)
            days += 30;
        if (month > 10)
            days += 31;
        if (month > 11)
            days += 30;
        return days;
    },
    isAdult: function (day, month, year) {
        var today = new Date();
        var birthDate = new Date();
        birthDate.setDate(day);
        birthDate.setMonth(month - 1);
        birthDate.setYear(year);
//      birthDate.setTime(Date.parse(year+'/'+month+'/'+day));
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 17;
    },
// Проверка валидности ИНН
// Украинский ИНН
  compareINNandDateOfBirth: function (inn5, d, m, y) {
        y = parseInt(y, 10);
        d = parseInt(d, 10);  // переводим в integer
        var daysFrom1900fromYears = (y - 1900) * 365 + Math.ceil((y - 1900) / 4) - 1; // находим количество дней от 01.01.1900 до 01.01.yyyy
        var daysFrom1900fromMonthes = this.returnDaysFromJanTillMonth(m, this.isYearLeap(y)); // находим количество дней от 01.01 до 01.mm
        var daysFrom1900 = daysFrom1900fromYears - (-daysFrom1900fromMonthes) + d; // находим общее количество дней от 01.01.1900 до dd.mm.yyyy
        console.info(daysFrom1900);


        var iin5_8 = (inn5 + '');
        iin5_8 = 8 + iin5_8.substr(1);

        if (daysFrom1900 == inn5) {
            return true; // если полученное количество дней равно первым 5 цифрам ИНН -> true
        } else if (daysFrom1900 == iin5_8) {
            return true; // если полученное количество дней равно первым 5 цифрам ИНН -> true ИЛИ ПЕРВАЯ цифра 8
        }


        return false;
    },
    detectCountry: function (number) {
        var self = this;
        self.country = '';
        $.each(this.mobileCodes, function (key, value) {
            if (self.isMobilePhoneValid(number, key)) {
                self.country = key;
            }
        });
        return self.country;
    }
};
Form.prototype.constructor = Form;

function FormIndex() {
}
FormIndex.prototype = new Form();

FormIndex.prototype.action = "lib/leads.php";

FormIndex.prototype.createEventHandlers = function () {
    var form = this;

    jQuery('#status, #region, #country').bind('click', function (e) {
        $('#tip > span, #tip_status > .jserror').hide();
        form.hideErrors();
    });

    jQuery('#status, #region, #country').bind('change keypress keydown keyup', function (e) {
        jQuery('#tip > span, #money select, #tip_status > .jserror').hide();

        form.hideErrors();

        $('#region_' + form.country).hide();
        form.selectCountry();
        $('#region_' + form.country).show();


        $('#sum_' + form.country).show();
        /* switch( $('#country').val() ) {
         "lv":
         alert('asd');
         $('#INN').hide();
         $('#PERSONAL').show();
         break;
         }*/

    });

    $('#region, #country, #money, #mobilePhone, #INN, #birthDay, #birthMonth, #birthYear, #name, #email').bind('click', function () {
        form.hideErrors();
    });

    $('#name').bind('keyup', function (e) {
        $(this).val($(this).val().replace(/  +/g, ' '));
        if ($.trim($(this).val()) == '') {
            $(this).val('');
        }
    });
}
FormIndex.prototype.checkForm = function () {
    this.hideErrors();

    $('#email').val(this.deleteSpaсeAndPlus($('#email').val()));
    $('#inn').val(this.deleteSpaсeAndPlus($('#inn').val()));
    var emmail_val = $('#email');
    emmail_val.val(emmail_val.val().replace('yandex.com.ua', 'yandex.ua'));
    emmail_val.val(emmail_val.val().replace('yandeks.ua', 'yandex.ua'));
    emmail_val.val(emmail_val.val().replace('yandeks.ru', 'yandex.ru'));


    $('#name').val($.trim($('#name').val()));

    if (this.country == '') {
        this.addError("country");
        return false;
    }

    if ($('#region_' + this.country).val() == 0) {
        this.addError('region');
        this.addError('region_' + this.country);
    }

    this.status = $('#status').val();
    switch (this.status) {
        case "borrower":
            if ($('#sum_' + this.country).val() == 0) {
                this.addError("sum_" + this.country);
            }
            break;
        case "donor":
            if ($('#income_' + this.country).val() == 0) {
                this.addError("income_" + this.country);
            }
            break;
        case "broker":
            if ($('#recruit').val() == 0)
                this.addError("recruit");
            break;
    }

    if ($('#name').val() == 'Фамилия Имя Отчество')
        this.addError("name");

    if (!this.isNameValid($('#name').val() || $('#name').val().length < 8)) {
        this.addError("name");
    }
    else {

        /**
         * Валидация нескольких языков
         * Только для украинцев и русских
         */
        var country_ = $('#country').val();
        if (country_ == 'ru' || country_ == 'ua') {
            var str = $('#name').val();
            var len = str.length - 1;
            var last = str.charAt(len);
            first = str.split('', 1);
            if (str_cirill.indexOf(first) != -1) {
                if (str_cirill.indexOf(last) == -1) {
                    // name_lang
                    this.addError("name_lang");
                    $('#name').addClass('error');
                    return false;
                }
            } else if (str_latin.indexOf(first) != -1) {
                if (str_latin.indexOf(last) == -1) {
                    this.addError("name_lang");
                    $('#name').addClass('error');
                    return false;
                }
            }
        }

    }

    this.checkName($('#name').val());

    // Валидация имени если в нем два одинаковых слова и проверка на окончание отчества
    var fio_arr = $('#name').val().split(' ');
    if (fio_arr.length == 3) {
        fio_arr[0] = fio_arr[0].toLowerCase();
        fio_arr[1] = fio_arr[1].toLowerCase();
        fio_arr[2] = fio_arr[2].toLowerCase();

        if (fio_arr[0] == fio_arr[1] || fio_arr[1] == fio_arr[2] || fio_arr[2] == fio_arr[0]) {
            this.addError("name");
            $('#name').addClass('error');
        }

        // Если отчетство начинается на "вич" или "евич"
        if(fio_arr[2].length > 3 && (fio_arr[2].substr(0,3) == 'вич' || fio_arr[2].substr(0,4) == 'евич')){
            this.addError("name_opcha");
            $('#name').addClass('error');
        }
    }

    if (!this.isEmailValid($('#email').val()))
        this.addError("email");
    if (!this.isEmailValidt($.trim($('#email').val())))
        this.addError("email");
    if (!this.isEmailValidyou($.trim($('#email').val()))) {
        this.addError("emailNotYou");
        $('#email').addClass('error');
    }
    if (!this.isEmailValidByFnone($('#email').val()))
        this.addError("emailPhone");

    // Внимание валидация в обратном порядке
    // Если ошибка - озвращается домен, а если нет - то false
    if (this.isEmailNotOn($('#email').val())){
        this.addError("NotOn");
        $('#email').addClass('error');
        $('#NotOn').html(this.isEmailNotOn($('#email').val()));
    }


    if ($('#birthDay').val() == 0 || $('#birthMonth').val() == 0 || $('#birthYear').val() == 0)
        this.addError("INN");
    if ($('#birthDay').val() == 0)
        $('#birthDay').addClass('error');
    if ($('#birthMonth').val() == 0)
        $('#birthMonth').addClass('error');
    if ($('#birthYear').val() == 0)
        $('#birthYear').addClass('error');

// МЫСЛИ
// Существует два типа уведомления об ошибках введённых данных.
// Одна обобщённая, на случай если мы не знаем страну клиента, а вторая индивидуальная, на случай если знаем страну
// Благодаря этому, в случае если мы знаем страну, можно показывать более чёткую ошибку вместо обобщённого <span id="error_mobilePhone" class="jserror" style="display:none;">МОБИЛЬНЫЙ в формате +XXX00000000</span>
// Можно показывать что-то вроде "<span id="error_mobilePhone_lv"  class="jserror" style="display:none">MOBILE formāts +371ХХХХХХХХ</span>"

    switch (this.country) {
        case "ru":
            if (!this.isCountryMobilePhoneValid($('#mobilePhone').val())) {
                this.addError("mobilePhone");
                this.addError("mobilePhone_ru");
            }
       //    if (!this.isRussianINNValid($('#INN').val()))
            //    this.addError("INN");

            // Инн В Росси не может начинаться с 00
            var first_2_sym = $('#INN').val().substr(0, 2);
            if (first_2_sym == '00') {
             //   this.addError("INN_authentically");
                $('#INN').addClass('error');
            }

         if (!checkINN($('#INN').val())) {
              //  this.addError("INN_authentically");
                $('#INN').addClass('error');
            }


            break;

     case "ua":
         var INN5 = document.getElementById('INN').value.substr(0, 5);
            if (!this.isCountryMobilePhoneValid($('#mobilePhone').val())) {
                this.addError("mobilePhone");
                this.addError("mobilePhone_ua");
            }
        //  if (!this.isUkrainianINNValid($('#INN').val()))
              //  this.addError("INN");
            else if (!this.compareINNandDateOfBirth(INN5, $('#birthDay').val(), $('#birthMonth').val(), $('#birthYear').val()))
              //  this.addError("INN");

           if (!checkINNUKRAINE($('#INN').val())) {
              //  this.addError("INN_authentically");
               $('#INN').addClass('error');
            }

            break;
        case "kz":
            INN5 = document.getElementById('INN').value.substr(0, 5);
            if (!this.isCountryMobilePhoneValid($('#mobilePhone').val())) {
                this.addError("mobilePhone");
                this.addError("mobilePhone_ua");
            }
            if (!this.isUkrainianINNValid($('#INN').val()))
                this.addError("INN");
            else if (!this.compareINNandDateOfBirth(INN5, $('#birthDay').val(), $('#birthMonth').val(), $('#birthYear').val()))
                this.addError("INN");

            if (!checkINN($('#INN').val())) {
                this.addError("INN_authentically");
                $('#INN').addClass('error');
            }

            break;
        case "by":
            // ЦЦЦЦЦЦЦ Б ЦЦЦ ББ Ц
            if (!checkINNBELARUS($('#INN').val())) {
                this.addError("INN_authentically");
                $('#INN').addClass('error');
            }
            // Проверяем формат
            break;
    }





    // 7 одинаковых цифр в номере телефона идущих подряд - признак введения номера телефона "на отьебись". Выдаём ошибку
    if (!this.is7DigitsMobilePhoneValid($('#mobilePhone').val())) {
        this.addError("fakePhone");
        $('#mobilePhone').addClass('error');
    }

    if (!this.isAdult($('#birthDay').val(), $('#birthMonth').val(), $('#birthYear').val())) {
        this.addError("Adult");
    }

    if (this.errors == 0) {
        this.sendDataViaAjax();
    }
    this.errors = 0;
}

FormIndex.prototype.createAjaxDataObj = function () {
    var elemsToSend = [
        "status", "region", "country", "recruit",
        "name", "mobilePhone", "email", "INN", "birthDay", "birthMonth", "birthYear", 'sum'
    ];
    var data = {};

    for (var ind in elemsToSend) {
        if (elemsToSend[ind] == "region" || elemsToSend[ind] == "sum") {
            data[elemsToSend[ind]] = $('#' + elemsToSend[ind] + '_' + this.country).val();
        } else {
            data[elemsToSend[ind]] = $('#' + elemsToSend[ind]).val();
        }
    }


    data.type = "index";

// Автоисправления глупых ошибок клиентов при введенни своего эмаил адреса
    data.email = data.email.replace('yandex.com.ua', 'yandex.ua');
    data.email = data.email.replace('yandeks.ua', 'yandex.ua');
    data.email = data.email.replace('yandeks.ru', 'yandex.ru');

    return data;
}
FormIndex.prototype.processResponse = function (data) {
    $('#error_php_INN').hide();
    $('#mail_take').hide();

    if (data.response == "ok") {
        $('#formDiv').hide();
        $('#responseYes').show();
        $('#e-mail').html($('#email').val());
        if ($('#status').val() == "borrower") {
            // fincred.org 34292630
           	// Прежде чем сообщить яндексу об успешной конверсии, проверяем загружен ли корректный яндекс счётчик
           	// защищая систему от багов которые вылазят когда в счётчике ошибки или когда он попросту забанен AdBlock-ами
       if(typeof(yaCounter34292630) != 'undefined'){
                yaCounter34292630.reachGoal('YAresponseYes');
            }
        }

        // КУКИСЫ
        // Заявка подана успешно записываем в куки на N дней что заявка подана
        $.cookie("successOrder", +(new Date()), {expires: 30});
        /*
        // Что запоминать куками
        // сначала выделяем ФИО
        var client_fio = $('#name').val().substr(0, $('#name').val().lastIndexOf(' '));
        // разбиваем на строки и делаем каждую 1-ю букву заглавной
        client_fio = client_fio.split(' ').map( function(v) { return v.substr( 0, 1 ).toUpperCase() + v.substr(1).toLowerCase() }).join(' ');
        $.cookie("client_fio", client_fio, {expires: 20});
        $.cookie("client_email", $('#email').val(), {expires: 20});
        $.cookie("client_phone", $('#mobilePhone').val(), {expires: 20});
		*/

    } else {
        if (data.response == "notUnique") {
            $('#formDiv').hide();
            $('#mail_take').show();
        }
        // Если ещё не прошло DAYS_TO_CHECK с даты прошлой заявки на кредит
        if (data.response == "db") {
            $('#formDiv').hide();
            $('#responseNo').show();
        }
        // Данный ответ показываем клиенту если ему недавно высылалось newyear письмо
        if (data.response == "newyear") {
            $('#formDiv').hide();
            $('#need_another_action_1').show();
        }
        if (data.response == "php_INN") {
            $('#error_php_INN, #formDiv').show();
            $('#responseNo').hide();
        }

        if (data.response == "php_data") {
            $('#formDiv').hide();
            $('#mail_take').show();
            $('#responseNo').hide();
        }
    }

};

function FormFeedback() {
}
FormFeedback.prototype = new Form();

FormFeedback.prototype.action = "lib/fb.php";

FormFeedback.prototype.createEventHandlers = function () {
    var form = this;

    $('#subject').bind('change', function () {
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

    $('#sum, #email, #comments').bind('click', function () {
        form.hideErrors();
    });

    $('#mobilePhone').bind('keyup', function () {
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

FormFeedback.prototype.checkForm = function () {
    this.hideErrors();

    /**
     * Перед валидацией удаляем пробелы и плюс
     * @type {*|jQuery}
     */
    $('#email').val(this.deleteSpaсeAndPlus($('#email').val()));

    var emmail_val = $('#email');

    emmail_val.val(emmail_val.val().replace('yandex.com.ua', 'yandex.ua'));
    emmail_val.val(emmail_val.val().replace('yandeks.ua', 'yandex.ua'));
    emmail_val.val(emmail_val.val().replace('yandeks.ru', 'yandex.ru'));


    var subject = $('#subject').val();

    if ($('#subject').val() == "none")
        this.addError("subject");


    if (!this.isEmailValid($('#email').val()))
        this.addError("email");

    if (!this.isEmailValidByFnone($('#email').val()))
        this.addError("emailPhone");



    if ($('#mobilePhone').val() == '' || !this.isCountryMobilePhoneValid($('#mobilePhone').val()))
        this.addError("mobilePhone");
    // Валидация моб на 111111
    if (!this.is7DigitsMobilePhoneValid($('#mobilePhone').val())) {
        this.addError("fakePhone");
        $('#mobilePhone').addClass('error');
    }

    //  email
    if (!this.isEmailValidyou($.trim($('#email').val()))) {
        this.addError("emailNotYou");
        $('#email').addClass('error');
    }

    // Внимание валидация в обратном порядке
    // Если ошибка - озвращается домен, а если нет - то false
    if (this.isEmailNotOn($('#email').val())){
        this.addError("NotOn");
        $('#email').addClass('error');
        $('#NotOn').html(this.isEmailNotOn($('#email').val()));
    }

    if ($('#subject').val() == 'change_sum') {
        if ($('#sum_' + this.country).val() == 0) {
            this.addError('sum_' + this.country);
            this.addError('sum');
        }
    } else {
        if ($('#comments').val() == "" || $('#comments').val().length < 5)
            this.addError("comments");
    }
    if (!this.isEmailValidt($('#email').val()))
        this.addError("email");

    if (!this.errors) {
        this.sendDataViaAjax();
    }
    this.errors = 0;
}
FormFeedback.prototype.createAjaxDataObj = function () {
    var elemsToSend = [
        "subject", "email", "mobilePhone", "comments"
    ];
    var data = {};
    for (var ind in elemsToSend) {
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
    if (data.response == "ok") {
        $('#responseYes').show();
        $('#e-mail').html($('#email').val());

    }
    if (typeof data.response.old_sum != 'undefined') {
        $('#changeSum').show();
        $('#old_sum').html(data.response.old_sum);
        $('#new_sum').html(data.response.new_sum);
    }
    if (data.response == "fail" || data.response == "allError") {
        $('#allError').show();
    }

    if (data.response == "notfound") {
        $('#notfound').show();
    }
	// Нельзя менять сумму Вам
    if (data.response == "Black_cant_change_amount") {
        $('#Black_cant_change_amount').show();
    }

    if (data.response == "otkazano") {
        $('#otkazano').show();
    }
};
FormFeedback.prototype.reopen = function (el) {
    $('#formDiv').show();

    $(el).parent().parent().hide();
    // Ставим таймаут на 60 сек
    var sec = 60;
    $('#sendButton').val("таймаут " + sec + " секунд");
    $('#comments').val('');
    var myTimer = setInterval(function () {
        sec--;
        $('#sendButton').val("таймаут " + sec + " секунд");

        if (sec < 1) {
            $('#sendButton').prop("disabled", false);
            $('#sendButton').val("ОТПРАВИТЬ ВОПРОС");
            clearInterval(myTimer);
        }
    }, 1000);


};
FormIndex.prototype.reopen = function (el) {
    $('#formDiv').show();
    // Ставим таймаут на 60 сек
    var sec = 60;
    $('#sendButton').val("таймаут " + sec + " секунд");

    $(el).parent().parent().hide();

    var timer2 = setInterval(function () {
        sec--;
        $('#sendButton').val("таймаут " + sec + " секунд");

        if (sec < 1) {
            $('#sendButton').prop("disabled", false);
            $('#sendButton').val("ОТПРАВИТЬ ЗАЯВКУ");
            clearInterval(timer2);
        }
    }, 1000);
};

function FormSendList() {
}
FormSendList.prototype = new Form();

FormSendList.prototype.action = "../lib/send_list.php";

FormSendList.prototype.createEventHandlers = function () {
    var form = this;

    $('#chek').bind('change', function () {
        form.hideErrors();
        if ($(this).val() == '1') {
            $('#track_yes').show();
            $('#track_no').hide();
        } else {
            $('#track_yes').hide();
            $('#track_no').show();
        }
    });

    $('#date, #chek, #track_yes, #track_no').bind('click', function () {
        form.hideErrors();
    });


}

FormSendList.prototype.checkForm = function () {
    this.hideErrors();

    // обрезаем лишние проелы в треке или причине
    $('#track_yes').val($.trim($('#track_yes').val()));
    $('#track_yes').val($('#track_yes').val().replace(/\s+/g, ''));
    $('#track_no').val($.trim($('#track_no').val()));

    // проверяем дату
    if($("#date").val() == ''){
        $("#gde_data").show();
        this.addError("date");
    }

    if($("#chek").val() == '1'){
        // проверяем трек номер
        if($("#country").val() == 'ru'){
            // если РФ
            if($('#track_yes').val().length != 14){
                $("#notvalid").show();
                this.addError("track_yes");
            }else{
                // проверяем контрольную сумму
                var s = 0;
                s = s + parseInt($('#track_yes').val().substr(0,1))*3;
                s = s + parseInt($('#track_yes').val().substr(1,1));
                s = s + parseInt($('#track_yes').val().substr(2,1))*3;
                s = s + parseInt($('#track_yes').val().substr(3,1));
                s = s + parseInt($('#track_yes').val().substr(4,1))*3;
                s = s + parseInt($('#track_yes').val().substr(5,1));
                s = s + parseInt($('#track_yes').val().substr(6,1))*3;
                s = s + parseInt($('#track_yes').val().substr(7,1));
                s = s + parseInt($('#track_yes').val().substr(8,1))*3;
                s = s + parseInt($('#track_yes').val().substr(9,1));
                s = s + parseInt($('#track_yes').val().substr(10,1))*3;
                s = s + parseInt($('#track_yes').val().substr(11,1));
                s = s + parseInt($('#track_yes').val().substr(12,1))*3;

                var lastN = 10-s%10;

                if(lastN == 10){
                    lastN = 0;
                }

                if(lastN != $('#track_yes').val().substr(13,1)){
                    $("#notvalid").show();
                    this.addError("track_yes");
                }
            }
        }
        else{
            // если остальное
            if($('#track_yes').val().length != 13){
                $("#notvalid").show();
                this.addError("track_yes");
            }else if($('#track_yes').val().substr(0,2) == '00'){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('00000000') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('11111111') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('22222222') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('33333333') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('44444444') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('55555555') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('66666666') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('77777777') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('88888888') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('99999999') >= 0){
                $("#notvalid").show();
                this.addError("track_yes");
            }
            // Если клиент баран и пытается ввести код который указан в примере
            else if($('#track_yes').val().indexOf('11713318013033') >= 0){
                $("#idiots").show();
                this.addError("track_yes");
            }
            else if($('#track_yes').val().indexOf('0113310278598') >= 0){
                $("#idiots").show();
                this.addError("track_yes");
            }
        }
    }
    else{
        // проверяем кмментарий на кол-во символов
        if($('#track_no').val().length == 0){
            $("#prichina").show();
            this.addError("track_no");
        }
        else if($('#track_no').val().length < 6){
            $("#prichina_detalno").show();
            this.addError("track_no");
        }
    }

    if (!this.errors) {
        this.sendDataViaAjax();
    }
    this.errors = 0;
}
FormSendList.prototype.createAjaxDataObj = function () {
    var elemsToSend = [
        "date", "track_yes", "track_no", "chek", "key", "country"
    ];
    var data = {};
    for (var ind in elemsToSend) {
        data[elemsToSend[ind]] = $('#' + elemsToSend[ind]).val();
    }
    return data;
}
FormSendList.prototype.processResponse = function (data) {
    $('#formDiv').hide();

    if (data.response == "ok") {
        window.location.assign('send_list_ok.php?key=' + $("#key").val());
    }

    if (data.response == "reload") {
        //window.location.reload();
    }

    if (data.response == "date") {
        $("#gde_data").show();
        this.addError("date");
    }

    if (data.response == "track_no") {
        $("#prichina_detalno").show();
        this.addError("track_no");
    }

    if (data.response == "track_yes") {
        $("#notvalid").show();
        this.addError("track_yes");
    }

    $('#sendButton').prop("disabled", false);
    $('#sendButton2').prop("disabled", false);
    $('#sendButton').val($('#sendButton').data("old-val"));
};
FormSendList.prototype.reopen = function (el) {
    $('#formDiv').show();

    $(el).parent().parent().hide();
    // Ставим таймаут на 60 сек
    var sec = 60;
    $('#sendButton').val("таймаут " + sec + " секунд");
    $('#comments').val('');
    var myTimer = setInterval(function () {
        sec--;
        $('#sendButton').val("таймаут " + sec + " секунд");

        if (sec < 1) {
            $('#sendButton').prop("disabled", false);
            $('#sendButton2').prop("disabled", false);
            $('#sendButton').val("ОТПРАВИТЬ ВОПРОС");
            clearInterval(myTimer);
        }
    }, 1000);


};

FormSendList.prototype.sendCancel = function () {
    window.location.assign('send_list_cancel.php?key=' + $("#key").val());
};


function change_country() {


    // Блокировка ИНН

    var country = document.getElementById('country').value;
  var inn = document.getElementById('INN');
    var PERSONAL = document.getElementById('PERSONAL');

    if (country == "lv") {

        inn.setAttribute('onfocus', "if(this.value=='Персонал. КОД') this.value='';");
        inn.setAttribute('onblur', "if(this.value=='') this.value='Персонал. КОД';");
        inn.value = "Персонал. КОД";
        inn.setAttribute('placeholder', "Персонал. КОД");
    } else if (country == "ge") {
        inn.setAttribute('onfocus', "if(this.value=='Ваш ID или ИНН') this.value='';");
        inn.setAttribute('onblur', "if(this.value=='') this.value='Ваш ID или ИНН';");
        inn.value = "Ваш ID или ИНН";
        inn.setAttribute('placeholder', "Ваш ID или ИНН");
    } else {
        inn.setAttribute('onfocus', "if(this.value=='Ваш ИНН') this.value='';");
        inn.setAttribute('onblur', "if(this.value=='') this.value='Ваш ИНН';");
        inn.value = "Ваш ИНН";
        inn.setAttribute('placeholder', "Ваш ИНН");
    }

    // Блокируем ИНН
    if (country == '') {
        $('#INN').prop('disabled', true);
        $('#INN').css('opacity', 0.4);
    } else {
        $('#INN').prop('disabled', false);
        $('#INN').css('opacity', 1);

    }
}
var str_cirill = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЧШЩЪЫЬЭЮЯ ';
var str_latin = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM ';
var first = '';

function checkINN(inputNumber) {
    //преобразуем в строку
    inputNumber = "" + inputNumber;
    //преобразуем в массив
    inputNumber = inputNumber.split('');
    //для ИНН в 10 знаков
    if ((inputNumber.length == 10) &&
            (inputNumber[9] == (
                    (2 * inputNumber[0] +
                            4 * inputNumber[1] +
                            10 * inputNumber[2] +
                            3 * inputNumber[3] +
                            5 * inputNumber[4] +
                            9 * inputNumber[5] +
                            4 * inputNumber[6] +
                            6 * inputNumber[7] +
                            8 * inputNumber[8]
                            ) % 11) % 10)) {
        return true;
        //для ИНН в 12 знаков
    } else if ((inputNumber.length == 12) && ((inputNumber[10] == ((7 * inputNumber[ 0] + 2 * inputNumber[1] + 4 * inputNumber[2] + 10 * inputNumber[3] + 3 * inputNumber[4] + 5 * inputNumber[5] + 9 * inputNumber[6] + 4 * inputNumber[7] + 6 * inputNumber[8] + 8 * inputNumber[9]) % 11) % 10) && (inputNumber[11] == ((3 * inputNumber[ 0] + 7 * inputNumber[1] + 2 * inputNumber[2] + 4 * inputNumber[3] + 10 * inputNumber[4] + 3 * inputNumber[5] + 5 * inputNumber[6] + 9 * inputNumber[7] + 4 * inputNumber[8] + 6 * inputNumber[9] + 8 * inputNumber[10]) % 11) % 10))) {
        return true;
    } else {
        return false;
    }
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkINNUKRAINE(inputNumber) {
    inputNumber = "" + inputNumber;
    ssNumber = inputNumber.split('');
    if ((ssNumber[9] == ((-1 * ssNumber[  0] + 5 * ssNumber[1] + 7 * ssNumber[2] + 9 * ssNumber[3] + 4 * ssNumber[4] + 6 * ssNumber[5] + 10 * ssNumber[6] + 5 * ssNumber[7] + 7 * ssNumber[8]) % 11) % 10))
        return true
    else
        return false
}

function checkINNBELARUS(inputNumber) {
    return /[0-9]{7}.[0-9]{3}..[0-9]{1}/.test(inputNumber);
}