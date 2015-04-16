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

	//Иницыализируем таблицу с данными, подгружаем JSON
	var tableRates = $('#datatable-reports').DataTable({
		ajax : $('#datatable-reports').data('json'),
		columns : [
			{	
				data : "name",
				class : "editable"
			},
			{
				data : "visible",
				class : "editable",
				render : function (data, type, row) {
					return data == 0 ? "Отобразить" : "Скрыть";
				}
			}
		],
		order : [ 1, "asc" ],
		dom : dataTablesDom,
		language : dataTablesLng,
		//События при генерации рядка
		fnCreatedRow: function( nRow, aData, iDataIndex ) {
			$(nRow).addClass('roww');
			console.log(nRow);
			console.log(aData);
			console.log(iDataIndex);
		}
	});

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