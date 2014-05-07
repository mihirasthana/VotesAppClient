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

		$("#showChartDetails").click(function(){
			alert("chart displayed");
			$("#populateBarCharts").html("");
			$("#populatePieCharts").html("");
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
					var dataPie = [];
					alert(jmsg.poll_question);
					//alert(jmsg.TotalOptions);
					if(!(isEmpty(jmsg)) && jmsg.Msg != "no_votes")
					{
						pollOptions = escapeCharsForOptions(jmsg.poll_options);
						for(var i=0;i<jmsg.TotalOptions;i++)
						{
							dataBar[i] = jmsg.OptionsVoteCount[i+1];
							dataPie[i] = [pollOptions[i], jmsg.OptionsVoteCount[i+1]];
							//data[i] = [pollOptions[i], jmsg.OptionsVoteCount[i+1]];

						}
						$("#questionChart").empty();
						//$(""+jmsg.poll_question+"").appendTo('#questionChart');
						var html = ""+jmsg.poll_question+"";
						$('#questionChart').html(html);
					
						$("#showCharts").on("pageshow", function(event){
							
							
							var plotBar = $.jqplot('populateBarCharts', [dataBar], {
								seriesDefaults:{
									renderer:$.jqplot.BarRenderer,
									rendererOptions: {
										// Set the varyBarColor option to true to use different colors for each bar.
										// The default series colors are used.
										varyBarColor: true
									}
								},
								axes:{
									xaxis:{
										renderer: $.jqplot.CategoryAxisRenderer,
										ticks: pollOptions
									}
								}
							});
							
							var plotPie = jQuery.jqplot ('populatePieCharts', [dataPie],
									{
								seriesDefaults: {
									// Make this a pie chart.
									renderer: jQuery.jqplot.PieRenderer,
									rendererOptions: {
										// Put data labels on the pie slices.
										// By default, labels show the percentage of the slice.
										showDataLabels: true
									}
								},
								legend: { show:true, location: 'e' }
									}
							);
						});
					}
				},
				error: function () {
					alert("error");
				}
			});	
		});


		/*$("#piechart").click(function(){
			alert("chart displayed");
			$("#populateCharts").html("");
			var pollID = $("#pollIdForCharts").val();
			//alert(pollID);
			var url="http://votesapp.elasticbeanstalk.com/api/votesapp/poll/voteResult/"+pollID;
			$.ajax({
				type: "GET",
				contentType: "application/json; charset=utf-8",
				//dataType: "json",
				url: url,
				async:false,
				//data: "{}",
				success: function(msg){
					var jmsg = JSON.parse('' + msg + '');
					var pollOptions  = [];
					var data = [];
					alert(jmsg);
					if(!(isEmpty(jmsg)) && jmsg.Msg != "no_votes")
					{
						pollOptions = escapeCharsForOptions(jmsg.poll_options);
						for(var i=0;i<jmsg.TotalOptions;i++)
						{
							//data[i] = jmsg.OptionsVoteCount[i+1];
							data[i] = [pollOptions[i], jmsg.OptionsVoteCount[i+1]];

						}
						
						$("#questionChart").empty();
						//$(""+jmsg.poll_question+"").appendTo('#questionChart');
						var html = ""+jmsg.poll_question+"";
						$('#questionChart').html(html);
						
						$("#showCharts").on("pageshow", function(event){				
							
							
							var plot1 = jQuery.jqplot ('populatePieCharts', [data],
									{
								seriesDefaults: {
									// Make this a pie chart.
									renderer: jQuery.jqplot.PieRenderer,
									rendererOptions: {
										// Put data labels on the pie slices.
										// By default, labels show the percentage of the slice.
										showDataLabels: true
									}
								},
								legend: { show:true, location: 'e' }
									}
							);
						});
						alert(" after successs");
					}
				},
				error: function () {
					alert("error");
				}
			});	
		});*/
	});

	
	
/*$(document).ready(function(){
    var s1 = [200, 600, 700, 1000];
    var s2 = [460, -210, 690, 820];
    var s3 = [-260, -440, 320, 200];
    // Can specify a custom tick Array.
    // Ticks should match up one for each y value (category) in the series.
    var ticks = ['May', 'June', 'July', 'August'];

    $("#mystats").bind("pageshow", function(event){
    	alert("hisdf");
	    var plot1 = $.jqplot('barChart', [s1, s2, s3], {
	        // The "seriesDefaults" option is an options object that will
	        // be applied to all series in the chart.
	        seriesDefaults:{
	            renderer:$.jqplot.BarRenderer,
	            rendererOptions: {fillToZero: true}
	        },
	        // Custom labels for the series are specified with the "label"
	        // option on the series option.  Here a series option object
	        // is specified for each series.
	        series:[
	            {label:'Hotel'},
	            {label:'Event Regristration'},
	            {label:'Airfare'}
	        ],
	        // Show the legend and put it outside the grid, but inside the
	        // plot container, shrinking the grid to accomodate the legend.
	        // A value of "outside" would not shrink the grid and allow
	        // the legend to overflow the container.
	        legend: {
	            show: true,
	            placement: 'outsideGrid'
	        },
	        axes: {
	            // Use a category axis on the x axis and use our custom ticks.
	            xaxis: {
	                renderer: $.jqplot.CategoryAxisRenderer,
	                ticks: ticks
	            },
	            // Pad the y axis just a little so bars can get close to, but
	            // not touch, the grid boundaries.  1.2 is the default padding.
	            yaxis: {
	                pad: 1.05,
	                tickOptions: {formatString: '$%d'}
	            }
	        }
	    });
    });
});*/