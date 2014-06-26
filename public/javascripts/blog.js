var teamlogApp = angular.module('teamlogApp', []);

function BlogCtrl($scope, $http) {
	$scope.postForm = false;
	$scope.message = "";

	$scope.showPostForm = function () {
		$scope.postForm = !$scope.postForm;
	}

	$scope.edit = function (item) {
		$scope.postForm = true;
		$scope.message = "編集中";
		$scope.oid = item._id;
		$scope.name = item.user;
		$scope.title = item.title;
		$scope.content = item.content;
	}
	$scope.delete = function (id) {
		$http.delete("/blogs/" + id).then(function (data) {
			if (data.data[0]) {
				update();
				$scope.oid = "";
				$scope.content = "";
				$scope.title = "";
			} else {
				alert("削除出来ませんでした。" + data.data[1]);
			}
		});
	}
	$scope.sasuga = function (item) {
		if (item.sasuga) {
			item.sasuga = parseInt(item.sasuga, 10) + 1;
		}else{
			item.sasuga = 1;
		}

		$http.get("/sasuga/" + item._id).then(function (data) {});
	}

	function update() {
		$http.get("/blogs/").then(function (data) {
			$scope.data = data.data;
		});
	}
	update();
	$scope.post = function () {
		var oid = $scope.oid;
		var content = $scope.content;
		var data = {
			name: $scope.name,
			content: $scope.content,
			title: $scope.title,
			sasuga: 0
		};
		if (oid === undefined || oid === null || oid === "") {
			$http.post('/blogs/', data)
				.success(function () {
					update();
					$scope.oid = "";
					$scope.content = "";
					$scope.title = "";
				})
				.error(function (data, status) {
					alert("更新エラー: " + status);
				});
		} else {
			$http.put('/blogs/' + oid, data)
				.success(function () {
					update();
					$scope.oid = "";
					$scope.content = "";
					$scope.title = "";
				})
				.error(function (data, status) {
					alert("投稿エラー: " + status);
				});
		}
	};
}
