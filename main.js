Lista_clientes = new Lista_simple();
Arbol_actores = new Arbol_binario();
Arbol_peliculas = new AVL();
Arbol_peliculas2 = new AVL();
Tabla_Categorias = new Tabla_hash(20,0.75);
Blockchain = new Merkle();

var transacciones_global = "";
var global_file_reader = new FileReader();

var inter_blockchain = setInterval(Blockchain_periodico,300000);



primer_usuario = new Cliente("2654568452521","Oscar Armin","EDD",sha256("123"),"+502 (123) 123-4567", "correo1@gmail.com",true);
Lista_clientes.poner(primer_usuario);

let current = 'paginaEntrar';
let current_admin = 'Admin_graphs';
let current_us = 'us_principal';
var en_sesion = primer_usuario;

// funcion de botones

function acceso(){
	var username = document.getElementById('login-nombre');
	var pass = document.getElementById('login-pass');
	var admin = document.getElementById('login-admin');
	encontrado = Lista_usuarios.buscar_usuario(username.value,sha256(pass.value));

	username.value = "";
	pass.value = "";
	admin.value = "";

	if(encontrado == 0){
		alert("usuario no encontrado");
		return 0;
	}

	en_sesion = encontrado;

	if(admin.checked && encontrado.admin == true){
		alert("entrando administrador");
		cambiar_pagina("mainAdmin");
	}
	else{
		alert("entrando usuario normal");
		cambiar_pagina("mainUsuarios");
	}
}

function registro(){
	var dpi = document.getElementById("registro_dpi");
	var name = document.getElementById("registro_name");
	var username = document.getElementById("registro_username");
	var password = document.getElementById("registro_password");
	var phone = document.getElementById("registro_phone");

	encript = sha256(password.value);

	let nuevo_us = new Usuario(dpi.value,name.value,username.value,encript,phone.value,false);
	Lista_usuarios.poner(nuevo_us)

	dpi.value = "";
	name.value = "";
	username.value = "";
	password.value = "";
	phone.value = "";

	alert("usuario creado")
	cambiar_pagina("paginaEntrar");
}

function carga_masivo_peliculas(){
	var file_input =  document.getElementById("admin_archivo");
	global_file_reader.onload=function(){

     	var all_peliculas = JSON.parse(global_file_reader.result);
	
		for (var i=0;i<all_peliculas.length;i++){
			id_pelicula = all_peliculas[i].id_pelicula;
			nombre_pelicula = all_peliculas[i].nombre_pelicula;
			descripcion = all_peliculas[i].descripcion;
			puntuacion = all_peliculas[i].puntuacion_star;
			precio = all_peliculas[i].precion_Q;
			paginas = all_peliculas[i].paginas;
			categoria = all_peliculas[i].categorias;
			nueva_pel = new Pelicula(id_pelicula, nombre_pelicula, descripcion, puntuacion, precio, paginas, categoria);
			Arbol_peliculas.poner(nueva_pel);
			Arbol_peliculas2.poner2(nueva_pel);
		}

		alert("se han cargado las peliculas");

   	}
	global_file_reader.readAsText(file_input.files[0]);
}

function carga_masivo_clientes(){
	var file_input =  document.getElementById("admin_archivo");
	
	global_file_reader.onload=function(){

      	var all_clientes = JSON.parse(global_file_reader.result);
	
		for (var i=0;i<all_clientes.length;i++){
			dpi = all_clientes[i].dpi;
			nombre = all_clientes[i].nombre_completo;
			usuario = all_clientes[i].nombre_usuario;
			password = sha256(all_clientes[i].contrasenia);
			telefono = all_clientes[i].telefono;
			correo = all_clientes[i].correo;
			admin = false;
			nuevo_cliente = new Cliente(dpi, nombre, usuario, password, telefono, correo, admin);
			Lista_clientes.poner(nuevo_cliente);
		}

		alert("se han cargado los clientes");
   	}

	global_file_reader.readAsText(file_input.files[0]);

	
}

function carga_masivo_actores(){
	var file_input =  document.getElementById("admin_archivo");
	global_file_reader.onload=function(){

      var all_actores = JSON.parse(global_file_reader.result);
	
		for (var i=0;i<all_actores.length;i++){
			dpi = all_actores[i].dni;
			nombre = all_actores[i].nombre_actor;
			correo = all_actores[i].correo;
			descripcion = all_actores[i].descripcion;

			nuevo_actor = new Actor(dpi, nombre, correo, descripcion);
			Arbol_actores.poner(nuevo_actor);
		}
		
		alert("se han cargado los actores");

   	}
	global_file_reader.readAsText(file_input.files[0]);
}

