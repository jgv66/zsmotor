export interface Usuario {
    KOFU:       string,   // codigo de usuario
    NOKOFU:     string,
    RTFU:       string,
    EMAIL:      string,
    MODALIDAD:  string,
    BODEGA:     string,
    LISTAMODALIDAD: string, 
    LISTACLIENTE:   string,
    SUCURSAL:   string, 
    EMPRESA:    string,
    NOKOBO?:    string
}

export interface Cliente {
  codigo:         string,
  sucursal:       string,
  email:          string,
  razonsocial:    string,
  direccion:      string,
  comuna:         string;
  ciudad:         string;
  vendedor:       string,
  nombrevendedor: string,
  listaprecios:   string,  // char(3)
  nombrelista:    string
}

export interface KEnca {
    id_preventa:    number,
    empresa:        string,
    cliente:        string,
    suc_cliente:    string,
    razonsocial?:   string,
    vendedor:       string,
    fechaemision:   Date,
    neto:           number,
    iva:            number,
    impuestos:      number,
    total:          number,
    observacion:    string,
    modalidad:      string,
    valido:         string,
	  fechaentrega:   Date,
    horainicio:     string,
    horafinal:      string
}

export interface KDeta {
  id_detalle:     number,
  id_preventa:    number,
  linea:          number,
  sucursal:       string,
  bodega:         string,
  codigo:         string,
  unidad_tr:      string,
  unidad1:        string,
  unidad2:        string,
  cantidad1:      number,
  cantidad2:      number,
  listaprecio:    string,  // char(3)= 01P, etc
  metodolista:    string,  // char(1)= Neto/Bruto
  precioneto:     number,
  preciobruto:    number,
  neto:           number,
  descuentos:     number,
  recargos:       number,
  iva:            number,
  impuestos:      number,
  total:          number,
  observacion:    string,
  estado:         string,
  valido:         string
}

export interface Configuracion {
  soloconstock:           boolean,
  usarlistacli:           boolean,
  ordenar:                string,
  imagenes:               boolean,
  ocultardscto:           boolean,
  soloverimport:          boolean,
  adq_imagenes:           boolean,
  adq_gps:                boolean,
  adq_enviarcorreolocal?: boolean,
  adq_nvv_transitoria?:   boolean,
  adq_ver_importaciones?: boolean,
  adq_imprimir_docs_pdf?: boolean
}

