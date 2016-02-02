(function() {

  var app = angular.module('myQuiz', ['ngMaterial']);

  app.controller('QuizController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {

    $scope.selected = [];
    $scope.totalQuestions = 3;

    //Loading Maths List Items
    $http.get('cat-math.json').then(function(mathData) {

      $scope.mathList = mathData.data;
      $scope.mathListLength = $scope.mathList.length;
    });

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

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item.info.cid);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item.info.cid);
    };

    $scope.exists = function(item, list) {
      return list.indexOf(item.info.cid) > -1;
    };


    $scope.finalJSON = {};
    $scope.simpleJSON = [];

    $scope.formatJSONToCorrectForm = function(questionList, i) {

      var first = $scope.selected[i].toString();
      // var second = $scope.selected[1].toString();
      // var third = $scope.selected[2].toString();
      // var fourth = $scope.selected[3].toString();
      // var fifth = $scope.selected[4].toString();
      console.log("first " + first);

      first = [];

      for (var k = 0; k < 3; k++) {
        temp = [];
        optionsArray = [];
        displayingJSONTemp = {};

        optionA = {
          'text': questionList[k].text.opts.optA,
          'id': 0
        };
        optionB = {
          'text': questionList[k].text.opts.optB,
          'id': 1
        };
        optionC = {
          'text': questionList[k].text.opts.optC,
          'id': 2
        };
        optionD = {
          'text': questionList[k].text.opts.optD,
          'id': 3
        };

        var answer;

        if (questionList[k].text.opts.answer == 'A') {
          answer = 0;
        } else if (questionList[k].text.opts.answer == 'B') {
          answer = 1;
        } else if (questionList[k].text.opts.answer == 'C') {
          answer = 2;
        } else if (questionList[k].text.opts.answer == 'D') {
          answer = 3;
        }


        optionsArray.push(optionA);
        optionsArray.push(optionB);
        optionsArray.push(optionC);
        optionsArray.push(optionD);

        tmp = {
          'uuid': questionList[k].uuid,
          'question': questionList[k].text.t,
          'answers': optionsArray,
          'correct': answer
        };

        first.push(tmp);
        console.log("test" + first[k].answers[0].text);


        displayingJSONTemp = {
          'question': questionList[k].text.t,
          'answers': optionsArray,
          'correct': answer
        };
        $scope.simpleJSON.push(displayingJSONTemp);
        console.log("correct answer in global" + questionList[k].text.opts.answer);
        console.log("correct answer in local" + displayingJSONTemp.correct);

      }

      var firstField = $scope.selected[i].toString();
      $scope.finalJSON[firstField] = first;
      // console.log(JSON.stringify($scope.finalJSON));

      // console.log("debug " + JSON.stringify(questionList[0].text.t));
      // console.log("random question" + questionList[0].text.t);
    };

    $scope.loadAndPopulate = function(categoryId, i) {
      $scope.url = "http://staging-now.hashlearn.com/v1/content/practice/tutor/categoryQuestions/?catid=";
      $scope.url = $scope.url + categoryId;
      console.log("url is " + $scope.url);


      $http.get($scope.url).then(function(questionData) {

        $scope.questionList = questionData.data.data;
        $scope.questionListLength = $scope.questionList.length;
        alert("" + $scope.questionList);
        $scope.formatJSONToCorrectForm($scope.questionList, i);

      });

    }

    $scope.startQuiz = function(selLength) {
      // if (selLength <= 0 || selLength < 5)
      //   alert("Please choose only 5 topics.");
      // else {
      $scope.activeQuestion = 0;
      for (var i = 0; i < selLength; i++) {
        console.log($scope.selected[i]);
        $scope.loadAndPopulate($scope.selected[i], i);
        // }
      }
    }




    //Question Related stuff
    $scope.score = 0;
    $scope.activeQuestion = -1;
    $scope.activeQuestionAnswered = 0;
    $scope.percentage = 0;

    // $http.get('quiz_data.json').then(function(quizData) {
    //
    //   $scope.myQuestions = quizData.data;
    //   $scope.totalQuestions = $scope.myQuestions.length;
    //
    // });

    // $scope.selectAnswer = function(qIndex, aIndex) {
    //
    //   var questionState = $scope.myQuestions[qIndex].questionState;
    //
    //   if (questionState != 'answered') {
    //     $scope.myQuestions[qIndex].selectedAnswer = aIndex;
    //     var correctAnswer = $scope.myQuestions[qIndex].correct;
    //     $scope.myQuestions[qIndex].correctAnswer = correctAnswer;
    //
    //     if (aIndex === correctAnswer) {
    //       $scope.myQuestions[qIndex].correctness = 'correct';
    //       $scope.score += 1;
    //     } else {
    //       $scope.myQuestions[qIndex].correctness = 'incorrect';
    //     }
    //     $scope.myQuestions[qIndex].questionState = 'answered';
    //
    //   }
    //
    //   $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(2);
    //
    // }

    $scope.selectAnswer = function(qIndex, aIndex) {

      var questionState = $scope.simpleJSON[qIndex].questionState;

      if (questionState != 'answered') {
        $scope.simpleJSON[qIndex].selectedAnswer = aIndex;
        var correctAnswer = $scope.simpleJSON[qIndex].correct;
        $scope.simpleJSON[qIndex].correctAnswer = correctAnswer;

        if (aIndex === correctAnswer) {
          $scope.simpleJSON[qIndex].correctness = 'correct';
          $scope.score += 1;
        } else {
          $scope.simpleJSON[qIndex].correctness = 'incorrect';
        }
        $scope.simpleJSON[qIndex].questionState = 'answered';

      }

      $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(2);

    }


    $scope.isSelected = function(qIndex, aIndex) {
      return ($scope.simpleJSON[qIndex].selectedAnswer === aIndex);
    }

    $scope.isCorrect = function(qIndex, aIndex) {
      return ($scope.simpleJSON[qIndex].correctAnswer === aIndex);
    }

    $scope.selectContinue = function() {
      return $scope.activeQuestion += 1;
    }

  }]);

})();
