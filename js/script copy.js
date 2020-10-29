(function(){
	//elemento canvas e contexto de renderização
	var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");

    var WIDTH = cnv.width, HEIGHT = cnv.height;
    
    // animação do personagem
    var LEFT = 37, UP =  38, RIGHT = 39, DOWN = 40;
    var mvLeft = mvUP = mvRight = mvDown = false;
	
	//tamanho dos blocos
    var tileSize = 64;
    
    // armamzena os muros do labirinto
    var wall = []

    //Obj player
    var player = { 
        x: tileSize + 2, // coordenada + 2 px para espaço de distancia  da celula
        y: tileSize + 2,
        width: 28,
        height: 28,
        speed: 2
    };
	
	//mapa do labirinto
	var maze = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // procedimento que varre as linhas e colunas do labirinto - preenchimento
    for(var row in maze){
        for(var column in maze){
            // pega o elemento armazenado em uma determinada linha/coluna
            var tile = maze[row][column];
            // criação do objeto muro.
            if(tile === 1){
				var wall = {
					x: tileSize*column,
					y: tileSize*row,
					width: tileSize,
					height: tileSize
				};
				// inserção no array
				walls.push(wall);
        }
    }
}

    function blockRectangle(objA, objB) {
        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
        var distY = (objA.y+ objA.height/2) - (objB.y + objB.height/2);

        if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
			var overlapX = sumWidth - Math.abs(distX);
			var overlapY = sumHeight - Math.abs(distY);
			
			if(overlapX > overlapY){
				objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
			} else {
				objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
			}
		}
    }


    // evento disparado para quando estiver precionado a tecla
    window.addEventListener("keydown", keydownHandler, false);
    // evento disparado para quando estiver solta a tecla
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e) {
        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = true;    
                break;
                
            case RIGHT:
                mvRight = true;    
                break;
            
            case UP:
                mvUP = true;    
                break;
                
            case DOWN:
                mvDown = true;    
                break;
        }
        
    }


    function keyupHandler(e) {
        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = false;    
                break;
                
            case RIGHT:
                mvRight = false;    
                break;
            
            case UP:
                mvUP = false;    
                break;
                
            case DOWN:
                mvDown = false;    
                break;
        }
        
    }
	
    // atualização cíclica do programa
    // movimentação do personagem
    function update(){
        if(mvLeft && !mvRight){
			player.x -= player.speed;
		} else 
		if(mvRight && !mvLeft){
			player.x += player.speed;
		}
		if(mvUp && !mvDown){
			player.y -= player.speed;
		} else 
		if(mvDown && !mvUp){
			player.y += player.speed;
		}
		
		for(var i in walls){
			var wall = walls[i];
			blockRectangle(player,wall);
		}

    }
	
	//renderização (desenha na tela)
	function render(){
        // limpa o rastro do personagem     
        ctx.clearRect(0,0,WIDTH, HEIGHT);

        //salva o contexto *cor do labirinto-  na memoria
        ctx.save(); 
        
        //procedimento que varre as linhas e colunas do labirinto
		for(var row in maze){
			for(var column in maze){
				//pega o elemento armazenado em uma determinada linha/coluna
				var tile = maze[row][column];
				//se for um tijolo...
				if(tile === 1){
					//...especifica as dimensões e a posição...
					var x = column * tileSize;
					var y = row * tileSize;
					//...e desenha na tela
					ctx.fillRect(x,y,tileSize,tileSize);
				}
			}
        }
        
        ctx.fillStyle = "#00f"; // cor do personagem
        ctx.fillRect(player.x, player.y, player.width, player.height); //personagem
        ctx.restore();
	}
	
	function loop(){
		update();
		render();
		requestAnimationFrame(loop,cnv);
	}
    requestAnimationFrame(loop,cnv);
    
}());
