module.exports = {
    HTTP: {
        STATUS: {
            OK: {
                CODE: 200,
                MESSAGE: 'SUCCESS'
            },
            PARTIAL_SUCCESS: {
                CODE: 206,
                MESSAGE: 'PARTIAL_SUCCESS'
            },
            BAD_REQUEST: {
                CODE: 400,
                MESSAGE: 'BAD_REQUEST'
            },
            NOT_AUTHENTICATED: {
                CODE: 401,
                MESSAGE: 'NOT_AUTHENTICATED'
            },
            NOT_AUTHORIZED: {
                CODE: 403,
                MESSAGE: 'NOT_AUTHORIZED'
            },
            NOT_FOUND: {
                CODE: 404,
                MESSAGE: 'NOT_FOUND'
            },
            CONFLICT: {
                CODE: 409,
                MESSAGE: 'CONFLICT'
            },
            UNPROCESSABLE: {
                CODE: 422,
                MESSAGE: 'UNPROCESSABLE'
            },
            INVALID_TOKEN: {
                CODE: 417,
                MESSAGE: 'INVALID_TOKEN'
            },
            ATTEMPT_EXCEEDED: {
                CODE: 429,
                MESSAGE: 'ATTEMPT_EXCEEDED'
            },
            LOCKED: {
                CODE: 423,
                MESSAGE: 'LOCKED'
            },
        },
    },
    JWT: {
        SECRET: 'sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends',

    }
};