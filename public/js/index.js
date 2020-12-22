/*********** Global *************/
var appid = 'd905c12b72e24ba0ea5f7746a96c3d73';
var kakaokey = "81847498407d020eeeecb5cf3ec823a8";
var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
var cls;

var sendData = {
	appid: appid,
	units: 'metric',
	lang: "kr"
}

moment.locale('ko');

var mapMaker, container, options, map, html, iwPosition, customWindow, position, pos, mapCenter;

/*********** Function *************/

function mapInit(){
	container = document.getElementById('map');
	mapCenter = new kakao.maps.LatLng(35.82, 127.44);
	options = {
		center: mapCenter,
		level: 13
	};

	map = new kakao.maps.Map(container, options);
	map.setDraggable(false);
	map.setZoomable(false);
}
	
function onResize(){
	map.setCenter(mapCenter);

}

$(window).resize(onResize);
mapInit();

$.get('../json/city.json', onGetCity);

function onGetCity(r){
		r.cities.forEach(function(v, i){
			sendData.id = null;
			sendData.lat = v.lat;
			sendData.lon = v.lon;
			$.get(dailyURL, sendData, function(res){onGetDaily(res, v.class);});
			$("#city").append("<option value='"+v.id+"'>" + v.name + "</option>");
		});
	}

function onGetDaily(r, cls){
	icon = "https://openweathermap.org/img/wn/"+ r.weather[0].icon +"@2x.png";
	var html;
	html = '<div id="c'+r.id+'" class="info-window '+ cls+ ' " onclick="onCustomClick('+r.id+')">';
	html+='<img src="'+icon+'" style="width:40px;">';
	html+= '<div>온도 '+r.main.temp+'℃ <br>  체감 '+r.main.feels_like+'℃</div> <br>';
	html+='<div><img src="../img/arrow.png" class="img-arrow"></div>'
	html+='</div>'
  var position = new kakao.maps.LatLng(r.coord.lat , r.coord.lon)
	var customWindow = new kakao.maps.CustomOverlay({
 		position : position, 
		content : html,
		clickable: true,
});
customWindow.setMap(map);
}

//현재위치
navigator.geolocation.getCurrentPosition(onGetLoc, onErrorPos);

function onGetLoc(r){
	sendData.id = null;
	sendData.lat = r.coords.latitude; 
	sendData.lon = r.coords.longitude; 
	dt = new Date();
	$.get(dailyURL, sendData, onGetDailyWeather);
	$.get(weeklyURL, sendData, onGetWeeklyWeather);
}

function onErrorPos(e){
	console.log(e);
}

//새로고침
$(".bt-position").on('click',function(){
	location.reload();
});

//풍향함수
function windDeg(deg){
	for(var i = 1; i<17; i++){
		var iArr = ['북','북북동','북동','동북동','동','동남동','남동','남남동','남','남남서','남서','서남서','서','서북서','북서','북북서']
		if( deg > (i-1)*22.5 && deg <= i*22.5){
			return iArr[i-1] + '풍';
		}
	}
}

// 지역 변경 이벤트
$("#city").change(onGetCityWeather);

function onGetCityWeather(){
	sendData.id = $(this).val();
	sendData.lat = null;
	sendData.lon = null;
	$('.info-window').removeClass('active');
	$('#c'+sendData.id).addClass('active');
	$('.info-window').find('.img-arrow').attr('src', '../img/arrow.png')
	$('#c'+sendData.id).find('.img-arrow').attr('src', '../img/arrow-a.png')
	$.get(dailyURL,sendData,onGetDailyWeather);
	$.get(weeklyURL,sendData,onGetWeeklyWeather);
}

// 지도 클릭 이벤트
function onCustomClick(id){
	$("#city").val(id).trigger('change');
}

//데일리 
function onGetDailyWeather(r){
	var dtDate = moment(r.dt * 1000).format('M월 D일');
	var dtTime = moment(r.dt * 1000).format('H시 m분');
	var locTitle = r.name+', '+ r.sys.country 
	icon = "https://openweathermap.org/img/wn/"+ r.weather[0].icon +"@2x.png";
	$(".loc-wrapper .title-loc").text(locTitle);
	$(".loc-wrapper .title-date").text(dtDate);
	$(".loc-wrapper .title-time").text(dtTime);
	$(".cont-wrapper .icon-wrap img").attr('src' , icon);
	$(".daily-weather .temp-wrap .temp").text(r.main.temp);
	$(".daily-weather .temp-wrap .temp-feels").text(r.main.feels_like);
	$(".daily-weather .desc-wrap .desc-title").text(r.weather[0].main);
	$(".daily-weather .desc-wrap .desc").text(r.weather[0].description);
	$(".daily-weather .humid-wrap .humid").text(r.main.humidity);
	$(".daily-weather .humid-wrap .press").text(r.main.pressure);
	$(".daily-weather .humid-wrap .wind-direction").text(windDeg(r.wind.deg));
	$(".daily-weather .humid-wrap .wind-speed").text(r.wind.speed);
	$(".misc-wrap .sunrise").text(moment(r.sys.sunrise * 1000).format('H시 m분'));
	$(".misc-wrap .sunset").text(moment(r.sys.sunset * 1000).format('H시 m분'));
}

function onGetWeeklyWeather(r){
	$(".weekly-weather .slide-wrapper").empty();
	for(var i in r.list) {
		v = r.list[i];
		html = '<div class="slide swiper-slide">';
		html += '<div>';
		html += '<div class="icon">';
		html += '<img src="https://openweathermap.org/img/wn/'+v.weather[0].icon+'@2x.png" alt="아이콘">';
		html += '</div>';
		html += '<div class="temp-wrap">';
		html += '<span class="temp">'+v.main.temp+'</span>℃'; 
		html += '(체감: <span class="temp-feel">'+v.main.feels_like+'</span>℃)';
		html += '</div>';
		html += '<div class="press-wrap">';
		html += '기압: <span class="pressure">'+v.main.pressure+'</span>mmHg<br>';
		html += '습도: <span class="humidity">'+v.main.humidity+'</span>%';
		html += '</div>';
		html += '<div class="wind-wrap">';
		html += '바람: <span class="wind">'+windDeg(v.wind.deg)+'</span>';
		html +=  v.wind.speed+'<span class="wind-speed">m/s</span>';
		html += '</div>';
		html += '<div class="time">'+moment(v.dt * 1000).format('M월 D일 H시 기준')+'</div>';
		html += '</div>';
		html += '</div>';
		$(".weekly-weather .slide-wrapper").append(html);
	}

	//swiper count 함수
	function getCount() {
		var wid = $(window).outerWidth();
		var count = 3;
		if(wid <= 1199 && wid > 991) count = 2;
		else if(wid <= 991 && wid > 767) count = 3;
		else if(wid <= 767 && wid > 575) count = 2;
		else if(wid <= 575) {count = 1; }
		return count;
	}
	var swiper = new Swiper('.swiper-container', {
		slidesPerView: getCount(),
		slidesPerGroup: getCount(),
		spaceBetween: 0,
		freeMode: true,
		loopFillGroupWithBlank: true,
		navigation: {
			nextEl: '.bt-angle.bt-next',
			prevEl: '.bt-angle.bt-prev',
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: $(window).outerWidth() > 575 ? true : false
		},
	});

	swiper.on("resize", function() {
		this.params.slidesPerGroup = getCount();
		this.params.slidesPerView = getCount();
	});
}




