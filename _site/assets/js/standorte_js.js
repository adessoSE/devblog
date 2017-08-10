function showLocationAdress(locationId) {
	$(".standortLayer").slideUp();
	$(".standortLayer[data-id='" + locationId + "']").slideDown();
	$('html, body').animate({
		scrollTop : $(".adressInformationArea").offset().top - 200
	}, 1000);
};
function showLocationDetails(locationId) {
	$('html, body').animate({
		scrollTop : $(".location-accordion-tab[data-locationid='" + locationId + "']").offset().top - 200
	}, 1000);
	$(".location-accordion-tab[data-locationid='" + locationId + "']").trigger('click');
};
$('.adesso-close-standort').click(function (e) {
	$(".standortLayer").slideUp();
});
