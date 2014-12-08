(function(){
  var staticProblemArray = [{'name':'inconvenient', 'selected':false, 'description':''}, {'name':'confusing', 'selected':false, 'description':''}, {'name':'difficult', 'selected':false, 'description':''}, {'name':'likely_to_fail', 'selected':false, 'description':''}];

  var app = angular.module('processAudit', []);

  app.controller('StepController', function($scope){
    $scope.finalJSON = {};
    $scope.finalJSON.metadata = {};
    $scope.finalJSON.domains = [];
    $scope.finalJSON.steps = [];

    $scope.step = {};
    $scope.Customer_domain = {};
    $scope.Provider_domain = {};

    $scope.tempPreviousSteps = [];

    $scope.isAnEdit = false;
    $scope.editedStepLocation = 0;

    var stepId = 0;

    //adds a step then cleans the form
    $scope.addStep = function(){
      $scope.step.problems = [];
      $scope.step.predecessors = [];
      $scope.step.domain = {};

      if ($scope.tempDomain) {
        switch ($scope.tempDomain) {
        case 'ProvInd':
          $scope.step.domain.id = 'Provider_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "independent";
          $scope.step.domain.region.with_domain = "";
          break;
        case 'ProvSur':
          $scope.step.domain.id = 'Provider_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "surrogate";
          $scope.step.domain.region.with_domain = "Customer_domain";
          break;
        case 'ProvDir':
          $scope.step.domain.id = 'Provider_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "direct_leading";
          $scope.step.domain.region.with_domain = "Customer_domain";
          break;
        case 'BothDir':
          $scope.step.domain.id = 'Provider_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "direct_shared";
          $scope.step.domain.region.with_domain = "Customer_domain";
          break;
        case 'CustDir':
          $scope.step.domain.id = 'Customer_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "direct_leading";
          $scope.step.domain.region.with_domain = "Provider_domain";
          break;
        case 'CustSur':
          $scope.step.domain.id = 'Customer_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "surrogate";
          $scope.step.domain.region.with_domain = "Provider_domain";
          break;
        case 'CustInd':
          $scope.step.domain.id = 'Customer_domain';
          $scope.step.domain.region = {};
          $scope.step.domain.region.type = "independent";
          $scope.step.domain.region.with_domain = "";
          break;
        default:

        }
      }

      angular.forEach($scope.tempProblems, function(tempProb){
        if (tempProb.selected) {
          $scope.step.problems.push({'type':tempProb.name, 'description':tempProb.description});
        }
      });

      angular.forEach($scope.tempPreviousSteps, function(prevStep){
        $scope.step.predecessors.push({'id':prevStep, 'type':'normal_relationship'});
      });

      if ($scope.isAnEdit) {
        $scope.finalJSON.steps[$scope.editedStepLocation] = $scope.step;
      } else {
        $scope.step.id = stepId + "";
        $scope.finalJSON.steps.push($scope.step);
      }
      stepId++;
      $scope.clearForm();
    };

    $scope.updateJSON = function(){
      $scope.finalJSON.domains = [$scope.Customer_domain, $scope.Provider_domain];
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
      $scope.tempDomain = '';

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

      if(editedStep.domain){
        if (editedStep.domain.id == 'Provider_domain') {
          switch (editedStep.domain.region.type) {
          case 'independent':
            $scope.tempDomain = 'ProvInd';
            break;
          case 'surrogate':
            $scope.tempDomain = 'ProvSur';
            break;
          case 'direct_leading':
            $scope.tempDomain = 'ProvDir';
            break;
          case 'direct_shared':
            $scope.tempDomain = 'BothDir';
            break;
          default:
          }
        } else {
          switch (editedStep.domain.region.type) {
            case 'independent':
              $scope.tempDomain = 'CustInd';
              break;
            case 'surrogate':
              $scope.tempDomain = 'CustSur';
              break;
            case 'direct_leading':
              $scope.tempDomain = 'CustDir';
              break;
            default:
            }
        }
      }
    };

    $scope.removeStep = function(removedStep) {
      var lengthOfSteps = $scope.finalJSON.steps.length;
      for (var i = 0; i < lengthOfSteps; i++) {
        if($scope.finalJSON.steps[i] === removedStep){
          $scope.finalJSON.steps.splice(i,1);
          break;
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
  
    app.directive('integer', function(){
		return {
			require: 'ngModel',
			link: function(scope, ele, attr, ctrl){
				ctrl.$parsers.unshift(function(viewValue){
					return parseInt(viewValue, 10);
				});
			}
		};
	});

  /**
  * Checklist-model
  * AngularJS directive for list of checkboxes
  */

  app.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
    // contains
    function contains(arr, item) {
      if (angular.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          if (angular.equals(arr[i], item)) {
            return true;
          }
        }
      }
      return false;
    }

    // add
    function add(arr, item) {
      arr = angular.isArray(arr) ? arr : [];
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          return arr;
        }
      }
      arr.push(item);
      return arr;
    }

    // remove
    function remove(arr, item) {
      if (angular.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          if (angular.equals(arr[i], item)) {
            arr.splice(i, 1);
            break;
          }
        }
      }
      return arr;
    }

    // http://stackoverflow.com/a/19228302/1458162
    function postLinkFn(scope, elem, attrs) {
      // compile with `ng-model` pointing to `checked`
      $compile(elem)(scope);

      // getter / setter for original model
      var getter = $parse(attrs.checklistModel);
      var setter = getter.assign;

      // value added to list
      var value = $parse(attrs.checklistValue)(scope.$parent);

      // watch UI checked change
      scope.$watch('checked', function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        var current = getter(scope.$parent);
        if (newValue === true) {
          setter(scope.$parent, add(current, value));
        } else {
          setter(scope.$parent, remove(current, value));
        }
      });

      // watch original model change
      scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
        scope.checked = contains(newArr, value);
      }, true);
    }

    return {
      restrict: 'A',
      priority: 1000,
      terminal: true,
      scope: true,
      compile: function(tElement, tAttrs) {
        if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
          throw 'checklist-model should be applied to `input[type="checkbox"]`.';
        }

        if (!tAttrs.checklistValue) {
          throw 'You should provide `checklist-value`.';
        }

        // exclude recursion
        tElement.removeAttr('checklist-model');

        // local scope var storing individual checkbox model
        tElement.attr('ng-model', 'checked');

        return postLinkFn;
      }
    };
  }]);
})();
