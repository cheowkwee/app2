
class KarelyError extends Error {
	constructor(errorCode, additionalData={}) {
		super();
		this.statusCode = errorCode.statusCode;
		this.message = errorCode.message;
		this.additionalData = additionalData;
	}
}

module.exports = KarelyError;

