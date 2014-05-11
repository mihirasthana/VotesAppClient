$( document ).ready(function() {
	getIShadowLists();
}); 

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}
function getIShadowLists()
{
	alert("getShadowLists");
	var url = globalliveurl +"/api/EnterpriseVotesapp/my_follow_list/"+sessionStorage.phonenum;
	alert("Url:"+url);
	$.ajax({
		type: "GET",
		url: url,
		async:false,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			alert(msg);
			var html= "";
			if(!(isEmpty(obj)))
			{

				for(var i=0;i<obj.following_list.length;i++) {
					html += '<li><a href="#showPollsPopup" class="getEntNameClass" data-rel="popup" id="'+obj.following_list[i].enterprise_name+'"><img src="'+obj.following_list[i].enterprise_image_url+'"'+
					'"><h2>'+obj.following_list[i].enterprise_name+
					'</h2></a></li>';

				}

			}
			else
			{
				html += '<li>You are not shadowing anyone!</li>'; 
			}
			alert("html:"+html);
			$( "#shadowIShadowList" ).empty();
			$( html ).appendTo( "#shadowIShadowList" );
			$( ".getEntNameClass" ).bind( "click", setEntNameHandler );

		},
		complete: function() {
			$("#shadowIShadowList").listview("refresh").trigger("create");
		},
		error: function () {
			alert("Error");
		}
	});
}

function setEntNameHandler(event)
{
	$('#shadowEntNm').val(($(this).attr('id')));
	alert("setEntNameHandler Called:"+($(this).attr('id')));
}


$('#shadowingVoted').click(function()
		{
	alert("Shadow Voted clicked:"+sessionStorage.phonenum+"<>"+($('#shadowEntNm').val()));
	var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/voted/"+sessionStorage.phonenum+"/"+($('#shadowEntNm').val());
	alert("Url:"+url);
	$.ajax({
		type: "GET",
		url: url,
		async:false,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			alert(msg);
			var html= '';
			var html1='';
			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.Voted_Polls.length;i++) {
					//	alert(obj.Voted_Polls[i].enterprise_poll_title);
					html1 = '<li><h2>'+obj.Voted_Polls[i].enterprise_name+'</h2><p>Category:'+obj.Voted_Polls[i].enterprise_category+'</p></li>';
					html+='<li class="votedPollDetailClass"><a id= "' + obj.Voted_Polls[i].enterprise_poll_id+'" href="#showCreatedPollDetails">'+obj.Voted_Polls[i].enterprise_poll_title+'</a></li>';
				}


			}
			else
			{
				html='<li>You have not voted yet!!</li>'
			}
			//alert("html:"+html);
			$( "#populateShadowVotedList" ).empty();
			$( "#iShadowVotedEntDetails" ).empty();
			$( html ).appendTo( "#populateShadowVotedList" );
			$( html1 ).appendTo( "#iShadowVotedEntDetails" );
			$( ".votedPollDetailClass" ).bind( "click", clickVotedPollsHandler );

		},
		complete: function() {
			$("#populateShadowVotedList").listview("refresh").trigger("create");
			$("#iShadowVotedEntDetails").listview("refresh").trigger("create");
		},
		error: function () {
			alert("Error");
		}
	});
		});
/*function escapeCharsForOptions(jmsg)
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
}*/

