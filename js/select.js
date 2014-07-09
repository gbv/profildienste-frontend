var list = new Array();

$('body').on('click', '.xt-list', function (){
	var rel=$(this).attr('rel');
	var j = JSON.parse(rel);
	if(j.checked){
		$(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
		j.checked=false;
		$(this).attr('rel', JSON.stringify(j));
		for (var i=0; i < list.length; i++){
			if (list[i] == j.id){
				var a = list.slice(0,i);
				var b = list.slice((i+1),list.length);
				list = a.concat(b);
			}
		}
		$('#row-'+j.id).css('background-color', 'transparent');
		$(this).css('color', '');
		if(list.length == 0){
			$('#sel-menu').fadeOut(200, function (){ $('#top-menu').fadeIn(200); });
			$('#btn-chg-menu').remove();
		}
		$('#sel-count').html(list.length);

	}else{

		$(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
		list.push(j.id);
		j.checked=true;
		$(this).attr('rel', JSON.stringify(j));
		$('#row-'+j.id).css('background-color', '#fff8e6');
		$(this).css('color', '#db5800');
		if(list.length == 1){
			$('#top-menu').fadeOut(200, function (){ $('#sel-menu').fadeIn(200); });
		}
		$('#sel-count').html(list.length);

	}
});

$('#btn-sel-all').click(function (){
	$('.xt-list').each(function (){
		var rel=$(this).attr('rel');
		var j = JSON.parse(rel);
		if(!j.checked){
			$(this).click();
		}
	});
	return false;
});

$('#btn-sel-all-bar').click(function (){
	var g,c;
	g=0;
	c=0;
	$('.xt-list').each(function (){
		g++;
		var rel=$(this).attr('rel');
		var j = JSON.parse(rel);
		if(!j.checked){
			$(this).click();
		}else{
			c++;
		}
	});
	if(g == c){
		sel_none()
	}

	return false;
});

$('#btn-sel-none').click(sel_none);

function sel_none(){
	$('.xt-list').each(function (){
		var rel=$(this).attr('rel');
		var j = JSON.parse(rel);
		if(j.checked){
			$(this).click();
		}
	});
	return false;
}

$('#sel-menu').find('.sep-right').html('<a href="#" id="btn-chg-menu" rel=\''+JSON.stringify({menu: 'sel'})+'\'><i class="fa fa-exchange fa-lg"></i></a>');
$('#btn-chg-menu').click(chg_menu);

function chg_menu(){
	var rel=$(this).attr('rel');
	var j = JSON.parse(rel);	
	if (j.menu == "sel"){

		$('#sel-menu').fadeOut(200, function (){ 
			$('#btn-chg-menu').remove();
			$('#top-menu').find('.chg-menu').html('<a href="#" id="btn-chg-menu" rel=\''+JSON.stringify({menu: 'top'})+'\'><i class="fa fa-exchange fa-lg"></i></a>');
			$('#btn-chg-menu').click(chg_menu);
			$('#top-menu').fadeIn(200);
			});

	}else{

		$('#top-menu').fadeOut(200, function (){ 
			$('#btn-chg-menu').remove();
			$('#sel-menu').find('.sep-right').html('<a href="#" id="btn-chg-menu" rel=\''+JSON.stringify({menu: 'sel'})+'\'><i class="fa fa-exchange fa-lg"></i></a>');
			$('#btn-chg-menu').click(chg_menu);
			$('#sel-menu').fadeIn(200);
			});
		

	}
}

$('#btn-sel-all-bar').tooltip({
	placement : 'bottom',
	title : 'Alle auswählen'
});
