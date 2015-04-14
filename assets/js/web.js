$(function() {

	//MASKS
	function applyMask (selector,type,complete){
		switch (type) {
		  case 'wmr':
		    $(selector).mask('R000000000000',{onComplete:complete}).attr('placeholder','R123456789012');
		    break;
		  case 'wmz':
		    $(selector).mask('Z000000000000',{onComplete:complete}).attr('placeholder','Z123456789012');
		    break;
		  case 'complex':
		  	$(selector).mask('ZZZZ-0000-0000-0000', {translation: {'Z': {pattern: /[aA-zZ]/}},onComplete:complete}).attr('placeholder','ZZZZ-0000-0000-0000');
		    break;
		  default:
		    //no mask
		}
	}

	//Настройки стиля всплывающих уведомлений
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "positionClass": "toast-top-right",
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
	/*********************** USER PROFILE **********************/

	$('.tab-pane').on('click','.add-card', function(e){
		e.preventDefault();
		$.ajax({
			url: $(this).attr('href')
		}).done(function(response){
			$('#add-card-container').html($(response));
			$('#add-card-container').find('select').chosen();
		});
	});


	$('.tab-pane').on('click','.delete-card', function(e){
		var that = $(this);
		e.preventDefault();
		var thisRow = that.parents('.form-group');
		var thisLabel = thisRow.find('label').text();
		
		$.confirm({
			text: "Вы уверены, что хотите удалить "+thisLabel+"?",
		   	title: "Требуется подтверждение",
		    confirm: function(button) {
		        $.ajax({
					url: that.attr('href'),
					data: thisRow.attr('data-id')
				}).done(function(response){
					if(response == 1){
						thisRow.remove();
						toastr.success(thisLabel+' удален!');
					}else{
						toastr.error('Ошибка. '+thisLabel+' не удален!');
					}
				}).fail(function(){
					toastr.error('Ошибка. '+thisLabel+' не удален!');
				});
		    },
		    cancel: function(button) {
		        // do something
		    },
		    confirmButton: "Да, удалить",
		    cancelButton: "Не удалять",
		    post: true
		});
	});
	//Выбор кошелька
	$('#add-card-container').on('change','select',function(){
		var mask = $(this).find(':selected').attr('data-mask'); //string or array
		//Применяем маску для номера кошелька
		applyMask('#add-card-container .masked-input',mask,function(){
			$('#save-card').fadeIn('200');
		});
	});

	//Сохраняем кошелек
	$('#add-card-container').on('click','#save-card',function(e){
		e.preventDefault();
		var form = $('#add-card-container form');
		var url = form.attr('action');
		$.ajax({
			url: url,
			data: form.serialize()
		}).done(function(response){
			if(response !== 0){
				$('#user-cards-container').append(response);
				toastr.success('Кошелек добавлен!');
				$('#add-card-container').html();
			}else{
				toastr.error('Ошибка. Кошелек не добавлен!');
			}
		}).fail(function(){
			toastr.error('Ошибка. Кошелек не добавлен!');
		});
	});
	


	/************ LOGIN FORM **********/
	$('#email-login-form form').on('submit',function(e){
		var emailForm = $(this);
		e.preventDefault();
		$('#email-login-form').fadeOut('200',function(){
			$('#loading-box').fadeIn(200);
			$.ajax({
				url: emailForm.attr("action"),
		        data: emailForm.serializeArray(),
		        type: 'POST'
			}).done(function(response){
				if(response == 1){
					//Переходим к логину
					$('#login-email').val($('#form-email').val());
					$('#loading-box').fadeOut('200',function(){
						$('#login-form').fadeIn(200);
					});
				}else if(response == 0){
					//Переходим к регистрации
					$('#reg-email').val($('#form-email').val());
					$('#loading-box').fadeOut('200',function(){
						$('#reg-form').fadeIn(200);
					});	
				}
			});
		});
	});

	/************ MAIN PAGE ***********/
	/************ LOAD JSON DATA ******/
	var listData = null;   
	$.ajax({
	  url: $('#main_tabs_content').attr('data-json'),
	  async : false,
		type : "POST",
		global : false,
		dataType : 'json',
	  data : { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
	  success: function(response){
	  	listData = response.data;
	  }
	});

	/***********************************************/
	/***************** MAIN TABS *******************/
	/***********************************************/
	var graphData = null;
	//Laad tab-content
	function loadTabContent (url){
		$.ajax({
			url: url
		}).done(function(data){
			//Грузим контент вкладки
			$('#main_tabs_content').html(data);

			/***********************************************/
			/*********** Запускаем нужные скрипты **********/
			/***********************************************/

			//дублируем избранное
			$('.list-group li.favorite').each(function(){
				var favorite = $(this).clone().addClass('show-favorite');
				$(this).parent().prepend(favorite);
			});

			$('.open-select').on('click','.toggle-favorite',function(){
				var favorite = $(this).next().find('.show-favorite');
				favorite.toggleClass('hidden');
				if(favorite.hasClass('hidden')){
					$(this).find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
				}else{
					$(this).find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
				}
			});
			//Красивый скролл
			$('.table-view .search-select.list-group').slimScroll({
				height: '270px',
				size: '7px',
				railOpacity: 0.1,
				alwaysVisible: true,
				railVisible: true
			});
			$('.list-view .search-select.list-group').slimScroll({
				height: '200px',
				size: '7px',
				railOpacity: 0.1,
				alwaysVisible: true,
				railVisible: true
			});

			$('.rates-tab .list-group').slimScroll({
				height: '270px',
				size: '7px',
				railOpacity: 0.1,
				alwaysVisible: true,
				railVisible: true
			});

			//Load graph data  for rates
			$.ajax({
			  url: $('#rates_list').attr('data-rates'),
			  async : false,
				type : "POST",
				global : false,
				dataType : 'json',
			  data : {'period': 'day'},
			  success: function(response){
			  	graphData = response;
			  }
			});

		});//ajax end
	}
	//Вкладка по-умолчанию
	loadTabContent($('#main_tabs li').eq(0).find('a').attr('href'));

	$('#main_tabs').on('click', 'li a', function(e){
		e.preventDefault();
		loadTabContent($(this).attr('href'));
		//Делаем активной кнопку
		$('#main_tabs li').removeClass('active');
		$(this).parent('li').addClass('active');	
	});

	function getRate(id_from,id_to){
		var output = false;
		for(var i in listData){
			if(id_from == listData[i].currency1.id && id_to == listData[i].currency2.id){
				output = parseFloat(listData[i].rate);
			}
		}
		return output;
	}
	function getComission(id_from,id_to){
		var output = false;
		for(var i in listData){
			if(id_from == listData[i].currency1.id && id_to == listData[i].currency2.id){
				output = parseFloat(listData[i].commission);
			}
		}
		return output;
	}
	function getComissionAbsolute(id_from,id_to){
		var output = false;
		for(var i in listData){
			if(id_from == listData[i].currency1.id && id_to == listData[i].currency2.id){
				output = parseFloat(listData[i].commission_absolute);
			}
		}
		return output;
	}
	function getReserve(id_to){
		var output = false;
		for(var i in listData){
			if(id_to == listData[i].currency2.id){
				output = parseFloat(listData[i].currency2.reserve);
			}
		}
		return output;
	}

	//Main page TABLE-VIEW && LIST-VIEW
	

	//Автозаполнение (таблица)
	$("#main_tabs_content").on("keyup click input", ".open-select .inputs input", function () {
		var input = $(this);
		var list = $(this).closest(".open-select").find('.list-group');
		if (this.value.length > 0) {
			list.find("li").show().filter(function () {
				return $(this).find('.name').text().toLowerCase().indexOf(input.val().toLowerCase()) == -1;
			}).hide();
		}
		else {
			list.find("li").show();
		}
	});

	//Автозаполнение (лист)
	$("#main_tabs_content").on("click", ".list-view .open-select .inputs input", function () {
		$(this).next().removeClass('fa-chevron-down').addClass('fa-chevron-up');
		var select = $(this).closest(".open-select").find('.slimScrollDiv');
		select.show();	
	});

	//Обновление рассчета
	function updateInputs(){
		var fromVal = parseFloat($('#from_value').val());
		var rate = parseFloat(getRate($('#currency_from').val(),$('#currency_to').val()));

		if(rate && $('#currency_from').val() != '' && $('#currency_to').val() != ''){
			var commission = Math.ceil(100*fromVal*getComission($('#currency_from').val(),$('#currency_to').val()))/100;
			var withCommission = fromVal+commission;
			//Если есть абсолютная комиссия
			if(getComissionAbsolute($('#currency_from').val(),$('#currency_to').val())){
				withCommission = withCommission + parseFloat(getComissionAbsolute($('#currency_from').val(),$('#currency_to').val()));
			}
			var toValue = Math.floor(100*fromVal*rate)/100;

			$('#to_value').val(toValue);
			$('#rate').val(rate);
			$('#rate-text').text(rate);
			$('#with-commission').val(withCommission);

			$('.currency-calculator .hide-mask').hide();
			$('.tab-content .toggle-box').show();
			$('.tab-content .go-next-tab').removeClass('disabled');
		}else{
			$('.tab-content .toggle-box').hide();
			$('.tab-content .go-next-tab').addClass('disabled');
			$('.currency-calculator .hide-mask').show();
		}
	}

	//Открываем-закрываем селект по клику на иконку
	$('#main_tabs_content').on('click','.open-select .input-icon',function(){
		var select = $(this).closest('.open-select').find('.slimScrollDiv');
		if(select.is(":visible")){
			select.hide();
			$(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
		}else{
			select.show();
			$(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
		}
	});

	//Заполняем инпут по клику на список (валюта 1)
	$("#main_tabs_content").on("click", "#currency_from_list li", function(){
		$("#currency_from_list li").removeClass('selected');
		$(this).addClass('selected');
		var name = $(this).find('.name').text();
		var id = $(this).attr('data-id');
		$('#currency_from_name').val(name);
		$('#currency_from').val(id);
		$("#currency_from_list li").show();

		$('#cur-from-text').text(name);
		$('#cur-from-text-1').text(name);

		$('.list-view .slimScrollDiv').hide();
		$('#currency_from_name').next().removeClass('fa-chevron-up').addClass('fa-chevron-down');

		updateInputs();
	});

	//Заполняем инпут по клику на список (валюта 2)
	$("#main_tabs_content").on("click", "#currency_to_list li", function(){
		$("#currency_to_list li").removeClass('selected');
		$(this).addClass('selected');
		var name = $(this).find('.name').text();
		var id = $(this).attr('data-id');
		$('#currency_to_name').val(name);
		$('#currency_to').val(id);
		$("#currency_to_list li").show();

		$('#cur-to-text').text(name);
		$('#cur-to-text-1').text(name);
		$('#cur-to-text-2').text(name);

		if(getReserve(id)){
			$('#reserve').html(getReserve(id));
		}else{
			$('#reserve').html('');
		}
		
		$('.list-view .slimScrollDiv').hide();
		$('#currency_to_name').next().removeClass('fa-chevron-up').addClass('fa-chevron-down');

		updateInputs();
	});

	//Рассчитываем комиссию и сколько получаем
	$('#main_tabs_content').on('change','#from_value',function(){
		updateInputs();	
	});
	//Если звполнили с комиссией
	$('#main_tabs_content').on('change','#with-commission',function(){
		var rate = getRate($('#currency_from').val(),$('#currency_to').val());
		if(rate && $('#currency_from').val() != '' && $('#currency_to').val() != ''){
			var thisVal = parseFloat($(this).val());
			var comission = getComission($('#currency_from').val(),$('#currency_to').val());
			var fromVal = Math.floor(100*thisVal/(comission+1))/100;
			var toValue = Math.floor(100*fromVal*rate)/100;

			$('#from_value').val(fromVal);
			$('#to_value').val(toValue);
		}
	});
	//если заполнили второе поле
	$('#main_tabs_content').on('change','#to_value',function(){
		var rate = getRate($('#currency_from').val(),$('#currency_to').val());
		if(rate && $('#currency_from').val() != '' && $('#currency_to').val() != ''){
			var thisVal = parseFloat($(this).val());
			var from_value =  Math.ceil(100*thisVal/rate)/100;
			var commission = Math.ceil(100*from_value*getComission($('#currency_from').val(),$('#currency_to').val()))/100;
			var withCommission = from_value+commission;
			$('#from_value').val(from_value);
			$('#with-commission').val(withCommission);
		}
	});

	//Переходим вперед
    $('#main_tabs_content').on('submit','form',function(e){
    	var thisTab = $(this).parent('.tab-content');
    	e.preventDefault();
    	//здесь может быть валидация
		$.ajax({
			url: $(this).attr("action"),
			data: $(this).serializeArray(),
			type: 'POST'
		}).done(function(data){
			//Грузим контент вкладки
			thisTab.fadeOut('200',function(){
				$('#main_tabs_content').append(data);
				//Рисуем чекбокс
				$('input.i-grey-flat').iCheck({
					checkboxClass: 'icheckbox_flat-grey',
					radioClass: 'iradio_flat-grey',
					increaseArea: '20%'
				});
			}).fadeOut(100);
		});
    });

	//Переходим назад
	$('#main_tabs_content').on('click','.go-prev-tab',function(e){
		e.preventDefault();
		var thisTab = $(this).parents('.tab-content');
		thisTab.fadeOut(100,function(){
			thisTab.prev().fadeIn(100);
			thisTab.remove();
		});
	});

	//Валидация на заполнение полей
	$('#main_tabs_content').on('change ifToggled','.form-step-2 input',function(e){
		var inputs = [];
		inputs[0] = $('.form-step-2 #card_from').val() == '' ? false : true;
		inputs[1] = $('.form-step-2 #card_to').val() == '' ? false : true;
		inputs[2] = $('.form-step-2 #first_name').val() == '' ? false : true;
		inputs[3] = $('.form-step-2 #second_name').val() == '' ? false : true;
		inputs[4] = $('.form-step-2 #email').val() == '' ? false : true;
		inputs[5] = $('.form-step-2 #accept_terms').is(":checked") ? true : false;

		function multiply(array) {
			var sum = 1;
			for (var i = 0; i < array.length; i++) {
			    sum = sum * array[i];
			}
			return sum;
		}
		console.log(multiply(inputs));
		
		if(multiply(inputs) == 1){
			$('.form-step-2 .go-next-tab').removeClass('disabled');
		}else{
			$('.form-step-2 .go-next-tab').addClass('disabled');
		}
	});



	/***************************************/
	/**************** КУРСЫ **************/
	/***************************************/

	//Параметри графика
	//Стиль Area
	var graph_area = {
		lines: {
      show: true,
      fill: false
    },
    points: {
			show: true,
			lineWidth: 2,
			fill: true,
			fillColor: "#ffffff",
			symbol: "circle",
			radius: 5
    }
	};
	//Стиль Bar
	var graph_bar = {
		lines: {show: false},
		bars: {show: true, barWidth: 500000, align: 'center'}
	};

	var selected_rates = [];

	//Перезагружаем данные и перерисовуем график при изменении периода
	$('#main_tabs_content').on('click','.rates-graph-buttons .periods a.btn',function(e){
		e.preventDefault();
		var period = $('.rates-graph-buttons .periods a.btn.selected').attr('data-period');
		//Проверяем, какой вид включен
		var graph_view = $('.rates-graph-buttons .graph-view a.btn.selected').attr('data-view');

		$.ajax({
		  url: $('#currency_list').attr('data-rates'),
		  async : false,
			type : "POST",
			global : false,
			dataType : 'json',
		  data : {'period': period},
		  success: function(response){
		  	graphData = response;
		  	//перерисуем график
		  	$('#rates-graph').html('');
		  	plotReserves(graphData,selected_rates,graph_view);
		  }
		});
		$('.rates-graph-buttons .periods a').removeClass('selected btn-info');
		$(this).addClass('selected btn-info');
	});

	//При выборе курса
	$('#main_tabs_content').on('click','.rates-tab .currency-select li',function(){
		$(this).toggleClass('selected');
		var rate_id = $(this).attr('data-rate');
		var currency_from = $(this).find('.from .name').text();
		var currency_to = $(this).find('.to .name').text();
		var rate_name = currency_from+'<i class="fa fa-angle-right"></i>'+currency_to;
		//Запихаем отмеченные в массив
		if(selected_rates.indexOf(rate_id) == -1){
			selected_rates.push(rate_id);
			$('.chosen-choices').append('<li data-selected="'+rate_id+'" class="search-choice"><span>'+rate_name+'</span><a class="search-choice-close"></a></li>');
		}else{
			selected_rates.splice(selected_rates.indexOf(rate_id), 1);
			$('.chosen-choices li[data-selected="'+rate_id+'"]').remove();
		}
		//Проверяем, какие настройки включены
		var graph_view = $('.rates-graph-buttons .graph-view a.btn.selected').attr('data-view');

		if(selected_rates.length > 0){
			plotReserves(graphData,selected_rates,graph_view);
		}else{
			$('#rates-graph').html('');
		}
		
	});

	//При удалении виделенного
	$('#main_tabs_content').on('click','.rates-tab .open-select .chosen-choices .search-choice-close',function(){
		var rate_id = $(this).parent('li').attr('data-selected');
		$(this).parent('li').remove();
		$('.rates-tab .currency-select li[data-rate="'+rate_id+'"]').removeClass('selected');
		selected_rates.splice(selected_rates.indexOf(rate_id), 1);

		//Проверяем, какие настройки включены
		var graph_view = $('.rates-graph-buttons .graph-view a.btn.selected').attr('data-view');

		if(selected_rates.length > 0){
			plotReserves(graphData,selected_rates,graph_view);
		}else{
			$('#rates-graph').html('');
		}
	});

	//Перерисовуем график при изменении вида
	$('#main_tabs_content').on('click','.rates-graph-buttons .graph-view a.btn',function(e){
		e.preventDefault();
		var graph_view = $(this).attr('data-view');

		$('#rates-graph').html('');
		plotReserves(graphData,selected_rates,graph_view);
		
		$('.rates-graph-buttons .graph-view a').removeClass('selected btn-info');
		$(this).addClass('selected btn-info');
	});

	//Функция отприсовки графика
	function plotReserves (data_rates,selected,options){
		var graph_options = options == 'bar' ? graph_bar : graph_area;

		var rates = [];
		for(var i = 0; i < selected.length; i++){
			var cid = selected[i];
			rates.push({data: data_rates[cid].rates, label: "&nbsp;"+cid});
		}

		$.plot($("#rates-graph"), 
			rates, {
		    series: graph_options,
		    grid: {
	        hoverable: true,
	        clickable: true,
	        tickColor: "#eeeeee",
	        borderWidth: 1,
	        borderColor: "#eeeeee"
		    },
		    colors: [getRandomColor(), getRandomColor()],
		    tooltip: true,
		    tooltipOpts: {
				defaultTheme: false
		    },
		    xaxis: {
				mode: "time"
		    },
		    yaxes: [{
		        /* First y axis */
		    }, {
		        /* Second y axis */
		        position: "right" /* left or right */
		    }]
		});
	}

	//Генератор цветов
	function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
	}

	/*function getColor(str) {
		var out = '';
		for (i=0; i<str.length; i++) {
		  out += str.charCodeAt(i).toString(16);
		}
		return '#'+out.slice(0,6);
	}*/

	/***************************************/
	/************* USER PROFILE ************/
	/***************************************/
	//Языковые настройки DataTables
	var dataTablesLng = {
		"emptyTable":     "Нет данных",
		"info":           "Показано _START_ - _END_ из _TOTAL_",
		"infoEmpty":      "Showing 0 to 0 of 0 entries",
		"infoFiltered":   "(filtered from _MAX_ total entries)",
		"infoPostFix":    "",
		"thousands":      ",",
		"lengthMenu":     "_MENU_",
		"loadingRecords": "Загрузка...",
		"processing":     "Обработка...",
		"search":         "Поиск: ",
		"zeroRecords":    "По данному запросу записей не найдено",
		"paginate": {
		  "first":      "Первая",
		  "last":       "Последняя",
		  "next":       "Следующая",
		  "previous":   "Предыдущая"
		},
		"aria": {
		  "sortAscending":  ": activate to sort column ascending",
		  "sortDescending": ": activate to sort column descending"
		}
	};
	//Набор и расположение элементов DataTables
	//var dataTablesDom = '<"table-top"f>t<"row"<"table-left col-md-6"p><"table-right col-md-6"l>><"clear">';
	var dataTablesDom = '<"table-top">t<"row"<"table-left col-md-6"p><"table-right col-md-6"l>><"clear">';

	//Таблица транзакций
	$('#datatable-user-transactions').dataTable({
		 "columns": [
    	null,
	    {"orderable": false },
	    null,
	    null,
	    null
	  ],
		order : [[ 0, "desc" ]],
		dom : dataTablesDom,
		language : dataTablesLng
	});

});