function clickVotedPollsHandler(event)
{
	var oid = event.target.getAttribute("id");
	alert('clickVotedPollsHandler'+oid);
	var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/ById/"+oid;
	alert("Url:"+url);
	$.ajax({
		type: "GET",
		url: url,
		async:false,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			alert(msg);
			var html='';	
			var html1='';
			var html2='';
			var tempArr=[];
			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.This_Poll.enterprise_poll_question_count;i++)
				{
					html='<div id="EntPollDetails'+i+'" data-role="page"><div data-role="header" data-id="header" id="header" data-position="fixed"'+'data-theme="f" data-tap-toggle="false"	class="ui-header">'
					+'<h1>Poll Details</h1></div><div data-role="content"><div id="menu">'
					+'<input type="hidden" id="shadowPollHiddenDetails'+i+'" name="shadowPollDetails'+i+'" value="" /> <input type="hidden"'
					+'id="EntIdForCharts'+i+'" value="" /><div><ul id="EntPollQuestionUl'+i+'" data-role="listview">'
					+'<li data-role="divider" data-theme="a">'+obj.This_Poll.enterprise_poll_title+'</li><li data-role="divider" data-theme="b">Question:</li><li data-theme="c">'+obj.This_Poll.enterprise_poll_questions.polls[i].poll_question+'</li></ul><br /> <br />'
					+'<br /><ul data-role="listview"><li data-role="divider" data-theme="b">Options:</li>';
					//tempArr = (obj.This_Poll.enterprise_poll_questions.polls[i].poll_options);
					for(var j=0;j<(obj.This_Poll.enterprise_poll_questions.polls[i].poll_option_count);j++)
					{
						//alert("Poll Option Count:<"+obj.This_Poll.enterprise_poll_questions.polls[i].poll_option_count+">"+"|| poll_options:<"+(obj.This_Poll.enterprise_poll_questions.polls[i].poll_options[j])+">");
						html1+='<li data-theme="c">'+(obj.This_Poll.enterprise_poll_questions.polls[i].poll_options[j])+'</li>';
					}

					html+=html1+'</ul><br /> <br /> <br /> <br />'
					+'<ul data-role="listview"></ul><br /> <br /></div><a class="showEntChartDetails" data-theme="d" '
					+'data-role="button" data-icon="flat-new" data-iconpos="right">Charts and Graphs</a></div></div><div id="footer"'
					+'data-role="footer" data-id="footer1" data-position="fixed" data-tap-toggle="false"><div id="navbar" data-role="navbar">'
					+'<ul><li><a id="" href="#iShadowVotedPage" data-icon="plus" data-theme="d">Back</a></li><li><a id="friends-button" '
					+'href="#list-page"	data-icon="flat-menu" data-theme="f">Home</a></li><li>';

					if(i != (obj.This_Poll.enterprise_poll_question_count-1))
					{
						html2='<a id="search-button" href="#EntPollDetails'+(i+1)+'" data-icon="search" data-theme="e">Next</a>';
					}
					else
					{
						html2='<a id="search-button" href="#EntPollDetails'+(i+1)+'" data-icon="search" data-theme="e">Polls</a>';
					}
					html+=html2+'</li></ul></div></div></div>';
					html1='';
					html2='';
					alert("HTML:"+html);


					$('#app').append(html);

				}

			}
			else
			{
				alert('No Poll Details Found');
			}
			location.href = '#EntPollDetails0';
		},
		error: function () {
			alert("Error");
		}
	});


}


$('#shadowingVote').click(function()
		{
	alert("Shadow Vote clicked:"+sessionStorage.phonenum+"<>"+($('#shadowEntNm').val()));
	var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/unvoted/"+sessionStorage.phonenum+"/"+($('#shadowEntNm').val());
	alert("Url:"+url);
	$.ajax({
		type: "GET",
		url: url,
		async:false,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			alert(msg);
			var html= '';
			var html1='';
			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.Unvoted_Polls.length;i++) {
					//	alert(obj.Voted_Polls[i].enterprise_poll_title);
					html1 = '<li><h2>'+obj.Unvoted_Polls[i].enterprise_name+'</h2><p>Category:'+obj.Unvoted_Polls[i].enterprise_category+'</p></li>';
					html+='<li class="votePollDetailClass"><a id= "' + obj.Unvoted_Polls[i]._id.$oid+'" href="#">'+obj.Unvoted_Polls[i].enterprise_poll_title+'</a></li>';
				}


			}
			else
			{
				html='<li>You have not voted yet!!</li>'
			}
			//alert("html:"+html);
			$( "#populateShadowVoteList" ).empty();
			$( "#iShadowVoteEntDetails" ).empty();
			$( html ).appendTo( "#populateShadowVoteList" );
			$( html1 ).appendTo( "#iShadowVoteEntDetails" );
			$( ".votePollDetailClass" ).bind( "click", clickVotePollsHandler );

		},
		complete: function() {
			$("#populateShadowVoteList").listview("refresh").trigger("create");
			$("#iShadowVoteEntDetails").listview("refresh").trigger("create");
		},
		error: function () {
			alert("Error");
		}
	});
		});

