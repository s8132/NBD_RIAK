'use strict';
var appService = angular.module('nbdNeo4j.services', ['ngResource']);

appService.factory('Settings', ['$resource', function($resource){
    return $resource('/settings', null, {
        'update': {method: 'PUT'}
    });
}]);

appService.factory('RiakDB', ['$resource', function($resource){
    return $resource('/riak/api/:action', null, {
        'ping': {method: 'GET', params:{action: 'ping'}},
        'getCart': {method: 'GET', url: '/riak/api/buckets/cart/keys/:key', isArray: true},
        'putCart': {method: 'PUT', url: '/riak/api/buckets/cart/keys/:key'},
        'createTrack1': {method: 'PUT', url: '/riak/api/buckets/track/keys/track1', headers:{
            "Link": "</buckets/track/keys/track2>; riaktag=\"next\", </buckets/artist/keys/artist1>; riaktag=\"performer\"",
            "Content-Type": "application/json"
        }},
        'createTrack2': {method: 'PUT', url: '/riak/api/buckets/track/keys/track2', headers:{
            "Link": "</buckets/track/keys/track3>; riaktag=\"next\", </buckets/artist/keys/artist2>; riaktag=\"performer\"",
            "Content-Type": "application/json"
        }},
        'createTrack3': {method: 'PUT', url: '/riak/api/buckets/track/keys/track3', headers:{
            "Link": "</buckets/artist/keys/artist3>; riaktag=\"performer\"",
            "Content-Type": "application/json"
        }},
        'createArtist1': {method: 'PUT', url: '/riak/api/buckets/artist/keys/artist1', headers:{"Content-Type": "application/json"}},
        'createArtist2': {method: 'PUT', url: '/riak/api/buckets/artist/keys/artist2', headers:{"Content-Type": "application/json"}},
        'createArtist3': {method: 'PUT', url: '/riak/api/buckets/artist/keys/artist3', headers:{"Content-Type": "application/json"}},
        'getOneLink1': {method: 'GET', url: '/riak/api/buckets/track/keys/track1/_,_,1'},
        'getOneLink2': {method: 'GET', url: '/riak/api/buckets/track/keys/track1/_,next,1'},
        'getOneLink3': {method: 'GET', url: '/riak/api/buckets/track/keys/track1/artist,_,1'},
        'getTwoLink1': {method: 'GET', url: '/riak/api/buckets/track/keys/track1/_,_,_/_,_,_'},
        'getTwoLink2': {method: 'GET', url: '/riak/api/buckets/track/keys/track1/_,_,_/_,next,_'},
        'getTwoLink3': {method: 'GET', url: '/riak/api/buckets/track/keys/track1/_,_,_/artist,_,_'}
    });
}]);

appService.factory('Shop', [function(){
    var products = [
        {id: 1, name: 'MSI GP70 2PE-485XPL', image: 'http://ocdn.eu/images/skapiec/NjU7MDA_/cd2f11ef51e63386e35e668c31165beb.jpg'},
        {id: 2, name: 'Asus X553MA-SX455B', image: 'http://ocdn.eu/images/skapiec/MmI7MDA_/51e8dbbc1e75c11024dd5ce2f211238e.jpg'},
        {id: 3, name: 'Asus X751LK-T4007H', image: 'http://ocdn.eu/images/skapiec/YmM7MDA_/2a7ee53d82724db3a5982b090b04282f.jpg'},
        {id: 4, name: 'Acer Aspire VN3-791G', image: 'http://ocdn.eu/images/skapiec/NTE7MDA_/609ec404cb305d878ca82a3905ff408f.jpg'},
        {id: 5, name: 'Lenovo IdeaPad Y50-70', image: 'http://ocdn.eu/images/skapiec/NTQ7MDA_/be67f377dd99172031cac03e3b736898.jpg'},
        {id: 6, name: 'Dell Latitude E5440', image: 'http://ocdn.eu/images/skapiec/Y2E7MDA_/2ca699a3c386b4947c12eee520458c8a.jpg'},
        {id: 7, name: 'Dell Inspiron 14 (3451)', image: 'http://ocdn.eu/images/skapiec/MTI7MDA_/1fd0a3c9776648d0dcebc098845a0189.jpg'}
    ];
    return {
        getProducts: function(){
            return products;
        }
    };
}]);

