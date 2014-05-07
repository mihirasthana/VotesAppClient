document.addEventListener("deviceready", onDeviceReady, false);
var globalliveurl = "http://votesapp.elasticbeanstalk.com";
//	constants
	var phonenum="";
var poll_question_key="\"poll_question\":";
var poll_id_key = "\"poll_id\":"; 
var poll_voter_option_key="\"poll_voter_option\":";
var poll_voter_id_key= "\"poll_voter_id\":";
var poll_options_key="\"poll_options\":";
var poll_create_date_key="\"poll_create_date\":";
var poll_end_date_key="\"poll_end_date\":";
var poll_creator_key="\"poll_creator\":";
var phonenum_key="\"phone_number\":";
var poll_category_key="\"poll_category\":";
var poll_groupid_key="\"poll_groupid\":";
var poll_participants_key="\"poll_participants\":";
var poll_public_key="\"poll_public\":";
var poll_voter_location_key="\"poll_voter_location\":";
var dq="\"";
var poll_voter_location_Latitude = '';
var poll_voter_location_Longitude= '';
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var poll_media_type_key = "\"poll_media_type\":";
function onDeviceReady()
{
	sessionStorage.phonenum=getMyPhoneNumber();
	//showMyCreatedPolls(sessionStorage.phonenum);
	//getContactList();
	//getMyGroups(sessionStorage.phonenum);
	//showMyPolls(sessionStorage.phonenum);
	//showAllPolls(sessionStorage.phonenum);
	navigator.geolocation.getCurrentPosition(onSuccesss, onErrors);

	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;

	document.addEventListener("backbutton", onBackButtonDown, false);
}

function onBackButtonDown() {
	// Handle the back button
	//alert("back button pressed.");
	//if($.mobile.activePage[0].baseURI == )
	//alert($.mobile.activePage[0].baseURI);
	//window.location='./home.html';
}

var onSuccesss = function(position) {

	poll_voter_location_Latitude = position.coords.latitude;
	poll_voter_location_Longitude = position.coords.longitude;
};

//onError Callback receives a PositionError object

function onErrors(error) {
	alert('code: '    + error.code    + '\n' +
			'message: ' + error.message + '\n');
}


function getMyPhoneNumber()
{
	var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
	var returnval;
	telephoneNumber.get(function(result) {
		returnval = result.substr(-10);
	}, function() {
		alert("telephonenum error");
	});
	return returnval;
}
//}
$('#addoption').click(function()
		{
	var count = $("#optionlistul > li").length;
	if(count < 6) {
		var num=count +1;
		var html="<li id='listoption"+num+"' data-role='fieldcontain'>" +
		"<label id='labeloption"+num+"' for='option' style='font-weight: bold'>Option"+num+":</label> " +
		"<input class='clearInput' type='text' name='option"+num+"' id='option"+num+"' /></li>";
		//alert(html);
		$( html ).appendTo( "#optionlistul" );
		$("#optionlistul").listview("refresh").trigger("create");
	}

		});

$("#deleteoption").click(function() {
	var count = $("#optionlistul > li").length;
	if(count > 2) {
		$("#listoption"+count).remove();
		$("#optionlistul").listview("refresh");
	}
})


function getPollDate()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = mm+'/'+dd+'/'+yyyy;
	return today;
}

