importPackage(Packages.com.yunbo.core.macro.runner);
importPackage(Packages.com.yunbo.util.file); // 文件工具
importPackage(Packages.com.yunbo.util.http); // Http、URL工具
importPackage(Packages.com.yunbo.util.mail); // 邮件工具

/**
 * 公共变量MAP对象
 */
var GLOBAL_MAP = new Packages.java.util.HashMap();

function getDataPackage() {
    return $DATAS;
}

/**
 * 获取当前定时任务
 *
 * @returns
 */
function currentTask() {
    return $TASK;
}

/**
 * 当前提醒
 *
 * @returns
 */
function currentReminder() {
    return $REMINDER;
}

/**
 * 获取当前日志对象,对象包含以下方法： setLogStatus("1") // 0未完成 1已完成 setContent("异常或警告信息")
 * setLogType("warn") // error错误 warn警告
 *
 * @returns
 */
function currentLog() {
    return $LOG;
}

function getAuthUtil() {
    return new Packages.com.yunbo.util.AuthUtil();
}

/**
 * 数据类型转换函数库
 *
 * @returns
 */
function getConvertUtil() {
    return Packages.com.yunbo.util.ConvertUtil;
}

/**
 * 对象工具函数库
 *
 * @returns
 */
function getObjectUtil() {
    return Packages.com.yunbo.util.ObjectUtil;
}

/**
 * 获取当前打开文档的ID
 *
 * @return 获取当前打开文档的ID
 */
function getId() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getId();
    }
    return "";
}

/**
 * 获取当前打开文档中Item的值
 *
 * @deprecated 使用valStr(fieldName), valObj(fieldName)代替
 * @return 获取当前打开文档中Item的值
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValue(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取当前打开文档中Item的值,且以字符串形式返回
 *
 * @deprecated 使用valStr(fieldName), valObj(fieldName)代替
 * @return 获取当前打开文档中Item的值,且以字符串形式返回
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValueAsString(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取当前打开文档中Item的值,且以日期形式返回
 *
 * @return 获取当前打开文档中Item的值,且以日期形式返回
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValueAsDate(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsDate(fieldName);
    }
    return null;
}

/**
 * 获取当前打开文档中Item的值,且以double形式返回
 *
 * @return 获取当前打开文档中Item的值,且以double形式返回
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValueAsDouble(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsDouble(fieldName);
    }
    return 0;
}

/**
 * @return 获取当前打开文档中Item的值,且以整型值形式返回
 *
 * @param fieldName:当前打开文档的字段名
 */
function getItemValueAsInt(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsInt(fieldName);
    }
    return 0;
}

/**
 * 根据子文档名，获取当前文档的子文档个数
 *
 * @return 根据子文档名，获取当前文档的子文档个数
 *
 * @param formName
 *            当前打开文档的子文档名
 */
function countSubDocument(formName) {
    var doc = $CURRDOC.getCurrDoc();
    var total = 0;
    if (doc != null) {
        if (doc != null) {
            var subdocs = doc.getChilds(formName);
            if (subdocs != null && subdocs.size() > 0) {
                total = subdocs.size();
            }
        }
    }
    return total;
}

/**
 * 根据子文档名和字段名，获取当前打开文档的子文档中字段的值总和
 *
 * @return 根据子文档名和字段名，获取当前打开文档的子文档中字段的值总和
 *
 * @param formName
 *            当前打开文档的子文档名
 * @param fieldName
 *            子文档的字段名
 */
function sumSubDocument(formName, fieldName, execludeId, scale) {
    var doc = $CURRDOC.getCurrDoc();
    var accurateCalculate = $BEANFACTORY.createObject("com.yunbo.util.Arith");
    var total = 0;
    if (doc != null) {
        var subdocs = doc.getChilds(formName);
        if (subdocs != null && subdocs.size() > 0) {
            for ( var iter = subdocs.iterator(); iter.hasNext();) {
                var subdoc = iter.next();
                if (!subdoc.getId().equals(execludeId)) {
                    total += subdoc.getItemValueAsDouble(fieldName);
                }
            }
        }
    }
    if (!scale) {
        return accurateCalculate.round(total, 2);
    } else {
        return accurateCalculate.round(total, scale);
    }

}

/**
 * 根据外键汇总关联表单的字段值
 *
 * @param formName
 *            子表单名
 * @param fieldName
 *            子表单汇总字段名
 * @param fkFiledName
 *            外键字段（主子表单关联字段名必须一致）
 * @returns
 */
function sumRelatedDocument(formName, fieldName, fkFiledName) {
    var colName = "ITEM_" + fieldName.toUpperCase();
    var fkColName = "ITEM_" + fkFiledName.toUpperCase();
    var sql = "SELECT SUM(" + colName + ") FROM TLK_" + formName.toUpperCase();
    sql += " WHERE " + fkColName + " = '" + valStr(fkFiledName) + "'";
    var total = sumBySQL(sql);

    return total;
}

/**
 * 返回当前打开文档对象
 *
 * @return 返回当前打开文档对象
 */
function getCurrentDocument() {
    var doc = $CURRDOC.getCurrDoc();
    return doc;
}

/**
 * 返回当前打开文档的父文档对象
 *
 * @return 返回当前打开文档的父文档对象
 */
function getParentDocument() {
    var doc = $CURRDOC.getCurrDoc();
    var parentid = getParameter("parentid");
    var user = $WEB.getWebUser();
    var parent = null;

    if (isEmpty(parentid)) {
        if (doc != null) {
            parentid = doc.getParentid();
        }
    }

    if (user != null && !isEmpty(parentid)) {
        // 从缓存中获取
        parent = user.getFromTmpspace(parentid);
        if (parent == null) {
            // 从数据库中获取
            parent = getDocumentProcess().doView(parentid);
            if (parent != null) { // 设置到缓存中
                user.putToTmpspace(parentid, parent);
            }
        }
    }

    // 从当前文档中获取
    if (parent == null && doc != null) {
        parent = doc.getParent();
    }

    return parent;
}

/**
 * 获取关联的文档，当包含元素不存在父子关系时生效
 *
 * @return 获取关联的文档，当包含元素不存在父子关系时生效
 */
function getRelateDocument() {
    return getParentDocument();
}

/**
 * 获取文档中Item的值,且以字符串形式返回
 *
 * @return 获取文档中Item的值,且以字符串形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValue(docid, fieldName) {

    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取文档中Item的值,且以字符串形式返回
 *
 * @return 获取文档中Item的值,且以字符串形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsString(docid, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取文档中Item的值,且以double形式返回
 *
 * @return 获取文档中Item的值,且以double形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsDouble(docid, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsDouble(fieldName);
    }
    return 0.0;
}

/**
 * 获取文档中Item的值,且以日期形式返回
 *
 * @return 获取文档中Item的值,且以日期形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsDate(docid, fieldName) {

    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsDate(fieldName);
    }
    return null;
}

/**
 * 获取文档中Item的值,且以整型值形式返回
 *
 * @return 获取文档中Item的值,且以整型值形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsInt(docid, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsInt(fieldName);
    }
    return 0;
}

/**
 * 根据给定的docid，获取Document对象
 *
 * @return 根据给定的docid，获取Document对象
 *
 * @param docid
 *            文档的id标识
 */
function findDocument(docid) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    return doc;
}

/**
 * 根据dql查询符合条件的Document，结果以Collection返回
 *
 * @return 根据dql查询符合条件的Document，结果以Collection返回
 *
 * @param dql
 *            dql查询符合条件语句
 */
function queryByDQL(dql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryByDQL(dql, $WEB.getDomainid());
    return dpg.datas;
}

/**
 * 根据dql(带缓存)查询符合条件的Document，结果以Collection返回
 *
 * @return 根据dql(带缓存)查询符合条件的Document，结果以Collection返回
 *
 * @param dql
 *            dql查询符合条件语句
 */
function queryByDQLWithCache(dql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryByDQLWithCache(dql, $WEB.getDomainid());
    if (dpg)
        return dpg.datas;
    return null;
}

/**
 * 根据DQL获取文档
 *
 * @param dql
 *            dql查询符合条件语句
 * @return 根据DQL获取文档
 */
function findByDQL(dql) {
    var process = getDocProcess($WEB.getApplication());
    return process.findByDQL(dql, $WEB.getDomainid());
}

/**
 * 根据SQL获取文档
 *
 * @return 根据SQL获取文档
 *
 * @param sql
 *            sql查询符合条件语句
 */
function findBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    return process.findBySQL(sql, $WEB.getDomainid());
}

/**
 * 根据SQL获取文档带缓存
 *
 * @return 根据SQL获取文档
 *
 * @param sql
 *            sql查询符合条件语句
 */
function findBySQLCache(sql) {
    var process = getDocProcess($WEB.getApplication());
    var dataPackage = process.queryBySQLWithCache(sql, $WEB.getDomainid());
    if (dataPackage != null && dataPackage.datas.size() > 0) {
        return dataPackage.datas.iterator().next();
    }

    return null;
}

/**
 * 根据dql统计符合条件的Document数量
 *
 * @return 根据dql统计符合条件的Document数量
 *
 * @param dql
 *            dql查询符合条件语句
 */
function countByDQL(dql) {
    var process = getDocProcess($WEB.getApplication());
    var count = process.countByDQL(dql, $WEB.getDomainid());
    return count;
}

/**
 * 根据SQL汇总记录数
 *
 * @param sql
 *            SQL查询语句
 * @return 返回统计结果
 */
function countBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    var count = process.countBySQL(sql, $WEB.getDomainid());
    return count;
}

/**
 * 根据dql汇总符合条件的Document的指定字段
 *
 * @return 根据dql汇总符合条件的Document的指定字段
 *
 * @param dql
 *            dql查询符合条件语句
 * @param fieldName
 *            文档的字段名
 */
function sumByDQL(dql, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var sum = process.sumByDQL(dql, fieldName, $WEB.getDomainid());
    return sum;
}

/**
 * 根据sql汇总符合条件的Document的指定字段
 *
 * @return 根据sql汇总符合条件的Document的指定字段
 *
 * @param sql
 *            sql查询符合条件语句
 * @param fieldName
 *            文档的字段名
 */
function sumBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    var sum = process.sumBySQL(sql, $WEB.getDomainid());
    return sum;
}

/**
 * 返回项目id号
 *
 * @return 返回项目id号
 */
function getApplication() {
    return $WEB.getApplication();
}

/**
 * 返回当前登录用户对象
 *
 * @return 返回当前登录用户对象
 */
function getWebUser() {
    return $WEB.getWebUser();
}

function getWebUserId(fieldName) {
    var rtn = "";
    if (!isEmpty(valStr(fieldName))) {
        rtn = valStr(fieldName);
    } else {
        rtn = getWebUser().getId();
    }

    return rtn;
}

/**
 * 按其参数指定的格式获取当前时间，并以字符串的形式返回
 *
 * @deprecated
 * @return 按其参数指定的格式获取当前时间，并以字符串的形式返回
 * @param date
 *            日期型参数
 * @param formatText
 *            字符串型参数，指定需要显示的格式，如"yyyy-MM-dd HH:mm:ss"
 */
function getCurDate(formatText) {
    return $TOOLS.DATE_UTIL.format($TOOLS.DATE_UTIL.getToday(), formatText);
}

/**
 * 生成系统类对象
 *
 * @return 生成系统类对象
 * @param pathText
 *            类的名字空间,如"com.yunbo.util.DateUtil";
 *
 */
function createObject(pathText) {
    var obj = $BEANFACTORY.createObject(pathText);
    return obj;
}

/**
 * 生成系统类对象
 *
 * @return 生成系统类对象
 * @param pathText
 *            类的名字空间,如"com.yunbo.core.department.ejb.DepartmentProcess";
 *
 */
function createProcess(pathText) {
    var process = $PROCESSFACTORY.createProcess(pathText);
    return process;
}

/**
 * 返回文档操作对象
 *
 * @param applicationid
 * @deprecated 软件标识ID
 * @return 文档操作对象
 */
function getDocProcess(applicationid) {
    return Packages.com.yunbo.core.dynaform.document.ejb.DocumentProcessBean
        .createMonitoProcess(applicationid);
}

/**
 * 返回文件上传对象
 *
 * @param applicationid
 *            软件标识ID
 * @return 文件上传对象
 */
function getUploadProcess(applicationid) {
    return Packages.com.yunbo.core.upload.ejb.UploadProcessBean
        .createMonitoProcess(applicationid);
}

/**
 * 获取参数列表对象，可以对参数进行基本的增,删和格式化参数
 *
 * @return 参数列表对象
 */
function getParamsTable() {
    return $WEB.getParamsTable();
}

/**
 * 创建参数对象
 *
 * @return 返回ParamsTable的新实例对象
 */
function createParamsTable() {
    return new Packages.com.yunbo.base.action.ParamsTable();
}

/**
 * 获取参数值,以字符串的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值
 *
 */
function getParameter(paramName) {
    return $WEB.getParameterAsString(paramName);
}
/**
 * 获取参数值,以日期时间的格式的形式返回
 *
 * @param paramName
 * @returns yyyy-mm-dd hh:mm:ss
 */
function getParameterAsDateTime(paramName) {
    return $WEB.getParameterAsDateTime(paramName);
}

/**
 * 获取参数值,以";"进行切割格式化成文本型,以字符串的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值
 */
function getParameterAsText(paramName) {
    return $WEB.getParameterAsText(paramName);
}

/**
 * 获取参数值,以浮点型的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值
 *
 */
function getParameterAsDouble(paramName) {
    return $WEB.getParameterAsDouble(paramName);
}

/**
 * 获取参数值,并以字符数组的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值，以字符数组对象返回
 */
function getParameterAsArray(paramName) {
    var params = $WEB.getParameterAsArray(paramName);
    if (params != null && params.length == 1 && params[0] != null
        && params[0].indexOf(";") > 0)
        params = splitText(params[0], ";");
    return params;
}

/**
 * 获取参数值,并以日期的形式返回
 *
 * @param paramName
 * @returns
 */
function getParameterAsDate(paramName) {
    var date = $WEB.getParameterAsDate(paramName);
    return date;
}

/**
 * 返回的部分请求的URI，指示请求的范围内。 上下文路径总是先在一个请求的URI。 路径以一个“/”字符，但并没有结束的"/"字符。
 * 在默认（根）Servlet的情况下，此方法返回""。该容器不解码此字符串。
 *
 * @return 一个String指定请求的URI部分，指示请求的上下文
 */
function getContextPath() {
    return $WEB.getParamsTable().getContextPath();
}

/**
 * 根据sql查询符合条件的Document，结果以Collection返回
 *
 * @param sql
 *            查询语句参数
 * @return 根据sql查询符合条件的Document，结果以Collection返回
 */
function queryBySQL(sql, cache) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = null;

    if (cache) {
        dpg = process.queryBySQLWithCache(sql, $WEB.getDomainid());
    } else {
        dpg = process.queryBySQL(sql, $WEB.getDomainid());
    }

    if (dpg != null) {
        return dpg.datas;
    } else {
        return null;
    }
}

/**
 * 根据sql语句执行更新动作
 *
 * @param sql
 */
function updateBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    process.updateBySQL(sql, $WEB.getDomainid());
}
/**
 * 根据sql(带缓存）查询符合条件的Document，结果以Collection返回
 *
 * @param sql
 *            查询语句参数
 * @return 根据sql查询符合条件的Document，结果以Collection返回
 */
function queryBySQLWithCache(sql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryBySQLWithCache(sql, $WEB.getDomainid());
    if (dpg != null) {
        return dpg.datas;
    } else {
        return null;
    }
}
/**
 * 创建警告对话框
 *
 * @param content
 *            警告信息参数
 * @return 创建警告对话框
 */
function createAlert(content) {
    return new JsMessage(JsMessage.TYPE_ALERT, content);
}
/**
 * 创建提示对话框
 *
 * @param content
 *            提示内容参数
 * @return 返回true|false；true: 表示确认；false: 表示取消。
 */
function createConfirm(content) {
    return new JsMessage(JsMessage.TYPE_CONFIRM, content);
}

/**
 * 获取当前浏览器session
 *
 * @param sessionName
 *            session属性名
 * @return 获取当前浏览器session
 */
function getSession(sessionName) {
    var request = $WEB.getParamsTable().getHttpRequest();
    if (request != null) {
        return request.getSession().getAttribute(sessionName);
    }
    return null;
}

/**
 * 根据数据源名称，执行SQL查询
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 * @return 返回SQL查询语句执行的结果，以Collection方式返回（存储的是数据记录的Map对象）。
 */
function queryByDSName(dsName, sql) {
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    return process.queryDataSourceSQL(dsName, sql, getApplication());
}

/**
 * 根据数据源名称，执行SQL插入操作（SQL语句为：insert table ......）。
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 */
function insertByDSName(dsName, sql) {
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    process.queryInsert(dsName, sql, getApplication());
}

/**
 * 根据数据源名称，执行SQL更新操作（SQL语句为：update table set......）。
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 */
function updateByDSName(dsName, sql) {
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    process.createOrUpdate(dsName, sql, getApplication());
}

/**
 * 根据数据源名称，执行SQL删除操作（SQL语句为：delete from table ......）。
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 */
function deleteByDSName(dsName, sql) {
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    process.remove(dsName, sql, getApplication());
}

/**
 * 返回文档操作对象
 *
 * @return 文档操作对象
 */
function getDocumentProcess() {
    return Packages.com.yunbo.core.dynaform.document.ejb.DocumentProcessBean
        .createMonitoProcess(getApplication());
}

/**
 * 获取数据源业务对象
 *
 * @return 获取数据源业务对象
 */
function getDataSourceProcess() {
    return createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
}

/**
 * 返回用户操作对象
 *
 * @return 用户操作对象
 */
function getModuleProcess() {
    return createProcess("com.yunbo.core.deploy.module.ejb.ModuleProcess");
}

/**
 * 返回用户操作对象
 *
 * @return 用户操作对象
 */
function getUserProcess() {
    return createProcess("com.yunbo.core.user.ejb.UserProcess");
}

/**
 * 返回部门操作对象
 *
 * @return 部门操作对象
 */
function getDepartmentProcess() {
    return createProcess("com.yunbo.core.department.ejb.DepartmentProcess");
}

/**
 * 返回角色操作对象
 *
 * @return 角色操作对象
 */
function getRoleProcess() {
    return createProcess("com.yunbo.core.role.ejb.RoleProcess");
}
/**
 * 返回表单业务对象
 *
 * @return 返回表单业务对象
 */
function getFormProcess() {
    return createProcess("com.yunbo.core.dynaform.form.ejb.FormProcess");
}
/**
 * 返回视图业务对象
 *
 * @return 返回视图业务对象
 */
function getViewProcess() {
    return createProcess("com.yunbo.core.dynaform.view.ejb.ViewProcess");
}

/**
 * 获取企业域业务对象
 *
 * @return 获取企业域业务对象
 */
function getDomainProcess() {
    return createProcess("com.yunbo.core.domain.ejb.DomainProcess");
}

/**
 * 输出文本到控制台
 *
 * @param text
 *            要输出文本的内容
 */
function println(text) {
    $PRINTER.println(text);
}

/**
 * 更新文档但不更新版本号
 *
 * @param doc
 *            文档对象
 */
function doUpdateDocumentWithoutVersions(doc) {
    var process = getDocumentProcess();
    if (doc != null) {
        doc.setVersions(doc.getVersions() - 1);
        process.doUpdate(doc);
    }

}

