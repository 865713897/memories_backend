const mysql = require("mysql");
const config = require("../config/default");

const db = mysql.createConnection({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
});

// 连接到数据库
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

const bdbs = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

// 创建数据库
const memories =
  "create database if not exists memories default charset utf8 collate utf8_general_ci";

const createDatabase = (db) => {
  return bdbs(db, []);
};

// 创建表
// 留言/照片
const walls = `create table if not exists walls(
  id INT NOT NULL AUTO_INCREMENT,
  type INT NOT NULL COMMENT '类型0信息1图片',
  message VARCHAR(1000) COMMENT '留言',
  name VARCHAR(1000) NOT NULL COMMENT '用户名',
  userId VARCHAR(100) NOT NULL COMMENT '创建者id',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  label INT NOT NULL COMMENT '标签',
  color INT COMMENT '颜色',
  imgurl VARCHAR(100) COMMENT '图片路径',
  PRIMARY key ( id )
)`;

// 留言反馈
const feedbacks = `create table if not exists feedbacks(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言id',
  userId VARCHAR(100) NOT NULL COMMENT '反馈者id',
  type INT NOT NULL COMMENT '反馈类型0喜欢1举报2撤销',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY key ( id )
)`;

// 留言评论
const comments = `create table if not exists comments(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言id',
  userId VARCHAR(100) NOT NULL COMMENT '评论者id',
  imgurl VARCHAR(100) COMMENT '图片路径',
  comment VARCHAR(1000) COMMENT '评论内容',
  name VARCHAR(1000) NOT NULL COMMENT '用户名',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY key ( id )
)`;

// 用户表
const user = `create table if not exists user(
  id INT NOT NULL AUTO_INCREMENT,
  account VARCHAR(20) NOT NULL COMMENT '账号',
  password VARCHAR(100) NOT NULL COMMENT '密码',
  email VARCHAR(100) COMMENT '邮箱',
  sex VARCHAR(5) COMMENT '性别',
  PRIMARY key ( id )
)`;

// 创建表
const createTable = (sql) => {
  return query(sql, []);
};

// 创建
async function create() {
  await createDatabase(memories);
  createTable(walls);
  createTable(feedbacks);
  createTable(comments);
  createTable(user);
}

// create();

module.exports = {
  query,
};
