angular.module('appLoginCtrl', [])
/**
 * @ngdoc controller
 * @name appLoginCtrl:LoginCtrl
 * @description
 * Controller que contiene funciones para validar y registrar usuarios en el sistema
 */
.controller('LoginCtrl', function($scope, $ionicModal, $ionicLoading, 
$ionicPopup, $state, $timeout, $http, LoginService) {
	console.log("Controller login ready ...");
	$scope.loginData = {};
	$scope.isLogin = true;
	sessionStorage.removeItem("user");
	
	
 /**
  * @ngdoc method
  * @name showLogin
  * @methodOf appLoginCtrl:LoginCtrl
  * @description
  * Muestra el form para ingresar los datos de autenticación
  */
	$scope.showLogin = function(){
		$scope.isLogin = true; 
	}
/**
  * @ngdoc method
  * @name showRegister
  * @methodOf appLoginCtrl:LoginCtrl
  * @description
  * Muestra el form para ingresar los datos de registro de nuevo usuario
  */	
	$scope.showRegister = function(){
		$scope.isLogin = false; 
	}
	 
	$scope.doAction = function(){
		if($scope.isLogin){
			$scope.login();
		}else{
			$scope.register();
		}
	}
	
	/**
  * @ngdoc method
  * @name login
  * @methodOf appLoginCtrl:LoginCtrl
  * @description
  * Verifica la existencia de un usuario en base a su email y password
  */
	$scope.login = function(){
		$ionicLoading.show({
			template: 'Validando usuario...'
		});
		LoginService.login($scope.loginData).then(function(result){
			console.log("Result Login: ", JSON.stringify(result));
			$ionicLoading.hide();
			localStorage["user"] = JSON.stringify(result.data.user);
			$scope.loginData = {};
			$state.go('app.home');
		}).catch(function(err){
			console.log("Error: ", err);
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Mensaje',
				template: 'El email y/o password son incorrectos.'
			});
		});
	}
	
	/**
  * @ngdoc method
  * @name register
  * @methodOf appLoginCtrl:LoginCtrl
  * @description
  * Registra un nuevo usuario en el sistema
  */
	$scope.register = function(){
		$ionicLoading.show({
			template: 'Registrando usuario...'
		});
		$scope.loginData.perfil = "user";
		LoginService.register($scope.loginData).then(function(result){
			console.log("Result register: ", result);
			localStorage["user"] = JSON.stringify(result.data.user);
			$ionicLoading.hide();
			$state.go('app.home');
		}).catch(function(err){
			console.error("Error: ", err);
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Mensaje',
				template: 'Error al registrar usuario. Intente mas tarde ...'
			});
		});
	}
	
});