function URL() {
    var init = function() { // 构造函数
    };

    init();
}
URL.encode = function(str) {
    var newStr = Packages.com.yunbo.util.http.UrlUtil.encode(str);
    return newStr;
};
URL.decode = function(str) {
    var newStr = Packages.com.yunbo.util.http.UrlUtil.decode(str);
    return newStr;
};

/**
 * 获取唯一序列号
 *
 * @returns
 */
function uuid() {
    return Packages.com.yunbo.util.sequence.Sequence.getSequence();
}

/**
 * 获取表单字段值
 *
 * @param fieldName
 *            字段名称
 */
function valObj(fieldName, doc) {
    if (!doc) {
        doc = currentDoc();
    }
    if (doc) {
        return doc.getItemValue(fieldName);
    }

    return null;
}

/**
 * 获取表单字段字符串值
 *
 * @param fieldName
 *            字段名称
 */
function valStr(fieldName, doc) {
    if (!doc) {
        doc = currentDoc();
    }
    if (doc) {
        return doc.getItemValueAsString(fieldName);
    }

    return "";
}

/**
 * 获取父文档字段对象值
 */
function pvalObj(fieldName) {
    var parent = getParentDocument();
    var rtn = "";
    if (parent != null) {
        rtn = parent.getItemValue(fieldName);
    }
    return rtn;
}

/**
 * 获取父文档字段字符串值
 */
function pvalStr(fieldName) {
    var parent = getParentDocument();
    var rtn = "";
    if (parent != null) {
        rtn = parent.getItemValueAsString(fieldName);
    }
    return rtn;
}

/**
 * 获取表单字段数字值
 *
 * @param fieldName
 *            字段名称
 */
function valDouble(fieldName, doc) {
    if (!doc) {
        doc = currentDoc();
    }
    if (doc) {
        return doc.getItemValueAsDouble(fieldName);
    }

    return "";
}

function valInt(fieldName, doc) {
    if (!doc) {
        doc = currentDoc();
    }
    if (doc) {
        return doc.getItemValueAsInt(fieldName);
    }

    return "";
}

/**
 * 获取表单字段数字值
 *
 * @param fieldName
 *            字段名称
 */
function valDate(fieldName, doc) {
    if (!doc) {
        doc = currentDoc();
    }
    if (doc) {
        return doc.getItemValueAsDate(fieldName);
    }

    return null;
}

/**
 * 获取当前文档
 *
 * @returns
 */
function currentDoc() {
    var doc = $CURRDOC.getCurrDoc();
    return doc;
}

/**
 * 合并多个文档Item值到表单新建的文档中，如果字段名称相同则自动赋值，如果不同需要复制可以通过fieldNameMap进行映射
 *
 * @param formName
 * @param fieldNameMap
 * @param docs
 *            [doc1, doc2]
 * @returns
 */
function mergeDocuments(formName, docs, fieldNameMap) {
    var form = getFormProcess().doViewByFormName(formName, getApplication());
    var paramsTable = createParamsTable();
    var newDoc = form.createDocument(paramsTable, getWebUser());

    each(docs, function(doc, index) {
        copyItems(doc, newDoc, fieldNameMap);
    });

    return newDoc;
}

/**
 * 复制源文档的Item值到新文档中, 如果字段名称相同则自动赋值，如果不同需要复制可以通过fieldNameMap进行映射
 *
 * @param formName
 * @param fieldNameMap
 * @param doc
 * @returns
 */
function copyItems(sorceDoc, targetDoc, fieldNameMap) {
    var map = sorceDoc.toMap();
    each(map, function(key, val, index) {
        var fieldName = key;
        if (fieldNameMap && fieldNameMap[key]) {
            fieldName = fieldNameMap[key];
        }

        var item = targetDoc.findItem(fieldName);
        if (item != null) {
            item.setValue(sorceDoc.getItemValue(key));
        }
    });

    return targetDoc;
}

/**
 * 插入信息到另外一张表，需要复制的字段在map中声明
 *
 * @param formName
 * @param fieldNameMap
 *            {源文档字段名：目标文档字段名}
 * @param parentid
 *            (可选) 父表单ID
 */
function insertDocumentByMap(formName, fieldNameMap, doc, parentid) {
    var form = getFormProcess().doViewByFormName(formName, getApplication());
    var map = doc.toMap();
    var paramsTable = createParamsTable();
    if (!isEmpty(parentid)) {
        paramsTable.setParameter("parentid", parentid);
    }
    var newDoc = form.createDocument(paramsTable, getWebUser());
    // println(doc);
    each(map, function(key, val, index) {
        var fieldName = key;
        if (fieldNameMap[key]) {
            fieldName = fieldNameMap[key];
        }

        var item = newDoc.findItem(fieldName);
        if (item != null) {
            item.setValue(doc.getItemValue(key));
        }
    });
    getDocumentProcess().doCreate(newDoc);
    // println(newDoc);
}
/**
 *
 * @param formName
 *            表单名
 * @param fieldValueMap
 *            {源文档字段名：字段值}
 * @param parentid
 *            父表单ID
 */
function insertDocumentByMapValues(formName, fieldValueMap, parentid) {
    var form = getFormProcess().doViewByFormName(formName, getApplication());
    var paramsTable = createParamsTable();
    if (!isEmpty(parentid)) {
        paramsTable.setParameter("parentid", parentid);
    }
    var newDoc = form.createDocument(paramsTable, getWebUser());
    // println(doc);
    each(fieldValueMap, function(key, val, index) {
        var item = newDoc.findItem(key);
        if (item != null) {
            item.setValue(val);
        }
    });
    getDocumentProcess().doCreate(newDoc);
}

/**
 * 创建新对象，把数据插入另外一张表里
 *
 * @param formName
 *            表单名
 * @param formId
 *            表单id
 * @param fieldNames
 *            字段名,数组或字符串
 * @param fieldValues
 *            字段值,数组或字符串
 * @param parentDoc
 *            父文档,可不传
 * @param isDateNames
 *            date类型的字段名（可不传）（string类型）
 * @param isDateValues
 *            date 类型的值 （可不传）（date类型）
 */
function insertDocument(formName, formId, fieldNames, fieldValues, author,
                        parentDoc, isDateNames, isDateValues) {
    var process = getDocProcess($WEB.getApplication());
    var userProcess = getUserProcess();
    var uuid = new Packages.com.yunbo.util.sequence.Sequence();
    var document = new Packages.com.yunbo.core.dynaform.document.ejb.Document();
    var webUser = new Packages.com.yunbo.core.user.action.WebUser(userProcess
        .doView(author));
    document.setId(uuid.getSequence());
    if (parentDoc)
        document.setParent(parentDoc);
    document.setFormname(formName);
    document.setAuthor(webUser);
    document.setFormid(formId);
    document.setIstmp(false);
    document.setApplicationid(getApplication());
    document.setLastmodifier(webUser.getId());
    document.setDomainid(getDomainid());
    document
        .setAuthorDeptIndex(webUser.getDefaultDepartmentVO().getIndexCode());
    document.setMappingId(document.getId());
    var count = 1;
    var fieldName = "";
    var fieldValue = "";
    if (fieldNames.constructor == Array) {
        count = fieldNames.length;
    } else {
        fieldName = fieldNames;
    }
    if (fieldValues.constructor != Array) {
        fieldValue = fieldValues;
        if (fieldValue.length() > 255) {
            document.addTextItem(fieldName, fieldValue);
        } else {
            document.addStringItem(fieldName, fieldValue);
        }
    } else {
        for ( var i = 0; i < count; i++) {
            if (fieldValues[i].length > 255) {
                document.addTextItem(fieldNames[i], fieldValues[i]);
            } else {
                document.addStringItem(fieldNames[i], fieldValues[i]);
            }
        }
    }
    if (isDateNames && isDateValues) {
        var datecount = 1;
        var dateName = "";
        var dateValue = "";
        if (isDateNames.constructor == Array) {
            datecount = isDateNames.length;
        } else {
            dateName = isDateNames;
        }
        if (isDateValues.constructor != Array) {
            dateValue = isDateValues;
            document.addDateItem(dateName, dateValue);
        } else {
            for ( var i = 0; i < datecount; i++) {
                document.addDateItem(isDateNames[i], isDateValues[i]);
            }
        }
    }
    process.doCreate(document);
}

// 根据某个字段值更新其他字段
function updateStatus(fieldName, fieldValues, updateField, updateValues,
                      description) {
    var doc = getCurrentDocument();
    var process = getDocProcess($WEB.getApplication());
    var value = getItemValue(fieldName);
    for ( var i = 0; i < fieldValues.length; i++) {
        if (value == fieldValues[i]) {
            doc.findItem(updateField).setValue(updateValues[i]);
            process.doUpdate(doc);
            break;
        }
    }
    if (description) {
        return description;
    }
}

/**
 * 遍历数组或集合
 *
 * @param list
 *            数组或集合
 * @param callback
 *            回调函数
 *
 * 函数示例: each(['A','B','C'], function(obj, index){ println(obj + index); // A0,
 * B1, C2 });
 *
 */
function each(list, callback) {
    if (getObjectUtil().isMap(list)) {
        var map = getConvertUtil().toMap(list);
        var i = 0;
        for ( var iter = map.entrySet().iterator(); iter.hasNext(); i++) {
            var entry = iter.next();
            if (false == callback(entry.getKey(), entry.getValue(), i)) {
                break;
            }
        }
        ;
    } else {
        var array = getConvertUtil().toArray(list);
        for ( var i = 0; i < array.length; i++) {
            var obj = array[i];
            if (false == callback(obj, i)) {
                break;
            }
        }
    }
}

/**
 * 生成UUID序列号
 *
 * @returns
 */
function seq() {
    var rtn = Packages.com.yunbo.util.sequence.Sequence.getSequence();
    return rtn;
}

/**
 * 文档复制
 *
 * @param id
 *            文档ID
 * @param withChild
 *            是否包含子文档
 */
function copyDocument(id, withChild) {
    if (!isEmpty(id)) {
        var parent = getDocumentProcess().doView(id);
        if (parent != null) {
            var cloneParent = parent.clone();
            cloneParent.setId(seq()); // 重新设置ID
            getDocumentProcess().doCreate(cloneParent);

            // 复制子文档
            if (withChild) {
                var children = parent.getChilds();
                if (children != null && children.size() > 0) {
                    each(children, function(child, index) {
                        var cloneChild = child.clone();
                        cloneChild.setId(seq());
                        cloneChild.setParent(cloneParent.getId());

                        getDocumentProcess().doCreate(cloneChild);
                    });
                }
            }
        }
    }
}

/**
 * 新建Map
 *
 * @returns {Packages.java.util.HashMap}
 */
function createMap() {
    return new Packages.java.util.HashMap();
}

function createList() {
    return new Packages.java.util.ArrayList();
}


importPackage(Packages.com.yunbo.core.macro.runner);
importPackage(Packages.com.yunbo.util.file); // 文件工具
importPackage(Packages.com.yunbo.util.http); // Http、URL工具
importPackage(Packages.com.yunbo.util.mail); // 邮件工具

/**
 * 公共变量MAP对象
 */
var GLOBAL_MAP = new Packages.java.util.HashMap();

/**
 * 获取日期工具
 * @returns
 */
function getDateUtil(){
    return $TOOLS.DATE_UTIL;
}

function getDataPackage(){
    return $DATAS;
}

function getAuthUtil(){
    return new Packages.com.yunbo.util.AuthUtil();
}

/**
 * 获取当前打开文档的ID
 *
 * @return 获取当前打开文档的ID
 */
function getId() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getId();
    }
    return "";
}

/**
 * 获取当前打开文档中Item的值
 *
 * @return 获取当前打开文档中Item的值
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValue(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取当前打开文档中Item的值,且以字符串形式返回
 *
 * @return 获取当前打开文档中Item的值,且以字符串形式返回
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValueAsString(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取当前打开文档中Item的值,且以日期形式返回
 *
 * @return 获取当前打开文档中Item的值,且以日期形式返回
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValueAsDate(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsDate(fieldName);
    }
    return null;
}

/**
 * 获取当前打开文档中Item的值,且以double形式返回
 *
 * @return 获取当前打开文档中Item的值,且以double形式返回
 *
 * @param fieldName
 *            当前打开文档的字段名
 */
function getItemValueAsDouble(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsDouble(fieldName);
    }
    return 0;
}

/**
 * @return 获取当前打开文档中Item的值,且以整型值形式返回
 *
 * @param fieldName:当前打开文档的字段名
 */
function getItemValueAsInt(fieldName) {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getItemValueAsInt(fieldName);
    }
    return 0;
}

/**
 * 根据子文档名，获取当前文档的子文档个数
 *
 * @return 根据子文档名，获取当前文档的子文档个数
 *
 * @param formName
 *            当前打开文档的子文档名
 */
function countSubDocument(formName) {
    var doc = $CURRDOC.getCurrDoc();
    var total = 0;
    if (doc != null) {
        if (doc != null) {
            var subdocs = doc.getChilds(formName);
            if (subdocs != null && subdocs.size() > 0) {
                total = subdocs.size();
            }
        }
    }
    return total;
}

/**
 * 根据子文档名和字段名，获取当前打开文档的子文档中字段的值总和
 *
 * @return 根据子文档名和字段名，获取当前打开文档的子文档中字段的值总和
 *
 * @param formName
 *            当前打开文档的子文档名
 * @param fieldName
 *            子文档的字段名
 */
function sumSubDocument(formName, fieldName, execludeId) {
    var doc = $CURRDOC.getCurrDoc();
    var accurateCalculate = $BEANFACTORY
        .createObject("com.yunbo.util.Arith");
    var total = 0;
    if (doc != null) {
        var subdocs = doc.getChilds(formName);
        if (subdocs != null && subdocs.size() > 0) {
            for (var iter = subdocs.iterator(); iter.hasNext();) {
                var subdoc = iter.next();
                if (!subdoc.getId().equals(execludeId)){
                    total += subdoc.getItemValueAsDouble(fieldName);
                }
            }
        }
    }
    return accurateCalculate.round(total, 2);
}

/**
 * 返回当前打开文档对象
 *
 * @return 返回当前打开文档对象
 */
function getCurrentDocument() {
    var doc = $CURRDOC.getCurrDoc();
    return doc;
}

/**
 * 返回当前登录用户所属企业域ID
 *
 * @return 返回当前登录用户所属企业域ID
 */
function getDomainid() {
    return $WEB.getDomainid();
}

/**
 * 返回当前打开文档的父文档对象
 *
 * @return 返回当前打开文档的父文档对象
 */
function getParentDocument() {
    var doc = $CURRDOC.getCurrDoc();
    var parentid = getParameter("parentid");
    var user = $WEB.getWebUser();
    var parent = null;

    if (user != null) {
        // 以参数获取
        if (parentid != null) {
            parent = user.getFromTmpspace(parentid);
        }

        // 以对象获取
        if (parent == null && doc != null) {
            if (doc.getParentid() != null) {
                parent = user.getFromTmpspace(doc.getParentid());
            }
        }
    }

    if (parent == null && doc != null) {
        parent = doc.getParent();
    }

    return parent;
}

/**
 * 获取关联的文档，当包含元素不存在父子关系时生效
 *
 * @return 获取关联的文档，当包含元素不存在父子关系时生效
 */
function getRelateDocument() {
    return getParentDocument();
}

/**
 * 获取文档中Item的值,且以字符串形式返回
 *
 * @return 获取文档中Item的值,且以字符串形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValue(docid, fieldName) {

    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取文档中Item的值,且以字符串形式返回
 *
 * @return 获取文档中Item的值,且以字符串形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsString(docid, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsString(fieldName);
    }
    return "";
}

/**
 * 获取文档中Item的值,且以double形式返回
 *
 * @return 获取文档中Item的值,且以double形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsDouble(docid, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsDouble(fieldName);
    }
    return 0.0;
}

/**
 * 获取文档中Item的值,且以日期形式返回
 *
 * @return 获取文档中Item的值,且以日期形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsDate(docid, fieldName) {

    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsDate(fieldName);
    }
    return null;
}

/**
 * 获取文档中Item的值,且以整型值形式返回
 *
 * @return 获取文档中Item的值,且以整型值形式返回
 *
 * @param docid
 *            文档的id标识
 * @param fieldName
 *            文档的字段名
 */
function getDocItemValueAsInt(docid, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    if (doc != null) {
        return doc.getItemValueAsInt(fieldName);
    }
    return 0;
}

/**
 * 根据给定的docid，获取Document对象
 *
 * @return 根据给定的docid，获取Document对象
 *
 * @param docid
 *            文档的id标识
 */
function findDocument(docid) {
    var process = getDocProcess($WEB.getApplication());
    var doc = process.doView(docid);
    return doc;
}

/**
 * 根据dql查询符合条件的Document，结果以Collection返回
 *
 * @return 根据dql查询符合条件的Document，结果以Collection返回
 *
 * @param dql
 *            dql查询符合条件语句
 */
function queryByDQL(dql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryByDQL(dql, $WEB.getDomainid());
    return dpg.datas;
}

/**
 * 根据dql(带缓存)查询符合条件的Document，结果以Collection返回
 *
 * @return 根据dql(带缓存)查询符合条件的Document，结果以Collection返回
 *
 * @param dql
 *            dql查询符合条件语句
 */
function queryByDQLWithCache(dql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryByDQLWithCache(dql, $WEB.getDomainid());
    if (dpg)
        return dpg.datas;
    return null;
}

/**
 * 根据DQL获取文档
 *
 * @param dql
 *            dql查询符合条件语句
 * @return 根据DQL获取文档
 */
function findByDQL(dql) {
    var process = getDocProcess($WEB.getApplication());
    return process.findByDQL(dql, $WEB.getDomainid());
}

/**
 * 根据SQL获取文档
 *
 * @return 根据SQL获取文档
 *
 * @param sql
 *            sql查询符合条件语句
 */
function findBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    return process.findBySQL(sql, $WEB.getDomainid());
}

/**
 * 根据SQL获取文档带缓存
 *
 * @return 根据SQL获取文档
 *
 * @param sql
 *            sql查询符合条件语句
 */
function findBySQLCache(sql) {
    var process = getDocProcess($WEB.getApplication());
    var dataPackage = process.queryBySQLWithCache(sql, $WEB.getDomainid());
    if (dataPackage != null && dataPackage.datas.size() > 0) {
        return dataPackage.datas.iterator().next();
    }

    return null;
}

/**
 * 根据dql和域名查询符合条件的Document，结果以Collection返回
 *
 * @return 根据dql和域名查询符合条件的Document，结果以Collection返回
 *
 * @param dql
 *            dql查询符合条件语句
 * @param domainName
 *            企业域名称
 */
function queryByDQLDomain(dql, domainName) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryByDQLDomainName(dql, domainName);
    return dpg.datas;
}

/**
 * 根据dql统计符合条件的Document数量
 *
 * @return 根据dql统计符合条件的Document数量
 *
 * @param dql
 *            dql查询符合条件语句
 */
function countByDQL(dql) {
    var process = getDocProcess($WEB.getApplication());
    var count = process.countByDQL(dql, $WEB.getDomainid());
    return count;
}

/**
 * 根据SQL汇总记录数
 *
 * @param sql
 *            SQL查询语句
 * @return 返回统计结果
 */
function countBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    var count = process.countBySQL(sql, $WEB.getDomainid());
    return count;
}

/**
 * 根据dql汇总符合条件的Document的指定字段
 *
 * @return 根据dql汇总符合条件的Document的指定字段
 *
 * @param dql
 *            dql查询符合条件语句
 * @param fieldName
 *            文档的字段名
 */
