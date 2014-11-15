	$('#inputID').blur(function(){
		validate_id();
	});

	$('#inputPassword').blur(function(){
	validate_pw();	
	});

	function validate_id(){
		var v=$('#inputID').val();
		if (v.match(/^\d{4}$/)){
			$('#inputPassword').focus();
			if ($('#login-form-id').hasClass('has-error')){
			$('#login-form-id').removeClass('has-error');
			$('#id-helper').hide(); 
			}	 
		}else{
			$('#login-form-id').addClass('has-error');
			$('#id-helper').show();
		}
	}

	function validate_pw(){
		var v=$('#inputPassword').val();
		if (v != ""){
			if ($('#login-form-pw').hasClass('has-error')){
			$('#login-form-pw').removeClass('has-error');
			$('#pw-helper').hide(); 
			}	 
		}else{
			$('#login-form-pw').addClass('has-error');
			$('#pw-helper').show();
		} 
	}

	$(document).ready(function (){
		$('#inputID').focus();
	});

	$('#login-form-submit').click(function(){
		var cont=true;
		if($('#inputID').val() == "" || $('#inputPassword').val() == "" || $('.has-error').length > 0){
			cont=false;
		}
		if(cont){
			$('#login-form').submit();
		}else{
			$('#login-form').effect("bounce", {times: 3, direction: 'right'}, 'slow');
		}
	});

	$('#login-form').keypress(function (e) {
		if (e.which == 13) {
			validate_id();
			validate_pw();
			$('#login-form-submit').click();
			return false;
		}
	});