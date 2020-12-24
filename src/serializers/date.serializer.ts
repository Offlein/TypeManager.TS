import { Fn, Log } from './../utils';
import { TypeSerializer } from './../type.serializer';

/**
 * Date serializer.
 * 
 * @type {DateSerializer}
 */
export class DateSerializer extends TypeSerializer
{
    /**
     * Serializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Serialized value.
     */
    public serialize(x: any): any
    {
        if (Fn.isNil(x))
        {
            return null;
        }

        if (Fn.isDate(x))
        {
            return x.toISOString();
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v));
        }

        if (Log.errorEnabled) 
        {
            Log.error('Cannot serialize value as date!', x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Some value.
     * 
     * @returns {any} Deserialized value.
     */
    public deserialize(x: any): any
    {
        if (Fn.isNil(x))
        {
            return null;
        }

        if (Fn.isString(x))
        {
            return new Date(x);
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.deserialize(v));
        }

        if (Log.errorEnabled) 
        {
            Log.error('Cannot deserialize value as date!', x);
        }

        return undefined;
    }
}