function sumByDQL(dql, fieldName) {
    var process = getDocProcess($WEB.getApplication());
    var sum = process.sumByDQL(dql, fieldName, $WEB.getDomainid());
    return sum;
}

/**
 * 根据sql汇总符合条件的Document的指定字段
 *
 * @return 根据sql汇总符合条件的Document的指定字段
 *
 * @param sql
 *            sql查询符合条件语句
 * @param fieldName
 *            文档的字段名
 */
function sumBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    var sum = process.sumBySQL(sql, $WEB.getDomainid());
    return sum;
}

/**
 * 检查其参数是否为数字格式的字符串，是返回true,否则返回false
 *
 * @return 检查其参数是否为数字格式的字符串，是返回true,否则返回false
 *
 * @param str
 *            字符串型参数
 */
function isNumberText(str) {
    var retvar = $TOOLS.STRING_UTIL.isNumber(str);
    return retvar;
}

/**
 * 检查其参数是否为日期格式的字符串，是返回true,否则返回false
 *
 * @return 检查其参数是否为日期格式的字符串，是返回true,否则返回false
 *
 * @param str
 *            字符串型参数
 */
function isDateText(str) {
    var retvar = $TOOLS.STRING_UTIL.isDate(str);
    return retvar;
}

/**
 * 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @return 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @param str
 *            需要拆分的字符串
 * @param separator
 *            分割符
 */
function splitText(str, separator) {
    var retvar = $TOOLS.STRING_UTIL.split(str, separator);
    return retvar;
}

/**
 * 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @return 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @param str
 *            需要拆分的字符串
 * @param separator
 *            分割字串
 */
function splitString(str, separator) {
    var retvar = $TOOLS.STRING_UTIL.splitString(str, separator);
    return retvar;
}

/**
 * 将指定的字符串数组按照指定的分隔符组合成字符串，返回字符串
 *
 * @return 将指定的字符串数组按照指定的分隔符组合成字符串，返回字符串
 *
 * @param strs
 *            字符串数组
 */
function joinText(strs) {
    var retvar = $TOOLS.STRING_UTIL.unite(strs);
    return retvar;
}

/**
 * 获取当日日期
 *
 * @return 获取当日日期
 */
function getToday() {
    var retvar = $TOOLS.DATE_UTIL.getToday();
    return retvar;
}

function getTodayWhenEmpty(fieldName){
    var val = getItemValueAsDate(fieldName);
    if (val && !"".equals(val) && val != 'null') {
        return val;
    }

    return getToday();
}

/**
 * 获取日期
 *
 * @return 获取日期
 *
 * @param date
 *            日期型参数
 */
function getDay(date) {
    var retvar = $TOOLS.DATE_UTIL.dayOfDate(date);
    return retvar;
}

/**
 * 获取月份
 *
 * @return 获取月份
 *
 * @param date
 *            日期型参数
 */
function getMonth(date) {
    var retvar = $TOOLS.DATE_UTIL.monthOfDate(date);
    return retvar;
}

/**
 * 获取年份
 *
 * @return 获取年份
 *
 * @param date
 *            日期型参数
 */
function getYear(date) {
    var retvar = $TOOLS.DATE_UTIL.yearOfDate(date);
    return retvar;
}

/**
 * 将字符串按给定格式转换为日期型
 *
 * @return 将字符串按给定格式转换为日期型
 *
 * @param str
 *            待转换的字符串,需符合format指定的格式
 * @param format
 *            日期格式
 */
function parseDate(str, format) {
    var retvar = $TOOLS.DATE_UTIL.parseDate(str, format);
    return retvar;
}

/**
 * 获取相隔年份数
 *
 * @return 获取相隔年份数
 *
 * @param startDate
 *            “yyyy-MM-dd”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd”格式的字符串
 */
function diffYears(startDate, endDate) {
    var retvar = $TOOLS.DATE_UTIL.getDistinceYear(startDate, endDate);
    return retvar;
}

/**
 * 获取相隔月份数
 *
 * @return 获取相隔月份数
 *
 * @param startDate
 *            “yyyy-MM-dd”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd”格式的字符串
 */
function diffMonths(startDate, endDate) {
    var retvar = $TOOLS.DATE_UTIL.getDistinceMonth(startDate, endDate);
    return retvar;
}

/**
 * 获取相隔天数
 *
 * @return 获取相隔天数
 *
 * @param startDate
 *            “yyyy-MM-dd”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd”格式的字符串
 */
function diffDays(startDate, endDate) {
    var retvar = $TOOLS.DATE_UTIL.getDistinceDay(startDate, endDate);
    return retvar;
}

/**
 * 校正年份
 *
 * @return 校正年份
 *
 * @param date
 *            日期型参数
 * @param num
 *            正负整数
 */
function adjustYear(date, num) {
    var retvar = $TOOLS.DATE_UTIL.getNextDateByYearCount(date, num);
    return retvar;
}

/**
 * 校正月份
 *
 * @return 校正月份
 *
 * @param date
 *            日期型参数
 * @param num
 *            正负整数
 */
function adjustMonth(date, num) {
    var retvar = $TOOLS.DATE_UTIL.getNextDateByMonthCount(date, num);
    return retvar;
}

/**
 * 校正天数
 *
 * @return 校正天数
 *
 * @param date
 *            日期型参数
 * @param num
 *            正负整数
 */
function adjustDay(date, num) {
    var retvar = $TOOLS.DATE_UTIL.getNextDateByDayCount(date, num);
    return retvar;
}

/**
 * 每次调用时指定计数器都会自动增长1(根据计算器名,以0为基元),可用作生成增长序列号
 *
 * @return 每次调用时指定计数器都会自动增长1(根据计算器名,以0为基元),可用作生成增长序列号
 *
 * @param countLabel
 *            字符串型参数
 */
function countNext(countLabel) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB
        .getApplication());
    var retvar = process.getNextValue(countLabel, $WEB.getApplication(), $WEB
        .getDomainid());
    return retvar;
}

/**
 * 返回“前缀 + 增长序列号”
 *
 * @return 返回“前缀 + 增长序列号”
 *
 * @param headText
 *            作为前缀的字符串
 * @param isYear
 *            boolean型,前缀中是否包含年份
 * @param isMonth
 *            boolean型,前缀中是否包含月份
 * @param isDay
 *            boolean型,前缀中是否包含日期
 * @param digit
 *            数值型，指定增长序列号的位数
 */
function countNext2(headText, isYear, isMonth, isDay, digit) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB
        .getApplication());

    var dateUtil = $BEANFACTORY.createObject("com.yunbo.util.DateUtil");

    var countLabel = headText;
    if (isYear) {
        countLabel += dateUtil.format(dateUtil.getToday(), "yyyy");
    }
    if (isMonth) {
        countLabel += dateUtil.format(dateUtil.getToday(), "MM");
    }
    if (isDay) {
        countLabel += dateUtil.format(dateUtil.getToday(), "dd");
    }
    var count = process.getNextValue(countLabel, $WEB.getApplication(), $WEB
        .getDomainid());
    var val = "";
    if (count < 10) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else
        val += count;
    var retvar = countLabel + val;
    return retvar;
}

/**
 * 当字段没值时自动生成序列号
 * @param filedName 字段名称
 * @param headText 序列号前缀
 * @param isYear 是否加入年
 * @param isMonth 是否加入月
 * @param isDay 是否加入日
 * @param digit 序列号位数
 */
function countNextWhenEmpty(fieldName, headText, isYear, isMonth, isDay, digit) {
    var val = getItemValue(fieldName);
    if (val && !"".equals(val) && val != 'null') {
        return val;
    }

    return countNext2(headText, isYear, isMonth, isDay, digit);
}

/**
 * 根据计数器名称获取计数器的当前计数值
 *
 * @return 根据计数器名称获取计数器的当前计数值
 *
 * @param countLabel
 *            字符串型参数
 */
function getLastCount(countLabel) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB
        .getApplication());
    var retvar = process.getLastValue(countLabel, $WEB.getApplication(), $WEB
        .getDomainid());
    return retvar;
}

/**
 * 返回“前缀 +年月日+ 计数器的当前计数值”
 *
 * @return 返回“前缀 +年月日+ 计数器的当前计数值”
 *
 * @param headText
 *            作为前缀的字符串
 * @param isYear
 *            boolean型,前缀中是否包含年份
 * @param isMonth
 *            boolean型,前缀中是否包含月份
 * @param isDay
 *            boolean型,前缀中是否包含日期
 * @param digit
 *            数值型，指定增长序列号的位数
 */
function getLastCount2(headText, isYear, isMonth, isDay, digit) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB
        .getApplication());

    var dateUtil = $BEANFACTORY.createObject("com.yunbo.util.DateUtil");

    var countLabel = headText;
    if (isYear) {
        countLabel += dateUtil.format(dateUtil.getToday(), "yy");
    }
    if (isMonth) {
        countLabel += dateUtil.format(dateUtil.getToday(), "MM");
    }
    if (isDay) {
        countLabel += dateUtil.format(dateUtil.getToday(), "dd");
    }
    var count = process.getLastValue(countLabel, $WEB.getApplication(), $WEB
        .getDomainid());
    var val = "";
    if (count < 10) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000000) {
        for (var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else
        val += count;
    var retvar = countLabel + val;
    return retvar;
}

/**
 * 重置以其参数为类型生成的计算累计值,使其归0
 *
 * @param countLabel
 *            字符串型参数
 */
function resetCounter(countLabel) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB
        .getApplication());
    process.doRemoveByName(countLabel, $WEB.getApplication(), $WEB
        .getDomainid());
}

/**
 * 返回项目id号
 *
 * @return 返回项目id号
 */
function getApplication() {
    return $WEB.getApplication();
}

/**
 * 返回当前登录用户对象
 *
 * @return 返回当前登录用户对象
 */
function getWebUser() {
    return $WEB.getWebUser();
}

/**
 * 判断是否为正数
 *
 * @return 判断是否为正数
 *
 * @param num
 *            数字型参数
 */
function isPositive(num) {
    if (num > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断是否为负数
 *
 * @return 判断是否为负数
 *
 * @param num
 *            数字型参数
 */
function isNegative(num) {
    if (num < 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 提供精确的小数位四舍五入处理
 *
 * @return 提供精确的小数位四舍五入处理
 *
 * @param num
 *            需要四舍五入的数字
 * @param pos
 *            小数点后保留几位
 */
function round(num, pos) {
    var accurateCalculate = $BEANFACTORY
        .createObject("com.yunbo.util.Arith");
    return accurateCalculate.round(num, pos);
}

/**
 * 返回符合查询符合条件语句的文档中keyFieldName字段的所有值集合，作为下拉框控件的选项
 *
 * @return 返回符合查询符合条件语句的文档中keyFieldName字段的所有值集合，作为下拉框控件的选项
 *
 * @param dql
 *            查询符合条件语句
 * @param keyFieldName
 *            文档的字段名(当为数组时[0]作为真实值，[1]作为显示值)
 * @param blankFirst
 *            默认是否为空选项
 */
function getOptionsByDQL(dql, keyFieldName, blankFirst) {
    var opts = $TOOLS.createOptions();
    if (blankFirst) {
        opts.add("", "");
    }
    var docs = queryByDQL(dql);
    for (var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var value = "";
        var text = "";
        if (keyFieldName.constructor == Array) {
            value = doc.getItemValueAsString(keyFieldName[0]);
            text = doc.getItemValueAsString(keyFieldName[1]);
        } else {
            value = doc.getItemValueAsString(keyFieldName);
            text = doc.getItemValueAsString(keyFieldName);
        }

        opts.add(text, value);
    }
    return opts;
}

/**
 * 返回大于等于其数字参数的最小整数
 *
 * @return 返回大于等于其数字参数的最小整数
 *
 * @param num
 *            数字参数
 */
function toCeil(num) {
    return Math.ceil(num);
}

/**
 * 返回小于等于其数字参数的最大整数
 *
 * @return 返回小于等于其数字参数的最大整数
 *
 * @param num
 *            数字参数
 */
function toFloor(num) {
    return Math.floor(num);
}

/**
 * 检查其参数是否为电子邮箱地址格式的字符串，是返回true,否则返回false
 *
 * @return 检查其参数是否为电子邮箱地址格式的字符串，是返回true,否则返回false
 *
 * @param str
 *            字符串型参数
 */
function isMailAddressText(str) {
    var t = /^\w+@\w+(\.\w+)+/;
    var g = /^\w+\.\w+@\w+(\.\w+)+/;
    if (t.test(str) == false && g.test(str) == false) {
        return false;
    }
    return true;
}

/**
 * 按其参数指定的格式获取当前时间，并以字符串的形式返回
 *
 * @return 按其参数指定的格式获取当前时间，并以字符串的形式返回
 * @param date
 *            日期型参数
 * @param formatText
 *            字符串型参数，指定需要显示的格式，如"yyyy-MM-dd HH:mm:ss"
 */
function getCurDate(formatText) {
    return $TOOLS.DATE_UTIL.format($TOOLS.DATE_UTIL.getToday(), formatText);
}

/**
 * 获取相隔小时数
 *
 * @return 获取相隔小时数
 *
 * @param startDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 */
function diffHours(startDate, endDate) {
    var diff = $TOOLS.DATE_UTIL.getDistinceTime(startDate, endDate);
    return diff;
}

function diffHoursOfDate(startDate, endDate) {
    var diff = $TOOLS.DATE_UTIL.getDistinceHour(startDate, endDate);
    return diff;
}

/**
 * 根据偏移量和类型调整日期
 * @param date
 * @param type
 * @param amount
 */
function adjustDate(date, type, amount) {
    var newDate = $TOOLS.DATE_UTIL.roll(date, type, amount);
    return newDate;
}

/**
 * 根据不同的类型，获取此类型的第一天
 * @param date 日期
 * @param type(week,month,year) 周、月、年
 */
function getFirstDayByType(date, type) {
    var newDate = $TOOLS.DATE_UTIL.getFirstDayByType(date, type);
    return newDate;
}

/**
 * 根据不同的类型，获取此类型的最后一天
 * @param date 日期
 * @param type(week,month,year) 周、月、年
 */
function getLastDayByType(date, type) {
    var newDate = $TOOLS.DATE_UTIL.getLastDayByType(date, type);
    return newDate;
}

function getFirstDayOfMonth(yearStr, monthStr) {
    var newDate = $TOOLS.DATE_UTIL.getFirstDay(yearStr, monthStr);
    return newDate;
}

function getLastDayOfMonth(yearStr, monthStr) {
    var newDate = $TOOLS.DATE_UTIL.getLastDay(yearStr, monthStr);
    return newDate;
}

/**
 * 获取相隔工作天数
 *
 * @return 获取相隔工作天数
 *
 * @param startDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 */
function getWorkingDayCount(startDate, endDate) {
    var user = $WEB.getWebUser();
    var count = $TOOLS.DATE_UTIL.getWorkingDayCount(startDate, endDate, user
        .getCalendarType());
    return count;
}

/**
 * 获取相隔工作小时数
 *
 * @return 获取相隔工作小时数
 * @param startDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 */
function getWorkingTimesCount(startDate, endDate) {//无该方法
    var user = $WEB.getWebUser();
    var count = $TOOLS.DATE_UTIL.getWorkingTimesCount(startDate, endDate, user
        .getCalendarType());
    return count;
}
/**
 * 生成系统类对象
 *
 * @return 生成系统类对象
 * @param pathText
 *            类的名字空间,如"com.yunbo.util.DateUtil";
 *
 */
function createObject(pathText) {
    var obj = $BEANFACTORY.createObject(pathText);
    return obj;
}

/**
 * 生成系统类对象
 *
 * @return 生成系统类对象
 * @param pathText
 *            类的名字空间,如"com.yunbo.core.department.ejb.DepartmentProcess";
 *
 */
function createProcess(pathText) {
    var process = $PROCESSFACTORY.createProcess(pathText);
    return process;
}

/**
 * 返回文档操作对象
 *
 * @param applicationid
 *            软件标识ID
 * @return 文档操作对象
 */
function getDocProcess(applicationid) {
    return Packages.com.yunbo.core.dynaform.document.ejb.DocumentProcessBean
        .createMonitoProcess(applicationid);
}

/**
 * 返回文件上传对象
 *
 * @param applicationid
 *            软件标识ID
 * @return 文件上传对象
 */
function getUploadProcess(applicationid) {
    return Packages.com.yunbo.core.upload.ejb.UploadProcessBean
        .createMonitoProcess(applicationid);
}

/**
 * 获取参数列表对象，可以对参数进行基本的增,删和格式化参数
 *
 * @return 参数列表对象
 */
function getParamsTable() {
    return $WEB.getParamsTable();
}

/**
 * 创建参数对象
 *
 * @return 返回ParamsTable的新实例对象
 */
function createParamsTable() {
    return new Packages.com.yunbo.base.action.ParamsTable();
}

/**
 * 获取参数值,以字符串的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值
 *
 */
function getParameter(paramName) {
    return $WEB.getParameterAsString(paramName);
}

/**
 * 获取参数值,以";"进行切割格式化成文本型,以字符串的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值
 */
function getParameterAsText(paramName) {
    return $WEB.getParameterAsText(paramName);
}

/**
 * 获取参数值,以浮点型的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值
 *
 */
function getParameterAsDouble(paramName) {
    return $WEB.getParameterAsDouble(paramName);
}

/**
 * 获取参数值,并以字符数组的形式返回
 *
 * @param paramName
 *            参数名;
 * @return 返回参数值，以字符数组对象返回
 */
function getParameterAsArray(paramName) {
    var params = $WEB.getParameterAsArray(paramName);
    if (params!=null && params.length==1 && params[0]!=null && params[0].indexOf(";")>0)
        params = splitText(params[0],";");
    return params;
}

/**
 * 获取参数值,并以日期的形式返回
 * @param paramName
 * @returns
 */
function getParameterAsDate(paramName) {
    var date = $WEB.getParameterAsDate(paramName);
    return date;
}

/**
 * 返回的部分请求的URI，指示请求的范围内。 上下文路径总是先在一个请求的URI。 路径以一个“/”字符，但并没有结束的"/"字符。
 * 在默认（根）Servlet的情况下，此方法返回""。该容器不解码此字符串。
 *
 * @return 一个String指定请求的URI部分，指示请求的上下文
 */
function getContextPath() {
    return $WEB.getParamsTable().getContextPath();
}

/**
 * 判断值是否不为空,为数字时不为0,为字符串时长度大于0,为日期时不为null
 *
 * @return 判断值是否不为空,为数字时不为0,为字符串时长度大于0,为日期时不为null
 * @param val
 *            要作判断的值;
 */
function isNotNull(val) {
    if (val != null && typeof(val) != "undefined") {
        if (typeof(val) == "number") {
            return (val != 0);
        }
        return (new java.lang.String(val).trim().length() > 0);
    }
    return false;
}
/**
 * 根据sql查询符合条件的Document，结果以Collection返回
 *
 * @param sql
 *            查询语句参数
 * @return 根据sql查询符合条件的Document，结果以Collection返回
 */
function queryBySQL(sql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryBySQL(sql, $WEB.getDomainid());
    if (dpg != null) {
        return dpg.datas;
    } else {
        return null;
    }
}
/**
 * 根据sql(带缓存）查询符合条件的Document，结果以Collection返回
 *
 * @param sql
 *            查询语句参数
 * @return 根据sql查询符合条件的Document，结果以Collection返回
 */
function queryBySQLWithCache(sql) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryBySQLWithCache(sql, $WEB.getDomainid());
    if (dpg != null) {
        return dpg.datas;
    } else {
        return null;
    }
}
/**
 * 创建警告对话框
 *
 * @param content
 *            警告信息参数
 * @return 创建警告对话框
 */
function createAlert(content) {
    return new JsMessage(JsMessage.TYPE_ALERT, content);
}
/**
 * 创建提示对话框
 *
 * @param content
 *            提示内容参数
 * @return 返回true|false；true: 表示确认；false: 表示取消。
 */
function createConfirm(content) {
    return new JsMessage(JsMessage.TYPE_CONFIRM, content);
}

/**
 * 生成选项对象
 *
 * @return 生成选项对象
 */
function createOptions() {
    return $TOOLS.createOptions();
}

/**
 * 发送站内信，手机短信，邮件method是选择发送方式 content是描述发送何种结果
 * 10 -站内短信通知
 * 20 -手机短信通知
 * 30 -电子邮件通知
 */
function sendMessageByMethod(senderid, receivers, title, content, method) {
    if (method.indexOf("10") > -1) {
        sendMessageByUsers(senderid, receivers, title, content);
    }
    if (method.indexOf("20") > -1) {
    }
    if (method.indexOf("30") > -1) {
        sendEmailByUsers(senderid, receivers, title, content);
    }
}

/**
 * 发送站内短信
 * @returns
 */
function sendMessageByUsers(senderid, receivers, title, content) {
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    if (receivers) {
        for (var it = receivers.iterator(); it.hasNext() ;) {
            var receiver = it.next();
            process.doCreate(senderid, receiver.getId(), title, content);
        }
    }
}

/**
 * 发送邮件
 * @returns
 */
function sendEmailByUsers(senderid, receivers, title, content){
    if (receivers) {
        for (var it = receivers.iterator(); it.hasNext() ;) {
            var receiver = it.next();
            if (!isEmpty(receiver.getEmail())) {
                sendEmailBySystemUser(receiver.getEmail(), title, content);
            }
        }
    }
}

/**
 * 发送站内短信
 *
 * @param senderid
 *            发送者ID
 * @param receiverid
 *            接收者ID
 * @param title
 *            标题
 * @param content
 *            内容
 *
 */
function sendMessage(senderid, receiverid, title, content) {
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    process.doCreate(senderid, receiverid, title, content);
}

/**
 * 根据部门发送站内短信
 *
 * @param departmentid
 *            部门ID
 * @param title
 *            标题
 * @param content
 *            内容
 *
 */
function sendMessageByDept(departmentid, title, content) {
    var userid = getWebUser().getId();
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    process.doCreateByDepartment(departmentid, userid, title, content);
}

/**
 * 根据角色发送短信
 *
 * @param roleid
 *            角色ID
 * @param domainid
 *            企业域ID
 * @param title
 *            标题
 * @param content
 *            内容
 *
 */
function sendMessageByRole(roleid, domainid, title, content) {
    var userid = getWebUser().getId();
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    process.doCreateByRole(roleid, domainid, userid, title, content);
}
/**
 * 发送手机短信
 *
 * @param docid
 *            发送模块表单记录ID
 * @param title
 *            标题
 * @param content
 *            内容
 * @param receiver
 *            接收者电话列表,有多个接收者,使用","做分隔符
 * @param isReply
 *            true|false,是否需要收到回复
 * @param isMass
 *            true|false,标识是否为群发,即是否有多位接收者
 */
function sendSMS(docid, title, content, receiver, isReply, isMass) {
    var sender = $MESSAGE.getSMSManager().getSender($WEB.getWebUser());
    return sender.send(docid, title, content, receiver, isReply, isMass);
}

/**
 * 根据发送模块表单记录ID获取接收者手机短信回复记录.结果以Collection返回
 *
 * @return 根据发送模块表单记录ID获取接收者手机短信回复记录.结果以Collection返回
 */
function listReplyByDocid(docid) {
    var data = $MESSAGE.getSMSManager().queryReplyById(docid);
    if (data!=null)
        return data.datas;
    return null;
}
/**
 * 判断唯一性
 *
 * @param fieldName
 *            字段名称
 * @param fieldValue
 *            字段值
 * @param msg
 *            预设字段值重复提示信息
 * @return 如果不唯一返回提示信息，否则返回空字符串
 */
function checkFieldUnique(fieldName, fieldValue, msg) {
    var doc = $CURRDOC.getCurrDoc();
    var dql = "$formname='" + doc.getFormShortName() + "' and " + fieldName + "='"
        + fieldValue + "' and $id <> '" + doc.getId() + "'";
    var dpg = queryByDQL(dql);
    if (dpg.size() > 0) {
        if (msg) {
            return msg;
        }
        return fieldName + " 不能重复!";
    }
    return null;
}

/**
 * 获取当前浏览器session
 *
 * @param sessionName
 *            session属性名
 * @return 获取当前浏览器session
 */
function getSession(sessionName) {
    var request = $WEB.getParamsTable().getHttpRequest();
    if (request != null) {
        return request.getSession().getAttribute(sessionName);
    }
    return null;
}

/**
 * 根据部门等级值获取对应等级的所有部门
 *
 * @param level
 *            部门等级值
 * @return 返回获取到的对应等级的所有部门的集合
 */
function getDepartmentByLevel(level) {
    var process = createProcess("com.yunbo.core.department.ejb.DepartmentProcess");
    return process.getDepartmentByLevel(level, getApplication(), getDomainid());
}

/**
 * 根据部门名称和部门等级获取部门对象ID
 *
 * @param name
 *            部门名称
 * @param level
 *            部门等级值
 * @return 返回对应部门ID
 */
function getDeptIdByNameAndLevel(name, level) {
    var deptlist = getDepartmentByLevel(level);
    if (deptlist != null && deptlist.size() > 0) {
        for (var iter = deptlist.iterator(); iter.hasNext();) {
            var dept = iter.next();
            if (name.equals(dept.getName())) {
                return dept.getId();
            }
        }
    }
    return null;
}
/**
 * 根据角色名取角色ID
 *
 * @param name
 *            角色名称
 * @return 返回对应角色ID
 */
function getRoleIdByName(name) {
    var role = getRoleByName(name);
    if (role != null) {
        return role.getId();
    }
    return null;
}

/**
 * 根据用户登录名取用户ID
 *
 * @param loginno
 *            用户登录名
 * @return 返回对应用户ID
 */
function getUserIdByLoginno(loginno) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.findUserIdByAccount(loginno, getDomainid());
}

/**
 * 获取指定部门的下级部门
 *
 * @param parent
 *            部门ID
 * @return 返回指定部门的下级部门对象的集合
 */
function getDepartmentsByParent(parent) { // parent部门ID
    var process = createProcess("com.yunbo.core.department.ejb.DepartmentProcess");
    return process.getDatasByParent(parent);
}

/**
 * 获取指定部门所有用户
 *
 * @param dptid
 *            部门ID
 * @return 返回指定部门下的所有用户对象的集合
 */
function getUsersByDptId(dptid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByDepartment(dptid);
}

/**
 * 根据角色字符串获取用户
 */
function getUsersRoleName(roleNamesString){
    var list = new Packages.java.util.ArrayList();
    if (!isEmpty(roleNamesString)) {
        var roleNames = roleNamesString.split(";");
        for (var i=0;i<roleNames.length ;i++ ) {
            var roleName = roleNames[i];
            var role = getRoleProcess().doViewByName(roleName, getApplication());
            list.addAll(role.getUsers());
        }
    }
    return list;
}

/**
 * 根据部门ID和角色名称获取用户
 *
 * @param dptid 部门ID
 * @param roleName 角色名称
 *
 * @returns Collection<BaseUser>
 */
function getUsersByDptIdAndRoleName(dptid, roleName) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    var list = new Packages.java.util.ArrayList();
    var users = userProcess.queryByDepartment(dptid);
    for (var iter = users.iterator(); iter.hasNext(); ) {
        var user = iter.next();
        var roleNames = user.getRoleNames();
        if (roleNames.contains(roleName)) {
            list.add(user);
        }
    }

    return list;
}

/**
 * 根据部门字段深度查找用户
 * @param deptFieldName 部门字段名称
 * @returns {Packages.java.util.ArrayList}
 */
function deepSearchUserByDeptField(deptFieldName){
    var devDeptId = getItemValue(deptFieldName);
    var rtn = new Packages.java.util.ArrayList();
    if (!isEmpty(devDeptId)) {
        var devDeptIds = devDeptId.split(";");
        for (var i=0; i<devDeptIds.length; i++) {
            var dept = getDepartmentProcess().doView(devDeptIds[i]);
            rtn.addAll(deepSearchUserByDeptName(dept.getName()));
        }
    }

    return rtn;
}

/**
 * 根据部门名称深度查找用户
 * @param dptName
 * @returns
 */
function deepSearchUserByDeptName(dptName) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.deepSearchUserByDeptName(dptName, webUser.getDomainid());
}

