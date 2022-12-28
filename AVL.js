class AVL{
	constructor(){
		this.raiz = null
	}

	maximo(v1,v2){
		if(v1>v2) return v1;
		return v2
	}

	altura(nodo){
		if(nodo == null) return -1;
		return nodo.altura;
	}

	poner(dato){
		this.raiz = this.add(dato,this.raiz);
	}

	poner2(dato){
		this.raiz = this.add2(dato,this.raiz);
	}

	buscar(id_pelicula){
		var tmp = this.raiz;
		while(tmp != null){
			if(tmp.data.id_pelicula == id_pelicula){
				return tmp.data;
			}
			else if(id_pelicula > tmp.data.id_pelicula){
				tmp = tmp.der;
			}
			else{
				tmp = tmp.izq;
			}
		}
		return null;
	}

	add(dato,nodo){
		if(nodo == null){
			return new Nodo_avl(dato);
		}

		if(dato.id_pelicula < nodo.data.id_pelicula){
			nodo.izq = this.add(dato,nodo.izq);
			if(this.altura(nodo.der)-this.altura(nodo.izq) == -2){
				if(dato.id_pelicula< nodo.izq.data.id_pelicula){
					nodo = this.rsi(nodo);
				}else{
					nodo = this.rdi(nodo);
				}
			}
		}else if(dato.id_pelicula > nodo.data.id_pelicula){
			nodo.der = this.add(dato,nodo.der);
			if(this.altura(nodo.der)-this.altura(nodo.izq) == 2){
				if(dato.id_pelicula > nodo.der.data.id_pelicula){
					nodo = this.rsd(nodo);
				}else{
					nodo = this.rdd(nodo);
				}
			}
		}else{
			nodo.data = dato;
		}
		nodo.altura = this.maximo(this.altura(nodo.izq), this.altura(nodo.der))+1;
		return nodo;
	}

	add2(dato,nodo){
		if(nodo == null){
			return new Nodo_avl(dato);
		}

		if(dato.nombre_pelicula < nodo.data.nombre_pelicula){
			nodo.izq = this.add2(dato,nodo.izq);
			if(this.altura(nodo.der)-this.altura(nodo.izq) == -2){
				if(dato.nombre_pelicula< nodo.izq.data.nombre_pelicula){
					nodo = this.rsi(nodo);
				}else{
					nodo = this.rdi(nodo);
				}
			}
		}else if(dato.nombre_pelicula > nodo.data.nombre_pelicula){
			nodo.der = this.add2(dato,nodo.der);
			if(this.altura(nodo.der)-this.altura(nodo.izq) == 2){
				if(dato.nombre_pelicula > nodo.der.data.nombre_pelicula){
					nodo = this.rsd(nodo);
				}else{
					nodo = this.rdd(nodo);
				}
			}
		}else{
			nodo.data = dato;
		}
		nodo.altura = this.maximo(this.altura(nodo.izq), this.altura(nodo.der))+1;
		return nodo;
	}
	
	rsi(nodo){
		var aux = nodo.izq;
		nodo.izq = aux.der;
		aux.der = nodo;

		nodo.altura = this.maximo(this.altura(nodo.der), this.altura(nodo.izq))+1;
		aux.altura = this.maximo(this.altura(nodo.izq), nodo.altura)+1;
		return aux;
	}

	rsd(nodo){
		var aux = nodo.der;
		nodo.der = aux.izq;
		aux.izq = nodo;

		nodo.altura = this.maximo(this.altura(nodo.der), this.altura(nodo.izq))+1;
		aux.altura = this.maximo(this.altura(nodo.der), nodo.altura)+1;
		return aux;
	}

	rdd(nodo){
		nodo.der = this.rsi(nodo.der);
		return this.rsd(nodo);
	}

	rdi(nodo){
		nodo.izq = this.rsd(nodo.izq);
		return this.rsi(nodo);
	}

	graficar_avl(){
		var codigo_dot = "digraph G{\nlabel=\" Arbol de Peliculas \";\n";
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

		s += "N_"+actual+"[label = \"Nombre: "+nodo.data.nombre_pelicula+"\"];\n";
		
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

	generar_html_asc(nodo,s){
		if(nodo == null){
			return s;
		}

		s += this.generar_html_asc(nodo.izq,"");

		s += `<div class="card mb-3" style="max-width: 1500px; margin:20px;">
		  <div class="row no-gutters">
		    <div class="col-md-4">
		      <h1>`+nodo.data.nombre_pelicula+`</h1>
		    </div>
		    <div class="col-md-8">
		      <div class="card-body">
		        <h5 class="card-title">Descripcion:</h5>
		        <p class="card-text">`+nodo.data.descripcion+`</p>
		      </div>
		    </div>
		    <div class="col-md-2">
		        <button type="button" class="btn btn-info" style="margin: 10px;" onclick="ir_info(`+nodo.data.id_pelicula+`)">   Informacion   </button>
		    </div>
		    <div class="col-md-2">
		        <button type="button" class="btn btn-success" style="margin: 10px;" onclick="alquilar('`+nodo.data.nombre_pelicula+`')">   Alquilar   </button>
		    </div>
		    <div class="col-md-2">
		         <h5>Q`+nodo.data.precio+`</h5>
		    </div>
		  </div>
		</div>`;


		s += this.generar_html_asc(nodo.der,"");

		return s;
	}

	generar_html_des(nodo,s){
		if(nodo == null){
			return s;
		}

		s = this.generar_html_des(nodo.izq,"") + s;

		s = `<div class="card mb-3" style="max-width: 1500px; margin:20px;">
		  <div class="row no-gutters">
		    <div class="col-md-4">
		      <h1>`+nodo.data.nombre_pelicula+`</h1>
		    </div>
		    <div class="col-md-8">
		      <div class="card-body">
		        <h5 class="card-title">Descripcion:</h5>
		        <p class="card-text">`+nodo.data.descripcion+`</p>
		      </div>
		    </div>
		    <div class="col-md-2">
		        <button type="button" class="btn btn-info" style="margin: 10px;" onclick="ir_info(`+nodo.data.id_pelicula+`)">   Informacion   </button>
		    </div>
		    <div class="col-md-2">
		        <button type="button" class="btn btn-success" style="margin: 10px;" onclick="alquilar('`+nodo.data.nombre_pelicula+`')">   Alquilar   </button>
		    </div>
		    <div class="col-md-2">
		         <h5>Q `+nodo.data.precio+`</h5>
		    </div>
		  </div>
		</div>\n` + s;


		s = this.generar_html_des(nodo.der,"") + s;

		return s;
	}
	
}