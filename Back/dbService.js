const mysql = require('mysql');
const dotenv = require('dotenv');

let instance = null;
dotenv.config();

var connection  = mysql.createConnection({
    host            : process.env.HOST,
    user            : process.env.USER,
    password        : process.env.PASSWORD,
    database        : process.env.DATABASE,
    port            : process.env.DB_PORT
  });

connection.connect((err) => {
    if(err){
        console.log(err)
        console.log('ERRROR')
    }else{
        console.log('DataBase WORKING, connected correctly...')
    }
});

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllDataOrdini(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM ordini_magazzino;';
                connection.query(query, (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(results);
                })
            });
            return response
        }catch (error){
            console.log(error)
        }
    }

    async getAllDataPolvere(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM polvere;';
                connection.query(query, (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(results);
                })
            });
            return response
        }catch (error){
            console.log(error)
        }
    }

    async getClienti(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT nome FROM clienti;';
                connection.query(query, (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(results);
                })
            });
            return response
        }catch (error){
            console.log(error)
        }
    }

    async getPolvere(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT Descrizione FROM polvere;';
                connection.query(query, (err, results) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(results);
                })
            });
            return response
        }catch (error){
            console.log(error)
        }
    }

    async insertNewOrder(insert){
        try{
            
            const { Referenza } = insert
            const { Cliente } = insert;
            const { Data_referenza } = insert;
            const { Colore } = insert;
            const { Polvere } = insert;
            const { Barre_presunte } = insert;
            const Data_inserimento = new Date()
            const insertId = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO ordini_magazzino (Referenza, Cliente, Data_referenza,Colore,Polvere,Barre_presunte, Data_inserimento) VALUES (?,?,?,?,?,?,?);';
                    connection.query(query, [Referenza, Cliente, Data_referenza,Colore,Polvere,Barre_presunte, Data_inserimento] , (err, result) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.insertId);
                    })
            });
            return {
                        insertId,
                        Referenza,
                        Cliente,
                        Data_referenza,
                        Colore,
                        Polvere,
                        Barre_presunte,
                        Data_inserimento
                    }
        }catch(error){
            console.log(error)
        }
    }

    async insertNewPowder(insert){
        try{
            
            const { ID_interno_polvere } = insert
            const { Descrizione } = insert;
            const { Codice_fornitore } = insert;
            const { Giacenza } = insert;
            
            const insertId = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO polvere (ID_interno_polvere, Descrizione, Codice_fornitore,Giacenza) VALUES (?,?,?,?);';
                    connection.query(query, [ID_interno_polvere, Descrizione, Codice_fornitore,Giacenza] , (err, result) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.insertId);
                    })
            });
            console.log(insertId)
            return {
                        insertId
                    }
        }catch(error){
            console.log(error)
        }

    }

    async deleteRowByIdOrder(id){
        id = parseInt(id , 10);
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM ordini_magazzino WHERE ID_ordine = ?';
                    connection.query(query, [id] , (err, result) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.affectedRows);
                    })
                });
                return response === 1 ? true : false
        }catch(error){
            console.log(error)
            return false
        }
        

    }

    async updateRowByIdOrder(id,body){
        id = parseInt(id , 10);
        let { Cliente } = body
        let { Referenza } = body
        let { Data_referenza } = body
        let { Colore } = body
        let { Polvere } = body
        let { Barre_presunte } = body

        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE ordini_magazzino SET Referenza = ?, Cliente = ? , Data_referenza = ? ,Colore = ? ,Polvere = ? ,Barre_presunte = ?  WHERE ID_ordine = ?';
                    connection.query(query, [Referenza,Cliente,Data_referenza,Colore,Polvere,Barre_presunte,id] , (err, result) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.affectedRows);        
                    })
                });
                return response === 1 ? true : false
        }catch(error){
            console.log(error)
            return false
        }
        


    }

    async updateRowByIdPolvere(id,body){
        
        let { ID_polvere } = body
        let { ID_interno_polvere } = body
        let { Descrizione } = body
        let { Codice_fornitore } = body
        let { Giacenza } = body
    
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE polvere SET ID_polvere = ?, ID_interno_polvere = ? , Descrizione = ? ,Codice_fornitore = ? ,Giacenza = ? WHERE ID_polvere = ?';
                    connection.query(query, [ID_polvere, ID_interno_polvere, Descrizione, Codice_fornitore, Giacenza ,id] , (err, result) => {
                        if(err){
                            reject(new Error(err.message));
                        }
                        resolve(result.affectedRows);        
                    })
                });
                return response === 1 ? true : false
        }catch(error){
            console.log(error)
            return false
        }
        


    }

    async getAuth(name, password){
        try{
            const response = await new Promise((resolve, reject) => {
                let query = 'SELECT * from auth WHERE name=? AND password=?';
                connection.query(query, [name, password] , (err, result) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    if(result.length === 1){
                        resolve(result[0]); 
                    }else{
                        resolve(false);
                    }                                   
                          
                })           
            });
            return response   
        }catch(error){
            console.log(error)
            return false
        }
    }

    async storeSecret(name, password, signingKey){
        try{
            const response = await new Promise((resolve, reject) => {
                let query = 'UPDATE auth SET signingKey = ? WHERE name=? AND password=?';
                connection.query(query, [signingKey, name, password] , (err, result) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(result.affectedRows)                           
                          
                })           
            });
            return response === 1 ? true : false   
        }catch(error){
            console.log(error)
            return false
        }
    }

    async getSecret(user, id){
        try{
            const response = await new Promise((resolve, reject) => {
                let query = 'SELECT * from auth WHERE name=? AND ID=?';
                connection.query(query, [user, id] , (err, result) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(result[0])                           
                          
                })           
            });
            return response.signingKey
        }catch(error){
            console.log(error)
            return false
        }
    }

    async cancelSecret(name, id){
        try{
            const response = await new Promise((resolve, reject) => {
                let query = 'UPDATE auth SET signingKey = ? WHERE name=? AND ID=?';
                connection.query(query, ['exit', name , id] , (err, result) => {
                    if(err){
                        reject(new Error(err.message));
                    }
                    resolve(result.affectedRows)                           
                          
                })           
            });
            return response === 1 ? true : false
        }catch(error){
            console.log(error)
            return false
        }
    }
    

}
module.exports = DbService;