appService.factory('LinkWalkingRequest', [function(){
    var requests = [
        {
            id: 1, label: "Track 1", url: '/buckets/track/keys/track1', method: 'PUT', isOpen: false,
            headers: {
                "Link": "</buckets/track/keys/track2>; riaktag=\"next\", </buckets/artist/keys/artist1>; riaktag=\"performer\"",
                "Content-Type": "application/json"
            },
            body: {name: "Track 1", year: 1923, length: 180321}
        },
        {
            id: 2, label: "Track 2", url: '/buckets/track/keys/track2', method: 'PUT', isOpen: false,
            headers: {
                "Link":"</buckets/track/keys/track3>; riaktag=\"next\", </buckets/artist/keys/artist2>; riaktag=\"performer\"",
                "Content-Type": "application/json"
            },
            body: {name: "Track 2", year: 1947, length: 180141}
        },
        {
            id: 3, label: "Track 3", url: '/buckets/track/keys/track3', method: 'PUT', isOpen: false,
            headers: {
                "Link": "</buckets/artist/keys/artist3>; riaktag=\"performer\"",
                "Content-Type": "application/json"
            },
            body: {name: "Track 3", year: 1996, length: 180321}
        },
        {
            id: 4, label: "Artist 1", url: '/buckets/artist/keys/artist1', method: 'PUT', isOpen: false,
            headers: {"Content-Type": "application/json"},
            body: {name: "Artist 1"}
        },
        {
            id: 5, label: "Artist 2", url: '/buckets/artist/keys/artist2', method: 'PUT', isOpen: false,
            headers: {"Content-Type": "application/json"},
            body: {name: "Artist 2"}
        },
        {
            id: 6, label: "Artist 3", url: '/buckets/artist/keys/artist3', method: 'PUT', isOpen: false,
            headers: {"Content-Type": "application/json"},
            body: {name: "Artist 3"}
        }
    ];
    var oneLinkRequests = [
        {id: 1, isOpen: false, label: "Pobieranie wszystkich linków dla \"Track 1\"", method: "GET", url: "/buckets/track/keys/track1/_,_,1", result:{ text: null, json: null}},
        {id: 2, isOpen: false, label: "Pobieranie kolejnego utworu dla \"Track 1\" (po linku)", method: "GET", url: "/buckets/track/keys/track1/_,next,1", result:{ text: null, json: null}},
        {id: 3, isOpen: false, label: "Pobieranie artysty dla \"Track 1\" (po kubełku)", method: "GET", url: "/buckets/track/keys/track1/artist,_,1", result:{ text: null, json: null}}
    ];

    var twoLinkRequest = [
        {id: 1, isOpen: false, label: "Pobieranie wszystkich linków dla \"Track 1\"", method: "GET", url: "/buckets/track/keys/track1/_,_,_/_,_,_", result:{ text: null, json: null}},
        {id: 2, isOpen: false, label: "Pobieranie kolejnego utworu dla \"Track 1\" (po linku)", method: "GET", url: "/buckets/track/keys/track1/_,_,_/_,next,_", result:{ text: null, json: null}},
        {id: 3, isOpen: false, label: "Pobieranie artysty dla \"Track 1\" (po kubełku)", method: "GET", url: "/buckets/track/keys/track1/_,_,_/artist,_,_", result:{ text: null, json: null}}
    ];
    return {
        getRequests: function(){
            return requests;
        },
        getOneLinkRequest: function(){
            return oneLinkRequests;
        },
        getTwoLinkRequest: function(){
            return twoLinkRequest;
        }
    }
}]);