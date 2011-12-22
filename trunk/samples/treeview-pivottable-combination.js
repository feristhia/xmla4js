(function(){

var win = window,
    doc = document,
    body = doc.body
;
function clearBrowserSelection() {
    if (win.getSelection){
        win.getSelection().removeAllRanges();
    }
    else
    if (doc.selection) {
        doc.selection.clear();
    }    
}

function merge(dst, src, mode){
    var p,v;
    mode = parseInt(mode, 10);
    mode = mode ? mode : 0;
    if (!iObj(dst)) {
        dst = {};
    }
    for (p in src) {
        o = src[p]
        if (((o===null) && (mode & merge.DELETE_IF_NULL)) || (mode & merge.DELETE)) {
            delete dst[p];
        }
        else 
        if (iUnd(dst[p]) || (mode & merge.OVERWRITE)) {
            dst[p] = o;
        }
    }
    return dst;
}

merge.MERGE = 0;
merge.OVERWRITE = 1;
merge.DELETE_IF_NULL = 2;
merge.DELETE = 4;

function iFun(a){return typeof(a) === "function";}
function iUnd(a){return typeof(a) === "undefined";}
function iNum(a){return typeof(a) === "number";}
function iStr(a){return typeof(a) === "string";}
function iInt(a){return parseInt(a) === a;}
function iArr(a){return a && a.constructor === Array;}
function iObj(a){return a!==null && typeof(a) === "object";}
function iNod(a){return iObj(el) && el.nodeType===1;}
function gEl(id) {
    if (iStr(id)) id = doc.getElementById(id);
    return id;
}
function gEls(node, tag, idx){
    var node = node.getElementsByTagName(tag);
    if (node && iInt(idx)) {
        node = node.item(idx);
    } 
    return node;
}
function sAtts(e, atts){
    e = gEl(e);
    var name, val;
    for (name in atts) {
        val = atts[name];
        if (iArr(val)) {
            val = val.join(" ");
        }
        else
        if (iObj(val)) {
            if (name === "style"){
                var p, s = "";
                for (p in val) {
                    s += p + ": " + val[p] + ";";
                }
                val = s;
            }
            else {
                val = val.toString();
            }
        }
        e.setAttribute(name, val);
    }
}

function gAtt(e, att){
    return gEl(e).getAttribute(att);
}

function sAtt(e, att, val){
    gEl(e).setAttribute(att, val);
}

function rAtt(e, att){
    gEl(e).removeAttribute(att);
}

function aCh(e, chs) {
    var m;
    e = gEl(e);
    if (!iArr(chs)){
        chs = [chs];
    }
    for (var i = 0, n = chs.length, c; i < n; i++){
        c = chs[i];
        if (iStr(c)) {
            c = doc.createTextNode(c);
        }
        e.appendChild(c);
    }
}

function cEl(tag, atts, chs, p){
    var el = doc.createElement(tag);
    if (atts) {
        sAtts(el, atts);
    }
    if (chs) {
        aCh(el, chs);
    }
    if (p) {
        aCh(p, el)
    }
    return el;
}

function dEl(el) {
    var el = gEl(el);
    el.parentNode.removeChild(el);
}
/***************************************************************
*   
*   TreeNode
*
***************************************************************/
var TreeNode;
(TreeNode = function(conf){
    this.conf = conf;
    this.id = ++TreeNode.id;
    TreeNode.instances[this.getId()] = this;
    if (conf.parentTreeNode) {
        TreeNode.getInstance(conf.parentTreeNode).appendTreeNode(this);
    }
    else
    if (conf.parentElement) {
        this.appendToElement(gEl(conf.parentElement));
    }
}).prototype = {
    getConf: function() {
        return this.conf;
    },
    appendToElement: function(el) {
        aCh(el, this.getDom());
    },
    appendTreeNode: function(treeNode){
        aCh(this.getDomBody(), treeNode.getDom());
    },
    getId: function(){
        return TreeNode.prefix + this.id;
    },
    getState: function(){
        return this.conf.state || TreeNode.states.collapsed;
    },
    getCustomClass: function(){
        return this.conf.customClass;
    },
    getTitle: function(){
        return this.conf.title;
    },
    getDom: function() {
        var dom;
        if (!(dom = gEl(this.getId()))){
            dom = this.initDom();
        }
        return dom;
    },
    getDomBody: function() {
        return gEls(this.getDom(), "DIV", 1);
    }, 
    toggle: function() {
        var state = this.getState();
        switch (state) {
            case TreeNode.states.collapsed: 
                state = TreeNode.states.expanded;
                break;
            case TreeNode.states.expanded: 
                state = TreeNode.states.collapsed;
                break;
        }
        this.setState(state);
    },
    setState: function(state){
        this.conf.state = state;
        this.initClass(this.getDom());
        if (state === TreeNode.STATE_COLLAPSED || gEls(this.getDomBody(), "DIV").length) return;
        this.loadChildren();
    },
    loadChildren: function() {
        var me = this, loader = me.conf.loadChildren;
        if (loader) {
            var ajaxLoader = cEl("IMG", {
                src: "ajax-loader-small.gif"
            }, null, me.getDomBody()),
            f = function(){
                loader.call(me, function(){
                    dEl(ajaxLoader);
                });            
            }
            setTimeout(f, 1);
        }
    },
    initClass: function(dom) {
        dom.className = TreeNode.prefix + 
                    " " + this.getState() + 
                    " " + this.getCustomClass()
        ;
    },
    initDom: function() {
        var dom = cEl("DIV", {
            id: this.getId()
        }, [
            cEl("DIV", {
                "class": "head",
                title: this.conf.tooltip || this.conf.title
            }, [
                cEl("SPAN", {
                    "class": "toggle"
                }),
                cEl("SPAN", {
                    "class": "label"
                }, this.getTitle())
            ]),
            cEl("DIV", {
                "class": "body"
            })
        ]); 
        ;
        this.initClass(dom);
        return dom;
    },
    eachChild: function() {
    }
};
TreeNode.states = {
    collapsed: "collapsed",
    expanded: "expanded",
    leaf: "leaf"
};
TreeNode.id = 0;
TreeNode.prefix = "node";
TreeNode.instances = {};
TreeNode.getInstance = function(id){
    if (iInt(id)) id = TreeNode.prefix + id;
    return TreeNode.instances[id];
};
TreeNode.lookupTreeNode = function(el){
    while (el && el.className.indexOf(TreeNode.prefix)) {
        if (!(el = el.parentNode)) return null;
    }
    return TreeNode.getInstance(el.id);
};

/***************************************************************
*   
*   Event
*
***************************************************************/
var Event;
(Event = function(e) {
    if (!e) {
        e = win.event;
    }
    this.browserEvent = e;
    return this;
}).prototype = {    
    getTarget: function(){ 
        var browserEvent = this.browserEvent;
        if (browserEvent.target) {
            target = browserEvent.target;
        }
        else 
        if (browserEvent.srcElement) {
            target = browserEvent.srcElement
        }
        else {
            target = null;
        }
        return target;
    },
    getButton: function(){
        if (doc.addEventListener) {
            return this.browserEvent.button;
        }
        else
        if (doc.attachEvent) {
            switch (this.browserEvent.button) {
                case 1: 
                    return 0;
                case 2:
                    return 2;
                case 4:
                    return 1;
            }
        }
        return null;
    },
    getKeyCode: function(){
        return this.browserEvent.keyCode;
    },
    getShiftKey: function(){
        return this.browserEvent.shiftKey;
    },
    getCtrlKey: function(){
        return this.browserEvent.ctrlKey;
    },
    getXY: function(){
        return {
            x: this.browserEvent.clientX,
            y: this.browserEvent.clientY
        }
    },
    preventDefault: function() {
        this.browserEvent.preventDefault();
    },
    save: function(){ 
        var proto = Event.prototype, savedEvent = new Event.Saved(), property;
        for (property in proto) {
            if (property.indexOf("get")===0 && iFun(proto[property])) {
                savedEvent[
                    property.substr(3,1).toLowerCase() + property.substr(4)
                ] = this[property]();
            }
        }
        return savedEvent;
    }
};

(Event.Saved = function() {
}).prototype = {
    destroy: function(){
        for (var p in this) {
            if (this.hasOwnProperty(p)){
                delete this.p;
            }
        }
    }
};

for (property in Event.prototype) {
    if (property.indexOf("get")===0 && iFun(Event.prototype[property])) {
        Event.Saved.prototype[property] = new Function(
            "return this." + property.substr(3,1).toLowerCase() + property.substr(4) + ";"
        )
    }
}

var GlobalEvent = new Event(null);

Event.get = function(e) {
    if (!e) {
        e = win.event;
    }
    GlobalEvent.browserEvent = e;
    return GlobalEvent;
};

function listen(node, type, listener, scope) {
    if (!scope) {
        scope = win;
    }
    node = gEl(node);
    if (node.addEventListener) {
        node.addEventListener(type, function(e){
            listener.call(scope, Event.get(e));
        }, true);
    }
    else 
    if (node.attachEvent){
        node.attachEvent("on" + type, function(){
            listener.call(scope, Event.get(win.event));
        });
    }
}
/***************************************************************
*   
*   DDHandler
*
***************************************************************/
var DDHandler;
(DDHandler = function (config) {
    config = merge(config, {
        node: doc.body
    });
    var me = this;
    me.listeners = [];
    me.endDragListeners = null;
    me.whileDragListeners = null;
    me.node = (node = gEl(config.node));
    me.mousedown = false;
    me.initdrag = false;
    if (config.dragProxy!==false) {
        if (!(me.dragProxy = gEl(config.dragProxy))) {
            me.dragProxy = cEl("DIV", null, null, node);
        }
    }
    if (config.dropProxy!==false) {
        if (!(me.dropProxy = gEl(config.dropProxy))) {
            me.dropProxy = cEl("DIV", null, null, node);
        }
    }
    me.startDragEvent = null;
    listen(this.node, "mousedown", function(e){
        me.event = e;
        if (e.getButton()===0) {
            me.handleMouseDown(e);
        }
    }, this);
    listen(this.node, "mouseup", function(e){
        me.event = e;
        if (e.getButton()===0) {
            me.handleMouseUp(e);
        }
    }, this);
    listen(this.node, "mousemove", function(e){
        me.event = e;
        me.handleMouseMove(e);
    }, this);    
}).prototype = {
    listen: function(listener){
        if (!listener.scope) {
            listener.scope = win;
        }
        this.listeners.push(listener);
    },
    handleMouseDown: function(e) {
        var me = this;
        me.mousedown = true;
        if (!me.initdrag) {
            me.initdrag = true;
            me.startDrag(e);
        }
    },
    handleMouseUp: function(e){
        var me = this;
        if (me.mousedown) {
            if (me.initdrag) {
                me.initdrag = false;
                me.endDrag(e);
            }
            me.mousedown = false;
        }
    },
    handleMouseMove: function(e) {
        var me = this;
        if (me.mousedown) {
            if (!me.initdrag) {
                me.initdrag = true;
                me.startDrag(e);
            }
            else {
                me.whileDrag(e);
            }
        }
    },
    startDrag: function(e) {
        var me = this, i, 
            listeners = me.listeners, 
            n = listeners.length,
            listener
        ;
        me.endDragListeners = [];
        me.whileDragListeners = [];
        me.startDragEvent = e.save();
        for (i = 0; i < n; i++) {
            listener = listeners[i];
            if (listener.startDrag.call(listener.scope, e, me)!==true) continue;
            if (iFun(listener.endDrag)) me.endDragListeners.push(listener);
            if (iFun(listener.whileDrag)) me.whileDragListeners.push(listener);
        }
    },
    endDrag: function(e) {    
        var me = this, i, listeners, listener, n;
        if (me.startDragEvent) {
            listeners = me.listeners;
            n = listeners.length;
            for (i = 0; i < n; i++) {
                listener = listeners[i];
                listener.endDrag.call(listener.scope, e, me)
            }
            me.startDragEvent.destroy();
            me.startDragEvent = null;
        }
        me.endDragListeners = null;
        me.whileDragListeners = null;
    },
    whileDrag: function(e) {
        var me = this, i, n, listeners, listener;
        if (me.startDragEvent) {
            listeners = me.listeners;
            n = listeners.length;
            for (i = 0; i < n; i++) {
                listener = listeners[i];
                listener.whileDrag.call(listener.scope, e, me);
            }
            clearBrowserSelection();
        }
    }
};

/***************************************************************
*   
*   QueryDesigner
*
***************************************************************/
var QueryDesigner; 

(QueryDesigner = function(conf) {
    this.id = QueryDesigner.id++;
    this.conf = conf;
    this.axes = {};
    this.createAxes();
}).prototype = {
    reset: function() {
        for (var p in this.axes) {
            this.axes[p].reset();
        }
        this.dimensions = {};
        this.render();
    },
    addDimension: function(dimension, axis) {
        this.dimensions[dimension] = axis;
    },
    createAxis: function(conf) {
        conf = merge(conf, {
            queryDesigner: this
        });
        this.axes[conf.id] = new QueryDesignerAxis(conf);
    },
    createAxes: function() {
        this.createAxis({id: Xmla.Dataset.AXIS_COLUMNS});
        this.createAxis({id: Xmla.Dataset.AXIS_ROWS});
        this.createAxis({id: Xmla.Dataset.AXIS_PAGES});
    },
    getAxis: function(id) {
        return this.axes[id];
    },
    getAxisForHierarchy: function(hierarchyUniqueName) {
        var axis;
        if ((axis = this.getAxis(Xmla.Dataset.AXIS_COLUMNS)).hasHierarchy(hierarchyUniqueName)) return axis;
        if ((axis = this.getAxis(Xmla.Dataset.AXIS_ROWS)).hasHierarchy(hierarchyUniqueName)) return axis;
        if ((axis = this.getAxis(Xmla.Dataset.AXIS_PAGES)).hasHierarchy(hierarchyUniqueName)) return axis;
        return null;
    },
    getId: function() {
        return QueryDesigner.prefix + QueryDesigner.id;
    },
    createDom: function() {
        var dom = this.dom = cEl("TABLE", {
                id: this.getId(),
                "class": "query-designer",
                cellspacing: 0
            }),
            r, c
        ;
        r = dom.insertRow(dom.rows.length);
        c = r.insertCell(0);
        c.rowSpan = "100%";
        c.appendChild(this.getAxis(Xmla.Dataset.AXIS_PAGES).getDom());
        r = dom.insertRow(dom.rows.length);
        c = r.insertCell(0);
        c = r.insertCell(1);
        c.appendChild(this.getAxis(Xmla.Dataset.AXIS_COLUMNS).getDom());
        r = dom.insertRow(dom.rows.length);
        c = r.insertCell(0);
        c.appendChild(this.getAxis(Xmla.Dataset.AXIS_ROWS).getDom());
        return dom;
    },
    getDom: function() {
        var el = gEl(this.getId());
        if (!el) {
            el = this.createDom();
        }
        return el;
    },
    render: function() {
        this.getContainer().innerHTML = "";
        this.getContainer().appendChild(this.getDom());
    },
    getContainer: function() {
        return gEl(this.conf.container);
    },
};
QueryDesigner.id = 0;
QueryDesigner.prefix = "query-designer";

var QueryDesignerAxis;
(QueryDesignerAxis = function(conf){
    this.conf = conf;
    this.dimensions = null;
    this.hierarchies = null;
    this.hierarchyOrder  = null;
    this.setDefs = null;
    QueryDesignerAxis.instances[this.getId()] = this;
}).prototype = {
    reset: function() {
        this.hierarchies = {};
        this.dimensions = {};
        this.hierarchyOrder  = [];
        this.setDefs = [];
    },
    getLayout: function() {
        return (this.conf.id === Xmla.Dataset.AXIS_ROWS ? "vertical" : "horizontal"); 
    },
    getId: function(){
        return this.conf.queryDesigner.getId() + "-axis" + this.conf.id;
    },
    createDom: function() {
        var dom = this.dom = cEl("TABLE", {
                id: this.getId(),
                "class": "query-designer-axis query-designer-axis" + this.conf.id,
                cellspacing: 0
            }),
            r = dom.insertRow(0),
            c = r.insertCell(0),
            t
        ;
        c.className = "query-designer-axis-header";
        switch (this.conf.id) {
            case 0: t = "Columns"; break;
            case 1: t = "Rows"; break;
            case 2: t = "Pages"; break;
        }
        c.innerHTML = t;
        switch (this.getLayout()) {
            case "horizontal":
                c.setAttribute("rowspan", "100%");
                break;
            case "vertical":
                c.setAttribute("colspan", "100%");
                break;
        }
        return dom;
    },
    getDom: function() {
        var el = gEl(this.getId());
        if (!el) {
            el = this.createDom();
        }
        return el;
    },
    hasHierarchy: function(hierarchy) {
        return !iUnd(this.getHierarchyIndex(hierarchy));
    },
    getHierarchyIndex: function(hierarchy) {
        return this.hierarchies[hierarchy];
    },
    canDropItem: function(target, requestType, metadata) {
        var dimensionName = metadata.DIMENSION_UNIQUE_NAME,
            hierarchyName = metadata.HIERARCHY_UNIQUE_NAME,
            axis
        ;
        //if this hierarchy was already used on another axis, then we can't drop this item on this axis.
        if ((axis = this.conf.queryDesigner.getAxisForHierarchy(hierarchyName)) && axis !== this) return false;
        switch (requestType) {
            case "MDSCHEMA_HIERARCHIES":
                //if this axis already has this hierarchy then we can't drop it again.
                if (this.hierarchies[hierarchyName]) return false;
                //if this axis already has a hierarchy with this dimension, then we can only replace
                if (this.dimensions[dimensionName] && target.className.indexOf("query-designer-hierarchy")) return false;
                break;
            case "MDSCHEMA_LEVELS":
            case "MDSCHEMA_MEMBERS":
                break;
            default:
                return false;
        }
        return true;
    },
    replaceHierarchy: function(existingHierarchyIndex, metadata) {
        var oldHierarchy = this.hierarchyOrder[existingHierarchyIndex],
            oldHierarchyName = oldHierarchy.HIERARCHY_UNIQUE_NAME,
            hierarchyName = metadata.HIERARCHY_UNIQUE_NAME,
            defaultMember = metadata.DEFAULT_MEMBER,
            layout = this.getLayout(), 
            dom = this.getDom(),
            r, c
        ;
        this.hierarchyOrder[existingHierarchyIndex] = metadata;
        delete this.hierarchies[oldHierarchyName];
        this.hierarchies[hierarchyName] = existingHierarchyIndex;
        this.dimensions[metadata.DIMENSION_UNIQUE_NAME] = hierarchyName;
        switch (layout) {
            case "horizontal":
                r = dom.rows.item(existingHierarchyIndex+1);
                c = r.cells(0);
                break;
            case "vertical":
                r = dom.rows.item(1);
                c = r.cells.item(1 + existingHierarchyIndex*2);
                break;
        }
        c.innerHTML = metadata.HIERARCHY_CAPTION;
        var setDefs = this.setDefs, numSetDefs = setDefs.length, i, setDef;
        for (i=0; i < numSetDefs; i++) {
            setDef = setDefs[i];
            delete setDef[oldHierarchyName];
            setDef[hierarchyName] = {
                member: defaultMember,
                type: "MDSCHEMA_MEMBERS"
            }
            switch(layout) {
                case "horizontal":
                    r.cells.item(1 + i*2).innerHTML = defaultMember;
                    break;
                case "vertical":
                    r = dom.rows.item(3+(i*2));
                    c = r.cells.item(existingHierarchyIndex*2);
                    break;
            }
            c.innerHTML = defaultMember;
            c.className = "query-designer-member";
        }
    },
    getIndexesForTableCell: function(td) {
        var hierarchyIndex, tupleIndex;
        switch (this.getLayout()) {
            case "horizontal":
                hierarchyIndex = td.parentNode.rowIndex;
                tupleIndex = 
                break;
            case "vertical":
                hierarchyIndex = td.cellIndex;
                tupleIndex = 
                break;
            default:
                return null;
        }
        return Math.floor(index / 2);
    },
    itemDropped: function(target, requestType, metadata) {
        var hierarchy = metadata.HIERARCHY_UNIQUE_NAME,
            hierarchyIndex = this.getHierarchyIndex(hierarchy),
            layout = this.getLayout(),
            dropTupleIndex, dropHierarchyIndex
        ;
        if (iUnd(hierarchyIndex)) {
            if (!target.className.indexOf("query-designer-hierarchy")) {
                this.replaceHierarchy(this.getHierarchyIndexForTableCell(target), metadata);
            }
            else {
                this.addHierarchy(metadata)
            }
        }
    },
    addHierarchy: function(hierarchy, customSetDef, hierarchyIndex) {
        var hierarchyName = hierarchy.HIERARCHY_UNIQUE_NAME,
            layout = this.getLayout()
        ;
        if (iUnd(hierarchyIndex)) {
            hierarchyIndex = this.hierarchyOrder.length;
            this.hierarchyOrder.push(hierarchy);
        }
        this.hierarchies[hierarchyName] = hierarchyIndex;
        this.dimensions[hierarchy.DIMENSION_UNIQUE_NAME] = hierarchyName;
        var dom = this.getDom(), r, c;

        switch(layout) {
            case "horizontal":
                r = hierarchyIndex ? dom.insertRow(hierarchyIndex*2) : dom.rows.item(0);
                c = r.insertCell(r.cells.length);
                c.className = "query-designer-axis-spacer";
                r = dom.insertRow(1 + hierarchyIndex*2);
                c = r.insertCell(0);
                break;
            case "vertical":
                r = dom.rows.item(1);
                if (!r) r = dom.insertRow(1);
                c = r.insertCell(r.cells.length);
                c.className = "query-designer-axis-spacer";
                c = r.insertCell(r.cells.length);
                break;
        }
        c.innerHTML = cubeMetaData.hierarchies[hierarchyName].HIERARCHY_CAPTION;
        c.className = "query-designer-hierarchy";

        var setDefs = this.setDefs, numSetDefs = setDefs.length, i, setDef, 
            defaultMember = hierarchy.DEFAULT_MEMBER
        ;
        if (numSetDefs) {
            for (i=0; i < numSetDefs; i++) {
                setDef = setDefs[i];
                setDef[hierarchyName] = {
                    member: defaultMember,
                    type: "MDSCHEMA_MEMBERS"
                }
                switch(layout) {
                    case "horizontal":
                        c = r.insertCell(r.cells.length);
                        c.className = "query-designer-axis-spacer";
                        c = r.insertCell(r.cells.length);
                        break;
                    case "vertical":
                        r = dom.rows.item(3+(i*2));
                        c = r.insertCell(r.cells.length);
                        c.className = "query-designer-axis-spacer";
                        c.rowSpan = "2";
                        c = r.insertCell(r.cells.length);
                        c.className = "query-designer-axis-spacer";                        
                        break;
                }
                c.innerHTML = defaultMember;
                c.className = "query-designer-member";
            }
        }
        else {
            setDef = {};
            setDef[hierarchyName] = {
                member: hierarchy.DEFAULT_MEMBER,
                type: "MDSCHEMA_MEMBERS"
            };
            setDefs.push(setDef);
            switch(layout) {
                case "horizontal":
                    c = r.insertCell(r.cells.length);
                    c.className = "query-designer-axis-spacer";
                    c = r.insertCell(r.cells.length);
                    r.insertCell(r.cells.length).className = "query-designer-axis-spacer";
                    break;
                case "vertical":
                    r = dom.insertRow(dom.rows.length);
                    c = r.insertCell(r.cells.length);
                    c.className = "query-designer-axis-spacer";
                    c.rowSpan = 2;

                    c = r.insertCell(r.cells.length);
                    c.className = "query-designer-axis-spacer";

                    r = dom.insertRow(dom.rows.length);
                    c = r.insertCell(0);
                    
                    break;
            }
            c.innerHTML = hierarchy.DEFAULT_MEMBER;
            c.className = "query-designer-member";
        }
    },
    addLevel: function(level, hierarchyIndex, tupleIndex) {
    },
    addMember: function(member, hierarchyIndex, tupleIndex) {
    }
};
QueryDesignerAxis.instances = {};
QueryDesignerAxis.getInstance = function(id){
    return QueryDesignerAxis.instances[id];
};

/***************************************************************
*   
*   Application
*
***************************************************************/
var xmla = new Xmla(),
    ddHandler = new DDHandler({
        node: "workspace",
        dragProxy: "ddDragProxy"
    }),
    queryDesigner = new QueryDesigner({
        container: "query-designer"
    }),
    cubeMetaData = null;
;
function showCube(show){
    gEl("cube").style.display = show ? "" : "none";
}
function toggleDataSources() {
    var body = gEl("datasources-body");
    showDataSources(body.style.display==="none" || (!gEls(body, "DIV").length));
}
function showDataSources(show){
    gEl("datasources-body").style.display = show ? "" : "none";
}
function clearCubeTree() {
    gEl("cube-body").innerHTML = "";
}
function initWorkarea() {
    queryDesigner.reset();
    gEl("query-results").innerHTML = "No results to display.";
}
function clearWorkarea() {
    gEl("query-designer").innerHTML = "";
    gEl("query-results").innerHTML = "";
}
function clearUI() {
    gEl("datasources-body").innerHTML = "";
    clearCubeTree();
    
}
function metadataClicked(e) {
    if (!e) e = win.event;
    var target = e.getTarget(),
        treeNode
    ;
    if (target.tagName === "DIV" && target.id === "datasources-head") {
        toggleDataSources();
    }
    else
    if (target.tagName === "SPAN" && target.className === "toggle") {
        treeNode = TreeNode.lookupTreeNode(target);
        if (!treeNode) return;
        treeNode.toggle();
    }
    else {
        treeNode = TreeNode.lookupTreeNode(target);
        if (treeNode.getCustomClass() === "MDSCHEMA_CUBES") {
            selectCube(treeNode);
        }
    }
}
function discoverClicked(){
    clearWorkarea();
    showCube(false);
    showDataSources(true);
    xmla.discoverDataSources({
        url: gEl("url").value,
        success: function(xmla, req, resp){
            clearUI();
            resp.eachRow(function(row){
                var nodeId = (new TreeNode({
                    parentElement: "datasources-body",
                    customClass: req.requestType,
                    title: row.DataSourceDescription,
                    tooltip: row.DataSourceInfo,
                    state: TreeNode.states.expanded,
                    metadata: row
                })).getId();
                xmla.discoverDBCatalogs({
                    url: row.URL,
                    properties: {DataSourceInfo: row.DataSourceInfo},
                    nodeId: nodeId,
                    success: function(xmla, req, resp) {
                        resp.eachRow(function(row){ 
                            var properties = {
                                DataSourceInfo: req.properties.DataSourceInfo,
                                Catalog: row.CATALOG_NAME
                            },
                            nodeId = (new TreeNode({
                                parentTreeNode: req.nodeId,
                                customClass: req.requestType,
                                title: row.CATALOG_NAME,
                                tooltip: row.DESCRIPTION,
                                state: TreeNode.states.expanded,
                                metadata: row
                            })).getId();
                            xmla.discoverMDCubes({
                                url: req.url,
                                properties: properties,
                                restrictions: {CATALOG_NAME: row.CATALOG_NAME},
                                nodeId: nodeId,
                                success: function(xmla, req, resp) {
                                    resp.eachRow(function(row){
                                        var restrictions = {
                                            CATALOG_NAME: req.restrictions.CATALOG_NAME,
                                            CUBE_NAME: row.CUBE_NAME
                                        },
                                        nodeId = (new TreeNode({
                                            parentTreeNode: req.nodeId,
                                            customClass: req.requestType,
                                            title: row.CUBE_CAPTION,
                                            tooltip: row.DESCRIPTION,
                                            state: TreeNode.states.leaf,
                                            metadata: row, 
                                            xmla: {
                                                url: req.url,
                                                properties: properties,
                                                restrictions: restrictions
                                            }
                                        })).getId();
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
    });
}
function selectCube(cubeTreeNode) {
    cubeMetaData = {
        cube: cubeTreeNode.conf.metadata,
        measures: {
        },
        hierarchies: {
        }
    };
    clearCubeTree();
    initWorkarea();
    showCube(true);
    showDataSources(false);
    var conf = cubeTreeNode.getConf();
    gEl("cube-head").innerHTML = conf.title;
    xmla.discoverMDMeasures({
        url: conf.xmla.url,
        properties: conf.xmla.properties,
        restrictions: conf.xmla.restrictions,
        success: function(xml, req, resp) {
            resp.eachRow(function(row){
                cubeMetaData.measures[row.MEASURE_UNIQUE_NAME] = row;
                new TreeNode({
                    parentElement: "cube-body",
                    customClass: req.requestType,
                    title: row.MEASURE_CAPTION,
                    tooltip: row.MEASURE_UNIQUE_NAME,
                    state: TreeNode.states.leaf,
                    metadata: row
                });
            });
            xmla.discoverMDHierarchies({
                url: req.url,
                properties: req.properties,
                restrictions: req.restrictions,
                success: function(xmla, req, resp) {
                    resp.eachRow(function(row){
                        if (row.DIMENSION_TYPE===2) return;
                        cubeMetaData.hierarchies[row.HIERARCHY_UNIQUE_NAME] = row;
                        var restrictions = {
                            CATALOG_NAME: req.restrictions.CATALOG_NAME,
                            CUBE_NAME: req.restrictions.CUBE_NAME,
                            DIMENSION_UNIQUE_NAME: row.DIMENSION_UNIQUE_NAME,
                            HIERARCHY_UNIQUE_NAME: row.HIERARCHY_UNIQUE_NAME
                        },
                        nodeId = (new TreeNode({
                            parentElement: "cube-body",
                            customClass: req.requestType,
                            title: row.HIERARCHY_CAPTION,
                            tooltip: row.HIERARCHY_UNIQUE_NAME,
                            state: TreeNode.states.collapsed,
                            metadata: row,
                            loadChildren: function(callback) {
                                xmla.discoverMDLevels({
                                    url: req.url,
                                    properties: req.properties,
                                    restrictions: restrictions,
                                    nodeId: nodeId,
                                    success: function(xmla, req, resp) {
                                        resp.eachRow(function(row){
                                            var restrictions = {
                                                CATALOG_NAME: req.restrictions.CATALOG_NAME,
                                                CUBE_NAME: req.restrictions.CUBE_NAME,
                                                DIMENSION_UNIQUE_NAME: req.restrictions.DIMENSION_UNIQUE_NAME,
                                                HIERARCHY_UNIQUE_NAME: req.restrictions.HIERARCHY_UNIQUE_NAME,
                                                LEVEL_UNIQUE_NAME: row.LEVEL_UNIQUE_NAME
                                            },
                                            nodeId = (new TreeNode({
                                                parentTreeNode: req.nodeId,
                                                customClass: req.requestType,
                                                title: row.LEVEL_CAPTION,
                                                tooltip: row.LEVEL_UNIQUE_NAME,
                                                metadata: row,
                                                loadChildren: function(callback){
                                                    xmla.discoverMDMembers({
                                                        url: req.url,
                                                        properties: req.properties,
                                                        restrictions: restrictions,
                                                        
                                                        nodeId: this.getId(),
                                                        success: function(xmla, req, resp) {
                                                            var loadChildren = function(callback){
                                                                var conf = this.conf,
                                                                    metadata = conf.metadata,
                                                                    properties = {
                                                                    DataSourceInfo: req.properties.DataSourceInfo,
                                                                    Catalog: req.properties.Catalog,
                                                                    Format: "Multidimensional",
                                                                    AxisFormat: "TupleFormat"
                                                                },  mdx =   "WITH MEMBER [Measures].numChildren " +
                                                                            "AS " + metadata.HIERARCHY_UNIQUE_NAME  + ".CurrentMember.Children.Count " + 
                                                                            "SELECT CrossJoin(" + metadata.MEMBER_UNIQUE_NAME + ".Children," +
                                                                                    "[Measures].numChildren) ON COLUMNS " +
                                                                            "FROM [" + metadata.CUBE_NAME + "]"
                                                                ;
                                                                xmla.execute({
                                                                    url: req.url,
                                                                    properties: properties,
                                                                    statement: mdx,
                                                                    cube: this.conf.CUBE_NAME,
                                                                    hierarchy: this.conf.HIERARCHY_UNIQUE_NAME,
                                                                    metadata: metadata,
                                                                    nodeId: this.getId(),
                                                                    requestType: req.requestType,
                                                                    success: function(xml, req, resp){
                                                                        var cellset = resp.getCellset();
                                                                        resp.getColumnAxis().eachTuple(function(tuple){
                                                                            cellset.nextCell();
                                                                            var childCount = cellset.cellValue(),
                                                                            metadata = req.metadata,
                                                                            member = tuple.members[0],
                                                                            memberUniqueName = member.UName,
                                                                            memberCaption = member.Caption,
                                                                            nodeId = (new TreeNode({
                                                                                parentTreeNode: req.nodeId,
                                                                                customClass: req.requestType,
                                                                                title: memberCaption,
                                                                                tooltip: memberUniqueName,
                                                                                state: childCount ? TreeNode.states.collapsed : TreeNode.states.leaf,
                                                                                metadata: merge({
                                                                                    MEMBER_UNIQUE_NAME: memberUniqueName,
                                                                                    MEMBER_CAPTION: memberCaption,
                                                                                    LEVEL_UNIQUE_NAME: member.LName,
                                                                                    LEVEL_NUMBER: member.LNum,
                                                                                    CHILDREN_CARDINALITY: childCount
                                                                                }, metadata),
                                                                                loadChildren: loadChildren
                                                                            })).getId();
                                                                        });
                                                                        if (iFun(callback)) callback.call(win);
                                                                    }
                                                                });
                                                            }
                                                            resp.eachRow(function(row){
                                                                nodeId = (new TreeNode({
                                                                    parentTreeNode: req.nodeId,
                                                                    customClass: req.requestType,
                                                                    title: row.MEMBER_CAPTION,
                                                                    tooltip: row.MEMBER_UNIQUE_NAME,
                                                                    state: row.CHILDREN_CARDINALITY ? TreeNode.states.collapsed : TreeNode.states.leaf,
                                                                    metadata: row,
                                                                    loadChildren: loadChildren
                                                                }).getId());
                                                            });
                                                            if (iFun(callback)) callback.call(win);
                                                        }
                                                    });
                                                }
                                            })).getId();
                                        });
                                        if (iFun(callback)) callback.call(win);
                                    }
                                });
                            }
                        })).getId();
                    });
                }
            });
        }
    });
}

showCube(false);
listen("discover", "click", discoverClicked);
listen("metadata", "click", metadataClicked);
ddHandler.listen({
    startDrag: function(event, ddHandler) {
        var target = event.getTarget(), startDragEvent,
            tagName = target.tagName,
            className = target.className,
            treeNode, customClass, dragProxy, xy
        ;
        if (tagName !== "SPAN" || className !== "label") return; 
        treeNode = TreeNode.lookupTreeNode(target);
        if (!treeNode) return;
        customClass = treeNode.getCustomClass();
        switch (customClass) {
            case "MDSCHEMA_MEASURES":

                break;
            case "MDSCHEMA_HIERARCHIES": 
            case "MDSCHEMA_LEVELS":
            case "MDSCHEMA_MEMBERS":

                break;
            default: 
                return;
        }
        startDragEvent = ddHandler.startDragEvent;
        startDragEvent.treeNode = treeNode;  
        xy = event.getXY();
        dragProxy = ddHandler.dragProxy;
        dragProxy.style.position = "absolute";
        dragProxy.className = customClass;
        dragProxy.innerHTML = treeNode.getTitle();
        dragProxy.style.left = (xy.x + 2) + "px";
        dragProxy.style.top = (xy.y + 2) + "px";
        return true;
    },
    whileDrag: function(event, ddHandler) {
        var dragProxy = ddHandler.dragProxy,
            xy = event.getXY(),
            startDragEvent = ddHandler.startDragEvent,
            treeNode = startDragEvent.treeNode,
            customClass,
            dropTarget = event.getTarget(),
            tagName = dropTarget.tagName, 
            className = target.className
        ;
        dragProxy.style.left = (xy.x + 2) + "px";
        dragProxy.style.top = (xy.y + 2) + "px";
    },
    endDrag: function(event, ddHandler) {
        var dragProxy = ddHandler.dragProxy,
            startDragEvent = ddHandler.startDragEvent,
            treeNode = startDragEvent.treeNode,
            requestType, metadata, customClass,
            dropTarget = event.getTarget(),
            tagName = dropTarget.tagName, 
            className = target.className,
            queryDesignerAxis, queryDesigner
        ;
        if (treeNode) {
            metadata = treeNode.getConf().metadata;
            customClass = treeNode.getCustomClass();
            if (tagName === "TD") {
                var table = dropTarget.parentNode.parentNode.parentNode;
                if (!table.className.indexOf("query-designer-axis")){
                    queryDesignerAxis = QueryDesignerAxis.getInstance(table.id);
                    switch (customClass) { 
                        case "MDSCHEMA_HIERARCHIES": 
                        case "MDSCHEMA_LEVELS": 
                        case "MDSCHEMA_MEMBERS":
                            if (queryDesignerAxis.canDropItem(target, customClass, metadata)) {
                                queryDesignerAxis.itemDropped(target, customClass, metadata);
                            }
                            break;
                        default: 
                    }
                }
            }
        }
        dragProxy.className = "";
        dragProxy.innerHTML = "";
    }
});

})();
