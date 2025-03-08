export type TPago = {
    id: number;
    idAlumno: number;
    idTipo: number;
    monto: number;
    idServicio: number;
    deuda: number;
    fechaPago: Date;
    fechaPeriodo: Date;
    fechaRegistro: Date;
    fechaExpiracion: Date;
    fechaModificacion: Date;
    idCuenta: number;
    nombreTitularCuenta: string;
    claveRastreo: string;
    imagen: string;
    comentarios: string;
    idUsuarios: number;
    estatus: number;
    fechaBaja: Date;
  };
  