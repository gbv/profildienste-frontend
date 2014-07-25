var list = [];

(function(){

	var ICON_CHECKED = 'fa-check-square-o';
	var ICON_UNCHECKED = 'fa-square-o';

	$('body').on('click', '.xt-list', function (){

		var id = $(this).attr('rel');

		if($(this).hasClass('checked')){

			$(this).find('i').removeClass(ICON_CHECKED).addClass(ICON_UNCHECKED);
			$(this).toggleClass('checked');

			for (var i=0; i < list.length; i++){
				if (list[i] == id){
					var a = list.slice(0,i);
					var b = list.slice((i+1),list.length);
					list = a.concat(b);
				}
			}

			$('#row-'+id).toggleClass('selected');
			$(this).toggleClass('btn-selected');

			if(list.length == 0){

				$('#sel-menu').fadeOut(200, function (){
					$('#sel-menu').attr('style', 'display: none !important');
					$('#top-menu').attr('style', '');
					$('#top-menu').fadeIn(200);
				});

			}
			$('#sel-count').html(list.length);

		}else{

			$(this).find('i').removeClass(ICON_UNCHECKED).addClass(ICON_CHECKED);
			$(this).toggleClass('checked');

			list.push(id);

			$('#row-'+id).toggleClass('selected');
			$(this).toggleClass('btn-selected');

			if(list.length == 1){
				$('#top-menu').fadeOut(200, function (){
					$('#top-menu').attr('style', 'display: none !important');
					$('#sel-menu').attr('style', '');
					$('#sel-menu').fadeIn(200);
				});
			}

			$('#sel-count').html(list.length);
		}
	});

	$('#btn-sel-all').click(function (){
		$('.xt-list').each(function (){
			if(!$(this).hasClass('checked')){
				$(this).click();
			}
		});
		return false;
	});

	$('#btn-sel-all-bar').click(function (){

		var g = 0, c = 0;
		$('.xt-list').each(function (){
			g++;
			if(!$(this).hasClass('checked')){
				$(this).click();
			}else{
				c++;
			}
		});

		if(g == c){
			sel_none();
		}

		return false;
	});

	$('#btn-sel-none').click(sel_none);

	function sel_none(){
		$('.xt-list').each(function (){
			if($(this).hasClass('checked')){
				$(this).click();
			}
		});
		return false;
	}


	$('#btn-sel-all-bar').tooltip({
		placement : 'bottom',
		title : 'Alle auswählen'
	});

})();