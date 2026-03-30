interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

function success<T>(data: T, message: string = 'success'): ResponseData<T> {
  return {
    code: 200,
    data,
    message,
  };
}

function error(message: string, code: number = 500): ResponseData<null> {
  return {
    code,
    data: null,
    message,
  };
}

export function Response(message: string = 'success') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);

        if (result && typeof result === 'object' && 'code' in result) {
          return result;
        }

        return success(result, message);
      } catch (err: any) {
        const errorMessage = err.message || '服务器内部错误';
        const errorCode = err.code || err.status || 500;
        return error(errorMessage, errorCode);
      }
    };

    return descriptor;
  };
}

export function Success() {
  return Response('success');
}

export function Message(message: string) {
  return Response(message);
}

export { success, error, ResponseData };
