//
// Drag
//

function likeIE() {return navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0;}
function likeNS() {return navigator.userAgent.indexOf("Netscape6/") >= 0 || navigator.userAgent.indexOf("Gecko") >= 0;}
 
var dragObj = new Object();
dragObj.zIndex = 0;
 
function dragStart(event, id) 
{
    var el;
    var x, y;
 
    dragObj.elNode = document.getElementById(id);
 
    if (likeIE()) 
    {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    else if (likeNS()) 
    {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }
 
    dragObj.cursorStartX = x;
    dragObj.cursorStartY = y;
    dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
    dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

    if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
    if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

    dragObj.elNode.style.zIndex = ++dragObj.zIndex;
 
    document.addEventListener("mousemove", dragGo,   true);
    document.addEventListener("mouseup",   dragStop, true);
    event.preventDefault();
}
 
function dragGo(event) 
{
    var x, y;

    if (likeIE()) 
    {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    else if (likeNS()) 
    {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }

    dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
    dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";

    event.preventDefault();
}
 
function dragStop(event) 
{
    // Stop capturing mousemove and mouseup events.
    document.removeEventListener("mousemove", dragGo,   true);
    document.removeEventListener("mouseup",   dragStop, true);
}

var moveObj = new Object();
var timeToMove = 750.0;
 
function move(eid, x, y) 
{
    var el;

    var elNode = document.getElementById(eid);
    moveObj.elNode = elNode;
    moveObj.elStartLeft  = parseInt(elNode.style.left, 10);
    moveObj.elStartTop   = parseInt(elNode.style.top,  10);
    moveObj.elStopLeft  = x;
    moveObj.elStopTop   = y;
    elNode.MoveState   = 1;
    elNode.MoveTimeLeft = timeToMove;

    setTimeout("animateMove(" + new Date().getTime() + ",'" + eid + "')", 33);
}

function easeInOut(minValue,maxValue,totalSteps,actualStep,powr) 
{ 
    var delta = maxValue - minValue; 
    var stepp = minValue+(Math.pow(((1 / totalSteps) * actualStep), powr) * delta); 
    return Math.ceil(stepp) 
} 
 
function animateMove(lastTick, eid)
{  
    var curTick = new Date().getTime();
    var elapsedTicks = curTick - lastTick;
  
    var element = document.getElementById(eid);
 
    if (element.MoveTimeLeft <= elapsedTicks)
    {
        element.style.left = moveObj.elStopLeft + "px";
        element.style.top  = moveObj.elStopTop + "px";
        element.MoveState = 0;
        return;
    }
    else
    {
        element.MoveTimeLeft -= elapsedTicks;
        pow = 0.5;
        element.style.left = easeInOut(moveObj.elStartLeft, moveObj.elStopLeft, timeToMove, timeToMove - element.MoveTimeLeft, pow) + "px";
        element.style.top = easeInOut(moveObj.elStartTop, moveObj.elStopTop, timeToMove, timeToMove - element.MoveTimeLeft, pow) + "px";

        setTimeout("animateMove(" + curTick + ",'" + eid + "')", 33);
    }
}

//
// Auto shift on scroll
//

var lastScrollTop = 0;
var lastScrollChange = 0;
var movePending = false;
var lastStableScroll = 0;
var timeAfterScrollToMove = 1000;

function enableAutoMoveOnScroll(eid)
{
    if (document.body.scrollTop != lastScrollTop)
    {
        lastScrollTop = document.body.scrollTop;
        movePending = true;
        lastScrollChange = new Date().getTime();
    }
    else
    {
        if (movePending)
        {
            var curTick = new Date().getTime();
            var elapsedTicks = curTick - lastScrollChange;
            if (elapsedTicks > timeAfterScrollToMove)
            {
                var shift = parseInt(lastScrollTop) - parseInt(lastStableScroll);
                lastStableScroll = lastScrollTop;
                var element = document.getElementById(eid);
                //alert("move " + eid + "," +  parseInt(element.style.left) + "," + (parseInt(element.style.top) + shift));
                move(eid, parseInt(element.style.left), parseInt(element.style.top) + shift);
                movePending = false;
            }
        }
    }
    setTimeout("enableAutoMoveOnScroll('" + eid + "')", 33);
}

 
