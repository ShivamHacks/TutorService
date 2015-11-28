var app = angular.module('app', ['ngRoute', 'ngAnimate']);
var socket = io();

socket.on('initial-connection', function (data) { console.log(data);});
socket.emit('recieved-connection', { message: 'SUCCESS! Connection Established.' });

app.controller('UserController', function ($scope, $http, $location) {
	$scope.pageClass = 'login';
	$scope.newUser = {};
	$scope.addUser = function() {
		$http({
			method: 'POST',
			url: '/adduser',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: $.param({
				uname: $scope.newUser.uname,
				email: $scope.newUser.email,
				pswrd: $scope.newUser.pswrd,
			})
		}).then(function (response) {
			console.log(response);
			localStorage.setItem('loggedIn', true);
			localStorage.setItem('uname', response.data.uname);
			localStorage.setItem('pswrd', response.data.pswrd);
			$location.path('/');
		}, function (response) {

		});
	};
});

app.controller('MainController', function ($scope, $location) {
	$scope.pageClass = 'index';
	$scope.logout = function() {
		localStorage.removeItem('loggedIn');
		localStorage.removeItem('uname');
		localStorage.removeItem('pswrd');
		$location.path('/login');
	};
	if (!localStorage.getItem('loggedIn')) {
		$location.path('/login');
	} else {
		$location.path('/');
	}
});

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		controller: 'MainController',
		templateUrl: '/partials/index.html'
	}).when('/login', {
		controller: 'UserController',
		templateUrl: '/partials/login.html'
	}).otherwise({ redirectTo: '/' });
});