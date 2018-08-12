(function(win,doc) {
	'use strict';

	
	var $btnReset = doc.querySelector('[name="Reset"]');
	var $Tabuleiro = doc.querySelector('[class="Tabuleiro"]');
	var $RadiosTamanho = doc.querySelectorAll('[name="tamanho"]');
	var $DivRadios = doc.querySelector('[class="radios"]');
	var $DivTabuleiro = doc.querySelector('[class="Tabuleiro"]');
	var $P = doc.querySelector('[class="P"]');
	var $btnCampos;
	var valor;
	var remains;
	var numbers = [];
	var NumeroTotalBombas;	

	function GerarNumeros(valor){
			for (var i = 0, j = 1; i < valor; i++, j++) {
			 	numbers[i] =  j;
			 };
		remains = valor;

		function shuffle(numbers) {
	    	var j, x, i;
	    	for (i = numbers.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = numbers[i];
	        numbers[i] = numbers[j];
	        numbers[j] = x;
	    	}
	    	return numbers;
		}

		numbers = shuffle(numbers);
	}

	$btnReset.addEventListener('click', function(){
		win.location.reload();
	});
	$DivRadios.addEventListener('click', function(){
		$DivTabuleiro.innerHTML = "";
		for (var i = 0; i < $RadiosTamanho.length; i++) {
			if($RadiosTamanho[i].checked){
				valor = $RadiosTamanho[i].value;
				CriarCampos(valor);
			}
		}	
		GerarNumeros(valor);

		$btnCampos = doc.querySelectorAll('[class="Campos"]');
		Array.prototype.forEach.call($btnCampos, function(botao,index){
			botao.addEventListener('click', Click);
			botao.datajs = Number(numbers[index]);
		});
		CalculoBombas(valor);
		$P.innerHTML = "O numero de bombas é: " + NumeroTotalBombas;
	});

	function CriarCampos(valor){
		switch(valor){
			case '20':
				for (var i = 1; i <= valor; i++) {
					if( (i-1)%4 == 0 ){$DivTabuleiro.innerHTML += "<div>"}
					$DivTabuleiro.innerHTML += '<input type="button" id=' + i + ' class="Campos" datajs="" value=" ">';
					if( (i-1)%4 == 0 ){$DivTabuleiro.innerHTML += "</div>"}
				}
				break;
			case '56':
				for (var i = 1; i <= valor; i++) {
					if( (i-1)%8 == 0 ){$DivTabuleiro.innerHTML += "<div>"}
					$DivTabuleiro.innerHTML += '<input type="button" id=' + i + ' class="Campos" datajs="" value=" ">';
					if( (i-1)%8 == 0 ){$DivTabuleiro.innerHTML += "</div>"}
				}
				break;
			case '80':
				for (var i = 1; i <= valor; i++) {
					if( (i-1)%10 == 0 ){$DivTabuleiro.innerHTML += "<div>"}
					$DivTabuleiro.innerHTML += '<input type="button" id=' + i + ' class="Campos" datajs="" value=" ">';
					if( (i-1)%10 == 0 ){$DivTabuleiro.innerHTML += "</div>"}
				}
				break;
		}
	}
	function CalculoBombas(valor){
		switch(valor){
			case '20':
				NumeroTotalBombas = 5;
				break;
			case '56':
				NumeroTotalBombas = 10;
				break;
			case '80':
				NumeroTotalBombas = 20;
				break;
		}
	}

	function Click(){
		CalculoBombas(valor);
		
		if (this.datajs <= NumeroTotalBombas) {
			this.value = "B";
			win.alert("explodiu");
			win.location.reload();
		}
		else{
			this.removeEventListener('click', Click);
			Check(this,$btnCampos,valor);
			this.style = "background-color: white";
			remains--;
		}
		if(remains <= NumeroTotalBombas){
			win.alert("Parabens! Você ganhou!!!");
			win.location.reload();
		}
	}

	function IsValueZero(atual,botoes,proximos){
		if(atual.value == 0){ 
			for (var i = 0; i < proximos.length; i++) {
				botoes[(Number(atual.id)+proximos[i])].click();
		   	} 
		}
	}

	function Check(atual,botoes,valor){
		var NumeroColunas;
		var bomba = 0;

		switch(valor){
			case '20':
				NumeroColunas = 4;
				break;
			case '56':
				NumeroColunas = 8;
				break;
			case '80':
				NumeroColunas = 10;
				break;
		}
		if((Number(atual.id) - 1)% NumeroColunas == 0){
			if(atual.id == '1'){ // se primeiro da primeira linha 
				var proximos = [0,(NumeroColunas-1),NumeroColunas];
				for(var i = 0 ; i < 3; i++ ) {

					if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas) {
						bomba++;
					} 
				}
				atual.value = bomba;
				IsValueZero(atual,botoes,proximos);
			}
			else if(atual.id == (valor - NumeroColunas)+1){ // se primeiro da ultima linha 
				var proximos = [-(NumeroColunas+1),-(NumeroColunas),0]; 
				for(var i=0;i<3;i++) {

					if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas)  {
					   	bomba++;
					}
			    }
				atual.value = bomba;
				IsValueZero(atual,botoes,proximos);
			}
			else{ // se primeiro das demais linhas 
				var proximos = [-(NumeroColunas+1),-(NumeroColunas),0,(NumeroColunas-1),NumeroColunas]; 
			    for(var i=0;i<5;i++) {

			   		if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas) {
			   			bomba++;
			   		}
			    }
			    atual.value = bomba;
			    IsValueZero(atual,botoes,proximos);
			} // se primeira linha
		}
		else if( Number(atual.id) % NumeroColunas == 0){

			if( Number(atual.id) / NumeroColunas == 1){ // se ultimo da primeira linha
				var proximos = [-2,NumeroColunas-2,NumeroColunas-1]; 
				for(var i = 0 ; i < 3; i++ ) {
					    	
				   	if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas) {
				   		bomba++;
				   	} 
				}
				atual.value = bomba;
				IsValueZero(atual,botoes,proximos);
			}
			else if(Number(atual.id) == valor ){ // se ultimo da ultima linha
				var proximos = [-(NumeroColunas+2),-(NumeroColunas+1),-2];
			    for(var i=0;i<3;i++) {

				   	if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas)  {
			    		bomba++;
			    	}
			    }
			    atual.value = bomba;
			    IsValueZero(atual,botoes,proximos);
			}
			else{	// se ultimo das demais linhas
				var proximos = [-(NumeroColunas+2),-(NumeroColunas+1),-2,NumeroColunas-2,NumeroColunas-1]; 
			    for(var i=0;i<5;i++) {
				
			   		if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas) {
			   			bomba++;
			   		}
			    }
			    atual.value = bomba;
			    IsValueZero(atual,botoes,proximos);
			} // se ultima linha
		}
		else{

			if( botoes[ Number(atual.id) - NumeroColunas] ){

				if( botoes[ Number(atual.id) + NumeroColunas] ){ // se é um campo do meio
					var proximos = [-6,-5,-4,-2,0,2,3,4]; 
					var proximos = [-(NumeroColunas+2),-(NumeroColunas+1),-NumeroColunas,
									-2,0,NumeroColunas-2,NumeroColunas-1,NumeroColunas]; 
			    	for(var i=0;i<8;i++) {

			   			if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas) {
			   				bomba++;
			   			}
			    	}
			    	atual.value = bomba;
			    	IsValueZero(atual,botoes,proximos);
				}
				else{ // se entre o segundo e o ultimo da ultima linha
					var proximos = [-(NumeroColunas+2),-(NumeroColunas+1),-NumeroColunas,-2,0]; 
				    for(var i=0;i<5;i++) {

				    	if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas)  {
				    		bomba++;
				    	}
				    }
				    atual.value = bomba;
				    IsValueZero(atual,botoes,proximos);
				}
			}
			else{ // senão demais linhas
				var proximos = [-2,0,NumeroColunas-2,NumeroColunas-1,NumeroColunas]; 
			    for(var i = 0 ; i < 5; i++ ) {
			    	
			    	if(botoes[(Number(atual.id)+proximos[i])].datajs <= NumeroTotalBombas) {
			    		bomba++;
			    	} 
			    }
			    atual.value = bomba;
			    IsValueZero(atual,botoes,proximos);
			} 
		}
		if(atual.value == 0){atual.value = " "}
	}

}(window,document));