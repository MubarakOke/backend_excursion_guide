const Tour= require('../models/tourModel')
const APIFeatures= require('../utils/APIFeatures')
const authController= 

exports.aliasTour= (req, res, next)=>{
    req.query.limit=5
    req.query.sort= "ratingsAverage,price"
    req.query.fields= "name,price,ratingsAverage,summary,difficulty"
    next()
}


exports.createTour= async (req, res)=>{
    try{
        const tourObj= await Tour.create(req.body) 
        return res.status(201).json({
               status:"success",
               data: tourObj })
    }
    catch (err){
        console.log(err)
        return res.status(400).json({
            status:"fail"})
    }

}

exports.getTours= async(req, res)=>{
    try{

    const queryData= new APIFeatures(Tour.find(), req.query).Filter().Sort().LimitFields().Pagination()
    
    const tours= await queryData.query
    return res.status(200).json({status:"success",
                                    count: tours.length,
                                    data:tours})  
    }
    catch (err) {
        console.log(err)
        return res.status(404).json({
            status:"fail"})
    }    
}

exports.getTour= async (req, res)=>{
    try{
        const tour= await Tour.findById(req.params.id)
        return res.status(200).json({status:"success",
                                    data: tour})
    }
    catch (err){
        console.log(err)
        return res.status(404).json({
            status:"fail"})
    }
}


exports.updateTour= async                                                                                                                                                                          (req, res)=>{
    try{
        const tour= await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        return res.status(200).json({status:"success",
                                    data: tour})
    }
    catch (err){
        console.log(err)
        return res.status(404).json({
            status:"fail"})
    }
   }

exports.deleteTour= async (req, res)=>{
    try{
        const tour= await Tour.findByIdAndDelete(req.params.id)
        return res.status(204).json({status:"success",
                                    data: null})
    }
    catch (err){
        console.log(err)
        return res.status(404).json({
            status:"fail"})
    }
   } 

exports.aggregateStat= async (req, res)=>{
    try{
        const stat= await Tour.aggregate([
            {$match : {ratingsAverage: {$gte: 4.5}}},
            {$group: {
                _id: '$difficulty',
                numTours: {$sum: 1},
                avgRating: {$avg: '$ratingsAverage'},
                averagePrice: {$avg:'$price'},
                minPrice: {$min:'$price'},
                maxPrice: {$max:'$price'}
            }},
            {$sort: {avgRating: 1}}
        ])

        return res.status(200).json({status:"success",
                                    count: stat.length,
                                    data: stat})
    }catch(err){
        console.log(err)
        return res.status(404).json({
            status:"fail"})
    }
}