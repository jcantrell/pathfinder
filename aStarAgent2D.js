class aStarAgent2D {
  constructor() {
    this.states = {
      blank: 0,
      start: 1,
      end: 2,
      blocked: 3,
      path: 4
    }
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
  astar(start,end,space) {
    // Implement the A* algorithm
    var open = new Heap(1); // Min-heap
    var closed = new Map();

    // Step 1: Mark s "open" and calculate f(s)
    open.insert(new AnnotatedNode(start,null,0,0),0);
    // TODO: convert calls to this.open[y][x] to open.insert(Node(x,y))
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
      //var ni = this.neighbors(n.n);
      var ni = space.neighbors(n.n);
      for (var i=0;i<ni.length;i++) {
          var s = ni[i];
          var t = new AnnotatedNode(s,n,this.g(n,s)+this.h(s,this.end),this.g(n,s));
          /*
          if (!closed.has(t.n) && !open.has(t.n)) { // if t.n is unmarked
            open.insert(t,t.f);
          } else if (closed.has(t.n) && t.f < closed.lookup(t.n)) {
            closed.delete(t.n);
            open.insert(t,t.f);
            
            ? open.insert(closed.delete(t.n),t.f)
          } else if (open.has(t.n) && t.f < open.lookup(t.n)) {
            open.setValue(t.n,t.f);
          }
          */
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
module.exports = aStarAgent2D;
