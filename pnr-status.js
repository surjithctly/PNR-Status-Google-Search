/*
Name: PNR Status in Google Search
Keywords: pnr|status|irctc|rail|indianrail|enq|enquiry|railway|train|indian railway
Created by: Surjith S M © 2015-2020
*/


// Set HTML block is not run
var pushHTMLFlag = false;
var lastcookieValue = '';
var todaysdate = moment().format('D-MMM-YYYY');


// Function to insert HTML if conditions are true
function pushPNRCard() {
	// Run only if flag is false
    if (pushHTMLFlag == false) {

	if ($.cookie('lastpnr') != null){
		lastcookieValue = $.cookie('lastpnr');
	}
	
        // html code block to inster
        var vcardHTMLBlock = '<div class="g tpo knavi obcontainer pnr_card_block">' +
            '<div class="vk_c card-section" style="min-height:72px;line-height:1">' +
            '<div class="cwmd">' +
            '<div class="cwed">' +
            '  <div class="cwled">' +
            '  <div class="cwletbl" id="cwletbl">' +
            '   <div class="cwleotc"><div class="_kvb">'+
			'<div class="_Igb kno-ecr-pt r-search-5">Check PNR Status</div></div> </div>' +
			'<div class="pnr_row"> <input value="'+ lastcookieValue +'" class="pnr_input" placeholder="Enter PNR Number" id="pnr_no" maxlength="10" /><div class="cwbbc-c cwbd cwbbc3" >   <div class="cwbtpl cwbb-tpl cwbbts" id="getPNRbutton"> <span class="cwbts">Get PNR Status</span> </div></div> </div>'+
            ' <div class="pnr-result-block" id="pnr_result"></div> </div>' +
            ' </div>' +
            '  </div>' +
            ' </div>' +
            ' </div>' +
            '<div class="vk_ftr" style="float:right"><a href="http://surjithctly.in/labs/irctc/pnr-status/" target="_blank">' +
            'More&nbsp;info</a></div>' +
            '</div>';
		// Prepend HTML Block in to search result
        $("#center_col").prepend(vcardHTMLBlock);
		//Set Flag as true
        pushHTMLFlag = true;
		autorunPNR();

    }
}
//Function to find matching keywords
function checkSearchKeyword() {
    var valid_keyword_regex = "pnr|status|irctc|rail|ticket|indianrail|enq|enquiry|railway|train|indian railway";
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
if ($.cookie('lastpnr') != null){
		fetchPNRdetails();
}
}

$(document).on('click','#getPNRbutton', function() {
	fetchPNRdetails();
});


function fetchPNRdetails() {

	var api_key = 'e81a2917-70a4-4a98-a2be-ce5eb06aee40'; //50797
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
    method: 'POST',
    action: 'xhttp',
    url: 'http://api.erail.in/pnr?key='+api_key+'&pnr='+pnr_no,
    data: ''
}, function(responseText) {
	var resp = JSON.parse(responseText);
    var FromCity,ToCity,BoardingCity;
 	  if (resp.status == 'OK') {
	
	 $result_block.html('');
	
	   $result_block.append('<div class="pnr_cur_status" id="pnr_cur_status"> </div> ');
   		
			for(var i = 0; i < resp.result.passengers.length; i++) {
			 var passengersobj = resp.result.passengers[i];

			 $('#pnr_cur_status').append('<div class="curr_stat_single">' +
			 '<h1>' + passengersobj.currentstatus + '</h1>' +
			 '<p> Booking status:' + passengersobj.bookingstatus +'</p></div>');
			 
			}
			 	 
		  $result_block.append('<div class="charting-status">' + resp.result.chart + '</div>');		 
		
		$result_block.append('<div class="other-stuff" id="other-stuff"></div>');			 
	
	
	
	$('#other-stuff').append('<div class="other-item-single"><h2>' +resp.result.journey +
	 '</h2><p>Journey date</p></div>');
	 
	 $('#other-stuff').append('<div class="other-item-single"><h2>' +resp.result.name +
	 '</h2><p>Train name</p></div>');
	 
	  $('#other-stuff').append('<div class="other-item-single"><h2>' +resp.result.trainno +
	 '</h2><p>Train No.</p></div>');
	 
	 $('#other-stuff').append('<div class="other-item-single"><h2>' +resp.result.cls +
	 '</h2><p>Class</p></div>');
	 
	 
	 $('#other-stuff').append('<div class="other-item-single" id="travel_from"></div><div class="other-item-single" id="travel_to"></div>');
	 
	 $result_block.append(' <div class="boarding-from" id="boarding-from"></div>');
	
	$.getJSON(chrome.extension.getURL('stations.json'), function(data){
    //console.log(data);
 	for (var i = 0; i < data.length; i++) {
		 if (data[i].code == resp.result.from) {
			   FromCity = data[i].name; 
			   $('#travel_from').append('<h2>' + FromCity + ' (' +resp.result.from +')</h2><p>Booked from</p>');
 		 }
		 if (data[i].code == resp.result.to) {
			   ToCity = data[i].name; 
			   $('#travel_to').append('<h2>' + ToCity + ' (' +resp.result.to +')</h2><p>Travelling to</p>');
		 }
		 if (data[i].code == resp.result.brdg) {
			   BoardingCity = data[i].name; 
			    $('#boarding-from').append('Boarding from <strong>' + BoardingCity + ' (' +resp.result.brdg +  ')</strong>');		 
		 }
	}
   });
	
	   var journeyDate = moment(new Date(resp.result.journey)).format('D-MMM-YYYY');

	var diffToday = moment(new Date(todaysdate));
	var diffjourney = moment(new Date(journeyDate));
	var diffdays = diffjourney.diff(diffToday, 'days');

		$.cookie('lastpnr', resp.result.pnr, { expires: diffdays+1 });
		

					
		  }
		  else { 
			  $result_block.html('<h3 id="loading_span" class="loading_span">Oops, Something went wrong. <br> <span>Please try again later.</span></h3>');
		  }
	
	
});     
	
}
