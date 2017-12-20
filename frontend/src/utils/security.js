/**
 * Created by vathavaria on 12/10/17.
 */

import CryptoJS from 'crypto-js';


export function encrypt(plainText){
	if (!plainText) {
		return
	}
	const b64 = CryptoJS.AES.encrypt(plainText.toString(), "xkwizit").toString();
	const e64 = CryptoJS.enc.Base64.parse(b64);
	return e64.toString(CryptoJS.enc.Hex);
}


export function decrypt(cipherText){
	if (!cipherText) {
		return
	}
	const reb64 = CryptoJS.enc.Hex.parse(cipherText);
	const bytes = reb64.toString(CryptoJS.enc.Base64);
	const decrypt = CryptoJS.AES.decrypt(bytes, "xkwizit");
	return decrypt.toString(CryptoJS.enc.Utf8);
}


