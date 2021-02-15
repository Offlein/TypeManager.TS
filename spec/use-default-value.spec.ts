import { Type, Property, TypeArtisan, UseDefaultValue } from './../src';

@Type()
@UseDefaultValue()
class User
{
    @Property() @UseDefaultValue() public name?: string;
}

describe('Use default value decorator', function () 
{
    it('should enable use of default value for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.useDefaultValue).toBeTrue();
    });

    it('should enable use of default value for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.useDefaultValue).toBeTrue();
    });
});