/**
 * 根据部门编号和角色编号查找用户
 * @param dptName
 * @returns
 */
function getUsersByDeptCodeAndRoleCode(dptCode, roleCode) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.getUsersByDeptCodeAndRoleCode(dptCode, roleCode, getApplication(), webUser.getDomainid());
}

/**
 * 根据部门名称和角色名称查找用户
 * @param dptName
 * @returns
 */
function getUsersByDeptNameAndRoleName(deptName, roleName) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.getUsersByDeptNameAndRoleName(deptName, roleName, getApplication(), webUser.getDomainid());
}

function deepSearchUserByDeptCode(dptCode) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.deepSearchUserByDeptCode(dptCode, webUser.getDomainid());
}

/**
 * 获取指定角色下的所有用户
 *
 * @param roleid
 *            角色ID
 * @return 返回指定角色下的所有用户对象的集合
 */
function getUsersByRoleId(roleid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByRole(roleid);
}

/**
 * 获取指定部门并角色的所有用户
 *
 * @param dptid
 *            部门ID
 * @param roleid
 *            角色ID
 * @return 返回指定部门并角色的所有用户对象的集合
 */
function getUsersByDptIdAndRoleId(dptid, roleid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByDptIdAndRoleId(dptid, roleid);
}

/**
 * 获取当前域下面的所有用户
 *
 * @return 返回当前域下面的所有用户对象的集合
 */
function getAllUsers() {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByDomain(getDomainid());
}

/**
 * 获取当前域下面的所有内部用户ID
 * @returns
 */
function getAllUserIds() {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    var users = userProcess.queryByDomain(getDomainid());
    return userProcess.toUserIdsString(users, ";");
}

/**
 * 发送邮件
 *
 * @param from
 *            发送人地址
 * @param to
 *            接收人地址
 * @param subject
 *            主题
 * @param body
 *            内容
 * @param host
 *            邮件服务器地址
 * @param user
 *            邮件服务器用户名
 * @param password
 *            密码
 * @param bbc
 *            秘密抄送地址
 * @param validate
 *            是否校验
 */
function sendMail(from, to, subject, body, host, user, password, bbc, validate) {
    $EMAIL.setEmail(from, to, subject, body, host, user, password, bbc,
        validate);
    $EMAIL.send();
}

/**
 * 发送邮件给所有用户
 *
 * @param from
 *            发送人地址
 * @param subject
 *            主题
 * @param host
 *            邮件服务器地址
 * @param user
 *            邮件服务器用户名
 * @param password
 *            密码
 * @param bbc
 *            秘密抄送地址
 * @param validate
 *            是否校验
 */
function sendMailtoAllUser(from, subject, host, user, password, bbc, validate) {
    $EMAIL.sendMailToAllUser(from, subject, host, account, password, bbc,
        validate);
}

/**
 * 以系统配置的用户发送邮件
 *
 * @param to
 *            接收人地址
 * @param subject
 *            主题
 * @param content
 *            内容
 * @return
 */
function sendEmailBySystemUser(to, subject, content) {
    $EMAIL.sendEmailBySystemUser(to, subject, content);
}

/**
 * 获取当前软件下面的所有角色组别
 *
 * @return 角色组的集合
 */
function getAllRoles() {
    var roleProcess = createProcess("com.yunbo.core.role.ejb.RoleProcess");
    return roleProcess.getRolesByApplication(getApplication());
}

/**
 * 获取当前文档的状态标签
 *
 * @return 返回当前文档的状态标签
 */
function getStateLabel() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getStateLabel();
    }
    return null;
}

/**
 * 获取当前记录是否审批完成
 *
 * @return true|false
 */
function isComplete() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        if (doc.getStateInt() == 0x00100000) {
            return true;
        }
    }
    return false;
}

/**
 * 获取指定文档是否审批完成
 *
 * @param docid
 *            文档ID
 * @return true|false
 */
function isCompleteByDocId(docid) {
    var doc = findDocument(docid);
    if (doc != null) {
        if (doc.getStateInt() == 0x00100000) {
            return true;
        }
    }
    return false;
}

/**
 * 获取当前记录是否处在第一个节点
 *
 * @return true|false
 */
function isFirtNode() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.isFirtNode();
    }
    return false;
}

/**
 * 获取指定文档是否处在第一个节点
 *
 * @param docid
 *            文档ID
 * @return true|false
 */
function isFirtNodeByDocId(docid) {
    var doc = findDocument(docid);
    if (doc != null) {
        return doc.isFirtNode();
    }
    return false;
}

/**
 * 获取父流程文档
 *
 * @return 获取父流程文档
 */
function getParentFlowDoc() {
    var currDoc = $CURRDOC.getCurrDoc();
    if (currDoc != null) {
        doc = currDoc.getParentFlowDocument();
    }

    return doc;
}

/**
 * 子流程开启脚本中使用此函数，可获取到子流程启动的文档对象
 *
 * @return 返回子流程启动文档对象
 */
function getStartDoc() {
    return $STARTUP_DOC;
}

/**
 * 获取子流程文档
 *
 * @return 获取子流程文档
 */
function getSubFlowDocList() {
    var currDoc = $CURRDOC.getCurrDoc();
    if (currDoc != null) {
        return currDoc.getSubFlowDocuments();
    }
}

/**
 * 根据数据源名称，执行SQL查询
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 * @return 返回SQL查询语句执行的结果，以Collection方式返回（存储的是数据记录的Map对象）。
 */
function queryByDSName(dsName,sql){
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    return process.queryDataSourceSQL(dsName,sql,getApplication());
}

/**
 * 根据数据源名称，执行SQL插入操作（SQL语句为：insert table ......）。
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 */
function insertByDSName(dsName,sql){
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    process.queryInsert(dsName,sql,getApplication());
}

/**
 * 根据数据源名称，执行SQL更新操作（SQL语句为：update table set......）。
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 */
function updateByDSName(dsName,sql){
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    process.createOrUpdate(dsName,sql,getApplication());
}

/**
 * 根据数据源名称，执行SQL删除操作（SQL语句为：delete from table ......）。
 *
 * @param dsName
 *            数据源名称
 * @param sql
 *            SQL查询语句
 */
function deleteByDSName(dsName,sql){
    var process = createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
    process.remove(dsName,sql,getApplication());
}

/**
 * 根据用户ID获取用户对象
 *
 * @param userid
 *            用户ID
 * @return 返回用户对象
 */
function getUserById(userid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    if (!isEmpty(userid)) {
        return userProcess.doView(userid);
    }

    return null;
}

/**
 * 根据部门ID获取部门对象
 * @param deptid
 * @returns
 */
function getDeptById(deptid) {
    var deptProcess = getDepartmentProcess();
    if (!isEmpty(deptid)) {
        return deptProcess.doView(deptid);
    }

    return null;
}

/**
 * 部门名称
 * @param fieldName 存储部门ID的字段名称
 */
function getDeptName(fieldName) {
    var id = getItemValue(fieldName);
    var dept = getDepartmentProcess().doView(id);
    var rtn = "";
    if (dept != null) {
        rtn = dept.getName();
    }
    return rtn;
}

/**
 * 根据用户登录名取用户对象
 *
 * @param loginno
 *            用户登录名
 * @return 返回对应用户对象
 */
function getUserByLoginno(loginno) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.login(loginno, getDomainid());
}

/**
 * 根据角色名取角色ID
 *
 * @param name
 *            角色名称
 * @return 返回对应角色对象
 */
function getRoleByName(name) {
    var roleProcess = createProcess("com.yunbo.core.role.ejb.RoleProcess");
    return roleProcess.doViewByName(name, getApplication());
}

/**
 * 返回文档操作对象
 *
 * @return 文档操作对象
 */
function getDocumentProcess() {
    return Packages.com.yunbo.core.dynaform.document.ejb.DocumentProcessBean
        .createMonitoProcess(getApplication());
}

/**
 * 获取数据源业务对象
 *
 * @return 获取数据源业务对象
 */
function getDataSourceProcess() {
    return createProcess("com.yunbo.core.dynaform.dts.datasource.ejb.DataSourceProcess");
}

/**
 * 返回用户操作对象
 *
 * @return 用户操作对象
 */
function getUserProcess() {
    return createProcess("com.yunbo.core.user.ejb.UserProcess");
}

/**
 * 返回部门操作对象
 *
 * @return 部门操作对象
 */
function getDepartmentProcess() {
    return createProcess("com.yunbo.core.department.ejb.DepartmentProcess");
}

/**
 * 返回角色操作对象
 *
 * @return 角色操作对象
 */
function getRoleProcess() {
    return createProcess("com.yunbo.core.role.ejb.RoleProcess");
}
/**
 * 返回表单业务对象
 *
 * @return 返回表单业务对象
 */
function getFormProcess() {
    return createProcess("com.yunbo.core.dynaform.form.ejb.FormProcess");
}
/**
 * 返回视图业务对象
 *
 * @return 返回视图业务对象
 */
function getViewProcess() {
    return createProcess("com.yunbo.core.dynaform.view.ejb.ViewProcess");
}

/**
 * 获取企业域业务对象
 *
 * @return 获取企业域业务对象
 */
function getDomainProcess() {
    return createProcess("com.yunbo.core.domain.ejb.DomainProcess");
}

/**
 * 输出文本到控制台
 *
 * @param text
 *            要输出文本的内容
 */
function println(text){
    $PRINTER.println(text);
}

/**
 * 将数字文本转换成整型并返回
 *
 * @param text
 *            数字文本参数
 * @return 返回整型值
 */
function parseInt(text){
    return $TOOLS.STRING_UTIL.parseInt(text);
}

/**
 * 将数字文本转换成长整型并返回
 *
 * @param text
 *            数字文本参数
 * @return 返回长整型值
 */
function parseLong(text){
    return $TOOLS.STRING_UTIL.parseLong(text);
}

/**
 * 将数字文本转换成浮点型并返回
 *
 * @param text
 *            数字文本参数
 * @return 返回浮点型值
 */
function parseDouble(text){
    return $TOOLS.STRING_UTIL.parseDouble(text);
}

/**
 * 根据文档ID与流程ID获取文档最后审批记录
 * @param docid
 * 			文档ID
 * @param flowid
 * 			流程ID
 * @return 最后审批记录
 */
function getLastRelationHis(docid, flowid){
    var process = new Packages.com.yunbo.core.workflow.storage.runtime.ejb.RelationHISProcessBean(getApplication());
    return process.doViewLast(docid, flowid);
}

/**
 * 获取当前文档的最后审批人
 * @return 最后审批人审批记录
 */
