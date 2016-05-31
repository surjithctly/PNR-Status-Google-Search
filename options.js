/*
 ** file: options.js
 ** description: javascript code for "options.html" page
 */
function init_options() {
    //  console.log("function: init_options");

    //load currently stored options configuration
    var $inputs = $('#options-area :input');
    $inputs.each(function() {
        if (typeof localStorage[this.name] != 'undefined') {
            $(this).val(localStorage[this.name]);
        }
    });

    var $checkboxes = $('#options-area :input[type=checkbox]');
    $checkboxes.each(function() {
        if (localStorage[this.name] == 'false') {
            //alert(localStorage[this.name])
            $(this).attr('checked', false);
        } else if (localStorage[this.name] == 'true') {
            $(this).attr('checked', true);
        }
    });

    // Hide Donation
    // if (!localStorage.personal_token || localStorage.donated == 'true') {
    //     $('.donate-paypal').hide();
    // }

}

function save_options() {
    // console.log("function: save_options");

    $("input[type=text],select,textarea").each(function() {
        localStorage[$(this).attr("name")] = $(this).val();
    });

    $("input[type=checkbox]").each(function() {
        localStorage[$(this).attr("name")] = $(this).prop("checked");
    });

    $(this).text('Saving...').removeClass("btn-success");

    setTimeout(function() {
        $('#save-options-button').text('Options Saved');
    }, 700);

    // Ask for a good review
    if (!localStorage.reviewed) {
        $('#rate-it').html('<div class="highlight">Enjoying <strong>this extension</strong>? Head over to the <a class="fivestars" href="https://chrome.google.com/webstore/detail/pnr-status-in-google-sear/ceaefpppengfbihcndeidejjioclddlb/reviews" target="_bank">Chrome Web Store</a> and give it 5 stars. That means <em>a lot to me</em>.</div>');
    }

    get_sales_data();
    get_comment_data();
    chrome.extension.getBackgroundPage().updatedSettings();

}

/**
 * Reset the save button
 */
$('input, select').on('keyup click', function() {
    $('#save-options-button').text('Save Options').addClass("btn-success");
});

/**
 * Store that the user has already been to the Web Store <3 )
 */

$('body').on('click', '.fivestars', function() {
    localStorage.reviewed = true;
    $('#rate-it').html('<div class="highlight love">You\'re <strong>awesome</strong> &hearts;');
});

/*$('body').on('click', '#paypalbtn', function() {
    localStorage.donated = true;
    $('.donate-paypal').html('<div class="highlight love">Thank you for donating. You\'re <strong>awesome</strong> &hearts;');
});
*/ 

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_options);
document.querySelector('#save-options-button').addEventListener('click', save_options);
