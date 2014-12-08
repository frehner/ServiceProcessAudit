(function(){
  var staticProblemArray = [{'name':'inconvenient', 'selected':false, 'description':''}, {'name':'confusing', 'selected':false, 'description':''}, {'name':'difficult', 'selected':false, 'description':''}, {'name':'likely_to_fail', 'selected':false, 'description':''}];

  var app = angular.module('processAudit', []);

  app.controller('StepController', function($scope){
    $scope.finalJSON = {};
    $scope.finalJSON.metadata = {};
    $scope.finalJSON.domains = [];
    $scope.finalJSON.steps = [];

    $scope.step = {};
    $scope.domain1 = {};
    $scope.domain2 = {};

    $scope.isAnEdit = false;
    $scope.editedStepLocation = 0;

    //adds a step then cleans the form
    $scope.addStep = function(){
      $scope.step.problems = [];
      angular.forEach($scope.tempProblems, function(tempProb){
        if (tempProb.selected) {
          $scope.step.problems.push({'type':tempProb.name, 'description':tempProb.description});
        }
      });

      if ($scope.isAnEdit) {
        $scope.finalJSON.steps[$scope.editedStepLocation] = $scope.step;
      } else {
        $scope.finalJSON.steps.push($scope.step);
      }

      $scope.clearForm();
    };

    $scope.updateJSON = function(){
      $scope.finalJSON.domains = [$scope.domain1, $scope.domain2];
      $scope.finalJson = angular.toJson($scope.finalJSON);
    };

    $scope.clearForm = function(){
      $scope.isAnEdit = false;
      $scope.step = {};
      $scope.addStepForm.$setPristine();
      angular.forEach($scope.tempProblems, function(tempProb){
        tempProb.description = "";
        tempProb.selected = false;
      });

    };

    $scope.editStep = function(editedStep) {
      $scope.clearForm();
      $scope.isAnEdit = true;

      var lengthOfSteps = $scope.finalJSON.steps.length;
      for (var i = 0; i < lengthOfSteps; i++) {
        if($scope.finalJSON.steps[i] === editedStep){
          $scope.editedStepLocation = i;
          break;
        }
      }

      $scope.step.title = editedStep.title;
      $scope.step.controlRegion = editedStep.controlRegion;
      $scope.step.type = editedStep.type;
      $scope.step.value_specific = editedStep.value_specific;
      $scope.step.value_generic = editedStep.value_generic;
      $scope.step.emphasized = editedStep.emphasized;

      if(editedStep.problems){
        var problemsCount = editedStep.problems.length;
        for(var j = 0; j < problemsCount; j++){
          switch (editedStep.problems[j].type) {
          case "inconvenient":
            $scope.tempProblems.inconvenient.selected = true;
            $scope.tempProblems.inconvenient.description = editedStep.problems[j].description;
            break;
          case "confusing":
            $scope.tempProblems.confusing.selected = true;
            $scope.tempProblems.confusing.description = editedStep.problems[j].description;
            break;
          case "difficult":
            $scope.tempProblems.difficult.selected = true;
            $scope.tempProblems.difficult.description = editedStep.problems[j].description;
            break;
          case "likely_to_fail":
            $scope.tempProblems.likely_to_fail.selected = true;
            $scope.tempProblems.likely_to_fail.description = editedStep.problems[j].description;
            break;
          default:
            break;
          }
        }
      }

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

  app.directive('selectOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click touchstart', function () {
          this.select();
        });
      }
    };
  });
})();
