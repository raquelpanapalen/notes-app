const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt= require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    description: {type: String, default: "Hi there!"},
    date: { type: Date, default: Date.now }
});

//generar contraseña cifrada
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);;
};

//Compara contraseña cifrada con plaintext
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);