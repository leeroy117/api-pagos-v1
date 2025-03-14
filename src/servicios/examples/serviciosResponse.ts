export const serviciosResponse = [
    {
        "id": 64,
        "nombre": "Inscripción de Prepa Coppel 2020"
    },
    {
        "id": 65,
        "nombre": "Pago por materia Prepa Coppel 2020"
    },
    {
        "id": 490,
        "nombre": "Pago de Examen Extraordinario"
    }
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