function getLastApprover(){
    var doc = getCurrentDocument();
    var rtn = null;
    var rhis = getLastRelationHis(doc.getId(),doc.getFlowid());
    if (rhis != null) {
        var actors = rhis.getActorhiss();
        if (actors!=null && actors.size()>0) {
            for (var it = actors.iterator(); it.hasNext();) {
                rtn = it.next();
            }
        }
    }
    return rtn;
}

/**
 * 获取当前文档的最后审批人ID
 * @return 审批人ID
 */
function getLastApproverId(){
    return getLastApprover().getActorid();
}

/**
 * 获取当前文档的最后审批人名称
 * @return 审批人名称
 */
function getLastApproverName(){
    return getLastApprover().getName();
}

/**
 * 获取当前文档的最后审批时间
 * @return 审批时间
 */
function getLastApprovedTime(){
    var doc = getCurrentDocument();
    var rtn = "";
    var rhis = getLastRelationHis(doc.getId(),doc.getFlowid());
    if (rhis != null) {
        var actors = rhis.getActorhiss();
        if (actors!=null && actors.size()>0) {
            for (var it = actors.iterator(); it.hasNext();) {
                actorHis = it.next();
                if (actorHis.getProcesstime() != null) {
                    rtn = $TOOLS.DATE_UTIL.getDateTimeStr(actorHis
                        .getProcesstime());
                } else {
                    rtn = $TOOLS.DATE_UTIL.getDateTimeStr(relHis
                        .getActiontime());
                }
            }
        }
    }
    return rtn;
}

/**
 * 根据角色编号和软件id获取角色
 *
 */

function getRoleByRoleNo(roleno, applicationid){
    var process = new Packages.com.yunbo.core.role.ejb.RoleProcessBean();
    var role = process.findByRoleNo(roleno, applicationid);
    if(role != null){
        return role.getName();
    }else{
        return null;
    }

}

/**
 * 更新文档但不更新版本号
 * @param doc
 *  文档对象
 */
function doUpdateDocumentWithoutVersions(doc) {
    var process = getDocumentProcess();
    if(doc !=null){
        doc.setVersions( doc.getVersions()-1);
        process.doUpdate(doc);
    }

}

/**
 * 定义数字格式化类
 * 使用示例：new NumberFormat().format(getItemValueAsDouble("product_version"), "#.##");
 */
function NumberFormat(){
    var init = function (){
    };

    /*this.format = function(number, formatPattern){
        var formatter = new Packages.java.text.DecimalFormat(formatPattern);
        var str = formatter.format(number);
        return str;
    };*/

    init();
};
NumberFormat.format = function(number, formatPattern){
    var formatter = new Packages.java.text.DecimalFormat(formatPattern);
    var str = formatter.format(number);
    return str;
};

function URL(){
    var init = function (){ // 构造函数
    };

    init();
}
URL.encode = function(str){
    var newStr = Packages.com.yunbo.util.http.UrlUtil.encode(str);
    return newStr;
};
URL.decode = function(str){
    var newStr = Packages.com.yunbo.util.http.UrlUtil.decode(str);
    return newStr;
};

/**
 * 获取唯一序列号
 * @returns
 */
function getUUID(){
    return Packages.com.yunbo.util.sequence.Sequence.getSequence();
}


/**
 * 将数字或日期对象转换成字符型，转换过程中可以进行格式化
 *
 * @param obj
 * @param pattern
 * @returns 字符串值
 */
function format(obj, pattern) {
    return getConvertUtil().format(obj, pattern);
}

/**
 * 将字符串转换成日期时间
 *
 * @param str
 * @param pattern
 * @returns
 */
function dateTime(str) {
    return getConvertUtil().dateTime(str);
}

function date(str) {
    return getConvertUtil().date(str);
}

function time(str) {
    return getConvertUtil().time(str);
}

/**
 * 将字符串按格式转换为日期对象
 *
 * @param str
 * @param pattern
 * @returns
 */
function parseDate(str, pattern) {
    return getConvertUtil().parseDate(str, pattern);
}

function parseInt(str) {
    return getConvertUtil().parseInt(str);
}

function parseLong(str) {
    return getConvertUtil().parseLong(str);
}

function parseDouble(str) {
    return getConvertUtil().parseDouble(str);
}

function parseFloat(str) {
    return getConvertUtil().parseFloat(str);
}

function toMap(jsObject) {
    return getConvertUtil().toMap(jsObject);
}
/**
 *
 * @param number
 *            double类型
 * @param formatPattern
 *            格式化成什么类型 #,###
 * @returns
 */
function formatCurrency(number) {
    var formatter = new Packages.java.text.DecimalFormat("#,###.##");
    var str = formatter.format(number);
    return str;
}


/**
 * 获取表单序列号
 *
 * @param length
 *            序列号长度
 * @param dateFormat
 *            序列号日期格式,如：yyyy-MM-dd（可选）
 * @param prefix
 *            序列号前缀，一般为字母（可选）
 * @param fieldName
 *            表单字段名称（可选）
 *
 * @returns
 */
function getFormNumber(length, dateFormat, prefix, fieldName) {
    var rtn = "";
    if (!dateFormat) {
        dateFormat = "";
    }
    if (!prefix) {
        prefix = "";
    }

    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB.getApplication());
    if (fieldName) {
        rtn = valStr(fieldName);
    }
    if (isEmpty(rtn)) {
        rtn = process.getFormNumber(length, dateFormat, prefix, getDomainid());
    }

    return rtn;
}

/**
 * 每次调用时指定计数器都会自动增长1(根据计算器名,以0为基元),可用作生成增长序列号
 *
 * @return 每次调用时指定计数器都会自动增长1(根据计算器名,以0为基元),可用作生成增长序列号
 *
 * @param countLabel
 *            字符串型参数
 */
function countNext(countLabel) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB.getApplication());
    var retvar = process.getNextValue(countLabel, $WEB.getApplication(), $WEB.getDomainid());
    return retvar;
}

/**
 * 返回“前缀 + 增长序列号”
 *
 * @return 返回“前缀 + 增长序列号”
 *
 * @param headText
 *            作为前缀的字符串
 * @param isYear
 *            boolean型,前缀中是否包含年份
 * @param isMonth
 *            boolean型,前缀中是否包含月份
 * @param isDay
 *            boolean型,前缀中是否包含日期
 * @param digit
 *            数值型，指定增长序列号的位数
 */
function countNext2(headText, isYear, isMonth, isDay, digit) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB.getApplication());

    var dateUtil = $BEANFACTORY.createObject("com.yunbo.util.DateUtil");

    var countLabel = headText;
    if (isYear) {
        countLabel += dateUtil.format(dateUtil.getToday(), "yyyy");
    }
    if (isMonth) {
        countLabel += dateUtil.format(dateUtil.getToday(), "MM");
    }
    if (isDay) {
        countLabel += dateUtil.format(dateUtil.getToday(), "dd");
    }
    var count = process.getNextValue(countLabel, $WEB.getApplication(), $WEB.getDomainid());
    var val = "";
    if (count < 10) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else
        val += count;
    var retvar = countLabel + val;
    return retvar;
}

/**
 * 当字段没值时自动生成序列号
 *
 * @param filedName
 *            字段名称
 * @param headText
 *            序列号前缀
 * @param isYear
 *            是否加入年
 * @param isMonth
 *            是否加入月
 * @param isDay
 *            是否加入日
 * @param digit
 *            序列号位数
 */
function countNextWhenEmpty(fieldName, headText, isYear, isMonth, isDay, digit) {
    var val = getItemValue(fieldName);
    if (val && !"".equals(val) && val != 'null') {
        return val;
    }

    return countNext2(headText, isYear, isMonth, isDay, digit);
}

/**
 * 根据计数器名称获取计数器的当前计数值
 *
 * @return 根据计数器名称获取计数器的当前计数值
 *
 * @param countLabel
 *            字符串型参数
 */
function getLastCount(countLabel) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB.getApplication());
    var retvar = process.getLastValue(countLabel, $WEB.getApplication(), $WEB.getDomainid());
    return retvar;
}

/**
 * 返回“前缀 +年月日+ 计数器的当前计数值”
 *
 * @return 返回“前缀 +年月日+ 计数器的当前计数值”
 *
 * @param headText
 *            作为前缀的字符串
 * @param isYear
 *            boolean型,前缀中是否包含年份
 * @param isMonth
 *            boolean型,前缀中是否包含月份
 * @param isDay
 *            boolean型,前缀中是否包含日期
 * @param digit
 *            数值型，指定增长序列号的位数
 */
function getLastCount2(headText, isYear, isMonth, isDay, digit) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB.getApplication());

    var dateUtil = $BEANFACTORY.createObject("com.yunbo.util.DateUtil");

    var countLabel = headText;
    if (isYear) {
        countLabel += dateUtil.format(dateUtil.getToday(), "yy");
    }
    if (isMonth) {
        countLabel += dateUtil.format(dateUtil.getToday(), "MM");
    }
    if (isDay) {
        countLabel += dateUtil.format(dateUtil.getToday(), "dd");
    }
    var count = process.getLastValue(countLabel, $WEB.getApplication(), $WEB.getDomainid());
    var val = "";
    if (count < 10) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 100000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 1000000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else if (count < 10000000) {
        for ( var temp = 1; temp <= digit - count.toString().length; temp++) {
            val += "0";
        }
        val += count;
    } else
        val += count;
    var retvar = countLabel + val;
    return retvar;
}

/**
 * 重置以其参数为类型生成的计算累计值,使其归0
 *
 * @param countLabel
 *            字符串型参数
 */
function resetCounter(countLabel) {
    var process = new Packages.com.yunbo.core.counter.ejb.CounterProcessBean($WEB.getApplication());
    process.doRemoveByName(countLabel, $WEB.getApplication(), $WEB.getDomainid());
}


/**
 * 获取日期工具类
 */
var dateUtil = new Packages.com.yunbo.util.DateUtil();

/**
 * 从日期型数据中获得该日在本月中是几号<br>
 * 例：day("2012-01-15 10:20:30") 返回：15
 */
function day(dateExp) {
    return dateUtil.dayOfDate(dateExp);
}
/**
 * 从日期型数据中获得该日的星期名称 <br>
 * 例：dayName("2012-12-06 14:22:22") 返回：星期三
 *
 * @param dateExp
 */
function dayName(dateExp) {
    return dateUtil.dayOfWeek(dateExp);
}
/**
 * 从日期型数据中，获得该日位于一个星期中的第几天，星期天返回1，星期一返回2，依此类推<br>
 * 例： dayNo("2012-01-15 10:20:30") 返回：1
 *
 * @param dateExp
 */
function dayNo(dateExp) {
    return dateUtil.dayOfWeekNo(dateExp);
}
/**
 * 计算两个日期型数据相差几天 <br>
 * 例：daysAfter("2012-12-15 10:20:30","2012-12-30") 返回：-350
 *
 * @param startDate
 * @param endDate
 */
function daysAfter(startDate, endDate) {
    return dateUtil.getDistinceDay(startDate, endDate);
}
/**
 * 获得指定日期所在月的天数 <br>
 * 例：daysInMonth("2012-11-08 10:20:30") 返回：30
 */
function daysInmonth(dateExp) {
    return dateUtil.getMonthLastDay(dateExp);
}
/**
 * 获得指定日期所在年份的天数 <br>
 * 例：daysInYear("2012-01-15 10:20:30") 返回：365
 */
function daysInYear(dateExp) {
    return dateUtil.getDaysOfYear(dateExp);
}
/**
 * 获取日期中的小时 <br>
 * 例：hour("2012-12-15 10:30:25") 返回：10
 *
 * @param datetimeExp
 */
function hour(datetimeExp) {
    return dateUtil.getDayOfHour(datetimeExp);
}
/**
 * 获得指定日期的上一天 <br>
 * 例1：lastDay("2012-11-08 10:20:30") 返回：2012-11-07
 *
 */
function lastDay(dateExp) {
    return dateUtil.getSpecifiedDay(dateExp, 1);
}
/**
 * 取得指定日期在上月的同日，若无同一日，则返回上月月末 <br>
 * 例：lastMonth("2012-11-08 10:20:30") 返回：2012-10-08 10:20:30
 *
 * @param dateExp
 */
function lastMonth(dateExp) {
    return dateUtil.getPreDate(dateExp, 1);
}
/**
 * 取得指定日期在去年的同月同日，若无同月同日，则返回去年同月最后一天 <br>
 * 例：lastYear("20120227","yyyyMMdd") 返回：2011-02-27 00:00:00
 *
 * @param dateExp
 */
function lastYear(dateExp) {
    return dateUtil.getPreDate(dateExp, 2);
}
/**
 * 取得指定日期所在的月份<br>
 * 例：month("2012-11-08 10:20:30") 返回：11
 *
 * @param dateExp
 */
function month(dateExp) {
    return dateUtil.monthOfDate(dateExp);
}
/**
 * 取得指定日期所在月的月首 <br>
 * 例：monthBegin(Date) 返回：01
 *
 * @param dateExp
 */
function monthBegin(dateExp, fieldName) {
    var rtn = null;
    if (fieldName) {
        rtn = valDate(fieldName);
    }
    if (!rtn) {
        rtn = dateUtil.getFirstDayByType(dateExp, "month");
    }
    return rtn;
}
/**
 * 取得指定日期所在月的月末 <br>
 * 例：monthBegin(Date) 返回：31
 *
 * @param dateExp
 * @returns Date
 */
function monthEnd(dateExp, fieldName) {
    var rtn = null;
    if (fieldName) {
        rtn = valDate(fieldName);
    }
    if (!rtn) {
        rtn = dateUtil.getLastDayByType(dateExp, "month");
    }
    return rtn;
}
/**
 * 获取当前时间
 */
function now(fieldName) {
    var rtn = "";
    if (fieldName) {
        rtn = valStr(fieldName);
    }
    if (isEmpty(rtn)) {
        rtn = dateUtil.getToday();
    }

    return rtn;
}
/**
 * 取得指定日期所在季度的首日 <br>
 * 例:quaterBegin(2012,1) 返回：2012-01-01 00:00:00
 *
 * @param dateExp
 */
function quaterBegin(dateExp, fieldName) {
    var rtn = null;
    if (fieldName) {
        rtn = valDate(fieldName);
    }
    if (!rtn) {
        rtn = dateUtil.getFirstDayByType(dateExp, "quarter");
    }
    return rtn;
}
/**
 * 取得指定日期所在季度的尾日 <br>
 * 例:quaterEnd(2012,1) 返回：2012-12-31 10:20:30
 *
 * @param dateExp
 */
function quaterEnd(dateExp, fieldName) {
    var rtn = null;
    if (fieldName) {
        rtn = valDate(fieldName);
    }
    if (!rtn) {
        rtn = dateUtil.getLastDayByType(dateExp, "quarter");
    }
    return rtn;
}
/**
 * 从给定的日期型数据中，算出相差n天后的新的日期数据<br>
 * 例:relDate("2012-11-08 10:20:30",-10) 返回：2012-10-29 10:20:30
 *
 * @param dateExp
 * @param nExp
 */
function relDate(dateExp, nExp) {
    return dateUtil.adjustDate(dateExp, "day", nExp);
}
/**
 * 从给定的日期时间型数据中，算出相差n秒后的新的日期时间数据 <br>
 * 例:relTime("2012-11-08 10:20:30",-10) 返回：2012-11-08 10:20:20
 *
 * @param datetimeExp
 * @param nExp
 */
function relHour(datetimeExp, nExp) {
    return dateUtil.adjustDate(dateExp, "hour", nExp);
}
/**
 * 计算两个日期时间型数据相差几秒 <br>
 * 例:secondsAfter("2012-11-08 10:20:30","2012-11-08 10:30:50") 返回：620
 *
 * @param datetimeExp1
 * @param datetimeExp2
 */
function secondsAfter(datetimeExp1, datetimeExp2) {
    return dateUtil.getDiffDateTime(datetimeExp1, datetimeExp2);
}
/**
 * 计算两个日期两差的小时
 *
 * @param datetimeExp1
 * @param datetimeExp2
 * @returns
 */
function diffDateH(datetimeExp1, datetimeExp2) {
    return dateUtil.diffDateH(datetimeExp1, datetimeExp2);
}
/**
 * 获得指定日期所在星期的星期天，这里认定星期天为一周的开始 <br>
 * 例:weekBegin("2012-11-08 10:20:30") 返回：2012-11-05 10:20:30
 *
 * @param dateExp
 */
function weekBegin(dateExp, fieldName) {
    var rtn = null;
    if (fieldName) {
        rtn = valDate(fieldName);
    }
    if (!rtn) {
        rtn = dateUtil.getFirstDayByType(dateExp, "week");
    }
    return rtn;
}
/**
 * 获得指定日期所在星期的星期六，这里认定星期六为一周的结束 <br>
 * 例:weekEnd("2012-11-08 10:20:30") 返回：2012-11-11 10:20:30
 *
 * @param dateExp
 */
function weekEnd(dateExp, fieldName) {
    var rtn = null;
    if (fieldName) {
        rtn = valDate(fieldName);
    }
    if (!rtn) {
        rtn = dateUtil.getLastDayByType(dateExp, "week");
    }
    return rtn;
}
/**
 * 从日期型数据中获得年信息,当dateExp为当时，默认为当前年 <br>
 * 例:year("2012-11-08 10:20:30") 返回：2012
 *
 * @param dateExp
 */
function year(dateExp) {
    return dateUtil.getDaysOfYear(dateExp);
}

/**
 * 获取当日日期
 *
 * @deprecated
 * @return 获取当日日期
 */
function getToday() {
    var retvar = dateUtil.getToday();
    return retvar;
}
/**
 * 获取当前日期，判断日期是否为空
 *
 * @param fieldName
 * @returns
 */
function nowWhenEmpty(fieldName) {
    var val = getItemValueAsDate(fieldName);
    if (val && !"".equals(val) && val != 'null') {
        return val;
    }

    return now();
}

/**
 * 获取日期
 *
 * @deprecated
 * @return 获取日期
 *
 * @param date
 *            日期型参数
 */
function getDay(date) {
    var retvar = dateUtil.dayOfDate(date);
    return retvar;
}

/**
 * 获取月份
 *
 * @deprecated
 * @return 获取月份
 *
 * @param date
 *            日期型参数
 */
function getMonth(date) {
    var retvar = dateUtil.monthOfDate(date);
    return retvar;
}

/**
 * 获取年份
 *
 * @deprecated
 * @return 获取年份
 *
 * @param date
 *            日期型参数
 */
function getYear(date) {
    var retvar = dateUtil.yearOfDate(date);
    return retvar;
}

/**
 * 获取相隔年份数
 *
 * @return 获取相隔年份数
 *
 * @param startDate
 *            “yyyy-MM-dd”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd”格式的字符串
 */
function diffYears(startDate, endDate) {
    var retvar = dateUtil.getDistinceYear(startDate, endDate);
    return retvar;
}

/**
 * 获取相隔月份数
 *
 * @return 获取相隔月份数
 *
 * @param startDate
 *            “yyyy-MM-dd”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd”格式的字符串
 */
function diffMonths(startDate, endDate) {
    var retvar = dateUtil.getDistinceMonth(startDate, endDate);
    return retvar;
}

/**
 * 获取相隔天数
 *
 * @return 获取相隔天数
 * @deprecated
 * @param startDate
 *            “yyyy-MM-dd”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd”格式的字符串
 */
function diffDays(startDate, endDate) {
    var retvar = dateUtil.getDistinceDay(startDate, endDate);
    return retvar;
}

