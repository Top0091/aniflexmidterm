import React from 'react';
import './App.css';

/////////////////
/// COMPONENTS //
/////////////////

// Container
var App = React.createClass({
  apiKey: 'd272326e467344029e68e3c4ff0b4059',
  getInitialState: function() {
    return {searchTerm:"", searchUrl:""};
  },
  handleKeyUp :function(e){
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
      var searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
      this.setState({searchUrl:searchUrl});
    }
  },

  handleChange : function(e){
      this.setState({searchTerm : e.target.value});    
  },
  render: function() {
    return (
      <div>
        <header className="Header">
          <Navigation />
          <div id="search" className="Search">
            <input onKeyUp={this.handleKeyUp} onChange={this.handleChange} type="search" placeholder="Type the name of movie you want to see" value={this.state.searchTerm}/>
          </div>
        </header>
        <Hero />
        <SearchList title="Results" url={this.state.searchUrl} />
        <SearchList title="Lasted Release" url='genre/16/movies?sort_by=primary_release_date.desc&page=1' />
       </div>
    );
  }
});


// Navigation
var Navigation = React.createClass({
  render: function() {
    return (
      <div id="navigation" className="Navigation">
        <nav>
          <ul>
            <li>Browse</li>
            <li>Lasted Release</li>
          </ul>
        </nav>
      </div>
    );
  }
});



//////////
// Hero //
//////////

var Hero = React.createClass({
  render: function() {
    return (
      <div id="hero" className="Hero" style={{backgroundImage: 'url(https://s-media-cache-ak0.pinimg.com/originals/63/67/a3/6367a3eab44081e8daae02cd03d3e596.jpg)'}}>
        <div className="content">

          <h2>ANIMATED THE LIFE</h2>
          <p>“Animation had been done before, but stories were never told.”</p>
          <div className="button-wrapper">
          </div>
        </div>
        <div className="overlay"></div>
      </div>
    );
  }
})



////////////////
// Search List //
////////////////

// Search List Container

var SearchList = React.createClass({

  apiKey: '87dfa1c669eea853da609d4968d294be',
  getInitialState: function() {
    return {data: [], mounted: false};
  },
  loadContent: function() {
    var requestUrl = 'https://api.themoviedb.org/3/' + this.props.url + '&api_key=' + this.apiKey;
    fetch(requestUrl).then((response)=>{
        return response.json();
    }).then((data)=>{
        this.setState({data : data});
    }).catch((err)=>{
        console.log("error occur");
    });
  },
  componentWillReceiveProps : function(nextProps){
    if(nextProps.url !== this.props.url && nextProps.url !== ''){
      this.setState({mounted:true,url:nextProps.url},()=>{
        this.loadContent();
      });
      
    }
  },
  componentDidMount: function() {
    if(this.props.url !== ''){
      this.loadContent();
      this.setState({mounted:true});
    }
    
  },
  render: function() {
    var titles ='';
    if(this.state.data.results) {
      titles = this.state.data.results.map(function(title, i) {
        if(i < 5) {
          var name = '';
          var backDrop = 'http://image.tmdb.org/t/p/original' + title.backdrop_path;
          if(!title.name) {
            name = title.original_title;
          } else {
            name = title.name;
          }

          return (
            <Item key={title.id} title={name}  overview={title.overview} backdrop={backDrop} />
          );  

        }else{
          return (<div key={title.id}></div>);
        }
      }); 

    } 
    
    return (
      <div ref="titlecategory" className="SearchList" data-loaded={this.state.mounted}>
        <div className="Title">
          <h1>{this.props.title}</h1>
          <div className="titles-wrapper">
            {titles}
          </div>
        </div>
      </div>
    );
  }
});

// SearchList Item
var Item = React.createClass({
  render: function() {
    return (
      <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >
        <div className="overlay">
          <div className="title">{this.props.title}</div>
          <div className="plot">{this.props.overview}</div>
          <ListToggle />
        </div>
      </div>
    );
  }
});

// ListToggle
var ListToggle = React.createClass({
  getInitialState: function() {
    return({ toggled: false })
  },
  handleClick: function() {
    if(this.state.toggled === true) {
      this.setState({ toggled: false });
    } else {
      this.setState({ toggled: true }); 
    }
    
  },
  render: function() {
    return (
      <div onClick={this.handleClick} data-toggled={this.state.toggled} className="ListToggle">
        <div>
          <i className="fa fa-fw fa-star"></i>
          <i className="fa fa-fw fa-heart"></i>
        </div>
      </div>
    );
  }
});


export default App;
