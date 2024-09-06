const createError = require("http-errors");
const dbConnection = require("../database");

class GlobalController {
  static async search(req, res, next) {
    try{
      const queryString = req.query;
      
      let dynamicParams = [];
      
      let selectclause = "SELECT blogid, category, title, userid, createdTime, heartNum, hahaNum, publishedAt, viewNum, meta FROM Blog ";

      let whereclause = " WHERE 1=1 ";
      if(queryString.userid != null) {
        whereclause += `AND userid=? `;
        dynamicParams.push(queryString.userid);
      }
      if(queryString.searchtext != null) {
        whereclause += `AND title LIKE ? `;
        dynamicParams.push(`%${queryString.searchtext}%`);
      }
      if(queryString.category) {
        const ar = queryString.category.split(",").map(x => parseInt(x));
        whereclause += `AND category IN (?`
        for(var i = 1; i < ar.length; i++){
          whereclause += ",?"
        }
        whereclause += `) `;
        dynamicParams.push(...ar);
      }

      let orderbyclause = " ";
      // Chống SQL injection
      const allowedColumns = ["blogid", "category", "title", "userid", "content", "createdTime", "heartNum", "hahaNum", "publishedAt", "lastModifiedAt", "parentId", "viewNum", "meta"];
      const allowedOrders = ['asc', 'desc'];
      if(queryString.orderby != null){
        if (!allowedColumns.includes(queryString.orderby)) {
          throw createError.BadRequest("Wrong query orderby");
        }
        orderbyclause += `ORDER BY ${queryString.orderby} `;
        if(queryString.orderdirection != null){
          if (!allowedOrders.includes(queryString.orderdirection)) {
            throw createError.BadRequest("Wrong query orderby");
          }
          orderbyclause += `${queryString.orderdirection} `;
        } else {
          orderbyclause += "ASC ";
        }
      }

      let finalclause = " ";
      let perpage = queryString.perpage != null ? parseInt(queryString.perpage) : 10;
      let page = queryString.page != null ? parseInt(queryString.page) : 1;
      finalclause += `LIMIT ? OFFSET ?;`; 
      dynamicParams.push(perpage);
      dynamicParams.push((page - 1) * perpage);
      
      const [test] = await dbConnection.getDbConnection()
        .query(selectclause + whereclause + orderbyclause + finalclause, dynamicParams);
      const [test2] = await dbConnection.getDbConnection()
        .query("SELECT COUNT(*) From Blog " + whereclause, dynamicParams);

      if(queryString.getUser == "true") {
        const [test3] = await dbConnection.getDbConnection()
          .query(`SELECT * FROM BlogUser WHERE displayname Like ? ORDER BY displayname ASC LIMIT 20;`, [`%${queryString.searchtext}%`]);
        res.json({
          blog: {
            data: test,
            perpage, page,
            total: test2[0]["COUNT(*)"]
          },
          user: test3
        })
      } else {
        res.json({
          data: test,
          perpage, page,
          total: test2[0]["COUNT(*)"]
        });
      }
    } catch(err){
      next(err);
    }
  }
}

module.exports = GlobalController;