/**
 * 调整工作日期天数，得到新的工作日期
 *
 * @param date
 * @param num
 * @param user
 *            (可选)
 * @returns
 */
function adjustWorkingDay(date, num, calendarType) {
    var user = $WEB.getWebUser();
    if (!calendarType || isEmpty(calendarType)) {
        calendarType = user.getCalendarType();
    }

    var newDate = dateUtil.adjustWorkingDay(date, num, calendarType);
    return newDate;
}

/**
 * 调整工作日期分钟数，得到新的工作日期
 *
 * @param date
 * @param num
 * @param user
 *            (可选)
 * @returns
 */
function adjustWorkingMinute(date, num, calendarType) {
    var user = $WEB.getWebUser();
    if (!calendarType || isEmpty(calendarType)) {
        calendarType = user.getCalendarType();
    }

    var retvar = dateUtil.adjustWorkingMinute(date, num, calendarType);
    return retvar;
}

/**
 * 校正月份
 *
 * @return 校正月份
 * @deprecated
 * @param date
 *            日期型参数
 * @param num
 *            正负整数
 */
function adjustMonth(date, num) {
    var retvar = dateUtil.getNextDateByMonthCount(date, num);
    return retvar;
}

/**
 * 校正天数
 *
 * @return 校正天数
 * @deprecated
 * @param date
 *            日期型参数
 * @param num
 *            正负整数
 */
function adjustDay(date, num) {
    var retvar = dateUtil.getNextDateByDayCount(date, num);
    return retvar;
}

/**
 * 获取相隔小时数
 *
 * @deprecated
 * @return 获取相隔时间数,包含时分秒
 *
 * @param startDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 */
function diffHours(startDate, endDate) {
    var diff = dateUtil.getDistinceTime(startDate, endDate);
    return diff;
}
/**
 * 获取相隔的小时数,只包括小时
 *
 * @deprecated
 * @param startDate
 * @param endDate
 * @returns
 */
function diffHoursOfDate(startDate, endDate) {
    var diff = dateUtil.getDistinceHour(startDate, endDate);
    return diff;
}

/**
 * 根据偏移量和类型调整日期
 *
 * @param date
 * @param type
 * @param amount
 * @deprecated
 */
function adjustDate(date, type, amount) {
    var newDate = dateUtil.adjustDate(date, type, amount);
    return newDate;
}

/**
 * 根据不同的类型，获取此类型的第一天
 *
 * @param date
 *            日期
 * @param type(week,month,year)
 *            周、月、年
 */
function firstDayByType(date, type) {
    var newDate = dateUtil.getFirstDayByType(date, type);
    return newDate;
}

/**
 * 根据不同的类型，获取此类型的最后一天
 *
 * @param date
 *            日期
 * @param type(week,month,year)
 *            周、月、年
 */
function lastDayByType(date, type) {
    var newDate = dateUtil.getLastDayByType(date, type);
    return newDate;
}
/**
 * 获得月份的开始日期
 *
 * @deprecated
 * @param yearStr
 * @param monthStr
 * @returns
 */
function firstDayOfMonth(yearStr, monthStr) {
    var newDate = dateUtil.getFirstDay(yearStr, monthStr);
    return newDate;
}
/**
 * 获得月份的最后一天
 *
 * @deprecated
 * @param yearStr
 * @param monthStr
 * @returns
 */
function lastDayOfMonth(yearStr, monthStr) {
    var newDate = dateUtil.getLastDay(yearStr, monthStr);
    return newDate;
}

/**
 * 获取相隔工作天数,根据工作日历
 *
 * @return 获取相隔工作天数
 *
 * @param startDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 */
function workingDayCount(startDate, endDate, calendarType) {
    var user = $WEB.getWebUser();
    if (!calendarType || isEmpty(calendarType)) {
        calendarType = user.getCalendarType();
    }

    var count = dateUtil.getWorkingDayCount(startDate, endDate, calendarType);

    return count;
}

/**
 * 获取相隔工作小时数,根据工作日历
 *
 * @return 获取相隔工作小时数
 * @param startDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 * @param endDate
 *            “yyyy-MM-dd HH:mm:ss”格式的字符串
 */
function workingTimesCount(startDate, endDate, calendarType) {
    var user = $WEB.getWebUser();
    if (!calendarType || isEmpty(calendarType)) {
        calendarType = user.getCalendarType();
    }

    var count = dateUtil.getWorkingTimesCount(startDate, endDate, calendarType);
    return count;
}

/**
 * 发送邮件
 *
 * @param from
 *            发送人地址
 * @param to
 *            接收人地址
 * @param subject
 *            主题
 * @param body
 *            内容
 * @param host
 *            邮件服务器地址
 * @param user
 *            邮件服务器用户名
 * @param password
 *            密码
 * @param bbc
 *            秘密抄送地址
 * @param validate
 *            是否校验
 */
function sendMail(from, to, subject, body, host, user, password, bbc, validate) {
    $EMAIL.setEmail(from, to, subject, body, host, user, password, bbc,
        validate);
    $EMAIL.send();
}

/**
 * 发送邮件给所有用户
 *
 * @param from
 *            发送人地址
 * @param subject
 *            主题
 * @param host
 *            邮件服务器地址
 * @param user
 *            邮件服务器用户名
 * @param password
 *            密码
 * @param bbc
 *            秘密抄送地址
 * @param validate
 *            是否校验
 */
function sendMailtoAllUser(from, subject, host, user, password, bbc, validate) {
    $EMAIL.sendMailToAllUser(from, subject, host, account, password, bbc,
        validate);
}

/**
 * 以系统配置的用户发送邮件
 *
 * @param to
 *            接收人地址
 * @param subject
 *            主题
 * @param content
 *            内容
 * @return
 */
function sendEmailBySystemUser(to, subject, content) {
    $EMAIL.sendEmailBySystemUser(to, subject, content);
}

/**
 * 发送手机短信
 *
 * @param docid
 *            发送模块表单记录ID
 * @param title
 *            标题
 * @param content
 *            内容
 * @param receiver
 *            接收者电话列表,有多个接收者,使用","做分隔符
 * @param isReply
 *            true|false,是否需要收到回复
 * @param isMass
 *            true|false,标识是否为群发,即是否有多位接收者
 */
function sendSMS(docid, title, content, receiver, isReply, isMass) {
    var sender = $MESSAGE.getSMSManager().getSender($WEB.getWebUser());
    return sender.send(docid, title, content, receiver, isReply, isMass);
}

/**
 * 根据发送模块表单记录ID获取接收者手机短信回复记录.结果以Collection返回
 *
 * @return 根据发送模块表单记录ID获取接收者手机短信回复记录.结果以Collection返回
 */
function listReplyByDocid(docid) {
    var data = $MESSAGE.getSMSManager().queryReplyById(docid);
    if (data != null)
        return data.datas;
    return null;
}

/**
 * 发送站内信，手机短信，邮件method是选择发送方式 content是描述发送何种结果 10 -站内短信通知 20 -手机短信通知 30 -电子邮件通知
 */
function sendMessageByMethod(senderid, receivers, title, content, method) {
    if (method.indexOf("10") > -1) {
        sendMessageByUsers(senderid, receivers, title, content);
    }
    if (method.indexOf("20") > -1) {
    }
    if (method.indexOf("30") > -1) {
        sendEmailByUsers(senderid, receivers, title, content);
    }
}

/**
 * 发送站内短信
 *
 * @returns
 */
function sendMessageByUsers(senderid, receivers, title, content) {
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    if (receivers) {
        for ( var it = receivers.iterator(); it.hasNext();) {
            var receiver = it.next();
            process.doCreate(senderid, receiver.getId(), title, content);
        }
    }
}

/**
 * 发送邮件
 *
 * @returns
 */
function sendEmailByUsers(senderid, receivers, title, content) {
    if (receivers) {
        for ( var it = receivers.iterator(); it.hasNext();) {
            var receiver = it.next();
            if (!isEmpty(receiver.getEmail())) {
                sendEmailBySystemUser(receiver.getEmail(), title, content);
            }
        }
    }
}

/**
 * 发送站内短信
 *
 * @param senderid
 *            发送者ID
 * @param receiverid
 *            接收者ID
 * @param title
 *            标题
 * @param content
 *            内容
 *
 */
function sendMessage(senderid, receiverid, title, content) {
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    process.doCreate(senderid, receiverid, title, content);
}

/**
 * 根据部门发送站内短信
 *
 * @param departmentid
 *            部门ID
 * @param title
 *            标题
 * @param content
 *            内容
 *
 */
function sendMessageByDept(departmentid, title, content) {
    var userid = getWebUser().getId();
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    process.doCreateByDepartment(departmentid, userid, title, content);
}

/**
 * 根据角色发送短信
 *
 * @param roleid
 *            角色ID
 * @param domainid
 *            企业域ID
 * @param title
 *            标题
 * @param content
 *            内容
 *
 */
function sendMessageByRole(roleid, domainid, title, content) {
    var userid = getWebUser().getId();
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    process.doCreateByRole(roleid, domainid, userid, title, content);
}

/**
 * 根据发送方式发送(增强版)
 *
 * @params senderid 发送者ID
 * @params receiverids<Array> 接收者id数组
 * @params title 标题
 * @params htmlContent html内容
 * @params textContent 纯文本内容
 * @params method 发送方式
 * @returns
 */
function sendMessageByMethodEx(senderid, receiverids, title, htmlContent,
                               textContent, method) {
    // $PRINTER.println("senderid: " + senderid);
    // $PRINTER.println("receiverids: " + receiverids);
    // $PRINTER.println("title: " + title);
    // $PRINTER.println("htmlContent: " + htmlContent);
    // $PRINTER.println("textContent: " + textContent);
    // $PRINTER.println("method: " + method);

    var receiveridArray = receiverids;
    if (!isEmpty(receiverids) && !(receiverids instanceof Array)) {
        receiveridArray = receiverids.split(";");
        if (receiveridArray == null || receiveridArray.length <= 0) {
            return;
        }
    }

    if (method.indexOf("10") > -1) {
        if (!isEmpty(htmlContent)) {
            sendMessageByUserIds(senderid, receiveridArray, title, htmlContent,
                "1");
        } else if (!isEmpty(textContent)) {
            sendMessageByUserIds(senderid, receiveridArray, title, htmlContent,
                "1");
        }
    }
    if (method.indexOf("20") > -1) {
        if (!isEmpty(textContent)) {
            // sendSMS("", title, textContent, receiver, false, false);
        }
    }
    if (method.indexOf("30") > -1) {

        if (!isEmpty(htmlContent)) {
            sendEmailByUserIds(senderid, receiveridArray, title, htmlContent);
        } else if (!isEmpty(textContent)) {
            sendEmailByUserIds(senderid, receiveridArray, title, textContent);
        }
    }
}

/**
 * 发送站内短信
 *
 * @returns
 */
function sendMessageByUserIds(senderid, receiverids, title, content, type) {
    var process = createProcess("com.yunbo.core.personalmessage.ejb.PersonalMessageProcess");
    if (receiverids) {
        for ( var i = 0; i < receiverids.length; i++) {
            var receiverid = receiverids[i];
            process.doCreate(senderid, receiverid, title, content, type);
        }
    }
}

/**
 * 发送邮件
 *
 * @returns
 */
function sendEmailByUserIds(senderid, receiverids, title, content) {
    if (receiverids.length > 1) {
        for ( var i = 0; i < receiverids.length; i++) {
            var receiverid = receiverids[i];
            var receiver = getUserProcess().doView(receiverid);
            if (receiver != null && !isEmpty(receiver.getEmail())) {
                sendEmailBySystemUser(receiver.getEmail(), title, content);
            }
        }
    } else {
        var receiver = getUserProcess().doView(receiverids[0]);
        if (receiver != null && !isEmpty(receiver.getEmail())) {
            sendEmailBySystemUser(receiver.getEmail(), title, content);
        }
    }
}


/**
 * 返回大于等于其数字参数的最小整数
 *
 * @return 返回大于等于其数字参数的最小整数
 *
 * @param num
 *            数字参数
 */
function toCeil(num) {
    return Math.ceil(num);
}

/**
 * 返回小于等于其数字参数的最大整数
 *
 * @return 返回小于等于其数字参数的最大整数
 *
 * @param num
 *            数字参数
 */
function toFloor(num) {
    return Math.floor(num);
}

/**
 * 返回数字的绝对值
 *
 * @param num
 *            数字参数
 */
function abs(num) {
    Math.abs(num);
}

/**
 * 提供精确的小数位四舍五入处理
 *
 * @return 提供精确的小数位四舍五入处理
 *
 * @param num
 *            需要四舍五入的数字
 * @param pos
 *            小数点后保留几位
 */
function round(num, pos) {
    var accurateCalculate = $BEANFACTORY.createObject("com.yunbo.util.Arith");
    return accurateCalculate.round(num, pos);
}

/**
 * 判断是否为负数
 *
 * @return 判断是否为负数
 *
 * @param num
 *            数字型参数
 */
function isNegative(num) {
    if (num < 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断是否为正数
 *
 * @return 判断是否为正数
 *
 * @param num
 *            数字型参数
 */
function isPositive(num) {
    if (num > 0) {
        return true;
    } else {
        return false;
    }
}


/**
 * 生成选项对象，示例：
 * var opts = createOptions();
 * add("选项1", "1");
 * add("选项2", "2", true);
 * add("选项3", "3");
 * opts;
 *
 * @return 生成选项对象
 */
function createOptions() {
    return $TOOLS.createOptions();
}

/**
 * 返回符合查询符合条件语句的文档中keyFieldName字段的所有值集合，作为下拉框控件的选项
 *
 * @return 返回符合查询符合条件语句的文档中keyFieldName字段的所有值集合，作为下拉框控件的选项
 *
 * @param dql
 *            查询符合条件语句
 * @param keyFieldName
 *            文档的字段名(当为数组时[0]作为真实值，[1]作为显示值)
 * @param blankFirst
 *            默认是否为空选项
 */
function getOptionsByDQL(dql, keyFieldName, blankFirst) {
    var opts = $TOOLS.createOptions();
    if (blankFirst) {
        opts.add("", "");
    }
    var docs = queryByDQL(dql);
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var value = "";
        var text = "";
        if (keyFieldName.constructor == Array) {
            value = doc.getItemValueAsString(keyFieldName[0]);
            text = doc.getItemValueAsString(keyFieldName[1]);
        } else {
            value = doc.getItemValueAsString(keyFieldName);
            text = doc.getItemValueAsString(keyFieldName);
        }

        opts.add(text, value);
    }
    return opts;
}

/**
 * 根据SQL生成选项
 *
 * @param sql 查询的SQL语句，语句中需要包含name和code字段，如: select field1 item_name, field2 item_code from table
 * @param blankFirst
 *            默认是否为空选项
 * @param cache
 *
 */
function getOptionsBySQL(sql, blankFirst, cache) {
    var opts = createOptions();
    if (blankFirst) {
        opts.add("", "");
    }
    var docs=null;
    if(cache){
        docs = queryBySQLWithCache(sql);
    }else{
        docs = queryBySQL(sql);
    }
    each(docs, function(doc, index){
        var name = doc.getItemValueAsString("name");
        var value = doc.getItemValueAsString("code");
        opts.add(name, value);
    });
    return opts;
}

// 获取下拉列表
function getOptions(formName, fieldName, fieldId, isEmpty) {
    var opts = $TOOLS.createOptions();
    if (isEmpty)
        opts.add("", "");
    var dql = "$formname='" + formName + "'";
    var docs = queryByDQL(dql);
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var dst_name = doc.getItemValueAsString(fieldName);
        var dst_code = doc.getItemValueAsString(fieldId);
        opts.add(dst_name, dst_code);
    }
    return opts;
}

function getOptionsCache(formName, fieldName, fieldId, isEmpty) {
    var opts = $TOOLS.createOptions();
    if (isEmpty)
        opts.add("", "");
    var dql = "$formname='" + formName + "'";
    var docs = queryByDQLWithCache(dql);
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var dst_name = doc.getItemValueAsString(fieldName);
        var dst_code = doc.getItemValueAsString(fieldId);
        opts.add(dst_name, dst_code);
    }
    return opts;
}
/**
 * 取表单中的某个字段，KEY是DOCID,VALUE是字段值
 *
 * @param formName
 * @param fieldName
 * @param isEmpty
 * @returns
 */
function getOptionsOfNameDocId(formName, fieldName, isEmpty) {
    var opts = $TOOLS.createOptions();
    if (isEmpty)
        opts.add("", "");
    var dql = "$formname='" + formName + "'";
    var docs = queryByDQL(dql);
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var dst_name = doc.getItemValueAsString(fieldName);
        var dst_code = doc.getId();
        opts.add(dst_name, dst_code);
    }
    return opts;
}
/**
 * 生成字段名下拉列表
 *
 * @param formName
 * @param fieldName
 * @returns
 */
function getOptionsOfName(formName, fieldName) {
    var opts = $TOOLS.createOptions();
    opts.add("", "");
    var dql = "$formname='" + formName + "'";
    var docs = queryByDQL(dql);
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var dst_name = doc.getItemValueAsString(fieldName);
        opts.add(dst_name, dst_name);
    }
    return opts;
}

/**
 * 获取下拉列表
 *
 * @deprecated
 *
 * @param formName
 *            表名
 * @param fieldName
 *            字段名
 * @param fieldId
 *            字段值
 * @param isEmpty
 *            是否为空
 * @param conditionNames
 *            条件名
 * @param conditionValues
 *            条件值
 * @returns
 */
function getOptionsSQL(formName, fieldName, fieldId, isEmpty, conditionNames, conditionValues) {
    var opts = $TOOLS.createOptions();
    if (isEmpty)
        opts.add("", "");
    var sql = "select * from tlk_" + formName;
    if (conditionNames) {
        sql += " where ";
        var count = 1;
        if (conditionNames.constructor == Array) {
            count = conditionNames.length;
        }
        for ( var i = 0; i < count; i++) {
            var conditionName = "";
            var conditionValue = "";
            if (conditionNames.constructor == Array) {
                conditionName = conditionNames[i];
                conditionValue = conditionValues[i];
            } else {
                conditionName = conditionNames;
                conditionValue = conditionValues;
            }
            sql += "item_" + conditionName + " = '" + conditionValue + "'";
            if (i = count - 1) {
                continue;
                sql += " and ";
            }
        }
    }
    var docs = queryBySQL(sql);
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var dst_name = doc.getItemValueAsString(fieldName);
        var dst_code = doc.getItemValueAsString(fieldId);
        opts.add(dst_name, dst_code);
    }
    return opts;
}

/**
 * 取出所有部门，以树形显示
 */
function deepSearchDepartmentTree() {
    var process = new Packages.cn.myapps.core.department.ejb.DepartmentProcessBean();
    var params = $WEB.createParamsTable();
    params.setParameter("domain", getDomainid());
    var coll = process.doSimpleQuery(params);
    var map = process.deepSearchDepartmentTree(coll, null, null, 1);
    var opts = $TOOLS.createOptions();
    opts.add("", "");
    var key = map.keySet();
    for ( var iter = key.iterator(); iter.hasNext();) {
        var id = iter.next();
        var name = map.get(id);
        opts.add(name, id);
    }
    return opts;
}

