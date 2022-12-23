class Nodo{
	constructor(data){
		this.data = data;
		this.sig = null;
		this.ant = null;
	}
}

class Nodo_avl{
	constructor(data){
		this.data = data;
		this.izq = null;
		this.der = null;
		this.altura = 0;
	}
}

class Nodo_binario{
	constructor(data){
		this.data = data;
		this.izq = null;
		this.der = null;
	}
}
