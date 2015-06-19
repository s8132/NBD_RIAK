'use strict';
var appControllers = angular.module('nbdNeo4j.controllers', []);

appControllers.controller("UserCtrl", ['$scope', 'toaster', 'localStorageService', function($scope, toaster, localStorageService) {
    $scope.cart = {
        username: null
    };
    load();

    $scope.saveUserName = function(){
        localStorageService.set("CART_USERNAME", $scope.cart.username);
        load();
    };

    function load(){
        $scope.cart.username = localStorageService.get("CART_USERNAME");
    }
}]);

appControllers.controller("MainCtrl", ['$scope', 'sets', 'toaster', 'RiakDB', 'Settings', function($scope, sets, toaster, RiakDB, Settings) {
    $scope.settings = sets;

    $scope.saveSettings = function(){
        $scope.settingsSavePromise = Settings.update($scope.settings).$promise.then(function(data){
            toaster.pop('success', 'Zapis ustawień', 'Ustawienia zapisane pomyślnie');
            $scope.settings = data;
        }, function(error){
            toaster.pop('error', 'Zapis ustawień', 'Błąd podczas zapisywania ustawień');
        });
    };

    $scope.testConnection = function(){
        $scope.settingsSavePromise = RiakDB.ping().$promise.then(function(data){
            toaster.pop('success', 'Testowanie połączenia', 'Udało się połączyć z bazą');
        }, function(error){
            toaster.pop('error', 'Testowanie połączenia', 'Błąd połączenia z bazą');
        });
    };

    $scope.test = function(){
        RiakDB.test().$promise.then(function(data){
            console.log(data);
            var keys = Object.keys(data);
            var str = "";
            keys.forEach(function(key){
               str += data[key];
            });
            console.log(str.match(/({.*})/g));
        }, function(){});
    }
}]);

appControllers.controller("ShopCtrl", ['$scope', 'products', 'toaster', 'localStorageService', 'RiakDB', function($scope, products, toaster, localStorageService, RiakDB) {
    $scope.products = products;

    $scope.addProductToCart = function(product){
        var username = localStorageService.get("CART_USERNAME");
        if(username===null){
            toaster.pop("warning", "Dodawanie produktu do koszyka", "Ustaw imię użytkownika");
        }else{
            $scope.loadPromise = RiakDB.getCart({key: username}).$promise.then(function(data){
                console.log(data);
                var index = -1;
                data.forEach(function(pro, ind){
                    if(pro.product.id===product.id){
                        index = ind;
                    }
                });
                if(index>-1){
                    data[index].count += 1;
                }else{
                    data.push({count: 1, product: product});
                }
                $scope.loadPromise = RiakDB.putCart({key: username}, data).$promise.then(function(da){
                    toaster.pop("success", "Dodawanie produktu do koszyka", product.name + " dodano do koszyka");
                }, function(err){
                    toaster.pop("error", "Dodawanie produktu do koszyka", "Błąd dodawania produktu do koszyka");
                });
            }, function(error){
                if(error.status===404){
                    var json = [
                        {count: 1, product: product}
                    ];
                    $scope.loadPromise = RiakDB.putCart({key: username}, json).$promise.then(function(da){
                        toaster.pop("success", "Dodawanie produktu do koszyka", product.name + " dodano do koszyka");
                    }, function(err){
                        toaster.pop("error", "Dodawanie produktu do koszyka", "Błąd dodawania produktu do koszyka");
                    });
                }else{
                    toaster.pop("error", "Dodawanie produktu do koszyka", "Błąd dodawania produktu do koszyka");
                }
            });
        }
    };
}]);

