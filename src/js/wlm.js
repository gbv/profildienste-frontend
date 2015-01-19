$(document).ready(function(){

	$('.wlm-edit').click(wlm_nm_edit);

	function wlm_nm_edit(){
		var val=$(this).parent().find('p').html();
		$(this).parent().find('p').remove();
		var inp='<input type="text" class="form-control input-sm" value="'+val+'" rel="'+val+'">';
		$(this).parent().find('div').html(inp);
		$(this).removeClass('wlm-edit').addClass('wlm-edit-submit');
		$(this).find('i').removeClass("fa-pencil").addClass('fa-check');
		$(this).off('click');
		$(this).click(wlm_nm_upd);
		$(this).parent().find('.form-control').focus();
		$(this).parent().find('.form-control').keypress(function (e) {
			if (e.which == 13) {
				$(this).parent().parent().find('button').click();
				return false;
			}
		});
	}

	function wlm_nm_upd(){
		var val = $(this).parent().find('.form-control').val();
		var rel = $(this).parent().find('.form-control').attr('rel');
		var new_nm = (val == "") ? rel : val;
		var id=$(this).attr('rel');
		if(new_nm != rel){
			var jsonUrl = "/ajax/watchlist-manage";
				$.post(
					jsonUrl,
					{type: 'upd-name', id: id, content: new_nm},
					function(json) {
						if(!json.success){
							alert("Fehler: "+json.errormsg);
							return;
						}
					},
					"json"
				);
		}
		$(this).parent().find('.form-control').remove();
		var inp='<p class="form-control-static">'+new_nm+'</p>';
		$(this).parent().find('div').html(inp);
		$(this).removeClass('wlm-edit-submit').addClass('wlm-edit');
		$(this).find('i').removeClass("fa-check").addClass('fa-pencil');
		$(this).off('click');
		$(this).click(wlm_nm_edit);
	}

	$('.wlm-open').tooltip({
		placement : 'bottom',
		title : 'Merkliste öffnen'
	});

	$('.wlm-def').tooltip({
		placement : 'bottom',
		title : 'Als Standard setzen'
	});

	$('.wlm-remove').tooltip({
		placement : 'bottom',
		title : 'Merkliste löschen'
	});

	$('.wlm-action').click(function (){
		var r = JSON.parse($(this).attr('rel'));
		var jsonUrl = "/ajax/watchlist-manage";
		if(r.type == "open"){
			window.open("/show/watchlist/"+r.id,"_self");
		}
		$.post(
			jsonUrl,
			{type: r.type, id: r.id},
			function(json) {
				if(!json.success){
					alert("Fehler: "+json.errormsg);
				}else{
					if(json.type == "def"){
						$('.default').removeAttr('disabled').removeClass('disabled');
						$('#wl-'+json.id).find('.wlm-def').tooltip('hide').attr('disabled','disabled').addClass('default');
					} else if (json.type == "remove"){
						$('#wl-'+json.id).fadeOut(400, function (){ $('#wl-'+json.id).remove(); });
					}
				}
			},
			"json"
		);
	});

	$('#wlm-add-btn').click(function(){
		
		var val = $('#wlm-add').val();
		if(val != ''){
			var jsonUrl = "/ajax/watchlist-manage";
			$.post(
				jsonUrl,
				{type: 'add-wl', id: 'X', content: val},
				function(json) {
					if(!json.success){
						alert("Fehler: "+json.errormsg);
					}else{
						window.location.reload();
					}
				},
				"json"
			);
		}
	});

	$('#wlm-add').keypress(function (e) {
			if (e.which == 13) {
				$('#wlm-add-btn').click();
				return false;
			}
	});

	$(function() {
		var fixHelper = function(e, ui) {
				ui.children().each(function() {
						$(this).width($(this).width());
				});
				return ui;
		};

		$("#sort tbody").sortable({
				helper: fixHelper,
				update: function( event, ui ) {
					var new_order=$('#sort tbody').sortable( 'toArray' ).map(function (v){ var a=v.split('-'); return a[1]; });
					var jsonUrl = "/ajax/watchlist-manage";
					$.post(
						jsonUrl,
						{type: 'change-order', id: 'X', content: JSON.stringify(new_order)},
						function(json) {
							if(!json.success){
								alert("Fehler: "+json.errormsg);
							}
						},
						"json"
					);
				}
		}).disableSelection();

	});

});