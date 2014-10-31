(function(){
  var app = angular.module('processAudit', []);

  app.controller('StepController', function($scope){
    $scope.allSteps = [];
    $scope.step = {};

    $scope.addStep = function(){
      $scope.allSteps.push($scope.step);
      $scope.step = {};
      $scope.addStepForm.$setPristine();
      console.log($scope.allSteps);
    };

  });
})();
