const statusCode = {
    'success': 200,
    'created': 201,
    'noContent': 204,
    'badRequest': 400,
    'unauthorized': 401,
    'forbidden': 403,
    'notFound': 404,
    'conflict': 409,
    'userError': 405,
    'internalError': 500,
}

const successMessage = {
    'index': 'SUCCESS',
    'server': 'Server is running',
}

const failMessage = {
    'index': 'FAILED',
    'server': 'Server is not running',
    'internalError': 'Internal Server Error',
    'invalidData': 'Data is invalid',
    'emptyData': 'Data is empty',
    'notFound': 'Account is not found',
    'unvalidAccount': 'Email/Phone is not existed',
    'unvalidPassword': 'Password is not correct',
    'phoneExist': 'Phone is existed',
    'late': 'Account is late',
}

module.exports = { statusCode, successMessage, failMessage }