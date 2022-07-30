// 多个分页器的类
// class Page {
//     constructor(option) {
//         console.log(option)
//         for (let key in option) {
//             this[key] = option[key];
//         }
//         // this.currentIndex = 0;
//         // this.maxSpace = 5;
//         // this.totalPage =0;
//         // this.pageMaxNum = 10;
//     }
//
//     // method(fn, arg) {
//     //     fn(arg);
//     // }
// };
var vm = new Vue({
    el: '#content',
    data: function () {
        this.editor = null //富文本
        return {
            currentIndex: 0,
            maxSpace: 5,
            totalPage: 0,
            pageMaxNum: 10,
            // page1: new Page({
                startTime: '', //开始时间
                endTime: '', //结束时间
                isSeparate: {
                    value: 'N',
                    checked: false
                }, //y时段UA单独统计n时段UA不单独统计
                popupType: '', //弹窗类型
                module: '', //功能模块
                searchInfo: '', //搜索内容标题
                tableData: [],
                productData: [],
                // currentIndex: 0,
                // maxSpace: 5,
                // totalPage: 0,
                // pageMaxNum: 10,

                // method: function (currentIndex) {
                //     this.getTableData(currentIndex)
                // }.bind(this)
            // }),

            // page2: new Page({
                currentIndex2: 0,
                maxSpace2: 5,
                totalPage2: 0,
                pageMaxNum2: 10,
                diaArticleData:[], //选择文章弹窗数据
                // method: function (currentIndex) {
                //     this.getPvData(currentIndex,'')
                // }.bind(this)
            // }),
            modifyStatus: 1,
            diaMsg: '',
            // 查询的字段
            searchPopupType:'',
            searchModule:'',
            // 新增字段
            popupType:'1',
            module:'001',
            textId:'',
            mediaId:'',
            articleType:'',
            publishStatus:'',
            abstract:'',
            abstracts:'',
            offlineTime:'',
            addStatus:'N',  //发布状态的选择
            enableFlag:'0',//0-关闭，1-启用
            startTime: '', //开始时间-选择文章
            endTime: '', //结束时间-选择文章
            sourceType:'',//文章来源
            // searchInfo:'',//文章标题
            functionModule:'',//功能性模块
            title:'',//文章标题
            searchTitle:'',  //查询标题
            // searchTitle:'',//新增弹窗里的文章标题
            sourceMaterialType:'TEXT',//新增弹窗里的素材类型
            // 点击内容+内容弹窗字段
            materialId:'',
            searchMaterialTitle:'',  //现有材料标题查询
            secondMaterial:'',//二级分类目录
            threeMaterial:'', //三级分类目录
            materialList:[],
            categoryConfigList:[],
            threeMaterialIdList:[], 
            searchMaterialList:[],
            modifyBy:'',   //最近更新人
            updateTime:'',  //最近修改时间
            materialTitle:'', //材料标题
            
        }
    },
    mounted: function () {
        var dialogs = ['info', 'del', "selectAuthor"];
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
        // this.getTableData(0);
        $('.date-timepicker').datetimepicker({
            format: 'YYYY-MM-DD', //use this option to display seconds
            icons: {
                time: 'fa fa-clock-o',
                date: 'fa fa-calendar',
                up: 'fa fa-chevron-up',
                down: 'fa fa-chevron-down',
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-arrows ',
                clear: 'fa fa-trash',
                close: 'fa fa-times'
            }
        }).next().on(ace.click_event, function () {
            $(this).prev().focus();
        });

        this.getTableData(0);
        this.getTagAll();
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

        pageList2: function () {
            var arr = [];
            if (this.totalPage2 <= 2 * this.maxSpace2) {
                for (var i = 0; i < this.totalPage2; i++) {
                    arr.push(i + 1);
                }
                return arr;
            }
            if (this.currentIndex2 > this.maxSpace2 && this.totalPage2 - this.currentIndex2 > this.maxSpace2) {
                for (var i = this.currentIndex2 - this.maxSpace2; i < this.currentIndex2 + this.maxSpace2; i++) {
                    arr.push(i + 1);
                }
            } else if (this.currentIndex2 <= this.maxSpace2 && this.totalPage2 - this.currentIndex2 > this.maxSpace2) {
                for (var i = 0; i < this.currentIndex2 + (2 * this.maxSpace2 - this.currentIndex2); i++) {
                    arr.push(i + 1);
                }
            } else if (this.currentIndex2 > this.maxSpace2 && this.totalPage2 - this.currentIndex2 <= this.maxSpace2) {
                var space = this.totalPage2 - this.currentIndex2;
                for (var i = this.currentIndex2 - (2 * this.maxSpace2 - space); i < this.totalPage2; i++) {
                    arr.push(i + 1);
                }
            } else {
                for (var i = 0; i < this.totalPage2; i++) {
                    arr.push(i + 1);
                }
            }
            return arr;
        },
    },
    watch: {
        // 'page1.pageMaxNum': {
        //     handler: function () {
        //         this.getTableData(0);
        //     }
        // },
        //
        pageMaxNum: function () {
            this.getTableData(0);
        },

        pageMaxNum2: function () {
            // this.getPvData(0,'');
        }
    },
    methods: {
        moment: moment,
        // 获取内容弹窗一二级分类
        getTagAll:function(){
            // 获取一级二级分类
            var _this=this;
             $.post({
                 url:'/contentMgmt/serviceAndRemindMgmt/popupMgmt/getTagAll.ajax',
                 data:{
                     parentCategoryId:''
                 },
                 success: function (result) {
                     if (result.error === 0) {
                         console.log(result.data);
                         _this.materialList=result.data.allTagList;  //现有材料弹窗数据
                         // 新增弹窗和查询
                         _this.classifyList=result.data.investTag;  //拿到所有一级分类菜单数据
                         _this.secondClassifyId=result.data.teachTag.categoryId;  //获取二级分类ID
                         console.log(_this.secondClassifyId)
                         //拿到三级分类数据
                         _this.menuList=result.data.menuList.ncmsContentCategoryConfigList.map(function(item){
                             item.checked=true;  //设置全部为true,选中
                             return item;
                         });
                     }else {
                         _this.classifyList=[];
                         _this.menuList=[];
                         _this.showDialog('', 'info', false,result.msg);
                     }
                    //  _this.getTableData(0);
                 }
             });
         },
           // 根据一级分类查询二级分类数据
        firstMaterialId:function(materialId,num){
            var _this=this; 
            _this.chooseMaterialId(materialId,num);  
        },
        // 根据二级分类查询三级分类数据
        secondMaterialId:function(secondMaterial,num){
            var _this=this;
            _this.chooseMaterialId(secondMaterial,num);
        },
        chooseMaterialId:function(materialId,num){
            var _this=this; 
            var params={}; 
            params.parentCategoryId=materialId;
            console.log(params);
            $.post({
                url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/threeClassifyList.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        console.log(result)
                            if(num==0){
                                _this.categoryConfigList=result.data.body.ncmsContentCategoryConfigList;//二级下拉框数据
                             }
                            else{
                                _this.threeMaterialIdList=result.data.body.ncmsContentCategoryConfigList; //三级下拉框数据
                            }
                        
                    }else {
                        _this.categoryConfigList = [];
                        _this.threeMaterialIdList = [];
                        _this.showDialog('materialShow', 'info', false, result.msg);
                    }
                }
            }); 
        },
        // 查询素材材料表格数据
        searchMaterial:function(currentIndex){
            var _this=this;
                var _this = this;
                var params = {};
                console.log(_this.threeMaterial);
                if(!_this.materialId&&!_this.secondMaterial&&!_this.threeMaterial){
                    _this.showDialog('materialShow', 'info', true, '请输入查询条件查询');
                    return false;
                }
                if(_this.materialId){
                    params.categoryId =_this.materialId; //一级分类ID    
                }
                if(_this.secondMaterial){
                    params.categoryId =_this.secondMaterial; //二级分类ID  
                }
                if(_this.threeMaterial){
                    params.categoryId =_this.threeMaterial; //三级分类ID  
                }
                if(currentIndex){
                    params.pageNo=currentIndex+1;
                }else{
                    params.pageNo=1; 
                }
                params.pageSize=_this.pageMaxNum2;
                params.title=_this.searchMaterialTitle;
                params.pushStatus='1';
                console.log(params);
                _this.searchMaterialList=[];
                $.post({
                    url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/searchMaterial.ajax',
                    data: params,
                    success: function (result) {
                        if (result.error === 0) {
                            if(result.data.body) {
                                if(currentIndex){
                                    _this.currentIndex2 =currentIndex;
                                }else{
                                    _this.currentIndex2 =0;
                                }
                                _this.totalPage2 = Math.ceil(result.data.body.total / params.pageSize);
                                _this.searchMaterialList = result.data.body.rows?result.data.body.rows:[];
                            }
                        }else {
                            _this.searchMaterialList = [];
                            _this.showDialog('', 'info', false, result.msg);
                        }
                    }
                });      
        },
        // 内容素材弹窗点击X取消
        closeMaterialShow:function(){
           var _this=this;
           _this.showDialog('add', 'materialShow', true);
        },
        // 确认选择当前素材材料确认
        checkMaterial:function(item){
            var _this=this;
            _this.title=item.title;
            _this.mediaId=item.mediaId;
            _this.materialTitle=item.title;
            _this.abstracts=item.description;
            console.log(item)
    
            _this.showDialog('materialShow', 'add');
         },

        // 添加弹窗里选择发布状态
        changeAddStatus() {
            var _this = this;
            // this.page1.isSeparate.checked = !this.page1.isSeparate.checked;
            if (_this.enableFlag == '0') {
                _this.enableFlag = '1'
            } else {
                _this.enableFlag = '0'
            }
        },
        //主表格发布状态选择
        changeStatus(item, index) {
            console.log(item);
            var _this = this;
            let dateT=_this.getNowtime();
            //ajax后执行
            if (_this.tableData[index].enableFlag == '1') {
                this.$set(this.tableData[index], 'enableFlag', '0');
                _this.switchUpdate(item.id, this.tableData[index].enableFlag);
            } else {
               // 判断下线时间和当前时间对比
                   let offlineTime=item.offlineTime.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g, '$1$2$3$4$5$6')
                   let nowDate=dateT.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g, '$1$2$3$4$5$6');
                    console.log(offlineTime);
                    console.log(nowDate);
                if(offlineTime<=nowDate){
                    _this.$set(_this.tableData[index], 'enableFlag', '0');
                    _this.$set(_this.tableData,'enableFlag');
                    _this.showDialog('add', 'info', false, '下线时间不能小于当前时间，请重新修改编辑下线时间');

                }else{
                    this.$set(this.tableData[index], 'enableFlag', '1');
                    _this.switchUpdate(item.id, this.tableData[index].enableFlag);
                    _this.showDialog('add', 'info', false, '已发布，本弹窗将于'+item.offlineTime+'下线');
                }

            }
        },
        // 弹窗列表修改发布的状态-开关
        switchUpdate(id, status) {
            var _this = this;
            var params = {};
            params.id = id;
            params.enableFlag = status;
            console.log(params);
            $.post({
                url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/switchUpdate.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        // _this.getTableData(_this.currentIndex);
                        // _this.page1.tableData = result.data;
                    }
                    else {
                        _this.showDialog('', 'info', false, result.msg);
                    }
                }
            });
        },
        // 获取当前时间
        getNowtime(){
            var _this = this;
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let h = date.getHours();
            let i = date.getMinutes();
            let s = date.getSeconds();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            if (h < 10) {
                h = '0' + h;
            }
            if (i < 10) {
                i = '0' + i;
            }
            if (s < 10) {
                s = '0' + s;
            }
            let dateT = year + '-' + month + '-' + day + " " + h + ':' + i + ':' + s;
            return dateT;
        },
        // 获取当前时间24点
        getAfterNowtime(){
            var _this = this;
            let date = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let h = date.getHours();
            let i = date.getMinutes();
            let s = date.getSeconds();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            if (h < 10) {
                h = '0' + h;
            }
            if (i < 10) {
                i = '0' + i;
            }
            if (s < 10) {
                s = '0' + s;
            }
            let dateT = year + '-' + month + '-' + day + " " + h + ':' + i + ':' + s;
            return dateT;
        },
        // 弹窗列表修改发布的状态-开关
        // switchUpdate(id, status) {
        //     var _this = this;
        //     var params = {};
        //     params.id = id;
        //     params.publishStatus = status;
        //     console.log(params);
        //     $.post({
        //         url: '/advertising/serviceAndRemindMgmt/popupMgmt/switchUpdate.ajax',
        //         data: params,
        //         success: function (result) {
        //             if (result.error === 0) {
        //                 // _this.page1.tableData = result.data;
        //             }
        //             else {
        //                 _this.showDialog('', 'info', false, result.msg);
        //             }
        //         }
        //     });
        // },

        // 主表格数据
        getTableData: function (currentIndex) {
            //   console.log(currentIndex);
            var _this = this;
            var params = {};
            params.functionModule= this.searchModule; //功能模块
            params.popupType= this.searchPopupType;  //弹窗类型
            params.title= this.searchTitle;               //标题
            params.startTime=this.startTime;
            params.endTime= this.endTime;
            params.pageNo = currentIndex + 1;
            params.pageSize = this.pageMaxNum;
            console.log(params);
            $.post({
                url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/getTableData.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        console.log(result);
                        _this.currentIndex = currentIndex;
                        _this.totalPage = Math.ceil(result.data.body.total / params.pageSize);
                        if(result.data.body.rows) {
                            _this.tableData = result.data.body.rows
                        }
                    }
                    else {
                        _this.tableData = [];
                        _this.currentIndex = 0;
                        _this.showDialog('', 'info', false, result.msg);
                    }
                }
            });

        },

        // 点击添加文章+小图标
        showUpdateArticle:function(){  //修改
            var _this = this;
            // let sourceMaterialType = _this.sourceMaterialType;
            // console.log("textId=", _this.textId);
            // console.log("title=", _this.title);
            // console.log("mediaId=", _this.mediaId);
            // console.log(_this.diaArticleData);

            // for (var i = 0; i < this.diaArticleData.length; i++) {
            //     if(!_this.textId){
            //         if (_this.mediaId === this.diaArticleData[i].mediaId) {
            //             _this.$set(_this.diaArticleData[i], 'checked', 'Y');
            //         }
            //     }else{
            //         if (_this.textId === this.diaArticleData[i].textId) {
            //             _this.$set(_this.diaArticleData[i], 'checked', 'Y');
            //         }
            //     }
            // }
            // _this.$set(_this.diaArticleData, 'checked');

            // _this.getPvData(0,sourceMaterialType);
            _this.showDialog('add', 'materialShow',false)

        },
        showAddArticle(){   //添加
            var _this = this;

            let sourceMaterialType = _this.sourceMaterialType;
            // _this.getPvData(0,sourceMaterialType);
            _this.showDialog('add', 'materialShow',false)
        },


    // start原来添富赢的版本    
        // 勾选选择文章的radio
        checkboxSelect(item,index){
            var _this=this;
            // $.each(_this.page2.diaArticleData,function(index,item){
            //     console.log(item)
            //     item.checked=false;
            // })
            // _this.page2.diaArticleData[index].checked = true;

             console.log("item",item)
            _this.diaArticleData.forEach(function(obj){
                obj.checked='N';
            })
            _this.textId=item.textId;
            _this.mediaId=item.mediaId;
            if(_this.textId){
                _this.title=item.title;//标题
                _this.abstract=item.summary;//摘要
            }
            if(_this.mediaId){
                _this.title=item.title;
                _this.abstract=item.summary;//摘要
            }
            _this.$set(_this.diaArticleData[index], 'checked', 'Y')

            console.log("diaArticleData",_this.diaArticleData);
        },
        // 切换选择素材类型
        // chooseTitle(){
        //     this.textId='';
        //     this.mediaId='';
        //     this.title='';
        //     this.abstract='';
        // },

        // 选择好文章列表确定按钮
        // chooseData:function(){
        //     var _this=this;
        //     console.log(_this.diaArticleData);

        //     var _this = this;
        //     var hasCheck = false;
        //     for (var i = 0; i <_this.diaArticleData.length; i++) {
        //         if (_this.diaArticleData[i].checked=='Y') {
        //             hasCheck = true;
        //         }
        //     }
        //     if (!hasCheck) {
        //         _this.showDialog('addPopup', 'info', true, '请选择一个文章列表');
        //         return;
        //     }
        //     this.showDialog('addPopup', 'add', false);
        // },

        clearAddDia: function (item) {
            console.log("item",item);
            this.popupType=item ? item.popupType : '';
            this.functionModule=item ? item.functionModule : '';
            // this.textId=item ? item.textId : '';
            this.mediaId=item ? item.mediaId : '';
            // this.articleType=item ? item.articleType : '';
            // this.publishStatus=item ? item.publishStatus : '';
            this.title=item ? item.title : '';
            this.abstracts=item ? item.abstracts : '';
            // this.offlineTime=item ? item.offlineTime : '';
            // let testTime=item.offlineTime.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
            // console.log(testTime);
            // let dateT = testTime.substr(0,4) + '-' + (testTime.substring(4,5)>10?testTime.substring(4,6):testTime.substring(4,5)) + '-' + testTime.substring(6,8)  + " " + testTime.substring(8,10) + ':' + testTime.substring(10,12)+ ':' + testTime.substring(12,14)
            // console.log(dateT);
            this.offlineTime=item ?item.offlineTime: this.getAfterNowtime();
            this.enableFlag  = item ? item.enableFlag  : '0';
        },
        showAdd: function () {
            var _this=this;
            this.modifyStatus = 0;
            this.clearAddDia('');
            this.updateId = '';
            this.popupType='1';   //弹窗类型
            this.functionModule ='001';//功能模块
            this.title='';   //标题
            this.abstracts=''; //摘要
            this.mediaId='';
            this.enableFlag='0';  //0-关闭，1-启用
            this.modifyBy='',   //最近更新人
            this.updateTime='',  //最近修改时间
            _this.materialTitle='',
            // this.articleType='';
            // this.publishStatus='';
            
            // _this.offlineTime='';
         
            this.showDialog('', 'add')
        },

        add: function () {
            var _this = this;
            var params = {};
            var api = 'add';
            if (this.updateId) {
                params.id = this.updateId;
                api = 'update';
            }
            if (!this.popupType) {
                _this.showDialog('add', 'info', true, '弹窗类型不能为空');
                return false;
            }
            if (!this.functionModule) {
                _this.showDialog('add', 'info', true, '功能模块不能为空');
                return false;
            }
            if (!this.mediaId) {
                _this.showDialog('add', 'info', true, '请添加内容文章');
                return false;
            }

            if (!_this.title) {
                _this.showDialog('add', 'info', true, '弹框标题不能为空');
                return false;
            }

            let offlineTime=_this.offlineTime.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g, '$1$2$3$4$5$6');
            let nowTmie=_this.getNowtime().replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g, '$1$2$3$4$5$6');
            console.log(offlineTime);
            console.log(nowTmie);
            if (offlineTime<=nowTmie) {
                _this.showDialog('add', 'info', true, '下线时间不能小于当前时间，请重新修改编辑下线时间');
                return false;
            }

            params.popupType=this.popupType;  //弹窗类型(WENZHANG)
            params.functionModule=this.functionModule;  //功能模块(HOME-首页
            // params.textId=this.textId?this.textId:'';  //文本类型的素材的id
            params.mediaId=this.mediaId?this.mediaId:'';  //文章类型的文章id
            // params.articleType=this.articleType;
            params.enableFlag=this.enableFlag;  //状态  发布状态0.1
            params.title=this.title;           //标题
            params.abstracts=this.abstracts?this.abstracts:'';     //摘要正文
            params.offlineTime=offlineTime; //下线时间(yyyyMMddHHmmss)
            // params.publishTime =moment(new Date().getTime()).format('YYYYMMDDHHmmss'); //发布时间(yyyyMMddHHmmss)
            // params.createTime =moment(new Date().getTime()).format('YYYYMMDDHHmmss'); //创建时间(yyyyMMddHHmmss)
            // if(params.enableFlag==1){
            //     params.publishTime =moment(new Date().getTime()).format('YYYYMMDDHHmmss'); //发布时间(yyyyMMddHHmmss)
            // }

            // params.sourceMaterialType=this.sourceMaterialType; //素材类型(文本:TEXT,文章:WXARTICLE)

            console.log(params);
            $.post({
                url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/' + api + '.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        _this.getTableData(0);
                        _this.showDialog('add', 'info', false, result.msg);
                    } else {
                        _this.showDialog('add', 'info', true, result.msg);
                    }
                }
            });
        },
        //点击修改主页面内容
        modify: function (item) {
            var _this = this;
            _this.modifyStatus = 1;
            _this.clearAddDia(item);
            _this.updateId = item.id;
            this.modifyBy=item.modifyBy;  //最近更新人
            this.updateTime=item.modifyTime;  //最近修改时间
            var params = {};
            params.materiaIdList=item.mediaId;
            // _this.getPvData(0,item.sourceMaterialType);
            // 查询单个产品信息
            // var clearTime=setTimeout(function(){

                $.post({
                    url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/searchSingle.ajax',
                    data: params,
                    success: function (result) {
                        if (result.error === 0) {
                            console.log("查询单个弹窗", result.data);
                            _this.materialTitle=result.data.body.length>0?result.data.body[0].title:'';
                        } else {
                            _this.showDialog('add', 'info', false, result.msg);
                        }
                    }
                });

            // },2000)
            this.showDialog('', 'add');
        },
        deleteDate(item) {
            var _this = this;
            var params = {};
            params.id = item.id;
            console.log(params);
            $.post({
                url: '/contentMgmt/serviceAndRemindMgmt/popupMgmt/deleteParam.ajax',
                data: params,
                success: function (result) {
                    if (result.error === 0) {
                        _this.getTableData(0);
                        _this.showDialog('', 'info', true, result.msg);
                    } else {
                        _this.showDialog('', 'info', true, result.msg);
                    }
                }
            });
        },
        // 刷新公众最新文章
        // getRefresh(){
        //    var _this=this;
        //    $('.cover').show();
        //     $.post({
        //         url: '/advertising/serviceAndRemindMgmt/popupMgmt/getRefresh.ajax',
        //         // data: params,
        //         success: function (result) {
        //             if (result.error === 0) {
        //                 $('.cover').hide();
        //                 _this.getPvData(0,_this.sourceMaterialType);  //重新获取弹窗数据
        //             }
        //             else {
        //                 $('.cover').hide();
        //                 _this.showDialog('addPopup', 'info', true, result.msg);
        //             }
        //         }
        //     });
        // },

        // 获取弹窗里文章列表数据
        // getPvData: function (currentIndex,sourceMaterialType) {
        //       console.log(currentIndex);
        //       console.log(sourceMaterialType);
        //     var _this = this;
        //     var params = {};
        //         params.searchTitle=this.searchTitle;
        //         if(sourceMaterialType){
        //             params.sourceMaterialType=sourceMaterialType?sourceMaterialType:this.sourceMaterialType;
        //         }else{
        //             params.sourceMaterialType='WXARTICLE';
        //         }
        //         params.page=currentIndex + 1;
        //         params.size=_this.pageMaxNum2;
        //         params.startTime=this.startTime;
        //         params.endTime=this.endTime;
        //     console.log(params);
        //     $.post({
        //         url: '/advertising/serviceAndRemindMgmt/popupMgmt/getPvData.ajax',
        //         data: params,
        //         success: function (result) {
        //             if (result.error === 0) {
        //                 _this.currentIndex2 = currentIndex;
        //                 _this.totalPage2 = Math.ceil(result.data.body.total / params.size);
        //                 if(result.data.body.data){
        //                     _this.diaArticleData = result.data.body.data;

        //                     console.log("_this.diaArticleData",_this.diaArticleData)

        //                     _this.diaArticleData.map(function(item){
        //                         item.checked='N';
        //                     })
        //                     console.log('弹窗文章列表数据',_this.diaArticleData )
        //                 }

        //             }
        //             else {
        //                 _this.diaArticleData = [];
        //                 _this.currentIndex2 = 0;
        //                 _this.showDialog('addPopup', 'info', true, result.msg);
        //             }
        //         }
        //     });

        // },

        //公共方法
        awaitWrap(promise) { // await 异常处理包装
            return promise.then(res => [null, res], error => [error, null]);
        },
        verify: function () { // 校验

        },
        //主表格分页方法
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
        //弹窗表格分页方法
            prev2: function () {
                if (this.currentIndex2 <= 0) {
                    return;
                }
                this.searchMaterial(this.currentIndex2 - 1);
            },
            next2: function () {
                if (this.currentIndex2 >= this.totalPage2 - 1) {
                    return;
                }
                this.searchMaterial(this.currentIndex2 + 1);
            },
            changeIndex2: function (index) {
                this.searchMaterial(index - 1);
            },
            toFirst2: function () {
                this.searchMaterial(0);
            },
            toLast2: function () {
                this.searchMaterial(this.totalPage2 - 1);
            },

        showDialog: function (dia1, dia2, callback, msg) {
            // 关掉dia1，打开dia2
            // callback==false:在dia2关掉的时候，直接关掉
            // callback==true:在dia2关掉的时候，重新打开dia1
            this.diaMsg = (msg ? msg : '输入条件错误');
            if (!dia1) {
                $('#' + dia2).modal('show');
            } else if (!dia2) {
                $('#' + dia1).modal('hide');
            } else if (!callback) {
                $('#' + dia1).modal('hide');
                $('#' + dia2).off("hidden.bs.modal").modal('show');
            } else {
                if ($('#' + dia1).data('parentDlg')) {
                    // dia1弹窗有父级弹窗，先去除关闭事件，关闭弹窗后，再恢复添加事件
                    $('#' + dia1).off("hidden.bs.modal").modal('hide');
                    $('#' + dia1).on("hidden.bs.modal", function () {
                        $('#' + $('#' + dia1).data('parentDlg')).modal("show");
                    });
                } else {
                    // dia1弹窗没有父级弹窗，直接关闭
                    $('#' + dia1).modal('hide');
                }
                $('#' + dia2).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                    // dia2作为子弹窗，添加关闭事件，关闭弹窗时打开父级弹窗
                    $('#' + dia1).modal("show");
                    $('#' + dia2).data('parentDlg', dia1);
                });
                $('#' + dia2).modal('show');
            }
        },
        showNestDialog: function (dia1, dia2, dia3, callback, msg) { //页面内嵌套了多个模态框
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
                        $('#' + dia1).on("hidden.bs.modal", function () {
                            $('#' + dia3).modal('show');
                            $('#' + dia1).off().on("hidden", "hidden.bs.modal");
                        });
                    });
                    $('#' + dia2).modal("show");
                    $('#' + dia1).off().on("hidden", "hidden.bs.modal");
                });
                $('#' + dia1).modal('hide');
            }
        },
        transformTime(createTime) {
            let date = new Date(Number(createTime));
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let h = date.getHours()
            let i = date.getMinutes()
            let s = date.getSeconds();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            if (h < 10) {
                h = '0' + h;
            }
            if (i < 10) {
                i = '0' + i;
            }
            if (s < 10) {
                s = '0' + s;
            }
            let dateT = year + '-' + month + '-' + day + " " + h + ':' + i + ':' + s
            return dateT
        }
    },
    components: {
        'date-picker': VueBootstrapDatetimePicker
    },
});