new Vue({
    el: '#content',
    data: {
        //主页面相关数据
        fundGroupId: '',
        fundGroupTp: '',
        tableData: [],
        viewList: [],
        channelMenu: [],
        pagePreviewImgurl:'',

        userId: '',
        diaMsg: '',
        previewPath: '',
        loadingStatus: '数据获取中...',
        updateId: '',
        deleteId: '',
        isUpdate: false,
        uploadSuccessed1: false,
        uploadSuccessed2: false,
        loadingShow: false,
        //dialog新增修改数据
        diabuttonRemark: "",
        diaelementValFrom: "0",
        diafundGroupId: "",
        diafundGroupSubtitle: "",
        diafundGroupSubtitle1: "",
        diafundGroupTitle: "",
        diafundGroupTp: "01",
        diamodifyBy: "",
        diaopenTp: "0",
        diaimageCacheFlag: "0",
        diarecomElementNm: "",
        diarecomElementRemark: "",
        diarecomElementUnit: "",
        diarecomElementVal: "",
        diarecomIdentify: "",
        diariskRemark: "",
        diaremark: "",
        diathreshold: "",
        diathresholdUnit: "",
        diaurl: "",
        channelId: "",
        elementCollection: '',


        elementCollectionData: [],
        elementShow: {
            diabuttonRemark: true,
            diaimageCacheFlag: true,
            diaelementValFrom: true,
            diafundGroupId: true,
            diafundGroupSubtitle: true,
            diafundGroupSubtitle1: true,
            diafundGroupTitle: true,
            diafundGroupTp: true,
            diamodifyBy: true,
            diaopenTp: true,
            diarecomElementNm: true,
            diarecomElementRemark: true,
            diarecomElementUnit: true,
            diarecomElementVal: true,
            diarecomIdentify: true,
            diariskRemark: true,
            diaremark: true,
            diathreshold: true,
            diathresholdUnit: true,
            diaurl: true,
            diaimageUrl: true,
            diaprofitAreaImgUrl: true
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
        $('#uploadBtn1').click(function () {
            $('#uploadFileInput1').click();
        });
        $('#uploadBtn2').click(function () {
            $('#uploadFileInput2').click();
        });
        // 获取视图列表
        this.getViewData();
        // $('#add').on('show.bs.modal', function () {
        //     $("#previewImg").show();
        // })
        // $('#add').on('hide.bs.modal', function () {
        //     $("#previewImg").hide();
        //   })
        var objconfigId = this.getUrlParam('objconfigId');
        if (objconfigId) {
            this.getOneDetail(objconfigId)
        }else{
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
            params.fundGroupConfigId = objconfigId;
            // params.channelId=this.searchChannelId;
            // console.log(params);
            _this.loadingStatus = '数据获取中...';
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/queryInfo.ajax',
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
												if(result.data.channelList){
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
        getViewData: function (val,once) {
            var _this = this;
            var params = {};
            var str = '';
            params.pageNo = 1;
            params.pageSize = 9999;
            params.contentTp = 'fundgroup';
            val && (params.temId = val);
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/viewList.ajax',
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
        //头像审核list
        getTableData: function (currentIndex) {
            var params = {};
            var _this = this;
            params.pageNo = currentIndex + 1;
            params.pageSize = this.pageMaxNum;
            params.fundGroupId = this.fundGroupId;
            params.fundGroupTp = this.fundGroupTp;
            params.channelId=this.searchChannelId;
            // console.log(params);
            _this.loadingStatus = '数据获取中...';
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/queryInfo.ajax',
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
												if(result.data.channelList){
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
            this.diabuttonRemark = obj.buttonRemark ? obj.buttonRemark : '';
            this.diaimageCacheFlag = obj.imageCacheFlag ? obj.imageCacheFlag : '0';
            this.diaelementValFrom = obj.elementValFrom ? obj.elementValFrom : '';
            this.diafundGroupId = obj.fundGroupId ? obj.fundGroupId : '';
            this.diafundGroupSubtitle = obj.fundGroupSubtitle ? obj.fundGroupSubtitle : '';
            this.diafundGroupSubtitle1 = obj.fundGroupSubtitle1 ? obj.fundGroupSubtitle1 : '';
            this.diafundGroupTitle = obj.fundGroupTitle ? obj.fundGroupTitle : '';
            this.diafundGroupTp = obj.fundGroupTp ? obj.fundGroupTp : '';
            this.diamodifyBy = this.userId ? this.userId : '';
            this.diaopenTp = obj.openTp ? obj.openTp : '';
            this.diarecomElementNm = obj.recomElementNm ? obj.recomElementNm : '';
            this.diarecomElementRemark = obj.recomElementRemark ? obj.recomElementRemark : '';
            this.diarecomElementUnit = obj.recomElementUnit ? obj.recomElementUnit : '';
            this.diarecomElementVal = obj.recomElementVal ? obj.recomElementVal : '';
            this.diarecomIdentify = obj.recomIdentify ? obj.recomIdentify : '';
            this.diariskRemark = obj.riskRemark ? obj.riskRemark : '';
            this.diaremark = obj.remark ? obj.remark : '';
            this.diathreshold = obj.threshold ? obj.threshold : '';
            this.diathresholdUnit = obj.thresholdUnit ? obj.thresholdUnit : '';
            this.diaurl = obj.url ? obj.url : '';
            this.channelId = obj.channelId ? obj.channelId : '';
            this.elementCollection = obj.previewTemid ? obj.previewTemid : '';
            $('#uploadInput1').val(obj.imageUrl ? obj.imageUrl : '');
            $('#uploadInput2').val(obj.profitAreaImgUrl ? obj.profitAreaImgUrl : '');
        },
        showAdd: function () {
            this.isUpdate = false;
            this.uploadSuccessed1 = false;
            this.uploadSuccessed2 = false;
            this.updateId = '';
            this.elementCollection = '';
            this.pagePreviewImgurl ='';
            var _this = this;
            $('#uploadFileInput1').on('change', function () {
                _this.uploadSuccessed1 = false;
                $('#uploadInput1').val($(this).val());
            });
            $('#uploadFileInput2').on('change', function () {
                _this.uploadSuccessed2 = false;
                $('#uploadInput2').val($(this).val());
            });
            this.setAddData({elementValFrom: '0', fundGroupTp: '01', openTp: '0'});
            this.showDialog('', 'add');
            $("#previewImg").show();
        },
        showUpdate: function (item) {
            this.pagePreviewImgurl ='';
            if (item.previewTemid) {
                this.getViewData(item.previewTemid,true);
            } else {
                for (var ele in this.elementShow) {
                    this.elementShow[ele] = true;
                }
            }
            this.isUpdate = true;
            this.updateId = item.fundGroupConfigId;
            this.uploadSuccessed1 = true;
            this.uploadSuccessed2 = true;
            var _this = this;
            $('#uploadFileInput1').on('change', function () {
                _this.uploadSuccessed1 = false;
                $('#uploadInput1').val($(this).val());
            });
            $('#uploadFileInput2').on('change', function () {
                _this.uploadSuccessed2 = false;
                $('#uploadInput2').val($(this).val());
            });
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
            // if($("#uploadInput1").val()&&$("#uploadInput1").val().indexOf('/res/')==-1 && $("#uploadInput1").val().indexOf('/mss/')==-1){
            //     this.showDialog('add', 'info', true, '图片选择后请上传！');
            //     return false;
            // }

            // if($("#uploadInput2").val()&&$("#uploadInput2").val().indexOf('/res/')==-1){
            //     this.showDialog('add', 'info', true, '图片选择后请上传！');
            //     return false;
            // }
            var _this = this;
            var params = {};
            params.buttonRemark = this.diabuttonRemark;
			params.imageCacheFlag = this.diaimageCacheFlag;
            params.elementValFrom = this.diaelementValFrom;
            params.fundGroupId = this.diafundGroupId;
            params.fundGroupSubtitle = this.diafundGroupSubtitle;
            params.fundGroupSubtitle1 = this.diafundGroupSubtitle1;
            params.fundGroupTitle = this.diafundGroupTitle;
            params.fundGroupTp = this.diafundGroupTp;
            params.modifyBy = this.diamodifyBy;
            params.openTp = this.diaopenTp;
            params.recomElementNm = this.diarecomElementNm;
            params.recomElementRemark = this.diarecomElementRemark;
            params.recomElementUnit = this.diarecomElementUnit;
            params.recomElementVal = this.diarecomElementVal;
            params.recomIdentify = this.diarecomIdentify;
            params.riskRemark = this.diariskRemark;
            params.remark = this.diaremark;
            params.threshold = this.diathreshold;
            params.thresholdUnit = this.diathresholdUnit;
            params.url = this.diaurl;
            params.imageUrl = $('#uploadInput1').val();
            params.profitAreaImgUrl = $('#uploadInput2').val();
            params.channelId = this.channelId;
            params.previewTemid = this.elementCollection;
            this.isUpdate && (params.fundGroupConfigId = this.updateId);
            var url = '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/';
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
        hideImg:function(){
            $("#previewImg").hide();
        },
        // 上传图片1
        uploadPic1: function () {
            if (!$('#uploadInput1').val()) {
                this.showDialog('add', 'info', true, '未选择要上传的图片');
                return;
            }
            if (!/.+(\.gif|\.jpeg|\.png|\.jpg|\.bmp)$/.test($('#uploadInput1').val())) {
                this.showDialog('add', 'info', true, '文件格式错误');
                return;
            }
            this.loadingShow = true;
            this.uploadSuccessed1 = false;
            var _this = this;
            $.ajaxFileUpload({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/upload1.ajax',
                type: 'POST',
                dataType: 'json',
                fileElementId: 'uploadFileInput1',
                success: function (result) {
                    _this.loadingShow = false;
                    if (result.error === 0) {
                        _this.uploadSuccessed1 = true;
                        $('#uploadInput1').val(result.data);
                        _this.showDialog('', 'add');
                    }
                    else {
                        _this.showDialog('add', 'info', true, result.msg);
                    }
                }
            });

        },
        // 上传图片2
        uploadPic2: function () {
            if (!$('#uploadInput2').val()) {
                this.showDialog('add', 'info', true, '未选择要上传的图片');
                return;
            }
            if (!/.+(\.gif|\.jpeg|\.png|\.jpg|\.bmp)$/.test($('#uploadInput2').val())) {
                this.showDialog('add', 'info', true, '文件格式错误');
                return;
            }
            this.loadingShow = true;
            this.uploadSuccessed2 = false;
            var _this = this;
            $.ajaxFileUpload({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/upload2.ajax',
                type: 'POST',
                dataType: 'json',
                fileElementId: 'uploadFileInput2',
                success: function (result) {
                    _this.loadingShow = false;
                    if (result.error === 0) {
                        _this.uploadSuccessed2 = true;
                        $('#uploadInput2').val(result.data);
                        _this.showDialog('', 'add');
                    }
                    else {
                        _this.showDialog('add', 'info', true, result.msg);
                    }
                }
            });

        },

        //启用或禁用
        enableOrDisable: function (item) {
            var _this = this;
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/enable.ajax',
                data: {fundGroupConfigId: item.fundGroupConfigId},
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
        //删除
        deleteParams: function (item) {
            this.deleteId = item.fundGroupConfigId;
            this.showDialog('', 'delete1', false);
        },
        deleteConfirm: function () {
            var _this = this;
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/delete.ajax',
                data: {fundGroupConfigId: _this.deleteId},
                success: function (result) {
                    if (result.error === 0) {
                        _this.showDialog('', 'info', false, '操作成功');
                        _this.getTableData(0);
                    } else {
                        _this.showDialog('', 'info', false, result.msg);
                    }
                }
            })
        },
        fresh: function () {
            var _this = this;
            $.post({
                url: '/recommendSystem/recommendSystemTemplateConfig/combineContentConfig/fresh.ajax',
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
                    this.tableData[j].objconfigId=this.tableData[j].fundGroupConfigId;
                    this.tableData[j].startTime='';
                    this.tableData[j].endTime='';
                    this.tableData[j].modifyTime='';
                    this.tableData[j].typeKey='fundgroup';
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
                var url="/recommendSystem/recommendSystemConfigMgmt/positionTheThemeMgmt.html?pageType=Modify&contentTp=fundgroup&channelId="+channelIds[0]
                storage.setItem("fundgroup",JSON.stringify(ids));
                window.open(url);
            }
            
        },
        configThis:function(item){
            var ids = [];
            var channelIds=item.channelId;
            var obj={
                objconfigId:item.fundGroupConfigId,
                startTime:'',
                endTime:'',
                modifyTime:'',
                typeKey:'fundgroup',
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
                var url="/recommendSystem/recommendSystemConfigMgmt/positionTheThemeMgmt.html?pageType=Modify&contentTp=fundgroup&channelId="+channelIds+'&objconfigId='+ids[0].objconfigId;
                storage.setItem("fundgroup",JSON.stringify(ids));
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
            }
            else {
                msg = '输入条件错误';
            }
            if (!dia1) {
                $('#' + dia2).modal('show');
            }
            else if (!dia2) {
                $('#' + dia1).modal('hide');
            }
            else if (!callback) {
                $('#' + dia1).on("hidden.bs.modal", function () {
                    $('#' + dia2).modal('show');
                    $('#' + dia1).off().on("hidden", "hidden.bs.modal");
                });
                $('#' + dia1).modal('hide');
            }
            else {
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
            if (str.length > 10) {
                str = str.substring(0, 10) + '...'
            }
            return str;
        },
        stringTimeFat: function (val) {
            if (val) {
                if (val.length > 8) {
                    return val.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6')
                } else {
                    return val.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
                }
            } else {
                return '-'
            }
        },
        openTyString: function (val) {
            if (val) {
                switch (val) {
                    case '0':
                        val = '开放申赎';
                        break;
                    case '2':
                        val = '暂停定投';
                        break;
                    case '4':
                        val = '暂停交易';
                        break;
                    case '5':
                        val = '暂停申购';
                        break;
                    case '6':
                        val = '暂停赎回';
                        break;
                    case '7':
                        val = '募集中';
                        break;
                    case '9':
                        val = '封闭期';
                        break;
                    default:
                        val = '-';
                }
            } else {
                val = '-'
            }
            return val;
        },
        channelNameForId:function (val) {
            var str='';
            if(val){
                this.channelMenu.forEach(function (item) {
                    if(val==item.channelId){
                        str=item.channelName;
                    }
                })
            }else{
                str='-'
            }
            return str;
        }
    },
    filters:{
        fundGroupTpChinese:function(value){
            if(value=='01'){
                return '添富智投'
            }else if(value=='02'){
                return '添富养老'
            }else if(value=='03'){
                return '指数宝'
            }else if(value=='00'){
                return '基金'
            }
        }
    }
});