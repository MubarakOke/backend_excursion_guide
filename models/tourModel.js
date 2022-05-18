const mongoose= require('mongoose')
const { default: slugify } = require('slugify')

const tourSchema= new mongoose.Schema({
    name:{
        type: String,
        maxLength: 255,
        required: [true, 'A tour must have a name'],
        unique: true,

    },
    slug: String,
    duration:{
        type: Number,
        required: [true, 'A tour mut have a duration']  
    },
    maxGroupSize:{
        type: Number,
        required: [true, 'A tour mut have a maxGroupSize']
    },
    difficulty:{
        type: String,
        required: [true, 'A tour mut have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'deficult'],
            message: "Difficulty can only be easy, medium or true"
        }
    },
    ratingsAverage:{
        type: Number,
        default: 4.5
    },
    ratingQuantity:{
        type: Number, 
        default: 0,
    },
    price:{
        type: Number,
        required: [true, 'A tour mut have a price']
    },
    priceDiscount:Number,
    summary:{
        type: String,
        trim: true
    },
    description:{
        type: String,
        trim: true,
        required: [true, 'A tour mut have a description']
    },
    imageCover:{
        type: String,
        required: [true, 'A tour mut have a description']
    },
    images: [String],
    createdAt: {
        type: Date,
        default:Date.now(),
    },
    startDates: [Date]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
  
tourSchema.virtual("durationWeek").get(function(){
    return this.duration/7
})
tourSchema.pre("save", function(next){
                this.slug= slugify(this.name, {lower: true})
                next()
                })
                
const Tour= mongoose.model('Tour', tourSchema)

module.exports= Tour