function getCreatePollJSON(pollType){

	var createPollString = "{"+poll_question_key+"\""+($('#question').val())+"\","+poll_options_key+"[";
	var selectOptions = new Array();
	var temp="";
	var mediaType = 1;
	for(i=1;i<=($('#optionlistul li').length);i++)
	{
		temp=temp+$('#option'+i).val();

		if(i !=($('#optionlistul li').length))
			temp=temp+",";
	}
	createPollString=createPollString+temp+"],"+poll_create_date_key+dq+getPollDate()+dq+","+poll_end_date_key+dq+($('#enddate').val())+dq+","+poll_creator_key+dq+sessionStorage.phonenum+dq+","+poll_category_key+dq+$( "#categories" ).val()+dq+",";

	if(pollType !== "submitToPublic")
	{
		var selectedValues = new Array();
		$.each($("input[name='checkedGroups']:checked"), function() {
			selectedValues.push($(this).val());
		});
		temp="";
		for(i=0;i<selectedValues.length;i++)
		{
			temp=temp+dq+selectedValues[i]+dq;
			if(i !=(selectedValues.length-1))
				temp=temp+",";
		}
		createPollString=createPollString+poll_groupid_key+"["+temp+"],";
		temp='';

		var selectedContacts = new Array();
		selectedValues=[];
		$.each($("input[name='checkedContactsPoll']:checked"), function() {
			selectedValues.push($(this).val());
		});
		temp="";
		for(i=0;i<selectedValues.length;i++)
		{
			temp=temp+dq+selectedValues[i].replace(/[^\w]/gi, '').substr(-10)+dq;
			if(i !=(selectedValues.length-1))
				temp=temp+",";
		}
		createPollString=createPollString+poll_participants_key+"["+temp+"],"+poll_public_key+dq+"no"+dq+','+poll_media_type_key+mediaType+"}";
		temp="";
	}
	else
	{
		createPollString=createPollString+poll_groupid_key+'[],'+poll_participants_key+'[],'+poll_public_key+dq+'yes'+dq+','+poll_media_type_key+mediaType+'}';

	}

	//alert(createPollString);
	return createPollString;

}

function getContactList()
{
	function sortByContactName(a, b) { var x = a.name.formatted.toLowerCase(); var y = b.name.formatted.toLowerCase(); return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
	function onSuccess(contacts) {
		contacts.sort(sortByContactName);
		var html="";
		for (var i = 0; i < contacts.length ; i++) {
			if(contacts[i].name != null && contacts[i].phoneNumbers != null) {
				var name=contacts[i].name.formatted;
				for(var j = 0; j< contacts[i].phoneNumbers.length;j++) {
					var phone=(contacts[i].phoneNumbers[j].value).replace(/[^\w]/gi, '');
					if(phone.length >= 10)
						html +="<li><label><input type='checkbox' name='checkedContactsPoll' class='checkcontacts' value='"+contacts[i].phoneNumbers[j].value+"'>"+name+" &nbsp;" + phone + "</label></li>";
				}
			}
		}

		$("#selectContactsList").empty();
		$( html ).appendTo( "#selectContactsList" );
		$("#selectContactsList").listview("refresh");
	};
	function onError(contactError) {
		alert('onError!');
	};

	var options      = new ContactFindOptions();
	options.filter	 = "";
	options.multiple = true;
	var fields       =  ["displayName", "name", "phoneNumbers"];
	navigator.contacts.find(fields, onSuccess, onError, options);
}


$("#selectContactBtn").click(function() {	
	//alert("Friends button");
	getContactList();	
});

$("#selectGroupBtn").click(function() {	
	//alert("Friends button");
	getMyGroups(sessionStorage.phonenum);	
});

$("#assignedPollsBtn").click(function() {	
	//alert("Friends button");
	showMyPolls(sessionStorage.phonenum);	
});

$("#publicPollsBtn").click(function() {	
	//alert("Friends button");
	showAllPolls(sessionStorage.phonenum);	
});


$('.submitPoll').click(function()
		{
	var data=getCreatePollJSON(($(this).attr('id')));
	//alert("Data:"+data);
	var url = globalliveurl +"/api/votesapp/poll";	
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll";
	$.ajax({
		type: "POST",
		//contentType: "application/json",
		//dataType: "json",
		url: url,
		data: data,
		success: function(msg){
			//$("body").append(msg.d);
			//alert("success");
			var obj = jQuery.parseJSON( ''+ msg +'' );
			//alert("Poll Media Type:"+poll_media_type_key+($('#smallImage').attr("src"))+"msg:"+msg+" pollid:"+obj.PollId);
			if((($('#smallImage').attr("src"))!= '') && ($('#smallImage').attr("src")) != null )
			{
			sendMediaToS3(1,($('#smallImage').attr("src")),obj.PollId);
			}
			location.href="#home-page";
		},
		error: function () {
			alert("Error");
		}
	});

		});

/*$('#selectgroups').click(function()
		{
	getMyGroups(sessionStorage.phonenum);
		});*/

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}
function getMyGroups(phonenum){
	//alert("get my groups:groups" + phonenum);
	var data="phone_number={"+phonenum_key+ "\""+phonenum+"\"}";
	var url = globalliveurl +"/api/user/groups";
	//var url="http://10.0.2.2:8080/VotesApp/api/user/groups";
	$.ajax({
		type: "GET",
		url: url,
		data:data,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			var html= "";
			if(!(isEmpty(obj)))
			{

				for(var i=0;i<obj.groups.length;i++) {
					html += '<li><label><input type="checkbox" name="checkedGroups" class="checkgroups" value = "'+ obj.groups[i]._id.$oid +'">'+obj.groups[i].name+'</label></li>';
				}

			}
			else
			{
				html += '<li>No Groups Found</li>'; 
			}
			//alert(html);
			$( "#selectgroupslist" ).empty();
			$( html ).appendTo( "#selectgroupslist" );
			//$("#myGroupList").html(html);
			//$("#selectgroupslist").listview("refresh").trigger("create");
			//$( ".groupListItem" ).bind( "taphold", tapholdHandler );
			//$( ".groupListItem" ).bind( "tap", getMyGroupDetails );
		},
		complete: function() {
			$("#selectgroupslist").listview("refresh").trigger("create");
		},
		error: function () {
			alert("Error");
		}
	});
}


