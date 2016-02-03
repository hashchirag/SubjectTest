(function() {

  var app = angular.module('myQuiz', ['ngMaterial']);
  app.directive('mathJaxBind', function() {
    var refresh = function(element) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
    };
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.mathJaxBind, function(newValue, oldValue) {
          element.text(newValue);
          refresh(element[0]);
        });
      }
    };
  });

  app.controller('QuizController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {

    $scope.selected = [];
    $scope.totalQuestions = 3;
    $scope.ended = true;

    $scope.drawCanvas = (function drawCanvas() {
      var canvas = document.getElementById('mycanvas');
      var ctx = canvas.getContext('2d');
      var cWidth = canvas.width;
      var cHeight = canvas.height;

      $scope.countTo = 10;
      $scope.counToTime = 10;

      var min = Math.floor($scope.countTo / 60);
      var sec = $scope.countTo - (min * 60);
      $scope.counter = 0;
      var angle = 270;
      var inc = 360 / $scope.countTo;


      function drawScreen() {



        //======= reset canvas

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cWidth, cHeight);

        //========== base arc

        ctx.beginPath();
        ctx.strokeStyle = "#252424";
        ctx.lineWidth = 14;
        ctx.arc(cWidth / 2, cHeight / 2, 100, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
        ctx.stroke();
        ctx.closePath();

        //========== dynamic arc

        ctx.beginPath();
        ctx.strokeStyle = "#df8209";
        ctx.lineWidth = 14;
        ctx.arc(cWidth / 2, cHeight / 2, 100, (Math.PI / 180) * 270, (Math.PI / 180) * angle, false);
        ctx.stroke();
        ctx.closePath();

        //======== inner shadow arc

        grad = ctx.createRadialGradient(cWidth / 2, cHeight / 2, 80, cWidth / 2, cHeight / 2, 115);
        grad.addColorStop(0.0, 'rgba(0,0,0,.4)');
        grad.addColorStop(0.5, 'rgba(0,0,0,0)');
        grad.addColorStop(1.0, 'rgba(0,0,0,0.4)');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 14;
        ctx.arc(cWidth / 2, cHeight / 2, 100, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
        ctx.stroke();
        ctx.closePath();

        //======== bevel arc

        grad = ctx.createLinearGradient(cWidth / 2, 0, cWidth / 2, cHeight);
        grad.addColorStop(0.0, '#6c6f72');
        grad.addColorStop(0.5, '#252424');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.arc(cWidth / 2, cHeight / 2, 93, (Math.PI / 180) * 0, (Math.PI / 180) * 360, true);
        ctx.stroke();
        ctx.closePath();

        //====== emboss arc

        grad = ctx.createLinearGradient(cWidth / 2, 0, cWidth / 2, cHeight);
        grad.addColorStop(0.0, 'transparent');
        grad.addColorStop(0.98, '#6c6f72');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.arc(cWidth / 2, cHeight / 2, 107, (Math.PI / 180) * 0, (Math.PI / 180) * 360, true);
        ctx.stroke();
        ctx.closePath();

        //====== Labels

        var textColor = '#646464';
        var textSize = "12";
        var fontFace = "helvetica, arial, sans-serif";

        ctx.fillStyle = textColor;
        ctx.font = textSize + "px " + fontFace;
        ctx.fillText('MIN', cWidth / 2 - 46, cHeight / 2 - 15);
        ctx.fillText('SEC', cWidth / 2 + 25, cHeight / 2 - 15);

        //====== Values



        ctx.fillStyle = '#6292ae';

        // if (min>9) {
        //   ctx.font='84px '+fontFace;
        //   ctx.fillText('9' ,cWidth/2-55,cHeight/2+35);
        //
        //   ctx.font='24px '+fontFace;
        //   ctx.fillText('+' ,cWidth/2-72,cHeight/2-5);
        // }
        // else {
        {
          ctx.font = '60px ' + fontFace;
          ctx.fillText(min, cWidth / 2 - 60, cHeight / 2 + 35);
        }

        ctx.font = '50px ' + fontFace;
        if (sec < 10) {
          ctx.fillText('0' + sec, cWidth / 2 + 10, cHeight / 2 + 35);
        } else {
          ctx.fillText(":" + sec, cWidth / 2 + 10, cHeight / 2 + 35);
        }


        if (sec <= 0 && $scope.counter < $scope.countTo) {
          angle += inc;
          $scope.counter++;
          min--;
          sec = 59;
        } else
        if ($scope.counter >= $scope.countTo) {
          sec = 0;
          min = 0;
          $scope.activeQuestion = $scope.totalQuestions;

          // alert(""+   $scope.activeQuestion+ ""+ $scope.totalQuestions);
        } else {
          angle += inc;
          $scope.counter++;
          sec--;
        }
      }

      // console.log("" + $scope.counter +  "  " + $scope.counToTime);
      //       if ($scope.counter >= $scope.counToTime){
      //         $scope.show = false;
      //         alert("asdasdasd");
      // }
      setInterval(drawScreen, 1000);

    });


    $scope.loadAndPopulate = function() {

    }

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
        // console.log("test" + first[k].answers[0].text);


        displayingJSONTemp = {
          'question': questionList[k].text.t,
          'answers': optionsArray,
          'correct': answer
        };
        $scope.simpleJSON.push(displayingJSONTemp);
        // console.log("correct answer in global" + questionList[k].text.opts.answer);
        // console.log("correct answer in local" + displayingJSONTemp.correct);

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
      $scope.drawCanvas();
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


    $scope.xyz = function() {

      if($scope.counter >= $scope.counToTime ){
        return 'active';
        alert("sdfd");
      }

      if (($scope.totalQuestions === $scope.activeQuestion))
        return 'active';
      else {
        return 'inactive';
      }
    }

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

    // $scope.displayResults = function() {
    //   if ($scope.counter >=0 && $scope.counter <= $scope.countTo)
    //     return true;
    //   else
    //     return false;
    // }

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
