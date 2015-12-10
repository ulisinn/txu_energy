(function ($) {

    $.fn.hoverfold = function (args) {
        console.log("hoverfold running");

        this.each(function () {
            $(this).children('.view').each(function () {

                var $item = $(this),
                    img = $item.children('img').attr('libs'),
                    struct = '<div id="slice_1" class="slice s1">';
                struct += '<div id="slice_2" class="slice s2">';
                struct += '<div id="slice_3" class="slice s3">';
                struct += '<div id="slice_4" class="slice s4">';
                struct += '<div id="slice_5" class="lastSlice s5">';
                struct += '</div>';
                struct += '</div>';
                struct += '</div>';
                struct += '</div>';
                struct += '</div>';

                var $struct = $(struct);
                $item.find('img').remove().end().append($struct).find('div.slice').css('background-repeat', 'no-repeat')
                $item.find('img').remove().end().append($struct).find('div.lastSlice').css('background-repeat', 'no-repeat')

                $item.find('img').remove().end().append($struct).find('div.slice').css('background-image', 'url(' + img + ')').prepend($('<span class="overlay" ></span>'));
                $item.find('img').remove().end().append($struct).find('div.lastSlice').css('background-image', 'url(' + img + ')').prepend($('<span class="overlay" ></span>'));

            });

        });

    };

})(jQuery);