/*$('#addoption').click(function()
		{
	showMyPolls(sessionStorage.phonenum);
		});*/
function escapeCharsForOptions(jmsg)
{
	var pollOptions=new Array();
	pollOptions = jmsg.split(",");
	for(var i=0;i<pollOptions.length;i++)
	{
		pollOptions[i] = pollOptions[i].replace('\\\"', "");
		pollOptions[i] = pollOptions[i].replace("]","");
		pollOptions[i] = pollOptions[i].replace("[","");
		pollOptions[i] = pollOptions[i].replace(/"/g, "");
	}

	return pollOptions;
}

function showMyPolls(phonenum)
{
	//alert("inside showMyPolls");
	var url = globalliveurl +"/api/votesapp/poll/pollsAssigned/"+phonenum;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/pollsAssigned/"+phonenum;

	$.ajax({
		type: "GET",
		async:false,
		url: url,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			var tempArr = new Array();
			var html1= '';
			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.My_Polls.length;i++) {
					html1 += '<li class="polldetailssclass" id= "' + obj.My_Polls[i].poll_id+'">'+obj.My_Polls[i].poll_question+'</li>';
				}
			}
			//'<input type="radio" name="choice" id="choice" value="'+My_Polls[i].poll_options[j]+'"><label for="choice">'+obj.My_Polls[i].poll_options[j]+'</label>'
			else
				html1 += '<li>No Assigned Polls Exists!!</li>';

			//$('#questionP').html(html3 );
			$("#myAssignedList").empty();
			$( html1 ).appendTo( "#myAssignedList" );
			//alert(html1);
			$( ".polldetailssclass" ).bind( "tap", tapHandler );

			//$("#myAssignedList").listview("refresh");


		},
		complete: function() {
			$("#myAssignedList").listview("refresh");
		},
		error: function () {
			alert("Error");
		}
	});
}

function redirectToGroup()
{
	window.location='./groups.html';
}

function tapHandler( event ){
	//alert("tapped");
	var data=event.target.getAttribute("id");
	alert("id:"+data);
	var url = globalliveurl +"/api/votesapp/poll/ById/"+data;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/ById/"+data;
	var temp_mem_name="";
	$.ajax({
		async:false,
		type: "GET",
		url: url,
		data:data,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			$("#privatePollHidden").val(msg);
			var html= "";
			if(!(isEmpty(obj)))
			{
				html= obj.This_Poll[0].poll_question;
				alert(html);
				$('#questionPrivateLi').html(html);
				html= obj.This_Poll[0].poll_creator;
				alert(html);
				$('#PrivatePollByDetailsLi').html(html);
				html='';
				tempArr = escapeCharsForOptions(obj.This_Poll[0].poll_options);
				for(var j=0;j<tempArr.length;j++)
				{
					html+= '<input type="radio" name="choice2" value="'+(j+1)+'" id="radio-choice-v-6' + j +'" checked="checked"><label for="radio-choice-v-6' + j +'">'+ tempArr[j] +'</label>';
				}
				tempArr = [];

			}
			alert("html:"+html);
			//$('#questionPublic').html(html );
			$('#privateOptions').empty();
			$(html).appendTo("#privateOptions");
			location.href="#showPollDetails";
		},
		error: function () {
			alert("Error");
		}
	});


}

