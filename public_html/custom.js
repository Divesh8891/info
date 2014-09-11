/*----------------------------------------------------ready--------------------------------------*/
var contentdata = '';
var currentselected = 'bank';
var detailArr = [];
$(document).ready(function() {
    $.ajax({
        url: 'items.xml',
        success: function(data) {
            contentdata = data;
            
            var insert = '<ul>';
            var items = $(contentdata).find('item');
            for (var i = 0; i < items.length; i++) {
                if (i == 0) {
                    insert += '<li style="width:190%"><span>' + $(items[i]).attr('id').split(" ")[0] + '</span></li>';

                }
                else {
                    insert += '<li ><span>' + $(items[i]).attr('id').split(" ")[0] + '</span></li>';
                }
            }
            insert += '</ul>';
            var option = '';
            option = '<select onchange="showDetailResult(this,\'option\');" id="menu-dropdown">';
            for (var i = 0; i < items.length; i++) {
                if (i == 0) {
                    option += '<option selected>' + $(items[i]).attr('id').split(" ")[0] + '</option>';

                }
                else {
                    option += '<option>' + $(items[i]).attr('id').split(" ")[0] + '</option>';
                }
            }
            option += '</select>';

            $('.menu').html(insert);
            $('.option-box').html(option);

            if ($(window).width() > 481) {
                $('.menu').css('display', 'block');
                $('.option-box').css('display', 'none');
            }
            else {
                $('.menu').css('display', 'none');
                $('.option-box').css('display', 'block');
                $('select').selectmenu('refresh', true);
            }

            $('.menu> ul li').click(function() {
                showDetailResult(this, "li");
                $(window).scrollTop(0);
                $('.overlay').css({
                    display: 'none'
                });
            });

        },
        error: function() {

        }
    });
    $('.addDivlabel').text ('Add '+currentselected+' item detail')
    $('.openForm').click(function() {
        var items = $(contentdata).find('item');

        if ($(window).width() > 1024) {
            $('.wrapper').css({
                minHeight: $(document).height()
            });
        }
        $('.addItem').css('display', 'block');
        $('.addDiv , .template-container').css('display', 'none');
        $('.sub-container').css({
            'display': 'block',
            marginTop: '0'
        });
        //currentselected = $(this).find('span').text();
        $('.sub-container > span').text('Fill Your ' + $(this).find('span').text() + ' Details');
        var insert = '';
        for (var i = 0; i < items.length; i++) {
            if (currentselected === $(items[i]).attr('id').split(" ")[0].toLowerCase()) {
                var subItem = $(items[i]).find('sub-item');
                for (var j = 0; j < subItem.length; j++) {
                    insert += '<li><span>' + $(subItem[j]).text() + '</span><br>';
                    insert += '<input type="' + $(subItem[j]).attr("type") + '" id="' + $(subItem[j]).text() + '"/></li>';
                }
            }
        }
        $('.sub-items').html(insert);
        $('.sub-items').css({
            marginTop: -$('.sub-container').height() - 100
        }).stop().animate({
            marginTop: '10px'
        }, 500, function() {
            $('.fa').remove();
            $('header').append('<i class="fa fa-times"></i> ');
            /*-------------------------------------------click on close-----------------------------------------*/
            $('.fa').click(function() {
                closeSubItem();
            });
        });
    });

    /*-------------------------------------------------------------------------------------------------------------*/
    /*----------------click on close icon on header--------------------------*/
    function closeSubItem() {
        $('.fa').css('display', 'none');
        $('.addItem').css('display', 'none');
        $('.sub-container').stop().animate({
            marginTop: -$('.sub-container').height() - 100
        }, 500, function() {
            $('.sub-container').css('display', 'none');
            $('.container').css({
                'opacity': '0',
                display: 'block'
            }).stop().animate({
                opacity: '1'
            }, 500);
        });
    }
    /*-------------------------------------------------------------------------------------*/
});
/*----------------------------------------------------ready end--------------------------------------*/
/*--------------------after move on second page siderbar / dropdown shown--------------------*/

function showDetailResult(obj, val) {
    
     $('.addDivlabel').text ('Add '+$(obj).find('span').text().toLowerCase()+' item detail')

}
/*-------------------------------------------------------------------------------------*/

$(window).resize(function() {
    if ($(window).width() > 481) {
        $('.menu').css('display', 'block');
        $('.option-box').css('display', 'none');
    }
    else {
        $('.menu').css('display', 'none');
        $('.option-box').css('display', 'block');
    }
});
