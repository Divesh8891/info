var contentdata = '';
var currentselected = 'Bank';
var detailArr = [];
var personArr = [];
var lastcurrentselected = '';
/*----------------------------------------------------ready--------------------------------------*/
$(document).ready(function() {
    $.ajax({
        url: 'items.xml',
        success: function(data) {
            contentdata = data;
            var insert = '';
            var items = $(data).find('item');
            var insert = '<ul>';
            var items = $(contentdata).find('item');
            for (var i = 0; i < items.length; i++) {
                if (currentselected == $(items[i]).attr('id').split(" ")[0]) {
                    insert += '<li style="width:190%" class="active"><span>' + $(items[i]).attr('id').split(" ")[0] + '</span></li>';
                }
                else {
                    insert += '<li ><span>' + $(items[i]).attr('id').split(" ")[0] + '</span></li>';
                }
            }
            insert += '</ul>';
            var option = '';
            for (var i = 0; i < items.length; i++) {
                if (currentselected == $(items[i]).attr('id').split(" ")[0]) {
                    option += '<option selected="selected">' + $(items[i]).attr('id').split(" ")[0] + '</option>';
                }
                else {
                    option += '<option>' + $(items[i]).attr('id').split(" ")[0] + '</option>';
                }
            }
            $('.menu').html(insert);
            $('#menu-dropdown').html(option);
            $('#menu-dropdown').prev().text(currentselected);
            $('.add-container span').text('Add ' + currentselected + ' Deatils');
            $('.menu> ul li').click(function() {
                lastcurrentselected = $(this).parent().find('.active');
                showDetailResult(this, "li");
                $(window).scrollTop(0);
            });
            if ($(window).width() > 481) {
                $('.menu').css('display', 'block');
                $('.option-box').css('display', 'none');
            }
            else {
                $('.menu').css('display', 'none');
                $('.option-box').css('display', 'block');
            }

            /*-------------------------------------------click on items-----------------------------------------*/
            $('.add-container a').click(function() {
                $('.overlay').css({
                    display: 'none'
                });
                $('.sub-container').css('display', 'block');
                $('.sub-container > span').text('Fill Your ' + currentselected + ' Details');
                var insert = '';
                for (var i = 0; i < items.length; i++) {
                    if (currentselected === ($(items[i]).attr('id')).split(" ")[0]) {
                        var subItem = $(items[i]).find('sub-item');
                        for (var j = 0; j < subItem.length; j++) {
                            //console.log($(subItem[j]).attr('required'))
                            if ($(subItem[j]).attr('required')) {
                                insert += '<li class="req"><span>' + $(subItem[j]).text() + '</span><span class="require">*</span><br>';
                                insert += '<input type="' + $(subItem[j]).attr("type") + '" id="' + $(subItem[j]).text() + '"  hasdate = "' + $(subItem[j]).attr("ftype") + '"/></li>';
                            }
                            else {
                                insert += '<li><span>' + $(subItem[j]).text() + '</span><br>';
                                insert += '<input type="' + $(subItem[j]).attr("type") + '" id="' + $(subItem[j]).text() + '"  hasdate = "' + $(subItem[j]).attr("ftype") + '":/></li>';
                            }

                        }
                    }
                }

                $('.sub-items').html(insert);
                $('.sub-items').children().each(function() {
                    if ($(this).find('input').attr('hasdate') === 'date') {


                        if ($(this).find('input').parent().find('span').eq(0).text() == 'Expired On' || $(this).find('input').parent().find('span').eq(0).text() == 'Maturity Date') {
                            $(this).find('input').datepicker({
                                showOn: "button",
                                buttonImage: "images/calendar.gif",
                                buttonImageOnly: true,
                                changeMonth: true,
                                changeYear: true,
                               minDate: new Date()
                            });
                        }
                        if ($(this).find('input').parent().find('span').eq(0).text() == 'Issued Date' || $(this).find('input').parent().find('span').eq(0).text() == 'Date Of Birth') {
                            $(this).find('input').datepicker({
                                showOn: "button",
                                buttonImage: "images/calendar.gif",
                                buttonImageOnly: true,
                                changeMonth: true,
                                changeYear: true,
                                maxDate: new Date()

                            });
                        }
                        $(this).find('input').attr("readonly", true);
                    }
                });
                $('.sub-container').children('a').remove();
                $('.sub-items').parent().append('<a class="ui-btn  addItem" data-transition="flip">Done</a>');
                $('.sub-container').css({
                    marginTop: -$('.sub-container').height() - 100
                }).stop().animate({marginTop: '10px'}, 500);
                $('.template-container').css({
                    'display': 'none',
                });
                $('.addItem').click(function() {
                    var errorstatus = validateItem(this);
                    if (errorstatus) {
                        saveDetails(this, currentselected.toLowerCase());
                        createLayout();
                        closeSubItem();
                        $(this).remove();
                    }
                });
            });
        }
    });
    /*-------------------------------------------------------------------------------------------------------------*/
    function validateItem(obj) {
        var flag = true;
        $('.errMsz').remove();
        $(obj).prev('ul').children().each(function(i, option) {
            // console.log(i + "===" + $(this).find('input').attr('type') + "===" + $(this).find('input').val());
            if ($(this).hasClass('req')) {
                if ($(this).find('input').attr('type') == 'text' && $(this).find('input').val() == '') {
                    $(this).append('<span class="errMsz">Enter Required Field</span>');
                    flag = false;
                }
                if ($(this).find('input').attr('type') == 'number' && $(this).find('input').val() == '') {
                    $(this).append('<span class="errMsz">Enter Required Field</span>');
                    flag = false;

                }
            }
            if ($(this).find('input').attr('hasdate') == 'date' && $(this).find('input').val() != '') {
                var dateStatus = $(this).find('input').val().split("/");
                if (dateStatus.length != 3) {
                    flag = false;
                    $(this).find('input').after('<span class="errMsz">Enter Valid date(mm/dd/yyyy)</span>');
                }
            }
        });
        if (flag == true) {
            return true;
        }
        else {
            return false;
        }
    }
    function closeSubItem() {
        $('.sub-container').stop().animate({
            marginTop: -$('.sub-container').height() - 100
        }, 500, function() {
            $('.sub-container').css('display', 'none');
            $('.template-container > div').each(function() {
                if ($(this).hasClass(currentselected.toLowerCase())) {
                    $(this).css('display', 'block');
                }
                else {
                    $(this).css('display', 'none');
                }
            });
            $('.template-container').fadeIn(1000);
            $('.common-temp').each(function() {
                var me = this;
                $(me).find('.identity-text').css('margin-top', (parseInt($(me).find('.identity').height()) - parseInt($(me).find('.identity-text').height())) / 2)
                $(me).find('.items-details').css('margin-top', (parseInt($(me).height()) - parseInt($(me).find('.items-details').height())) / 2)
            });
        });
    }
    /*-------------------------------------------------------------------------------------*/
    $('.login-btn').click(function() {
        $('.doneLogin').css('display', 'block');

        $('.forgotP').remove();
        $('.panel').css('display', 'none');
        $('.login-container').css('display', 'block');
        $('.panel').removeClass('active');
        $('.login-container').addClass('activeUL');
        $('.login-container').find('input').parent().removeClass('ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset');
        $('.login').append('<a class="forgotP" onclick="forgotPass();"> Forgot Pasword</a>');
        defaulPage();
    });
    $('.sign-btn').click(function() {
        $('.doneLogin').css('display', 'block');
        $('.forgotP').remove();
        $('.panel').css('display', 'none');
        $('.sign-container').css('display', 'block');
        $('.panel').removeClass('active');
        $('.sign-container').addClass('activeUL');
        $('.sign-container').find('input').parent().removeClass('ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset');
        defaulPage();
    });
    $('.login-close').click(function() {
         $('.login').find('input').val('');
        $('.login , .overlay').css({
            'display': 'none'
        });
        $('.login ul').next().removeAttr('id');
        $('.errMsz').remove();
    });
});
/*----------------------------------------------------ready end--------------------------------------*/
function submitdetails(obj) {
    
    var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    $(obj).parent().children('ul').each(function() {
        if ($(this).css('display') == 'block' && $(this).hasClass('login-container')) {
            var flag = true;
            $('.errMsz').remove();

            if ($('.login-container').children('li').eq(0).find('input').val() == '') {
                $('.login-container').children('li').eq(0).append('<span class="errMsz">Enter Required Field</span>');
                flag = false;
            }
            else if ($('.login-container').children('li').eq(1).find('input').val() == '') {
                $('.login-container').children('li').eq(1).append('<span class="errMsz">Enter Required Field</span>');
                flag = false;
            }

            if (flag == false) {
                return false;
            }
            else {
                $('.login-close').trigger('click');
                return true;
            }

        }
        if ($(this).css('display') == 'block' && $(this).hasClass('sign-container')) {
            var flag = true;

            $('.errMsz').remove();
            if ($('.sign-container').children('li').eq(0).find('input').val() == '') {
                $('.sign-container').children('li').eq(0).append('<span class="errMsz">Enter Required Field</span>');
                flag = false;
            }
            else if ($('.sign-container').children('li').eq(1).find('input').val() == '') {
                $('.sign-container').children('li').eq(1).append('<span class="errMsz">Enter Required Field</span>');
                flag = false;
            }
            else if ($('.sign-container').children('li').eq(1).find('input').val().length < 8) {
                $('.sign-container').children('li').eq(1).append('<span class="errMsz">Enter 8 digit password</span>');
                flag = false;
            }
            else if ($('.sign-container').children('li').eq(2).find('input').val() == '') {
                $('.sign-container').children('li').eq(2).append('<span class="errMsz">Enter Required Field</span>');
                flag = false;
            }
            else if (!filter.test($('.sign-container').children('li').eq(2).find('input').val())) {
                $('.sign-container').children('li').eq(2).append('<span class="errMsz">Enter Valid Email</span>');
                flag = false;
            }
            if (flag == false) {
                return false;
            }
            else {
                var pdata = new Object();
                pdata.Username = $('.sign-container').children('li').eq(0).find('input').val();
                pdata.Password = $('.sign-container').children('li').eq(1).find('input').val();
                pdata.Email = $('.sign-container').children('li').eq(2).find('input').val();
                pdata.data = '';
                personArr.push(pdata);
                $('.login-close').trigger('click');

            }
        }
        if ($(this).css('display') == 'block' && $(this).hasClass('forgot-container')) {
            $('.errMsz').remove();
            if (!filter.test($('.forgot-container').children('li').eq(0).find('input').val())) {
                $('.forgot-container').children('li').eq(0).append('<span class="errMsz">Enter Valid Email</span>');
                return false;
            }
            else if ($('.forgot-container').children('li').eq(0).find('input').val() == '') {
                $('.forgot-container').children('li').eq(0).append('<span class="errMsz">Enter Required Field</span>');
                return false;
            }
            else {
                $('.doneLogin').css('display', 'none');
                var insert = '';
                insert += '<li>';
                insert += '<span>Password send successfully in your email</span>';
                insert += '</li>';
                $('.forgot-container').html(insert);
                setTimeout(function() {
                    $('.login , .overlay').css({
                        'display': 'none',
                    });
                    $('.login ul').next().removeAttr('id');
                }, 1000);
                defaulPage();
            }
        }
    });
   
}
function defaulPage() {
    
    $('.login').css({
        'display': 'block',
        top: ((parseInt($(window).height()) - parseInt($('.login').outerHeight())) / 2) - $('.header').height(),
        left: (parseInt($('#wrapper').width()) - parseInt($('.login').width())) / 2 - 35
    });
    $('.overlay').html('');
    $('.overlay').removeAttr('style');
    $('.overlay').css({
        display: 'block',
        width: $(document).width(),
        height: $(document).height()
    });
}
function forgotPass() {
    console.log("1")
    $('.forgotP').remove();
    $('.panel').css('display', 'none');
    $('.forgot-container').css('display', 'block');
    var insert = '';
    insert += '<li>';
    insert += '<span>Enter your Email</span><span class="require">*</span><br>';
    insert += '<input type="email" id="femail"/> ';
    insert += '</li>';
    $('.forgot-container').html(insert);
    defaulPage();
}


