topSuite("Ext.data.field.Array", ['Ext.data.field.Date'], function() {
    var field;

    function make(cfg) {
        field = new Ext.data.field.Array(cfg);
    }

    afterEach(function() {
        field = null;
    });

    describe("defaults", function() {
        it("should configure the type", function() {
            make();
            expect(field.getType()).toBe('array');
        });

        it("should set the item type to auto", function() {
            make();
            expect(field.getItemField().getType()).toBe('auto');
        });

        it("should default item type to auto if null", function() {
            make({
                itemType: null
            });
            expect(field.getItemField().getType()).toBe('auto');
        });

        it("should accept a string type", function() {
            make({
                itemType: 'date'
            });
            expect(field.getItemField().getType()).toBe('date');
        });

        it("should accept a field instance", function() {
            var f = new Ext.data.field.Date();

            make({
                itemType: f
            });
            expect(field.getItemField()).toBe(f);
        });
    });

    describe("collate", function() {
        it("should return 0 if both are null", function() {
            make();
            expect(field.collate(null, null)).toBe(0);
        });

        it("should return 0 if references are equal", function() {
            var a = [1, 2, 3];

            make();
            expect(field.collate(a, a)).toBe(0);
        });

        it("should return -1 if lhs is null and rhs is not", function() {
            make();
            expect(field.collate(null, [1])).toBe(-1);
        });

        it("should return 1 if rhs is null and lhs is not", function() {
            make();
            expect(field.collate([1], null)).toBe(1);
        });

        it("should collate in order if lhs.length < rhs.length", function() {
            make();
            expect(field.collate([100], [1, 2])).toBe(1);
        });

        it("should collate in order if rhs.length < lhs.length", function() {
            make();
            expect(field.collate([1, 2], [100])).toBe(-1);
        });

        it("should collate by default", function() {
            make();
            expect(field.collate([1, 2, 3], [1, 2, 4])).toBe(-1);
        });

        it("should base the collated results on the field itemType", function() {
            var T = Ext.define(null, {
                extend: 'Ext.data.field.Field',

                collate: function(a, b) {
                    return a === 3 && b === 4
                        ? 1
                        : this.callParent([a, b]);
                }
            });

            make({
                itemType: new T()
            });
            expect(field.collate([1, 2, 3], [1, 2, 4])).toBe(1);
        });
    });

    describe("compare", function() {
        it("should return 0 if both are null", function() {
            make();
            expect(field.compare(null, null)).toBe(0);
        });

        it("should return 0 if references are equal", function() {
            var a = [1, 2, 3];

            make();
            expect(field.compare(a, a)).toBe(0);
        });

        it("should return -1 if lhs is null and rhs is not", function() {
            make();
            expect(field.compare(null, [1])).toBe(-1);
        });

        it("should return 1 if rhs is null and lhs is not", function() {
            make();
            expect(field.compare([1], null)).toBe(1);
        });

        it("should compare in order if lhs.length < rhs.length", function() {
            make();
            expect(field.compare([100], [1, 2])).toBe(1);
        });

        it("should compare in order if rhs.length < lhs.length", function() {
            make();
            expect(field.compare([1, 2], [100])).toBe(-1);
        });

        it("should compare by default", function() {
            make();
            expect(field.compare([1, 2, 3], [1, 2, 4])).toBe(-1);
        });

        it("should base the collated results on the field itemType", function() {
            var T = Ext.define(null, {
                extend: 'Ext.data.field.Field',

                compare: function(a, b) {
                    return a === 3 && b === 4
                        ? 1
                        : this.callParent([a, b]);
                }
            });

            make({
                itemType: new T()
            });
            expect(field.compare([1, 2, 3], [1, 2, 4])).toBe(1);
        });
    });

    describe("convert", function() {
        describe("allowNull", function() {
            it("should return null if allowNull and the value is empty", function() {
                make({
                    allowNull: true
                });
                expect(field.convert()).toBeNull();
            });

            it("should return an empty array if !allowNull and the value is empty", function() {
                make({
                    allowNull: false
                });
                expect(field.convert()).toEqual([]);
            });
        });

        it("should work with an auto field", function() {
            // auto fields don't have convert by default
            make();
            expect(field.convert([100, 'foo', false])).toEqual([100, 'foo', false]);
        });

        it("should make the value an array if it's not", function() {
            var o = {};

            make();
            expect(field.convert(0)).toEqual([0]);
            expect(field.convert(o)).toEqual([o]);
            expect(field.convert('hey')).toEqual(['hey']);
        });

        it("should call convert on each value", function() {
            var T = Ext.define(null, {
                extend: 'Ext.data.field.Field',
                convert: function(v) {
                    return v * 2;
                }
            });

            make({
                itemType: new T()
            });
            expect(field.convert([1, 2, 3])).toEqual([2, 4, 6]);
        });
    });

    describe("serialize", function() {
        var T = Ext.define(null, {
            extend: 'Ext.data.field.Field',
            serialize: function(v) {
                return Ext.String.leftPad(v.toString(), 2, '0');
            }
        });

        describe("allowNull", function() {
            it("should return null if allowNull and the value is empty", function() {
                make({
                    allowNull: true
                });
                expect(field.serialize()).toBeNull();
            });

            it("should return an empty array if !allowNull and the value is empty", function() {
                make({
                    allowNull: false
                });
                expect(field.serialize()).toEqual([]);
            });
        });

        it("should work with an auto field", function() {
            // auto fields don't have serialize by default
            make();
            expect(field.serialize([100, 'foo', false])).toEqual([100, 'foo', false]);
        });

        it("should serialize each item", function() {
            make({
                itemType: new T()
            });
            expect(field.serialize([1, 2, 3])).toEqual(['01', '02', '03']);
        });
    });

});
