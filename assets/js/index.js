jQuery(document).ready(function($) {

	renderArticles(0);

	$(document).on('click','.btn-primary',function(e){
		$(this).parent().parent().children('.modal-window').show();
	});

	$(document).on('click','.close-modal',function(e){
		$(this).parent().hide();
	});

	$(document).on('click','.reranderArticles',function(e){
		e.preventDefault();
		let start = $(this).data('start');
		start = start *5;
		renderArticles(start);
	});

	function renderArticles(start){
		let data = new FormData();
		data.append( 'method', 'render' );
		data.append( 'start', start );
		$.ajax({
		url         : '/handler.php',
		type        : 'POST', // важно!
		data        : data,
		cache       : false,
		dataType    : 'json',
		processData : false,
		contentType : false,
		// функция успешного ответа сервера
		success     : function( respond, status, jqXHR ){
	 
		  if( typeof respond.error === 'undefined' ){
			generateArticles(respond);
		  }
		  // ошибка
		  else {
			console.log('ОШИБКА: ' + respond.error );
		  }
		},
		// функция ошибки ответа сервера
		error: function( jqXHR, status, errorThrown ){
		  console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	 
		});
	}

	function generateArticles(respond) {
		$('.articles').html('');
		respond.map(function(article) {
			let shortDesc = article['description'].substr(0,400);
			shortDesc = shortDesc.replace(/<\w+ \w+=["'].+["'] ?>/g , '');
			shortDesc = shortDesc.replace(/<\/?\w+>/g,'');
			shortDesc = shortDesc.substr(0,200);
			console.log(shortDesc);
			$('.articles').append(
				'<div class = "article">\
					<a href = "'+article['href']+'" target="blank" >'+article['title']+'</a>\
					<p>'+shortDesc+'</p>\
					<div class="modal-window">\
						<div class="close-modal"></div>\
						<div class="modal-content">'+article['description']+'</div>\
					</div>\
					<div class="button_wrap">\
						<button class="btn btn-primary">Полный текст</button>\
					</div>\
				<div>\
				<hr>'
			);
		});
		$('.pagination_wrap').html('');
		for (let index = 0; index < respond[0]['pageCount']; index++) {
			$('.pagination_wrap').append(
				'<a class = "reranderArticles" data-start = "'+index+'" href = "'+index+'">'+index+'</a>'
			);
		}
	}


	$('.load_articles').click(function(){
		$('.ajax_load').show();
		let data = new FormData();
		data.append( 'method', 'parse' );
		$.ajax({
		url         : '/handler.php',
		type        : 'POST', // важно!
		data        : data,
		cache       : false,
		dataType    : 'json',
		processData : false,
		contentType : false,
		// функция успешного ответа сервера
		success     : function( respond, status, jqXHR ){
	 
		  if( typeof respond.error === 'undefined' ){
			console.log(respond);
			$('.ajax_load').hide();
			renderArticles(0);
		  }
		  // ошибка
		  else {
			console.log('ОШИБКА: ' + respond.error );
		  }
		},
		// функция ошибки ответа сервера
		error: function( jqXHR, status, errorThrown ){
		  console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
		}
	 
		});
	});



});