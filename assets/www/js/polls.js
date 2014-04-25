
var phonenum="";
var poll_question_key="\"poll_question\":";
var poll_options_key="\"poll_options\":";
var poll_create_date_key="\"poll_create_date\":";
var poll_end_date_key="\"poll_end_date\":";
var poll_creator_key="\"poll_creator\":";
var poll_category_key="\"poll_category\":";
var poll_groupid_key="\"poll_groupid\":";
var poll_participants_key="\"poll_participants\":";
var dq="\"";


sessionStorage.phonenum=getMyPhoneNumber();

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
	var num=3;
	var html="<li id='listoption"+num+"' data-role='fieldcontain'>" +
	"<label id='labeloption"+num+"' for='name' style='font-weight: bold'>Option"+num+":</label> " +
	"<input type='text' name='option' id='option"+num+"' /></li>";
	alert(html);
	$( html ).appendTo( "#optionlistul" );
	$("#optionlistul").listview("refresh");
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
	createPollString=createPollString+temp+"],"+poll_create_date_key+dq+getPollDate()+dq+
	","+poll_end_date_key+dq+getPollDate()+dq+","+poll_creator_key+dq+sessionStorage.phonenum+dq
	+","+poll_category_key+dq+$( "#categories" ).val();+dq+","+poll_groupid_key+
	"[test],"+poll_participants_key+"[12345678]}";
	temp="";

	alert(createPollString);
	//return createPollString;

}
$('#submitpoll').click(function()
		{
	getCreatePollJSON();
	/*var data=poll_question_key+'"'+$('#question')+'"'+poll_options_key+'';
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
		}*/
	//});


		});



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