/*global $:false */
/*global angular:false */
/*global L:false */

'use strict';

//create all dne modules
angular.module('dne', [
    'dne.services',
    'dne.controllers',
    'dne.directives',
]);

angular.module('dne.controllers', []);
angular.module('dne.services', []);
angular.module('dne.directives', []);

angular.module('dne.controllers').controller('DNEController',
    ['$scope', '$http', '$location', '$sce',
    function($scope, $http, $location, $sce){
        console.log('init');
        $scope.center = {
            lat: 47.2383,
            lng:-1.5603,
            zoom: 11
        };
        $scope.type = '';
        $scope.type_local = [];
        $scope.echeance_reponse_c = '';
        $scope.description = '';

        $scope.dossier = {
            name: 'Project title',
            date: 'JJ/MM/AA',
            type: 'Type d\'occupation',
            type_local : 'Type de local',
            echeance_reponse_c: new Date(),
            contact: {
                p1_name: 'Nom',
                last_name: 'Prénom'
            },
            account:{
                name: 'Nom d\' entreprise'
            }
        };
        $scope.pagen = 10;
        $scope.pages = new Array($scope.pagen - 4);
        for (var i = 0; i < $scope.pages.length; i++) {
            $scope.pages[i] = i;
        }
        $scope.today = new Date();
        $scope.assignedUser = {
            firstName : 'Bérénice',
            lastName : 'OUZILLEAU',
            fct: 'Chef de Mission Entreprises',
            phone: '02 40 35 26 25',
            email: 'bouzilleau@nantes-developpement.com'
        };
        $scope.dossierID = $location.url().split('/')[1];
        $scope.mapURL = $sce.trustAsResourceUrl("http://carteeco.nantes-developpement.com:8080/embed/#" + $scope.dossierID);
        $http.get('/view/dne/'+ $scope.dossierID).then(function(data){
            $scope.dossier = data.data;
            $scope.offres = data.data.offreimmo;
        });
        $scope.getDate = function(dateStr){
            return new Date(dateStr);
        };
        $scope.getSugarCRMValueList = function(valueStr){
            if (valueStr === undefined){
                return [];
            }
            var results = [];
            var values = valueStr.split('^');
            for (var i = 0; i < values.length; i++) {
                if (values[i] !== ''){
                    results.push(values[i]);
                }
            }
            return results;
        };

    }]
);