function carga_masivo_categorias(){
	var file_input =  document.getElementById("admin_archivo");
	global_file_reader.onload=function(){

      	var all_categorias = JSON.parse(global_file_reader.result);
	
		for (var i=0;i<all_categorias.length;i++){
			id_categoria = all_categorias[i].id_categoria;
			company = all_categorias[i].company;

			nueva_cat = new Categoria(id_categoria, company);
			Tabla_Categorias.poner(nueva_cat);
		}
		
		alert("se han cargado las categorias");

   	}
	global_file_reader.readAsText(file_input.files[0]);
}

function g_clientes(){
	Lista_clientes.graficar_clientes();
}

function g_actores(){
	Arbol_actores.graficar_binario();
}

function g_peliculas(){
	Arbol_peliculas.graficar_avl();
}

function g_categorias(){
	Tabla_Categorias.graficar_Thash();
}

function admin_descargar(){
	saveSvgAsPng(document.getElementsByTagName("svg")[0],"Grafica.png")
}

function logout(){
	en_sesion = null;
	ir_a_login();
}

function cargar_us_principal(){
	var peliculas = Arbol_peliculas.generar_html_asc(Arbol_peliculas.raiz,"");
	crear_objeto("us_principal_container",peliculas);
}

function us_principal_asc(){
	var peliculas = Arbol_peliculas2.generar_html_asc(Arbol_peliculas2.raiz,"");
	crear_objeto("us_principal_container",peliculas);
}

function us_principal_des(){
	var peliculas = Arbol_peliculas2.generar_html_des(Arbol_peliculas2.raiz,"");
	crear_objeto("us_principal_container",peliculas);
}

function cargar_us_info(id_pelicula){
	var tmp = Arbol_peliculas.buscar(id_pelicula);
	
	if(tmp == null){
		alert("error al cargar la pelicula");
		ir_us_principal();
		return 0;
	}
	
	let btn_alquilar = `<button type="button" class="btn btn-success" style="margin: 10px;" onclick="alquilar('`+tmp.nombre_pelicula+`')">   Alquilar   </button>`;
	let form_puntuacion = `<h4 style="margin-right: 10px;">Puntuacion: </h4>
          <input type="number" id="us_info_estrellas" style="width: 30px;" min="0" max="5">
          <h4 style="margin-left: 5px;">/5 </h4>  
          <button type="button" class="btn btn-info" style="margin: 10px;" onclick="cambiar_puntuacion(`+id_pelicula+`)">   Cambiar Puntuacion  </button>`;
	let btn_comentario= `<input type="text" id="us_info_comentario" style="min-width: 700px;">
	<button type="button" class="btn btn-info" style="margin: 10px; " onclick="publicar_comentario(`+id_pelicula+`)">   Publicar  </button>`;
	let titulo = `<h1>`+tmp.nombre_pelicula+`</h1>`;
	let descripcion = `<h3>Descripcion:</h3>
	<p>`+tmp.descripcion+`</p>`;
	let comentarios = "";
	for(var i = 0;i<tmp.mensajes.length;i++){
		comentarios += `<div class="card mb-3" style="min-width: 850px; margin:20px;">
		  <div class="row no-gutters">
		    <div class="col-md-4">
		      <h3>`+tmp.mensajes[i].usuario+`:</h3>
		    </div>
		    <div class="col-md-8">
		      <div class="card-body">
		        <p class="card-text">`+tmp.mensajes[i].mensaje+`</p>
		      </div>
		    </div>
		   </div>
		  </div>`;
	}

	crear_objeto("us_info_titulo",titulo);
	crear_objeto("us_info_descripcion",descripcion);
	crear_objeto("us_info_comentarios_container", comentarios);
	crear_objeto("us_crear_comentario", btn_comentario);
	crear_objeto("container_puntuacion", form_puntuacion);
	crear_objeto("container_alquilar", btn_alquilar);
	var rating = document.getElementById("us_info_estrellas");
	rating.value =	tmp.puntuacion;
	
}

function cambiar_puntuacion(id_pelicula){
	var tmp = Arbol_peliculas.buscar(id_pelicula);
	var rating = document.getElementById("us_info_estrellas");
	tmp.puntuacion = rating.value;
}
function publicar_comentario(id_pelicula){
	var tmp = Arbol_peliculas.buscar(id_pelicula);
	var mensaje = document.getElementById("us_info_comentario");
	var n_mensaje = new Mensaje(en_sesion.nombre,mensaje.value);
	tmp.mensajes.push(n_mensaje);
	mensaje.value = "";
	cargar_us_info(id_pelicula);
}

