function startChat() {

	var chat = $.connection.chatHub;

	$.connection.hub.url = $('#SiteUrl').val()+ "signalr/";
	registerClientMethods(chat);

	$.connection.hub.start().done(function () {
		registerServerEvents(chat);

	});

	$.connection.hub.disconnected(function () {
		// alert('Connection with the server lost');
		setTimeout(function () {
			$.connection.hub.start().done(function () {
				registerServerEvents(chat);
			//	alert('Connection Established.');

			});
		}, 1000);
	});
}
function registerServerEvents(chat) {

	var userId = $("#UserId").val();
	// alert('Connecting...'+userId);
	chat.server.connect(userId); // Register User

	$('.sendsignalr').off('click').on('click', function () {

		if($('#chatmessage').val() !=='') {
			showLoader();
			alert($(this).attr('rel')+'-'+ $('#chatmessage').val());
			// Call the Send method on the hub.
			chat.server.sendPrivateMessageToServer($(this).attr('rel'), $('#chatmessage').val());
			// chat.server.hello($('#chatmessage').val());
			// Clear text box and reset focus for next comment.
			$('#chatmessage').val('').focus();
		}
	});
	
}

function registerClientMethods(chat) {
	// Create a function that the hub can call to broadcast messages.
	chat.client.broadcastMessage = function (name, message) {
		// Html encode display name and message.
		var encodedName = $('<div />').text(name).html();
		var encodedMsg = $('<div />').text(message).html();
		// Add the message to the page.
		$('#discussion').append('<li><strong>' + encodedName
			+ '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
	};
	chat.client.alert = function (message) {
		alert(message);
	};

	chat.client.appendMessage = function (name, date, message) {
		hideLoader();

		var $cont = $('#chatcont');
		var data = '<span class="chat-inner-date">' + date + '</span>';
		data += '<div class="talk-bubble tri-right round  client-cont">';
		data += '<div class="talktext">';
		data += '<p> ' + message + '</p>';
		data += '</div>';
		data += '</div>';
		$cont.append(data);
	};
	chat.client.paymentStatusNotification = function (paymentStatusId, paymentStatus, chatId) {
		alert('Payment processed. Status:' + paymentStatus);
		if (paymentStatusId == 2) {
			$('#chatControlsCont.chat-' + value.chat_id).show();
			$('#chatStatus.chat-' + value.chat_id).hide();
		}
	};

	chat.client.questionFeedback = function () {
		// alert('server');
		ProcessMessageList();
	};
	chat.client.error = function (message) {
		alert(message);
		console.log(message);
		hideLoader();
	};
	chat.client.receivePrivateMessage = function (message) {


		var chatId=""+message.Id;
		var scope = angular.element(document.querySelector('body')).scope();
		scope.$apply(function(filter){

			var items=$.map(scope.queries, function(el) { return el });
			console.log(items);
			var index=indexByKeyValue(items,"Id",chatId);
			scope.queries.splice(index, 1);
			scope.queries.unshift(message);

		})


		console.log(message);
		if ($('.sendsignalr').attr('rel') === chatId.trim()) {
			var $cont = $('#chatcont');
			var data = '<span class="chat-inner-date">' + message.DateSent + '</span>';
			data += '<div class="talk-bubble tri-right round '+message.CssClass+'">';
			data += '<div class="talktext">';
			data += '<p> ' + message.LatestMessage + '</p>';
			data += '</div>';
			data += '</div>';
			$cont.append(data);
		}
		try {
			notification('New Message', message.LatestMessage);
		}catch(err){

		}
	};
	chat.client.onConnected = function (id, userName, allUsers, messages) {

		  // alert(id);

	};
}
