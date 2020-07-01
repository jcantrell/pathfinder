class Grid {
  constructor(width=10,height=10,xin=0,yin=0) {
    this.states = {
      blank: 0,
      start: 1,
      end: 2,
      blocked: 3
    }
    this.board = [];
    for (var y=0;y<height;y++) {
      this.board[y] = [];
      for (var x=0;x<width;x++)
        this.board[y][x] = this.states.blank;
    }
    this.start = null;
    this.end = null;
    this.focus = { x: 0, y: 0, r: 0, c: 0 };
    this.mouseState = 0;

    this.bw = 50;
    this.bh = 50;
    this.debug = true;
    this.tl = {x:xin,y:yin};
    this.db(this.asString());
  }
  asString() {
    var s="";
    for (var r=0;r<9;r++) { 
      for (var c=0;c<9;c++) {
        s+=this.board[r][c]+" ";
      }
      s+="\n";
    }
    s+="\n";
    return s;
  }
  copy() {
    var ret = new Grid();
    for (var r=0;r<this.board[0].length;r++) for (var c=0; c<this.board.length; c++) {
      ret.board[r][c] = this.board[r][c];
    }
    ret.focus.x = this.focus.x; ret.focus.y = this.focus.y; ret.focus.r = this.focus.r; ret.focus.c = this.focus.c;
    ret.tl.x = this.tl.x; ret.tl.y = this.tl.y;
    ret.bw = this.bw;
    ret.bh = this.bh;
    return ret;
  }
  copyFrom(i) {
    for (var r=0;r<9;r++) for (var c=0; c<9; c++) 
      this.board[r][c] = i.board[r][c];
  }
  copyBoard(bin) {
    var b = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];
    for (var r=0;r<9;r++) for (var c=0; c<9; c++) b[r][c] = bin[r][c];
    return b;
  }
  draw (ctx) {
    ctx.canvas.width = this.bw * this.board[0].length;
    ctx.canvas.height = this.bh * this.board.length;
    this.tl.x = ctx.canvas.getBoundingClientRect().left;
    this.tl.y = ctx.canvas.getBoundingClientRect().top;

    // Background
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    
/*
    // Highlight focused row and column
    for (var i=0;i<9;i++) {
      ctx.fillStyle = "#bbbbbb";
      ctx.fillRect(i*this.bw,this.focus.r*this.bh,this.bw,this.bh);
      ctx.fillRect(this.focus.c*this.bw,i*this.bh,this.bw,this.bh);
    }

    // Highlight focused square
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(this.focus.c*this.bw,this.focus.r*this.bh,this.bw,this.bh);
*/

    // Outline individual squares
    for (var r=0;r<this.board[0].length;r++) {
      for (var c=0;c<this.board.length;c++) {
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(c*this.bw, r*this.bh, this.bw, this.bh);
      }
    }

/*
    // Draw 3x3 outlined squares
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (var r=0;r<3;r++) {
      for (var c=0;c<3;c++) {
        ctx.strokeRect(c*this.bw*3, r*this.bh*3, this.bw*3, this.bh*3);
      }
    }
*/

    // Print cells
    for (var r=0;r<this.board[0].length;r++) {
      for (var c=0;c<this.board.length;c++) {
        ctx.fillStyle = 'black';
        ctx.font = '16px serif';
        if (this.board[r][c] != 0)
          ctx.fillText(this.board[r][c],(c+1)*this.bw-30,(r+1)*this.bh-20);
      }
    }
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(this.focus.c*this.bw, this.focus.r*this.bh, this.bw, this.bh);
  }
  click(ctx,e) {
    this.db("Click: "+e.x+" "+e.y);
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    this.focus.x = e.x - this.tl.x; 
    this.focus.y = e.y - this.tl.y;
    this.focus.r = Math.floor(this.focus.y / this.bh);
    this.focus.c = Math.floor(this.focus.x / this.bw);
    //this.board[this.focus.r][this.focus.c] = this.states
    this.mouseState = 1;
    this.db("Focus: "+this.focus.x+" "+this.focus.y+" "+this.focus.r+" "+this.focus.c);
    this.draw(ctx);
  }
  stroke(ctx,e) {
    this.db("stroke: "+e.x+" "+e.y);
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    var x = e.x - this.tl.x; 
    var y = e.y - this.tl.y;
    var r = Math.floor(y / this.bh);
    var c = Math.floor(x / this.bw);
    if (this.mouseState == 1)
      this.board[r][c] = this.states.blocked;
    this.draw(ctx);
  }
  setStart(r,c) {
    if (this.start != null) this.board[this.start.r][this.start.c] = this.states.blank;
    this.board[this.focus.r][this.focus.c] = this.states.start;
    this.start = {r:this.focus.r, c:this.focus.c};
  }
  setEnd(r,c) {
    if (this.end != null) this.board[this.end.r][this.end.c] = this.states.blank;
    this.board[this.focus.r][this.focus.c] = this.states.end;
    this.end = {r:this.focus.r, c:this.focus.c};
  }
  setObstacle(r,c) {
    this.board[this.focus.r][this.focus.c] = this.states.blocked;
    this.end = {r:this.focus.r, c:this.focus.c};
  }
  db(text) {
    if (this.debug) console.log(text);
  }
  keypress(ctx,e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
      this.board[this.focus.r][this.focus.c] = e.keyCode - 48;
      this.draw(ctx);
      this.isValid(this.board);
    // Typed an 's'
    } else if (e.key == 's') {
      this.setStart(this.focus.r,this.focus.c);
      this.db(this.asString()+"\n");
      this.draw(ctx);
    } else if (e.key == 'e') {
      this.setEnd(this.focus.r,this.focus.c);
      this.db(this.asString()+"\n");
      this.draw(ctx);
    }
  }
}

var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext('2d');
let grid = new Grid(10,10,ctx.canvas.getBoundingClientRect().left,ctx.canvas.getBoundingClientRect().top);

var canvas = document.getElementById("mainCanvas");
grid.draw(ctx);

function mouseDownHandler(e) {
  var x = e.x - grid.tl.x;
  var y = e.y - grid.tl.y;
  if ((x <= canvas.width) && (y <= canvas.height) && x >= 0 && y >= 0)
    grid.click(ctx,e);
}
function keyDownHandler(e) {
  grid.keypress(ctx,e);
}
function mouseMoveHandler(e) {
  grid.stroke(ctx,e);
}

function mouseUpHandler(e) {
  grid.mouseState = 0;
}

document.addEventListener("mousedown", mouseDownHandler);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("mouseup", mouseUpHandler);
