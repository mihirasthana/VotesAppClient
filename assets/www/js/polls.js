document.addEventListener("deviceready", onDeviceReady, false);
var globalurl = "http://votesapp.elasticbeanstalk.com";

$(document).ready(function() {
	//alert("hisdafi");
});

function onDeviceReady()
{
	sessionStorage.phonenum=getMyPhoneNumber()
	getContactList();
	getMyGroups(sessionStorage.phonenum);
	showMyPolls(sessionStorage.phonenum);
	showAllPolls(sessionStorage.phonenum);

}
//constants
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

function getMyPhoneNumber()
{
	var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
	var returnval;
	telephoneNumber.get(function(result) {
		returnval = result;
	}, function() {
		alert("telephonenum error");
	});
	return returnval;
}
//}
$('#addoption').click(function()
		{
	var num=$('#optionlistul li').length +1;
	var html="<li id='listoption"+num+"' data-role='fieldcontain'>" +
	"<label id='labeloption"+num+"' for='option' style='font-weight: bold'>Option"+num+":</label> " +
	"<input type='text' name='option"+num+"' id='option"+num+"' /></li>";
	alert(html);
	$( html ).appendTo( "#optionlistul" );
	$("#optionlistul").listview("refresh").trigger("create");

		});
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
			temp=temp+selectedValues[i];
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
			temp=temp+selectedValues[i];
			if(i !=(selectedValues.length-1))
				temp=temp+",";
		}
		createPollString=createPollString+poll_participants_key+"["+temp+"],"+poll_public_key+dq+"no"+dq+"}";
		temp="";
	}
	else
	{
		createPollString=createPollString+poll_groupid_key+'[],'+poll_participants_key+'[],'+poll_public_key+dq+'yes'+dq+'}';

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
					var phone=contacts[i].phoneNumbers[j].value;		
					html +="<li><label><input type='checkbox' name='checkedContactsPoll' class='checkcontacts' value='"+phone+"'>"+name+" &nbsp;" + phone + "</label></li>";
				}
			}
		}
		$( html ).appendTo( "#selectContactsList" );

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


$('.submitPoll').click(function()
		{
	var data=getCreatePollJSON(($(this).attr('id')));
	//alert("Data:"+data);
	var url = globalurl +"/api/votesapp/poll";	
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
	var data="phone_number={"+phonenum_key+phonenum+"}";
	var url = globalurl +"/api/user/groups";
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
			$( html ).appendTo( "#selectgroupslist" );
			//$("#myGroupList").html(html);
			//$("#selectgroupslist").listview("refresh").trigger("create");
			//$( ".groupListItem" ).bind( "taphold", tapholdHandler );
			//$( ".groupListItem" ).bind( "tap", getMyGroupDetails );
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
	var url = globalurl +"/api/votesapp/poll/pollsAssigned/"+phonenum;
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
			$( html1 ).appendTo( "#myAssignedList" );
			//alert(html1);
			$( ".polldetailssclass" ).bind( "tap", tapHandler );

			//$("#myAssignedList").listview("refresh");


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
	//alert("id:"+data);
	var url = globalurl +"/api/votesapp/poll/ById/"+data;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/ById/"+data;
	var temp_mem_name="";
	$.ajax({
		async:false,
		type: "GET",
		url: url,
		data:data,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			//alert(msg);
			var html= "";
			if(!(isEmpty(obj)))
			{
				alert(obj.This_Poll.poll_question);
				html+='<p data-theme="a">'+obj.This_Poll.poll_question+'</p><fieldset data-role="controlgroup"><legend>Options</legend>';
				tempArr = escapeCharsForOptions(obj.This_Poll.poll_options);
				for(var j=0;j<tempArr.length;j++)
				{
					html+='<input type="radio" name="choice" value="'+tempArr[j]+'"><label for="choice">'+tempArr[j]+'</label>';
				}
				tempArr = [];

			}
			//alert(html);
			$('#questionP').html(html );
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
	var url = globalurl +"/api/votesapp/poll/All/"+phonenum;
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/All/"+phonenum;

	$.ajax({
		type: "GET",
		async:false,
		url: url,
		success: function(msg){
			//alert(msg);
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
			$( html1 ).appendTo( "#myAllPollsList" );
			//alert(html1);
			$( ".publicpolldetailssclass" ).bind( "tap", tapPublicPollDetails );

			//$("#myAssignedList").listview("refresh");


		},
		error: function () {
			alert("Error");
		}
	});

}

function tapPublicPollDetails( event ){
	//alert("tapped");
	var data=event.target.getAttribute("id");
	//alert("id:"+data);
	var url = globalurl +"/api/votesapp/poll/ById/"+data;
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
				html+='<p data-theme="a">'+obj.This_Poll[0].poll_question+'</p><fieldset data-role="controlgroup"><legend>Options</legend>';
				tempArr = escapeCharsForOptions(obj.This_Poll[0].poll_options);
				for(var j=0;j<tempArr.length;j++)
				{
					html+='<input type="radio" name="choice1" value="'+tempArr[j]+'">'+tempArr[j];
				}
				tempArr = [];

			}
			//alert("html:"+html);
			$('#questionPublic').html(html );
			location.href="#showPublicPollDetailsPage";
		},
		error: function () {
			alert("Error");
		}
	});


}

function getVoteJSON(msg)
{
	var voteString='';
	var obj = jQuery.parseJSON( ''+ msg +'' );
	voteString = '{'+poll_id_key+obj.This_Poll[0].poll_id+','+poll_voter_option_key+($("input:radio[name=choice1]:checked" ).val())+','+
	poll_voter_id_key+sessionStorage.phonenum+','+poll_question_key+dq+obj.This_Poll[0].poll_question+dq+','+poll_options_key+obj.This_Poll[0].poll_options+','+
	poll_create_date_key+dq+obj.This_Poll[0].poll_create_date+dq+','+poll_end_date_key+dq+obj.This_Poll[0].poll_end_date+dq+','+
	poll_creator_key+obj.This_Poll[0].poll_creator+','+poll_category_key+dq+obj.This_Poll[0].poll_category+dq+','+poll_voter_location_key+
	'{'+dq+'latitute'+dq+':'+dq+'37.3331002'+dq+','+dq+'longitude'+dq+':'+dq+'-121.9116864'+dq+'}}';
	//alert("VoteString:"+voteString);
	return voteString;
}
$('#votePublic').click(function()
		{
	var url = globalurl +"/api/votesapp/poll/myVote";
	//var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll/myVote";
	var msg = $("#publicPollHidden").val();
	var data = getVoteJSON(msg);
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(msg){
			//alert("success");
		},
		error: function () {
			alert("Error");
		}
	});

		});


/*
	$('#deleteoption').click(function() {
		var num = 2; // how many "duplicatable" input fields we currently have
		$('#option' + num).remove();     // remove the last element

		// enable the "add" button
		$('#addoption').attr('disabled','');

		// if only one element remains, disable the "remove" button
		if (num-1 == 1)
			$('#deleteoption').attr('disabled','disabled');
	});
	$('#deleteoption').attr('disabled','disabled');
});*/