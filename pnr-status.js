/*
Name: PNR Status in Google Search
Keywords: pnr|status|irctc|rail|indianrail|enq|enquiry|railway|train|indian railway
Created by: Surjith S M © 2015-2020
*/


// Set HTML block is not run
var pushHTMLFlag = false;
var lastcookieValue = '';
var todaysdate = moment().format('D-MMM-YYYY');
var optionsurl = chrome.extension.getURL("options.html");

var apikey;
chrome.runtime.sendMessage({
        method: "getLocalStorage",
        keys: ["apikey"]
    },
    function(response) {
        apikey = response.data.apikey;
    }
);

// Function to insert HTML if conditions are true
function pushPNRCard() {
    // Run only if flag is false
    if (pushHTMLFlag == false) {


        if (Cookies.get('lastpnr')) {
            lastcookieValue = Cookies.get('lastpnr');
        }

        // html code block to inster
        var vcardHTMLBlock = '<div class="pnr_card_block">' +
            '<div class="pnr-card-section">' +
            '<div class="check-pnr-title">Check PNR Status</div>' +
            '<div class="pnr_row"> <form id="getPNRStatus" action="" method="post">'+ 
            '<input type="number" value="' + lastcookieValue + '" class="pnr_input" pattern=".{10,}" title="Minimum 10 charactors needed" placeholder="Enter PNR Number" id="pnr_no" maxlength="10" minlength="10" required />' +
            '<div class="pnr-button-wrap" >   <button type="submit" class="pnr-primary-btn" id="getPNRbutton"> <span class="pnr-text">Get PNR Status</span> </button></div> </form> </div>' +
            ' <div class="pnr-result-block" id="pnr_result"></div> </div>' +
            '<div class="more-info"><a href="http://surjithctly.in/labs/irctc/pnr-status/" target="_blank">' +
            'More info</a></div>' +
            '</div>';
        // Prepend HTML Block in to search result
        if (apikey) {
        $("#center_col").prepend(vcardHTMLBlock);
    } else {
    	$("#center_col").prepend('<div class="pnr_card_block"><div class="pnr-card-section"><div class="check-pnr-title">Check PNR Status</div><p>Please add an API key in the <a href="'+optionsurl+'" target="_blank">PNR Status Options</a> page</p></div></div>');
    }
 
        //Set Flag as true
        pushHTMLFlag = true;
        autorunPNR();

    }
}
//Function to find matching keywords
function checkSearchKeyword() {
    var valid_keyword_regex = "pnr|pnr status|train status";
    var re = new RegExp(valid_keyword_regex, 'ig');
    var searchKeyword = $('title').text();
    if (searchKeyword.match(re)) {
        //successful match
        setTimeout(function() {
            /*Run Push HTML Card */
            pushPNRCard();
            //console.log('dom inserted run');
        }, 100);
    } else {
        //do nothing
    }

}

// Run on page reload also
$(document).ready(function() {
    if ($('#search').length) {
        checkSearchKeyword();
    }
});

// Run on Dom Node Inserted
$(document).on('DOMNodeInserted', function(e) {
    if (pushHTMLFlag == false) {
        //console.log(pushHTMLFlag);
        if ($('#search').length) {
            checkSearchKeyword();
        }
    }
});

function autorunPNR() {
    if (Cookies.get('lastpnr')) {
        fetchPNRdetails();
    }
}

$(document).on('submit', '#getPNRStatus', function(e) {
    e.preventDefault();
    fetchPNRdetails();
});


