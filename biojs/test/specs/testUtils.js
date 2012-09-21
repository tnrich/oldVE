/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.util.Sha256");


Ext.onReady(function() {

    StringUtil      = Teselagen.bio.util.StringUtil;
    XmlToJson       = Teselagen.bio.util.XmlToJson;
    Sha256          = Teselagen.bio.util.Sha256;

    describe("Testing Teselagen.bio.utils", function() {

        describe("Teselagen.bio.util.StringUtil", function() {

            it("trims and pads?",function(){
                var str = "  black  ";
                expect("a" + Teselagen.StringUtil.trim(str) + "b").toBe("ablackb");
                expect(Ext.String.trim(str)).toBe("black");
                expect("a" + Teselagen.StringUtil.ltrim(str) + "b").toBe("ablack  b");  //result "ablack b"
                expect("a" + Teselagen.StringUtil.rtrim(str) + "b").toBe("a  blackb");  //result "a blackb"
                str = "5";
                expect("" + Teselagen.StringUtil.lpad(str, "0", 5)).toBe("00005"); //result "00005"
                expect("" + Teselagen.StringUtil.rpad(str, "0", 5)).toBe("50000"); //result "50000"
                expect(false).toBe(false);
            });

        });

        describe("Teselagen.bio.util.XmlToJson", function() {
        });



        describe("Teselagen.bio.util.Sha256.", function() {
            var test_strings;

            beforeEach(function() {
                test_strings = [
                    'hello',
                    'world',
                    //u'fred\u1234'.encode('utf-8'),
                    encodeURIComponent('fred\u1234'),
                    'this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm'
                ];
            });

            it("Runs sha256_vm_test() correctly", function() {
                expect(Sha256.sha256_vm_test()).toBe(true);
            });

            it("hex_sha256()", function() {
                expect(Sha256.hex_sha256('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
                expect(Sha256.hex_sha256('world')).toBe('486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7');
                //expect(Sha256.hex_sha256(test_strings[2])).toBe('ef748ea88c808cde0aa50ed107d130a94de95f7fcee40909786ae215d781d391');
                expect(Sha256.hex_sha256('this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm')).toBe('c3da4e534e4131c1480ede0dfa91184c3f8b5b0fb74aa66a05727f4d022be173');
            });

            it("b64_sha256()", function() {

                expect(Sha256.b64_sha256('hello')).toBe('LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ');
                expect(Sha256.b64_sha256('world')).toBe('SG6kYiTRu0+2gPNPfJrZao8k7Ii+c+qOWmxlJg6cuKc');
                //expect(Sha256.b64_sha256('fredሴ')).toBe('73SOqIyAjN4KpQ7RB9EwqU3pX3/O5AkJeGriFdeB05E');
                expect(Sha256.b64_sha256('this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm')).toBe('w9pOU05BMcFIDt4N+pEYTD+LWw+3SqZqBXJ/TQIr4XM');
            });

            it("hex_hmac_sha256()", function() {

                expect(Sha256.hex_hmac_sha256('key', 'hello')).toBe('9307b3b915efb5171ff14d8cb55fbcc798c6c0ef1456d66ded1a6aa723a58b7b');
                expect(Sha256.hex_hmac_sha256('key', 'world')).toBe('3b021486e1a7a05883c9e7ceba1ed71a07ee475a6603ba413ed9c1cfe65c884d');
                //expect(Sha256.hex_hmac_sha256('key', 'fredሴ')).toBe('5291cb059306acd5016c215b3a72b52dc0bf5f01ecf7391800f0f5ab961afad3');
                expect(Sha256.hex_hmac_sha256('key', 'this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm')).toBe('75da348bab8a80746ac316ff5d92585ae55a79e5a04c96d372b851fa60b63756');
            });

            it("b64_hmac_sha256()", function() {
                expect(Sha256.b64_hmac_sha256('key', 'hello')).toBe('kwezuRXvtRcf8U2MtV+8x5jGwO8UVtZt7RpqpyOli3s');
                expect(Sha256.b64_hmac_sha256('key', 'world')).toBe('OwIUhuGnoFiDyefOuh7XGgfuR1pmA7pBPtnBz+ZciE0');
                //expect(Sha256.b64_hmac_sha256('key', 'fredሴ')).toBe('UpHLBZMGrNUBbCFbOnK1LcC/XwHs9zkYAPD1q5Ya+tM');
                expect(Sha256.b64_hmac_sha256('key', 'this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm')).toBe('ddo0i6uKgHRqwxb/XZJYWuVaeeWgTJbTcrhR+mC2N1Y');
            });

            it("encrypts ssrA_tag_enhanch Fasta file", function() {
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";

                var contentByte = encodeURIComponent(content);
                var hash        = Sha256.hex_sha256(content);

                //console.log(Sha256.hex_sha256(content));
                //console.log(Sha256.b64_sha256(content));
                //console.log(Sha256.hex_sha256(contentByte));
                //console.log(Sha256.b64_sha256(contentByte));
                //console.log(trueHash);
                expect(hash).toBe(trueHash);
            });
            

        });

    });

});