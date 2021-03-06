import React from 'react';

var dimension = 5;

// export default function App (){
//   return (
//     <div>
//       <h1>Bingo</h1>
//       <button onClick={() => this.handleRandom()}>random</button>
//       <button onClick={() => this.handleClear()}>Clear</button>
//       <button onClick={() => this.handleAdd()}>Add</button>  
//       <h1> Pick Numbers, next: {this.state.nxtNum}</h1>
//       {/* <Board nums={this.state.pick} handle={this.handleClick}/>    */}
//       <br/>
//       <button onClick={() => this.handleGo()}>go</button>
//       <h1> Result {(this.state.hits)? this.state.hits.toString() : ''}</h1> 
//       {results}
//     </div>
//   );
// }

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pick: new Array(dimension * dimension).fill(0),
      picked: [],
      result: [],
      nxtNum: 1,
      hits: null,
      hit_pool: this.generateNums(dimension * dimension),
      hit_step: 0,
      dimension: dimension
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  render(){
    const results = this.state.picked.map((p) => <Board nums={p} hits={this.state.hits} hit_lines={this.checkLine(p)}/>);
               
    console.log(`this.state.pick`, this.state.pick)
    // if(this.state.pick)this.handleRandom()

    return (
      <div>
        <h1>Bingo</h1>
        <button onClick={() => this.handleRandom()}>random</button>
        <button onClick={() => this.handleClear()}>Clear</button>
        <button onClick={() => this.handleAdd()}>Add</button>  
        <h1> Pick Numbers, next: {this.state.nxtNum}</h1>
        {/* <Board nums={this.state.pick} handle={this.handleClick}/>    */}
        <br/>
        <button onClick={() => this.handleGo()}>go</button>
        <h1> Result {(this.state.hits)? this.state.hits.toString() : ''}</h1> 
        {results}
      </div>
    );
  }
  
  handleClick(i){
    if(this.state.pick[i] == 0){
      let newNums = this.state.pick.slice(0);
      newNums[i] = this.state.nxtNum;
      this.setState({
        pick: newNums,
        nxtNum: this.state.nxtNum+1
      });
    }
  }
  
  handleGo(){
    const hit_pool = this.state.hit_pool;
    const hits = hit_pool.slice(0, this.state.hit_step+1);
    this.setState({
      hits: hits,
      hit_step: this.state.hit_step+1
    });
  }
  
  handleRandom(){
      const ranNums = this.generateNums(dimension * dimension);
      console.log(`ranNums`, ranNums)
      
      
      // if(ranNums)this.handleAdd()
      this.setState({
        pick: ranNums,
        result: ranNums,
      });

      // console.log(`this.state.pick`, this.state.pick)
      // console.log(`this.state.result`, this.state.result)
  }
  
  handleClear(){
      this.setState({
      pick: new Array(dimension * dimension).fill(0),
      picked: [],
      result: [],
      nxtNum: 1,
      hits: null,
      hit_pool: this.generateNums(dimension * dimension),
      hit_step: 0
      });
  }
  
  async handleAdd(){
    await this.handleRandom()
    const pick = this.state.pick;
    let picked = this.state.picked;
    picked.push(pick)
    this.setState({
      picked: picked,
      pick: new Array(dimension * dimension).fill(0),
      nxtNum: 1,
    });
  }
  
  generateNums(max){
      const pool = [
          "(child noises in the background)", 
          "Hello, hello?", 
          "i need to jump in another call", 
          "can everyone go on mute", 
          "could you please get closer to the mic",
          "(load paintful echo / feedback)", 
          "next slide, please", 
          "can we take this offline?",
          "is __ on the call?",
          "Could you share this slides afterwards?",
          "can somebody grant presenter rights?",
          "can you email that to everyone?",
          "can you set the next meeting?",
          "sorry, I had problems loging in",
          "(animal noises in the backgroud)",
          "sorry, i didn't found the conference id",
          "i was having connection issues",
          "i'll have to get back to you",
          "who just joined?",
          "sorry, something __ with my calendar",
          "do you see my screen",
          "let wait for __ !",
          "you will send the minutes?",
          "sorry, i was on mute.",
          "can you repeat, please?",
          "can you speak loader?"
      ];


      let arr = [];
      while(arr.length < max){
        const idx = parseInt(Math.random() * (max+1));
        if(pool[idx] != 0){
          arr.push(pool[idx]);
          pool[idx] = 0;
        }
      }
      console.log(`arr in generateNums`, arr)
      return arr;
  }
  
  checkLine(arr){
    const lines = [];
    
    let slash1 = [];
    let slash2 = [];
    for(var i = 0; i < dimension; i++){
      let row = [];
      let col = [];
      
      for(var o = 0; o < dimension; o++){
        row.push(o + dimension * i);
        col.push(o * dimension + i);
      }
      lines.push(row);
      lines.push(col);
      
      slash1.push(i + dimension * i);
      slash2.push((dimension - 1) * (i + 1));
    }
    lines.push(slash1);
    lines.push(slash2);

    console.log(`lines >>`, lines)
    
    const hits = this.state.hits || [];
    let rtn = [];
    for(var i = 0; i < lines.length; i++){
      let line_is_hit = true;
      for(var num in lines[i]){
        if(undefined == arr[lines[i][num]] || !hits.includes(arr[lines[i][num]])){
          line_is_hit = false;
          break;
        }
      }
      
      if(line_is_hit){
        for(var num in lines[i]){
          rtn.push(lines[i][num]);
        }
      }
      
    }
    return rtn;
  }
}

export default App;


class Board extends React.Component{
    constructor(props){
      super(props);
      console.log(`this.props.nums in Board >>`, this.props.nums)
    }
    
    render(){
      const num_tiles = this.props.nums.map((n, i) => 
        <Btn 
          active={ ((this.props.hits || []).includes(n)) } 
          lined={ ((this.props.hit_lines || []).includes(i)) }
          idx={i} num={n} 
          handle={this.props.handle}
        />
      );
  
      console.log(`num_tiles`, num_tiles)
      return(
        <div style={{width: 107 * dimension, height: 107 * dimension}} className="group">
          {num_tiles}
        </div>
      );
    }
    
  }
  
  class Btn extends React.Component{
    constructor(props){
      super(props);
      
      if(undefined != this.props.handle)
        this.handleClick = this.props.handle.bind(this);
      else
        this.handleClick = () => {};
  
    }
    render(){
      let status = '';
      if(this.props.active == true){
        status = 'active';
      }
      if(this.props.lined == true){
        status = 'lined';
      }
      return(
          this.props.idx !== 12 ? 
            <div className={"btn " + status} onClick={(e) => this.handleClick(this.props.idx)}>
            {(this.props.num != 0) ? this.props.num : <span className="black">&nbsp;</span>}
          </div> : 
          <div className={"btn " + status} onClick={(e) => this.handleClick(this.props.idx)}>
            <span className="black">Bingo</span>
          </div>
      );
    }
  }
  

