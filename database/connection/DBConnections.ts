import mongoose from "mongoose";

export class DBConnections{
    public static connectToDB(dbUrl:string, dbName:string):Promise<string>{
        return new Promise((resolve, reject) => {
            mongoose.connect(dbUrl, {
                dbName: dbName
            }).then((connection) => {
                if(connection){
                    resolve("Connected to DB Successfully!")
                }
            }).catch((error) => {
                console.log(error);
                reject("Connection to DB is Failed");
            })
        })
    }
}