function fetchPNRdetails() {

    //var api_key = 'e81a2917-70a4-4a98-a2be-ce5eb06aee40'; //50797
    //url: 'http://api.erail.in/pnr?key='+api_key+'&pnr='+pnr_no,
    //var api_key = 'zpmqq6093';


    // API URL: https://api.railwayapi.com/pnr_status/pnr/'+pnr_no+'/apikey/'+ api_key
    var pnr_no = $('#pnr_no').val();
    var $result_block = $('#pnr_result');
    /*$.getJSON('https://api.railwayapi.com/pnr_status/pnr/'+pnr_no+'/apikey/'+ api_key, function(data){
        console.log(data);
    }).done(function() {
        console.log( "second success" );
      })
      */
    $result_block.show();
    $result_block.html('<h3 id="loading_span" class="loading_span"><img src="https://ssl.gstatic.com/s2/oz/images/notifications/spinner_32_041dcfce66a2d43215abb96b38313ba0.gif" alt="loading" width="20">Fetching data... Hang on..</h3>');

    chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: 'http://api.railwayapi.com/pnr_status/pnr/' + pnr_no + '/apikey/' + apikey + '/',
        data: ''
    }, function(responseText) {
        var resp = JSON.parse(responseText);
        var FromCity, ToCity, BoardingCity;
        if (resp.response_code == '200') {


            $result_block.html('');

            $result_block.append('<div class="pnr_cur_status" id="pnr_cur_status"> </div> ');

            for (var i = 0; i < resp.passengers.length; i++) {
                var passengersobj = resp.passengers[i];

                $('#pnr_cur_status').append('<div class="curr_stat_single">' +
                    '<h1>' + passengersobj.current_status + '</h1>' +
                    '<p> Booking status:' + passengersobj.booking_status + 
                    ((passengersobj.coach_position != '0') ? '<br> Coach Position:' + passengersobj.coach_position : '') + ' </p></div>');

            }

            $result_block.append('<div class="charting-status">' + ((resp.chart_prepared == 'Y') ? 'CHART PREPARED' : 'CHART NOT PREPARED') + '</div>');

            $result_block.append('<div class="other-stuff" id="other-stuff"></div>');



            $('#other-stuff').append('<div class="other-item-single"><h2>' + moment(resp.doj, 'D-M-YYYY').format('D-MMM-YYYY') +
                '</h2><p>Journey date</p></div>');

            $('#other-stuff').append('<div class="other-item-single"><h2>' + resp.train_name +
                '</h2><p>Train name</p></div>');

            $('#other-stuff').append('<div class="other-item-single"><h2>' + resp.train_num +
                '</h2><p>Train No.</p></div>');

            $('#other-stuff').append('<div class="other-item-single"><h2>' + resp.class +
                '</h2><p>Class</p></div>');


            $('#other-stuff').append('<div class="other-item-single" id="travel_from"></div><div class="other-item-single" id="travel_to"></div>');

            $result_block.append(' <div class="boarding-from" id="boarding-from"></div>');

            $('#travel_from').append('<h2>' + resp.from_station.name + ' (' + resp.from_station.code + ')</h2><p>Booked from</p>');

            $('#travel_to').append('<h2>' + resp.to_station.name + ' (' + resp.to_station.code + ')</h2><p>Travelling to</p>');

            $('#boarding-from').append('Boarding from <strong>' + resp.boarding_point.name + ' (' + resp.boarding_point.code + ')</strong>');

            
            var journeyDate = moment(resp.doj, 'D-M-YYYY').format('D-MMM-YYYY');
 
            var diffToday = moment(new Date(todaysdate));
            var diffjourney = moment(new Date(journeyDate));
            var diffdays = diffjourney.diff(diffToday, 'days');

 
            if (diffdays >= 0) {
                Cookies.set('lastpnr', resp.pnr, { expires: diffdays + 1 });
            }


        } else if (resp.response_code == '204') {
            $result_block.html('<h3 id="loading_span" class="loading_span">Empty response. Server seems to be busy. <br> <span>Please try once again.</span></h3>');
        } else if (resp.response_code == '401') {
            $result_block.html('<h3 id="loading_span" class="loading_span">API Authentication Error. <br> <span>Please double check your API Key.</span></h3>');
        } else if (resp.response_code == '403') {
            $result_block.html('<h3 id="loading_span" class="loading_span">API Quota for the day exhausted <br> <span>Please try again tomorrow.</span></h3>');
        } else if (resp.response_code == '405') {
            $result_block.html('<h3 id="loading_span" class="loading_span">API Account Expired <br> <span>Please renew your API key.</span></h3>');
        } else {
            $result_block.html('<h3 id="loading_span" class="loading_span">Oops, Something went wrong. <br> <span>Please try again later.</span></h3>');
        }


    });

}
