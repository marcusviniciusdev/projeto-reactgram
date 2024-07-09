const mongoose = require("mongoose")
const { Schema } = mongoose


const photoSchema = new Schema(
    {
        image: String,
        title: String,
        likes: Array,
        comments: Array,
        userId: mongoose.ObjectId, //userId: mongoose.ObjectId para referenciar o ID do usuário que postou a foto.
        userName: String
    }, {
    timestamps: true
}
)

const Photo = mongoose.model("Photo", photoSchema)

module.exports = Photo;