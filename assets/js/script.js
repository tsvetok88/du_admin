$(function(){
	/***********************************************************/
	/************************ ADMIN PAGE ***********************/
	/***********************************************************/

	/***********************************************************/
	/********************** ОБЩИЕ НАСТРОЙКИ ********************/
	/***********************************************************/

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
	};

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
	var dataTablesDom = '<"table-top"f>t<"row"<"table-left col-md-6"p><"table-right col-md-6"l>><"clear">';

	/************************************************/
	/**************** ПРОСТОЙ СПИСОК ****************/
	/************************************************/

	/*** #datatable-dtbase - простой список с редактированием ***/

	//Иницыализируем эдитор данных таблицы
	var dtbase_editor = new $.fn.dataTable.Editor( {
    ajax: {
      url: $('#datatable-dtbase').attr('data-update'),
      type: 'POST'
    },
    table: "#datatable-dtbase",
    fields: [
    	{label: "ID", name: "DT_RowId", type : "hidden"},
    	{label: "Name", name:  "name"},
    	{
    		name: "visible",
    		type:  "select",
    		ipOpts: [
          {label: "Скрытый", value: "0" },
          {label: "Видимий", value: "1" }
        ]
    	}
    ]
	});

	// Активируем редактирование
	$('#datatable-dtbase').on( 'click', 'tbody td.editable', function (e) {
		e.stopImmediatePropagation();
		var that = this.nodeName == 'SPAN' ? this.parentNode : this;
		dtbase_editor.inline(that,{
			submitOnBlur: true
		});
	});

	//Удаление рядка
	$('#datatable-dtbase').on( 'click', 'tbody td .remove', function (e) {
		e.stopImmediatePropagation();
		var row = tabledtbase.row($(this.parentNode.parentNode));
		deleteRow('Удалить "'+row.data()['name']+'"', row.data()['id'], $('#datatable-dtbase').data('delete'), function(){
			row.remove().draw()
		});
		//console.log(this.parentNode.parentNode);

	});

	//Иницыализируем таблицу с данными, подгружаем JSON
	var tabledtbase = $('#datatable-dtbase').DataTable({
		ajax : $('#datatable-dtbase').data('json'),
		columns : [
			{	
				data : "name",
				class : "link",
				render : function (data, type, row) {
					return '<a href="' + $('#datatable-dtbase').data('edit').replace('0', row.id) + '" class="status-'+row.visible+'">'+row.name+'</a>'
				}
			},
			{
				data : "visible",
				class : "text-center editable",
				render : function (data, type, row) {
					return data == 0 ? '<span class="label label-default">Скрытый</span>' : '<span class="label label-success">Видимий</span>';
				}
			},
			{ data: null, class : "text-center", defaultContent: '<a class="remove" href="#"><i class="fa fa-times"></i></a>', orderable: false },
		],
		order : [ 0, "asc" ],
		dom : dataTablesDom,
		language : dataTablesLng
	});


	/****** OTHER SCRIPTS *******/

	/* Documentation -> http://isocra.com/2008/02/table-drag-and-drop-jquery-plugin/ */
	if($('.dnd-table').length > 0){
		$('.dnd-table').tableDnD({
			dragHandle: ".drag",
            		onDragStart: function(table, row){
                		// console.log('drag start');
            		},
            		onDrop: function(table, row) {
                		// for fire this event you must add ID to <tr>
                		var pos = 1;
                		$('tr', table).each(function(){
                    			$('input[name^="position"]', this).val(pos);
                    			pos++;
                		});
            		}
		});
	}

	$('table td.clear').click(function(){
		var row = $(this).parent('tr');
		row.find('input').val('');
		row.find('select').val('');
	});

	$('.copy-rows .copy-button a').click(function(e){
		e.preventDefault();
		var length = $('.copy-rows .source-to-copy').length;
		var row = $('.copy-rows .source-to-copy:last').clone();
		row.find('.counter').text(length+1);
		row.insertAfter('.copy-rows .source-to-copy:last');
		//console.log($('.copy-rows .source-to-copy'));
	})

});


/***** DataTables Editor Helpers *****/
var deleteRow = function(message, id, url, callback){
	$.confirm({
		text: message,
		title: "Требуется подтверждение",
		confirm: function(button) {
			$.ajax({
				type: "POST",
				url: url,
				data: {action: "delete", id: id}
			}).done(function(response){
				if(response.status){
					toastr.success('Удалено');
					callback();
				}else{
					toastr.warning('Ошибка! Не удалено.');
				}
				if('message' in response){
					if(response.message != ''){
						toastr.info(response.message);
					}
				}
			}).fail(function(){
				toastr.warning('Ошибка! Не удалено.');
			});
		},
		cancel: function(button) {
		    return false;
		},
		confirmButton: "Да, удалить",
		cancelButton: "Не удалять",
		post: true
	});
};
