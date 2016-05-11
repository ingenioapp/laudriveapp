angular.module('appRouteCtrl', ['uiGmapgoogle-maps', 'google.places'])
/**
 * @ngdoc controller
 * @name appRouteCtrl:RouteCtrl
 * @description
 * Controller que contiene funciones CRUD para manipulacion de Rutas en el app.
 */
.controller('RouteCtrl', function($scope, $rootScope, $ionicModal, $ionicLoading, 
$ionicPopup, $state, $timeout, $http, $cordovaGeolocation, RouteService) {
	console.log("Controller route ready ...");
	var options = {timeout: 10000, enableHighAccuracy: true};
	var geocoder = new google.maps.Geocoder();
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	$scope.enableDelete = true;
	
/**
  * @ngdoc method
  * @name load
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Carga el mapa con la ruta actual y obtiene la dirección de la misma usando el API de Google.
*/
	$scope.load = function(){
		// Cargando la posicion actual
		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			$scope.getCityNameRoute(position.coords.latitude, 
							position.coords.longitude, true); 
			$scope.marker = { 
				id: 0,
				coords: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				},
				options: { draggable: true },
				events: {
					dragend: function (marker, eventName, args) {
						$scope.marker.options = {
							draggable: true,
							labelAnchor: "100 0",
							labelClass: "marker-labels"
						};
						$scope.getCityNameRoute($scope.marker.coords.latitude, 
							$scope.marker.coords.longitude, true);
					}
				}
			};
			$scope.map = { 
				center: { 
					latitude: position.coords.latitude, 
					longitude: position.coords.longitude 
				}, 
				control:{},
				zoom: 10 
			};
		});
		$scope.user = JSON.parse(localStorage["user"]);
		if( $scope.user.perfil === "user" ){
			$scope.enableDelete = false;
		}
	}

/**
  * @ngdoc method
  * @name openDialogSave
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Abre una ventana de confirmación para salvar o no la ruta  
*/	
	$scope.openDialogSave = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Mensaje de confirmación',
			template: '<div align="center">Se guardará la ruta actual en el sistema</div>'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$scope.saveRoute();
			}
		});
	}

/**
  * @ngdoc method
  * @name saveRoute
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Guarda una ruta en el sistema   
*/	
	$scope.saveRoute = function(){
		var route = {
			departure:{
				longitude:$scope.marker.coords.longitude,
				latitude:$scope.marker.coords.latitude,
				address:$scope.routeInit
			},
			destination:$scope.destination
		}
		route.destination.address =  document.getElementById("routeEnd").value;
		console.log("user: ", sessionStorage.getItem("user") );
		route.user=$scope.user.id;
		
		RouteService.register(route).then(function(res){
			$ionicPopup.alert({
				title: 'Mensaje de sistema',
				template: '<div align="center">Tu ruta ha sido guardada...</div>'
			});
		}).catch(function(err){
			console.error(JSON.stringify(err));
			alert("Error al registrar ruta");
		});
	}

/**
  * @ngdoc method
  * @name getRoutes
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Obtiene las rutas del sistema en base a perfil del usuario, en donde si es de tipo "user" 
  * obtiene solo las que le pertenecen, pero si es de tipo "admin" recuperará todas las rutas existentes 
*/		
	$scope.getRoutes = function(){
		if($scope.user.perfil === "user"){
			console.log("Obteniendo rutas por usuario: " + $scope.user.id);
			RouteService.getByUser($scope.user.id).then(function(result){
				$scope.routes = result.data;
			});
		}else{
			console.log("obteniendo rutas por admin");
			RouteService.getAll().then(function(result){
				$scope.routes = result.data;
			});
		}
	}
/**
  * @ngdoc method
  * @name showRoute
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Muestra una ruta en el mapa 
*/		
	$scope.showRoute = function(route){
		$scope.marker.coords.latitude = route.departure.latitude;
		$scope.marker.coords.longitude = route.departure.longitude;
		$scope.getCityNameRoute($scope.marker.coords.latitude, 
								$scope.marker.coords.longitude, true);
		$scope.createRouteEnd(route.destination.latitude, route.destination.longitude);
		$state.go('app.home');
	}
/**
  * @ngdoc method
  * @name delete
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Borra una ruta seleccionada 
*/	
	$scope.delete = function(route, index){
		console.log("delete route  ...");
		var confirmPopup = $ionicPopup.confirm({
			title: 'Mensaje de confirmación',
			template: '<div align="center">Se eliminara la ruta en el sistema</div>'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({
					template: 'Borrando ruta...'
				});
				RouteService.delete(route).then(function(result){
					$scope.routes.splice(index, 1);
					$ionicLoading.hide();
				}).catch(function(err){$ionicLoading.hide();});
			}
		});
	}
/**
  * @ngdoc method
  * @name getCityNameRoute
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Obtiene el nombre de una ruta en base a la latitud y longitud 
*/		
	$scope.getCityNameRoute = function( lat, lng, isInit ){
		var latlng = new google.maps.LatLng(lat,lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					if(isInit){
						$scope.routeInit = results[0].formatted_address;
					}else{
						$scope.routeEnd = results[0].formatted_address;
					}
				}
			}
		});
	}
	
	$scope.$on('g-places-autocomplete:select', function (event, param) {
		var location = JSON.parse(JSON.stringify(param)).geometry.location;
		console.log(JSON.stringify(param) ); 
		var lat = location.lat
		var lng = location.lng;	
		$scope.destination = {
			longitude:location.lng,
			latitude:location.lat
		}
		$scope.createRouteEnd(lat, lng);	
	});
	
/**
  * @ngdoc method
  * @name createRouteEnd
  * @methodOf appRouteCtrl:RouteCtrl
  * @description
  * Traza la ruta en base al punto inicial usando las coordenadas de longitud y latitud 
*/		
	$scope.createRouteEnd = function(lat, lng){
		console.log("ruta final LAT: ", lat);
		console.log("ruta final LNG: ", lng);
		var request = {
			origin: new google.maps.LatLng($scope.marker.coords.latitude, $scope.marker.coords.longitude),
			destination:  new google.maps.LatLng(lat, lng),
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		console.log("ruta final: ", JSON.stringify(request));
		directionsService.route(request, function (response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setMap($scope.map.control.getGMap());
			} else {
				alert('Google route unsuccesfull!');
			}
		});
	}
	
	$scope.logout = function(){
		localStorage.clear();
		localStorage["user"] = null;
	}
	
	$scope.load();
	
	//Events state
	$rootScope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams, options){ 
		if(toState.name === "app.routes"){
			$scope.getRoutes();
		}
	})
	
	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		$scope.user = JSON.parse(localStorage["user"]);
		if( $scope.user.perfil === "user" ){
			$scope.enableDelete = false;
		}
    });
	
	
	
});