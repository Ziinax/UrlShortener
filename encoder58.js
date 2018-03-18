var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length;

function encode(enc){
   if(typeof enc!=='number' || enc !== parseInt(enc))
                throw '"encode" only accepts integers.';
            var encoded = '';
            while(enc) {
                var remainder = enc % base;
                enc = Math.floor(enc / base);
                encoded = alphabet[remainder].toString() + encoded;        
            }
            return encoded;
}

function decode(dec){
   if(typeof dec!=='string')
                throw '"decode" only accepts strings.';            
            var decoded = 0;
            while(dec) {
                var alphabetPosition = alphabet.indexOf(dec[0]);
                if (alphabetPosition < 0)
                    throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
                var powerOf = dec.length - 1;
                decoded += alphabetPosition * (Math.pow(base, powerOf));
                dec = dec.substring(1);
            }
            return decoded;

};


module.exports.encode = encode;
module.exports.decode = decode;