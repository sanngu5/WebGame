window.onload = pageLoad;

var level = 1;
var audio = new Audio('200610.mp3');
audio.loop = true;

function pageLoad(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	var x1 = canvas.width / 2;
	var y1 = canvas.height - 30;
	var x2 = canvas.width / 2;
	var y2 = canvas.height - 30;

	var dx1 = 3;
	var dy1 = -3;
	var dx2 = 0;
	var dy2 = 0;
	var ballRadius = 10;
	var paddleHeight = 10;
	var paddleWidth = 450;
	var paddleSpeed = 3;
	var paddleX = (canvas.width - paddleWidth) / 2;//

	var trapped = true;//

	var rightPressed = false;
	var leftPressed = false;

	var brickColCount = 20;
	var brickRowCount = 5;

	var myReq = true;//
	var fail = false;

	var brickWidth = 35;
	var brickHeight = 35;
	var brickPadding = 5;

	var brickOffsetTop = 2.5 + 35;
	var brickOffsetLeft = 2.5;

	//레벨1-샐러드 = 캐비지10 + 토마토3 + 비프1
	//레벨2-피자 = 브레드5 + 치즈3 + 비프2
	//레벨3-햄버거 = 캐비지3 + 토마토3 + 비프3+ 브레드3 + 치즈3
	var cabbage = 0;	//1
	var tomato = 0;		//2
	var bread = 0;		//3
	var beef = 0;		//4
	var cheese = 0;		//5

	var bricks = [];
	var pattern = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
					1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 1,
					1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

					[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 
					5, 5, 5, 4, 4, 4, 5, 5, 5, 4, 4, 5, 5, 5, 4, 4, 4, 5, 5, 5, 
					5, 5, 5, 4, 4, 4, 5, 5, 5, 4, 4, 5, 5, 5, 4, 4, 4, 5, 5, 5,
					3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3],

					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
					1, 4, 4, 3, 3, 5, 5, 4, 4, 3, 3, 5, 5, 4, 4, 3, 3, 5, 5, 1,
					1, 4, 4, 3, 3, 5, 5, 4, 4, 3, 3, 5, 5, 4, 4, 3, 3, 5, 5, 1,
					1, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

					[1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 
					 2, 1, 2, 3, 4, 3, 2, 1, 2, 1, 2, 3, 4, 3, 2, 1, 2, 1, 2, 3,
					 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2,
					 4, 3, 2, 1, 2, 1, 2, 3, 4, 3, 2, 1, 2, 1, 2, 3, 4, 6, 2, 1,
					 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2]];

	function gameInit(){
		x1 = canvas.width / 2;
		y1 = canvas.height - 30;
		x2 = canvas.width / 2;
		y2 = canvas.height - 30;

		dx1 = 3;
		dy1 = -3;
		dx2 = 0;
		dy2 = 0;

		paddleX = (canvas.width - paddleWidth) / 2;
		trapped = true;
		myReq = true;

		cabbage = 0;	//1
		tomato = 0;		//2
		bread = 0;		//3
		beef = 0;		//4
		cheese = 0;		//5

		fail = false;

		for(var c = 0; c < brickColCount; c++){
			bricks[c] = [];
			for(var r = 0; r < brickRowCount; r++){
				bricks[c][r] = { x:0, y:0, status:pattern[level-1][c+(20*r)] };
			}
		}
	}

	function drawBricks(){
		for(var c = 0; c < brickColCount; c++){
			for(var r = 0; r < brickRowCount; r++){
				if(bricks[c][r].status != 0){
					var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
					var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
					bricks[c][r].x = brickX;
					bricks[c][r].y = brickY;
					context.beginPath();
					context.rect(brickX, brickY, brickWidth, brickHeight);
					switch(bricks[c][r].status){
						case 1: context.fillStyle = "green"; break;
						case 2:context.fillStyle = "red"; break;
						case 3:context.fillStyle = "brown"; break;
						case 4:context.fillStyle = "pink"; break;
						case 5:context.fillStyle = "yellow"; break;
						case 6: context.fillStyle  = "black"; break;
					};
					context.fill();
					context.closePath();
				}
			}
		}
	}

	function drawBall(){
		context.beginPath();
		context.arc(x1, y1, ballRadius, 0, Math.PI * 2);
		context.fillStyle = "gray";
		context.fill();
		context.closePath();

		if(!trapped){
			context.beginPath();
			context.arc(x2, y2, ballRadius, 0, Math.PI * 2);
			context.fillStyle = "gray";
			context.fill();
			context.closePath();
		}
	}

	function drawPaddle(){
		context.beginPath();
		context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		context.fillStyle = "gray";
		context.fill();
		context.closePath();
	}

	function collisionDetection(){

		for(var c = 0; c < brickColCount; c++){
			for(var r = 0; r < brickRowCount; r++){
				var b = bricks[c][r];
				if(b.status != 0){
					if(
						x1 + ballRadius > b.x &&
						x1 - ballRadius < b.x + brickWidth && 
						y1 + ballRadius > b.y && 
						y1 - ballRadius < b.y + brickHeight
					) {
						switch(b.status){
							case 1: cabbage++; break;
							case 2: tomato++; break;
							case 3: bread++; break;
							case 4: beef++; break;
							case 5: cheese++; break;
							case 6: 
								trapped = false;
								dx2=4;
								dy2=-4; 
								break;
						}

						b.status = 0;

						//충돌방향 알아내기 좌/우/상/하 순서
						var direction = [];
						direction[0] = x1 - b.x;
						direction[1] = b.x + brickWidth - x1;
                		direction[2] = y1 - b.y;
                		direction[3] = b.y + brickHeight - y1;
                		var min_distance = 50;
                		for(var i = 0; i < 4; i++){
                			if(min_distance > direction[i])
                				min_distance = direction[i];
                		}
                		switch(min_distance){
                			case direction[0]: dx1 = -dx1; break;
                			case direction[1]: dx1 = -dx1; break;
                			case direction[2]: dy1 = -dy1; break;
                			case direction[3]: dy1 = -dy1; break;
                			default:dx1 = -dx1; dy1 = -dy1; break;
                		}
					}
					//ball2
					if(
						x2 + ballRadius > b.x &&
						x2 - ballRadius < b.x + brickWidth && 
						y2 + ballRadius > b.y && 
						y2 - ballRadius < b.y + brickHeight &&
						!trapped
					){
						switch(b.status){
							case 1: cabbage++; break;
							case 2: tomato++; break;
							case 3: bread++; break;
							case 4: beef++; break;
							case 5: cheese++; break;
						}

						b.status = 0;

						//충돌방향 알아내기 좌/우/상/하 순서
						var direction = [];
						direction[0] = x2 - b.x;
						direction[1] = b.x + brickWidth - x2;
                		direction[2] = y2 - b.y;
                		direction[3] = b.y + brickHeight - y2;
                		var min_distance = 50;
                		for(var i = 0; i < 4; i++){
                			if(min_distance > direction[i])
                				min_distance = direction[i];
                		}
                		switch(min_distance){
                			case direction[0]: dx2 = -dx2; break;
                			case direction[1]: dx2 = -dx2; break;
                			case direction[2]: dy2 = -dy2; break;
                			case direction[3]: dy2 = -dy2; break;
                			default:dx2 = -dx2; dy2 = -dy2; break;
                		}
					}
				}
			}
		}
		switch(level){
			case 1:
				if(cabbage >= 10 && tomato >= 3 && beef >= 1){
					clear();
				}
				break;
			case 2:
				if(bread >= 10 && cheese >= 3 && beef >= 2){
					clear();
				}
				break;
			case 3:
				if(cabbage >= 3 && tomato >= 3 && beef >= 3 && bread >= 3 && cheese >=3){
					clear();
				}
				break;
			case 4:
				if(cabbage >= 8 && tomato >= 5 && beef >= 3 && bread >= 2 && cheese >=1){
					$("#advance").css("background-color", "gray");
					clear();
				}
				break;

		}
	}

	$("#retry").click(function(){
		$("#result").css("display", "none");
		$("#retry").css("display", "none");
		$("#advance").css("display", "none");
		context.clearRect(0, 0, canvas.width, canvas.height);
		gameInit();
		draw();
	})
	.hover(function(){
		$(this).css("background-color", "red");
	}, function(){
		$(this).css("background-color", "blue");
	});

	$("#advance").click(function(){	
		level++;
		if(!fail && level <= 4){
			$("#result").css("display", "none");
			$("#retry").css("display", "none");
			$("#advance").css("display", "none");
			context.clearRect(0, 0, canvas.width, canvas.height);
			gameInit();
			draw();
		}
		else level--;
	})
	.hover(function(){
		if(!fail && level < 4){
			$(this).css("background-color", "red");
		}
	}, function(){
		if(!fail && level < 4){
			$(this).css("background-color", "blue");
		}
	});

	function clear(){
		myReq = false;
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawScore();
		$("#result").css("display", "block");
		$("#result").text("클리어!");
		$("#retry").css("display", "block");
		$("#advance").css("display", "block");
		if(level < 4){
			$("#advance").css("background-color", "blue");
		}
	}

	function gameover(){
		myReq = false;
		fail = true;
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawScore();
		$("#result").css("display", "block");
		$("#result").text("게임오버...");
		$("#retry").css("display", "block");
		$("#advance").css("display", "block");
		$("#advance").css("background-color", "gray");
	}

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawPaddle();
		drawBricks();
		drawBall();
		drawScore();
		collisionDetection();
		//공 삐져나갔는지
		if(x1 + dx1 > canvas.width - ballRadius || x1 + dx1 < ballRadius) {
			dx1 = -dx1;
		}
		if(y1 + dy1 < ballRadius) {
			dy1 = -dy1;
		}
		else if(y1 + dy1 > canvas.height - ballRadius) {
			//패들터치
			if(x1 > paddleX && x1 < paddleX + paddleWidth) {
				dy1 = -dy1 * 1.0;
			}
			//땅바닥
			else {
				gameover();
			}
		}
		if(!trapped){
			if(x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) {
				dx2 = -dx2;
			}
			if(y2 + dy2 < ballRadius) {
				dy2 = -dy2;
			}
			else if(y2 + dy2 > canvas.height - ballRadius) {
				//패들터치
				if(x2 > paddleX && x2 < paddleX + paddleWidth) {
					dy2 = -dy2 * 1.0;
				}
				//땅바닥
				else {
					gameover();
				}
			}
		}

		if(rightPressed && paddleX < canvas.width - paddleWidth) {
			paddleX += paddleSpeed;
		}
		else if(leftPressed && paddleX > 0){
			paddleX -= paddleSpeed;
		}
		x1 += dx1;
		y1 += dy1;
		x2 += dx2;
		y2 += dy2;

		if(myReq){
			requestAnimationFrame(draw);
		}
		else{
			return;
		}
	}
	

	function keyDownHandler(e){
		if(e.keyCode === 39){
			rightPressed = true;
		}
		else if(e.keyCode === 37){
			leftPressed = true;
		}
	}
	function keyUpHandler(e){
		if(e.keyCode === 39){
			rightPressed = false;
		}
		else if(e.keyCode === 37){
			leftPressed = false;
		}
	}
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);


	var story_line_num = new Array(
		"예전에 구의동에 라따뚜이 형제가 살았습니다.",
		"형제는 미식가였기때문에 다른 쥐들처럼 아무 음식이나 먹지 않았습니다.",
		"그래서 삼시세끼 맛있는 음식을 요리해 먹곤 했습니다. 재료는 어디서 얻었냐구요?",
		"매일 밤마다 근처에 있는 추복이네 집에서 재료들을 쇼핑했답니다.",
		"형은 달리기가 재빨라서 재료들을 잘 훔쳐왔고, ",
		"동생은 달리기는 느리지만 요리를 잘했습니다.",
		"그 날 밤도 형제는 여느때처럼 느긋하게 쇼핑을 즐기고 있었습니다.",
		"그런데 그 때 재료 사이에 있던 쥐덫에 형이 걸리고 말았습니다.",
		"과연 동생은 형을 구하고 재료를 모두 구해올 수 있을까요?",
	);

	var story_index = 0;
	var imgPath;
	$("#start").hover(function(){
		$(this).css("background-color", "red");
	}, function(){
		$(this).css("background-color", "black");
	});
	$("#start").click(function(){
		$(this).css("display", "none");
		$("#skip").css("display", "block");
		$("#story").css("display", "block");
		audio.play();
		$("#image").css("display", "block");

		$("#story").click(function(){
			if(story_index == story_line_num.length-1){
				context.clearRect(200, 50, 400, 250);
				$(this).css("display", "none");
				$("#skip").css("display", "none");
				$("#image").css("display", "none");
				settings();
			}
			$(this).text(story_line_num[++story_index]);
			imgPath = (story_index+1) + ".png";
			$("#image").attr("src", imgPath);
		})
		.hover(function() {
			$(this).css("background-color", "red");
		},function(){
			$(this).css("background-color", "black");
		})
	});
	$("#skip").click(function(){
		$(this).css("display", "none");
		$("#story").css("display", "none");
		$("#skip").css("display", "none");
		$("#image").css("display", "none");
		settings();
	})
	.hover(function() {
		$(this).css("background-color", "red");
	},function(){
		$(this).css("background-color", "black");
	})

	function drawScore() {
        var str
        context.font = "16px Arial";
        switch(level){
        	case 1: 
        		context.fillStyle = "green";
        		str = "양배추: " + cabbage + "/10";
        		context.fillText(str, 8, 20);
        		context.fillStyle = "red";
        		str = "토마토: " + tomato + "/3";
        		context.fillText(str, 128, 20);
        		context.fillStyle = "pink";
        		str = "소고기: " + beef + "/1";
        		context.fillText(str, 248, 20);
        		break;
        	case 2: 
        		context.fillStyle = "brown";
        		str = "빵: " + bread + "/10";
        		context.fillText(str, 8, 20);
        		context.fillStyle = "yellow";
        		str = "치즈: " + cheese + "/3";
        		context.fillText(str, 128, 20);
        		context.fillStyle = "pink";
        		str = "소고기: " + beef + "/2";
        		context.fillText(str, 248, 20);
        		break;
        	case 3: 
        		context.fillStyle = "green";
        		str = "양배추: " + cabbage + "/4";
        		context.fillText(str, 8, 20);
        		context.fillStyle = "red";
        		str = "토마토: " + tomato + "/4";
        		context.fillText(str, 128, 20);
        		context.fillStyle = "pink";
        		str = "소고기: " + beef + "/4";
        		context.fillText(str, 248, 20);
        		context.fillStyle = "brown";
        		str = "빵: " + bread + "/4";
        		context.fillText(str, 368, 20);
        		context.fillStyle = "yellow";
        		str = "치즈: " + cheese + "/4";
        		context.fillText(str, 488, 20);
        		break;
        	case 4:
        		context.fillStyle = "green";
        		str = "양배추: " + cabbage + "/13";
        		context.fillText(str, 8, 20);
        		context.fillStyle = "red";
        		str = "토마토: " + tomato + "/8";
        		context.fillText(str, 128, 20);
        		context.fillStyle = "pink";
        		str = "소고기: " + beef + "/5";
        		context.fillText(str, 248, 20);
        		context.fillStyle = "brown";
        		str = "빵: " + bread + "/3";
        		context.fillText(str, 368, 20);
        		context.fillStyle = "yellow";
        		str = "치즈: " + cheese + "/2";
        		context.fillText(str, 488, 20);
        		break;
        }
    }

    function select_paddle(){
    	$("#paddle").css("display", "none");
    	$("#music").css("display", "block");
    	$("#progress2").css("background-color", "red");
    }

    function select_music(){
    	$("#music").css("display", "none");
    	$("#level").css("display", "block");
    	$("#progress3").css("background-color", "red");
    }

    function select_level(){
    	$("#level").css("display", "none");
    	$(".progress").css("display", "none");
    	gameInit();
    	draw();
    }

    function settings(){
    	audio.pause();
    	currentTime = 0;
    	$(".progress").css("display", "block");
    	$("#confirm").css("display" , "block");
    	$("#paddle").css("display", "block");
    	$("#progress1").css("background-color", "red");
    	//1번 클릭
    	$("#paddle1").click(function(){
    		paddleWidth = 450;
    		paddleSpeed = 3;
    		select_paddle();
    	})
    	.hover(function() {
    		$(this).css("background-color", "red");
    	},function(){
    		$(this).css("background-color", "blue");
    	});

    	$("#paddle2").click(function(){
    		paddleWidth = 350;
    		paddleSpeed = 12;
			select_paddle();
    	})
    	.hover(function() {
    		$(this).css("background-color", "red");
    	},function(){
    		$(this).css("background-color", "blue");
    	});

    	$("#paddle3").click(function(){
    		paddleWidth = 250;
    		paddleSpeed = 21;
    		select_paddle();
    	})
    	.hover(function() {
    		$(this).css("background-color", "red");
    	},function(){
    		$(this).css("background-color", "blue");
    	});

    	var temp
    	//2번 호버
    	$('#music1').hover(function() {
  			audio.pause();
    		temp = new Audio("200610.mp3");
    		temp.play();
 			$(this).css("background-color", "red");
		}, function(){
			temp.currentTime = 0;
			temp.pause();
			$(this).css("background-color", "blue");
		});
    	$('#music2').hover(function() {
  			audio.pause();
    		temp = new Audio("긴장되는.mp3");
    		temp.play();
    		$(this).css("background-color", "red");
		}, function(){
			temp.currentTime = 0;
			temp.pause();
			$(this).css("background-color", "blue");
		});
		$('#music3').hover(function() {
 			$(this).css("background-color", "red");
		}, function(){
			$(this).css("background-color", "blue");
		});

    	//2번 클릭
    	$("#music1").click(function(){
    		audio = new Audio("200610.mp3");
    		audio.loop = true;
    		audio.play();
    		select_music();
    	});
    	$("#music2").click(function(){
    		audio = new Audio("긴장되는.mp3");
    		audio.loop = true;
    		audio.play();
    		select_music();
    	});
    	$("#music3").click(function(){
    		audio.pause();
    		select_music();
    	});

    	//3번 호버
    	$('#level1').hover(function() {
 			$(this).css("background-color", "red");
		}, function(){
			$(this).css("background-color", "blue");
		});
    	$('#level2').hover(function() {
    		$(this).css("background-color", "red");
		}, function(){
			$(this).css("background-color", "blue");
		});
		$('#level3').hover(function() {
 			$(this).css("background-color", "red");
		}, function(){
			$(this).css("background-color", "blue");
		});

    	//3번 클릭
    	$("#level1").click(function(){
    		level = 1;
    		select_level();
    	});
    	$("#level2").click(function(){
    		level = 2;
    		select_level();
    	});
    	$("#level3").click(function(){
    		level = 3;
    		select_level();
    	});
    }
}