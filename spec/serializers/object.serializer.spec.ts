import { ObjectSerializer } from './../../src/serializers';
import { TypeManager, Type, Property, Serializer } from './../../src';

@Type()
@Serializer(new ObjectSerializer())
class User
{
    @Property(() => Company) public company?: Company;
}

@Type()
@Serializer(new ObjectSerializer())
class Company
{
    @Property(() => User) public user?: User;
    @Property(() => Message) public message?: Message;
}

@Type()
@Serializer(new ObjectSerializer())
class Message
{
    @Property(() => User) public user?: User;
}

describe('Object serializer', function () 
{
    it('should serialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = undefined;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = undefined;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = null;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = null;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeNull();
    });

    it('should serialize circular types to circular objects', function ()
    {
        const typeManager = new TypeManager(User);
        const user        = new User();
        const company     = new Company();
        const message     = new Message();

        user.company    = company;
        company.message = message;
        message.user    = user;

        const result = typeManager.serialize(user);
        
        expect(result).toBeInstanceOf(Object);
        expect(result.company).toBeInstanceOf(Object);
        expect(result.company.message).toBeInstanceOf(Object);
        expect(result.company.message.user).toBeInstanceOf(Object);
        expect(result.company.message.user).toBe(result);
    });

    it('should deserialize circular objects to circular types', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = { company: { message: { user: {} } } };

        value.company.message.user = value;

        const result = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(User);
        expect(result?.company).toBeInstanceOf(Company);
        expect(result?.company?.message).toBeInstanceOf(Message);
        expect(result?.company?.message?.user).toBeInstanceOf(User);
        expect(result?.company?.message?.user).toBe(result);
    });

    it('should serialize circular type array to circular object array', function ()
    {
        const typeManager = new TypeManager(User);

        const user  = new User();
        const array = [] as any[];

        array[0] = user;
        array[1] = array;
        
        const result = typeManager.serialize(array);

        expect(result[0]).toBeInstanceOf(Object);
        expect(result[1]).toBeInstanceOf(Object);
        expect(result[1]).toBe(result);
    });

    it('should deserialize circular object array to circular type array', function ()
    {
        const typeManager = new TypeManager(User);
        const value       = [{}];

        value[1] = value;

        const result = typeManager.deserialize(value) as any[];
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(User);
        expect(result[1]).toBeInstanceOf(Array);
        expect(result[1]).toBe(result);
    });
});
