import React, { useEffect, useState } from 'react';
global.dimension = 5


const checkLine = (arr,hitsInput)=>{
    const lines = [];
    
    let slash1 = [];
    let slash2 = [];
    for(var i = 0; i < global.dimension; i++){
      let row = [];
      let col = [];
      
      for(var o = 0; o < global.dimension; o++){
        row.push(o + global.dimension * i);
        col.push(o * global.dimension + i);
      }
      lines.push(row);
      lines.push(col);
      
      slash1.push(i + global.dimension * i);
      slash2.push((global.dimension - 1) * (i + 1));
    }
    lines.push(slash1);
    lines.push(slash2);
  
    
    const hits = hitsInput || [];
    let rtn = [];
    for(let i = 0; i < lines.length; i++){
      let line_is_hit = true;
      for(var num in lines[i]){
        if(undefined === arr[lines[i][num]] || !hits.includes(arr[lines[i][num]])){
          line_is_hit = false;
          break;
        }
      }
      
      if(line_is_hit){
        for(let num in lines[i]){
          rtn.push(lines[i][num]);
        }
      }
      
    }
    return rtn;
  }

const generateNums = (max)=>{
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
      if(pool[idx] !== 0){
        arr.push(pool[idx]);
        pool[idx] = 0;
      }
    }
    return arr;
}


export default function App (){
    const [pick, setPick] = useState(new Array(global.dimension * global.dimension).fill(0))
    const [picked, setPicked] = useState([])
    const [result, setResult] = useState([])
    const [nxtNum, setNxtNum] = useState(1)
    const [hits, setHits] = useState(null)
    const [hit_pool, setHit_pool] = useState(generateNums(global.dimension * global.dimension))
    const [hit_step, setHit_step] = useState(0)

    useEffect(()=>{
    },[hits])
    const results = picked.map((p) => <Board nums={p} hits={hits} hit_lines={checkLine(p,hits)}/>);


    const handleRandom = ()=>{
        const ranNums = generateNums(global.dimension * global.dimension);
        
        setPick(ranNums)
        setResult(ranNums)
    }

    const handleClear = ()=>{
        setNxtNum(1)
        setPick(new Array(global.dimension * global.dimension).fill(0))
        setResult([])
        setPicked([])
        setHits(null)
        setHit_pool(generateNums(global.dimension * global.dimension))
        setHit_step(0)
    }
    
    const handleAdd = ()=>{    
    if(picked.length === 0 )picked.push(pick)

      setPicked(picked)
      setPick(new Array(global.dimension * global.dimension).fill(0))
      setNxtNum(1)
    }




  const handleClick = (i)=>{
    if(this.state.pick[i] === 0){
      let newNums = this.state.pick.slice(0);
      newNums[i] = nxtNum;
      setPick(newNums)
      setNxtNum(nxtNum+1)
    }
  }
  
const handleGo = (hit_poolInput,hit_stepInput) => {
    const hit_pool = hit_poolInput;
    const hits = hit_pool.slice(0, hit_stepInput+1);
    setHits(hits)
    setHit_step(hit_stepInput+1)
  }

  return (
    <div>
      <h1>Bingo</h1>
      <button onClick={() => handleRandom()}>random</button>
      <button onClick={() => handleClear()}>Clear</button>
      <button onClick={() => handleAdd()}>Add</button>  
      <h1> Pick Numbers, next: {nxtNum}</h1>
      <br/>
      <button onClick={() => handleGo(hit_pool,hit_step)}>go</button>
      <h1> Result {(hits)? hits.toString() : ''}</h1> 
      {results}
    </div>
  );
}



class Board extends React.Component{
    constructor(props){
      super(props);
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
  
      return(
        <div style={{width: 107 * global.dimension, height: 107 * global.dimension}} className="group">
          {num_tiles}
        </div>
      );
    }
    
  }
  
  class Btn extends React.Component{
    constructor(props){
      super(props);
      
      if(undefined !== this.props.handle)
        this.handleClick = this.props.handle.bind(this);
      else
        this.handleClick = () => {};
  
    }
    render(){
      let status = '';
      if(this.props.active === true){
        status = 'active';
      }
      if(this.props.lined === true){
        status = 'lined';
      }
      return(
          this.props.idx !== 12 ? 
            <div className={"btn " + status} onClick={(e) => this.handleClick(this.props.idx)}>
            {(this.props.num !== 0) ? this.props.num : <span className="black">&nbsp;</span>}
          </div> : 
          <div className={"btn " + status} onClick={(e) => this.handleClick(this.props.idx)}>
            <span className="black">Bingo</span>
          </div>
      );
    }
  }
  

