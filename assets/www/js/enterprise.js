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
					html += '<li><a href="#shadowDetailsPage" class="shadowDetailsClass" id="'+obj.enterprise_details[i]._id.$oid+'"><img id="'+obj.enterprise_details[i]._id.$oid+'_img" src="'+obj.enterprise_details[i].enterprise_image_url+
					'"><h2 id="'+obj.enterprise_details[i]._id.$oid+'_name">'+obj.enterprise_details[i].enterprise_name+
					'</h2><input type="hidden" value="'+obj.enterprise_details[i].enterprise_category+'" id="'+obj.enterprise_details[i]._id.$oid+'_category"><input type="hidden" id="'+obj.enterprise_details[i]._id.$oid+'_details" value="'+obj.enterprise_details[i].enterprise_details+
					'"/><input type="hidden" id="'+obj.enterprise_details[i]._id.$oid+
					'_joinDate" value="'+obj.enterprise_details[i].enterprise_join_date+'" /></li>';

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
	var html='';
	alert("Name:"+($('#'+oid+'_name').html())+" Details:"+($('#'+oid+'_details').val())+" JoinDate:"+($('#'+oid+'_joinDate').val())+" Category:"+($('#'+oid+'_category').val()));
	$('#getEntName').val(($('#'+oid+'_name').html()));
	$('#getCategory').val(($('#'+oid+'_category').val()));
	html = '<li><img src="'+($('#'+oid+'_img').attr('src'))+
	'"><h2>'+($('#'+oid+'_name').html())+'</h2><p>Category:'+($('#'+oid+'_category').val())+'<br/>Joining Date:'+($('#'+oid+'_joinDate').val())+'</p></li>';
	alert(html);
	$( "#shadowDetailsName" ).html(($('#'+oid+'_name').html()));
	$( "#shadowDetailsList" ).empty();
	$( html ).appendTo( "#shadowDetailsList" );
	$( "#paraEntDetails" ).empty();
	$( "#paraEntDetails" ).append(($('#'+oid+'_details').val()));
	$("#shadowDetailsList").listview("refresh").trigger("create");
	//html=($('#'+oid+'_details').val());


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
			alert(msg);
			alert("Follow Success");
			$('.category').trigger('click');
			location.href="#shadowListingPage";
			
		},
		error: function () {
			alert("Error");
		}
	});
	
	


});