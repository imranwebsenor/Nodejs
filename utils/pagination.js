module.exports = async (req,model,filter={})  => {

    let page=parseInt(req?.query?.page) || 1;
    let limit=parseInt(req?.query?.limit) || 5;
    let startIndex = (page-1)*limit;
    let endIndex = page * limit;
    userCount = await model.countDocuments(filter);
    let pagination = {};
    if(endIndex < userCount){
        pagination.next ={
            page:page+1,
            limit:limit,
        }
    }
   
    if(startIndex > 0){
        pagination.previous ={
            page:page-1,
            limit:limit,
        }
    }
    let response={};
    response.data= await model.find(filter).skip(startIndex).limit(limit);
    response.pagination = pagination
    return response;
  };
  