export const serviciosResponse = [
    {
        "id": 64,
        "nombre": "Inscripción de Prepa Coppel 2020",
        "id_tipo": 2,
        "monto": 190,
        "porcentaje_descuento": 0,
        "req_doc_ce": 0
    },
    {
        "id": 65,
        "nombre": "Pago por materia Prepa Coppel 2020",
        "id_tipo": 3,
        "monto": 380,
        "porcentaje_descuento": 0,
        "req_doc_ce": 0
    },
    {
        "id": 123,
        "nombre": "CERTIFICADO",
        "id_tipo": 5,
        "monto": 0,
        "porcentaje_descuento": 0,
        "req_doc_ce": 1
    },
]

export const serviciosBadRequestResponse = {
    "message": [
        "id_plan_estudio should not be empty",
        "id_plan_estudio must be a number conforming to the specified constraints"
    ],
    "error": "Bad Request",
    "statusCode": 400
}

export const internalErrorServerResponse = {
    "statusCode": 500,
    "message": "Internal server error"
}