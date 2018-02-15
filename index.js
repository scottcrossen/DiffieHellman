const _ = require('underscore')
const bignum = require('bignum')
const secureRandom = require('crypto-random')
const prompt = require('prompt')

const KEY_SIZE = 500
const GENERATOR = 5
if (KEY_SIZE % 4 != 0) throw 'key size must be divisible by 4'

const bignum_to_bin = (number) => {
  const hex_string = number.toString(16)
  const output = _.range(hex_string.length).map((index) => {
    const short_binary = parseInt(hex_string.charAt(index), 16).toString(2)
    return '0000'.substring(short_binary.length) + short_binary
  }).join('')
  return output.substring(output.indexOf('1'))
}

const modexp = (base, exponent, mod) => {
  mutable_base = null
  return bignum_to_bin(exponent).split("").reverse().reduce((product, bit) => {
    mutable_base = mutable_base == null ? bignum(base).mod(mod) : (mutable_base.pow(2)).mod(mod)
    return bit == '1' ? (product.mul(mutable_base)).mod(mod) : product
  }, bignum(1))
}

/*
// This is a test for the modular exponentiation function
const testT = bignum('1998286638065473057944506344030256054916203227381748916180906390214373930105605405985818224246280726328877245115163209963634633681313092395058312190549')
const testP = bignum('3117669354341343983299795755233093030121263419399456069461857093013377786581355434120522026479521394652584595093999769488992372529197823784149324456563')
const testResult = modexp(GENERATOR, testT, testP)
const expected = bignum('299305359716739514081489065401035859463562587472149502673752032637854521707543606739420594370374704775617985314754263691561207864706808335328454749954')
console.log(`Result of modexp test: ${testResult.eq(expected)}`)
*/

// Generate a new key to use against the autograder
const p = bignum.prime(KEY_SIZE, true)
const private_key = bignum.rand(2 ** KEY_SIZE)
const public_key = modexp(GENERATOR, private_key, p)
console.log(`s: ${private_key}\n\np: ${p}\n\ng^s%p: ${public_key}\n`)
prompt.get('g^t%p', (err, result) => {
  const other_value = result['g^t%p']
  const shared_key = modexp(other_value, private_key, p)
  console.log(`\n(g^t%p)^s%p: ${shared_key}`)
})
