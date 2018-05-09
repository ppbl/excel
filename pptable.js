/*!
 * pptable.js v0.0.1
 * (c) 2018 ppbl
 */
/* ----------------------导出或挂到全局对象 -----------------------*/
!function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.PpTable = factory());
}(this, (function () { 'use strict';
/* ----------------------导出或挂到全局对象 -----------------------*/




/* ----------------------需要用到的内部方法封装 -----------------------*/
function isUseless(p) { // 判断未定义或空/是无效的
  return p === undefined || p === null
}
function isDef(p) { // 是有效的
  return p !== undefined && p !== null
}
function setText(el, val) { // 赋值
    el.textContent = val;
}
function setLineCss(el, type, css) { // 设置行内样式
    el.style[type] = css;
}
function setHtml(el, val) { // 设置html
  el.innerHTML = val;
}
function insertBefore (before, r) { // 往前面插入
  r.parentNode.insertBefore( before, r );
}
function removeEl ( el ) { // 移除元素
  el.parentNode.removeChild(el);
}
function interTwoArr (m, n) { // 返回一个新数组，内容为两个数组的交集/NAN除外
  return m.filter(function (p) {
      return n.indexOf(p) > -1
  })
}
function diffTwoArr (m, n) { // 返回一个新数组，内容为两个数组的并集/NAN除外
  return m.concat(n).filter(function (p) {
      return m.indexOf(p) < 0 || n.indexOf(p) < 0
  })
}
function diffTwoArrs (m, n) { // 返回一个新数组，内容为两个数组的并集/NAN除外
  return m.concat(n).filter(function (p) {
      var s = p.filter(function (b) {
        return m.indexOf(b) < 0 || n.indexOf(b) < 0
      });
      return m.indexOf(s) < 0 || n.indexOf(s) < 0
  })
}
function addClass(el, cls) { // 添加类名/vue方法
  if (!cls || !(cls = cls.trim())) {
    return
  }
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}
function removeClass (el, cls) { // vue方法
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}
function getSpan(el, type) { // 获取row/col span的值
  return el.getAttribute(type+'span')*1;
}
/* ----------------------需要用到的内部方法封装 -----------------------*/




/* ----------------------初始化配置信息默认值 -----------------------*/
var colHeaders = {
  "序号": 'n'
}
var rowHeaders = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]
var rowHthColor = ["#fff", "#f3f3f3"]; // 单元格表头交替默认背景色
/* ----------------------配置信息默认值 -----------------------*/




/* ----------------------构造函数 -----------------------*/
function PpTable(options) {
  this._init(options);
}
/* ----------------------构造函数 -----------------------*/




/* ----------------------构造函数原型初始化方法 -----------------------*/
PpTable.prototype._init = function (options) {

  if (isUseless(options.el) || options.el === '') { // 如果容器元素选择器空，返回
    return
  }
  var pp = this;
  initOptions(pp, options);
  //console.log(pp);
  
  pp.rowCount = 0; // 行数
  pp.colCount = 0; // 列数
  

  var tableContainer = document.querySelector(pp.$options.el);
  addClass(tableContainer, "ohmygodtable");

  createTable(pp, tableContainer);
  
}
/* ----------------------构造函数原型初始化方法 -----------------------*/




/* ----------------------构造函数原型初始化方法用到的方法 -----------------------*/
function initOptions(pp, options) { // 处理传进来的参数
  var indRowHeaders = options.rowHeaders; // 传进来的
  

  pp.$options = {
    el: options.el,
    hasCol: options.hasRow,
    data: options.data,
    showRow: options.showRow || false,
    showCol: options.showCol || options.hasCol || 10,
    rowHeaders: options.rowHeaders || null,
    
    colHeaders: options.colHeaders || colHeaders,

    colHeadersColorAlternate: Array.isArray(options.colHeadersColorAlternate) ?
      options.colHeadersColorAlternate : options.colHeadersColorAlternate ?
      rowHthColor : false,
    contextMenu: options.contextMenu === false? false: true,
    setRowHead: function ( index) { // 设置行头
      return this.rowHeaders ?
              this.rowHeaders[index] ?  
              this.rowHeaders[index] :
                rowHeaders[index] ?
                  rowHeaders[index] :
                  rowHeaders[parseInt(index/26)-1] + rowHeaders[index%26]:
                    rowHeaders[index] ?
                      rowHeaders[index] :
                      rowHeaders[parseInt(index/26)-1] + rowHeaders[index%26];
    },
    setColHead: function ( index, style) { // 设置列头
      return this.colHeaders[style] ?
              this.colHeaders[style] === "n" ?
                index + 1 :
                this.colHeaders[style][index] ?
                  this.colHeaders[style][index] :
                  index + 1:
              index + 1;
    }
  }
}
var lightAreaArr = []; //点击高亮元素数组
function createTable(pp, tableContainer) { // 创建表格
  //console.log(this);
  var tableElement = document.createElement('table');


  //var length = options.length;
  /* 最左列风格 / 计划可选 */
  var key = Object.keys(pp.$options.colHeaders)[0];

  createThead(pp, tableElement, key);

  createTr(pp, tableElement, key);
  // 设置样式
  tableElement.cellPadding = 0;
  tableElement.cellSpacing = 0;


  tableContainer.appendChild(tableElement);

  
    /* 是否启用上下文菜单 */
  pp.$options.contextMenu && setContextMenu(pp, tableElement); 
      
  /* 鼠标单击单元格获取高亮提示 */
  highlightCell(pp, tableContainer, tableElement);
 
}


var oMenu = null;
function setContextMenu(pp, tableElement) {
  
  
  tableElement.oncontextmenu = function ( e ) {
    oMenu && document.body.removeChild(oMenu);

  
    /* css样式 */
    /* 上下文菜单数组 分好几个对象是为了稍微分个类*/
    var menuArr = [
      {
        "在上面插入行": insertRowAbove,
        "在下面插入行": insertRowBelow
      },
      {
        "在左面插入列": insertColLeft,
        "在右面插入列": insertColRight
      },{
        "删除行": deleteRow,
        "删除列": deleteCol
      },{
        "合并单元格": mergeCells
      }
    ]
    var oMenuCss = "top:"+ e.clientY +"px;left:"+ e.clientX +"px;"
   
    /* 创建 */
    oMenu = document.createElement('div');
    
    var oUl = null;
    var oLi = null;
    menuArr.forEach(function (menuitem) {
      oUl = document.createElement('ul');
      
      for (var item in menuitem) {

        oLi = document.createElement('li');
        setText(oLi, item);
        /* 左键单击或右键单击均触发相应事件，火狐下右键无效 */
        oLi.addEventListener('click', menuitem[item].bind(this,pp, tableElement, e), false);
        oLi.addEventListener('contextmenu', menuitem[item].bind(this,pp, tableElement, e), true);
        
        oUl.appendChild(oLi);
      }
      oMenu.appendChild(oUl);
    })

    

    oMenu.id = "ppContextMenu";
    /* 设置样式 */
    oMenu.style.cssText +=";"+oMenuCss;
    document.body.appendChild(oMenu);
    
    /* 禁止冒泡 默认 取消菜单 */
    e.stopPropagation();

    /* 触发下面事件皆移除自定义上下文菜单 */
    document.oncontextmenu = clearMenu;
    document.onclick = clearMenu;
    document.onmousewheel = clearMenu; // 兼容老版本
    document.onwheel = clearMenu; // 最新鼠标滚轮事件
    

    e.preventDefault(); // 取消默认事件
    
  }
  
  /* 清除自定义上下文菜单 */
  
}
function clearMenu (e) { // 作用域原因，此函数必须放在内部，局部函数
  oMenu && document.body.removeChild(oMenu);
  oMenu = null;
}
/* 自定义右键菜单选项行为方法 */
/* 删除行 */
function deleteRow ( pp, table, e ) {
  
  
  if ( pp.rowCount < 0 ) return;
  
  var roWIndex = e.target.parentNode.rowIndex;
  var aTh = table.querySelectorAll('tbody th'); // 先获取后删除，先后顺序不能乱
  table.deleteRow(roWIndex);
  
  for (var f = 0; f < aTh.length; f ++) {
   
    if (f >= roWIndex ) {
 
      !isNaN( aTh[f].textContent ) && setText(aTh[f], aTh[f].textContent*1 - 1);
    }
  }
  pp.rowCount --;
  e.stopPropagation();
  /* 谷歌自己蛋疼 多出个右键菜单需要取消掉 判断是为了去除火狐和IE下报错*/
 window.event && window.event.preventDefault && window.event.preventDefault();
}
/* 向上插入行 */
function insertRowAbove ( pp, table, e ) {
  var rowIndex = e.target.parentNode.rowIndex;
  
  insertRow(pp, table, rowIndex);
  window.event && window.event.preventDefault && window.event.preventDefault();
}
/* 向下插入行 */
function insertRowBelow ( pp, table, e ) {
  var rowIndex = e.target.parentNode.rowIndex + 1;
  insertRow(pp, table, rowIndex);
  
  window.event && window.event.preventDefault && window.event.preventDefault();
  //e.returnValue= false;
}
/* 插入行 */
function insertRow (pp, table, rowIndex) {
  var newTr = table.insertRow(rowIndex);
  var th = document.createElement('th');
  setText(th, rowIndex);
  var aTh = table.querySelectorAll('tbody th');
  for (var i = 0; i < aTh.length; i ++) {
    if (i >= rowIndex - 1) {
  
      !isNaN(aTh[i].textContent) && setText(aTh[i], aTh[i].textContent*1 + 1);
    }
  }
  newTr.appendChild(th);
  //var 
  var td;
  for (var i = 0; i < pp.colCount; i ++) {
    td = document.createElement('td');
    newTr.appendChild(td);
  }
  pp.rowCount ++;
}
/*删除列 */
function deleteCol ( pp, table, e ) {
  // 删除完就不能删了
  //console.log(pp.colCount);
  
  if (pp.colCount < 0 ) return;

  /* 这里必须用query选择器获取/静态  不然动态删除有问题删不干净*/  
  var aTr = table.querySelectorAll('tr');

  var cellIndex = e.target.cellIndex;

  if ( aTr[0].cells.length  === 1 ) { // 列空了删除行
    [].forEach.call(aTr, function (row) {
      row.parentNode.removeChild(row);
      pp.rowCount --;
    })
  }else {
    [].forEach.call(aTr, function (row) {
      row.removeChild( row.cells[cellIndex] );
    })
  }
  pp.colCount --; 
}
/* 前面插入列 */
function insertColLeft ( pp, table, e ) {

  var cellIndex = e.target.cellIndex;
  insertCol(pp, table, cellIndex);
  
}
/* 后面插入列 */
function insertColRight ( pp, table, e ) {

   var cellIndex = e.target.cellIndex + 1;
  insertCol(pp, table, cellIndex);

}
/* 插入列 */
function insertCol (pp, table, cellIndex) {
  var hTr = table.tHead.querySelector('tr');
  var bTr = table.childNodes[1].querySelectorAll('tr');
  var th = document.createElement('th');

  
  setText(th, pp.$options.setRowHead(cellIndex - 1));


  hTr.insertBefore(th, hTr.cells[cellIndex])
  var td;
  [].forEach.call(bTr, function (row) {
    td = document.createElement('td');

    row.insertBefore( td, row.cells[cellIndex] );
  })
  /* var aTh = table.querySelectorAll('tbody th');
  for (var i = 0; i < aTh.length; i ++) {
    if (i >= rowIndex - 1) {
  
      !isNaN(aTh[i].textContent) && setText(aTh[i], aTh[i].textContent*1 + 1);
    }
  } 

  newTr.appendChild(th);
  
  var td;
  for (var i = 0; i < pp.colCount; i ++) {
    td = document.createElement('td');
    newTr.appendChild(td);
  } */
  pp.colCount ++;
}
/* 合并单元格 */
var empytCells = {};
function mergeCells ( pp, table, e ) {
  //console.log(lightAreaArr);
  
  var hasCon = 0;
  var x = 0;
  var y = 0;
  var html;
  var rowTo = lightAreaArr.length;
  var colTo = lightAreaArr[0].length;
  /* 遍历确定所包括的单元格里多少有内容，有一个的话保留，否则只保留左上角的值 */
  lightAreaArr.forEach(function (cells, i) {
    cells.forEach(function (cell, j) {
      if (cell.innerHTML !== ""){
        hasCon ++;
        x = i;
        y = j;
      }
    })
  })
  
  if (hasCon === 1 && (x + y) !==0) { // 如果只有一个单元格有内容
    html = lightAreaArr[x][y].innerHTML;
  }else {
    html = lightAreaArr[0][0].innerHTML;
  }
  lightAreaArr.forEach(function (cells, i) {
    cells.forEach(function (cell, j) {
      if (!(i === 0 && j === 0)) {
        empytCells['R'+cell.parentNode.rowIndex +'C'+cell.cellIndex] = true;
      }
    })
  })
  lightAreaArr.forEach(function (cells, i) {
    cells.forEach(function (cell, j) {
      if ( i === 0 && j === 0) {
        cell.setAttribute("colspan", colTo);
        cell.setAttribute("rowspan", rowTo);
        cell.innerHTML = html;
      }else {
        
        removeEl(cell);
        //console.log(empytCells);
        
      }
    })
  })

 console.log(lightAreaArr);
 
 console.log(empytCells);

}
/*---------- 点击高亮 ---------------*/

var sss; //失去焦点的textarea下方的单元格
/* 点击计算状态变量 */
var compute = 0;

function highlightCell (pp, container, table) {
  /* var textarea = document.createElement("div");
  textarea.className = "textarea"; */
 var textarea = document.createElement("textarea"); 
  //textarea.contentEditable = true;
 /*  var styles = "position: absolute;left: -100px;top: -30px;height:30px";
  textarea.style.cssText = styles; */
  var borderBox;
  var borderArr = [];
  for (var i = 0; i < 5 ; i ++) {
    borderBox = document.createElement('div');
    borderBox.className = 'border';
    
    container.appendChild(borderBox);
    borderArr.push(borderBox);
  }
  container.appendChild(textarea);

  var cA = ["display:block;left:", "px;top:", "px; width:", "px;height:", "px;"];
  var bA = "border:2px solid #fff;"

  /* table.addEventListener('click', function (e) {
    moveLight(pp, table, textarea,borderArr, e)
  }, false) */
  table.addEventListener('dblclick', function (e) {
    moveTextArea(pp, table, textarea,borderArr, e)
  }, false)
  
  table.addEventListener('mousedown', function (pE) {

    //console.log(pE);
    clearMenu(); // 清除右键菜单
    if (pE.button === 2) return;
    lightAreaArr.forEach(function (cells) {
      cells.forEach(function (cell) {
        removeClass(cell, "area")
      })
    })

    var preAreaArr = []; //之前的

    
    /* 高亮边框 */
    moveLight( cA, bA, pp, table, textarea,borderArr, pE);
    
    
    /* 绑定鼠标移动事件 */
    this.addEventListener('mousemove', moveLightArea, false);
   
    /* 鼠标抬起解除move事件绑定 */
    this.addEventListener('mouseup', function () {
      this.removeEventListener('mousemove', moveLightArea, false);
      lightAreaArr = preAreaArr; // 高亮区域赋值到外部作用域
    })


    
    
    var oldTarget;
    var rowSpIndex;
    /* 高亮覆盖区域移动 */
    function moveLightArea (cE) {
      /* if ( dE.target === xE.target ) {

      } else { */
        if ( cE.target !== oldTarget) {
          oldTarget = cE.target;

        var pL =  pE.target.offsetLeft;
        var pT =  pE.target.offsetTop;
        var pW =  pE.target.offsetWidth;
        var pH =  pE.target.offsetHeight;
        var cL =  cE.target.offsetLeft;
        var cT =  cE.target.offsetTop;
        var cW =  cE.target.offsetWidth;
        var cH =  cE.target.offsetHeight;
        var tW =  table.offsetWidth;
        var tH =  table.offsetHeight;
        var eW;
        var eH;
        
        
        var pCS = pE.target.getAttribute('colspan');
        var pRS = pE.target.getAttribute('rowspan');
        var pC = pE.target.cellIndex;

        
        var pR = pE.target.parentNode.rowIndex;
        
        
        var pRM = pE.target.parentNode.rowIndex - 1;
       
       /*  var cRS = cE.target.getAttribute('rowspan');
        var cCS = cE.target.getAttribute('colspan'); */
        var cR = cE.target.parentNode.rowIndex;
        /* cRS? cE.target.parentNode.rowIndex*1 + cRS*1 - 1:  */
        /* cRS? cE.target.parentNode.rowIndex - 1 + cRS:  */
        var cRM = cE.target.parentNode.rowIndex - 1;
        //console.log(cRS + cCS);
        //console.log(cRS);
        var cC = cE.target.cellIndex;
 
        getPc(empytCells, cR, cC);
        function getPc(empytCells, r, c) {
  
          if (empytCells['R'+r+'C'+c]) {
            c = c*1 + 1;
            getPc(empytCells, r, c);
          }else {
      
            cC = c;
          }
        }
      
    
        var tr;
        var curAreaArr = []; // 当前需要高亮
        var remAreaArr = []; // 当前需要移除高亮

        var i ;
        var lengthTr;
        var jI;
        var lengthTd;
        var styles;

        if ( cL >= pL && cT >= pT) { // 左上->右下
          eW =  cW + (cL - pL);
          eH =  cH + (cT - pT);
         
          borderArr.forEach(function (div, i) {
            switch (i) {
              case 0:
                styles = mLCT( cA, pL, pT, 2, eH );
                break;
              case 1:
                styles = mLCT( cA, pL, pT, eW, 2 );
                break;
              case 2:
                styles = mLCT( cA, (pL + eW), pT, 2, eH );
                break;
              case 3:
                styles = mLCT( cA, pL, (pT + eH), eW, 2 );
                break;
              case 4:
                styles = mLCT( cA, (pL + eW - 3), (pT + eH  - 3), 5, 5, bA );
                break;
            }
            div.style.cssText = styles;
          })
          // 获取需要高亮显示区域的元素数组
          i = pRM;
          lengthTr = cR;
          
          jI = pC;
          lengthTd = cC; 
          //console.log(cC);

        }else if (cL <= pL && cT <= pT) { // 右下->左上
          eW =  cW + (pL - cL);
          eH =  cH + (pT - cT);
          //var styles;
          borderArr.forEach(function (div, i) {
            switch (i) {
              case 0:
                styles = mLCT( cA, cL, cT, 2, eH );
                break;
              case 1:
                styles = mLCT( cA, cL, cT, eW, 2 );
                break;
              case 2:
                styles = mLCT( cA, (pL + pW), cT, 2, eH );
                break;
              case 3:
                styles = mLCT( cA, cL, (pT + pH), eW, 2 );
                break;
              case 4:
                styles = mLCT( cA, (pL + pW - 3), (pT + pH  - 3), 5, 5, bA );
                break;
            }
            div.style.cssText = styles;
          })
          // 计算
          i = cRM;
          lengthTr = pR;
          jI = cC;
          lengthTd = pC;
          
        }else if (cL >= pL && cT <= pT) {

          eW =  pW + (cL - pL);
          eH =  pH + (pT - cT);
          //var styles;
          borderArr.forEach(function (div, i) {
            switch (i) {
              case 0:
                styles = mLCT( cA, pL, cT, 2, eH );
                break;
              case 1:
                styles = mLCT( cA, pL, cT, eW, 2 );
                break;
              case 2:
                styles = mLCT( cA, (cL + cW), cT, 2, eH );
                break;
              case 3:
                styles = mLCT( cA, pL, (pT + pH), eW, 2 );
                break;
              case 4:
                styles = mLCT( cA, (cL + cW - 3), (pT + pH  - 3), 5, 5, bA );
                break;
            }
            div.style.cssText = styles;
          })
          // 计算
          i = cRM;
          lengthTr = pR;
          jI = pC;
          lengthTd = cC;

        }else if (cL <= pL && cT >= pT) {
          eW =  pW + (pL - cL);
          eH =  cH + (cT - pT);
          //var styles;
          borderArr.forEach(function (div, i) {
            switch (i) {
              case 0:
                styles = mLCT( cA, cL, pT, 2, eH );
                break;
              case 1:
                styles = mLCT( cA, cL, pT, eW, 2 );
                break;
              case 2:
                styles = mLCT( cA, (pL + pW), pT, 2, eH );
                break;
              case 3:
                styles = mLCT( cA, cL, (cT + cH), eW, 2 );
                break;
              case 4:
                styles = mLCT( cA, (pL + pW - 3), (cT + cH  - 3), 5, 5, bA );
                break;
            }
            div.style.cssText = styles;
          })
          // 计算
          i = pRM;
          lengthTr = cR;
          jI = cC;
          lengthTd = pC;
        }
        var k = 0;
        var t = 0;
        // 获取需要高亮显示区域的元素数组
        //console.log(lengthTr);
        var ttt;
        var ppp = lengthTd;
        var sss = lengthTr;
        var aTr = table.children[1].querySelectorAll('tr');
        var hasRowSp = false; //是否存在rowspan的单元格
        var hasEmpty = false; //是否存在之前被合并掉的单元格
        var bool = true; // 
        var hasColspan = 0;
        
        for ( ; i < sss; i ++) {
          var dsadsa = false;
          hasEmpty = false;
          //hasRowSp = false;
          tr = aTr[i];
          //console.log(curAreaArr);
          //lengthTd = lengthTd - k;
          curAreaArr.push([]);
          ttt = ppp;
          //var tds = tr.querySelectorAll(td)
          for (var j = jI; j <= ttt ; j ++) {
            console.log(ttt);
            
            //console.log(curAreaArr);
 
            //console.log(j + 'nihaoa');
            var rowspan = tr.cells[j] && getSpan(tr.cells[j], 'row');
            //console.log(j + 'nihao');

            //console.log(tr.cells[j]);
            
            var colspan = tr.cells[j] && getSpan(tr.cells[j], 'col');
            var boolp = true;
            if ( (rowspan || colspan) && boolp) {
              //console.log(colspan);
              //console.log(tr.cells[j].cellIndex + colspan - 1 >  lengthTd);
              
              //j --;
              if ( rowspan && tr.rowIndex + rowspan - 1 >  lengthTr) {
                sss = tr.rowIndex + rowspan - 1;
                boolp = false;
              }
              //console.log(colspan +'你好');
              
              //console.log(tr.cells[j].cellIndex + colspan);
              //console.log(lengthTd);
              hasColspan = colspan;
              if (colspan && tr.cells[j].cellIndex + colspan - 1>  lengthTd ) {
                    
                  ppp = tr.cells[j].cellIndex + colspan - 1;
                  //ttt ++;
                  boolp = false;
                  //dsadsa = true;
                  //console.log(dsadsa);
 
                  //console.log(hasColspan);
                  
              }

            }else {
              //sss --;
            }
            
            //console.log(boolp);
            if (tr.cells[j]) {
              if (empytCells['R'+tr.rowIndex+'C'+tr.cells[j].cellIndex]) {
              
              
                //ttt = ppp - hasColspan; // 少一个     
               //console.log(boolp);
               //j ++;
                ttt --; // 多一个
                            
                //hasEmpty = true; 
              }else {
                
              }
              if ( j <= ttt ) {
                curAreaArr[k].push(tr.cells[j]);
              }
  
            }      
           
          }

          k ++;
        }
        
        
        //console.log(curAreaArr);
        
        
        /* 取出两次差异数组，清除高亮显示 */
        remAreaArr = diffTwoArrs(curAreaArr, preAreaArr);
        //console.log(remAreaArr);
        remAreaArr.forEach(function (cells) {
          cells.forEach(function (cell) {
            removeClass( cell, "area");
          })
           
        })
        /* 新出炉的数组，高亮显示 */
        curAreaArr.forEach(function (cells) {
          cells.forEach(function (cell) {
            cell !== pE.target && addClass( cell, "area"); // 初始点击的单元格不高亮
          })
        })
        preAreaArr = curAreaArr; // 上次选中区域元素数组赋值
  
        }
    }
  }, false)
  
  textarea.oninput = function (e) {
    this.style.width = this.scrollWidth+ "px";
    this.style.height = this.scrollHeight+ "px";
    //console.log(textarea.scrollWidth);
    
  }
}
var cmpChain = {}; // 计算绑定链

var ggg;
var  dasdas = '=';
/* 输入= 号  关联计算  无限制*/
function infinCmp (pp,table,borderBox,textarea, e) {
  //console.log(compute,555);
  
  if ( textarea.value === '=' || compute !== 0) {
    compute = 1;
    
    //console.log(dasdas);
    e.target.style.backgroundColor = "skyblue";
    
    
    if ( /[+|-|*|/|\(|\)|（|）]$/.test(textarea.value) ) {
      //console.log('dasdasd');
      dasdas = textarea.value;
      //compute = 1;
      //console.log(cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex][0]);
       
      //cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex][cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex].length - 2].style.backgroundColor = "skyblue";
      pp.$options.setRowHead[e.target.cellIndex]  
      
      //textarea.value += pp.$options.setRowHead( e.target.cellIndex -1 ) + pp.$options.setColHead(  e.target.parentNode.rowIndex - 1, "大师傅大");
  
   
      
  
      /* textarea获取焦点 ， 待定，看能不能不用定时器实现 */ 
      
    } else {
      //console.log("dsafasssss");
      
      //console.log(ggg);
      //if (compute === 2) {
        ggg && (cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex].pop().style.backgroundColor = "#fff") ;
      //}
      
      
    }

    if (textarea.value === '='){
      setTimeout(function () {
        
        
        ggg = sss;
        cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex] = [e.target];
        //console.log(cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex]);
      }, 0)
     
    } else {
      cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex].push(e.target);
    }
    textarea.value = dasdas + pp.$options.setRowHead( e.target.cellIndex -1 ) + pp.$options.setColHead(  e.target.parentNode.rowIndex - 1, "大师傅大");

    var express = textarea.value;
      
      
    document.onkeypress = function(en) {
      if (en.keyCode === 13) {
        //console.log(ggg +'s');
  
        cmpArr['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex] = express;
        cmpChain['R'+ggg.parentNode.rowIndex+'C'+ggg.cellIndex].forEach(function ( cell ) {
          express = express.split(pp.$options.setRowHead( cell.cellIndex -1 ) + pp.$options.setColHead(  cell.parentNode.rowIndex - 1, "大师傅大")).join(cell.textContent);
          cell.style.backgroundColor = "#fff";
        });
      
        //console.log(express);
        
        
        inlineCmp( textarea, e,  express);
        compute = 0; // 重置状态
        dasdas = '='; // 重置状态
        ggg = null; // 重置状态

        borderBox.forEach(function ( border ) {
          border.style.display = "none";
        });
        textarea.style.display = "none";
      }
    }
    setTimeout(function () {
      textarea.focus();
    }, 0)
    

  }else {
    textarea.style.display = "none";

    var bool = true; // 只执行一次
    document.onkeypress = function (ev) { // 特殊键不触发 /keycode判断回车键不触发
      if (bool ) {
        if (ev.keyCode === 13) {
          //moveLight(cA, bA, pp, table, textarea, borderBox, e)
        } else {
          moveTextArea(pp, table, textarea,borderBox, e, "write");
        }
        bool = !bool;
      }
    }
    //inlineCmp(textarea, sour)
  }
}



