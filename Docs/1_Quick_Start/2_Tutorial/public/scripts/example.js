//
// var data1 = [
//     {id: 1, author: "Pete Hunt", text: "* This is one comment."},
//     {id: 2, author: "Jordan Hunt", text: "* This is another comment."}
// ];


var Comment = React.createClass({
    rawMarkup: function(){
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },
    render: function(){
        return(
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        )
    }
});

var CommentList = React.createClass({
    render: function(){
        var commentNodes = this.props.data.map(function(comment){
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        )
    }
});

var CommentForm = React.createClass({
    getInitialState(){
        return{author: '', text: ''};
    },

    // 事件
    handleAuthorChange: function(e){
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e){
        this.setState({text: e.target.value});
    },
    handleSubmit(e){
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author){
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    },

    render: function(){
        return(
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        )
    }
});

var CommentBox = React.createClass({
    // ajax
    loadCommentsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data){
                console.log(data);
                this.setState({data: data});
                console.log(this);
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleCommentSubmit: function(comment){
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success:function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({date: comments});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
    },

    // 设置组件 State 的初始状态
    getInitialState: function(){
        return {data: []};
    },

    // 获取数据
    componentDidMount: function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function(){
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});


ReactDOM.render(
    <CommentBox  url="http://localhost/test.php" pollInterval={2000} />,
    document.getElementById('content')
);
