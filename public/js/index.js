/*********** Global *************/
var appid = 'd905c12b72e24ba0ea5f7746a96c3d73'
var kakaokey = "81847498407d020eeeecb5cf3ec823a8";
var dailyURL = 'http://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'http://api.openweathermap.org/data/2.5/forecast';
var cls;

var sendData = {
	appid: appid,
	units: 'metric',
	lang: "kr"
}

moment.locale('ko');//moment ko지역 설정

/*********** Function *************/
//1. 지도 이미지 생성
//2. 도시정보를 불러와 openweathermap 에 요청
//3. 코ㄹ백된 각 도시의 날씨정보를 생성된 지도에 표시

var mapMaker,container, options, map, html, iwPosition, customWindow, position, pos;
container = document.getElementById('map');
	options = {
		center: new kakao.maps.LatLng(35.82, 127.48),
		level: 13
	};
	map = new kakao.maps.Map(container, options);
	map.setDraggable(false);
	map.setZoomable(false);
	$.get('../json/city.json', onGetCity);


function onGetCity(r){
		r.cities.forEach(function(v, i){
			sendData.id = null;
			sendData.lat = v.lat;
			sendData.lon = v.lon;
			$.get(dailyURL, sendData, function(res){onGetDaily(res,v.class)});
			$("#city").append("<option value="+v.id+">" + v.name + "</option>");
		});
	}

function onGetDaily(r,v){
	icon = "https://openweathermap.org/img/wn/"+ r.weather[0].icon +"@2x.png";
	cls= v;
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

function onGetLoc(r){
	sendData.id = null;
	sendData.lat = r.coords.latitude; 
	sendData.lon = r.coords.longitude; 
	dt = new Date();
	$.get(dailyURL,sendData,onGetDailyWeather);
	$.get(weeklyURL,sendData,onGetWeeklyWeather);
}

function onGetDailyWeather(r){
	var dtDate = moment(r.dt * 1000).format('M월 D일');
	var dtTime = moment(r.dt * 1000).format('H시 m분');
	var locTitle = r.name+', '+ r.sys.country 
	function windDeg(deg){
		for(var i = 1; i<13; i++){
			var iArr = ['북북동','북동','북동동','남동동','남동','남남동','남남서','남서','남서서','북서서','북서','북북서']
			if( deg > (i-1)*30 && deg <= i*30){
				return iArr[i-1] + '풍';
		}
		}}
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

// 지역 변경 이벤트
$("#city").change(onGetCityWeather);

function onGetCityWeather(){
	sendData.id = $(this).val();
	sendData.lat = null;
	sendData.lon = null;
	$.get(dailyURL,sendData,onGetDailyWeather);
	$.get(weeklyURL,sendData,onGetWeeklyWeather);
	$('.info-window').removeClass('active');
	$('#c'+$(this).val()).addClass('active');
	$('.info-window').find('.img-arrow').attr('src', '../img/arrow.png')
	$('#c'+$(this).val()).find('.img-arrow').attr('src', '../img/arrow-a.png')
	onGetDaily();
}


// 지도 클릭 이벤트
function onCustomClick(id){
	$("#city").val(id).trigger('change');
}

function onGetWeeklyWeather(r){

}

function error(err){

}

navigator.geolocation.getCurrentPosition(onGetLoc, error, options);

