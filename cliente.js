// Require de inquirer
const inquirer = require('inquirer');

// Require de File System
const fs = require('fs');

// Preguntas para el sistema
const preguntas = [
	// Pregunta A - ¿La pizza es para delivery?
	{
		type: 'confirm',
		name: 'paraDelivery',
		message: '¿La pizza es para delivery?',
		default: false
	},
	// Pregunta B - Si la pizza es para delivery se dispara esta pregunta
	{
		type: 'input',
		name: 'direccion',
		message: 'Ingresá la calle, altura, piso y departamento:',
		when: function (respuestas) {
			// Cuando la pregunta 1 da true, se dispara esta pregunta
			return respuestas.paraDelivery;
		},
		validate: function (respuestaDeEstaPregunta) {
			// validación para para cuando este campo está vacío
			if (respuestaDeEstaPregunta.trim() === '') {
				return '¡Ingresá tu dirección!';
			}
			return true;
		}
	},
	// Pregunta C - Nombre del cliente
	{
		type: 'input',
		name: 'nombreCliente',
		message: 'Ingresá tu nombre:',
		validate: function (respuestaDeEstaPregunta) {
			// validación para para cuando el campo está vacío
			if (respuestaDeEstaPregunta.trim() === '') {
				return '¡Ingresá tu nombre!';
			}
			return true;
		}
	},
	// Pregunta D - Teléfono del cliente
	{
		type: 'input',
		name: 'telefonoCliente',
		message: 'Ingresá tu número de teléfono:',
		validate: function (respuestaDeEstaPregunta) {
			// validación para para cuando el campo está vacío
			if (respuestaDeEstaPregunta.trim() === '') {
				return '¡Ingresá tu número de teléfono!';
			} else if (isNaN(respuestaDeEstaPregunta)) { // validación por si el dato contiene letras
				return '¡Ingresá solo números!';
			}
			return true;
		}
	},
	// Pregunta E - Gusto de la pizza
	{
		type: 'rawlist',
		name: 'gustoPizza',
		message: '¿De qué gusto querés la pizza?',
		choices: ['Muzzarela', 'Jamón y morrón', 'Calabresa', 'Napolitana'],
		default: 'Muzzarela'
	},
	// Pregunta F - Tamaño de la pizza
	{
		type: 'list',
		name: 'tamanioPizza',
		message: 'Elegí el tamaño para tu pizza',
		choices: ['Personal', 'Mediana', 'Grande'],
		default: 'Grande'
	},
	// Pregunta G - ¿Lleva bebida?
	{
		type: 'confirm',
		name: 'conBebida',
		message: '¿Querés agregar una bebida?',
		default: false,
	},
	// Pregunta H- Si lleva bebida se dispara esta pregunta
	{
		type: 'list',
		name: 'gustoBebida',
		message: 'Elegí el gusto de la bebida:',
		choices: [
			'Coca cola',
			'Fanta',
			'Sprite',
			'Pepsi',
			'Mirinda',
			'7 Up',
			'Villavicencio',
			'Villa del Sur',
			'Bon aqua',
		],
		when: function (respuestas) {
			// Cuando la pregunta G da true, se dispara esta pregunta
			return respuestas.conBebida;
		}
	},
	// Pregunta I - ¿Es cliente habitual?
	{
		type: 'confirm',
		name: 'clienteHabitual',
		message: '¿Ya has hecho un pedido con nosotros?',
		default: false
	},
	// Pregunta J - Si es cliente habitual
	{
		type: 'checkbox',
		name: 'empanadas',
		message: 'Por ser cliente habitual te regalamos 3 empanadas, elegí tres gustos distintos:',
		choices: ['Carne picante', 'Carne cortada a cuchillo', 'Jamon y muzzarela', 'Pollo', 'Ananá y jamón', 'Queso y cebolla'],
		when: function (respuestas) {
			// Cuando la pregunta I da true, se dispara esta pregunta
			return respuestas.clienteHabitual;
		},
		validate: function (valor) {
			// Solo es posible elegir 3 gustos de empanada
			if (valor.length < 3 || valor.length > 3) {
				return 'Debés elegir tres gustos';
			}
			return true;
		}
	},
]