function deepSearchDepartmentTrees() {
    var process = new Packages.cn.myapps.core.department.ejb.DepartmentProcessBean();
    var params = $WEB.createParamsTable();
    params.setParameter("domain", getDomainid());
    var coll = process.doSimpleQuery(params);
    var map = process.deepSearchDepartmentTree(coll, null, null, 1);
    var opts = $TOOLS.createOptions();
    opts.add("", "");
    var key = map.keySet();
    for ( var iter = key.iterator(); iter.hasNext();) {
        var id = iter.next();
        var name = map.get(id);
        var names = name.split("-").length;
        var na = name.substring(names, name.trim().length());
        opts.add(name, na);
    }
    return opts;
}

// 获取部门用户选项
function getUserOptions(deptId, isEmpty, dbName) {
    var sql = "select u.id,u.name item_user_name,'" + getDomainid() + "' as DOMAINID from " + dbName + ".t_user u";
    sql += " inner join " + dbName + ".t_user_department_set d on u.id=d.userid";
    if (deptId) {
        sql += " and d.departmentid='" + deptId + "'";
    } else {
        sql += " and d.departmentid='@@@'";
    }

    var docs = queryBySQL(sql);
    var opts = $TOOLS.createOptions();
    if (isEmpty)
        opts.add("", "");
    for ( var iter = docs.iterator(); iter.hasNext();) {
        var doc = iter.next();
        var dst_name = doc.getItemValueAsString("user_name");
        var dst_code = doc.getId();
        opts.add(dst_name, dst_code);
    }

    return opts;
}



/**
 * 根据dql和域名查询符合条件的Document，结果以Collection返回
 *
 * @return 根据dql和域名查询符合条件的Document，结果以Collection返回
 *
 * @param dql
 *            dql查询符合条件语句
 * @param domainName
 *            企业域名称
 */
function queryByDQLDomain(dql, domainName) {
    var process = getDocProcess($WEB.getApplication());
    var dpg = process.queryByDQLDomainName(dql, domainName);
    return dpg.datas;
}

/**
 * 返回当前登录用户所属企业域ID
 *
 * @return 返回当前登录用户所属企业域ID
 */
function getDomainid() {
    return $WEB.getDomainid();
}

/**
 * 根据角色名取角色ID
 *
 * @param name
 *            角色名称
 * @return 返回对应角色对象
 */
function getRoleByName(name) {
    var roleProcess = createProcess("com.yunbo.core.role.ejb.RoleProcess");
    return roleProcess.doViewByName(name, getApplication());
}

/**
 * 根据用户登录名取用户对象
 *
 * @param loginno
 *            用户登录名
 * @return 返回对应用户对象
 */
function getUserByLoginno(loginno) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.login(loginno, getDomainid());
}

/**
 * 部门名称
 *
 * @param fieldName
 *            存储部门ID的字段名称
 */
function getDeptName(fieldName) {
    var id = getItemValue(fieldName);
    var dept = getDepartmentProcess().doView(id);
    var rtn = "";
    if (dept != null) {
        rtn = dept.getName();
    }
    return rtn;
}

/**
 * 根据部门ID获取部门对象
 *
 * @param deptid
 * @returns
 */
function getDeptById(deptid) {
    var deptProcess = getDepartmentProcess();
    if (!isEmpty(deptid)) {
        return deptProcess.doView(deptid);
    }

    return null;
}

/**
 * 根据用户ID获取用户对象
 *
 * @param userid
 *            用户ID
 * @return 返回用户对象
 */
function getUserById(userid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    if (!isEmpty(userid)) {
        return userProcess.doView(userid);
    }

    return null;
}

/**
 * 获取当前软件下面的所有角色组别
 *
 * @return 角色组的集合
 */
function getAllRoles() {
    var roleProcess = createProcess("com.yunbo.core.role.ejb.RoleProcess");
    return roleProcess.getRolesByApplication(getApplication());
}

/**
 * 获取当前域下面的所有内部用户ID
 *
 * @returns
 */
function getAllUserIds() {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    var users = userProcess.queryByDomain(getDomainid());
    return userProcess.toUserIdsString(users, ";");
}

/**
 * 将集合转换为ID拼接的字符串
 *
 * @param users
 * @param sep
 * @returns id1;id2
 */
function joinUserId(users, sep) {
    if (!sep) {
        sep = ";";
    }

    var rtn = "";
    each(users, function(user, index) {
        rtn += user.getId() + sep;
    });
    if (len(rtn) > 0) {
        rtn = rtn.substring(0, rtn.lastIndexOf(sep));
    }

    return rtn;
}

/**
 * 获取当前域下面的所有用户
 *
 * @return 返回当前域下面的所有用户对象的集合
 */
function getAllUsers() {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByDomain(getDomainid());
}

/**
 * 获取指定部门并角色的所有用户
 *
 * @param dptid
 *            部门ID
 * @param roleid
 *            角色ID
 * @return 返回指定部门并角色的所有用户对象的集合
 */
function getUsersByDptIdAndRoleId(dptid, roleid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByDptIdAndRoleId(dptid, roleid);
}

/**
 * 获取指定角色下的所有用户
 *
 * @param roleid
 *            角色ID
 * @return 返回指定角色下的所有用户对象的集合
 */
function getUsersByRoleId(roleid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByRole(roleid);
}

/**
 * 根据部门名称和角色名称查找用户
 *
 * @param dptName
 * @returns
 */
function getUsersByDeptNameAndRoleName(deptName, roleName) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.getUsersByDeptNameAndRoleName(deptName, roleName,
        getApplication(), webUser.getDomainid());
}

function deepSearchUserByDeptCode(dptCode) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.deepSearchUserByDeptCode(dptCode, webUser.getDomainid());
}

/**
 * 根据部门编号和角色编号查找用户
 *
 * @param dptName
 * @returns
 */
function getUsersByDeptCodeAndRoleCode(dptCode, roleCode) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.getUsersByDeptCodeAndRoleCode(dptCode, roleCode,
        getApplication(), webUser.getDomainid());
}

/**
 * 根据部门名称深度查找用户
 *
 * @param dptName
 * @returns
 */
function deepSearchUserByDeptName(dptName) {
    var webUser = $WEB.getWebUser();
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.deepSearchUserByDeptName(dptName, webUser.getDomainid());
}

/**
 * 获取指定部门所有用户
 *
 * @param dptid
 *            部门ID
 * @return 返回指定部门下的所有用户对象的集合
 */
function getUsersByDptId(dptid) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.queryByDepartment(dptid);
}

/**
 * 根据角色字符串获取用户
 */
function getUsersRoleName(roleNamesString) {
    var list = new Packages.java.util.ArrayList();
    if (!isEmpty(roleNamesString)) {
        var roleNames = roleNamesString.split(";");
        for ( var i = 0; i < roleNames.length; i++) {
            var roleName = roleNames[i];
            var role = getRoleProcess()
                .doViewByName(roleName, getApplication());
            list.addAll(role.getUsers());
        }
    }
    return list;
}

/**
 * 根据部门ID和角色名称获取用户
 *
 * @param dptid
 *            部门ID
 * @param roleName
 *            角色名称
 *
 * @returns Collection<BaseUser>
 */
function getUsersByDptIdAndRoleName(dptid, roleName) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    var list = new Packages.java.util.ArrayList();
    var users = userProcess.queryByDepartment(dptid);
    for ( var iter = users.iterator(); iter.hasNext();) {
        var user = iter.next();
        var roleNames = user.getRoleNames();
        if (roleNames.contains(roleName)) {
            list.add(user);
        }
    }

    return list;
}

/**
 * 根据部门字段深度查找用户
 *
 * @param deptFieldName
 *            部门字段名称
 * @returns {Packages.java.util.ArrayList}
 */
function deepSearchUserByDeptField(deptFieldName) {
    var devDeptId = getItemValue(deptFieldName);
    var rtn = new Packages.java.util.ArrayList();
    if (!isEmpty(devDeptId)) {
        var devDeptIds = devDeptId.split(";");
        for ( var i = 0; i < devDeptIds.length; i++) {
            var dept = getDepartmentProcess().doView(devDeptIds[i]);
            rtn.addAll(deepSearchUserByDeptName(dept.getName()));
        }
    }

    return rtn;
}

/**
 * 获取指定部门的下级部门
 *
 * @param parent
 *            部门ID
 * @return 返回指定部门的下级部门对象的集合
 */
function getDepartmentsByParent(parent) { // parent部门ID
    var process = createProcess("com.yunbo.core.department.ejb.DepartmentProcess");
    return process.getDatasByParent(parent);
}

/**
 * 根据角色名取角色ID
 *
 * @param name
 *            角色名称
 * @return 返回对应角色ID
 */
function getRoleIdByName(name) {
    var role = getRoleByName(name);
    if (role != null) {
        return role.getId();
    }
    return null;
}

/**
 * 根据用户登录名取用户ID
 *
 * @param loginno
 *            用户登录名
 * @return 返回对应用户ID
 */
function getUserIdByLoginno(loginno) {
    var userProcess = createProcess("com.yunbo.core.user.ejb.UserProcess");
    return userProcess.findUserIdByAccount(loginno, getDomainid());
}

/**
 * 根据部门等级值获取对应等级的所有部门
 *
 * @param level
 *            部门等级值
 * @return 返回获取到的对应等级的所有部门的集合
 */
function queryDepartmentByLevel(level) {
    var process = createProcess("com.yunbo.core.department.ejb.DepartmentProcess");
    return process.getDepartmentByLevel(level, getApplication(), getDomainid());
}

/**
 * 根据部门名称和部门等级获取部门对象ID
 *
 * @param name
 *            部门名称
 * @param level
 *            部门等级值
 * @return 返回对应部门ID
 */
function findDeptIdByNameAndLevel(name, level) {
    var deptlist = queryDepartmentByLevel(level);
    if (deptlist != null && deptlist.size() > 0) {
        for ( var iter = deptlist.iterator(); iter.hasNext();) {
            var dept = iter.next();
            if (name.equals(dept.getName())) {
                return dept.getId();
            }
        }
    }
    return null;
}

/**
 * 根据角色编号和软件id获取角色
 *
 */

function findRoleByRoleNo(roleno, applicationid) {
    var process = new Packages.com.yunbo.core.role.ejb.RoleProcessBean();
    var role = process.findByRoleNo(roleno, applicationid);
    if (role != null) {
        return role.getName();
    } else {
        return null;
    }
}
// 根据部门的ID取部门的name
function findDepartmenCodeById(id) {
    var process = createProcess("cn.myapps.core.department.ejb.DepartmentProcess");
    var department = process.doView(id);
    if (department != null) {
        return department.getCode();
    } else
        return "";
}

/** 读取用户选择框，返回用户id数组 */
function findUserIdList(userIds) {
    var userProcess = getUserProcess();
    var userIdList = createObject("java.util.ArrayList");
    var userList = createObject("java.util.ArrayList");
    userIdList = userIds.split(";");
    for ( var i = 0; i < userIdList.length; i++) {
        var user = userProcess.doView(userIdList[i]);
        userList.add(user.getId());
    }
    return userList;

}
/** 读取用户选择框，返回用户对象数组 */
function findUserList(userIds) {
    var userProcess = getUserProcess();
    var userIdList = createObject("java.util.ArrayList");
    var userList = createObject("java.util.ArrayList");
    userIdList = userIds.split(";");
    for ( var i = 0; i < userIdList.length; i++) {
        var user = userProcess.doView(userIdList[i]);
        userList.add(user);
    }
    return userList;
}

/**
 * 根据条件模糊查找当前用户角色名称
 *
 * @param condition
 * @returns 角色名称
 */
function searchRoleName(condition) {
    var roleNames = getWebUser().getRoleNames();
    var roleNameArray = roleNames.split(";");
    for ( var i = 0; i < roleNameArray.length; i++) {
        var roleName = roleNameArray[i];
        if (roleName.indexOf(condition) != -1) {
            return roleName;
        }
    }
    return "";
}
/**
 * 获取当前用户的名称
 *
 * @param fieldName
 */
function getWebUserName(fieldName) {
    var fieldValue = valObj(fieldName);
    if (isEmpty(fieldValue)) {
        fieldValue = getWebUser().getName();
    }
    return fieldValue;
}

/**
 * 获取当前用户的Id
 *
 * @param fieldName
 */
function getWebUserId(fieldName) {
    var fieldValue = valObj(fieldName);
    if (isEmpty(fieldValue)) {
        fieldValue = getWebUser().getId();
    }
    return fieldValue;
}
/**
 * 获取角色列表,如果传入的字段名为空，返回当前的角色
 *
 * @param fieldName
 * @returns
 */
function getRoleNames(fieldName) {
    var fieldValue = valObj(fieldName);
    if (isEmpty(fieldName)) {
        return getWebUser().getRoleNames();
    } else if (isEmpty(fieldValue)) {
        fieldValue = getWebUser().getName();
    }

    return fieldValue;
}


/**
 * SQL工具类
 *
 * @returns {com.yunbo.core.sql.util.SqlUtil}
 */
function getSqlUtil() {
    return new Packages.com.yunbo.core.sql.util.SqlUtil(getApplication());
}

function getWhereSQL(itemNames, conditions, fieldNames) {
    var databaseType = getDataSourceObject().getDbType();
    var sqlWhere = "";
    for ( var i = 0; i < itemNames.length; i++) {
        var itemValue = getItemValue(itemNames[i]);
        if (itemValue != null && itemValue.trim().length() > 0) {
            if (conditions[i] == "like")
                itemValue = "%" + itemValue + "%";
            var item = fieldNames[i];
            // for Oracle
            if (databaseType == 1) {
                if (conditions[i] == "<=" || conditions[i] == ">=") {
                    item = "to_char(" + item + ",'yyyy-MM-dd')";
                }
            }
            sqlWhere += " and " + item + " " + conditions[i] + " '" + itemValue + "'";
        }
    }
    return sqlWhere;
}

// get datasource Object
function getDataSourceObject(datasoursename) {
    var applicationid = getApplication();
    if (datasoursename != null) {
        var process = createProcess("cn.myapps.core.dynaform.dts.datasource.ejb.DataSourceProcess");
        return process.doViewByName(datasoursename, applicationid);
    } else {
        var process = createProcess("cn.myapps.core.deploy.application.ejb.ApplicationProcess");
        var appvo = process.doView(applicationid);
        if (appvo != null)
            return appvo.getDataSourceDefine();
    }
    return null;
}

function getConditionSQL(conditions, tableAlias) {
    var sql = "";
    for ( var i = 0; conditions && i < conditions.length; i++) {
        if (!isEmpty(conditions[i].value) || conditions[i].includeEmpty) {
            var val = conditions[i].value;
            if ("like" == conditions[i].operator) {
                val = "%" + val + "%";
            } else if ("in" == conditions[i].operator) {
                var value = "";
                var spilt = val.split(";");
                for ( var j = 0; spilt && j < spilt.length; j++) {
                    value += "'" + spilt[j] + "',";
                }
                val = "(" + value.substring(0, value.length - 1) + ")";
            }

            var alias = "";
            if (tableAlias) {
                alias = tableAlias + ".";
            }

            if ("date" == conditions[i].type) { // 仅适用于SQLServer
                sql += "CONVERT(nvarchar(19), " + alias + conditions[i].name + ", 23) " + conditions[i].operator + " '"
                    + val + "'";
            } else {
                if ("in" == conditions[i].operator) {
                    sql += alias + conditions[i].name + " " + conditions[i].operator + " " + val + "";
                } else {
                    sql += alias + conditions[i].name + " " + conditions[i].operator + " '" + val + "'";
                }
            }

            sql += " AND ";
        }
    }

    if (sql.length > 0) {
        sql = sql.substring(0, sql.lastIndexOf(" AND "));
    }

    return sql;
}

// SQL查询条件
function SQLCondition(name, value, operator, type, itemName, includeEmpty) {
    var _this = this;
    this.name = "";
    this.itemName = "";
    this.operator = "like";
    this.value = "";
    this.type = "string";
    this.includeEmpty = false;

    var init = function() {
        _this.name = name;
        _this.value = value;
        if (operator) {
            _this.operator = operator;
        }
        if (type) {
            _this.type = type;
        }
        if (isEmpty(value) && itemName) {
            _this.value = getItemValue(itemName);
        }
        if (includeEmpty == true) {
            _this.includeEmpty = includeEmpty;
        }
    };

    init();
}

/**
 * 根据查询条件映射集，生成查询条件语句
 *
 * @param conditionMap
 *            Map<String, Condition> 查询条件映射集
 * @param excludeEmpty
 *            是否排除控制
 * @param orderBy
 *            排序字段，可使用String或String[]
 *
 * @returns SQL字符串语句
 */
function createSearch(conditionMap, excludeEmpty, orderBy) {
    if (!orderBy) {
        orderBy = [];
    }
    return getSqlUtil().createSearch(conditionMap, excludeEmpty, orderBy);
}

/**
 * 根据查询文档生成查询条件语句
 *
 * 查询表单字段前缀含义：
 * eq_ 符号=
 * eqn_ 符号<>
 * lk_ 符号like
 * s_ 符号like
 * lkn_ 符号not like
 * gt_ 符号>
 * lt_ 符号<
 * gte_ 符号>=
 * lte_ 符号<=
 * inn_ 符号not in
 * in_ 符号in
 * asc_ 排序asc
 * desc_ 排序desc
 *
 * @param searchDoc
 * @param orderBy
 * @returns
 */
function createSearchByDoc(searchDoc, orderBy) {
    if (searchDoc != null) {
        return createSearch(searchDoc.toConditionMap(), true, orderBy);
    }
    return "";
}

/**
 * 将条件语句拼接到SQL语句中
 *
 * @param sql
 * @param condition
 * @returns
 */
function joinSQL(sql, condition) {
    return getSqlUtil().joinSQL(sql, condition);
}

/**
 * 将通用SQL语句翻译为具有数据库特征的SQL语句
 *
 * @param sql
 * @returns
 */
function translateSQL(sql) {
    return getSqlUtil().translateSQL(sql);
}

/**
 * 将数组转为in条件
 * @param array
 */
function toInCondition(array) {
    var rtn = "";
    if (array && array.length > 0) {
        each(array, function(obj, i){
            rtn += "'" + obj +"',";
//			rtn += obj + ",";
        });
        rtn = rtn.substring(0, rtn.lastIndexOf(","));
    }

    return rtn;
}


/**
 * 字符串函数库
 */

var strUtil = Packages.com.yunbo.util.StringUtil;

function getStrUtil() {
    return Packages.com.yunbo.util.StringUtil;
}

/**
 * 将字符串某位置的字符转为ascii码
 *
 * @param str
 */
function asc(str, nPos) {
    if (!nPos) {
        nPos = 0;
    }

    return strUtil.toAscii(str, nPos);
}

/**
 * 根据给定的ascii编码转换为字符串
 *
 * @param int
 *            整形编码
 */
function toChar(intExp) {
    return strUtil.toChar(intExp);
}

/**
 * 将数值转换为十六进制字符（数据当做无符号数据处理）
 *
 * @param intExp
 */
function hexString(intExp) {
    return strUtil.hexString(intExp);
}

/**
 * 判断字符串是否匹配格式串(*匹配0个或多个字符，?匹配单个字符)
 *
 * @param strExp
 *            字符串表达式
 * @param formatExp
 *            格式
 * @param ignoreCase
 *            是否大小写敏感,默认为false
 * @returns true or false
 */
function like(strExp, pattern, ignoreCase) {
    var rtn = false;
    if (ignoreCase) {
        rtn = strUtil.like(strExp, pattern, ignoreCase);
    } else {
        rtn = strUtil.like(strExp, pattern, false);
    }

    return rtn;
}

