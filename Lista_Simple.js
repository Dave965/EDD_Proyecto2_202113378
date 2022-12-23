class Lista_simple{
	constructor(){
		this.cabeza = null;
	}

//Funcionalidades

	poner(usuario){
		const nuevoUs = new Nodo(usuario);
		let tmp = this.cabeza;
		if(tmp == null){
			this.cabeza = nuevoUs;
			return 0;
		}
		
		while(tmp.sig != null){
			tmp = tmp.sig;
		}
		tmp.sig = nuevoUs;
	}

	nodo_pos(num){
		let tmp = this.cabeza;
		for(let i = 0; i<num;i++){
			tmp = tmp.sig;
		}
		return tmp;
	}

	tamano(){
		let tmp = this.cabeza;
		let num = 0;
		while(tmp != null){
			tmp = tmp.sig;
			num++;
		}
		return num;
	}

	buscar_cliente(usuario, password){
		let tmp = this.cabeza;
		while(tmp != null){
			if(tmp.data.usuario == usuario && tmp.data.password == password){
				return tmp.data;
			}
			tmp = tmp.sig
		}
		return 0;
	}

	buscar_username(username){
		let tmp = this.cabeza;
		while(tmp != null){
			if(tmp.data.usuario == username){
				return tmp.data;
			}
			tmp = tmp.sig;
		}
		return 0;
	}

//Graficas
	graficar_clientes(){
		var codigo_dot = "digraph G{\nlabel=\" Lista de Usuarios \"; \nnode [shape=box];\ngraph [rankdir = LR];\n";
		var tmp = this.cabeza;
		var conexiones = "";
		var nodos = "";
		var numnodo = 0;

		if(tmp == null){
			d3.select("#admin_lienzo").selectAll('*').remove();
			console.log("No se han cargado artistas");
			return 0;
		}

		while(tmp != null){
			nodos += "N_"+ numnodo + "[label = \"Nombre de Usuario: "+ tmp.data.usuario+ "\\n DPI: "+ tmp.data.dpi+"\"];\n";
			if(tmp.sig != null){
				var aux = numnodo + 1;
				conexiones += "N_" + numnodo + " -> N_" + aux +";\n";
			}
			tmp = tmp.sig;
			numnodo += 1;
		}
		conexiones += "N_0 -> N_0 [label = \"Cabeza\" color = \"white\"];\n"
		conexiones += "N_"+(numnodo-1)+" -> N_"+(numnodo-1)+" [label = \"Final\" color = \"white\"];\n"
		codigo_dot += "//nodos \n";
		codigo_dot += nodos+"\n";
		codigo_dot += "//conexiones \n";
		codigo_dot += "{\n"+conexiones+"\n}\n}";

		d3.select("#admin_lienzo").graphviz()
			.width(961)
			.height(650)
			.renderDot(codigo_dot);
	}

//Ordenamientos
	
	ordenar_asc(){
		let tmp = this.cabeza;
		let cambiado = true;
		var aux;

		if(tmp == null){
			console.log("No se han cargado artistas");
			return 0;
		}
		
		while(cambiado){
			tmp = this.cabeza;
			cambiado = false;
			while(tmp.sig != null){
				if(tmp.data.nombre.toLowerCase() > tmp.sig.data.nombre.toLowerCase()){
					aux = tmp.sig.data;
					tmp.sig.data = tmp.data;
					tmp.data = aux;
					cambiado = true;
				}
				tmp = tmp.sig
			}
		}
	}

	ordenar_des(bajo,alto) {
    if (bajo < alto) {
  
        let pi = this.particionar(bajo, alto);
  
        this.ordenar_des(bajo, pi - 1);
        this.ordenar_des(pi + 1, alto);
    }}

	intercambiar(i,j){
		let tmp = this.nodo_pos(i).data;
		this.nodo_pos(i).data  = this.nodo_pos(j).data;
		this.nodo_pos(j).data = tmp;
	}

	particionar(bajo,alto){
		let pivote = this.nodo_pos(alto).data.nombre;

		let i = (bajo - 1);

		for(let j = bajo; j <= alto - 1; j++){
			if(this.nodo_pos(j).data.nombre > pivote){
				i++;
				this.intercambiar(i,j);
			}
		}
		this.intercambiar(i + 1, alto);
		return (i + 1);
	}


}