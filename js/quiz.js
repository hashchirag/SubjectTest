(function() {

  var app = angular.module('myQuiz', ['ngMaterial']);

  app.controller('QuizController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {


//Loading Maths List Items
    $http.get('cat-math.json').then(function(mathData) {

      $scope.mathList = mathData.data;
      $scope.mathListLength = $scope.mathList.length;
    });

    $scope.selected = [];
    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item.info.cid);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item.info.cid);
    };
    $scope.exists = function(item, list) {
      return list.indexOf(item.info.cid) > -1;
    };

    //Loading Physics List Items
        $http.get('cat-phy.json').then(function(physicsData) {

          $scope.physicsList = physicsData.data;
          $scope.physicsListLength = $scope.physicsList.length;
        });

        $scope.selected = [];
        $scope.toggle = function(item, list) {
          var idx = list.indexOf(item.info.cid);
          if (idx > -1) list.splice(idx, 1);
          else list.push(item.info.cid);
        };
        $scope.exists = function(item, list) {
          return list.indexOf(item.info.cid) > -1;
        };

//Loading Chemistry List Items
$http.get('cat-chem.json').then(function(chemData) {

  $scope.chemList = chemData.data;
  $scope.chemListLength = $scope.chemList.length;
});

$scope.selected = [];
$scope.toggle = function(item, list) {
  var idx = list.indexOf(item.info.cid);
  if (idx > -1) list.splice(idx, 1);
  else list.push(item.info.cid);
};
$scope.exists = function(item, list) {
  return list.indexOf(item.info.cid) > -1;
};


//Question Related stuff
    $scope.score = 0;
    $scope.activeQuestion = -1;
    $scope.activeQuestionAnswered = 0;
    $scope.percentage = 0;

    $http.get('quiz_data.json').then(function(quizData) {

      $scope.myQuestions = quizData.data;
      $scope.totalQuestions = $scope.myQuestions.length;

    });

    $scope.selectAnswer = function(qIndex, aIndex) {

      var questionState = $scope.myQuestions[qIndex].questionState;

      if (questionState != 'answered') {
        $scope.myQuestions[qIndex].selectedAnswer = aIndex;
        var correctAnswer = $scope.myQuestions[qIndex].correct;
        $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

        if (aIndex === correctAnswer) {
          $scope.myQuestions[qIndex].correctness = 'correct';
          $scope.score += 1;
        } else {
          $scope.myQuestions[qIndex].correctness = 'incorrect';
        }
        $scope.myQuestions[qIndex].questionState = 'answered';

      }

      $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(2);

    }

    $scope.isSelected = function(qIndex, aIndex) {
      return ($scope.myQuestions[qIndex].selectedAnswer === aIndex);
    }

    $scope.isCorrect = function(qIndex, aIndex) {
      return ($scope.myQuestions[qIndex].correctAnswer === aIndex);
    }

    $scope.selectContinue = function() {
      return $scope.activeQuestion += 1;
    }

  }]);

})();