function showAllPolls(phonenum)
{
	//alert("inside showAllPolls");
	var url = globalliveurl +"/api/votesapp/poll/All/"+phonenum;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/All/"+phonenum;
	//alert(url);
	$.ajax({
		type: "GET",
		async:false,
		url: url,
		success: function(msg){
			alert(msg);
			var obj = jQuery.parseJSON( ''+ msg +'' );
			var tempArr = new Array();
			var html1= '';
			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.All_Polls.length;i++) {
					html1 += '<li class="publicpolldetailssclass" id= "' + obj.All_Polls[i]._id.$oid+'">'+obj.All_Polls[i].poll_question+'</li>';
				}
			}


			//'<input type="radio" name="choice" id="choice" value="'+My_Polls[i].poll_options[j]+'"><label for="choice">'+obj.My_Polls[i].poll_options[j]+'</label>'
			else
				html1 += '<li>No Assigned Polls Exists!!</li>';

			//$('#questionP').html(html3 );
			$("#myAllPollsList").empty();
			$( html1 ).appendTo( "#myAllPollsList" );
			//alert(html1);
			$( ".publicpolldetailssclass" ).bind( "tap", tapPublicPollDetails );

			//$("#myAssignedList").listview("refresh");


		},
		complete: function() {
			$("#myAllPollsList").listview("refresh");
		},
		error: function () {
			alert("Error");
		}
	});

}

function tapPublicPollDetails( event ){
	alert("tapped");
	var data=event.target.getAttribute("id");
	//alert("id:"+data);
	var url = globalliveurl +"/api/votesapp/poll/ById/"+data;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/ById/"+data;
	var temp_mem_name="";
	$.ajax({
		async:false,
		type: "GET",
		url: url,
		data:data,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			$("#publicPollHidden").val(msg);
			var html= "";
			if(!(isEmpty(obj)))
			{
				/*
				 <fieldset data-role="controlgroup" data-mini="true">
				 	<legend>Vertical:</legend>
					    <input name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked" type="radio">
					    <label for="radio-choice-v-2a">One</label>
					    <input name="radio-choice-v-2" id="radio-choice-v-2b" value="off" type="radio">
					    <label for="radio-choice-v-2b">Two</label>
					    <input name="radio-choice-v-2" id="radio-choice-v-2c" value="other" type="radio">
					    <label for="radio-choice-v-2c">Three</label>
			     </fieldset>
				 */
				html= obj.This_Poll[0].poll_question;
				alert(html);
				$('#questionPublicLi').html(html);
				html= obj.This_Poll[0].poll_creator;
				alert(html);
				$('#PublicPollByDetailsLi').html(html);
				html='';
				tempArr = escapeCharsForOptions(obj.This_Poll[0].poll_options);
				for(var j=0;j<tempArr.length;j++)
				{
					html+= '<input type="radio" name="choice1" value="'+(j+1)+'" id="radio-choice-v-6' + j +'" checked="checked"><label for="radio-choice-v-6' + j +'">'+ tempArr[j] +'</label>';
				}
				tempArr = [];

			}
			alert("html:"+html);
			//$('#questionPublic').html(html );
			$('#publicOptions').empty();
			$(html).appendTo("#publicOptions");
			location.href="#showPublicPollDetailsPage";
		},
		error: function () {
			alert("Error");
		}
	});

}

