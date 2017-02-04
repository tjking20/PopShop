$("document").ready(function(){

  	// Initialize Firebase
	var config = {
	  apiKey: "AIzaSyBsWlWyvFWxSISqvHxebUkG04J-bqp8qG4",
	  authDomain: "popshop-94f98.firebaseapp.com",
	  databaseURL: "https://popshop-94f98.firebaseio.com",
	  storageBucket: "popshop-94f98.appspot.com",
	  messagingSenderId: "283005136078"
	};
	firebase.initializeApp(config);

	// Create a variable to reference the database.
	var database = firebase.database();

	// Initial global variables 
	var types	   = []; 
 	var type       = {};
 	var googTypes  = [];
 	var googTypes  = '';
 	var dispTypes  = [];
 	var dispType   = '';
	var stores     = [];
  	var store      = {};
  	var storeNames = [];
	var storeIDs   = [];
	var lists      = [];
	var list       = {};
	var items      = [];
	var users 	   = []; 
	var user       = {};
	var userIDs    = [];
	var userID     = '';	
	var userNames  = [];
	var userName   = '';
	var userPwds   = []; 
	var userPwd    = '';
	var loggedon   = false; 
	var x          = 0;
	var xx		   = 0;

	// Get Categories etc. 
	database.ref().on("value", function(data) {
		// Log everything that's coming out of data
	  	// console.log(data.val());
	  	// load types, stores, lists & users - all arrays
	  	types  = data.val().Types;
	  	stores = data.val().Stores;
	  	lists  = data.val().Lists; 
	  	users  = data.val().Users; 

	  	// Parse types for later use (storeIDs and storeNames) 
	  	for (x=0; x<types.length; x++){
	    	type = types[x];
	    	googTypes[x]=type.Type;
	    	dispTypes[x]=type.dispType;
	    }	  	
	  	// Parse stores for later use (storeIDs and storeNames) 
	  	for (x=0; x<stores.length; x++){
	    	store = stores[x];
	    	storeIDs[x]=store.storeId;
	    	storeNames[x]=store.storeName;
	    }
	  	// Parse users for later use (userIDs and userNames) 
	  	for (x=0; x<users.length; x++){
	    	user = users[x];
	    	userIDs[x]=user.email;
	    	userNames[x]=user.name;
	    	userPwds[x]=user.password;
	    }
	    // Handle the errors
	}, function(errorObject) {
    	console.log("Errors handled: " + errorObject.code);
	});	    	

	function parseLists(userID){
	    // Parse lists 
	    for (var i=0; i<lists.length; i++){
	    	// console.log(lists.length);
	    	list  = lists[i]; // this is the list object
	    	if (list.listUser == userID){
	    		items = list.listItems;	//listItems is an array

	    		// First, build the list div 
				var newDiv1 = $('<div class="list">');
				$("#currentLists").append(newDiv1);
				// Get the userName and add the List Type/User
				var k = $.inArray(lists[i].listUser,userIDs); 
				$("#listTitle").html("Shopping Lists for " + userNames[k]); 
				// $(newDiv1).append("List Type:  " + list.listType + "<br>" + 
				// 				  "List User:  " + userNames[k] + "<br>");
				// Now add the item div
				var newDiv2 = $('<div class="item">');
				$(newDiv1).append(newDiv2);
				// Add the Item Table header row
				$(newDiv2).append('<table class="table" class="items">');
				$(newDiv2).append('<caption><span class="caption">' + list.listType + 
								  '</span></caption'); 
				$(newDiv2).append('<tr><th>ITEMS</th>' + 
								      '<th>BOUGHT ON</th>' +
								      '<th>BOUGHT AT</th></tr>');
				// Add the Item rows 
				for (var j=0; j<items.length; j++){
					// get the Place Id storeNames index 
					k = $.inArray(items[j].itemStore,storeIDs); 
					$(newDiv2).append("<tr><td>" + items[j].itemName + "</td>" + 
									      "<td>" + items[j].itemDate + "</td>" + 
									      "<td>" + storeNames[k] + "</td></tr>");
				}
			}
			$(newDiv2).append("</table>"); 
	    }
	}

	$('#settings').on('shown.bs.modal', function () {
	  $('#dialog').focus()
	})	

 	$(document).on('click', '#login', function(){   
    	// Get emailid & password for login
    	userID   = $("#exampleInputEmail1").val();
    	userName  = $("#exampleInputName1").val();
    	userPwd  = $("#exampleInputPassword1").val();

    	// Check to see if user exists
		var k = $.inArray(userName,userNames); 
		if (k == -1) {
			alert('Add New User?'); 
    		// Add to user object & arrays 
    		user.email    = userID;
    		user.name     = userName;
    		user.password = userPwd; 
    		userIDs.push(userID);
    		userNames.push(userName);
    		userPwds.push(userPwd); 
    		// Update Firebase 
    	} else {
    		userID   = userIDs[k];
    		userName = userNames[k];
    		userPwd  = userPwds[k];
    	}
    	signOnScreen.hide(); 
		currentLists.show();
		parseLists(userID);	
		loggedon = true;    	
   		console.log(userID);
    	console.log(userName);
    	console.log(userPwd);
    	console.log(k);
    	console.log(loggedon);
		return false;    	

	});		

 	$(document).on('click', '#addBtn', function(){   
    //function addItems(mode){
		signOnScreen.hide();
		currentLists.hide();
		newListButtons.hide(); 

		var shopItems = [];
		var targetDiv = $(this).data("value");

		// This function will add the items to the page as a button as well as the shopItems array.
			var newItem = $("#itemInput").val();
			console.log(newItem);
			shopItems.push(newItem);
			var inputWithBtn = $("<button>").attr({
		         class:  'itemBtn'
		         ,value: newItem
		      }).text(newItem);  
			$("#activeList").append(inputWithBtn);

			return false;
	});	



var newListButtons = $("#newListButtons");
var currentLists = $("#currentLists");
var activeList = $("#activeList");
var signOnScreen = $("#signOnScreen");
var currentListsArr = [];
var shop = $("#shop");

activeList.hide();
currentLists.hide();  // once we signon, we show
shop.hide();


	$(document).on("click","#newList", function(){
		if (loggedon == true){
			listOptions();
			signOnScreen.hide();
			currentLists.hide();
			activeList.hide();
			newListButtons.show();
			$("#button1").html('Save List'); 
			$("#button2").html('Cancel');
		}					
	}); 

	$(document).on("click","#home", function(){
		if (loggedon == true) {
			signOnScreen.hide();
			activeList.hide();		
			newListButtons.hide();
			currentLists.show();	

			for(var i = 0; i<currentListsArr;i++){
				var currentListButtons = $("<button>");
				currentListButtons.text(currentListsArr[i]);
				currentLists.append(currentListButtons);
			}
		}	
	});	  

	function listOptions(){
		// replace listType with categories & only DO ONCE
		if (xx == 0 ) {
			var newDiv = $('<div id="buttons">');
			var j = 0; 		
			for (var i=0; i<dispTypes.length; i++){
				if (j == 8) {	// Make pretty rows of 8 buttons each
					newDiv.append("<br><br>");  // when we reach 8, space
					j = 1; 
				}
				else 
					j++; 

				var buttons= $("<button>");
				buttons.text(dispTypes[i]);
				buttons.attr("class", "listLoad")
				buttons.attr("data-value", dispTypes[i]);
				newDiv.append(buttons);	
			}	
			newListButtons.append(newDiv);
			xx++; //once only 
		}				
	}

	$(document).on("click",".listLoad", function(){

		//hides new list buttons
		signOnScreen.hide();
		newListButtons.hide();
		currentLists.hide();
		activeList.show();

		if(currentListsArr.indexOf($(this).data("value")) == -1){
			listType = $(this).data("value");
			var k = $.inArray(listType,dispTypes); 
			googType = googTypes[k]; 
			console.log(listType);
			console.log(k);
			console.log(googType);
		} else{
			return false;
		};
	});
});