const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

class FirebaseLogin{
	constructor() {
		this.admin = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
  };
}

let firebaseLogin = new FirebaseLogin();

module.exports = firebaseLogin.admin;