function clickVotePollsHandler(event)
{
	var oid = event.target.getAttribute("id");
	alert('clickVotePollsHandler'+oid);
	var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/ById/"+oid;
	alert("Url:"+url);
	$.ajax({
		type: "GET",
		url: url,
		async:false,
		success: function(msg){
			var obj = jQuery.parseJSON( ''+ msg +'' );
			alert(msg);
			var html='';
			var html1='';
			var html2='';

			if(!(isEmpty(obj)))
			{
				for(var i=0;i<obj.This_Poll.enterprise_poll_question_count;i++)
				{
					html='<div id="EntPollVote'+i+'" data-role="page"><div data-role="header" data-id="header" id="header"data-position="fixed"' 
					+'data-theme="f" data-tap-toggle="false" class="ui-header"><h1>Vote</h1>'
					+'</div><div data-role="content"><div><ul data-role="listview"><li data-role="divider" data-theme="a">'+obj.This_Poll.enterprise_poll_title+'</li><li data-role="divider" data-theme="b">Question:</li><li data-theme="c">'
					+obj.This_Poll.enterprise_poll_questions.polls[i].poll_question+'</li>'
					+'</ul><div id="spacesBfrImg'+i+'"></div><div align="center" id="EntImagePoll'+i+'">'
					+'<a href="#popupEntImage'+i+'" data-rel="popup" data-position-to="window" data-transition="flip">'
					+'<img class="popImage" src="" style="width: 30%;" id="smallPImg'+i+'" /></a><div data-role="popup" id="popupEntImage'+i+'"'
					+'data-overlay-theme="a" data-theme="d" data-corners="false"><a href="#" data-rel="back" data-role="button" data-theme="a"'
					+' data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a><img class="popImage" id="largePImg'+i+'" src=""'
					+' style="max-height: 512px;"></div></div><div id="spacesAfterPrivateImg'+i+'"></div><br /> <br /><ul data-role="listview">'
					+'<li data-role="divider" data-theme="b">Options:</li><li><fieldset id="entOptions'+i+'" data-role="controlgroup">';

					for(var j=0;j<(obj.This_Poll.enterprise_poll_questions.polls[i].poll_option_count);j++)
					{
						//alert("Poll Option Count:<"+obj.This_Poll.enterprise_poll_questions.polls[i].poll_option_count+">"+"|| poll_options:<"+(obj.This_Poll.enterprise_poll_questions.polls[i].poll_options[j])+">");
						html1+= '<input type="radio" name="choiceEnt'+i+'" class="pollOptionsClass" value="'+(j+1)+'" id="radio-choice-v-6' + j +'" checked="checked"><label for="radio-choice-v-6' + j +'">'+ (obj.This_Poll.enterprise_poll_questions.polls[i].poll_options[j]) +'</label>';
					}

					html+=html1+'</fieldset><input type="hidden" id="EntPollHidden'+i+'" value="" /></li></ul><br /> <br />'
					+'<br /> <br /></div></div><div id="footer" data-role="footer" data-id="footer1"' 
					+'data-position="fixed" data-tap-toggle="false"><div id="navbar" data-role="navbar">'
					+'<ul><li><a id="" href="#iShadowVotedPage" data-icon="plus" data-theme="d">Back</a></li><li><a id="friends-button" '
					+'href="#list-page"	data-icon="flat-menu" data-theme="f">Home</a></li><li>';

					if(i != (obj.This_Poll.enterprise_poll_question_count-1))
					{
						html2='<a id="search-button" href="#EntPollVote'+(i+1)+'" data-icon="search" data-theme="e">Next</a>';
					}
					else
					{
						html2='<a id="search-button" href="#" data-icon="search" data-theme="e">Vote</a>';
					}
					html+=html2+'</li></ul></div></div></div>';
					html1='';
					html2='';
					//alert("HTML:"+html);
					$('#app').append(html);
				}
			}
			else
			{
				alert("No Poll Details Not Found");
			}
			
			location.href = '#EntPollVote0';
		},
		error: function () {
			alert("Error");
		}
	});


}

