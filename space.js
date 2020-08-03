class Graph {
  constructor(width=10,height=10) {
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
  }
  toString() {
    var s="";
    for (var r=0;r<this.board.length;r++) { 
      for (var c=0;c<this.board.length[0].length;c++) {
        s+=this.board[r][c]+" ";
      }
      s+="\n";
    }
    s+="\n";
    return s;
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
  nodes(n) {
    var r = [];
    for (var x=0;x<=this.board.length;x++)
      for (var y=0;y<=this.board[0].length;y++) {
        r.push(new Point(x,y));
      }
    return r;
  }
  // Cost to go from neigbor a to neighbor b
  weight(a,b) {
    return 1;
  }
}

class twoDSpace {
  constructor(width=10,height=10) {
    this.graph = new Graph();
  }
  neighbors(n) {
    return this.graph.neighbors(n);
  }
  weight(a,b) {
    return this.graph.weight(a,b);
  }
}
