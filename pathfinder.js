class Grid {
  constructor(width=10,height=10,xin=0,yin=0) {
    this.space = new twoDSpace();
    this.agent = new aStarAgent2D(this);
    this.states = {
      blank: 0,
      start: 1,
      end: 2,
      blocked: 3,
      path: 4,
      count: 5
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
  }
  asString() {
    return toString();
  }
  draw (ctx) {
    ctx.canvas.width = this.bw * this.board[0].length;
    ctx.canvas.height = this.bh * this.board.length;
    this.tl.x = ctx.canvas.getBoundingClientRect().left;
    this.tl.y = ctx.canvas.getBoundingClientRect().top;

    //var colors = ['#D3D3D3', '#606060', '#808080', '#a0a0a0', '#e0e0e0'];
    var colors = ['#D3D3D3', '#606060', '#909090', '#707070', '#b0b0b0'];

    // Print cells
    for (var r=0;r<this.board[0].length;r++) {
      for (var c=0;c<this.board.length;c++) {
        ctx.fillStyle = colors[this.board[r][c]];
        ctx.fillRect(c*this.bw, r*this.bh, this.bw, this.bh);
      }
    }

    // Outline individual squares
    for (var r=0;r<this.board[0].length;r++) {
      for (var c=0;c<this.board.length;c++) {
        ctx.strokeStyle = '#c0c0c0';
        ctx.strokeRect(c*this.bw, r*this.bh, this.bw, this.bh);
      }
    }

    ctx.strokeStyle = '#101010';
    ctx.strokeRect(this.focus.c*this.bw, this.focus.r*this.bh, this.bw, this.bh);
  }
  click(ctx,e) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    this.focus.x = e.x - this.tl.x; 
    this.focus.y = e.y - this.tl.y;
    this.focus.r = Math.floor(this.focus.y / this.bh);
    this.focus.c = Math.floor(this.focus.x / this.bw);
    this.mouseState = 1;
    this.draw(ctx);
  }
  stroke(ctx,e) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    this.focus.x = e.x - this.tl.x; 
    this.focus.y = e.y - this.tl.y;
    this.focus.r = Math.floor(this.focus.y / this.bh);
    this.focus.c = Math.floor(this.focus.x / this.bw);
    if (this.mouseState == 1)
      this.setObstacle(this.focus.r, this.focus.c);
    this.draw(ctx);
  }
  setStart(r,c) {
    if (this.start != null) { this.board[this.start.y][this.start.x] = this.states.blank; }
    this.board[r][c] = this.states.start;
    this.start = new Point(c,r);
    this.clearPath();
  }
  clearPath(n=null) {
    for (var r=0;r<this.board[0].length;r++) {
      for (var c=0;c<this.board.length;c++) {
        if (this.board[r][c]==this.states.path)
          this.board[r][c] = this.states.blank;
      }
    }
  }
  setEnd(r,c) {
    if (this.end != null) this.board[this.end.y][this.end.x] = this.states.blank;
    this.board[r][c] = this.states.end;
    this.clearPath();
    this.end = new Point(c,r);
  }
  setObstacle(r,c) {
    this.board[r][c] = this.states.blocked;
  }
  db(text) {
    if (this.debug) console.log(text);
  }
  keypress(ctx,e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
      this.board[this.focus.r][this.focus.c] = e.keyCode - 48;
      this.draw(ctx);
      this.isValid(this.board);
    } else if (e.key == 's') {
      this.setStart(this.focus.r,this.focus.c);
      this.db(this.asString()+"\n");
      this.draw(ctx);
    } else if (e.key == 'e') {
      this.setEnd(this.focus.r,this.focus.c);
      this.db(this.asString()+"\n");
      this.draw(ctx);
    } else if (e.key == 'f') {
      this.db("f pressed");
      var p = this.astar(this.start, this.end);
      this.printPath(p);
      this.draw(ctx);
    }
  }


  neighbors(n) {
    var l = this.space.neighbors(n);
    var r = [];
    for (var i=0;i<l.length;i++) {
      if (! (this.board[l[i].y][l[i].x] == this.states.blocked) )
        r.push(l[i]);
    }
    return r;
  }
  weight(a,b) { return this.space.weight(a,b); }
  astar(start,end) {
    var v = this.agent.astar(this.start,this.end);
    return v;
  }
  printPath(n) {
    var z = n;
    while (z != null) {
      if (! (z.n.equals(this.start)
            || (z.n.equals(this.end)) ))
        this.board[z.n.y][z.n.x] = this.states.path;
      z = z.p;
    }
  }
}


var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext('2d');
let grid = new Grid(10,10,ctx.canvas.getBoundingClientRect().left,ctx.canvas.getBoundingClientRect().top);
grid.draw(ctx);

function mouseDownHandler(e) {
  var x = e.x - grid.tl.x;
  var y = e.y - grid.tl.y;
  if ((x <= canvas.width) && (y <= canvas.height) && x >= 0 && y >= 0)
    grid.click(ctx,e);
}
function mouseUpHandler(e) {
  grid.mouseState = 0;
}
function mouseMoveHandler(e) {
  grid.stroke(ctx,e);
}
function keyDownHandler(e) {
  grid.keypress(ctx,e);
}

document.addEventListener("mousedown", mouseDownHandler);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("mouseup", mouseUpHandler);
