let errorMessage = new Object();

export function newError(message){
    errorMessage.error=message;
    errorMessage.timestamp=Date.now();
    return errorMessage;
}