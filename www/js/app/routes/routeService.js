angular.module('appRouteService',[])
/**
 * @ngdoc service
 * @name appRouteService:RouteService
 * @description
 * Esta clase se conecta a los servicios expuestos en el servidor para relizar operaciones CRUD sobre las rutas.
 */
.service('RouteService',
function($http) {
	
/**
  * @ngdoc method
  * @name register
  * @methodOf appRouteService:RouteService
  * @description
  * Envia lós datos al servidor para regitrar una nueva ruta
  * 
  * @param {object} Ruta La ruta a registrar con el siguiente formato json: {departure:{longitude:number, lalitude:number, address:'string'},
    destination:{longitude:number,latitude:number,address:string},
    user:id
  * @returns {object} Promesa con la respuesta del servidor.
 */
	this.register = function( route ){
		return $http.post(Constant.URL_API + "route/create", route);
	}
/**
  * @ngdoc method
  * @name delete
  * @methodOf appRouteService:RouteService
  * @description
  * Elimina una ruta del sistema
  * 
  * @param {object} Ruta El id de la ruta a eliminar en formato json: {id:number}
  * @returns {object} Promesa con la respuesta del servidor.
 */
	this.delete = function( route ){
		return $http.delete(Constant.URL_API + "route/destroy/" + route.id);
	}
/**
  * @ngdoc method
  * @name update
  * @methodOf appRouteService:RouteService
  * @description
  * Actualiza una ruta del sistema
  * 
  * @param {object} Ruta La ruta a modificar con el siguiente formato json: {departure:{longitude:number, lalitude:number, address:'string'},
    destination:{longitude:number,latitude:number,address:string},
    user:id
  * @returns {object} Promesa con la respuesta del servidor.
 */	
	this.update = function( route ){
		return $http.update(Constant.URL_API + "route/update/" + route.id, route);
	}
/**
  * @ngdoc method
  * @name getAll
  * @methodOf appRouteService:RouteService
  * @description
  * Recupera todas las rutas del sistema
  * 
  * @returns {object} Promesa con la respuesta del servidor.
 */	
	this.getAll = function(){
		return $http.get(Constant.URL_API + "route");
	}
/**
  * @ngdoc method
  * @name getByUser
  * @methodOf appRouteService:RouteService
  * @description
  * Recupera todas las rutas asociadas a un usuario
  * 
  * @param {object} IdUser El id del usuario
  * @returns {object} Promesa con la respuesta del servidor.
 */	
	this.getByUser = function(idUser){
		return $http.get(Constant.URL_API + "route/find?user=" + idUser);
	} 
	
});