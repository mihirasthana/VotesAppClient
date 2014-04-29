//document.addEventListener("deviceready", onDeviceReady, false);
var globalurl = "http://votesapp.elasticbeanstalk.com";
$(function(){
	var phonenum="";
	var name_key="\"name\":";
	var phonenum_key="\"phone_number\":";
	var member_key="\"members\":";
	var creategroup_key="group=";
	var member_name="";
	
	//alert("In OnDeviceReady");
	sessionStorage.phonenum=getMyPhoneNumber();
	//alert(sessionStorage.phonenum);
	getMyGroups(sessionStorage.phonenum);
	//alert("In OnDeviceReady"+phonenum);
	getContactList();

	

	function getContactList()
	{
		function sortByContactName(a, b) { var x = a.name.formatted.toLowerCase(); var y = b.name.formatted.toLowerCase(); return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
		function onSuccess(contacts) {
			//alert(contacts);
			contacts.sort(sortByContactName);
			var html="";
			for (var i = 0; i < contacts.length ; i++) {
				if(contacts[i].name != null && contacts[i].phoneNumbers != null) {
					var name=contacts[i].name.formatted;
					for(var j = 0; j< contacts[i].phoneNumbers.length;j++) {
						var phone=contacts[i].phoneNumbers[j].value;		
						//getMemberNameByPhoneNumber(contacts[i].phoneNumbers[j].value);
						//alert(name);
						html +="<li><label><input type='checkbox' name='checkedContacts' class='checkcontacts' value='"+phone+"'>"+name+" &nbsp;" + phone + "</label></li>";
					}
				}
			}
			$( html ).appendTo( "#contactlist" );

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

	function getCreateGroupJSON(){

		var createGroupString = creategroup_key+"{"+name_key+"\""+($( "#groupname" ).val()+"\","+phonenum_key+sessionStorage.phonenum+","+member_key+"[");


		var selectedContacts = new Array();
		$.each($("input[name='checkedContacts']:checked"), function() {
			selectedContacts.push($(this).val());
		});
		var temp="";
		for(i=0;i<selectedContacts.length;i++)
		{
			temp=temp+"\""+selectedContacts[i]+"\"";
			if(i !=(selectedContacts.length-1))
				temp=temp+",";
		}
		createGroupString=createGroupString+temp+"]}";
		alert(createGroupString);
		return createGroupString;

	}
//	{"name":"family","phoneNumber":9960085953,"members":[9985565624,8875598624]}

	$( "#creategroup" ).click(function() {
		alert("Button Clicked");
		var data=getCreateGroupJSON();
		var url = globalurl +"/api/user/group";		
		//var url="http://10.0.2.2:8080/VotesApp/api/user/group";
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
	
	//deletegroup
	$( "#delete-groups" ).click(function() {
		alert("Button Clicked");
		var data="id="+$("#groupid").val();
		//alert("Data:"+data);
		var url = globalurl +"/api/user/group";	
		//var url="http://10.0.2.2:8080/VotesApp/api/user/group";
		$.ajax({
			type: "DELETE",
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
						html += '<li class="groupListItem" id= "' + obj.groups[i]._id.$oid +'">'+obj.groups[i].name+'</li>';
					}
					
				}
				else
				{
					html += '<li>No Groups Found</li>'; 
				}
				//alert(html);
				$( html ).appendTo( "#myGroupList" );
				//$("#myGroupList").html(html);
				$("#myGroupList").listview("refresh");
				//$( ".groupListItem" ).bind( "taphold", tapholdHandler );
				$( ".groupListItem" ).bind( "tap", getMyGroupDetails );
			},
			error: function () {
				alert("Error");
			}
		});
	}


	function getMyPhoneNumber()
	{
		var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
		var returnval;
		telephoneNumber.get(function(result) {
			returnval = result;
		}, function() {
			alert("telephinenum error");
		});
		return returnval;
	}
	//gets member name by phonenumber
	/*function getMemberName(phonenum)
	{
		var returnval="";
		function onSuccess(contacts) {
			returnval = (contacts[0].name.formatted);
			return returnval;

		};
		function onError(contactError) {
			alert('onError!');
		};

		var options      = new ContactFindOptions();
		options.filter	 = phonenum;
		var fields       =  ["name","phoneNumbers"];
		navigator.contacts.find(fields, onSuccess, onError, options);
	}
*/



	function tapholdHandler( event ){
		var html = "";
		alert("Long press");

		//$( event.target ).addClass( "taphold" );
	}
	
	//group info
	function getMyGroupDetails(event){
		//alert("in get my group details");
		var data="id="+event.target.getAttribute("id");
		var url = globalurl +"/api/user/group";	
		//var url="http://10.0.2.2:8080/VotesApp/api/user/group";
		var temp_mem_name="";
		$.ajax({
			async:false,
			type: "GET",
			url: url,
			data:data,
			success: function(msg){
				var obj = jQuery.parseJSON( ''+ msg +'' );
				var html= "";
				if(obj != null) {
					//alert(obj.name);
					$("#groupid").val(obj._id.$oid);
					html = "<li data-theme='a'><h1>Group Name:"+obj.name+"</h1></li><li data-role='list-divider'>Group Members</li>";
					for(k=0;k<obj.members.length;k++){
						/*temp_mem_name=(getMemberName(obj.members[k]));
						alert("temp_mem"+temp_mem_name);*/
						html += '<li>'+obj.members[k]+'</li>';
						temp_mem_name="";
						
					}
				}		
				//alert(html);
				//$("#groupmembers").empty();
				$("#groupmembers").html(html);
				//$(html ).appendTo( "#groupmembers" );
				//$("#groupmembers").listview("refresh");
				location.href="#group-details";
				//$( ".groupListItem" ).bind( "taphold", tapholdHandler );
				//alert(msg);
			},
			error: function () {
				alert("Error");
			}
		});

	}

	
	//clear contacts
	$("#clearcontacts").click(function() {
		$('.checkcontacts').filter(':checkbox').prop('checked',false).checkboxradio("refresh");
	});
	

});

