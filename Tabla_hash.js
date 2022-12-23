class Tabla_hash{
	constructor(tam, max){
		this.tabla = new Array(tam).fill(-1);
		this.tam = tam;
		this.usados = 0;
		this.max = max
	}

	poner(dato){
		var indice = dato.id_categoria % this.tam;

		while(this.tabla[indice] != -1){
			indice += 1;
			if(indice == this.tam){
				indice = 0;
			}
		}
		this.tabla[indice] = dato;
		this.usados ++;

		if(this.usados > this.tam*this.max){
			this.rehash();
		}
	}

	rehash(){
		var viejatabla = this.tabla 
		this.tam = this.usados * 5;
		this.tabla = new Array(this.tam).fill(-1);
		this.usados = 0;
		for(var i = 0;i<viejatabla.length;i++){
			if(viejatabla[i] != -1){
				this.poner(viejatabla[i]);
			}
		}

	}

	generar_html(){
		var s = `<h1>Categorias</h1>
		<div class="d-flex flex-row">`;
		var puestos = 0;
		
		for(var i = 0; i<this.tam;i++){
			if(this.tabla[i]==-1){
				continue;
			}
			if(puestos%2==0){
				s += `
				</div>
				<div class="d-flex flex-row">`;
			}
			s += `
			<div class=" border-5 border" style="min-width: 350px; max-width: 350px; min-height: 350px; max-height: 350px 	; margin: 25px;">
				  <div class="d-flex flex-row" style="height: 100%; align-items: center;">
				  <h3 style="margin: auto">
				    Categoria: `+this.tabla[i].company+`
				  </h3>
				</div>
				</div>`
			puestos +=1;
		}
		s += `</div>`;
		return s;
	}

	graficar_Thash(){
		let Nodos ="T[style=\"setlinewidth(0)\",label=<\n<TABLE>";

	    for(var i=0; i<this.tam;i++){
	    	Nodos+="<TR>\n"
	    	if(this.tabla[i] == -1){
	    		Nodos+="<TD>"+i+"</TD>\n<TD>  </TD>\n";
	    	}
	    	else{
	    		Nodos+="<TD>"+i+"</TD>\n<TD> Categoria: "+this.tabla[i].company+"</TD>\n";
	    	}
	    	Nodos+="</TR>\n"
	    }

	    Nodos += "</TABLE>>];\n";
	    var codigo_dot = "graph G{\nlabel=\" Tabla de Categorias \"; \nnode [shape=box];\ngraph [rankdir = LR];\n";
	    codigo_dot += Nodos+"}";
	    d3.select("#admin_lienzo").graphviz()
			.width(961)
			.height(650)
			.renderDot(codigo_dot);
	}
}