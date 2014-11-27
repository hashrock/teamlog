var request = window.superagent;

app = new Vue({
	el:"#BlogCtrl",
	data: {
		postForm : false,
		message:""
	},
	methods: {
		update: function() {
			var searchObject = $location.search();
			var tag = searchObject.tag ? "?tag=" + searchObject.tag : "";
			request.get("/blogs/" + tag).end(function (data) {
				$scope.data = data.data;
			});

			request.get("/tags").end(function (item) {
				$scope.tags = item.data.tags;
			});
		},
		showPostForm : function () {
			$scope.postForm = !$scope.postForm;
		},
		edit : function (item) {
			$scope.postForm = true;
			$scope.message = "編集中";
			$scope.oid = item._id;
			$scope.name = item.user;
			$scope.title = item.title;
			$scope.content = item.content;
			$scope.tag = item.tag;
		},
		delete : function (id) {
			request.delete("/blogs/" + id).end(function (data) {
				if (data.data[0]) {
					update();
					$scope.oid = "";
					$scope.content = "";
					$scope.title = "";
					$scope.tag = "";
				} else {
					alert("削除出来ませんでした。" + data.data[1]);
				}
			});
		},
		sasuga : function (item) {
			if (item.sasuga) {
				item.sasuga = parseInt(item.sasuga, 10) + 1;
			} else {
				item.sasuga = 1;
			}

			request.get("/sasuga/" + item._id).end(function (data) {});
		},
		post:function () {
			var oid = $scope.oid;
			var content = $scope.content;
			var data = {
				name: $scope.name,
				content: $scope.content,
				title: $scope.title,
				tag: $scope.tag,
				sasuga: 0
			};
			if (oid === undefined || oid === null || oid === "") {
				request.post('/blogs/')
					.send(data)
					.end(function (err, res) {
						if(err){
							alert("更新エラー: " + err);
							return;
						}
						update();
						$scope.oid = "";
						$scope.content = "";
						$scope.title = "";
						$scope.tag = "";

					});
			} else {
				request.put('/blogs/' + oid)
					.send(data)
					.end(function (err, res) {
						if(err){
							alert("投稿エラー: " + err);
							return;
						}
						update();
						$scope.oid = "";
						$scope.content = "";
						$scope.title = "";
						$scope.tag = "";
					});
			}
		}
	},
	ready: function(){
		/*
		 $scope.$on('$locationChangeStart', function (next, current) {
		 update();
		 });
		 */
		this.update();
	}
});



