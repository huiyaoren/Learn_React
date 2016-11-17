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
    render: function(){
        return(
            <div>
                Hello, world! I am a CommentForm.
            </div>
        )
    }
});


var CommentBox = React.createClass({
    // 设置组件 State 的初始状态
    getInitialState: function(){
        return {data: []};
    },

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

    // 获取数据
    componentDidMount: function(){
        this.loadCommentsFromServer()
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function(){
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm />
            </div>
        );
    }
});


ReactDOM.render(
    <CommentBox  url="http://localhost/test.php" pollInterval={2000} />,
    document.getElementById('content')
);