function getVoteJSON(msg,type)
{
	var voteString='';
	var obj = jQuery.parseJSON( ''+ msg +'' );
	var temp='';
	voteString = '{'+poll_id_key+obj.This_Poll[0].poll_id+',';
	if(type == 1)
	{
		temp=''+($("input:radio[name=choice1]:checked" ).val());
		//alert("Temp Public:"+temp+" val"+$("input:radio[name=choice1]:checked" ).val());
	}
	else
	{

		//alert("Inside type 2");
		temp=''+($("input:radio[name=choice2]:checked" ).val());
		//alert("Temp Private:"+temp);
	}

	voteString+=poll_voter_option_key+temp+','+poll_voter_id_key+dq+sessionStorage.phonenum+dq+','+poll_question_key+dq+obj.This_Poll[0].poll_question+dq+','+poll_options_key+obj.This_Poll[0].poll_options+','+
	poll_create_date_key+dq+obj.This_Poll[0].poll_create_date+dq+','+poll_end_date_key+dq+obj.This_Poll[0].poll_end_date+dq+','+
	poll_creator_key+dq+obj.This_Poll[0].poll_creator+dq+','+poll_category_key+dq+obj.This_Poll[0].poll_category+dq+','+poll_voter_location_key+
	'{'+dq+'latitude'+dq+':'+dq+poll_voter_location_Latitude+dq+','+dq+'longitude'+dq+':'+dq+poll_voter_location_Longitude+dq+'}}';
	//alert("VoteString:"+voteString);
	return voteString;
}
$('#votePublic').click(function()
		{
	var url = globalliveurl +"/api/votesapp/poll/myVote";
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/myVote";
	var msg = $("#publicPollHidden").val();
	var data = getVoteJSON(msg,1);
	alert(data);
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			//alert(obj.Msg);
			//alert(obj.Msg+data);
			//alert("Public Poll Voted Successfully");
			showAllPolls(sessionStorage.phonenum);
			location.href="#showAllPollsPage";
		},
		error: function () {
			alert("Error");
		}
	});

		});

$('#vote').click(function()
		{
	var url = globalliveurl +"/api/votesapp/poll/myVote";
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/myVote";
	var msg = $("#privatePollHidden").val();
	//alert("MSG from Vote:"+msg);
	var data = getVoteJSON(msg,2);
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(msg){
			alert("success");
			showAllPolls(sessionStorage.phonenum);
			location.href="#showPollsPage";
		},
		error: function () {
			alert("Error");
		}
	});

		});

function showMyCreatedPolls(phonenum)
{

	//alert("ShowMyCreatedPolls");
	var url = globalliveurl +"/api/votesapp/poll/myPolls/"+phonenum;
	$.ajax({
		type: "GET",
		async:false,
		url: url,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			var tempArr = new Array();
			var html1= '';
			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.My_Polls.length;i++) {
					html1 += '<li class="createdpolldetailssclass" id= "' + obj.My_Polls[i].poll_id+'">'+obj.My_Polls[i].poll_question+'</li>';
				}
			}
			else
				html1 += '<li>You have Not Created Any Polls!!</li>';
			$("#myCreatedList").empty();
			$( html1 ).appendTo( "#myCreatedList" );
			$( ".createdpolldetailssclass" ).bind( "tap", tapCreatedPollDetails );

		},
		complete: function() {
			$("#myCreatedList").listview("refresh");
		},
		error: function () {
			alert("Error");
		}
	});

}

