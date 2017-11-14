const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');


module.exports = {
    getMealByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from meals where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/meal:getMealByProperty', err);
                    reject({status: 500, message: 'Unable to find meal.'});
                } else {
                    resolve(result[0]);
                }
            }));
        });
    },

    setMealByProperty: (prop, val, options) => {
        const query = `UPDATE meals SET
            name        = ${mysql.escape(options.name)},
            description = ${mysql.escape(options.description)},
            creator     = ${mysql.escape(options.creator)},
            time        = ${mysql.escape(options.time)},
            deadline    = ${mysql.escape(options.deadline)},
            signupLimit = ${mysql.escape(options.signupLimit)},
            image       = ${mysql.escape(options.image)}
            WHERE  ${prop} = ${mysql.escape(val)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/meal:setMealByProperty', err);
                    reject({status: 500, message: 'Unable to insert data.'});
                } else {
                    resolve({
                        name: options.name,
                        comment: options.comment,
                        id: parseInt(val)
                    });
                }
            }));
        });
    },

    deleteMealByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`delete from meals where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/meal:deleteMealByProperty', err);
                    reject({status: 500, message: 'Unable to delete meal.'});
                } else {
                    resolve({result: result[0], [prop]: val});
                }
            }));
        });
    },

    createMeal: (options) => {
        const query = `INSERT INTO meals (
                name,
                description,
                creator,
                time,
                deadline,
                signupLimit,
                image
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.description)},
                ${mysql.escape(options.creator)},
                ${mysql.escape(options.time)},
                ${mysql.escape(options.deadline)},
                ${mysql.escape(options.signupLimit)},
                ${mysql.escape(options.image)}
            )
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`;

        return getConnection()
        .then (myDb => {
            log(6, 'modules/db/meal:createSignUp - got db connection');
            return new Promise((resolve, reject) => {
                myDb.query(query, (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'modules/db/meal:createSignUp.2', err, query);
                        reject({status: 500, message: 'Error creating meal'});
                    } else {
                        log(6, 'modules/db/meal:createSignUp - meal created');
                        resolve({
                            name: options.name,
                            description: options.description,
                            creator: options.creator,
                            time: options.time,
                            deadline: options.deadline,
                            signupLimit: options.signupLimit,
                            image: options.image,
                            id: result.insertId
                        });
                    }
                });
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/meal.js:createSignUp.4', arguments);
        });
    },

    getAllMeals: () => {
        return getConnection()
        .then (myDb => {
            const query = `SELECT * FROM meals;`;

            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/meal:getAllMeals', err);
                    reject({status: 500, message: 'Unable to get meallist.'});
                } else {
                    resolve(result);
                }
            }));
        });
    }
}