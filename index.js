(function(){
  var app = angular.module('processAudit', []);

  app.controller('StepController', function($scope){
    $scope.finalJSON = {};
    $scope.finalJSON.metadata = {};
    $scope.finalJSON.domains = [];
    $scope.finalJSON.steps = [];

    $scope.step = {};
    $scope.domain1 = {};
    $scope.domain2 = {};

    //adds a step then cleans the form
    $scope.addStep = function(){
      $scope.finalJSON.steps.push($scope.step);
      $scope.step = {};
      $scope.addStepForm.$setPristine();
    };

    $scope.updateJSON = function(){
      $scope.finalJSON.domains = [$scope.domain1, $scope.domain2];
      $scope.finalJson = angular.toJson($scope.finalJSON);
    };

    //looks for additions to the steps array
    $scope.$watchCollection('finalJSON.steps', $scope.updateJSON);

  });

  app.filter('firstUpperAndUlToSpace', function(){
    return function(text){
      if(text && text.length > 0){
        var newText = text.replace(/_/g, " ");
        return newText.charAt(0).toUpperCase()+newText.substr(1);
      } else {
        return "";
      }
    };
  });
})();
