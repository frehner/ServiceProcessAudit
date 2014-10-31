(function(){
  var app = angular.module('processAudit', []);

  app.controller('StepController', function($scope){
    $scope.allSteps = [];
    $scope.step = {};

    //adds a step then cleans the form
    $scope.addStep = function(){
      $scope.allSteps.push($scope.step);
      $scope.step = {};
      $scope.addStepForm.$setPristine();
    };

    //looks for additions to the allSteps array
    $scope.$watchCollection('allSteps', function updatedJsonView(){
      $scope.finalJson = JSON.stringify($scope.allSteps);
    });

  });
})();