function tapCreatedPollDetails( event ){
	alert("tapped");
	var data=event.target.getAttribute("id");
	//alert("id:"+data);
	var url = globalliveurl +"/api/votesapp/poll/ById/"+data;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/ById/"+data;
	var temp_mem_name="";
	$.ajax({
		async:false,
		type: "GET",
		url: url,
		data:data,
		success: function(msg){
			//alert("success");
			var obj = jQuery.parseJSON( ''+ msg +'' );
			$("#myCreatedPollHidden").val(msg);
			$('#pollIdForCharts').val(obj.This_Poll[0].poll_id);
			var html= "";
			//createdPollDetails
			if(!(isEmpty(obj)))
			{
				//html+='<p data-theme="a">'+obj.This_Poll[0].poll_question+'</p><fieldset data-role="controlgroup"><legend>Options</legend>';
				//$("#questionCreated").empty();
				html= obj.This_Poll[0].poll_question;
				//alert(html);
				$('#questionCreatedLi').html(html);
				html='<li data-role="divider" data-theme="b">Options:</li>';
				tempArr = escapeCharsForOptions(obj.This_Poll[0].poll_options);
				for(var j=0;j<tempArr.length;j++)
				{
					html+='<li data-theme="c">'+tempArr[j]+'</li>';

				}
				//alert(html);
				$("#createdPollOptionsUl").empty();

				$(html).appendTo( "#createdPollOptionsUl" );
				html="";
				if(obj.This_Poll[0].poll_groupname.length!=0)
				{
					html='<li data-role="divider" data-theme="e">Created For Groups:</li>';
					for(var i=0;i<obj.This_Poll[0].poll_groupname.length;i++)
					{
						html+='<li>'+obj.This_Poll[0].poll_groupname[i]+'</li>';
					}
				}
				//$("#createdPollDetailsUl").listview("refresh").trigger("create");
				else if(obj.This_Poll[0].poll_groupname.length!=0)
				{
					html='<li data-role="divider" data-theme="e">Created For Friends:</li>';
					for(var i=0;i<obj.This_Poll[0].poll_participants.length;i++)
					{
						html+='<li>'+obj.This_Poll[0].poll_participants[i]+'</li>';
					}
				}
				else
				{
					html+='<li data-role="divider" data-theme="e">Created for Public</li>';
				}
				$("#createdPollForDetailsUl").empty();
				$(html).appendTo( "#createdPollForDetailsUl" );

				tempArr = [];

			}
			//alert("html:"+html);
			//$('#mYquestionP').html(html );
			location.href="#showCreatedPollDetails";
		},
		complete: function() {
			$("#createdPollOptionsUl").listview("refresh");
			$("#createdPollForDetailsUl").listview("refresh");
		},
		error: function () {
			alert("Error");
		}
	});
}

$('#showCreatedPollsBtn').click(function()
		{
	showMyCreatedPolls(sessionStorage.phonenum);

		});

$('#quickVote').click(function()
		{
	//alert("in quick vote");
	showAllPolls(sessionStorage.phonenum);

		});



function onPhotoDataSuccess(imageData) {

	var smallImage = document.getElementById('smallImage');
	var largeImage = document.getElementById('largeImage');
	smallImage.src = "data:image/jpeg;base64," + imageData;
	largeImage.src = "data:image/jpeg;base64," + imageData;
}

function onPhotoURISuccess(imageURI) {

	var smallImage = document.getElementById('smallImage');
	var largeImage = document.getElementById('largeImage');
	smallImage.src = imageURI;
	largeImage.src = imageURI;
}


function getPhoto(source) {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
		destinationType: destinationType.FILE_URI,
		sourceType: source });
}

function onFail(message) {
	alert('Failed because: ' + message);
}

$('#CapturePhoto').click(function()
		{
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
		destinationType: destinationType.DATA_URL });
		});

$('#ImageGallery').click(function()
		{
	getPhoto(pictureSource.PHOTOLIBRARY);
		});

$(".photopopup" ).on({
	popupbeforeposition: function() {
		var maxHeight = $( window ).height() - 60 + "px";
		$( ".photopopup img" ).css( "max-height", maxHeight );
	}
});


/*$('#GetAudio').click(function()
		{

		});*/
function updateQueryStringParameter(uri, key, value) {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
		return uri + separator + key + "=" + value;
	}
}

function sendMediaToS3(type,imageURI,pollid) {
	var url = globalliveurl+"/api/votesapp/poll/media";
	alert(url);
	//alert("Image Uri:"+imageURI);
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";
	/*options.headers = {
			Connection: "close"
	}*/
	options.chunkedMode = false;

	var params = {};
	params.PollId = pollid;
	options.params = params;

	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(url), win, fail, options);
}

function win(r) {
	alert("Code = " + r.responseCode);
	alert("Response = " + r.response);
	alert("Sent = " + r.bytesSent);
}

function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	alert("upload error source " + error.source);
	alert("upload error target " + error.target);
}

/*$(document).on('pagehide', '#createpoll', function(){ 
	alert("sdfdsaf");
	$('.clearInput').val("");
	//$('#smallImage').attr("src",""); 
});*/