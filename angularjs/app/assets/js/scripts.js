$( ".js_add_server" ).click(function(e) {
	e.preventDefault();
	$(".slider-box").toggle("slide");
});
$( ".js_show_processes" ).click(function() {	
	$(this).find("ul").slideToggle();
});
