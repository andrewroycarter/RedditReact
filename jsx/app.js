var PostList = React.createClass({
  render: function() {
    var postNodes = this.state.posts.map(function (post) {
      return (
        <Post post={post} key={post.data.id} />
      );
    });

    return (
      <div className="row" id="posts">
        {postNodes}
      </div>
    );
  },
  getInitialState: function() {
    return {posts: []};
  },
});

var App = React.createClass({
  render: function() {

    var props = {}
    if (this.state.disableMoreButton) {
      props.disabled = 'disabled'
    };

    return (
      <div className="row">
      <PostList ref="postList"/>
      <br />
      <button {...props} className="btn btn-default" type="submit" ref="loadMoreButton" onClick={this.getPosts}>Load More</button>
      </div>
    )
  },
  getInitialState: function() {
    return {
      disableMoreButton: true
    };
  },
  getPosts: function() {
    this.setState({"disableMoreButton": true});

    oboe('http://www.reddit.com/.json?after=' + this.state.after)
    .node('children.*', function(post) {

      var postList = this.refs.postList;
      var posts = postList.state.posts;
      posts.push(post);
      postList.setState({"posts": posts});

    }.bind(this))
    .done(function(result) {

      this.setState({"after": result.data.after, "disableMoreButton": false});

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
    var createdDate = new Date(0);
    createdDate.setUTCMilliseconds(postData.created_utc * 1000);

    var thumbnailStyle = {
      display: postData.thumbnail ? 'table-cell' : 'none'
    };

    return (
      <div className="media">
        <div style={thumbnailStyle} className="media-left media-top">
          <img className="img-thumbnail img-responsive" src={postData.thumbnail} />
        </div>
        <div className="media-body">
          <h4 className="media-heading"><a href={postData.url}>{postData.title}</a> <small>({postData.domain})</small></h4>
          <p>
          Submitted {createdDate.toString()} by <a href={userLink} target="_blank">{postData.author}</a> to <a href={subredditLink} target="_blank">r/{postData.subreddit}</a><br />
          <a href={permalink} target="_blank">{postData.num_comments} comments</a>
          </p>
        </div>
      </div>
    )
  }
});

React.render(<App />, document.getElementById('content'));
