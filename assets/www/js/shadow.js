var globalliveurl = "http://votesapp.elasticbeanstalk.com";	
$( document ).ready(function() {
	getIShadowLists();


	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}
	function getIShadowLists()
	{
		//alert("getShadowLists");
		var url = globalliveurl +"/api/EnterpriseVotesapp/my_follow_list/"+sessionStorage.phonenum;
		//alert("Url:"+url);
		$.ajax({
			type: "GET",
			url: url,
			async:false,
			success: function(msg){
				var obj = jQuery.parseJSON( ''+ msg +'' );
				//alert(msg);
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
				//alert("html:"+html);
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
		//alert("setEntNameHandler Called:"+($(this).attr('id')));
	}


	$('#shadowingVoted').click(function()
			{
		//alert("Shadow Voted clicked:"+sessionStorage.phonenum+"<>"+($('#shadowEntNm').val()));
		var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/voted/"+sessionStorage.phonenum+"/"+($('#shadowEntNm').val());
		//alert("Url:"+url);
		$.ajax({
			type: "GET",
			url: url,
			async:false,
			success: function(msg){
				var obj = jQuery.parseJSON( ''+ msg +'' );
				//alert(msg);
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
		//alert('clickVotedPollsHandler'+oid);
		var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/ById/"+oid;
		//alert("Url:"+url);
		$.ajax({
			type: "GET",
			url: url,
			async:false,
			success: function(msg){
				var obj = jQuery.parseJSON( ''+ msg +'' );
				//alert(msg);
				var html='';	
				var html1='';
				var html2='';
				var tempArr=[];
				if(!(isEmpty(obj)))
				{
					$('.dynamicPage').remove();
					for(var i=0;i<obj.This_Poll.enterprise_poll_question_count;i++)
					{
						//alert("Enterprise id" + obj.This_Poll.enterprise_poll_id);
					html='<div id="EntPollDetails'+i+'" class="dynamicPage" data-role="page"><div data-role="header" data-id="header" id="header" data-position="fixed"'+'data-theme="f" data-tap-toggle="false"	class="ui-header">'
					+'<h1>Poll Details</h1></div><div data-role="content"><div id="menu">'
					+'<input type="hidden" id="shadowPollHiddenDetails'+i+'" name="shadowPollDetails'+i+'" value="" /> <input type="hidden"'
					+'id="EntIdForCharts'+i+'" value="'+obj.This_Poll.enterprise_poll_id+'" /><div><ul id="EntPollQuestionUl'+i+'" data-role="listview">'
					+'<li data-role="divider" data-theme="a">'+obj.This_Poll.enterprise_poll_title+'</li><li data-role="divider" data-theme="b">Question:</li><li data-theme="c">'+obj.This_Poll.enterprise_poll_questions.polls[i].poll_question+'</li></ul><br /> <br />'
					+'<br /><ul data-role="listview"><li data-role="divider" data-theme="b">Options:</li>';
					//tempArr = (obj.This_Poll.enterprise_poll_questions.polls[i].poll_options);
					for(var j=0;j<(obj.This_Poll.enterprise_poll_questions.polls[i].poll_option_count);j++)
					{
						//alert("Poll Option Count:<"+obj.This_Poll.enterprise_poll_questions.polls[i].poll_option_count+">"+"|| poll_options:<"+(obj.This_Poll.enterprise_poll_questions.polls[i].poll_options[j])+">");
						html1+='<li data-theme="c">'+(obj.This_Poll.enterprise_poll_questions.polls[i].poll_options[j])+'</li>';
					}

					html+=html1+'</ul><br /> <br /> <br /> <br />'
					+'<ul data-role="listview"></ul><br /> <br /></div><a data-theme="d" data-role="button" href="#showChartDetails'+i+'"'
					+'data-rel="popup" data-icon="flat-new" data-iconpos="right">Charts and Graphs</a>'
					+'<div data-role="popup" id="showChartDetails'+i+'" data-theme="b">'
					+'	<ul data-role="listview" data-inset="true"'
					+'		style="min-width: 210px;" data-theme="c">'
					+'		<li data-role="divider" data-theme="b">Choose Charts From:</li>'
					+'		<li><a href="#" id = "column' + i + '" class="columnChart">Column</a></li>'
					+'		<li><a href="#" id = "bar' + i + '" class="barChart">Bar</a></li>'
					+'		<li><a href="#" id = "pie' + i + '" class="pieChart">Pie</a></li>'
					+'		<li><a href="#" id = "bubble' + i + '" class="bubbleChart">Bubble</a></li>'
					+'	</ul>'
					+'</div></div></div><div id="footer"'
					+'data-role="footer" data-id="footer1" data-position="fixed" data-tap-toggle="false"><div id="navbar" data-role="navbar">'
					+'<ul><li><a id="" href="#iShadowVotedPage"  data-icon="arrow-l" data-theme="e">Back</a></li><li><a id="friends-button" '
					+'href="#" onclick="window.location=\'./home.html\'"	data-icon="home" data-theme="f">Home</a></li><li>';

					if(i != (obj.This_Poll.enterprise_poll_question_count-1))
					{
						html2='<a id="search-button" href="#EntPollDetails'+(i+1)+'" data-icon="search" data-theme="d">Next</a>';
					}
					else
					{
						html2='<a id="search-button" href="#iShadowVotePage" data-icon="search" data-theme="d">VotedList</a>';
					}
					html+=html2+'</li></ul></div></div></div>';
					html1='';
					html2='';
					//alert("HTML:"+html);


					$('#app').append(html);

					}
					$( ".columnChart" ).bind( "click", { id:obj.This_Poll.enterprise_poll_id  } ,clickColumnHandler );
					$( ".barChart" ).bind( "click", { id:obj.This_Poll.enterprise_poll_id  } ,clickBarHandler );
					$( ".pieChart" ).bind( "click", { id:obj.This_Poll.enterprise_poll_id  } ,clickPieHandler );
					$( ".bubbleChart" ).bind( "click", { id:obj.This_Poll.enterprise_poll_id  } ,clickBubbleHandler );
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
		//alert("Shadow Vote clicked:"+sessionStorage.phonenum+"<>"+($('#shadowEntNm').val()));
		var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/unvoted/"+sessionStorage.phonenum+"/"+($('#shadowEntNm').val());
		//alert("Url:"+url);
		$.ajax({
			type: "GET",
			url: url,
			async:false,
			success: function(msg){
				var obj = jQuery.parseJSON( ''+ msg +'' );
				//alert(msg);
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
				$( ".votePollDetailClass" ).bind( "click" ,clickVotePollsHandler );

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
		//alert('clickVotePollsHandler'+oid);
		var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/ById/"+oid;
		//alert("Url:"+url);
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
					$('.dynamicPage').remove();
					for(var i=0;i<obj.This_Poll.enterprise_poll_question_count;i++)
					{
						html='<div id="EntPollVote'+i+'" class="dynamicPage" data-role="page"><div data-role="header" data-id="header" id="header"data-position="fixed"' 
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
						+'<ul><li><a id="" href="#iShadowVotePage"  data-icon="arrow-l" data-theme="e">Back</a></li><li><a id="friends-button" '
						+'href="#list-page" onclick="window.location=\'./home.html\'"	data-icon="home" data-theme="f">Home</a></li><li>';

						if(i != (obj.This_Poll.enterprise_poll_question_count-1))
						{
							html2='<a id="search-button" href="#EntPollVote'+(i+1)+'" data-icon="search" data-theme="d">Next</a>';
						}
						else
						{
							html2='<a id="" class="voteEnt" href="#iShadowVotePage" data-icon="search" data-theme="f">Vote</a>';
						}
						html+=html2+'</li></ul></div></div></div>';
						html1='';
						html2='';

						$('#app').append(html);
					}
					$( ".voteEnt" ).bind( "click", { msg: msg } ,clickVoteHandler );
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

	function clickVoteHandler(event)
	{
		var msg = event.data.msg;
		//alert(msg);
		var index=0;
		var temp;
		var j=0;
		msg = '{'+msg.substr(56,msg.length);
		msg =  msg.substring(0,msg.length -17);
		msg =  msg.replace('"latitude":""', '"latitude":"'+sessionStorage.Latitude+'"');
		msg =  msg.replace('"longitude":""', '"longitude":"'+sessionStorage.Longitude+'"');
		msg =  msg.replace('"poll_voter_id":""', '"poll_voter_id":"'+sessionStorage.phonenum+'"');
		//alert("Str:"+msg);
		//alert("Latitude:"+sessionStorage.Latitude+" Longitude:"+sessionStorage.Longitude);
		var answerOptions=[];
		$("input[name*=choiceEnt]:checked").each(function () {
			answerOptions[j]=($(this).val());
			j++;
		});
		var stringsearch='"poll_voter_option":0';
		var replaceString='"poll_voter_option":';
		var n=0;
		var indexArr=[];
		for (var index = msg.indexOf(stringsearch);
		index >= 0;
		index = msg.indexOf(stringsearch, index + 1))
		{
			indexArr[n]=index;
			//alert("At :"+index);
			n++;
		}
		n=0;
		for(var m=0;m<answerOptions.length;m++)
		{
			msg=msg.replaceBetween(indexArr[m],indexArr[m]+stringsearch.length,replaceString+answerOptions[m]);			
		}
		m=0;
		indexArr = [];
		answerOptions = [];
		//alert("Trimmed:"+msg);
		var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_poll/myVote";	
		$.ajax({
			type: "POST",
			url: url,
			data: msg,
			success: function(res){
				alert("Voting "+res+"!!");
			},
			error: function () {
				alert("Error");
			}
		});
	}
	String.prototype.replaceBetween = function(start, end, what) {
		return this.substring(0, start) + what + this.substring(end);
	};

//	Charts

	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}

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


	function clickColumnHandler(event)
	{

		//alert(event.data.id);

		//alert("chart displayed");
		var pollID = event.data.id;
		//alert(pollID);
		var url=globalliveurl+"/api/EnterpriseVotesapp/enterprise_poll/voteResult/"+pollID;
		$.ajax({
		type: "GET",
		async:false,
		contentType: "application/json; charset=utf-8",
		url: url,
		success: function(msg){
			//alert(msg);
			var jmsg = JSON.parse('' + msg + '');
			$(".chartDetails").remove();
			var html = [];
			var barDataArray = [];
			//alert(jmsg.poll_question);
			if(!(isEmpty(jmsg.VoteCountResult)) && jmsg.Msg == "success")
			{
				
				for(var j=0;j<jmsg.VoteCountResult.length;j++) {
					
					var pollOptions  = [];
					var dataBar = [];
					var barData = '[';
					//alert("has polls");
					//pollOptions = escapeCharsForOptions(jmsg.VoteCountResult[j].poll_options);
					pollOptions = jmsg.VoteCountResult[j].poll_options;
					for(var i=0;i<jmsg.VoteCountResult[j].TotalOptions;i++)
					{
						dataBar[i] = jmsg.VoteCountResult[j].OptionsVoteCount[i+1];
						barData += "{name:'"+pollOptions[i].replace(/\s/g, '')+"',data:["+jmsg.VoteCountResult[j].OptionsVoteCount[i+1]+"]}";
						if(i != (jmsg.VoteCountResult[j].TotalOptions-1))
							barData +=',';
						else
							barData +=']';
					}
					//alert("barData>>"+barData);
					barDataArray[j] = barData;
					var populateChartshtml = '<div class = "chartDetails" id="populateCharts'+j+'" style="height: 100%; width: 100%;"></div>'
					$(populateChartshtml).appendTo("#chartContent");
					//alert(populateChartshtml);
					//$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					
					html[j] = ""+jmsg.VoteCountResult[j].poll_question+"";
					//$('#questionChart').html(html);
					$('#populateCharts'+j).html("");
					//alert('#populateCharts'+j);
				}
				$("#showCharts").on("pageshow", function(event){
					//alert(html.length);
					for(var i=0;i<html.length;i++) {
						//alert($("#showCharts").html());
						$('#populateCharts'+i).highcharts({
							chart: {
								type: 'column'
							},
							title: {
								text: ''
							},
	
							xAxis: {
								categories: [
								             html[i]
								             ]
							},
							yAxis: {
								min: 0,
								title: {
									text: 'Count'
								}
							},
							plotOptions: {
								column: {
									pointPadding: 0.2,
									borderWidth: 0
								}
							},
							series: eval ("(" + barDataArray[i] + ")")
						});					
					}
				});
				
				
				location.href = "#showCharts";
			} else {
				location.href = "#showEmptyCharts";
			}
		},
		error: function () {
			alert("error");
		}
	});	

	}


	function clickBarHandler(event)
	{$(".chartDetails").remove();

		//alert(event.data.id);

		//alert("chart displayed");
		var pollID = event.data.id;
		//alert(pollID);
		var url=globalliveurl+"/api/EnterpriseVotesapp/enterprise_poll/voteResult/"+pollID;
		$.ajax({
		type: "GET",
		async:false,
		contentType: "application/json; charset=utf-8",
		url: url,
		success: function(msg){
			//alert(msg);
			var jmsg = JSON.parse('' + msg + '');
			
			var html = [];
			var barDataArray = [];
			//alert(jmsg.poll_question);
			if(!(isEmpty(jmsg.VoteCountResult)) && jmsg.Msg == "success")
			{
				
				for(var j=0;j<jmsg.VoteCountResult.length;j++) {
					
					var pollOptions  = [];
					var dataBar = [];
					var barData = '[';
					//alert("has polls");
					//pollOptions = escapeCharsForOptions(jmsg.VoteCountResult[j].poll_options);
					pollOptions = jmsg.VoteCountResult[j].poll_options;
					for(var i=0;i<jmsg.VoteCountResult[j].TotalOptions;i++)
					{
						dataBar[i] = jmsg.VoteCountResult[j].OptionsVoteCount[i+1];
						barData += "{name:'"+pollOptions[i].replace(/\s/g, '')+"',data:["+jmsg.VoteCountResult[j].OptionsVoteCount[i+1]+"]}";
						if(i != (jmsg.VoteCountResult[j].TotalOptions-1))
							barData +=',';
						else
							barData +=']';
					}
					//alert("barData>>"+barData);
					barDataArray[j] = barData;
					var populateChartshtml = '<div class = "chartDetails" id="populateCharts'+j+'" style="height: 100%; width: 100%;"></div>'
					$(populateChartshtml).appendTo("#chartContent");
					//alert(populateChartshtml);
					//$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					
					html[j] = ""+jmsg.VoteCountResult[j].poll_question+"";
					//$('#questionChart').html(html);
					$('#populateCharts'+j).html("");
					//alert('#populateCharts'+j);
				}
				$("#showCharts").on("pageshow", function(event){
					//alert(html.length);
					for(var i=0;i<html.length;i++) {
						//alert($("#showCharts").html());
						$('#populateCharts'+i).highcharts({
						    chart: {
						        type: 'bar'
						    },
						    title: {
						        text: ''
						    },
						    subtitle: {
						        text: ''
						    },
						    xAxis: {
						        categories: [
								             html[i]
								             ],
						        title: {
						            text: null
						        }
						    },
						    yAxis: {
						        min: 0,
						        title: {
						            text: 'Count',
						            align: 'high'
						        },
						        labels: {
						            overflow: 'justify'
						        }
						    },
						    tooltip: {
						        valueSuffix: ' count'
						    },
						    plotOptions: {
						        bar: {
						            dataLabels: {
						                enabled: true
						            }
						        }
						    },
						    legend: {
						        layout: 'vertical',
						        align: 'right',
						        verticalAlign: 'top',
						        x: -40,
						        y: 100,
						        floating: true,
						        borderWidth: 1,
						        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
						        shadow: true
						    },
						    credits: {
						        enabled: false
						    },
						    series: eval ("(" + barDataArray[i] + ")")
						});					
					}
				});			
				
				location.href = "#showCharts";
			} else {
				location.href = "#showEmptyCharts";
			}
		},
		error: function () {
			alert("error");
		}
	});	
}





	function clickPieHandler(event)
	{//alert(event.data.id);
		$(".chartDetails").remove();
		//alert("chart displayed");
		var pollID = event.data.id;
		//alert(pollID);
		var url=globalliveurl+"/api/EnterpriseVotesapp/enterprise_poll/voteResult/"+pollID;
		$.ajax({
		type: "GET",
		async:false,
		contentType: "application/json; charset=utf-8",
		url: url,
		success: function(msg){
			//alert(msg);
			var jmsg = JSON.parse('' + msg + '');
			
			var html = [];
			var pieDataArray = [];
			//alert(jmsg.poll_question);
			if(!(isEmpty(jmsg.VoteCountResult)) && jmsg.Msg == "success")
			{
				
				for(var j=0;j<jmsg.VoteCountResult.length;j++) {
					
					var pollOptions  = [];
					var dataPie = [];
					//var barData = '[';
					//alert("has polls");
					//pollOptions = escapeCharsForOptions(jmsg.VoteCountResult[j].poll_options);
					pollOptions = jmsg.VoteCountResult[j].poll_options;
					for(var i=0;i<jmsg.VoteCountResult[j].TotalOptions;i++)
					{
						//dataBar[i] = jmsg.VoteCountResult[j].OptionsVoteCount[i+1];
						//barData += "{name:'"+pollOptions[i].replace(/\s/g, '')+"',data:["+jmsg.VoteCountResult[j].OptionsVoteCount[i+1]+"]}";
						dataPie[i] = [pollOptions[i], jmsg.VoteCountResult[j].OptionsVoteCount[i+1]];
					}
					//alert("pieData>>"+dataPie);
					pieDataArray[j] = dataPie;
					var populateChartshtml = '<div class = "chartDetails" id="populateCharts'+j+'" style="height: 100%; width: 100%;"></div>'
					$(populateChartshtml).appendTo("#chartContent");
					//alert(populateChartshtml);
					//$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					
					html[j] = ""+jmsg.VoteCountResult[j].poll_question+"";
					//$('#questionChart').html(html);
					$('#populateCharts'+j).html("");
					//alert('#populateCharts'+j);
				}
				$("#showCharts").on("pageshow", function(event){
					//alert(html.length);
					for(var i=0;i<html.length;i++) {
						//alert($("#showCharts").html());
						$('#populateCharts'+i).highcharts({
							chart: {
								plotBackgroundColor: null,
								plotBorderWidth: null,
								plotShadow: false
							},
							title: {
								text: ''
							},

							plotOptions: {
								pie: {
									allowPointSelect: true,
									cursor: 'pointer',
									dataLabels: {
										enabled: true,
										format: '<b>{point.name}</b>: {point.percentage:.1f} %',
										style: {
											color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
										}
									}
								}
							},
							series: [{
								type: 'pie',
								name: 'Vote share',
								data: pieDataArray[i]
							}]
						});
	
					}
				});			
				
				location.href = "#showCharts";
			} else {
				location.href = "#showEmptyCharts";
			}
		},
		error: function () {
			alert("error");
		}
	});	

}


	function clickBubbleHandler(event) {
	//alert("bubble");
	$(".chartDetails").remove();
	var pollID = event.data.id;
	//alert(pollID);
	var urlGeo=globalliveurl+"/api/EnterpriseVotesapp/enterprise_poll/voteResultGeo/"+pollID;
	//alert(urlGeo);
	$.ajax({
		type: "GET",
		async:false,
		contentType: "application/json; charset=utf-8",
		url: urlGeo,
		success: function(msg){
			//alert(msg);
			var jmsg = JSON.parse('' + msg + '');
			var bubbleData = [];
			var i = 0;
			var populateChartshtml = '<div class = "chartDetails" id="populateCharts" style="height: 100%; width: 100%;"></div>'
			$(populateChartshtml).appendTo("#chartContent");
			// TODO: Need to add condition for empty array. Not able to do by length parameter.
			if(jmsg.Msg == "success" && jmsg.city_count != null) {
				for(var key in jmsg.city_count) {
					bubbleData[i] = {name:""+key+"",data:[[randomNoGenerator(10, 100),randomNoGenerator(10, 100),jmsg.city_count["" + key +""]]]};
					i++;						
				}
				//alert(bubbleData);


				//$("#questionChart").empty();
				//$(""+jmsg.poll_question+"").appendTo('#questionChart');
				//var html = ""+jmsg.poll_question+"";
				//$('#questionChart').html(html);

				$("#showCharts").on("pageshow", function(event){
					$('#populateCharts').highcharts({

						chart: {
							type: 'bubble',
							zoomType: 'xy'
						},

						title: {
							text: ''
						},

						series: bubbleData

					});
				});
				location.href = "#showCharts";
			} else {
				location.href = "#showEmptyCharts";
			}
		},
		error: function () {
			alert("error");
		}

	});
}


	function randomNoGenerator(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}



});
