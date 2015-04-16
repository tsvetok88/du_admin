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
	/**************** СПИСОК ОТЧЕТОВ ****************/
	/************************************************/

	//Иницыализируем эдитор данных таблицы
	var reports_editor = new $.fn.dataTable.Editor( {
    ajax: {
      url: $('#datatable-reports').attr('data-update'),
      type: 'POST'
    },
    table: "#datatable-reports",
    fields: [
    	{label: "ID", name: "DT_RowId", type : "hidden"},
    	{label: "Название отчета", name:  "name"},
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
	$('#datatable-reports').on( 'click', 'tbody td.editable', function (e) {
		e.stopImmediatePropagation();
		var that = this.nodeName == 'SPAN' ? this.parentNode : this;
		reports_editor.inline(that,{
			submitOnBlur: true
		});
	});

	//Удаление рядка
	$('#datatable-reports').on( 'click', 'tbody td .remove', function (e) {
		e.stopImmediatePropagation();
		var row = tableReports.row($(this.parentNode.parentNode));
		deleteRow('Удалить отчет "'+row.data()['name']+'"', row.data()['id'], $('#datatable-reports').data('delete'), function(){
			row.remove().draw()
		});
		//console.log(this.parentNode.parentNode);

	});

	//Иницыализируем таблицу с данными, подгружаем JSON
	var tableReports = $('#datatable-reports').DataTable({
		ajax : $('#datatable-reports').data('json'),
		columns : [
			{	
				data : "name",
				class : "link",
				render : function (data, type, row) {
					return '<a href="/'+row.id+'" class="status-'+row.visible+'">'+row.name+'</a>'
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
			dragHandle: ".drag"
		});
	}

	$('table td.clear').click(function(){
		var row = $(this).parent('tr');
		row.find('input').val('');
		row.find('select').val('');
	});
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