class Merkle{
	constructor(){
		this.merkle_a = null;
		this.datablocks = [];
		this.blockchain = [];
		this.indice = 0;
	}

	generar_bloque(data){
		var prev_hash;

		var date_ob = new Date(Date.now());
		var year = date_ob.getFullYear();
		var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
		var date = ("0" + date_ob.getDate()).slice(-2);
		var hours = ("0" + date_ob.getHours()).slice(-2);
		var minutes = ("0" + date_ob.getMinutes()).slice(-2);
		var seconds = ("0" + date_ob.getSeconds()).slice(-2);
		var timestamp = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;

		if(this.datablocks.length == 0){
			prev_hash = "00";
		}else{
			prev_hash = this.datablocks[this.datablocks.length-1].hash;
		}
		if(this.indice < this.blockchain.length){
			this.blockchain[this.indice] = data;
		}else{
			this.blockchain.push(data);
		}

		this.crear_merkle_a();

		var merkle_r = this.merkle_a.data;
		var nonce = 0;
		var hash = "";

		while(!hash.startsWith("00")){	
			hash = sha256((this.indice)+timestamp+prev_hash+merkle_r+nonce);
			nonce += 1;
		} 

		var n_bloque = new Bloque(timestamp,data,nonce,prev_hash,merkle_r,hash);
		this.datablocks.push(n_bloque);
		this.indice += 1;
	}

	crear_merkle_a(){
		var exp = 0;
		while(Math.pow(2, exp) < this.blockchain.length){
			exp += 1;
		}
		for(var i = this.blockchain.length; i< Math.pow(2,exp);i++){
			this.blockchain.push("1");
		}
		this.hacer_arbol(exp);
		this.llenar_hash(this.merkle_a,0);
	}

	hacer_arbol(exp){
		var raiz = new Nodo_binario(0);
		this.hacer_arbol_aux(raiz,exp);
		this.merkle_a = raiz;
	}

	hacer_arbol_aux(nodo,e){
		if(e > 0){
			nodo.izq = new Nodo_binario(0);
			nodo.der = new Nodo_binario(0);
			this.hacer_arbol_aux(nodo.izq,e-1);
			this.hacer_arbol_aux(nodo.der,e-1);
		}
	}

	llenar_hash(nodo,indice){
		if(nodo.izq == null && nodo.der == null){
			nodo.data = sha256(this.blockchain[indice]);
			indice += 1;
			return indice;
		}

		indice = this.llenar_hash(nodo.izq,indice);
		indice = this.llenar_hash(nodo.der,indice);
		nodo.data = sha256(nodo.izq.data+nodo.der.data);
		return indice;
	}

	graficar_merkle(){
		var codigo_dot = "digraph G{\nlabel=\" Arbol de Merkle \";\n";
		var tmp = this.merkle_a;
		var nodos = "";

		if(this.merkle_a == null){
			d3.select("#admin_lienzo_block").selectAll('*').remove();
			console.log("arbol vacio");
			return 0;
		}

		let res = this.generar_grafo(tmp,0,0,nodos);
		codigo_dot += res.s;
		codigo_dot += "}";

		d3.select("#admin_lienzo_block").graphviz()
			.width(1470)
			.height(660)
			.renderDot(codigo_dot);

	}

	generar_grafo(nodo,padre,actual,s){
		if(nodo == null){
			return {s, actual};
		}

		actual += 1;

		s += "N_"+actual+"[label = \""+nodo.data.slice(0, 5)+"\"];\n";
		
		if(padre != 0){
			s += "N_"+padre+" -> N_"+actual+";\n";
		}

		let res = this.generar_grafo(nodo.izq,actual,actual,"");
		s += res.s;
		let max = res.actual;
		
		let res2 = this.generar_grafo(nodo.der,actual,max,"");
		s += res2.s;
		actual = res2.actual;

		return { s, actual };		
	}


	generar_html(){
		var s = "";
		for(var i = 0; i<this.datablocks.length;i++){
			s += `<div class="card mx-2 card-block border-5" style="min-width: 450px; max-width: 450px; margin-bottom: 2vh;">
				  <div class="card-header">
				    Bloque: `+i+`
				  </div>
				  <div class="card-body">
				    <p class="card-text">Hash: `+this.datablocks[i].hash+`</p>
				    <p class="card-text">Nonce: `+this.datablocks[i].nonce+`</p>
				    <p class="card-text">Hash anterior: `+this.datablocks[i].prev_hash+`</p>
				    <p class="card-text">Raiz de Merkle: `+this.datablocks[i].merkle_r+`</p>
				    <p class="card-text">Transacciones: `+this.datablocks[i].data+`</p>
				    <p class="card-text">Fecha: `+this.datablocks[i].timestamp+`</p>
				  </div>
				</div>`;
		}
		return s;
	}
}