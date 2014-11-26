$(document).ready(function (){
	$('body').on('click', '.add-inf', function(){
	var id=$(this).attr('rel');

	if($('#inf-'+id).is(':visible')) {
		$('#inf-'+id).slideUp('slow', function() {});
		$('#inf-btn-'+id).find('i').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
		return true;		
	}else{
		if($('#inf-'+id).html() !== ""){
			$('#inf-'+id).slideDown('slow', function() {});
			$('#inf-btn-'+id).find('i').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			return true;
		}
	}

	$(this).attr('disabled','disabled');
	var jsonUrl = "/ajax/info";
	$.post(
		jsonUrl,
		{id: id},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
			}else{
				if (json.type == "html"){
					$('#inf-'+json.id).html(json.content);
					$('#inf-'+json.id).slideDown('slow', function() {});
				}else{
					$('#inf-btn-'+json.id).click(function (){
						window.open(json.content);
					});		
					window.open(json.content);
				}
			}
			$('#inf-btn-'+json.id).removeAttr('disabled');
			if (json.type == "html"){
				$('#inf-btn-'+json.id).find('i').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			}
		},
		"json"
	);
});

$('body').on('click', '.cmt-btn', function(){
	var id=$(this).attr('rel');
	if(!$('#cmt-'+id).is(':visible')) {
		$('#cmt-'+id).slideDown('slow', function() {$('#cmt-field-'+id).focus();});		
	}
});

$('body').on('blur', '.cmt-field', function(){
	var id=$(this).attr('rel');
	if($(this).val() == ""){
		$('#cmt-'+id).slideUp('slow', function() {});	
	}
});

$('body').on('click', '.add-bib-inf', function(){
	var id=$(this).attr('rel');
	if($('#bib-inf-'+id).is(':visible')) {
		$('#bib-inf-'+id).slideUp('slow', function() {});
		$('#bib-inf-btn-'+id).find('i').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
		return true;		
	}else{
		if($('#bib-inf-'+id).html() !== ""){
			$('#bib-inf-'+id).slideDown('slow', function() {});
			$('#bib-inf-btn-'+id).find('i').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			return true;
		}
	}
});

$('#search-field').keypress(function (e) {
	if (e.which == 13) {
		if ($('#search-field').val() !== ''){
			window.location.href="/search/"+$('#search-field').val();
		}
		return false;
	}
});

$('body').on('click', '.add-watchlist', addwl);
$('body').on('click', '.rm-watchlist', rmwl);

function rmwl(){
	var b=$(this);
	var r = JSON.parse(b.attr('rel'));
	var id=r.id;
	var wl=r.wl;
	var rm=r.rm;
	b.attr('disabled','disabled');
	var jsonUrl = "/ajax/watchlist-rm";
	$.post(
		jsonUrl,
		{id: id, wl: wl, rm: rm},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
				$('#wl-btn-'+json.id).find('.rm-watchlist').removeAttr('disabled');
			}else{
				if (!json.rm){
					$('#row-'+json.id).find('.wl-btn').html(json.btn);	
					$('.add-watchlist').click(addwl);
					$('.rm-watchlist').click(rmwl);
				}else{
					$('#row-'+json.id).fadeOut();			
				}
				$('#wl-count-'+json.wl).html(json.content);
			}
		},
		"json"
	);
}

function addwl(){
	var b=$(this);
	var r = JSON.parse(b.attr('rel'));
	var id=r.id;
	var wl=r.wl;
	var rm=r.rm;
	b.attr('disabled','disabled');
	var jsonUrl = "/ajax/watchlist";
	$.post(
		jsonUrl,
		{id: id, wl: wl, rm: rm},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
				$('#wl-btn-'+json.id).find('.add-watchlist').removeAttr('disabled');
			}else{
				if (!json.rm){
					$('#row-'+json.id).find('.wl-btn').html(json.btn);	
					$('.add-watchlist').click(addwl);
					$('.rm-watchlist').click(rmwl);
				}else{
					$('#row-'+json.id).fadeOut();		
				}
				$('#wl-count-'+json.wl).html(json.content);
			}
		},
		"json"
	);
	return false;
}

$('body').on('click', '.add-cart', addct);
$('body').on('click', '.rm-cart', rmct);

function rmct(){
	var b=$(this);
	var r = JSON.parse(b.attr('rel'));
	var id=r.id;
	var rm=r.rm;

	b.attr('disabled','disabled');

	var jsonUrl = "/ajax/cart-rm";

	$.post(
		jsonUrl,
		{id: id, rm :rm},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
				$('#ct-btn-'+json.id).find('.rm-cart').removeAttr('disabled');
			}else{
				if (!json.rm){


				}else{
					$('#row-'+json.id).fadeOut();
				}

				$('#estprice').html('EUR '+json.price);
				$('#price_known').html(json.known);
				$('#price_est').html(json.est);
				
				$('#cart-count').html(json.content);
			}
		},
		"json"
	);
}

