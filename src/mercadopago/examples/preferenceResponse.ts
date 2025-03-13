export const paymentPreference = {
    additional_info: "",
    auto_return: "approved",
    back_urls: {
        failure: "https://tusitio.com/failure",
        pending: "https://tusitio.com/pending",
        success: "https://tusitio.com/success"
    },
    binary_mode: false,
    client_id: "1819459043832827",
    collector_id: 2292996564,
    coupon_code: null,
    coupon_labels: null,
    date_created: "2025-03-13T04:41:08.557-04:00",
    date_of_expiration: null,
    expiration_date_from: null,
    expiration_date_to: null,
    expires: false,
    external_reference: "3000_250__fraa6o54g87cy2taqv196nxk",
    id: "2292996564-edbcc558-ee40-4e06-af3c-551be693bc9f",
    init_point: "https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=2292996564-edbcc558-ee40-4e06-af3c-551be693bc9f",
    internal_metadata: null,
    items: [
        {
            id: "250",
            category_id: "",
            currency_id: "MXN",
            description: "Pago de examen extraordinario",
            title: "Examen Extraordinario",
            quantity: 1,
            unit_price: 350
        }
    ],
    marketplace: "NONE",
    marketplace_fee: 0,
    metadata: {},
    notification_url: null,
    operation_type: "regular_payment",
    payer: {
        phone: {
            area_code: "",
            number: ""
        },
        address: {
            zip_code: "",
            street_name: "",
            street_number: null
        },
        email: "",
        identification: {
            number: "",
            type: ""
        },
        name: "",
        surname: "",
        date_created: null,
        last_purchase: null
    },
    payment_methods: {
        default_card_id: null,
        default_payment_method_id: null,
        excluded_payment_methods: [
            {
                id: ""
            }
        ],
        excluded_payment_types: [
            {
                id: ""
            }
        ],
        installments: null,
        default_installments: null
    },
    processing_modes: null,
    product_id: null,
    redirect_urls: {
        failure: "",
        pending: "",
        success: ""
    },
    sandbox_init_point: "https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref_id=2292996564-edbcc558-ee40-4e06-af3c-551be693bc9f",
    site_id: "MLM",
    shipments: {
        default_shipping_method: null,
        receiver_address: {
            zip_code: "",
            street_name: "",
            street_number: null,
            floor: "",
            apartment: "",
            city_name: null,
            state_name: null,
            country_name: null
        }
    },
    total_amount: null,
    last_updated: null,
    financing_group: "",
    api_response: {
        status: 201,
        headers: {
            date: ["Thu, 13 Mar 2025 08:41:08 GMT"],
            "content-type": ["application/json; charset=utf-8"],
            "content-length": ["827"],
            connection: ["keep-alive"],
            "content-encoding": ["gzip"],
            vary: ["Accept-Encoding"],
            "x-content-type-options": ["nosniff"],
            "x-request-id": ["2ed4b5b6-5be3-435d-bb6b-786ede949767"],
            "x-xss-protection": ["1; mode=block"],
            "strict-transport-security": ["max-age=16070400; includeSubDomains; preload"],
            "access-control-allow-origin": ["*"],
            "access-control-allow-headers": ["Content-Type"],
            "access-control-allow-methods": ["PUT, GET, POST, DELETE, OPTIONS"],
            "access-control-max-age": ["86400"],
            "timing-allow-origin": ["*"]
        }
    }
};
