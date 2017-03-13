$('select').on("change", function(){
    clearErrors();
    $('input[name="sendButton"]').val('РАССЧИТАТЬ ИТОГО');
    var selectId = $(this).attr('id'),
        el = $(this);
    switch (selectId) {
        case 'country':
            $('.flag').hide();
            $(".county-sum").hide();
            $("#sum_"+el.val()).show();
                if (el.val() != "") {
                    $('.calk_dopinfo').hide();
                    $('.info').hide();
                    $('#img_'+el.val()).show();
                    $('.info_'+el.val()).show();
                }
            break;
    }
    $('#view_sum').text('-');
    $('#view_marja').text('-');
    $('#view_srok').text('-');
    $('#don').text('-');
    $('#plat').text('-');
    $('#itogo').text('-');
});

$('input[name="sendButton"]').click(function(){



    var self = $(this);
    self.attr('disabled', true);

    if (!formCheck()) {
        self.attr('disabled', false);
        return false;
    }
    self.val('Рассчитываем..');

    var form_data = new FormData($('#mainForm')[0]);

    var country = $('#country').val();
    
    form_data.append('sum', $("#sum_"+country).val());
        

    var request = $.ajax({
        type: "POST",
        url: '/lib/calculator.php',
        data: form_data,
        processData: false,
        contentType: false,
    });
    request.done(function(res) {
        
        res = jQuery.parseJSON(res);
        console.log(res.sum);
        $('input[name="sendButton"]').val('ИТОГО');
        self.attr('disabled', false);

        $('#view_sum').text(res.sum);
        $('#view_marja').text(res.marja);
        $('#view_srok').text(res.srok);
        $('#don').text(res.don);
        $('#plat').text(res.plat);
        $('#itogo').text(res.itogo);

        $('.plat3').text(res.plat3);
        $('.sum').text(res.sum);
        $('.don').text(res.don);
        $('.srok2').text(res.srok2);
        $('.srok').text(res.srok);

        if ($('#srok').val() < 7) {
            $('.primer').hide();
        } else {
            $('.primer').show();
        }

        $('.itogo').text(res.itogo);
        $('.oneday').text(res.oneday);
        $('.itogo_new').text(res.itogo_new);
        $('.plat_new').text(res.plat_new);
        $('.plat').text(res.plat);

        $('.calk_dopinfo').show();
        
        
        // НОВЫЕ ЭЛЕМЕНТЫ
        $('.itogo_kz_50000_10_36').text(res.itogo_kz_50000_10_36);
		$('.itogo_kz_50000_10_60').text(res.itogo_kz_50000_10_60);
		$('.itogo_kz_50000_15_36').text(res.itogo_kz_50000_15_36);
		$('.itogo_kz_50000_15_60').text(res.itogo_kz_50000_15_60);
		$('.itogo_kz_50000_22_36').text(res.itogo_kz_50000_22_36);
		$('.itogo_kz_50000_22_60').text(res.itogo_kz_50000_22_60);
		$('.don_kz_50000_10').text(res.don_kz_50000_10);
		$('.don_kz_50000_15').text(res.don_kz_50000_15);
		$('.don_kz_50000_22').text(res.don_kz_50000_22);
		$('.plat_kz_36m_10_50000').text(res.plat_kz_36m_10_50000);
		$('.plat_kz_60m_10_50000').text(res.plat_kz_60m_10_50000);
		$('.plat_kz_36m_15_50000').text(res.plat_kz_36m_15_50000);
		$('.plat_kz_60m_15_50000').text(res.plat_kz_60m_15_50000);
		$('.plat_kz_36m_22_50000').text(res.plat_kz_36m_22_50000);
		$('.plat_kz_60m_22_50000').text(res.plat_kz_60m_22_50000);
		
        $('.itogo_ru_500000_10_36').text(res.itogo_ru_500000_10_36);
		$('.itogo_ru_500000_10_60').text(res.itogo_ru_500000_10_60);
		$('.itogo_ru_500000_15_36').text(res.itogo_ru_500000_15_36);
		$('.itogo_ru_500000_15_60').text(res.itogo_ru_500000_15_60);
		$('.itogo_ru_500000_22_36').text(res.itogo_ru_500000_22_36);
		$('.itogo_ru_500000_22_60').text(res.itogo_ru_500000_22_60);
        $('.don_ru_500000_10').text(res.don_ru_500000_10);
        $('.don_ru_500000_10').text(res.don_ru_500000_10);
        $('.don_ru_500000_10').text(res.don_ru_500000_10);
        $('.plat_ru_36m_10_500000').text(res.plat_ru_36m_10_500000);
		$('.plat_ru_60m_10_500000').text(res.plat_ru_60m_10_500000);
		$('.plat_ru_36m_15_500000').text(res.plat_ru_36m_15_500000);
		$('.plat_ru_60m_15_500000').text(res.plat_ru_60m_15_500000);
		$('.plat_ru_36m_22_500000').text(res.plat_ru_36m_22_500000);
		$('.plat_ru_60m_22_500000').text(res.plat_ru_60m_22_500000);
        
    });
    
    request.fail(function(jqXHR, textStatus) {
        console.log(textStatus);
        console.log(jqXHR);
    });
});

function clearErrors() {
    $('select').removeClass('error');
}

function formCheck() {
    this.checked = true;

    var country = $('#country').val(),
        sum = $("#sum_"+country).val(),
        marja = $('#marja').val(),
        srok = $('#srok').val();

        if (country == '') {
            this.checked = false;
            $('#country').addClass('error');
            



        }
        if (sum == '0') {
            this.checked = false;
            $("#sum_"+country).addClass('error');
        }
        if (marja == '0') {
            this.checked = false;
            $('#marja').addClass('error');
        }
        if (srok == '0') {
            this.checked = false;
            $('#srok').addClass('error');
        }
    return this.checked;
}