function moveLight(cA, bA, pp, table, textarea, borderBox, e) {

  var styles;
  var eL =  e.target.offsetLeft;
  var eT =  e.target.offsetTop;
  var eW =  e.target.offsetWidth;
  var eH =  e.target.offsetHeight;
  var tW =  table.offsetWidth;
  var tH =  table.offsetHeight;
  if (e.target.nodeName === "TD") {
    //console.log(444);
    /* 组合border样式 */
    borderBox.forEach(function (div, i) {
      switch (i) {
        case 0:
          styles = mLCT( cA, eL, eT, 2, eH );
          break;
        case 1:
          styles = mLCT( cA, eL, eT, eW, 2 );
          break;
        case 2:
          styles = mLCT( cA, (eL + eW), eT, 2, eH );
          break;
        case 3:
          styles = mLCT( cA, eL, (eT + eH), eW, 2 );
          break;
        case 4:
          styles = mLCT( cA, (eL + eW - 3), (eT + eH  - 3), 5, 5, bA );
          break;
      }
      div.style.cssText = styles;
    })
  } else if (e.target.nodeName === "TH" && e.target.parentNode.parentNode.nodeName === "TBODY"){
    //console.log(555);
    borderBox.forEach(function (div, i) {
      switch (i) {
        case 0:
          styles = mLCT( cA, eL, eT, 2, eH );
          break;
        case 1:
          styles = mLCT( cA, eL, eT, tW, 2 );
          break;
        case 2:
          styles = mLCT( cA, (eL + tW), eT, 2, eH );
          break;
        case 3:
          styles = mLCT( cA, eL, (eT + eH), tW, 2 );
          break;
        case 4:
          styles = mLCT( cA, (eL + tW - 3), (eT + eH - 3), 5, 5, bA );
          break;
      }

      div.style.cssText = styles;
    })
  } else if (e.target.nodeName === "TH" && e.target.parentNode.parentNode.nodeName === "THEAD"){
    //console.log(666);
    borderBox.forEach(function (div, i) {
      switch (i) {
        case 0:
          styles = mLCT( cA, eL, eT, 2, tH );
          break;
        case 1:
          styles = mLCT( cA, eL, eT, eW, 2 );
          break;
        case 2:
          styles = mLCT( cA, (eL + eW), eT, 2, tH );
          break;
        case 3:
          styles = mLCT( cA, eL, (eT + tH), eW, 2 );
          break;
        case 4:
          styles = mLCT( cA, (eL + eW - 3), (eT + tH - 3), 5, 5, bA );
          break;
      }
      div.style.cssText = styles;
    })
  } else {
    //console.log(333);
    
    return;
  }

  infinCmp(pp, table,borderBox,textarea, e); //计算
  //console.log(textarea.value);
  
}
/* 拼接光标位置cssText */
function mLCT ( C, L, T, W, H, B ) {
  var B = B || '';
  return C[0] + L + C[1] + T + C[2] + W + C[3] + H + C[4] + B;
}
var cmpArr = {}; //参与过计算的单元格的计算过程
function inlineCmp (textarea, e, value) {
  //compute = 0;
  var val = value || textarea.value;
      val = val.split(/[（|(]/g).join("(");
      val = val.split(/[）|)]/g).join(")");
//console.log(val + 333);

      if ( /^=.+/.test(val)) { // 首个字符且后面至少跟一个字符是等号，计算

        if (/[(|)|+|-|*|/|0-9|%|‰]$/g.test(val)) { // 只能是数字加运算符
          if (/[0-9|\)]+[%|‰]$/g.test(val)) { // 处理百分号 千分号
            var newVal = val;
            var reso = /([0-9]+)(%)/g.exec(val);
            var reso1 = /\(([^\(]+)\)(%)/g.exec(val);
            var resoo = /\(([^\(]+)\)(‰)/g.exec(val);
            var resoo1 = /([0-9]+)(‰)/g.exec(val);

            reso ? newVal = newVal.split(reso[0]).join(reso[1]*0.01):null;
            resoo1 ? newVal = newVal.split(resoo1[0]).join(resoo1[1]*0.001):null;
            try {  // eval() 遇到错误的表达式会报错
              reso1 ? newVal = newVal.split(reso1[0]).join(eval(reso1[1])*0.01):null;
              resoo ? newVal = newVal.split(resoo[0]).join(eval(resoo[1])*0.001):null;
              
              textarea.value = eval(/^=(.+)/.exec(newVal)[1]);
              cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] = cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] || val;
            }
            catch (err) {
              textarea.value = "#VALUE!";
              alert('此表达式过于复杂或有错误,无法计算')
            }
          } else {
            try {
              textarea.value = eval(/^=(.+)/.exec(val)[1]);
              cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] = cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] || val;
            }catch(err) {
              textarea.value = "#VALUE!";
              alert('此表达式过于复杂或有错误,无法计算')
            }
            
          }
        } else {
          cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] = cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] || val;
          textarea.value = "#NAME?";
        }
      }
}
function moveTextArea(pp, table, textarea,borderBox, e, down) {

  /* 绑定键盘事件 */
  document.onkeypress = function (et) {
    /* console.log();
    console.log(); */
    if (et.keyCode === 13) {
      var express = textarea.value;
      if ( cmpChain['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] ) {
        cmpChain['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex].forEach(function ( cell ) {
          express = express.split(pp.$options.setRowHead( cell.cellIndex -1 ) + pp.$options.setColHead(  cell.parentNode.rowIndex - 1, "大师傅大")).join(cell.textContent)
        });
        inlineCmp(textarea, e, express )
      } else {
        inlineCmp(textarea, e)
      }

      
    }
  };

//console.log(e.target.nodeName);

  /* 如果td下面有自定义元素 或点击的不是td，不执行 */
  if (e.target.nodeName !== "TD" || e.target.children.length !== 0) return;

  /* 单击组合border隐藏 */
  borderBox.forEach(function (box) {
    box.style.display = "none";
  })
  /* 更改textarea 状态 */
  textarea.style.display = "block";
  var react = e.target;
  /* textarea.style.width = react.scrollWidth+ "px";
  textarea.style.height = react.scrollHeight+ "px"; */
 // console.log(down === "write");
  
  /* var nv = cmpArr['R'+e.target.parentNode.rowIndex]? 
    cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex]?
    cmpArr[e.target.parentNode.rowIndex][e.target.cellIndex]:
    null:
    null;
    console.log(nv); */
    //console.log(cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex]);
    
  textarea.value =  cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex]?
  cmpArr['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex]:
    down === "write"?'':
      e.target.textContent ?
      e.target.textContent:
      '';


  textarea.style.left = react.offsetLeft  +"px";
  textarea.style.top = react.offsetTop +"px";
  textarea.style.width = react.scrollWidth+"px";
  textarea.style.height = react.scrollHeight+ "px";
  
  textarea.focus();
  /* 失去焦点赋值 */
  textarea.onblur = function () {
    var express = this.value;
    /* 首个字符是等号，计算 */
    /* if ( /^=/.test(val) ) { 
      compute = true;
    } else { */
      //console.log(this.value);
      //console.log(this.value !== '=');
      //cmp(textarea, e); //计算
      //var express = textarea.value;
      if ( cmpChain['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex] ) {
        //console.log(cmpChain['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex]);
        
        cmpChain['R'+e.target.parentNode.rowIndex+'C'+e.target.cellIndex].forEach(function ( cell ) {
          //console.log(pp.$options.setRowHead( cell.cellIndex -1 ) + pp.$options.setColHead(  cell.parentNode.rowIndex - 1, "大师傅大"));
          
          express = express.split(pp.$options.setRowHead( cell.cellIndex -1 ) + pp.$options.setColHead(  cell.parentNode.rowIndex - 1, "大师傅大")).join(cell.textContent)
        });
      }
      //console.log(express);
      
      compute === 0 && inlineCmp(textarea, e, express );
      
      //!compute && inlineCmp(textarea, e);
      setText(e.target, this.value);
      //console.log(e.target);
      
      sss = e.target;
    /* } */
    
  }
}
function cmp (textarea, e) {

}
/*----------------- 点击高亮 ------------------*/



function createThead(pp, table, style) { // 创建表头
  var theadElement = document.createElement('thead');
  var tr = document.createElement('tr');
  var th = document.createElement('th'); // 序号 标题
  //th.style.height = "30px";
  // th.style.width = "150px";
  //th.scope="col";
  th.textContent = style;
  tr.appendChild(th);
  theadElement.appendChild(tr);

  for (var i = 0; i < pp.$options.showCol; i++) {


    var th = document.createElement('th');
    // 存在参数用参数 存在默认用默认 都不存在就++
    
    th.textContent = pp.$options.setRowHead(pp.colCount);
     /*  pp.$options.rowHeaders[pp.colCount] ?
      pp.$options.rowHeaders[pp.colCount] :
      rowHeaders[pp.colCount] ?
      rowHeaders[pp.colCount] :
      rowHeaders[parseInt(pp.colCount/26)-1] + rowHeaders[pp.colCount%26]; */
    tr.appendChild(th);
    theadElement.appendChild(tr);

    pp.colCount ++;

  }

  table.appendChild(theadElement);
}


var isEven = 0; // 判断颜色交替状态

function createTr(pp, table, style) { // 创建行
  var tbodyElement = document.createElement('tbody');

  pp.$options.data.forEach(function (rowsD, index) { // 遍历data数组 创建tr
    if (!pp.$options.showRow || pp.rowCount < pp.$options.showRow) {
      var aTr = document.createElement('tr');
      var color = createAlternateColor(pp.$options); // 先保存一下，一个大类用一个颜色
      createTh(pp, style, aTr, color);

      if (!pp.$options.showRow || pp.rowCount < pp.$options.showRow + 1) {
        rowsD.forEach(function (rowOrColumn, i) {
          // chain.push([]);
          createTd(pp, tbodyElement, aTr, rowOrColumn, i, style, color, pp.$options.showCol, rowsD.length);

        })
      }
    }
  });
  if (pp.rowCount < pp.$options.showRow + 1) { // 补充tr

    var length = pp.$options.showRow - pp.rowCount;
    for (var l = 0; l < length; l++) {
      var aTr = document.createElement('tr');
      createTh(pp, style, aTr, createAlternateColor(pp.$options));

      for (var m = 0; m < pp.$options.showCol; m++) {
        var td = document.createElement('td');
        aTr.appendChild(td);
      }

      tbodyElement.appendChild(aTr);
    }
  }

  table.appendChild(tbodyElement);
}
function createTh(pp, style, tr, color) { // 创建th

    var th = document.createElement('th'); // 左侧序号位置th
    th.style.height = "30";
    //th.style.width = "150px";
    th.style.backgroundColor = color;
    /* th.scope = "row"; */
    // 颜色交替状态改变

    th.textContent = pp.$options.setColHead( pp.rowCount, style );
    /* pp.$options.colHeaders[style] === "n" ?
        pp.rowCount + 1 :
        pp.$options.colHeaders[style][pp.rowCount] ?
            pp.$options.colHeaders[style][pp.rowCount] :
            pp.rowCount + 1; */

    tr.appendChild(th);
    pp.rowCount++; //行数加 1
}
function createAlternateColor(options) { // 交替颜色
  var color;

  if (options.colHeadersColorAlternate) {
    color = options.colHeadersColorAlternate[isEven];
    isEven = (isEven + 1) % options.colHeadersColorAlternate.length;
  } else {
    color = "#f3f3f3";
  }
  return color;
}


/* 递归数组创建td放入tr */
function createTd(
  pp,
  tbody,
  tr,
  rowOrColumn,
  i,
  style,
  color,
  length,
  lengths
) {

  if (Array.isArray(rowOrColumn) === false) { // 如果不再是数组，递归结束

    if(length < lengths) {
      if (i < length) { // 当前td数 与传进来的td 对比 不能超出
        appendDToRToB('td', tr, tbody, rowOrColumn);
      }
    }else {
        appendDToRToB('td', tr, tbody, rowOrColumn);

      if(i === lengths - 1) {

        for(var k = 0; k < length - i - 1; k++) {
          appendDToRToB('td', tr, tbody);
        }
      }
    }

    return
  } else {
    /* chain[i].push(''); */
    if (i === 0) {

      /* var td = document.createElement('td'); // 添加左侧序号
      
      td.textContent = colHeaders[i] + '-' + j || i + '-' + j;
          
      tr.appendChild(td); */

    } else { // 如果数组长度不为0，需要创建更多的tr
      if (!pp.$options.showRow || pp.rowCount < pp.$options.showRow + 1) {
        //chain.push()
        tr = document.createElement('tr');
        var th = document.createElement('th'); // 左侧序号位置th
        th.style.height = "30px";
        //th.style.width = "150px";
        th.style.backgroundColor = color; // 背景
        th.textContent = pp.$options.setColHead( pp.rowCount, style )
        /* colHeaders[pp.rowCount]? // 文字
          colHeaders[pp.rowCount]:
          pp.rowCount + 1;
 */
        tr.appendChild(th);

        pp.rowCount++;
      }
    }
    if (!pp.$options.showRow || pp.rowCount < pp.$options.showRow + 1) {
      rowOrColumn.forEach(function (columnD, i) {
        createTd(pp, tbody, tr, columnD, i, style, color, length, rowOrColumn.length)
      })
    }
  }
}
/*创建D元素，设置文本text,并append至对象R，R再appendTo B*/
function appendDToRToB(D, R, B, text) {
    var oE = document.createElement(D);
    text && setText(oE, text);
    R.appendChild(oE);
    B.appendChild(R);
}
/* ----------------------构造函数原型初始化方法用到的方法 -----------------------*/




/* ----------------------更新数据原型方法 -----------------------*/
PpTable.prototype.$updateData = function () {
  var pp = this;
  var oTbody = document.querySelector(pp.$options.el).getElementsByTagName('tbody')[0];
  
  return {
    all: function ( data ) {
      updateTable(data, oTbody);
    },
    rows: function ( data ) { // 根据行更新数据and状态
      changeCell(data, oTbody, ['tr:nth-of-type(', "R", ') td']);
      //console.log(oTbody.cells);
      
    },
    cols: function ( data ) { // 根据列更新数据
      changeCell(data, oTbody, ['tr td:nth-of-type(', "C", ')']);
    },
    cells: function ( data ) { // 根据单元格更新数据

        for (var cell in data) {
            var station = /^R(\d)_C(\d)$/.exec(cell);
            var oCell = oTbody.querySelector('tr:nth-child('+ station[1] +') td:nth-child('+ station[2] +')');
            data[cell].data && setText(oCell, data[cell].data); // 赋值
            data[cell].style && setCellCss(oCell, data[cell].style); //设置样式
            data[cell].html && setHtml(oCell, data[cell].html); // 设置html
            data[cell].class && addClass(oCell, data[cell].class); // 设置className
        }
    },
  }
}
/* ----------------------更新数据原型方法 -----------------------*/




/* ----------------------更新数据原型方法用到的方法 -----------------------*/

function updateTable (data, oTbody) { // 更新数据 /接受多维数组混搭
  var k = -1;
  var bool = true;  // 控制k一行只+一次
  data.forEach(function (rowD, i ) {
    if ( Array.isArray( rowD ) ) {
      updateTable(rowD, oTbody);
    }else {
      bool && k ++;
      bool = false;
      isDef(rowD) && oTbody.rows[k] && oTbody.rows[k].cells[i+1] && setText(oTbody.rows[k].cells[i+1], rowD);
    }
  })
}
/*更新单元格数据和状态/整行/整列*/
function changeCell(data, oTbody, selector) {

  for (var rcd in data) {

    var aTd = oTbody.querySelectorAll(selector[0]+ rcd.split(selector[1])[1] +selector[2]); // 拼接选择器
    /* [].forEach.call(类数组)   兼容IE 现代浏览器原生支持类数组forEach方法 */
    data[rcd].data && [].forEach.call(aTd, function (cell, i) {
      isDef(data[rcd].data[i]) && setText(cell, data[rcd].data[i]); // 赋值
    })
    data[rcd].style && [].forEach.call(aTd, function (cell, i) {
      setCellCss(cell, data[rcd].style); //设置样式
    })
    data[rcd].html && [].forEach.call(aTd, function (cell, i) {
      setHtml(cell, data[rcd].html); // 设置html
    })
    if (Array.isArray(data[rcd].class)) { // 设置className
      [].forEach.call(aTd, function (cell, i) {
        isDef(data[rcd].class[i]) && addClass(cell, data[rcd].class[i]); // 赋值
      })
    }else if (typeof data[rcd].class === "string"){
      [].forEach.call(aTd, function (cell, i) {
        addClass(cell, data[rcd].class); // 赋值
      })
    }
  }
}
/*设置单元格样式*/
function setCellCss(cellE, styles) {
  for ( var css in styles ){
    setLineCss(cellE, css, styles[css]);
  }
};
/* ----------------------更新数据原型方法用到的方法 -----------------------*/




/* ----------------------更新数据原型方法 -----------------------*/




/* ----------------------返回全局构造函数 -----------------------*/
return PpTable;
/* ----------------------返回全局构造函数 -----------------------*/




}));