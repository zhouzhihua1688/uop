const request = require('../../../local_data/requestWrapper');
const apiUrlList = require('../apiConfig').addRichRemindMgmt;
const baseUrl = '/contentMgmt/addRichRemind/addRichRemindMgmt';
module.exports = function (app) {
    // 获取初始数据和查询
    app.post(`${baseUrl}/getTableData.ajax`, (req, res, next) => {
        let params = req.body;
        let option = {
            pageUrl: `${baseUrl}/getTableData.ajax`,
            req,
            url: apiUrlList.uniformInterface,
            qs: params,
            timeout: 15000,
            json: true
        };
        request(option, (error, response, body) => {
            if (error) {
                return res.send({
                    error: 1,
                    msg: '查询失败'
                });
            }
            let result = typeof body === 'string' ? JSON.parse(body) : body;
            console.log("body==", body);
            console.log("result==", result);
            if (result && result.returnCode === 0) {
                return res.send({
                    error: 0,
                    msg: '查询成功',
                    data: result.body
                });
            } else if (result && result.returnCode != 9999) {
                return res.send({
                    error: 1,
                    msg: result.returnMsg
                });
            } else {
                return res.send({
                    error: 1,
                    msg: '查询失败'
                });
            }
        });
    });
    // 新增
    app.post(`${baseUrl}/add.ajax`, (req, res, next) => {
        let params = req.body;
        let option = {
            pageUrl: `${baseUrl}/add.ajax`,
            req: req,
            operateType: 1, // operateType:操作类型 0:登录 1:新增 2:修改 3:删除 4:修改密码
            url: apiUrlList.uniformInterface,
            body: params,
            timeout: 15000,
            json: true
        };
        request.post(option, (error, response, body) => {
            if (error) {
                return res.send({
                    error: 1,
                    msg: '保存失败',
                    data: null
                });
            }
            if (body.returnCode === 0) {
                res.send({
                    error: 0,
                    msg: '保存成功',
                    data: null
                });
            } else if (body && body.returnCode != 9999) {
                res.send({
                    error: 1,
                    msg: body.returnMsg,
                    data: null
                });
            } else {
                res.send({
                    error: 1,
                    msg: '保存失败',
                    data: null
                });
            }
        });
    });
    // 修改
    app.post(`${baseUrl}/update.ajax`, (req, res, next) => {
        let params = req.body;
				let serialNo = params.serialNo;
        let option = {
            pageUrl: `${baseUrl}/update.ajax`,
            req: req,
            operateType: 2, // operateType:操作类型 0:登录 1:新增 2:修改 3:删除 4:修改密码
            url: apiUrlList.uniformInterface2+'/'+serialNo,
            body: params,
            timeout: 15000,
            json: true
        };
        request.put(option, (error, response, body) => {
            if (error) {
                return res.send({
                    error: 1,
                    msg: '修改失败',
                    data: null
                });
            }
            if (body.returnCode === 0) {
                res.send({
                    error: 0,
                    msg: '修改成功',
                    data: null
                });
            } else if (body && body.returnCode != 9999) {
                res.send({
                    error: 1,
                    msg: body.returnMsg,
                    data: null
                });
            } else {
                res.send({
                    error: 1,
                    msg: '修改失败',
                    data: null
                });
            }
        });
    });
    // 删除
    app.post(`${baseUrl}/del.ajax`, (req, res, next) => {
				let serialNo = req.body.serialno;
        let option = {
            pageUrl: `${baseUrl}/del.ajax`,
            req,
            operateType: 3, // operateType:操作类型 0:登录 1:新增 2:修改 3:删除 4:修改密码
            url: apiUrlList.uniformInterface2+'/'+serialNo,
            timeout: 15000,
            json: true
        };
        request.delete(option, (error, response, body) => {
            if (error) {
                return res.send({
                    error: 1,
                    msg: '删除失败',
                    data: null
                });
            }
            let result = typeof body === 'string' ? JSON.parse(body) : body;
            if (result && result.returnCode === 0) {
                return res.send({
                    error: 0,
                    msg: '删除成功',
                    data: null
                });
            } else if (result && result.returnCode != 9999) {
                return res.send({
                    error: 1,
                    msg: result.returnMsg
                });
            } else {
                return res.send({
                    error: 1,
                    msg: '删除失败',
                    data: null
                });
            }
        });
    });
		app.post(`${baseUrl}/getbranchList.ajax`, (req, res, next) => {
			let option = {
				pageUrl: `${baseUrl}/getbranchList.ajax`,
				req,
				url: apiUrlList.branchList,
				qs: {
					group: "tfyj"
				},
				timeout: 15000,
				json: true
			};
			request(option, (error, response, body) => {
				if (error) {
					return res.send({
						error: 1,
						msg: '查询失败'
					});
				}
				let result = typeof body === 'string' ? JSON.parse(body) : body;
				if (result && result.returnCode === 0) {
					return res.send({
						error: 0,
						msg: '查询成功',
						data: result.body
					});
				} else if (result && result.returnCode != 9999) {
					return res.send({
						error: 1,
						msg: result.returnMsg
					});
				} else {
					return res.send({
						error: 1,
						msg: '查询失败'
					});
				}
			});
        });
        

   // 上架的状态-开关
    app.post(`${baseUrl}/switchUpdate.ajax`, (req, res, next) => {
        let params = {};
        // params.id = req.body.id;
        params.shelfStatus = req.body.shelfStatus;
        let option = {
            pageUrl: `${baseUrl}/switchUpdate.ajax`,
            req,
            url: apiUrlList.switchUpdate+'/'+req.body.serialno,
            qs: params,
            timeout: 15000,
            json: true
        };
        request.put(option, (error, response, body) => {
            if (error) {
                return res.send({
                    error: 1,
                    msg: '操作失败'
                });
            }
            let result = typeof body === 'string' ? JSON.parse(body) : body;
            console.log("body==", body);
            console.log("result==", result);
            if (result && result.returnCode === 0) {
                return res.send({
                    error: 0,
                    msg: '操作成功',
                    data: body
                });
            } else if (result && result.returnCode != 9999) {
                return res.send({
                    error: 1,
                    msg: result.returnMsg
                });
            } else {
                return res.send({
                    error: 1,
                    msg: '操作失败'
                });
            }
        });
    });     
}