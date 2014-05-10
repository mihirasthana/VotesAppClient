var globalliveurl = "http://votesapp.elasticbeanstalk.com";

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}

$('.category').click(function()
		{
	alert("Category clicked:"+sessionStorage.phonenum+"<>"+($(this).attr('id')));
	var url = globalliveurl +"/api/EnterpriseVotesapp/enterprise_list/"+sessionStorage.phonenum+"/"+($(this).attr('id'));
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

				for(var i=0;i<obj.enterprise_details.length;i++) {
					html += '<li><a href="#shadowDetailsPage" class="shadowDetailsClass" id="'+obj.enterprise_details[i]._id.$oid+'"><img src="'+obj.enterprise_details[i].enterprise_image_url+
					'"><h2>'+obj.enterprise_details[i].enterprise_name+'</h2><input type="hidden" value="" id="'+obj.enterprise_details[i]._id.$oid+'_hidden"></li>';
				alert(JSON.stringify(obj.enterprise_details[i]));
				}
				
				
			}
			else
			{
				html += '<li>No Sub-Categories Found</li>'; 
			}
			alert("html:"+html);
			$( "#shadowList" ).empty();
			$( html ).appendTo( "#shadowList" );
			$( ".shadowDetailsClass" ).bind( "click", clickHandler );

		},
		complete: function() {
			$("#shadowList").listview("refresh").trigger("create");
		},
		error: function () {
			alert("Error");
		}
	});
		});

function clickHandler(event)
{
	alert("Clickededddd");
	var oid = ($(this).attr('id'));
	alert("Show Details:"+oid);
	var msg = $('#'+oid+'_hidden').val();
	alert((msg));
	var obj = jQuery.parseJSON( ''+ msg +'' );
	alert(obj);
	var html='';
	$('#getEntName').val(obj.enterprise_name);
	$('#getCategory').val(obj.enterprise_category);
	if(!(isEmpty(obj)))
	{

		
			html = '<li><img src="'+obj.enterprise_image_url+
			'"><h2>'+obj.enterprise_name+'</h2></li>';
			alert(html);
			$( "#shadowDetailsList" ).empty();
			$( html ).appendTo( "#shadowDetailsList" );
			$("#shadowDetailsList").listview("refresh").trigger("create");
			html=obj.enterprise_details;
			$( "#paraEntDetails" ).html(html);


	}
	else
	{
		html += '<li>No Sub-Categories Found</li>'; 
	}

}

$('#shadow').click(function(){
	alert("Shadow Clicked");
	var url= globalliveurl+"/api/EnterpriseVotesapp/follow";
	var data = '{"enterprise_name":"'+($("#getEntName").val())+'","enterprise_category":"'+($('#getCategory').val())+
	'","follower":"'+sessionStorage.phonenum+'"}';
	alert("data:"+data);
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(msg){
			alert("Follow Success");
		},
		error: function () {
			alert("Error");
		}
	});

});