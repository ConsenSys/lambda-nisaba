/*
file - fuelTokenMgr.js - this file manager sets signing secrets from the
funding account and develops new JWT tokens for new users that can be passaed
to sensui (and also check and verified)

THIS FILE MUST BE CHANGED TO FIT YOUR FORKED API GIVEN THAT UPORT USES
THEIR SPECIFIC API ENDPOINTS

resources
- did-jwt: https://github.com/uport-project/did-jwt

resource description
- did-jwt: The did-JWT library allows you to sign and verify
JSON Web Tokens (JWT). Public keys are resolved using the
Decentralized ID (DID) of the iss claim of the JWT.
*/
import { createJWT, verifyJWT, SimpleSigner, decodeJWT } from "did-jwt";

class FuelTokenMgr {
  constructor() {
    this.signingKey = null;
    this.publicKey = null;
    this.tokenSigner = null;
  }
  isSecretsSet() {
    return this.signingKey !== null && this.publicKey !== null;
  }

  setSecrets(secrets) {
    this.signingKey = secrets.FUEL_TOKEN_PRIVATE_KEY;
    this.publicKey = secrets.FUEL_TOKEN_PUBLIC_KEY;
    this.tokenSigner = SimpleSigner(this.signingKey);
  }

  async newToken(deviceKey) {
    const signer = this.tokenSigner;
    let now = Math.floor(Date.now() / 1000);
    return createJWT(
      {
        aud: [
          "api.uport.me/nisaba",
          "api.uport.me/unnu",
          "api.uport.me/sensui"
        ],
        exp: now + 300,
        sub: deviceKey,
        iat: now
      },
      { issuer: "api.uport.me/nisaba", signer }
    ).then(jwt => {
      return jwt;
    });
  }

  async verifyToken(fuelToken) {
    let aud = [
      "api.uport.me/nisaba",
      "api.uport.me/unnu",
      "api.uport.me/sensui"
    ];
    verifyJWT(fuelToken, {
      audience: aud
    }).then(({ payload, doc, did, signer, jwt }) => {
      console.log(payload);
    });
  }

  async decode(fuelToken) {
    return decodeJWT(fuelToken);
  }
}

module.exports = FuelTokenMgr;
