//var globalurl = "http://10.0.2.2:8080/VotesApp"
var globalliveurl = "http://votesapp.elasticbeanstalk.com";	
$(document).ready(function(){
	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}

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

	
	$("#columnChart").click(function() {
		
		//alert("hi");
		
		alert("chart displayed");

		var pollID = $("#pollIdForCharts").val();
		//alert(pollID);
		var url=globalliveurl+"/api/votesapp/poll/voteResult/"+pollID;
		$.ajax({
			type: "GET",
			async:false,
			contentType: "application/json; charset=utf-8",
			url: url,
			success: function(msg){
				var jmsg = JSON.parse('' + msg + '');
				var pollOptions  = [];
				var dataBar = [];
				var barData = '[';
				//alert(jmsg.poll_question);
				if(!(isEmpty(jmsg)) && jmsg.Msg != "no_votes")
				{
					//alert("has polls");
					pollOptions = escapeCharsForOptions(jmsg.poll_options);
					for(var i=0;i<jmsg.TotalOptions;i++)
					{
						dataBar[i] = jmsg.OptionsVoteCount[i+1];
						barData += "{name:'"+pollOptions[i].replace(/\s/g, '')+"',data:["+jmsg.OptionsVoteCount[i+1]+"]}";
						if(i != (jmsg.TotalOptions-1))
							barData +=',';
						else
							barData +=']';
					}
					//alert("barData>>"+barData);

					$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					var html = ""+jmsg.poll_question+"";
					$('#questionChart').html(html);
					$("#populateCharts").html("");
					
					$("#showCharts").on("pageshow", function(event){


						$('#populateCharts').highcharts({
							chart: {
								type: 'column'
							},
							title: {
								text: ''
							},

							xAxis: {
								categories: [
								             html
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
							series: eval ("(" + barData + ")")
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
		
	});
	
	
	$("#barChart").click(function() {
		
		//alert("hi");
		
		//alert("chart displayed");
		var pollID = $("#pollIdForCharts").val();
		alert(pollID);
		var url=globalliveurl+"/api/votesapp/poll/voteResult/"+pollID;
		$.ajax({
			type: "GET",
			async:false,
			contentType: "application/json; charset=utf-8",
			url: url,
			success: function(msg){
				var jmsg = JSON.parse('' + msg + '');
				var pollOptions  = [];
				var dataBar = [];
				var barData = '[';
				//alert(jmsg.poll_question);
				if(!(isEmpty(jmsg)) && jmsg.Msg != "no_votes")
				{
					//alert("has polls");
					pollOptions = escapeCharsForOptions(jmsg.poll_options);
					for(var i=0;i<jmsg.TotalOptions;i++)
					{
						dataBar[i] = jmsg.OptionsVoteCount[i+1];
						barData += "{name:'"+pollOptions[i].replace(/\s/g, '')+"',data:["+jmsg.OptionsVoteCount[i+1]+"]}";
						if(i != (jmsg.TotalOptions-1))
							barData +=',';
						else
							barData +=']';
					}
					//alert("barData>>"+barData);

					$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					var html = ""+jmsg.poll_question+"";
					$('#questionChart').html(html);
					$("#populateCharts").html("");
					
					$("#showCharts").on("pageshow", function(event){

						$('#populateCharts').highcharts({
				            chart: {
				                type: 'bar'
				            },
				            title: {
				                text: ''
				            },
				            /*subtitle: {
				                text: 'Source: Wikipedia.org'
				            },*/
				            xAxis: {
				                categories: [
								             html
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
				            series: eval ("(" + barData + ")")
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
		
	});
	
	$("#pieChart").click(function() {
		
		alert("pie");
		alert("chart displayed");

		var pollID = $("#pollIdForCharts").val();
		//alert(pollID);
		var url=globalliveurl+"/api/votesapp/poll/voteResult/"+pollID;
		$.ajax({
			type: "GET",
			async:false,
			contentType: "application/json; charset=utf-8",
			url: url,
			success: function(msg){
				var jmsg = JSON.parse('' + msg + '');
				var pollOptions  = [];
				var dataPie = [];
				//alert(jmsg.poll_question);
				if(!(isEmpty(jmsg)) && jmsg.Msg != "no_votes")
				{
					//alert("has polls");
					pollOptions = escapeCharsForOptions(jmsg.poll_options);
					for(var i=0;i<jmsg.TotalOptions;i++)
					{
						dataPie[i] = [pollOptions[i], jmsg.OptionsVoteCount[i+1]];
					}
					//alert("pieData>>"+dataPie);

					$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					var html = ""+jmsg.poll_question+"";
					$('#questionChart').html(html);
					$("#populateCharts").html("");
					$("#showCharts").on("pageshow", function(event){
						$('#populateCharts').highcharts({
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
								data: dataPie
							}]
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

	});
	
	$("#bubbleChart").click(function() {
		alert("bubble");
		
		var pollID = $("#pollIdForCharts").val();
		//alert(pollID);
		var urlGeo=globalliveurl+"/api/votesapp/poll/voteResultGeo/"+pollID;
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
				// TODO: Need to add condition for empty array. Not able to do by length parameter.
				if(jmsg.Msg == "success" && jmsg.city_count != null) {
					for(var key in jmsg.city_count) {
						bubbleData[i] = {name:""+key+"",data:[[randomNoGenerator(10, 100),randomNoGenerator(10, 100),jmsg.city_count["" + key +""]]]};
						i++;						
					}
					//alert(bubbleData);
				
				
					$("#questionChart").empty();
					//$(""+jmsg.poll_question+"").appendTo('#questionChart');
					var html = ""+jmsg.poll_question+"";
					$('#questionChart').html(html);
					
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
	});

	
	function randomNoGenerator(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
});