function us_actores_pre(){
	document.getElementById("actores_pre").classList.remove('btn-success');
	document.getElementById("actores_en").classList.remove('btn-success');
	document.getElementById("actores_pos").classList.remove('btn-success');
	document.getElementById("actores_pre").classList.remove('btn-danger');
	document.getElementById("actores_en").classList.remove('btn-danger');
	document.getElementById("actores_pos").classList.remove('btn-danger');

	document.getElementById("actores_pre").classList.add('btn-success');
	document.getElementById("actores_en").classList.add('btn-danger');
	document.getElementById("actores_pos").classList.add('btn-danger');

	var actores = Arbol_actores.generar_html_pre(Arbol_actores.raiz,"");
	crear_objeto("us_actores_container",actores);
}

function us_actores_en(){
	document.getElementById("actores_pre").classList.remove('btn-success');
	document.getElementById("actores_en").classList.remove('btn-success');
	document.getElementById("actores_pos").classList.remove('btn-success');
	document.getElementById("actores_pre").classList.remove('btn-danger');
	document.getElementById("actores_en").classList.remove('btn-danger');
	document.getElementById("actores_pos").classList.remove('btn-danger');

	document.getElementById("actores_pre").classList.add('btn-danger');
	document.getElementById("actores_en").classList.add('btn-success');
	document.getElementById("actores_pos").classList.add('btn-danger');

	var actores = Arbol_actores.generar_html_en(Arbol_actores.raiz,"");
	crear_objeto("us_actores_container",actores);
}

function us_actores_pos(){
	document.getElementById("actores_pre").classList.remove('btn-success');
	document.getElementById("actores_en").classList.remove('btn-success');
	document.getElementById("actores_pos").classList.remove('btn-success');
	document.getElementById("actores_pre").classList.remove('btn-danger');
	document.getElementById("actores_en").classList.remove('btn-danger');
	document.getElementById("actores_pos").classList.remove('btn-danger');

	document.getElementById("actores_pre").classList.add('btn-danger');
	document.getElementById("actores_en").classList.add('btn-danger');
	document.getElementById("actores_pos").classList.add('btn-success');

	var actores = Arbol_actores.generar_html_pos(Arbol_actores.raiz,"");
	crear_objeto("us_actores_container",actores);
}

function cargar_us_categorias(){
	var cards = Tabla_Categorias.generar_html();
	crear_objeto("us_categorias_container",cards);
}

function admin_cargar_block(){
	var cards = Blockchain.generar_html();
	crear_objeto("data_block_container",cards);
	Blockchain.graficar_merkle();
}

function alquilar(pelicula){
	transacciones_global += en_sesion.nombre+" - "+pelicula;
	alert("Has alquilado: "+pelicula+" con exito")
}

function Blockchain_periodico(){
	Blockchain.generar_bloque(transacciones_global);
	transacciones_global = "";
	admin_cargar_block();
}

function crear_objeto(div_id,inner){
	document.getElementById(div_id).innerHTML = inner;
}


// flujo de aplicacion

function registro_volver(){
	document.getElementById("registro_dpi").value = "";
	document.getElementById("registro_name").value = "";
	document.getElementById("registro_username").value = "";
	document.getElementById("registro_password").value = "";
	document.getElementById("registro_phone").value = "";

	cambiar_pagina("paginaEntrar");
}

function ir_a_login(){
	cambiar_pagina("paginaEntrar");
	cambiar_sub("Admin_graphs");
	cambiar_sub_us("us_principal");
}

function ir_a_registro(){
	cambiar_pagina("paginaRegistro");
}

function ir_admin_graph(){
	cambiar_sub("Admin_graphs");
}

function ir_admin_block(){
	cambiar_sub("Admin_blockchain");
}

function ir_us_principal(){
	cambiar_sub_us("us_principal");
	cargar_us_principal();
}

function ir_info(id_pelicula){
	cambiar_sub_us("us_info");
	cargar_us_info(id_pelicula);
}

function ir_us_actores(){
	cambiar_sub_us("us_actores");
	us_actores_pre();
}

function ir_us_categorias(){
	cambiar_sub_us("us_categorias");
	cargar_us_categorias();
}

// cambio de paginas

function cambiar_pagina(nueva_pag){
	document.getElementById(current).hidden = true;
	document.getElementById(nueva_pag).hidden = false;
	current = nueva_pag;
}

function cambiar_sub(nueva_pag){
	document.getElementById(current_admin).hidden = true;
	document.getElementById(nueva_pag).hidden = false;
	current_admin = nueva_pag;
}

function cambiar_sub_us(nueva_pag){
	document.getElementById(current_us).hidden = true;
	document.getElementById(nueva_pag).hidden = false;
	current_us = nueva_pag;
}