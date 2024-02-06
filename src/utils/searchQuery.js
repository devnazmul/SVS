export const getQueryFromArrayOfObject = (array,queryParam) => {
  
        let query=``;
        array.map(el => {
          query+= `&${queryParam}=${el.id}`
        })
        return query;
      
}