function addct(){
	var b=$(this);
	var r = JSON.parse(b.attr('rel'));
	var id=r.id;
	var rm=r.rm;

	if ($('#lft-'+id).val() == ""){
		var lft=$('#lft-'+id).attr('rel');
	}else{
		var lft=$('#lft-'+id).val();
	}

	if ($('#selcode-'+id).val() == ""){
		var selcode=$('#selcode-'+id).attr('rel');
	}else{
		var selcode=$('#selcode-'+id).val();
	}

	if ($('#ssgnr-'+id).val() == ""){
		var ssgnr=$('#ssgnr-'+id).attr('rel');
	}else{
		var ssgnr=$('#ssgnr-'+id).val();
	}

	var bdg=$('#bdg-'+id).val();
	var comment=$('#cmt-field-'+id).val();

	b.attr('disabled','disabled');

	var jsonUrl = "/ajax/cart";

	$.post(
		jsonUrl,
		{id: id,
		bdg: bdg,
		lft: lft,
		selcode: selcode,
		ssgnr: ssgnr,
		comment: comment,
		rm: rm},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
				$('#ct-btn-'+json.id).find('.add-cart').removeAttr('disabled');
			}else{
				if (!json.rm){
					$('#row-'+json.id).find('.ct-btn').html(json.btn);	
					$('.add-cart').click(addct);
					$('.rm-cart').click(rmct);
				}else{
					$('#row-'+json.id).fadeOut();
				}

				$('#estprice').html('EUR '+json.price);
				$('#price_known').html(json.known);
				$('#price_est').html(json.est);

				$('#cart-count').html(json.content);
			}
		},
		"json");
}

$('.chg-set').click(function (){
	var r = JSON.parse($(this).attr('rel'));
	var jsonUrl = "/ajax/change-setting";
	$.post(
		jsonUrl,
		{type: r.type, value: r.value},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
			}else{
				window.location.reload();
			}
		},
		"json"
	);
});


$('body').on('click', '.disabled', function(){
	return false;
});

$('#btn-cont').click(function (){
	var jsonUrl = "/ajax/confirm";
	$.post(
		jsonUrl,
		{},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
			}else{
				$('#contentwrapper').fadeOut(400, function (){$('#contentwrapper').remove();});
				$('#loader').fadeOut(400);
				$('.controls').fadeOut(400, function (){
					$('.controls').remove();
					if (! $('.confirm').length) {
						$('.page-header').parent().append("<div class=\"confirm\" style=\"display:none;\">"+json.content+"</div>");
						$('.btn-order').click(function (){
							window.open($(this).attr("rel"),"_self");
						});
						$('.confirm').fadeIn();
						$.disable_endless_scroll = true;
					}
				});
				$('#btn-cont').fadeOut();
			}
		},
		"json"
	);
});


$('.btn-order').click(function (){
	window.open($(this).attr("rel"),"_self");
});


$('body').on('click', '.btn-opac', function (){
	var url=$(this).attr('rel');
	window.open(url,"_blank");
});


$('body').on('click', '.cover-lg', function (){
	$('#lg-cover-img').attr('src', '');
	var url=$(this).attr('rel');
	$('#lg-cover-img').attr('src', url);
	$('#modalCover').modal({'keyboard': true});
});

$('.search-lbl').click(function (){
	$('#modalHelp').modal({
		'keyboard': true
	});
	$('#modalHelp').find('.modal-content').load('/assets/html/help.html');
});

$('#search-field').keypress(function (e) {
	if (e.which == 13) {
		location.href="/search/"+$('#search-field').val();
		return false;
	}
});

$('body').on('click', '.xt-remove', function (){
	var r = JSON.parse($(this).attr('rel'));
	var id=JSON.stringify(new Array(r.id));
	var jsonUrl = "/ajax/reject";
	$.post(
		jsonUrl,
		{id: id},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
			}else{
				var js=JSON.parse(json.id);
				var id=js[0];
				$('#row-'+id).fadeOut(400, function (){$('#row-'+id).remove();});
			}
		},
		"json"
	);
});

$('body').on('click', '.rj-remove', function (){
	var r = JSON.parse($(this).attr('rel'));
	var id=r.id;
	var jsonUrl = "/ajax/reject-rm";
	$.post(
		jsonUrl,
		{id: id},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
			}else{
				$('#row-'+json.id).fadeOut(400, function (){$('#row-'+json.id).remove();});
			}
		},
		"json"
	);
});

$('#btn-rj-all').click(function (){
	var id=JSON.stringify(list);
	var jsonUrl = "/ajax/reject";
	$.post(
		jsonUrl,
		{id: id},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
				window.location.reload();
			}else{
				var js=JSON.parse(json.id);
				for (var i=0; i < js.length; i++){
					$('#row-'+js[i]).fadeOut(400, function (){$('#row-'+js[i]).remove();});	
				}
				window.location.reload();
			}
		},
		"json"
	);
});

$('#btn-del-all').click(function (){
	var jsonUrl = "/ajax/delete";
	$.post(
		jsonUrl,
		{},
		function(json) {
			if(!json.success){
				alert("Fehler: "+json.errormsg);
			}
			window.open("/","_self");
		},
		"json"
	);
});

$('#cart-btn').popover({
	animation: true,
	placement: 'bottom',
	title: 'Preisangaben',
	html: true,
	content: function() {
		return $('#price-inf').html();
	},
	trigger: 'hover',
	delay: 100
});

});

$.scr_req_pending = false;
$.disable_endless_scroll = false;

$(window).scroll(function(){
	if($(window).scrollTop() == $(document).height() - $(window).height()){
		if(!$.disable_endless_scroll && !$.scr_req_pending){
			$.scr_req_pending = true;
			$('div#loader').show();
			$.ajax({
				url: $.pageload_url+$.page,
				success: function(html){
				if(html){
					$("#contentwrapper").append(html);
					$('div#loader').hide();
					$.page++;
					$.scr_req_pending = false;
				}else{
					$('div#loader').html('<h3>Keine weiteren Titel in dieser Ansicht</h3>');
				}
			}
			});
		}
	}
});
