angular.module('appLoginService',[])
/**
 * @ngdoc service
 * @name appLoginService:LoginService
 * @description
 * Esta clase se conecta a los servicios expuestos en el servidor para relizar operaciones de autenticación y registro de usuario.
 */
.service('LoginService',
function($http) {
	
/**
  * @ngdoc method
  * @name login
  * @methodOf appLoginService:LoginService
  * @description
  * Envia lós datos al servidor de un usuario para autentificar y autorizar el acceso 
  * 
  * @param {object} User El usuario a autenticar 
  * @returns {object} Promesa con la respuesta del servidor.
 */
	this.login = function( user ){
		return $http.post(Constant.URL_API + "login", user);
	}
/**
  * @ngdoc method
  * @name register
  * @methodOf appLoginService:LoginService
  * @description
  * Envia lós datos al servidor de un usuario para registrarlo en el sistema 
  * 
  * @param {object} User El usuario a registrar
  * @returns {object} Promesa con la respuesta del servidor.
 */
	this.register = function( user ){
		return $http.post(Constant.URL_API + "User/create", user);
	}
});