const laFnDelThen = respuestas => {
	// Punto 2C de la guía de ejercitación
	console.log('=== Resumen de tu pedido ===');
	console.log(`Tu datos - Nombre: ${respuestas.nombreCliente} | Teléfono: ${respuestas.telefonoCliente}`);

	// Punto 2D de la guía - Si el pedido es para delivery mostrar:
	if (respuestas.paraDelivery) {
		console.log(`Tu pedido será entregado en: ${respuestas.direccion}`);
	} else {
		console.log('Pasás a retirar tu pedido');
	}

	// Punto 2F de la guia - Datos del pedido
	console.log('=== Productos solicitados ===');
	console.log(`Pizza: ${respuestas.gustoPizza}`);
	console.log(`Tamaño: ${respuestas.tamanioPizza}`);

	// 2G de la guia - Si eligió bebida
	if (respuestas.conBebida) {
		console.log(`Bebida: ${respuestas.gustoBebida}`);
	}

	// 2H de la guia  - Si es cliente habitual
	if (respuestas.clienteHabitual) {
		console.log('Tus tres empanadas de regalo serán de:');
		for (const gustoEmpanada of respuestas.empanadas) {
			console.log(`• ${gustoEmpanada}`);
		}
	}

	// 2J de la guia - Precios finales
	let precioPizza = 0;
	let precioBebida = 0;
	let descuento = 0;

	if (respuestas.conBebida) {
		precioBebida = 80;
	}

	switch (respuestas.tamanioPizza) {
		case 'Personal':
			descuento = respuestas.conBebida ? 3 : 0;
			precioPizza = 430 + precioBebida;
			break;
		case 'Mediana':
			descuento = respuestas.conBebida ? 5 : 0;
			precioPizza = 560 + precioBebida;
			break;
		default:
			descuento = respuestas.conBebida ? 8 : 0;
			precioPizza = 650 + precioBebida;
			break;
	}

	console.log('===============================');
	console.log(`Total productos: \$${precioPizza}`);

	if (respuestas.paraDelivery) {
		console.log('Total delivery: $20');
		precioPizza += 20;
	}

	console.log(`Descuentos: ${descuento}%`);
	console.log(`TOTAL: \$${(precioPizza - (precioPizza * descuento) / 100)}`);
	console.log('===============================');

	// 2L - Despedida
	console.log('Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.');

	// Clase 3
	let fecha = new Date();
	let fechaPedido = fecha.toLocaleDateString();
	let horaPedido = fecha.toLocaleTimeString();

	// Agregando Data Adicional
	let dataAdicional = {
		fecha: fechaPedido,
		hora: horaPedido,
		totalProductos: precioPizza,
		descuento: descuento,
	}

	const rutaDelArchivo = __dirname + '/pedidos.json';
	// const rutaDelArchivo = `${__dirname }/pedidos.json`;

	// Leo el archivo para saber si tiene algo
	let infoArchivo = fs.readFileSync(rutaDelArchivo, 'utf8');

	let arrayPedidos = infoArchivo.length == 0 ? [] : JSON.parse(infoArchivo);

	// ¿como agregamos esto al objeto respuestas? con Spread Operator
	respuestas = {
		numeroPedido: arrayPedidos.length + 1,
		...respuestas,
		...dataAdicional,
	};

	arrayPedidos.push(respuestas);

	fs.writeFileSync(rutaDelArchivo, JSON.stringify(arrayPedidos, null, ' '));
}

// Bienvenida al sistema
console.log('Bienvenido a DH Pizzas. Estamos listos para tomar tu pedido');

// Ejecución de inquirer
inquirer
	.prompt(preguntas)
	.then(laFnDelThen)