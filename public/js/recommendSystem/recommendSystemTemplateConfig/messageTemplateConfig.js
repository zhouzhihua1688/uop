new Vue({
    el: '#content',
    data: {
        //主页面相关数据
        //查询
        remark: '',
        tableData: [],
        pagePreviewImgurl:'',

        userId: '',
        diaMsg: '',
        previewPath: '',
        loadingStatus: '数据获取中...',
        updateId: '',
        deleteId: '',
        isUpdate: false,
        loadingShow: false,
        //dialog新增修改数据
        diamsgConfigId: "",
        dialeavemsgId: "",
        dialeavemsgJumpurl: "",
        diapreviewTemid: "",
        diaremark: "",

        channelId: "",
        elementCollection: '',
        viewList: [],
        channelMenu: [],
        elementCollectionData: [],
        elementShow: {
            diamsgConfigId: true,
            dialeavemsgId: true,
            dialeavemsgJumpurl: true,
            diapreviewTemid: true,
            diaremark: true
        },
        searchChannelId:'',
        //主表格分页数据
        currentIndex: 0,
        maxSpace: 5,
        totalPage: 0,
        pageMaxNum: 10
    },
    computed: {
        pageList: function () {
            var arr = [];
            if (this.totalPage <= 2 * this.maxSpace) {
                for (var i = 0; i < this.totalPage; i++) {
                    arr.push(i + 1);
                }
                return arr;
            }
            if (this.currentIndex > this.maxSpace && this.totalPage - this.currentIndex > this.maxSpace) {
                for (var i = this.currentIndex - this.maxSpace; i < this.currentIndex + this.maxSpace; i++) {
                    arr.push(i + 1);
                }
            } else if (this.currentIndex <= this.maxSpace && this.totalPage - this.currentIndex > this.maxSpace) {
                for (var i = 0; i < this.currentIndex + (2 * this.maxSpace - this.currentIndex); i++) {
                    arr.push(i + 1);
                }
            } else if (this.currentIndex > this.maxSpace && this.totalPage - this.currentIndex <= this.maxSpace) {
                var space = this.totalPage - this.currentIndex;
                for (var i = this.currentIndex - (2 * this.maxSpace - space); i < this.totalPage; i++) {
                    arr.push(i + 1);
                }
            } else {
                for (var i = 0; i < this.totalPage; i++) {
                    arr.push(i + 1);
                }
            }
            return arr;
        },
        checkAll: function () {
            if (this.tableData.length == 0) {
                return false;
            }
            for (var i = 0; i < this.tableData.length; i++) {
                if (!this.tableData[i].check) {
                    return false;
                }
            }
            return true;
        }
    },
    watch: {
        pageMaxNum: function () {
            this.getTableData(0);
        },
        elementCollection: {
            handler: function (val, oldval) {
                var _this = this;
                if (val) {
                    this.getViewData(val);
                } else {
                    for (var ele in this.elementShow) {
                        this.elementShow[ele] = true;
                    }
                }
            }
        }
    },
    mounted: function () {
        var _this = this;
        var dialogs = ['info', 'rejectCheck', 'delete1'];
        dialogs.forEach(function (id) {
            $('#' + id).on('shown.bs.modal', function () {
                var $this = $(this);
                var dialog = $this.find('.modal-dialog');
                var top = ($(window).height() - dialog.height()) / 2;
                dialog.css({
                    marginTop: top
                });
            });
        });
        // 获取视图列表
        this.getViewData();
        var objconfigId = this.getUrlParam('objconfigId');
        if (objconfigId) {
            this.getOneDetail(objconfigId)
        } else {
            this.getTableData(0);
        }
        if(this.getUrlParam('openNewDialog')){
            this.showAdd();
        }
    },
    methods: {
         // 根据传来的objconfigId 查找该条数据
        getOneDetail: function (objconfigId) {
            var params = {};
            var _this = this;
            params.pageNo = 1;
            params.pageSize = this.pageMaxNum;
            params.msgConfigId = objconfigId;
            // params.channelId=this.searchChannelId;
            // console.log(params);
            _this.loadingStatus = '数据获取中...';
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/messageTemplateConfig/queryInfo.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        if (result.data.rows && result.data.rows.length > 0) {
                            _this.userId = result.data.userId;
                            _this.tableData = result.data.rows;
                            _this.currentIndex = result.data.pageNum - 1;
                            _this.totalPage = result.data.pages;
														
                            if (result.data.rows.length > 0) {
                                _this.showUpdate(result.data.rows[0]);
                            }
                        } else {
                            _this.tableData = [];
                            _this.currentIndex = 0;
                            _this.totalPage = 0;
                            _this.loadingStatus = '没有数据';
                        }
												if (result.data.channelList) {
													_this.channelMenu = result.data.channelList;
													_this.searchChannelId = _this.channelMenu[0].channelId;
												}
                    } else {
                        _this.tableData = [];
                        _this.currentIndex = 0;
                        _this.totalPage = 0;
                        _this.showDialog('', 'info', false, result.msg);
                        _this.loadingStatus = '没有数据';
                    }
                }
            });
        },
        // 获取视图列表
        getViewData: function (val, once) {
            var _this = this;
            var params = {};
            var str = '';
            params.pageNo = 1;
            params.pageSize = 9999;
            params.contentTp = 'leavemsg';
            val && (params.temId = val);
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/messageTemplateConfig/viewList.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        if (result.data.rows.length > 0) {
                            !val && (_this.viewList = result.data.rows);
                            if (val) {
                                if(result.data.rows&&result.data.rows.length>1){
                                    var obj=result.data.rows.filter(function(item){
                                        return item.temId==val;
                                    })[0];
                                    _this.pagePreviewImgurl=obj.previewImgurl;
                                    if(obj.elementCollection){
                                        _this.elementCollectionData = obj.elementCollection.toString().split(',')
                                    }else{
                                        for (var items in _this.elementShow) {
                                            _this.elementShow[items] = true;
                                        }
                                        return;
                                    }
                                }else{
                                    _this.pagePreviewImgurl = result.data.rows[0].previewImgurl;
                                    if(result.data.rows[0].elementCollection){
                                        _this.elementCollectionData = result.data.rows[0].elementCollection.toString().split(',');
                                    }else{
                                        for (var item in _this.elementShow) {
                                            _this.elementShow[item] = true;
                                        }
                                        return;
                                    }
                                }
                            }else{
                                for (var item in _this.elementShow) {
                                    _this.elementShow[item] = true;
                                }
                                return;
                            }
                            for (var ele in _this.elementShow) {
                                if (_this.elementCollectionData.map(function (item) {
                                    return 'dia' + item;
                                }).indexOf(ele) > -1) {
                                    _this.elementShow[ele] = true;
                                }
                                else {
                                    _this.elementShow[ele] = false;
                                }
                            }
                        } else {
                            if (once) {
                                _this.showDialog('add', 'info', true, '视图列表暂无数据');
                            } else {
                                _this.showDialog('', 'info', false, '视图列表暂无数据');
                            }
                        }
                    } else {
                        if (once) {
                            _this.showDialog('add', 'info', true, result.msg);
                        } else {
                            _this.showDialog('', 'info', false, result.msg);
                        }
                    }
                }
            });
        },
        //list
        getTableData: function (currentIndex) {
            var params = {};
            var _this = this;
            params.pageNo = currentIndex + 1;
            params.pageSize = this.pageMaxNum;
            params.remark = this.remark;
            params.channelId=this.searchChannelId;
            // console.log(params);
            _this.loadingStatus = '数据获取中...';
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/messageTemplateConfig/queryInfo.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        if (result.data.rows && result.data.rows.length > 0) {
                            _this.userId = result.data.userId;
                            _this.tableData = result.data.rows;
                            _this.currentIndex = result.data.pageNum - 1;
                            _this.totalPage = result.data.pages;
														
                        } else {
                            _this.tableData = [];
                            _this.currentIndex = 0;
                            _this.totalPage = 0;
                            _this.loadingStatus = '没有数据';
                        }
												if (result.data.channelList) {
													_this.channelMenu = result.data.channelList;
													_this.searchChannelId = _this.channelMenu[0].channelId;
												}
                    } else {
                        _this.tableData = [];
                        _this.currentIndex = 0;
                        _this.totalPage = 0;
                        _this.showDialog('', 'info', false, result.msg);
                        _this.loadingStatus = '没有数据';
                    }
                }
            });
        },
        //新增活动配置
        setAddData: function (obj) {
            this.diamsgConfigId = obj.msgConfigId ? obj.msgConfigId : '';
            this.dialeavemsgId = obj.leavemsgId ? obj.leavemsgId : '';
            this.dialeavemsgJumpurl = obj.leavemsgJumpurl ? obj.leavemsgJumpurl : '';
            this.diaremark = obj.remark ? obj.remark : '';
            this.channelId = obj.channelId ? obj.channelId : '';
            this.elementCollection = obj.previewTemid ? obj.previewTemid : '';
        },
        showAdd: function () {
            this.elementCollection = '';
            this.pagePreviewImgurl = '';
            this.isUpdate = false;
            this.updateId = '';
            this.setAddData({
                isDelete: '0'
            });
            this.showDialog('', 'add');
            $("#previewImg").show();
        },
        showUpdate: function (item) {
            if (item.previewTemid) {
                this.getViewData(item.previewTemid, true);
            } else {
                for (var ele in this.elementShow) {
                    this.elementShow[ele] = true;
                }
            }
            this.pagePreviewImgurl = '';
            this.isUpdate = true;
            this.updateId = item.msgConfigId;
            this.setAddData(item);
            this.showDialog('', 'add');
            $("#previewImg").show();
        },
        add: function () {
            if (this.channelId == '') {
                this.showDialog('add', 'info', true, '渠道必须选择！');
                return false;
            }
            if (this.elementCollection == '') {
                this.showDialog('add', 'info', true, '模板必须选择！');
                return false;
            }
            var _this = this;
            var params = {};
            params.msgConfigId = this.diamsgConfigId;
            params.leavemsgId = this.dialeavemsgId;
            params.leavemsgJumpurl = this.dialeavemsgJumpurl;
            params.remark = this.diaremark;
            params.isDelete = 0;
            params.channelId = this.channelId;
            params.previewTemid = this.elementCollection;
            this.isUpdate && (params.msgConfigId = this.updateId);
            this.isUpdate && (params.modifyBy = this.userId);
            !this.isUpdate && (params.createBy = this.userId);
            var url = '/recommendSystem/recommendSystemTemplateConfig/messageTemplateConfig/';
            url += this.isUpdate ? 'update.ajax' : 'add.ajax';
            $.post({
                url: url,
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        _this.getTableData(0);
                    }
                    $("#previewImg").hide();
                    _this.showDialog('add', 'info', false, result.msg);
                }
            });

        },
        hideImg: function () {
            $("#previewImg").hide();
        },
        //删除
        deleteParams: function (item) {
            this.deleteId = item.msgConfigId;
            this.showDialog('', 'delete1', false);
        },
        deleteConfirm: function () {
            var _this = this;
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/messageTemplateConfig/delete.ajax',
                data: {
                    msgConfigId: this.deleteId
                },
                success: function (result) {
                    if (result.error === 0) {
                        _this.showDialog('', 'info', false, '操作成功');
                        _this.getTableData(_this.currentIndex);
                    } else {
                        _this.showDialog('', 'info', false, result.msg);
                    }
                }
            })
        },
        fresh: function () {
            var _this = this;
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/messageTemplateConfig/fresh.ajax',
                success: function (result) {
                    if (result.error === 0) {
                        _this.showDialog('', 'info', false, '操作成功');
                    } else {
                        _this.showDialog('', 'info', false, result.msg);
                    }
                }
            })
        },
        configMgmt:function(){
            var hasCheck = false;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].check) {
                    hasCheck = true;
                    break;
                }
            }
            if (!hasCheck) {
                this.showDialog('', 'info', false, '未选择任何资源');
                return;
            }
            var ids = [];
            var channelIds=[];
            for (var j = 0; j < this.tableData.length; j++) {
                if (this.tableData[j].check) {
                    this.tableData[j].objconfigId=this.tableData[j].msgConfigId;
                    this.tableData[j].startTime='';
                    this.tableData[j].endTime='';
                    this.tableData[j].modifyTime='';
                    this.tableData[j].typeKey='leavemsg';
                    this.tableData[j].position='';
                    this.tableData[j].dataType='local';
                    this.tableData[j].modifyBy=this.userId;
                    ids.push(this.tableData[j]);
                    channelIds.push(this.tableData[j].channelId)
                }
            }
            // console.log(channelIds);
            for(var m = 0; m < channelIds.length-1; m++){
                for(var n = 0; n < channelIds.length-1-m; n++){
                    if(!(channelIds[n]==channelIds[n+1])){
                        this.showDialog('','info',false,'请选择相同渠道的数据进行配置！')
                        return;
                    }
                }
            }
            if(!window.localStorage){
                this.showDialog('','info',false,'您的浏览器不支持该功能，请下载最新的谷歌浏览器！')
                return false;
            }else{
                var storage=window.localStorage;
                var url="/recommendSystem/recommendSystemConfigMgmt/positionTheThemeMgmt.html?pageType=Modify&contentTp=leavemsg&channelId="+channelIds[0]
                storage.setItem("leavemsg",JSON.stringify(ids));
                window.open(url);
            }
            
        },
        configThis:function(item){
            var ids = [];
            var channelIds=item.channelId;
            var obj={
                objconfigId:item.msgConfigId,
                startTime:'',
                endTime:'',
                modifyTime:'',
                typeKey:'leavemsg',
                position:'',
                dataType:'local',
                modifyBy:this.userId
            }
            ids.push(Object.assign(item,obj));
            if(!window.localStorage){
                this.showDialog('','info',false,'您的浏览器不支持该功能，请下载最新的谷歌浏览器！')
                return false;
            }else{
                var storage=window.localStorage;
                var url="/recommendSystem/recommendSystemConfigMgmt/positionTheThemeMgmt.html?pageType=Modify&contentTp=leavemsg&channelId="+channelIds+'&objconfigId='+ids[0].objconfigId;
                storage.setItem("leavemsg",JSON.stringify(ids));
                window.open(url);
            }
        },
        //主表格分页方法
        check: function (item) {
            item.check = !item.check;
        },
        allCheck: function () {
            
            var _this = this;
            var flag = this.checkAll;
            this.tableData.forEach(function (item) {
                item.check = !flag;
            });
        },
        prev: function () {
            if (this.currentIndex <= 0) {
                return;
            }
            this.getTableData(this.currentIndex - 1);
        },
        next: function () {
            if (this.currentIndex >= this.totalPage - 1) {
                return;
            }
            this.getTableData(this.currentIndex + 1);
        },
        changeIndex: function (index) {
            this.getTableData(index - 1);
        },
        toFirst: function () {
            this.getTableData(0);
        },
        toLast: function () {
            this.getTableData(this.totalPage - 1);
        },
        //公共方法
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return '';
        },
        showDialog: function (dia1, dia2, callback, msg) {
            if (msg) {
                this.diaMsg = msg;
            } else {
                msg = '输入条件错误';
            }
            if (!dia1) {
                $('#' + dia2).modal('show');
            } else if (!dia2) {
                $('#' + dia1).modal('hide');
            } else if (!callback) {
                $('#' + dia1).on("hidden.bs.modal", function () {
                    $('#' + dia2).modal('show');
                    $('#' + dia1).off().on("hidden", "hidden.bs.modal");
                });
                $('#' + dia1).modal('hide');
            } else {
                $('#' + dia1).on("hidden.bs.modal", function () {
                    $('#' + dia2).on("hidden.bs.modal", function () {
                        $('#' + dia1).modal("show");
                        $('#' + dia2).off().on("hidden", "hidden.bs.modal");
                    });
                    $('#' + dia2).modal("show");
                    $('#' + dia1).off().on("hidden", "hidden.bs.modal");
                });
                $('#' + dia1).modal('hide');
            }
        },
        inSelected: function (item, arr, prop) {
            var _index = -1;
            arr.forEach(function (value, index) {
                if (item[prop] == value[prop]) {
                    _index = index;
                }
            });
            return _index;
        },
        formatTime: function (timestamp) {
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y + M + D + h + m + s;
        },
        overflowHide: function (val) {
            var str = val.toString();
            if (str.length > 30) {
                str = str.substring(0, 30) + '...'
            }
            return str;
        },
        // yes or no
        whetherDelete: function (val) {
            if (val) {
                if (val == '0') {
                    return '否';
                } else {
                    return '是';
                }
            } else {
                return '-';
            }
        },
        stringTimeFat: function (val) {
            if (val) {
                return val 
                // return val.replace(/['.']/g, ':')
            } else {
                return '-'
            }
        },
        channelNameForId: function (val) {
            var str = '';
            if (val) {
                this.channelMenu.forEach(function (item) {
                    if (val == item.channelId) {
                        str = item.channelName;
                    }
                })
            } else {
                str = '-'
            }
            return str;
        }
    }
});