/*-------------------Save Details-----------------------*/
function saveDetails(obj, val) {
    var tempArr = [];
    var pdata1 = new Object();
    var currentDate = new Date();
    $(obj).prev().children('li').each(function() {
        var pdata = new Object();
        pdata.item = $(this).find('span').text();
        pdata.value = $(this).find('input').val();
        tempArr.push(pdata);
        pdata1.id = currentDate.getTime() + "-" + val;
        pdata1.data = tempArr;
    });
    if ($('.template-container').find('#' + currentDate.getTime()).children().length === 0) {
        detailArr.push(pdata1);
    }
    else {
        $.each(detailArr, function(i, option) {
            if (option.id === $('.' + val).attr('id')) {
                option.data = tempArr;
            }
        });
    }
    if (personArr[0])
        personArr[0].data = detailArr;
    console.log(JSON.stringify(detailArr));
    console.log(JSON.stringify(personArr));
    createLayout();
}
/*-------------------------------------------------------------------------------------*/

function showDetailResult(obj, val) {

    var me = obj;
    if (val == 'li') {
        $(me).addClass('active');
        currentselected = $(me).find('span').text();
        $('#menu-dropdown').prev().text(currentselected);
        $(lastcurrentselected).stop().animate({width: '100%'}, 500, function() {
            $(lastcurrentselected).removeAttr('style');
            $(lastcurrentselected).removeClass('active');
        });
        $(me).stop().animate({width: '190%'}, 500);
        $('.common-temp').stop().animate({opacity: '0'}, 300, function() {
            $('.common-temp').css('display', 'none');
            $('.template-container').find('.' + $(me).find('span').text().toLowerCase()).css('display', 'block').stop().animate({opacity: 1}, 500);
            $('.' + $(me).find('span').text().toLowerCase()).find('.identity-text').css('margin-top', (parseInt($('.' + $(me).find('span').text().toLowerCase()).find('.identity').height()) - parseInt($('.' + $(me).find('span').text().toLowerCase()).find('.identity-text').height())) / 2)
            $('.' + $(me).find('span').text().toLowerCase()).find('.items-details').css('margin-top', (parseInt($('.' + $(me).find('span').text().toLowerCase()).height()) - parseInt($('.' + $(me).find('span').text().toLowerCase()).find('.items-details').height())) / 2)

        });
    }
    else {
        currentselected = $(me).val();
        $('.common-temp').stop().animate({opacity: '0'}, 300, function() {
            $('.common-temp').css('display', 'none');
            $('.template-container').find('.' + $(me).val().toLowerCase()).css('display', 'block').stop().animate({opacity: 1}, 500);
            $('.' + $(me).val().toLowerCase()).find('.identity-text').css('margin-top', (parseInt($('.' + $(me).val().toLowerCase()).find('.identity').height()) - parseInt($('.' + $(me).val().toLowerCase()).find('.identity-text').height())) / 2)
            $('.' + $(me).val().toLowerCase()).find('.items-details').css('margin-top', (parseInt($('.' + $(me).val().toLowerCase()).height()) - parseInt($('.' + $(me).val().toLowerCase()).find('.items-details').height())) / 2)
        });
        $('.menu ul li').each(function() {
            if ($(this).find('span').text() === currentselected) {
                $(this).css('width', '190%');
                $(this).addClass('active');
            }
            else {
                $(this).removeAttr('style');
                $(this).removeClass('active');
            }
        });
    }
    $('.add-container span').text('Add ' + currentselected + ' Deatils');
    $('.sub-container').stop().animate({
        marginTop: -$('.sub-container').height() - 100
    }, 500, function() {
        $('.sub-container').css('display', 'none');
    });
}
/*-------------------------------------------------------------------------------------*/