appControllers.controller("CartCtrl", ['$scope', 'toaster', 'localStorageService', 'RiakDB', 'ngTableParams', '$filter', function($scope, toaster, localStorageService, RiakDB, ngTableParams, $filter) {
    var username = localStorageService.get("CART_USERNAME");
    $scope.cartItems = null;
    $scope.tableParams = null;
    $scope.loadPromise = RiakDB.getCart({key: username}).$promise.then(function(data){
        $scope.cartItems = data;
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {
                name: 'asc'
            }
        }, {
            total: $scope.cartItems.length,
            getData: function($defer, params) {
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.cartItems, params.orderBy()) :
                    $scope.cartItems;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }, function(error){

    });

    $scope.removeItem = function(index){
        $scope.cartItems.splice(index, 1);
        $scope.tableParams.reload();
    };

    $scope.saveCart = function(){
        $scope.loadPromise = RiakDB.putCart({key: username}, $scope.cartItems).$promise.then(function(da){
            toaster.pop("success", "Zapis koszyka", "Koszyk zapisano pomyślnie");
        }, function(err){
            toaster.pop("error", "Zapis koszyka", "Błąd zapisu koszyka");
        });
    };
}]);

appControllers.controller("LinkWalkingCtrl", ['$scope', 'LinkWalkingRequest', 'RiakDB', 'toaster', function($scope, LinkWalkingRequest, RiakDB, toaster) {
    $scope.creates = LinkWalkingRequest.getRequests();
    $scope.oneLinkRequest = LinkWalkingRequest.getOneLinkRequest();
    $scope.twoLinkRequest = LinkWalkingRequest.getTwoLinkRequest();
    $scope.execute = function(id, body){
        switch(id){
            case 1:
                $scope.promise = RiakDB.createTrack1(body).$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 2:
                $scope.promise = RiakDB.createTrack2(body).$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 3:
                $scope.promise = RiakDB.createTrack3(body).$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 4:
                $scope.promise = RiakDB.createArtist1(body).$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 5:
                $scope.promise = RiakDB.createArtist2(body).$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 6:
                $scope.promise = RiakDB.createArtist3(body).$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            default:
                alert("Uppsss! Jakiś błąd");
                break;
        }
    };

    $scope.oneLinkExecute = function(req){
        switch(req.id){
            case 1:
                $scope.oneLinePromise = RiakDB.getOneLink1().$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                    var keys = Object.keys(data);
                    var str = "";
                    keys.forEach(function(key){
                        str += data[key];
                    });
                    req.result.text = str;
                    req.result.json = str.match(/({.*})/g);
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 2:
                $scope.oneLinePromise = RiakDB.getOneLink2().$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                    var keys = Object.keys(data);
                    var str = "";
                    keys.forEach(function(key){
                        str += data[key];
                    });
                    req.result.text = str;
                    req.result.json = str.match(/({.*})/g);
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 3:
                $scope.oneLinePromise = RiakDB.getOneLink3().$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                    var keys = Object.keys(data);
                    var str = "";
                    keys.forEach(function(key){
                        str += data[key];
                    });
                    req.result.text = str;
                    req.result.json = str.match(/({.*})/g);
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            default:
                alert("Uppsss! Jakiś błąd");
                break;
        }
    };

    $scope.twoLinkExecute = function(req){
        switch(req.id){
            case 1:
                $scope.oneLinePromise = RiakDB.getTwoLink1().$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                    var keys = Object.keys(data);
                    var str = "";
                    keys.forEach(function(key){
                        str += data[key];
                    });
                    req.result.text = str;
                    req.result.json = str.match(/({.*})/g);
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 2:
                $scope.oneLinePromise = RiakDB.getTwoLink2().$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                    var keys = Object.keys(data);
                    var str = "";
                    keys.forEach(function(key){
                        str += data[key];
                    });
                    req.result.text = str;
                    req.result.json = str.match(/({.*})/g);
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            case 3:
                $scope.oneLinePromise = RiakDB.getTwoLink3().$promise.then(function(data){
                    toaster.pop('success', 'Wykonywania zapytania', 'Zapytanie wykonane');
                    var keys = Object.keys(data);
                    var str = "";
                    keys.forEach(function(key){
                        str += data[key];
                    });
                    req.result.text = str;
                    req.result.json = str.match(/({.*})/g);
                }, function(error){
                    toaster.pop('error', 'Wykonywania zapytania', 'Błąd wykonania zapytania');
                });
                break;
            default:
                alert("Uppsss! Jakiś błąd");
                break;
        }
    };
}]);

appControllers.controller("BucketKeyCtrl", ['$scope', function($scope) {

}]);

appControllers.controller("ErrorCtrl", ['$scope', function($scope) {

}]);
