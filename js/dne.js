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
        var baseURL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
        console.log(baseURL);
        $scope.loaded = false;
        $scope.center = {
            lat: 47.2383,
            lng:-1.5603,
            zoom: 11
        };

        $scope.dossier = {
            name: 'Project title',
            date: 'JJ/MM/AA',
            type: 'Type d\'occupation',
            type_local : 'Type de local',
            echeance_reponse_c: new Date(),
            contact: {
                id: '2cb4f040-0bcf-80c4-c072-4c52eb727460',
                first_name: 'Nom',
                last_name: 'Prénom'
            },
            account:{
                name: 'Nom d\' entreprise'
            }
        };
        $scope.offres = [
            {label: 'Offre 1'},
            {label: 'Offre 2'},
            {label: 'Offre 3'},
            {label: 'Offre 4'},
            {label: 'Offre 5'},
            {label: 'Offre 6'}
        ];
        $scope.pagen = 10;
        $scope.pages = new Array($scope.pagen - 4);
        for (var i = 0; i < $scope.pages.length; i++) {
            $scope.pages[i] = i;
        }
        $scope.today = new Date();
        $scope.dossierID = $location.url().split('/')[1];

        var mapURL = baseURL + '/embed/#';
        var pdfURL = baseURL + '/downloads/';
        $scope.mapURL = $sce.trustAsResourceUrl(mapURL + $scope.dossierID);
        $http.get('/view/dne/'+ $scope.dossierID).then(function(data){
            
            $scope.dossier = data.data;
            if (data.data.offreimmo !== null){
                $scope.pdfURL = $sce.trustAsResourceUrl(pdfURL + data.data.offreimmo);
            }
            $scope.loaded = true;
            loadLocatedOffreImmo(data.data.maps);
        });
        $scope.getDate = function(dateStr){
            return new Date(dateStr);
        };
        var loadLocatedOffreImmo = function(maps){
            $scope.offres = [];
            var getOffreIndex = function(offre){
                if (offre.type === 'projects'){
                    return parseInt(offre.source.mapLabel, 10);
                }else if (offre.type === 'drawnFeatures'){
                    return offre.source.properties.indexOffre;
                }
            };
            var offresDiffuses = JSON.parse(maps.drawnFeatures) || [];
            var offresPerennes = maps.projects || [];
            debugger;
            if (offresPerennes.length > 0){
                for (var i = 0; i < offresPerennes.length; i++) {
                    $scope.offres.push({
                        label: offresPerennes[i].nom,
                        source: offresPerennes[i],
                        type: 'projects'
                    });
                }
            }
            if (offresDiffuses.length > 0){
                for (var i = 0; i < offresDiffuses.length; i++) {
                    $scope.offres.push({
                        label: offresDiffuses[i].properties.label || 'offre diffuse',
                        source: offresDiffuses[i],
                        type: 'drawnFeatures'
                    });
                }
            }
            //update order, depend on storage            
            $scope.offres.sort(function(a, b){
                if (getOffreIndex(a) < getOffreIndex(b))
                    return -1;
                if (getOffreIndex(a) > getOffreIndex(b))
                    return 1;
                return 0;
            });
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