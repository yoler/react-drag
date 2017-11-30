import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './action/action'
import './App.css';
import './app.less';
import Add from './component/add'
import Min from './component/min'

var before = document.createElement("div");
before.className = "before"

var after = document.createElement("div");
after.className = "after"

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            data: ["1","2","3","4","5","6","7"]
        }
    }

    handleChange (e) {
        this.setState({
            value: e.target.value ? e.target.value : ''
        })
    }

    dragStart = (event) => {
        this.dragged = event.currentTarget
        event.dataTransfer.effectAllowed = 'move'

        console.log(this.dragged)
        // event.target.style.opacity = '0'
        event.dataTransfer.setData('text/html', event.currentTarget)
        // event.target.classList.add('is-draging')
    }

    dragEnd = (event) => {
        this.dragged.style.opacity = "1"
        this.over.classList.remove('is-draging')
        // event.target.classList.remove('is-draging')
        if (this.over.children) {
            for (let i = 0; i < this.over.children.length; i++) {
                if (this.over.children[i].className == 'before') {
                    this.over.removeChild(before)
                }
                else if (this.over.children[i].className == 'after') {
                    this.over.removeChild(after)
                }
            }
        }
        if (this.nodePlacement == 'over' && this.dragged.dataset.id != this.over.dataset.id) {
            alert('放入子集')
            return
        }
        var data = this.state.data;
        var from = Number(this.dragged.dataset.id);
        var to = Number(this.over.dataset.id);
        if(from < to) to--;
        if(this.nodePlacement == "after") to++
        data.splice(to, 0, data.splice(from, 1)[0]);
        this.setState({data: data})
    }

    drop = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    drag = () => {
        // console.log('drag')
    }

    dragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.dragged.style.opacity = "0";
        var relY = event.clientY -  event.target.offsetTop
        var height = event.target.offsetHeight / 2
        this.over = event.target
        // event.target.classList.add('is-draging')
        if (relY < height - 3) {
            if (event.target.children) {
                for (let i = 0; i < event.target.children.length; i++) {
                    if (event.target.children[i].className == 'before') {
                        return
                    }
                }
                event.target.appendChild(before)
            }
            event.target.classList.remove('is-draging')
            this.nodePlacement = "before"
        }
        else if ((relY >= height - 3 && relY <= height + 3)) {
            if (event.target.children.length > 0) {
                for (let i = 0; i < event.target.children.length; i++) {
                    if (event.target.children[i].className == 'before') {
                        event.target.removeChild(before)
                    }
                    else if (event.target.children[i].className == 'after') {
                        event.target.removeChild(after)
                    }
                }
            }
            event.target.classList.add('is-draging')
            this.nodePlacement = "over"
        }
        else if (relY > height + 3) {
            if (event.target.children) {
                for (let i = 0; i < event.target.children.length; i++) {
                    if (event.target.children[i].className == 'after') {
                        return
                    }
                }
                event.target.appendChild(after)
            }
            this.nodePlacement = "after"
            event.target.classList.remove('is-draging')
        }
        // console.log(event.target, 'onDragOver')
    }

    dragenter = (event) => {
        // event.target.appendChild(placeholder);
        // event.target.style.background = 'red'
        if (event.target.nextSibling && event.target.nextSibling.children) {
            for (let i = 0; i < event.target.nextSibling.children.length; i++) {
                if (event.target.nextSibling.children[i].className == 'before') {
                    event.target.nextSibling.removeChild(before)
                }
                else if (event.target.nextSibling.children.className == 'after') {
                    event.target.nextSibling.removeChild(after)
                }
            }
        }
        if (event.target.previousSibling && event.target.previousSibling.children) {
            for (let i = 0; i < event.target.previousSibling.children.length; i++) {
                if (event.target.previousSibling.children[i].className == 'before') {
                    event.target.previousSibling.removeChild(before)
                }
                else if (event.target.previousSibling.children.className == 'after') {
                    event.target.previousSibling.removeChild(after)
                }
            }
        }
    }

    dragLeave = (event) => {
        // event.target.removeChild(placeholder);
        // event.target.style.background = '#888'
        for (let i = 0; i < event.target.children.length; i++) {
            if (event.target.children[i].className == 'before') {
                event.target.removeChild(before)
            }
            else if (event.target.children[i].className == 'after') {
                event.target.removeChild(after)
            }
        }
        event.target.classList.remove('is-draging')
    }

     render() {
        const { count, name, increaseAction, incrementAsync, minAction, getData} = this.props
        return (
          <div className="App">
            拖动排序
               <ul>
                 	{this.state.data.map(function(item, i) {
                   	return (
                     	<li
             		         data-id={i}
                             key={i}
                             draggable="true"
                             onDragStart={this.dragStart}
                             onDrag={this.drag}
                             onDragEnter={this.dragenter}
                             onDragOver={this.dragOver}
                             onDragLeave={this.dragLeave}
                             onDrop={this.drop}
                             onDragEnd={this.dragEnd}
                           >
                    			{item}
                       </li>
                     )
                	 	}, this)}
                 </ul>
          </div>
        );
     }
}

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
