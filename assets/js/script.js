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

	/* Documentation -> http://isocra.com/2008/02/table-drag-and-drop-jquery-plugin/ */
	$('.dnd-table').tableDnD({
		dragHandle: ".drag"
	});

	$('table td.clear').click(function(){
		var row = $(this).parent('tr');
		row.find('input').val('');
		row.find('select').val('');
	});
});