function createLayout() {
    var insert = '';
    $.each(detailArr, function(i, option) {

        if (option.id.split("-")[1] === 'bank') {
            insert += '<div class="bank common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Bank</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="bname bfirst-row wordoverflow">' + option.data[1].value + '</span>';
            insert += '<span class="bacc bfirst-row">' + option.data[3].value + '</span>';
            insert += '<span class="pname wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="bifsc bthird-row"> IFSC</span>';
            insert += '<span class="bmicsr bthird-row">MICSR</span>';
            insert += '<span class="bifsc-value bforth-row">' + option.data[4].value + '</span>';
            insert += '<span class="bmicsr-value bforth-row">' + option.data[5].value + '</span>';
            insert += '<span class="bbranch bfifth-row">BRANCH</span>';
            insert += '<span class="customerId bfifth-row">CustomerId </span>';
            insert += '<span class="customerId-value bsixth-row">' + option.data[6].value + '</span>';
            insert += '<span class="bbranch-value bsixth-row">' + option.data[2].value + '</span>';
            insert += '<span class="bcard bseventh-row">' + option.data[7].value + '</span>';
            insert += '<span class="bccv bseventh-row">CVV :</span>';
            insert += '<span class="bccv bseventh-row">' + option.data[9].value + '</span>';
            insert += '<span class="bedate blast-row">Expired On : ' + option.data[8].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'passport') {
            insert += '<div class="passport common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Passport</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="pnumber">' + option.data[1].value + '</span>';
            insert += '<span class="passname wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="pidate pfirst-row">Issued date :</span>';
            insert += '<span class="pidate pfirst-row">' + option.data[2].value + '</span>';
            insert += '<span class="pedate psecond-row">Expired Date :</span>';
            insert += '<span class="pedate psecond-row">' + option.data[3].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'driving') {
            insert += '<div class="driving common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Licence</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="pnumber">' + option.data[1].value + '</span>';
            insert += '<span class="passname wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="pidate pfirst-row">Issued date :</span>';
            insert += '<span class="pidate pfirst-row">' + option.data[2].value + '</span>';
            insert += '<span class="pedate psecond-row">Expired Date :</span>';
            insert += '<span class="pedate psecond-row">' + option.data[3].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'voter') {
            insert += '<div class="voter common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Voter Id</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="vnumber">' + option.data[3].value + '</span>';
            insert += '<span class="vname wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="vfname">s/o ' + option.data[1].value + ' in</span>';
            insert += '<span class="vadd"> ' + option.data[2].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'certificate') {
            insert += '<div class="certificate common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Certificate</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="cpname wordoverflow">' + option.data[1].value + '</span>';
            insert += '<span class="cname wordoverflow">' + option.data[2].value + '</span>';
            insert += '<span class="cnumber">' + option.data[0].value + '</span>';
            insert += '<span class="cidate cfirst-row">Issued Date : ' + option.data[3].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'aadhaar') {
            insert += '<div class="aadhaar common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Aadhar</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="apname wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="anumber">' + option.data[1].value + '</span>';
            insert += '<span class="abdate cfirst-row">Date Of Birth : ' + option.data[2].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'pan') {
            insert += '<div class="pan common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Pan</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="pannumber">' + option.data[3].value + '</span>';
            insert += '<span class="panname wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="panfname">s/o ' + option.data[1].value + '</span>';
            insert += '<span class="panbdate panfirst-row">Date Of Birth : ' + option.data[2].value + '</span>';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }
        if (option.id.split("-")[1] === 'policy') {
            insert += '<div class="policy common-temp" id="' + option.id.split("-")[0] + '">';
            insert += '<ul class="identity">';
            insert += '<li>';
            insert += '<div class="identity-text">Policy</div>';
            insert += '</li>';
            insert += '</ul>';
            insert += '<ul class="items-details">';
            insert += '<li>';
            insert += '<span class="policyholder wordoverflow">' + option.data[0].value + '</span>';
            insert += '<span class="policynum">' + option.data[1].value + '</span>';
            insert += '<span class="policyname">' + option.data[2].value + ' - ' + option.data[3].value + '</span>';
            insert += '<span class="policysum">Sum Assured : ' + option.data[5].value + '</span>';
            insert += '<span class="policyamt">' + option.data[4].value + ' - ' + option.data[6].value + '</span>';
            insert += '<span class="policyidate">Issued Date :  ' + option.data[7].value + '</span>';
            insert += '<span class="policymdate">Maturity Date:  ' + option.data[8].value + '</span> ';
            insert += '</li>';
            insert += '</ul>';
            insert += '</div>';
        }

    });
    $('.template-container').html(insert);
    $('.template-container div').click(function() {
        var me = this;
        $('.overlay').attr('id', $(me).attr('id'));
        var insert = '';
        insert += '<a  class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-btn-b ui-mini icon-left delete">icon only button</a>';
        insert += '<a  class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-back ui-btn-icon-notext ui-btn-b ui-mini icon-left close">icon only button</a>';
        insert += '<span class="overlay-text">No option for edit. Delete it & make new.</span>';
        $('.overlay').html(insert);
        $('.overlay').css({
            display: 'block',
            width: $(me).width(),
            height: '215px',
            top: $(me).position().top + 77,
            left: $(me).position().left + 4
        });
        $('.overlay .close').click(function() {
            $('.overlay').css({
                display: 'none'
            });
        });
        $('.overlay .delete').click(function() {
            var status = confirm("Are you sure to delete ?")
            if (status) {
                var me = this;
                for (var i = 0; i < detailArr.length; i++) {
                    if (detailArr[i].id.split("-")[0] == $(me).parent().attr('id')) {
                        detailArr.splice(i, 1);
                        createLayout();
                        $('.overlay').css({
                            display: 'none'
                        });
                    }
                }
            }
        });
    });
}

$(window).resize(function() {
    if ($(window).width() > 481) {
        $('.menu').css('display', 'block');
        $('.option-box').css('display', 'none');
    }
    else {
        $('.menu').css('display', 'none');
        $('.option-box').css('display', 'block');
        $('.sidemenu').removeAttr('style')
    }
    $('.login').css({
        top: ((parseInt($(window).height()) - parseInt($('.login').outerHeight())) / 2) - $('.header').height(),
        left: (parseInt($('#wrapper').width()) - parseInt($('.login').width())) / 2 - 35
    });
    $('.overlay').css({
        width: $(document).width(),
        height: $(document).height()
    });
});
