class AnnotatedNode {
  constructor(n,p,f,g) {
    this.n = n;
    this.p = p;
    this.f = f;
    this.g = g;
  }
  toString() {
    if (this.p != null)
      return "("+this.n.toString()+","+this.f+","+this.g+")";
    else
      return "("+this.n.toString()+","+this.f+","+this.g+")";
  }
}

class Grid {
  constructor(width=10,height=10,xin=0,yin=0) {
    this.states = {
      blank: 0,
      start: 1,
      end: 2,
      blocked: 3,
      path: 4
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

    this.marks = {
      unmarked: 0,
      closed: 1,
      open: 2
    }
    this.open = [];
    for (var y=0;y<height;y++) {
      this.open[y] = [];
      for (var x=0;x<width;x++)
        this.open[y][x] = this.marks.unmarked;
    }
    this.ftable = [];
    for (var y=0;y<height;y++) {
      this.ftable[y] = [];
      for (var x=0;x<width;x++)
        this.ftable[y][x] = 0;
    }
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

    // Outline individual squares
    for (var r=0;r<this.board[0].length;r++) {
      for (var c=0;c<this.board.length;c++) {
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(c*this.bw, r*this.bh, this.bw, this.bh);
      }
    }

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
    var x = e.x - this.tl.x; 
    var y = e.y - this.tl.y;
    var r = Math.floor(y / this.bh);
    var c = Math.floor(x / this.bw);
    if (this.mouseState == 1)
      this.board[r][c] = this.states.blocked;
    this.draw(ctx);
  }
  setStart(r,c) {
    if (this.start != null) { this.db("Start: "+this.start+" "+this.start.toString()+" "+this.board[0].length+" "+this.start.y+" "+this.start.x);this.board[this.start.y][this.start.x] = this.states.blank; }
    this.board[r][c] = this.states.start;
    //this.start = {r:r, c:c};
    this.start = new Point(c,r);
  }
  setEnd(r,c) {
    if (this.end != null) this.board[this.end.y][this.end.x] = this.states.blank;
    this.board[r][c] = this.states.end;
    this.end = new Point(c,r);
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
    } else if (e.key == 'f') {
      this.db("f pressed");
      this.astar(this.start, this.end);
      this.draw(ctx);
    }
  }
  neighbors(n) {
    var r = [];
    for (var x=-1;x<=1;x++) for (var y=-1;y<=1;y++) {
      if (x+n.x>=0 &&
          x+n.x<this.board.length &&
          y+n.y>=0 &&
          y+n.y<this.board[0].length &&
          !(x==0 && y==0)
        )
        r.push(new Point(x+n.x,y+n.y));
    }
    return r;
  }
  // cost from start to m plus cost of m to n (ie, cost of start to n)
  g(m,n) {
    return m.g+1;
  }
  h(n,e) {
    return Math.abs(n.x-e.x)+Math.abs(n.y-e.y);
  }
  astar(start,end) {
    // Implement the A* algorithm
    var open = new Heap(1); // Min-heap
    var closed = new Map();

    // Step 1: Mark s "open" and calculate f(s)
    open.insert(new AnnotatedNode(start,null,0,0),0);
    this.open[start.y][start.x] = this.marks.open;
    this.ftable[start.y][start.x] = 0;

    var pass = 0;
    while (true) {
      if (open.isEmpty()) {
        return null;
      }
      // Step 2: Select open node n with smallest value of f.
      var n = open.remove();
      this.open[n.n.y][n.n.x] = this.marks.unmarked;

      // Step 3: If n is a goal node, mark closed and terminate.
      if (n.n.equals(end)) {
        this.open[n.n.y][n.n.x] = this.marks.closed;
        this.ftable[n.n.y][n.n.x] = n.f;


        // Mark path nodes as such
        var z = n;
        this.db("returning path: ");
        while (z != null) {
          this.db(z.toString());
          this.board[z.n.y][z.n.x] = this.states.path;
          z = z.p;
        }

        return n;
      }

      // Step 4:  Mark n closed and apply successor function to n.
      //          Calculate f for each successor and mark as open each
      //          successor not already marked closed. Remark as open any closed
      //          node n_i which is a successor of n and for which f(n_i) is
      //          smaller now than it was when n_i was marked closed.
      //          Goto step 2.
      this.ftable[n.n.y][n.n.x] = n.f;
      this.open[n.n.y][n.n.x] = this.marks.closed;
      var ni = this.neighbors(n.n);
      for (var i=0;i<ni.length;i++) {
          var s = ni[i];
          var t = new AnnotatedNode(s,n,this.g(n,s)+this.h(s,this.end),this.g(n,s));
          if (!(this.open[t.n.y][t.n.x]==this.marks.closed) && !(this.open[t.n.y][t.n.x]==this.marks.open)) {
            open.insert(t,t.f);
            this.open[t.n.y][t.n.x] = this.marks.open;
            this.ftable[t.n.y][t.n.x] = t.f;
          } else if (this.open[t.n.y][t.n.x]==closed && t.f < this.ftable[t.n.y][t.n.x]) {
            closed.delete(t.n);
            open.insert(t,t.f);
            this.open[t.n.y][t.n.x] = this.marks.open;
            this.ftable[t.n.y][t.n.x] = t.f;
          } 
          else if (this.open[t.n.y][t.n.x]==this.marks.open && t.f < this.ftable[t.n.y][t.n.x]) {
            this.ftable[t.n.y][t.n.x] = t.f;
          }
      }
      pass++;

    }
  }
}

var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext('2d');
let grid = new Grid(10,10,ctx.canvas.getBoundingClientRect().left,ctx.canvas.getBoundingClientRect().top);

var canvas = document.getElementById("mainCanvas");
grid.draw(ctx);

grid.setStart(4,2);
grid.setEnd(4,6);
grid.draw(ctx);
grid.astar(grid.start, grid.end);
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
