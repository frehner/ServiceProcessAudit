(function(){
  var app = angular.module('processAudit', []);

  app.controller('StepController', function($scope){
    $scope.allSteps = ['temp', 'temp1'];
    $scope.item = {};
  });
})();
