class APIFeatures {
    constructor(query, queryParam){
        this.query= query
        this.queryParam= queryParam
    }

    Filter(){
        // Filtering
        const queryObj= {...this.queryParam}
        const excludedFields=['page', 'fields', 'sort', 'limit']
        excludedFields.forEach(item=>delete queryObj[item])
        // Advance Filtering
        let queryStr= JSON.stringify(queryObj)
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
        this.query= this.query.find(JSON.parse(queryStr))
        return this
    }
    Sort(){
        if(this.queryParam.sort){
            const sort= this.queryParam.sort.split(",").join(" ")
            this.query= this.query.sort(sort)
        }
        else{
            this.query= this.query.sort("-createdAt")
        }
        return this
    }
    LimitFields(){
        if(this.queryParam.fields){
            const fields= this.queryParam.fields.split(",").join(" ")
            this.query= this.query.select(fields)
        }
        else{
            this.query.select("-__v")
        }
        return this
    }
    Pagination(){
        // Pagination 
     const page= this.queryParam.page * 1 || 1
     const limit= this.queryParam.limit * 1 || 20
     const skip= (page-1) * limit 
     this.query= this.query.skip(skip).limit(limit) 
     return this 
    }
}

module.exports= APIFeatures