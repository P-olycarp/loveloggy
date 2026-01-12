// LoveLoggy E2E Encryption helpers — ECDH (P-256) + AES-GCM
// Provides client-side helpers for key generation, export/import, shared key derivation, AES-GCM encrypt/decrypt

const LoveLoggyEncryption = (function(){
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function generateKeyPair(){
        return crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey','deriveBits']);
    }

    async function exportPublicKeyJwk(publicKey){
        return crypto.subtle.exportKey('jwk', publicKey);
    }

    async function importPublicKeyJwk(jwk){
        return crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
    }

    async function deriveAesKeyFromPrivate(privateKey, partnerPublicJwk){
        const partnerKey = await importPublicKeyJwk(partnerPublicJwk);
        return crypto.subtle.deriveKey(
            { name: 'ECDH', public: partnerKey },
            privateKey,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt','decrypt']
        );
    }

    function arrayBufferToBase64(buffer){
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }

    function base64ToArrayBuffer(base64){
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return bytes.buffer;
    }

    async function encryptAesGcm(aesKey, plaintext){
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoder.encode(plaintext));
        return { iv: arrayBufferToBase64(iv), ciphertext: arrayBufferToBase64(ct) };
    }

    async function decryptAesGcm(aesKey, ciphertextBase64, ivBase64){
        const ct = base64ToArrayBuffer(ciphertextBase64);
        const ivArr = new Uint8Array(base64ToArrayBuffer(ivBase64));
        const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivArr }, aesKey, ct);
        return decoder.decode(plain);
    }

    // Convenience for message objects
    async function encryptMessageObject(aesKey, obj){
        const plain = JSON.stringify(obj);
        return encryptAesGcm(aesKey, plain);
    }

    async function decryptMessageObject(aesKey, ciphertextBase64, ivBase64){
        const plain = await decryptAesGcm(aesKey, ciphertextBase64, ivBase64);
        try { return JSON.parse(plain); } catch(e) { return plain; }
    }

    return {
        generateKeyPair,
        exportPublicKeyJwk,
        importPublicKeyJwk,
        deriveAesKeyFromPrivate,
        encryptAesGcm,
        decryptAesGcm,
        encryptMessageObject,
        decryptMessageObject
    };
})();

window.LoveLoggyEncryption = LoveLoggyEncryption;
