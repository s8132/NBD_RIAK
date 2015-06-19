'use strict';

angular.module('nbdNeo4j', [
    /* Angular */
    'ngRoute',
    'ngAnimate',
    /* App */
    'nbdNeo4j.controllers',
    'nbdNeo4j.directives',
    'nbdNeo4j.filters',
    'nbdNeo4j.services',
    /* Angular UI */
    'ui.bootstrap',
    'ui.router',
    /* Other */
    'toggle-switch',
    'FBAngular',
    'drahak.hotkeys',
    'xeditable',
    'cgBusy',
    'toaster',
    'LocalStorageModule',
    'base64',
    'hljs',
    'ngTable',
    'ui.tree'
]).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise("/");

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'MainCtrl',
        resolve:{
            settingsResource: 'Settings',
            sets: function(settingsResource){
                return settingsResource.get().$promise;
            }
        }
    });

    $stateProvider.state('shop', {
        url: '/shop',
        templateUrl: 'views/shop.html',
        controller: 'ShopCtrl',
        resolve:{
            shopResources: 'Shop',
            products: function(shopResources){
                return shopResources.getProducts();
            }
        }
    });

    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'views/cart.html',
        controller: 'CartCtrl'
    });

    $stateProvider.state('linkWalking', {
        url: '/link/walking',
        templateUrl: 'views/link_walking.html',
        controller: 'LinkWalkingCtrl'
    });

    $stateProvider.state('bucketKey', {
        url: '/bucket/key',
        templateUrl: 'views/bucket_key.html',
        controller: 'BucketKeyCtrl'
    });
    /* Error page */
    $stateProvider.state('error', {url: '/error', templateUrl: 'views/error.html', controller: 'ErrorCtrl'});

}]).run(['editableOptions', '$rootScope', '$state', '$location', function (editableOptions, $rootScope, $state, $location) {
    editableOptions.theme = 'bs3';

}]);