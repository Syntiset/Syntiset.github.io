/*-----------------------------------------------------------------------------------*/
/*	МЕНЮ
/*-----------------------------------------------------------------------------------*/
ddsmoothmenu.init({
	mainmenuid: "smoothmenu1", //DIV id меню
	orientation: 'h', //горизонтальное или вертикальное меню: ставить "h" или "v"
	classname: 'ddsmoothmenu', //класс добавлен в меню внешнего DIV
	shadow: {enable:false}, //тени
	//кастомныетемы: ["#1c5a80", "#18374a"],
	contentsource: "markup" //"markup" или ["container_id", "path_to_menu_file"]
})

$(function() {
$('ul.grid img, .post a img, #about a img, .content a img').css("opacity","1.0");	
$('ul.grid img, .post a img, #about a img, .content a img').hover(function () {										  
$(this).stop().animate({ opacity: 0.75 }, "fast"); },	
function () {			
$(this).stop().animate({ opacity: 1.0 }, "fast");
});
});

$(function() {
$('a.button, .comment-form input#submit-button, #contact-form input#submit-button').css("opacity","1.0");	
$('a.button, .comment-form input#submit-button, #contact-form input#submit-button').hover(function () {										  
$(this).stop().animate({ opacity: 0.8 }, "fast"); },	
function () {			
$(this).stop().animate({ opacity: 1.0 }, "fast");
});
});

/*-----------------------------------------------------------------------------------*/
/*	ВКЛЮЧЕНИЕ
/*-----------------------------------------------------------------------------------*/
$(document).ready(function(){
//скрыть поле переключения при загрузке страницы
$(".togglebox").hide();
//скольжения вверх и вниз при нажатии над заголовком 2
$("h2").click(function(){
// эффект slideToggle установлен на slow, но можно переключить на fast при необходимости. мне это явно не нужно
$(this).toggleClass("active").next(".togglebox").slideToggle("slow");
return true;
});
});

/*-----------------------------------------------------------------------------------*/
/*	ВКЛАДКИ
/*-----------------------------------------------------------------------------------*/
$(document).ready(function() {
	$(".tab_content").hide(); Скрыть весь контент
	$("ul.tabs li:first").addClass("active").show(); //активнуть первую вкладку
	$(".tab_content:first").show(); //скрыть контент первой вкладки
	
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).find("a").attr("href");
		$(activeTab).fadeIn();
		return false;
	});

});