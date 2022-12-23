class Arbol_binario{
	constructor(){
		this.raiz = null;
	}

	poner(dato){
		this.raiz = this.add(dato,this.raiz)
	}

	add(dato,nodo){
		if(nodo == null){
			return new Nodo_binario(dato);
		}
		if(dato.dni < nodo.data.dni){
			nodo.izq = this.add(dato,nodo.izq);
		}else{
			nodo.der = this.add(dato,nodo.der);
		}

		return nodo;
	}

	graficar_binario(){
		var codigo_dot = "digraph G{\nlabel=\" Arbol de Actores \";\n";
		var tmp = this.raiz;
		var nodos = "";
		var nulls = 0;
		var nodo = 0;

		if(this.raiz == null){
			d3.select("#admin_lienzo").selectAll('*').remove();
			console.log("arbol vacio");
			return 0;
		}
		let res = this.generar_grafo(tmp,0,0,nodos);
		codigo_dot += res.s;
		codigo_dot += "}";

		d3.select("#admin_lienzo").graphviz()
			.width(961)
			.height(650)
			.renderDot(codigo_dot);

	}

	generar_grafo(nodo,padre,actual,s){
		actual += 1;
		if(nodo == null){
			s += "N_"+actual+"[shape = point];\n"
			s += "N_"+padre+" -> N_"+actual+";\n";
			return {s, actual};
		}

		s += "N_"+actual+"[label = \"Nombre: "+nodo.data.nombre+"\"];\n";
		
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
	
	generar_html_pre(nodo,s){
		if(nodo == null){
			return s;
		}

		s += `<div class="card mb-3" style="max-width: 1500px; margin:20px;">
		  <div class="row no-gutters">
		    <div class="col-md-4">
		      <h1>`+nodo.data.nombre+`</h1>
		    </div>
		    <div class="col-md-8">
		      <div class="card-body">
		        <h5 class="card-title">Descripcion:</h5>
		        <p class="card-text">`+nodo.data.descripcion+`</p>
		      </div>
		    </div>
		  </div>
		</div>`;


		s += this.generar_html_pre(nodo.izq,"");
		 

		s += this.generar_html_pre(nodo.der,"");

		return s;
	}

	generar_html_en(nodo,s){
		if(nodo == null){
			return s;
		}


		s += this.generar_html_en(nodo.izq,"");
		 
		s += `<div class="card mb-3" style="max-width: 1500px; margin:20px;">
		  <div class="row no-gutters">
		    <div class="col-md-4">
		      <h1>`+nodo.data.nombre+`</h1>
		    </div>
		    <div class="col-md-8">
		      <div class="card-body">
		        <h5 class="card-title">Descripcion:</h5>
		        <p class="card-text">`+nodo.data.descripcion+`</p>
		      </div>
		    </div>
		  </div>
		</div>`;

		s += this.generar_html_en(nodo.der,"");

		return s;
	}

	generar_html_pos(nodo,s){
		if(nodo == null){
			return s;
		}

		s += this.generar_html_pos(nodo.izq,"");

		s += this.generar_html_pos(nodo.der,"");

		s += `<div class="card mb-3" style="max-width: 1500px; margin:20px;">
		  <div class="row no-gutters">
		    <div class="col-md-4">
		      <h1>`+nodo.data.nombre+`</h1>
		    </div>
		    <div class="col-md-8">
		      <div class="card-body">
		        <h5 class="card-title">Descripcion:</h5>
		        <p class="card-text">`+nodo.data.descripcion+`</p>
		      </div>
		    </div>
		  </div>
		</div>`;

		return s;
	}
}