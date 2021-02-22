import { TypeManager } from './../../src';

describe('String serializer', function () 
{
    it('should serialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = undefined;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = undefined;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = null;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = null;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeNull();
    });

    it('should serialize string to string', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = 'x';
        const result      = typeManager.serialize(value);
        
        expect(result).toBe('x');
    });

    it('should deserialize string to string', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = 'x';
        const result      = typeManager.deserialize(value);
        
        expect(result).toBe('x');
    });

    it('should serialize string array to string array', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = ['x', 'y'];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('x');
        expect(result[1]).toBe('y');
    });

    it('should deserialize string array to string array', function ()
    {
        const typeManager = new TypeManager(String);
        const value       = ['x', 'y'];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('x');
        expect(result[1]).toBe('y');
    });

    it('should serialize suitable types to string when implicit conversion is enabled', function ()
    {
        const typeManager = new TypeManager(String, { useImplicitConversion: true });
        const value       = [12.5, -12.5, true, false] as any[];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('12.5');
        expect(result[1]).toBe('-12.5');
        expect(result[2]).toBe('true');
        expect(result[3]).toBe('false');
    });

    it('should deserialize suitable types to string when implicit conversion is enabled', function ()
    {
        const typeManager = new TypeManager(String, { useImplicitConversion: true });
        const value       = [12.5, -12.5, true, false] as any[];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('12.5');
        expect(result[1]).toBe('-12.5');
        expect(result[2]).toBe('true');
        expect(result[3]).toBe('false');
    });
});
