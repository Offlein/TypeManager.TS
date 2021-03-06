import { Fn } from './core/fn';
import { GenericArgument } from './core/generic-argument';
import { ReferenceCallback } from './core/reference-callback';
import { ReferenceKey } from './core/reference-key';
import { ReferenceValue } from './core/reference-value';
import { SerializerContext } from './core/serializer-context';
import { TypeCtor } from './core/type-ctor';
import { TypeLike } from './core/type-like';
import { TypeMetadata } from './core/type-metadata';
import { TypeOptions } from './core/type-options';
import { TypeOptionsBase } from './core/type-options-base';
import { TypeArtisan } from './type-artisan';
import { TypeManagerOptions } from './type-manager-options';

/**
 * Type manager class for external usage.
 * 
 * @type {TypeManager<TType>}
 */
export class TypeManager<TType>
{
    /**
     * Type metadata for provided type.
     * 
     * @type {TypeMetadata<TType>}
     */
    public readonly typeMetadata: TypeMetadata<TType>;

    /**
     * Array metadata for provided type.
     * 
     * @type {TypeMetadata<Array<any>>}
     */
    private readonly arrayMetadata: TypeMetadata<Array<any>>;

    /**
     * Constructor.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     */
    public constructor(typeCtor: TypeCtor<TType>)
    {
        this.typeMetadata  = TypeArtisan.extractTypeMetadata(typeCtor);
        this.arrayMetadata = TypeArtisan.extractTypeMetadata(Array);

        return;
    }

    /**
     * Configures global type options.
     * 
     * @param {Partial<TypeOptionsBase<any>>} typeOptionsBase Type options base.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsBase(typeOptionsBase: Partial<TypeOptionsBase<any>>): void
    {
        TypeArtisan.configureTypeOptionsBase(typeOptionsBase);

        return;
    }

    /**
     * Configures type options.
     * 
     * @param {TypeCtor<any>} typeCtor Type constructor function.
     * @param {TypeOptions<any>} typeOptions Type options.
     * 
     * @returns {void}
     */
    public static configureTypeOptions(typeCtor: TypeCtor<any>, typeOptions: TypeOptions<any>): void 
    {
        TypeArtisan.configureTypeOptions(typeCtor, typeOptions);

        return;
    }

    /**
     * Configures type options per type.
     * 
     * @param {Map<TypeCtor<any>, TypeOptions<any>>} typeOptionsMap Type options map.
     * 
     * @returns {void}
     */
    public static configureTypeOptionsMap(typeOptionsMap: Map<TypeCtor<any>, TypeOptions<any>>): void
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
     * Serializes provided value based on the type constructor function.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeLike<TType>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public static serialize<TType>(typeCtor: TypeCtor<TType>, x: undefined): undefined;
    public static serialize<TType>(typeCtor: TypeCtor<TType>, x: null): null;
    public static serialize<TType>(typeCtor: TypeCtor<TType>, x: TType[]): any[];
    public static serialize<TType>(typeCtor: TypeCtor<TType>, x: TType): any;
    public static serialize<TType>(typeCtor: TypeCtor<TType>, x: TypeLike<TType | TType[]>): TypeLike<any>
    {
        return new TypeManager(typeCtor).serialize(x as any);
    }

    /**
     * Deserializes provided value based on the type constructor function.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {TypeLike<any>} x Input value.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public static deserialize<TType>(typeCtor: TypeCtor<TType>, x: undefined): undefined;
    public static deserialize<TType>(typeCtor: TypeCtor<TType>, x: null): null;
    public static deserialize<TType>(typeCtor: TypeCtor<TType>, x: any[]): TType[];
    public static deserialize<TType>(typeCtor: TypeCtor<TType>, x: any): TType;
    public static deserialize<TType>(typeCtor: TypeCtor<TType>, x: TypeLike<any>): TypeLike<TType | TType[]>
    {
        return new TypeManager(typeCtor).deserialize(x as any);
    }

    /**
     * Converts provided value to a JavaScript Object Notation (JSON) string.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {any} x Input value, usually an object or array, to be converted.
     * @param {Function|number[]|string[]} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
     * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * 
     * @returns {string} JSON string.
     */
    public static stringify<TType>(typeCtor: TypeCtor<TType>, x: any, replacer?: (this: any, key: string, value: any) => any | number[] | string[] | null, space?: string | number): string
    {
        return JSON.stringify(this.serialize(typeCtor, x), replacer, space);
    }

    /**
     * Converts a JavaScript Object Notation (JSON) string into a type.
     * 
     * @param {TypeCtor<TType>} typeCtor Type constructor function.
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public static parse<TType>(typeCtor: TypeCtor<TType>, x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TType>
    {
        return this.deserialize(typeCtor, JSON.parse(x, reviver));
    }

    /**
     * Defines serializer context for x.
     * 
     * @param {any} x Some value. 
     * @param {TypeMetadata<any>} typeMetadata Type metadata.
     * @param {GenericArgument<any>[]} genericArguments Generic arguments.
     * 
     * @returns {SerializerContext<any>} Serializer context.
     */
    private defineSerializerContext(x: any, typeMetadata: TypeMetadata<any>, genericArguments?: GenericArgument<any>[]): SerializerContext<any>
    {
        return new SerializerContext({
            $:                    x,
            genericArguments:     genericArguments,
            path:                 '$',
            referenceCallbackMap: new WeakMap<ReferenceKey, ReferenceCallback[]>(),
            referenceMap:         new WeakMap<ReferenceKey, ReferenceValue>(),
            typeMetadata:         typeMetadata
        });
    }

    /**
     * Serializes provided value.
     * 
     *  @param {TypeLike<TType>} x Input value.
     * 
     * @returns {TypeLike<any>} Object created from provided input value or undefined. 
     */
    public serialize(x: undefined): undefined;
    public serialize(x: null): null;
    public serialize(x: TType[]): any[];
    public serialize(x: TType): any;
    public serialize(x: TypeLike<TType | TType[]>): TypeLike<any>
    {
        if (Fn.isArray(x))
        {
            return this.arrayMetadata.serializer.serialize(x, this.defineSerializerContext(x, this.arrayMetadata, [this.typeMetadata.typeCtor]));
        }

        return this.typeMetadata.serializer.serialize(x,  this.defineSerializerContext(x, this.typeMetadata));
    }

    /**
     * Deserializes provided value.
     * 
     * @param {TypeLike<any>} x Input value.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public deserialize(x: undefined): undefined;
    public deserialize(x: null): null;
    public deserialize(x: any[]): TType[];
    public deserialize(x: any): TType;
    public deserialize(x: TypeLike<any>): TypeLike<TType | TType[]>
    {
        if (Fn.isArray(x))
        {
            return this.arrayMetadata.serializer.deserialize(x, this.defineSerializerContext(x, this.arrayMetadata, [this.typeMetadata.typeCtor]));
        }

        return this.typeMetadata.serializer.deserialize(x,  this.defineSerializerContext(x, this.typeMetadata));
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
     * @param {string} x A valid JSON string.
     * @param {Function} reviver A function that transforms the results. This function is called for each member of the object.
     * 
     * @returns {TypeLike<TType>} Type created from provided input value or undefined.
     */
    public parse(x: string, reviver?: (this: any, key: string, value: any) => any): TypeLike<TType>
    {
        return this.deserialize(JSON.parse(x, reviver));
    }
}
