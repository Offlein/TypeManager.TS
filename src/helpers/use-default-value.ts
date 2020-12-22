import { Fn } from './../utils';
import { Type } from './../type';
import { Property } from './../property';

/**
 * Use default value decorator.
 * 
 * Used to define if default value should be used.
 * 
 * @param {boolean} useDefaultValue True when default value should be used. False otherwise.
 * 
 * @returns {Function} Class or property decorator.
 */
export function UseDefaultValue(useDefaultValue?: boolean): ClassDecorator & PropertyDecorator
{
    return function (target: any, propertyName?: string | symbol): any
    {
        const usedOnClass = Fn.isNil(propertyName);

        if (usedOnClass)
        {
            return Type({ useDefaultValue: useDefaultValue ?? true })(target);
        }

        return Property({ useDefaultValue: useDefaultValue ?? true, reflectMetadata: false })(target, propertyName!);
    }
}
