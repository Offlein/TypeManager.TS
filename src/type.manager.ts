import { Fn, Log, LogLevel } from './utils';
import { TypeMetadata } from './type.metadata';
import { TypeManagerOptions } from './type.manager.options';
import { TypeCtor } from './type.ctor';
import { TypeArtisan } from './type.artisan';
import { TypeOptionsBase } from './type.options.base';
import { TypeOptions } from './type.options';

/**
 * Type manager class for external usage.
 * 
 * @type {TypeManager}
 */
export class TypeManager
{
    /**
     * Type metadata for provided type.
     * 
     * @type {TypeMetadata}
     */
    private readonly typeMetadata: TypeMetadata;

    /**
     * Constructor.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     */
    public constructor(typeCtor: TypeCtor)
    {
        this.typeMetadata = TypeArtisan.extractTypeMetadata(typeCtor);

        if (this.typeMetadata.declaredImplicitly && Log.errorEnabled)
        {
            Log.error(`${Fn.nameOf(typeCtor)}: cannot build implicitly declared type! Declare a type using decorator or configure function!`);
        }
        
        return;
    }

    /**
     * Sets log level.
     * 
     * @param {LogLevel} logLevel Log level.
     * 
     * @returns {void}
     */
    public static setLogLevel(logLevel: LogLevel): void 
    {
        Log.logLevel = logLevel;

        return;
    }

    /**
     * Configures global type options.
     * 
     * @param {TypeOptionsBase} typeOptionsBase Type options base.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsBase(typeOptionsBase: TypeOptionsBase): void
    {
        TypeArtisan.configureTypeOptionsBase(typeOptionsBase);

        return;
    }

    /**
     * Configures type options.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {TypeOptions} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions(typeCtor: TypeCtor, typeOptions: TypeOptions): void 
    {
        TypeArtisan.configureTypeOptions(typeCtor, typeOptions);

        return;
    }

    /**
     * Configures type options per type.
     * 
     * @param {Map<TypeCtor, TypeOptions>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap(typeOptionsMap: Map<TypeCtor, TypeOptions>): void
    {
        TypeArtisan.configureTypeOptionsMap(typeOptionsMap);

        return;
    }

    /**
     * Configures type manager in general.
     * 
     * @param {TypeManagerOptions} typeManagerOptions Type manager options.
     * 
     * @returns {void}
     */
    public static configure(typeManagerOptions: TypeManagerOptions): void
    {
        if (!Fn.isUndefined(typeManagerOptions.logLevel))
        {
            this.setLogLevel(typeManagerOptions.logLevel);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsBase)) 
        {
            this.configureTypeOptionsBase(typeManagerOptions.typeOptionsBase);
        }

        if (!Fn.isUndefined(typeManagerOptions.typeOptionsMap)) 
        {
            this.configureTypeOptionsMap(typeManagerOptions.typeOptionsMap);
        }

        return;
    }

    /**
     * Serializes provided value.
     * 
     * @param {any} x Input value.
     * 
     * @returns {any} Object created from provided input value. 
     */
    public serialize(x: any): any 
    {
        const typeSerializer = this.typeMetadata.typeSerializer ?? this.typeMetadata.typeOptionsBase.typeSerializer;

        if (Fn.isNil(typeSerializer))
        {
            return undefined
        }

        return typeSerializer.serialize(x, this.typeMetadata);
    }

    /**
     * Deserializes provided value.
     * 
     * @param {any} x Input value.
     * 
     * @returns {any} Type created from provided input value. 
     */
    public deserialize(x: any): any
    {
        const typeSerializer = this.typeMetadata.typeSerializer ?? this.typeMetadata.typeOptionsBase.typeSerializer;

        if (Fn.isNil(typeSerializer))
        {
            return undefined
        }

        return typeSerializer.deserialize(x, this.typeMetadata);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public stringify(x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {any} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {any} Type created from provided input value.
     */
    public parse(x: string, reviver?: (this: any, key: string, value: any) => any): any
    {
        return this.deserialize(JSON.parse(x, reviver));
    }
}
