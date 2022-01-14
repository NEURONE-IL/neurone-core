// https://engineering.datorama.com/be-aware-of-the-debounce-decorator-6fb24a6d8d5
import throttleFn from 'lodash.throttle';

export function throttle( milliseconds : number = 0, options = {} ) {
  return function ( target : any, propertyKey : string, descriptor : PropertyDescriptor ) {
    const originalMethod = descriptor.value;
    descriptor.value = throttleFn(originalMethod, milliseconds, options);
    return descriptor;
  }
}
