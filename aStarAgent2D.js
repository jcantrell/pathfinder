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
    this.open = new Heap(1);
    this.closed = new Map();
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
    var open = new Heap(1); // Min-heap
    var closed = new Map();

    open.insert(new AnnotatedNode(start,null,0,0),0);

    while (!open.isEmpty()) {
      var n = open.remove();
      closed.set(JSON.stringify(n.n),n.f);

      if (n.n.equals(end))
        return n;

      var l = this.space.neighbors(n.n);
      for (var i=0;i<l.length;i++) {
        var s = l[i];
        var g = this.g(n,s);
        var f = g + this.h(s,end);
        var t = new AnnotatedNode (s, n, f, g);

        if (! (closed.has(JSON.stringify(t.n)) 
              && t.f >= closed.get(JSON.stringify(t.n))) )
        {
          if (closed.has(JSON.stringify(t.n))) 
            closed.remove(JSON.stringify(t.n));
          open.insert(t,t.f);
        }
      }
    }
    this.db("No path found!");
  }
  reset() {
    this.closed.clear();
    this.open.clear();
  }
  aStarIteration(end) {
    if (this.open.isEmpty()) return null;
    var n = this.open.remove();
    this.closed.set(JSON.stringify(n.n),n.f);
    if (n.n.equals(end))
      return n;

    var l = this.space.neighbors(n.n);
    for (var i=0;i<l.length;i++) {
      var s = l[i];
      var g = this.g(n,s);
      var f = g + this.h(s,end);
      var t = new AnnotatedNode (s, n, f, g);

      if (! (this.closed.has(JSON.stringify(t.n)) 
          && t.f >= this.closed.get(JSON.stringify(t.n))) )
      {
        if (this.closed.has(JSON.stringify(t.n))) 
          this.closed.remove(JSON.stringify(t.n));
        this.open.insert(t,t.f);
      }
    }
    return null;
  }
  aStarStepwise(start,end) {
    this.reset();
    this.open.insert(new AnnotatedNode(start,null,0,0),0);
    var p = null
    while (p == null && !this.open.isEmpty())
      p = this.aStarIteration(end);
    return p;
  }
  openlist() {
    var c = this.open.copy();
    var r = [];
    while (!c.isEmpty())
      r.push(c.remove());
    return r;
  }
  closedlist() {
    return Array.from( this.closed.keys() );
  }
}
