document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady()
{
	sessionStorage.phonenum=getMyPhoneNumber()
	getContactList();
	getMyGroups(sessionStorage.phonenum);

}
//constants
var phonenum="";
var poll_question_key="\"poll_question\":";
var poll_options_key="\"poll_options\":";
var poll_create_date_key="\"poll_create_date\":";
var poll_end_date_key="\"poll_end_date\":";
var poll_creator_key="\"poll_creator\":";
var phonenum_key="\"phone_number\":";
var poll_category_key="\"poll_category\":";
var poll_groupid_key="\"poll_groupid\":";
var poll_participants_key="\"poll_participants\":";
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
	$("#optionlistul").listview("refresh",true);
	/*<li id='listoption' data-role='fieldcontain'><label
	id='labeloption' for='name' style='font-weight: bold'>Option
		1:</label> <input type='text' name='option' id='option0' /></li>*/

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

	today = mm+'-'+dd+'-'+yyyy;
	return today;
}

function getCreatePollJSON(){

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
	createPollString=createPollString+poll_participants_key+"["+temp+"]}";
	temp="";
	alert(createPollString);
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
	getCreatePollJSON();
	var data=getCreatePollJSON();
	alert("Data:"+data);
	var url="http://10.0.2.2:8080/VotesApp/api/votesapp/poll";
	$.ajax({
		type: "POST",
		//contentType: "application/json",
		//dataType: "json",
		url: url,
		data: data,
		success: function(msg){
			//$("body").append(msg.d);
			alert("success");
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
	var data="phone_number={"+phonenum_key+phonenum+"}";
	var url="http://10.0.2.2:8080/VotesApp/api/user/groups";
	$.ajax({
		type: "GET",
		async:false,
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
				html += '<li>No Groups Exists!!</li>';
			$( html ).appendTo( "#selectgroupslist" );
			$("#selectgroupslist").listview("refresh");
		},
		error: function () {
			alert("Error");
		}
	});
}

function showMyPolls(phonenum)
{
	
}

/*$(document).ready(function() {
	$('#addoption').click(function() {
		var num     = 1; // how many "duplicatable" input fields we currently have
		var newNum  = new Number(num + 1);      // the numeric ID of the new input field being added

		// create the new element via clone(), and manipulate it's ID using newNum value
		var newElem = $('#listoption' + num).clone().attr('id', 'listoption' + newNum);
		var newElem1 = $('#labeloption' + num).clone().attr('id', 'labeloption' + newNum);
		var newElem2 = $('#option' + num).clone().attr('id', 'option' + newNum);

		// manipulate the name/id values of the input inside the new element
		newElem.children(':first').attr('id', 'name' + newNum).attr('name', 'name' + newNum);
		newElem1.children(':first').attr('id', 'name' + newNum).attr('name', 'name' + newNum);
		newElem2.children(':first').attr('id', 'name' + newNum).attr('name', 'name' + newNum);
		// insert the new element after the last "duplicatable" input field
		$('#listoption' + num).after(newElem);
		$('#labeloption' + num).after(newElem1);
		$('#option' + num).after(newElem2);

		// enable the "remove" button
		$('#deleteoption').attr('disabled','');

		// business rule: you can only add 5 names
		if (newNum == 5)
			$('#addoption').attr('disabled','disabled');
	});

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