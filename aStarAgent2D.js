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

class aStarAgent2D {
  constructor(space) {
    this.space = space;
    this.debug = true;
  }
  db(text) {
    if (this.debug) console.log(text);
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
  // cost from start to m plus cost of m to n (ie, cost of 
  // start to n)
  g(m,n) {
    return m.g+this.space.weight(m,n);
  }
  h(n,e) {
    return Math.abs(n.x-e.x)+Math.abs(n.y-e.y);
  }
  // Implement the A* algorithm
  astar(start,end) {
    this.db("star called");
    var open = new Heap(1); // Min-heap
    var closed = new Map();

    this.db("opening"+JSON.stringify(start)+" 0");
    open.insert(new AnnotatedNode(start,null,0,0),0);

    var pass=0;
    while (!open.isEmpty()) {
      var n = open.remove();
      this.db("unopening "+JSON.stringify(n.n));
      closed.set(JSON.stringify(n),n.f);

      if (n.n.equals(end))
        return n;

      var l = this.space.neighbors(n.n);
      this.db(JSON.stringify(this.space.board));
      for (var i=0;i<l.length;i++) {
        var s = l[i];
        var g = this.g(n,s);
        var f = g + this.h(s,end);
        var t = new AnnotatedNode (s, n, f, g);

        this.db("checking "+JSON.stringify(s));

        if (! (closed.has(JSON.stringify(t.n)) 
              && t.f >= closed.get(JSON.stringify(t.n))) ) 
        {
          if (closed.has(JSON.stringify(t.n))) 
          {
            this.db("unclosing "+JSON.stringify(t.n));
            closed.remove(JSON.stringify(t.n));
          }
          open.insert(t,t.f);
        }
      }
    }
    this.db("No path found!");
  }
}


//export { aStarAgent2D };
