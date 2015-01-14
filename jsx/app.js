var PostList = React.createClass({
  render: function() {
    var postNodes = this.state.posts.map(function (post) {
      return (
        <Post post={post} key={post.data.id} />
      );
    });

    return (
      <ul className="posts" id="posts">
        {postNodes}
      </ul>
    );
  },
  getInitialState: function() {
    return {posts: []};
  },
});

var App = React.createClass({
  render: function() {

    var buttonStyle = {
      display: this.state.showLoadMoreButton ? "inline" : "none"
    }

    return (
      <div>
      <PostList ref="postList"/>
      <button style={buttonStyle} ref="loadMoreButton" onClick={this.getPosts}>Load More</button>
      </div>
    )
  },
  getInitialState: function() {
    return {
      showLoadMoreButton: false
    };
  },
  getPosts: function() {
    this.setState({"showLoadMoreButton": false});

    oboe('http://www.reddit.com/.json?after=' + this.state.after)
    .done(function(result) {

      var postList = this.refs.postList;
      var posts = postList.state.posts;
      postList.setState({"posts": posts.concat(result.data.children)});

      this.setState({"after": result.data.after, "showLoadMoreButton": true});

    }.bind(this));
  },
  componentDidMount: function() {
    this.getPosts();
  }
})

var Post = React.createClass({
  render: function() {
    var postData = this.props.post.data
    var userLink = "http://www.reddit.com/u/" + postData.author
    var subredditLink = "http://www.reddit.com/r/" + postData.subreddit
    var permalink = "http://www.reddit.com" + postData.permalink

    var thumbnailStyle = {
      backgroundImage: 'url(' + postData.thumbnail + ')',
      display: postData.thumbnail ? 'block' : 'none'
    };

    return (
      <li>
        <div style={thumbnailStyle} className="thumbnail-container">
        </div>
        <div className="content">
          <a href={postData.url} target="_blank">{postData.title}</a> <span className="subreddit">({postData.domain})</span><br />
          Submitted {Date(postData.created_utc * 1000)} by <a href={userLink} target="_blank">{postData.author}</a> to <a href={subredditLink} target="_blank">r/{postData.subreddit}</a><br />
          <a href={permalink} target="_blank">{postData.num_comments} comments</a>
        </div>
      </li>
    )
  }
});

React.render(<App />, document.getElementById('content'));
