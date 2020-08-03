/* A heap with has method */
class HeapSet {
  constructor(mode_in=0) {
    this.modes = {
      max:0,
      min:1
    }
    this.mode = mode_in;
    this.arr = [];
  }
  hc(a,b) { // heap condition
    if (this.mode==this.modes.max)
      return a>b||a==b;
    if (this.mode==this.modes.min)
      return a<b||a==b;
  }
  insert(vi, pi) {
    var i = this.arr.length;
    this.arr.push({v:vi,p:pi});
    while (!this.hc(this.arr[this.parenti(i)].p, this.arr[i].p)) {
      this.swap(i,this.parenti(i));
      i = this.parenti(i);
    }
  }
  remove() {
    var heapMode = true; // T for max heap, F for min heap
    var s = this.arr[0];
    if (this.arr.length == 1)
      this.arr.pop();
    else
      this.arr[0] = this.arr.pop();
    var i = 0;

    var l =    this.left(i) < this.arr.length 
            && !this.hc(this.arr[i].p, this.arr[this.left(i)].p);
    var r =    this.right(i) < this.arr.length 
            && !this.hc(this.arr[i].p, this.arr[this.right(i)].p);
    while (l||r) {
      var c = this.right(i);
      if (c<this.arr.length) {    // 2 children exist 
        if (this.mode == this.modes.max)
          c = this.arr[this.left(i)].p > this.arr[c].p ? this.left(i) : c;
        else
          c = this.arr[this.left(i)].p < this.arr[c].p ? this.left(i) : c;
      }
      if (this.right(i)==this.arr.length) {// Only one child
        c = this.left(i);
      }
      if (this.left(i)>=this.arr.length) {   // No children
        c = i;
      }
      if (!this.hc(this.arr[i].p,this.arr[c].p))
        this.swap(i,c);
      i = c;

      l =    this.left(i) < this.arr.length 
            && !this.hc(this.arr[i].p, this.arr[this.left(i)].p);
      r =    this.right(i) < this.arr.length 
            && !this.hc(this.arr[i].p, this.arr[this.right(i)].p);
    }
    return s.v;
  }
  left(i) { return i*2+1; }
  right(i) { return i*2+2; }
  parenti(i) { return i===0 ? 0 : Math.floor((i-1)/2) ; }
  swap(i,j) {
    var t = this.arr[i];
    this.arr[i] = this.arr[j];
    this.arr[j] = t;
  }
  isEmpty() { 
    return this.arr.length == 0;
  }
  toString() {
    var s="";
    for (var i=0;i<this.arr.length;i++)
      s+= "("+this.arr[i].v.toString()+this.arr[i].p+") ";
    return s;
  }
  size() {
    return this.arr.length;
  }
}
