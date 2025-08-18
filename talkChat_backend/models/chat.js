const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to User model
        required: true
      }],
      validate: [
        {
          validator: function(v) { return v.length >= 2 },
          message: 'Chat must have at least 2 participants'
        }
      ]
    }
  },
  { timestamps: true }
)

chatSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Chat', chatSchema)
