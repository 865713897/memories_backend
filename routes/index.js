const controller = require("../controller/dbServe");
bodyParser = require("body-parser");

const createResultInfo = (resultCode, resultInfo, success, errorMsg) => {
  return {
    resultCode,
    resultInfo,
    success,
    errorMsg,
  };
};

module.exports = function (app) {
  app.use(bodyParser());
  app.get("/api/v1/login", (req, res) => {
    res.status(200);
    res.json({
      resultCode: "SUCCESS",
      resultInfo: { amount: "123456", password: "123456" },
      success: true,
      errorMsg: "",
    });
  });

  app.post("/api/v1/login", async (req, res) => {
    const { account = "", password = "" } = req.body;
    const sql = `SELECT * from user where account=${account}`;
    const _res = await controller.query(sql, []);
    if (!_res.length) {
      res.status(200);
      res.json({
        resultCode: "FAILED",
        resultInfo: null,
        success: false,
        errorMsg: "未找到匹配账号",
      });
    }
  });

  app.post("/api/v1/signup", async (req, res) => {
    const {
      account = "",
      password = "",
      email = "",
      sex = "unknown",
    } = req.body;
    // 查询是否存在该账号
    const _querySql = `select account from user where account=${account}`;
    const _queryRes = await controller.query(_querySql, []);
    if (_queryRes.length) {
      // 账号已存在
      res.status(200);
      res.json(createResultInfo("FAIL", null, false, "账号已存在"));
    } else {
      // 账号不存在，插入数据
      const sql = `insert into user(account,password,email,sex)values(?,?,?,?)`;
      const _res = await controller.query(sql, [account, password, email, sex]);
      if (!_res.length) {
        res.status(200);
        res.json({
          resultCode: "SUCCESS",
          resultInfo: null,
          success: true,
          errorMsg: "",
        });
      }
    }
  });

  app.post("/api/v1/signin", async (req, res) => {
    const { account = "", password = "" } = req.body;
    const sql = `select password from user where account=${account}`;
    const _res = (await controller.query(sql, [])) || [];
    res.status(200);
    if (_res.length === 0) {
      // 找不到账号
      res.json(createResultInfo("FAIL", null, false, "账号不存在"));
    } else {
      const { password: _password } = _res[0];
      if (_password !== password) {
        // 密码错误
        res.json(createResultInfo("FAIL", null, false, "账号或密码错误"));
      } else {
        res.json(createResultInfo("SUCCESS", null, true, ""));
      }
    }
  });
};