/**
 * 将一个整数转化成汉字大写
 *
 * @param intExp
 *            整数
 */
function chn(intExp) {
    return strUtil.getChineseNumber(intExp);
}

/**
 * 转换为大写金额
 *
 * rmb(120003333.234) = 壹亿贰仟万零叁仟叁佰叁拾叁元贰角叁分肆厘
 *
 * @param numberExp
 */
function rmb(numberExp) {
    return strUtil.rmb(numberExp);
}

/**
 *
 * @param str
 *            字符串
 * @param n
 *            拼接次数
 */
function repeat(str, n) {
    return strUtil.repeat(str, n);
}

/**
 * 去掉两边空格
 *
 * @param str
 *            字符串
 */
function trim(str) {
    var rtn = new Packages.java.lang.String(str);
    return rtn.trim();
}

/**
 * 把字符串转成小写
 *
 * @param str
 */
function lower(str) {
    var rtn = new Packages.java.lang.String(str);
    return rtn.toLowerCase();
}

/**
 * 把字符串转成大写
 *
 * @param str
 */
function upper(str) {
    var rtn = new Packages.java.lang.String(str);
    return rtn.toUpperCase();
}

/**
 * 首字母大写
 *
 * @param str
 */
function wordCap(str) {
    return strUtil.capitalize(str);
}

/**
 * 只保留中文部分
 *
 * 示例： keepChinese("yunbo云博") = "云博"
 *
 * @param str
 *            字符串
 */
function keepChinese(str) {
    return strUtil.keepChinese(str);
}

/**
 * 计算字符串的长度
 *
 * @param str
 */
function len(str) {
    var rtn = new Packages.java.lang.String(str);
    return rtn.length();
}

/**
 * 比较两个字符串的差异，并返回差异部分
 *
 * @param str
 * @param anStr
 * @returns 差异部分的字符串
 */
function difference(str, anStr) {
    return strUtil.difference(str, anStr);
}

/**
 * 以指定的字符串向左补齐位数
 *
 * StringUtils.leftPad("bat", 5, "z") = "zzbat"
 *
 * @param str
 *            原字符串
 * @param size
 *            总位数
 * @param padStr
 *            补充的字符串
 * @returns 补位后的字符串
 */
function leftPad(str, size, padStr) {
    if (!padStr && padStr != 0) {
        padStr = " "; // 默认以空格补位
    }

    return strUtil.leftPad(str, size, padStr + "");
}

/**
 * 以指定的字符串向右补齐位数
 *
 * StringUtils.leftPad("bat", 5, "z") = "batzz"
 *
 * @param str
 * @param size
 * @param padStr
 * @returns 补位后的字符串
 */
function rightPad(str, size, padStr) {
    if (!padStr && padStr != 0) {
        padStr = " "; // 默认以空格补位
    }

    return strUtil.rightPad(str, size, padStr + "");
}

/**
 * 以指定的字符串向两边补齐位数
 *
 * StringUtils.leftPad("bat", 5, "z") = "zbatz"
 *
 * @param str
 * @param size
 * @param padStr
 * @returns 补位后的字符串
 */
function centerPad(str, size, padStr) {
    if (!padStr && padStr != 0) {
        padStr = " "; // 默认以空格补位
    }

    return strUtil.centerPad(str, size, padStr + "");
}
/**
 * 反转字符串
 *
 * @param str
 * @returns 反转后的字符串
 */
function reverse(str) {
    return strUtil.reverse(str);
}

/**
 * 转换大小写，将大写转为小写，小写转为大写
 *
 * @param str
 * @returns 转换后的字符串
 */
function swapCase(str) {
    return strUtil.swapCase(str);
}

/**
 * 判断字符串是否为数字
 *
 * @param str
 * @returns
 */
function isNumeric(str) {
    return strUtil.isNumeric(str);
}

/**
 * 判断字符串是否为字母
 *
 * @param str
 * @returns
 */
function isAlpha(str) {
    return strUtil.isAlpha(str);
}

/**
 * 是否为空字符串
 *
 * @param str
 * @return 是否为空
 */
function isEmpty(str) {
    return strUtil.isEmpty(str);
}

/**
 * 是否为日期格式 yyyy-MM-dd
 *
 * @param str
 * @returns
 */
function isDate(str) {
    return strUtil.isDate(str);
}

/**
 * 是否为日期时间格式 yyyy-MM-dd HH:mm:ss
 *
 * @param str
 * @returns
 */
function isDateTime(str) {
    return strUtil.isDateTime(str);
}

/**
 * 是否为时间格式 HH:mm:ss
 *
 * @param str
 * @returns
 */
function isTime(str) {
    return strUtil.isTime(str);
}

/**
 * 运行字符串中所包含的el表达式
 *
 * @param str
 * @param map
 */
function evalEL(str, map){
    return strUtil.evalEL(str, map);
}

/**
 * 运行字符串中所有的占位符
 *
 * 示例：evalStr("我是{0}人，今年{1}岁", ["中国", 20]);
 * 返回：我是中国人，今年20岁
 *
 *
 * @param str
 * @param vals 值数组
 */
function evalStr(str, vals){
    return strUtil.evalStr(str, vals);
}

/**
 * 检查其参数是否为数字格式的字符串，是返回true,否则返回false
 *
 * @return 检查其参数是否为数字格式的字符串，是返回true,否则返回false
 * @deprecated
 * @param str
 *            字符串型参数
 */
function isNumberText(str) {
    var retvar = $TOOLS.STRING_UTIL.isNumber(str);
    return retvar;
}

/**
 * 检查其参数是否为日期格式的字符串，是返回true,否则返回false
 *
 * @return 检查其参数是否为日期格式的字符串，是返回true,否则返回false
 * @deprecated
 * @param str
 *            字符串型参数
 */
function isDateText(str) {
    var retvar = $TOOLS.STRING_UTIL.isDate(str);
    return retvar;
}

/**
 * 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @return 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 * @deprecated
 * @param str
 *            需要拆分的字符串
 * @param separator
 *            分割符
 */
function splitText(str, separator) {
    var retvar = $TOOLS.STRING_UTIL.split(str, separator);
    return retvar;
}

/**
 * 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @return 按照指定的分割符，切割文本，将分割好的结果用通过数组返回
 *
 * @deprecated
 * @param str
 *            需要拆分的字符串
 * @param separator
 *            分割字串
 */
function splitString(str, separator) {
    var retvar = $TOOLS.STRING_UTIL.splitString(str, separator);
    return retvar;
}

/**
 * 将指定的字符串数组按照指定的分隔符组合成字符串，返回字符串
 *
 * @deprecated
 * @return 将指定的字符串数组按照指定的分隔符组合成字符串，返回字符串
 *
 * @param strs
 *            字符串数组
 */
function joinText(strs) {
    var retvar = $TOOLS.STRING_UTIL.unite(strs);
    return retvar;
}


var document = getCurrentDocument();
/**
 * 验证是否为空
 *
 * @param fieldName
 *            需要验证的字段名
 * @param desc
 *            提示用的字段描述
 * @returns {String}
 */
function checkEmpty(fieldName, desc) {
    var value = document.getItemValueAsString(fieldName);
    var retvar = "";
    if (value == null || value.trim().length() <= 0) {
        retvar = desc + "必需填写！";
    }
    return retvar;
}
/**
 * 验证是否大于零
 *
 * @param fieldName
 *            需要验证的字段名
 * @param desc
 *            提示用的字段描述
 * @returns {String}
 */
function checkAmount(fieldName, desc) {
    var value = document.getItemValueAsDouble(fieldName);
    var retvar = "";
    if (value <= 0) {
        retvar = desc + "必须大于零！";
    }
    return retvar;
}
/**
 * 子表单不能空
 *
 * @param formName
 *            子表单名字
 * @param desc
 *            提示信息
 * @returns {String}
 */
function checkDetail(formName, desc) {
    var retvar = "";
    var count = 0;
    var childs = document.getChilds(formName);
    if (formName) {
        if (childs == null && childs.size() < 0) {
            retvar = "'" + desc + "'子明细表单必须填写！";
        }
    } else {
        if (childs != null && childs.size() > 0) {
            for ( var it = childs.iterator(); it.hasNext();) {
                var child = it.next();
                if (!child.istmp) {
                    count++;
                }
            }
        }
    }
    if (count == 0) {
        retvar = "'" + desc + "'子明细表单必须填写！";
    }
    return retvar;
}
/**
 * 验证URL是否正确
 *
 * @param fieldName
 *            字段名
 * @returns {String}
 */
function checkUrl(fieldName, desc) {
    var value = getItemValue(fieldName);
    var retvar = "";
    var reg = new RegExp("[a-zA-z]+://[^\s]*");
    if (value != null && value.trim().length() > 0) {
        if (!reg.test(value)) {
            retvar = desc + "格式输入有误！";
        }
    }
    return retvar;
}
/**
 * 验证email是否正确
 *
 * @param fildName
 *            字段名
 * @param desc
 * @returns {String}
 */
function isEmail(fildName, desc) {
    var retvar = "";
    var regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    var email_val = getItemValue(fildName);
    if (!isEmpty(email_val)) {
        if (!regex.test(email_val)) {
            retvar = desc + "格式输入有误！";
        }
    }
    return retvar;
}

/**
 * 验证是否为数字
 *
 * @param fieldName
 *            字段名
 * @param desc
 *            提示信息
 * @returns {String}
 */
function checkNumber(fieldName, desc) {
    var retvar = "";
    var number = document.getItemValueAsString(fieldName);
    if (isNaN(number)) {
        retvar = desc + "只能输入数字！";
    }
    return retvar;
}
/**
 * 验证是否是整型
 *
 * @param fieldName
 *            字段名
 * @param desc
 *            提示信息
 * @returns {String}
 */
function checkInteger(fieldName, desc) {
    var retvar = "";
    var value = document.getItemValueAsString(fieldName);
    if (isEmpty(value)) {
        retvar = desc + "必需填写！";
    } else if (!/^(-|\+)?\d+$/.test(value)) {
        retvar = desc + "字段只能为整型！";
    }
    return retvar;
}

/**
 * 检查其参数是否为日期格式的字符串，是返回true,否则返回false
 *
 * @return 检查其参数是否为日期格式的字符串，是返回true,否则返回false
 *
 * @param fieldName
 *            表单字段名
 * @param desc
 *            提示信息
 */
function checkDate(fieldName, desc) {
    var retvar = "";
    var falg = $TOOLS.STRING_UTIL.isDate();
    if (!falg) {
        retvar = desc + "字段只能为日期型！";
    }
    return retvar;
}
/**
 * 验证手机号填写是否正确
 *
 * @param fieldName
 *            表单字段名
 * @param desc
 *            提示信息
 */
function checkPhone(fieldName, desc) {
    var retvar = "";
    var reg = /^(?:13\d|15[389]|18[6380])-?\d{5}(\d{3}|\*{3})$/;
    var value = document.getItemValueAsString(fieldName);
    if (isEmpty(value)) {
        retvar = desc + "必需填写！";
    } else if (!reg.test(value)) {
        retvar = desc + "字段只能为手机号码！";
    }
    return retvar;
}

/**
 * 验证手机号填写是否正确
 *
 * @param fieldName
 *            表单字段名
 * @param desc
 *            提示信息
 */
function checkTelPhone(fieldName, desc) {
    var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
    var retvar = "";
    var value = document.getItemValueAsString(fieldName);
    if (isEmpty(value)) {
        retvar = desc + "必需填写！";
    } else if (!reg.test(value)) {
        retvar = desc + "字段只能为电话号码！";
    }
    return retvar;
}

/**
 * 判断值是否不为空,为数字时不为0,为字符串时长度大于0,为日期时不为null
 *
 * @return 判断值是否不为空,为数字时不为0,为字符串时长度大于0,为日期时不为null
 * @param val
 *            要作判断的值;
 */
function checkNotNull(val) {
    if (val != null && typeof (val) != "undefined") {
        if (typeof (val) == "number") {
            return (val != 0);
        }
        return (new java.lang.String(val).trim().length() > 0);
    }
    return false;
}

/**
 * 检查其参数是否为电子邮箱地址格式的字符串，是返回true,否则返回false
 *
 * @deprecated
 * @return 检查其参数是否为电子邮箱地址格式的字符串，是返回true,否则返回false
 *
 * @param str
 *            字符串型参数
 */
function checkMailAddressText(str) {
    var t = /^\w+@\w+(\.\w+)+/;
    var g = /^\w+\.\w+@\w+(\.\w+)+/;
    if (t.test(str) == false && g.test(str) == false) {
        return false;
    }
    return true;
}

/**
 * 判断唯一性
 *
 * @param fieldName
 *            字段名称
 * @param fieldValue
 *            字段值
 * @param msg
 *            预设字段值重复提示信息
 * @return 如果不唯一返回提示信息，否则返回空字符串
 */
function checkFieldUnique(fieldName, fieldValue, msg) {
    var doc = $CURRDOC.getCurrDoc();
    var dql = "$formname='" + doc.getFormShortName() + "' and " + fieldName
        + "='" + fieldValue + "' and $id <> '" + doc.getId() + "'";
    var dpg = queryByDQL(dql);
    if (dpg.size() > 0) {
        if (msg) {
            return msg;
        }
        return fieldName + " 不能重复!";
    }
    return null;
}

/* 判断数字不能小于某值 */
function notLessThan(fieldName, value, description, isEqual) {
    var returnStr = "";
    var doc = $CURRDOC.getCurrDoc();
    var fieldValue = doc.getItemValueAsDouble(fieldName);

    if (isEqual) {
        if (fieldValue <= value) {
            returnStr = "'" + description + "'不能小于等于" + value + "！";
        }
    } else {
        if (fieldValue < value) {
            returnStr = "'" + description + "'不能小于" + value + "！";
        }
    }
    return returnStr;
}

/* 判断数字不能大于于某值 */
function notGreateThan(fieldName, value, description, isEqual) {
    var returnStr = "";
    var doc = $CURRDOC.getCurrDoc();
    var fieldValue = doc.getItemValueAsDouble(fieldName);
    if (isEqual) {
        if (fieldValue >= value) {
            returnStr = "'" + description + "'不能大于等于" + value + "！";
        }
    } else {
        if (fieldValue > value) {
            returnStr = "'" + description + "'不能大于" + value + "！";
        }
    }
    return returnStr;
}


/**
 * 获取当前文档的状态标签
 *
 * @return 返回当前文档的状态标签
 */
function getStateLabel() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.getStateLabel();
    }
    return null;
}

/**
 * 获取当前记录是否审批完成
 *
 * @return true|false
 */
function isComplete() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        if (doc.getStateInt() == 0x00100000) {
            return true;
        }
    }
    return false;
}

/**
 * 获取指定文档是否审批完成
 *
 * @param docid
 *            文档ID
 * @return true|false
 */
function isCompleteByDocId(docid) {
    var doc = findDocument(docid);
    if (doc != null) {
        if (doc.getStateInt() == 0x00100000) {
            return true;
        }
    }
    return false;
}

/**
 * 获取当前记录是否处在第一个节点
 *
 * @return true|false
 */
function isFirtNode() {
    var doc = $CURRDOC.getCurrDoc();
    if (doc != null) {
        return doc.isFirtNode();
    }
    return false;
}

/**
 * 获取指定文档是否处在第一个节点
 *
 * @param docid
 *            文档ID
 * @return true|false
 */
function isFirtNodeByDocId(docid) {
    var doc = findDocument(docid);
    if (doc != null) {
        return doc.isFirtNode();
    }
    return false;
}

/**
 * 获取父流程文档
 *
 * @return 获取父流程文档
 */
function getParentFlowDoc() {
    var currDoc = $CURRDOC.getCurrDoc();
    if (currDoc != null) {
        doc = currDoc.getParentFlowDocument();
    }

    return doc;
}

/**
 * 子流程开启脚本中使用此函数，可获取到子流程启动的文档对象
 *
 * @return 返回子流程启动文档对象
 */
function getStartDoc() {
    return $STARTUP_DOC;
}

/**
 * 获取子流程文档
 *
 * @return 获取子流程文档
 */
function getSubFlowDocList() {
    var currDoc = $CURRDOC.getCurrDoc();
    if (currDoc != null) {
        return currDoc.getSubFlowDocuments();
    }
}

/**
 * 根据文档ID与流程ID获取文档最后审批记录
 *
 * @param docid
 *            文档ID
 * @param flowid
 *            流程ID
 * @return 最后审批记录
 */
function getLastRelationHis(docid, flowid) {
    var process = new Packages.com.yunbo.core.workflow.storage.runtime.ejb.RelationHISProcessBean(
        getApplication());
    return process.doViewLast(docid, flowid);
}

/**
 * 获取当前文档的最后审批人
 *
 * @return 最后审批人审批记录
 */
function getLastApprover() {
    var doc = getCurrentDocument();
    var rtn = null;
    var rhis = getLastRelationHis(doc.getId(), doc.getFlowid());
    if (rhis != null) {
        var actors = rhis.getActorhiss();
        if (actors != null && actors.size() > 0) {
            for ( var it = actors.iterator(); it.hasNext();) {
                rtn = it.next();
            }
        }
    }
    return rtn;
}

/**
 * 获取当前文档的最后审批人ID
 *
 * @return 审批人ID
 */
function getLastApproverId() {
    return getLastApprover().getActorid();
}

/**
 * 获取当前文档的最后审批人名称
 *
 * @return 审批人名称
 */
function getLastApproverName() {
    return getLastApprover().getName();
}

/**
 * 获取当前文档的最后审批时间
 *
 * @return 审批时间
 */
function lastApprovedTime() {
    var doc = getCurrentDocument();
    var rtn = "";
    var rhis = getLastRelationHis(doc.getId(), doc.getFlowid());
    if (rhis != null) {
        var actors = rhis.getActorhiss();
        if (actors != null && actors.size() > 0) {
            for ( var it = actors.iterator(); it.hasNext();) {
                actorHis = it.next();
                if (actorHis.getProcesstime() != null) {
                    rtn = $TOOLS.DATE_UTIL.getDateTimeStr(actorHis
                        .getProcesstime());
                } else {
                    rtn = $TOOLS.DATE_UTIL.getDateTimeStr(relHis
                        .getActiontime());
                }
            }
        }
    }
    return rtn;
}

/** 根据流程节点名称(传需要获取节点的上一个节点)获取用户 */
function findUserFromFlowNode(nodeName) {
    var userProcess = getUserProcess();
    var userList = createObject("java.util.ArrayList");
    var doc = getCurrentDocument();
    var domainid = getDomainid();
    var sql = "select max(id),auditor as item_auditor,'" + domainid
        + "' as domainid from t_relationhis where docid='" + doc.getId()
        + "' and startnodename='" + nodeName + "' group by auditor";
    var datas = queryBySQL(sql);
    for ( var it = datas.iterator(); it.hasNext();) {
        var data = it.next();
        var userid = data.getItemValueAsString("auditor");
        var user = userProcess.doView(userid);
        userList.add(user);
    }
    return userList;
}

/**
 * 获取抄送人
 *
 * @returns Collection<BaseUser>
 */
function getCirculatorList() {
    var doc = $CURRDOC.getCurrDoc();
    var nodeid = getParameter("_currid");
    var flowid = getParameter("_flowid");
    var request = $WEB.getParamsTable().getHttpRequest();
    return Packages.cn.myapps.core.workflow.engine.StateMachineHelper
        .getCirculatorList(doc.getId(), $WEB.getWebUser(), nodeid, request,
            flowid);
}