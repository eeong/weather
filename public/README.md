# KakaoMap을 활용한 인터렉티브 날씨 정보 어플리케이션

### [링크](https://eeong-weather.web.app){: target="_blank"}

## 스택

 - 프론트엔드  
	- Ajax, ES6 
 
 - 퍼블리싱
	- HTML, CSS, Bootstrap, jQuery, Swiper.js

 - 디자인
	- Adobe PhotoShop

 - 관리
	- Git

 - 배포
	- Firebase

## 구조

 1. ajax로 도시 좌표 정보들을 받아와 변수에 저장한다.

 2. kakao.maps.Map의 인스턴스를 생성하여 html에 맵핑한다. 

 3. 도시 좌표 변수에 해당하는 위치에 kakao.map 인스턴스를 생성하여 렌더링한다.

 4. 현재위치를 geolocation객체의 메소드를 통해 받아와 api요청을 통해 현재 위치 날씨 정보를 렌더링 한다.

 5. 지도의 도시를 클릭하면 해당 도시에 해당하는 좌표로 api요청을 보내 현재 위치 날씨 정보를 렌더링 한다.

 6. select에서 도시를 선택하면 해당 도시에 해당하는 좌표로 api요청을 보내 현재 위치 날씨 정보를 렌더링 한다.
 
 7. 선택된 도시 좌표로 api요청을 보내 일주일 날씨정보를 받아 슬라이드로 렌더링 한다.

 